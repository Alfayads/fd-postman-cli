/**
 * Unit tests for authentication utilities
 */

import { buildAuthConfig, applyAuth } from '../../../src/utils/auth';
import { CommandOptions, AuthConfig } from '../../../src/models';

describe('Authentication Utilities', () => {
  describe('buildAuthConfig', () => {
    it('should return undefined for no auth type', () => {
      const options: CommandOptions = {};
      const config = buildAuthConfig(options);

      expect(config).toBeUndefined();
    });

    it('should return undefined for auth type "none"', () => {
      const options: CommandOptions = { authType: 'none' };
      const config = buildAuthConfig(options);

      expect(config).toBeUndefined();
    });

    it('should build bearer token config', () => {
      const options: CommandOptions = {
        authType: 'bearer',
        token: 'my-token-123',
      };
      const config = buildAuthConfig(options);

      expect(config).toEqual({
        type: 'bearer',
        token: 'my-token-123',
      });
    });

    it('should throw error for bearer without token', () => {
      const options: CommandOptions = { authType: 'bearer' };

      expect(() => buildAuthConfig(options)).toThrow('Bearer token required');
    });

    it('should build basic auth config', () => {
      const options: CommandOptions = {
        authType: 'basic',
        username: 'user123',
        password: 'pass456',
      };
      const config = buildAuthConfig(options);

      expect(config).toEqual({
        type: 'basic',
        username: 'user123',
        password: 'pass456',
      });
    });

    it('should throw error for basic auth without credentials', () => {
      const options1: CommandOptions = { authType: 'basic', username: 'user' };
      const options2: CommandOptions = { authType: 'basic', password: 'pass' };

      expect(() => buildAuthConfig(options1)).toThrow('Username and password required');
      expect(() => buildAuthConfig(options2)).toThrow('Username and password required');
    });

    it('should build API key config with defaults', () => {
      const options: CommandOptions = {
        authType: 'apikey',
        apiKey: 'my-api-key',
      };
      const config = buildAuthConfig(options);

      expect(config).toEqual({
        type: 'apikey',
        apiKey: 'my-api-key',
        apiKeyName: 'X-API-Key',
        apiKeyLocation: 'header',
      });
    });

    it('should build API key config with custom settings', () => {
      const options: CommandOptions = {
        authType: 'apikey',
        apiKey: 'my-key',
        apiKeyName: 'API-Token',
        apiKeyIn: 'query',
      };
      const config = buildAuthConfig(options);

      expect(config).toEqual({
        type: 'apikey',
        apiKey: 'my-key',
        apiKeyName: 'API-Token',
        apiKeyLocation: 'query',
      });
    });

    it('should throw error for API key without key value', () => {
      const options: CommandOptions = { authType: 'apikey' };

      expect(() => buildAuthConfig(options)).toThrow('API key required');
    });

    it('should throw error for unknown auth type', () => {
      const options: CommandOptions = { authType: 'unknown' };

      expect(() => buildAuthConfig(options)).toThrow('Unknown authentication type');
    });
  });

  describe('applyAuth', () => {
    let headers: Record<string, string>;
    let params: Record<string, string>;

    beforeEach(() => {
      headers = {};
      params = {};
    });

    it('should apply bearer token to Authorization header', () => {
      const auth: AuthConfig = {
        type: 'bearer',
        token: 'my-token-123',
      };

      applyAuth(auth, headers, params);

      expect(headers['Authorization']).toBe('Bearer my-token-123');
      expect(Object.keys(params)).toHaveLength(0);
    });

    it('should apply basic auth to Authorization header', () => {
      const auth: AuthConfig = {
        type: 'basic',
        username: 'testuser',
        password: 'testpass',
      };

      applyAuth(auth, headers, params);

      expect(headers['Authorization']).toBeDefined();
      expect(headers['Authorization']).toMatch(/^Basic /);
      // Verify it's base64 encoded
      const authHeader = headers['Authorization'];
      if (authHeader) {
        const encoded = authHeader.replace('Basic ', '');
        const decoded = Buffer.from(encoded, 'base64').toString();
        expect(decoded).toBe('testuser:testpass');
      }
    });

    it('should apply API key to header by default', () => {
      const auth: AuthConfig = {
        type: 'apikey',
        apiKey: 'my-api-key',
        apiKeyName: 'X-API-Key',
        apiKeyLocation: 'header',
      };

      applyAuth(auth, headers, params);

      expect(headers['X-API-Key']).toBe('my-api-key');
      expect(Object.keys(params)).toHaveLength(0);
    });

    it('should apply API key to query parameter', () => {
      const auth: AuthConfig = {
        type: 'apikey',
        apiKey: 'my-api-key',
        apiKeyName: 'api_key',
        apiKeyLocation: 'query',
      };

      applyAuth(auth, headers, params);

      expect(params['api_key']).toBe('my-api-key');
      expect(Object.keys(headers)).toHaveLength(0);
    });

    it('should handle none auth type (do nothing)', () => {
      const auth: AuthConfig = {
        type: 'none',
      };

      applyAuth(auth, headers, params);

      expect(Object.keys(headers)).toHaveLength(0);
      expect(Object.keys(params)).toHaveLength(0);
    });
  });
});

