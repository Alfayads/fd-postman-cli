/**
 * Tests for AWS Signature Version 4 authentication
 */

import { describe, it, expect } from '@jest/globals';
import { generateAWSSigV4Signature, applyAWSSigV4Auth } from '../../../src/utils/auth-aws-sigv4';
import { AWSSigV4Config } from '../../../src/models';

describe('AWS SigV4 Authentication', () => {
  const testConfig: AWSSigV4Config = {
    accessKeyId: 'AKIAIOSFODNN7EXAMPLE',
    secretAccessKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
    region: 'us-east-1',
    service: 's3',
  };

  describe('generateAWSSigV4Signature', () => {
    it('should generate valid AWS signature for GET request', () => {
      const params = {
        method: 'GET',
        url: 'https://s3.amazonaws.com/examplebucket',
        headers: {},
        region: 'us-east-1',
        service: 's3',
      };

      const signedHeaders = generateAWSSigV4Signature(testConfig, params);

      expect(signedHeaders['Authorization']).toBeDefined();
      expect(signedHeaders['Authorization']).toContain('AWS4-HMAC-SHA256');
      expect(signedHeaders['Authorization']).toContain('Credential=');
      expect(signedHeaders['Authorization']).toContain('SignedHeaders=');
      expect(signedHeaders['Authorization']).toContain('Signature=');
      expect(signedHeaders['x-amz-date']).toBeDefined();
      expect(signedHeaders['x-amz-content-sha256']).toBeDefined();
      expect(signedHeaders['host']).toBe('s3.amazonaws.com');
    });

    it('should generate valid AWS signature for POST request with body', () => {
      const params = {
        method: 'POST',
        url: 'https://dynamodb.us-east-1.amazonaws.com/',
        headers: {
          'Content-Type': 'application/x-amz-json-1.0',
        },
        body: JSON.stringify({ TableName: 'TestTable' }),
        region: 'us-east-1',
        service: 'dynamodb',
      };

      const signedHeaders = generateAWSSigV4Signature(testConfig, params);

      expect(signedHeaders['Authorization']).toBeDefined();
      expect(signedHeaders['Authorization']).toContain('AWS4-HMAC-SHA256');
      expect(signedHeaders['Content-Type']).toBe('application/x-amz-json-1.0');
      expect(signedHeaders['x-amz-content-sha256']).toBeDefined();
    });

    it('should include session token if provided', () => {
      const configWithToken: AWSSigV4Config = {
        ...testConfig,
        sessionToken: 'test-session-token',
      };

      const params = {
        method: 'GET',
        url: 'https://s3.amazonaws.com/examplebucket',
        headers: {},
        region: 'us-east-1',
        service: 's3',
      };

      const signedHeaders = generateAWSSigV4Signature(configWithToken, params);

      expect(signedHeaders['x-amz-security-token']).toBe('test-session-token');
    });

    it('should handle query parameters in URL', () => {
      const params = {
        method: 'GET',
        url: 'https://s3.amazonaws.com/examplebucket?prefix=photos&max-keys=50',
        headers: {},
        region: 'us-east-1',
        service: 's3',
      };

      const signedHeaders = generateAWSSigV4Signature(testConfig, params);

      expect(signedHeaders['Authorization']).toBeDefined();
    });
  });

  describe('applyAWSSigV4Auth', () => {
    it('should apply AWS SigV4 auth to headers', () => {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      applyAWSSigV4Auth(
        testConfig,
        'GET',
        'https://s3.us-east-1.amazonaws.com/examplebucket',
        headers
      );

      expect(headers['Authorization']).toBeDefined();
      expect(headers['Authorization']).toContain('AWS4-HMAC-SHA256');
      expect(headers['x-amz-date']).toBeDefined();
      expect(headers['x-amz-content-sha256']).toBeDefined();
      expect(headers['host']).toBe('s3.us-east-1.amazonaws.com');
    });
  });
});

