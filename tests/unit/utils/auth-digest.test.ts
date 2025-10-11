/**
 * Tests for Digest Authentication
 */

import { describe, it, expect } from '@jest/globals';
import {
  parseDigestChallenge,
  calculateDigestResponse,
  buildDigestAuthHeader,
} from '../../../src/utils/auth-digest';
import { DigestAuthConfig } from '../../../src/models';

describe('Digest Authentication', () => {
  describe('parseDigestChallenge', () => {
    it('should parse WWW-Authenticate header', () => {
      const header =
        'Digest realm="testrealm@host.com", qop="auth,auth-int", nonce="dcd98b7102dd2f0e8b11d0f600bfb0c093", opaque="5ccc069c403ebaf9f0171e9517f40e41"';

      const result = parseDigestChallenge(header);

      expect(result.realm).toBe('testrealm@host.com');
      expect(result.qop).toBe('auth,auth-int');
      expect(result.nonce).toBe('dcd98b7102dd2f0e8b11d0f600bfb0c093');
      expect(result.opaque).toBe('5ccc069c403ebaf9f0171e9517f40e41');
    });

    it('should handle challenge with algorithm', () => {
      const header =
        'Digest realm="api", nonce="abc123", algorithm=MD5, qop="auth"';

      const result = parseDigestChallenge(header);

      expect(result.realm).toBe('api');
      expect(result.nonce).toBe('abc123');
      expect(result.algorithm).toBe('MD5');
      expect(result.qop).toBe('auth');
    });

    it('should handle challenge without quotes', () => {
      const header = 'Digest realm=test, nonce=123456';

      const result = parseDigestChallenge(header);

      expect(result.realm).toBe('test');
      expect(result.nonce).toBe('123456');
    });
  });

  describe('calculateDigestResponse', () => {
    it('should calculate digest response without QoP', () => {
      const config: DigestAuthConfig = {
        username: 'Mufasa',
        password: 'Circle Of Life',
        realm: 'testrealm@host.com',
        nonce: 'dcd98b7102dd2f0e8b11d0f600bfb0c093',
      };

      const response = calculateDigestResponse(config, 'GET', '/dir/index.html');

      expect(response).toBeDefined();
      expect(response).toHaveLength(32); // MD5 hash length
    });

    it('should calculate digest response with QoP', () => {
      const config: DigestAuthConfig = {
        username: 'Mufasa',
        password: 'Circle Of Life',
        realm: 'testrealm@host.com',
        nonce: 'dcd98b7102dd2f0e8b11d0f600bfb0c093',
        qop: 'auth',
      };

      const response = calculateDigestResponse(config, 'GET', '/dir/index.html');

      expect(response).toBeDefined();
      expect(response).toHaveLength(32);
    });

    it('should throw error if realm is missing', () => {
      const config: DigestAuthConfig = {
        username: 'user',
        password: 'pass',
        nonce: 'abc123',
      };

      expect(() => calculateDigestResponse(config, 'GET', '/test')).toThrow(
        'Realm and nonce are required'
      );
    });
  });

  describe('buildDigestAuthHeader', () => {
    it('should build digest auth header without QoP', () => {
      const config: DigestAuthConfig = {
        username: 'testuser',
        password: 'testpass',
        realm: 'test-realm',
        nonce: 'test-nonce-123',
      };

      const header = buildDigestAuthHeader(config, 'GET', '/api/resource');

      expect(header).toContain('Digest');
      expect(header).toContain('username="testuser"');
      expect(header).toContain('realm="test-realm"');
      expect(header).toContain('nonce="test-nonce-123"');
      expect(header).toContain('uri="/api/resource"');
      expect(header).toContain('algorithm=MD5');
      expect(header).toContain('response=');
    });

    it('should build digest auth header with QoP', () => {
      const config: DigestAuthConfig = {
        username: 'testuser',
        password: 'testpass',
        realm: 'test-realm',
        nonce: 'test-nonce-123',
        qop: 'auth',
      };

      const header = buildDigestAuthHeader(config, 'GET', '/api/resource');

      expect(header).toContain('Digest');
      expect(header).toContain('qop=auth');
      expect(header).toContain('nc=');
      expect(header).toContain('cnonce=');
    });

    it('should include opaque if provided', () => {
      const config: DigestAuthConfig = {
        username: 'testuser',
        password: 'testpass',
        realm: 'test-realm',
        nonce: 'test-nonce-123',
        opaque: 'test-opaque',
      };

      const header = buildDigestAuthHeader(config, 'GET', '/api/resource');

      expect(header).toContain('opaque="test-opaque"');
    });

    it('should throw error if realm is missing', () => {
      const config: DigestAuthConfig = {
        username: 'user',
        password: 'pass',
        nonce: 'abc123',
      };

      expect(() => buildDigestAuthHeader(config, 'GET', '/test')).toThrow(
        'Realm and nonce are required'
      );
    });
  });
});

