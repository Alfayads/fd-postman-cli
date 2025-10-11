/**
 * Tests for Custom Authentication
 */

import { describe, it, expect } from '@jest/globals';
import {
  executeCustomAuth,
  applyCustomAuth,
  validateCustomAuthScript,
} from '../../../src/utils/auth-custom';
import { CustomAuthConfig } from '../../../src/models';

describe('Custom Authentication', () => {
  describe('validateCustomAuthScript', () => {
    it('should validate valid JavaScript', () => {
      const script = `
        result.headers['X-Custom-Auth'] = 'test-value';
      `;

      const validation = validateCustomAuthScript(script);

      expect(validation.valid).toBe(true);
      expect(validation.error).toBeUndefined();
    });

    it('should detect syntax errors', () => {
      const script = `
        result.headers['X-Custom-Auth' = 'invalid';
      `;

      const validation = validateCustomAuthScript(script);

      expect(validation.valid).toBe(false);
      expect(validation.error).toBeDefined();
    });
  });

  describe('executeCustomAuth', () => {
    it('should execute simple auth script', async () => {
      const config: CustomAuthConfig = {
        script: `
          result.headers['X-API-Token'] = 'my-secret-token';
        `,
      };

      const requestContext = {
        method: 'GET',
        url: 'https://api.example.com/users',
        headers: {},
        params: {},
      };

      const result = await executeCustomAuth(config, requestContext);

      expect(result.headers).toBeDefined();
      expect(result.headers?.['X-API-Token']).toBe('my-secret-token');
    });

    it('should provide access to request context', async () => {
      const config: CustomAuthConfig = {
        script: `
          result.headers['X-Request-Method'] = request.method;
          result.headers['X-Request-URL'] = request.url;
        `,
      };

      const requestContext = {
        method: 'POST',
        url: 'https://api.example.com/data',
        headers: {},
        params: {},
      };

      const result = await executeCustomAuth(config, requestContext);

      expect(result.headers?.['X-Request-Method']).toBe('POST');
      expect(result.headers?.['X-Request-URL']).toBe('https://api.example.com/data');
    });

    it('should provide access to user context', async () => {
      const config: CustomAuthConfig = {
        script: `
          result.headers['X-API-Key'] = context.apiKey;
          result.headers['X-User-ID'] = context.userId;
        `,
        context: {
          apiKey: 'test-key-123',
          userId: 'user-456',
        },
      };

      const requestContext = {
        method: 'GET',
        url: 'https://api.example.com/users',
        headers: {},
        params: {},
      };

      const result = await executeCustomAuth(config, requestContext);

      expect(result.headers?.['X-API-Key']).toBe('test-key-123');
      expect(result.headers?.['X-User-ID']).toBe('user-456');
    });

    it('should support crypto operations', async () => {
      const config: CustomAuthConfig = {
        script: `
          const crypto = require('crypto');
          const timestamp = Date.now().toString();
          const signature = crypto
            .createHmac('sha256', 'secret-key')
            .update(timestamp)
            .digest('hex');
          
          result.headers['X-Timestamp'] = timestamp;
          result.headers['X-Signature'] = signature;
        `,
      };

      const requestContext = {
        method: 'GET',
        url: 'https://api.example.com/users',
        headers: {},
        params: {},
      };

      const result = await executeCustomAuth(config, requestContext);

      expect(result.headers?.['X-Timestamp']).toBeDefined();
      expect(result.headers?.['X-Signature']).toBeDefined();
      expect(result.headers?.['X-Signature']).toHaveLength(64); // SHA256 hex length
    });

    it('should support base64 encoding', async () => {
      const config: CustomAuthConfig = {
        script: `
          const token = btoa('username:password');
          result.headers['Authorization'] = 'Basic ' + token;
        `,
      };

      const requestContext = {
        method: 'GET',
        url: 'https://api.example.com/users',
        headers: {},
        params: {},
      };

      const result = await executeCustomAuth(config, requestContext);

      expect(result.headers?.['Authorization']).toBe('Basic dXNlcm5hbWU6cGFzc3dvcmQ=');
    });

    it('should add query parameters', async () => {
      const config: CustomAuthConfig = {
        script: `
          result.params['api_key'] = 'my-api-key';
          result.params['timestamp'] = Date.now().toString();
        `,
      };

      const requestContext = {
        method: 'GET',
        url: 'https://api.example.com/users',
        headers: {},
        params: {},
      };

      const result = await executeCustomAuth(config, requestContext);

      expect(result.params?.['api_key']).toBe('my-api-key');
      expect(result.params?.['timestamp']).toBeDefined();
    });

    it('should handle script errors gracefully', async () => {
      const config: CustomAuthConfig = {
        script: `
          throw new Error('Script error');
        `,
      };

      const requestContext = {
        method: 'GET',
        url: 'https://api.example.com/users',
        headers: {},
        params: {},
      };

      await expect(executeCustomAuth(config, requestContext)).rejects.toThrow(
        'Custom auth script failed'
      );
    });

    it('should timeout long-running scripts', async () => {
      const config: CustomAuthConfig = {
        script: `
          while(true) { /* infinite loop */ }
        `,
      };

      const requestContext = {
        method: 'GET',
        url: 'https://api.example.com/users',
        headers: {},
        params: {},
      };

      await expect(executeCustomAuth(config, requestContext)).rejects.toThrow();
    }, 10000); // Increase test timeout
  });

  describe('applyCustomAuth', () => {
    it('should apply custom auth to request', async () => {
      const config: CustomAuthConfig = {
        script: `
          result.headers['X-Custom-Header'] = 'custom-value';
          result.params['custom_param'] = 'param-value';
        `,
      };

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      const params: Record<string, string> = {
        page: '1',
      };

      await applyCustomAuth(config, 'GET', 'https://api.example.com/users', headers, params);

      expect(headers['X-Custom-Header']).toBe('custom-value');
      expect(headers['Content-Type']).toBe('application/json'); // Existing header preserved
      expect(params['custom_param']).toBe('param-value');
      expect(params['page']).toBe('1'); // Existing param preserved
    });
  });
});

