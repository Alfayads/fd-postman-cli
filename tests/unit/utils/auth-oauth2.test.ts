/**
 * Tests for OAuth 2.0 authentication utilities
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import axios from 'axios';
import {
  generatePKCE,
  generateState,
  buildAuthorizationUrl,
  exchangeCodeForToken,
  getClientCredentialsToken,
  refreshAccessToken,
  isTokenExpired,
  applyOAuth2Auth,
} from '../../../src/utils/auth-oauth2';
import { OAuth2Config } from '../../../src/models';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('OAuth2 Authentication', () => {
  describe('generatePKCE', () => {
    it('should generate code verifier and challenge', () => {
      const { codeVerifier, codeChallenge } = generatePKCE();

      expect(codeVerifier).toBeDefined();
      expect(codeChallenge).toBeDefined();
      expect(codeVerifier.length).toBeGreaterThan(0);
      expect(codeChallenge.length).toBeGreaterThan(0);
      expect(codeVerifier).not.toBe(codeChallenge);
    });

    it('should generate different values each time', () => {
      const first = generatePKCE();
      const second = generatePKCE();

      expect(first.codeVerifier).not.toBe(second.codeVerifier);
      expect(first.codeChallenge).not.toBe(second.codeChallenge);
    });
  });

  describe('generateState', () => {
    it('should generate a random state string', () => {
      const state = generateState();

      expect(state).toBeDefined();
      expect(state.length).toBeGreaterThan(0);
    });

    it('should generate different values each time', () => {
      const first = generateState();
      const second = generateState();

      expect(first).not.toBe(second);
    });
  });

  describe('buildAuthorizationUrl', () => {
    it('should build authorization URL for authorization code flow', () => {
      const config: OAuth2Config = {
        grantType: 'authorization_code',
        clientId: 'test-client-id',
        authUrl: 'https://auth.example.com/authorize',
        redirectUri: 'http://localhost:8080/callback',
        scope: 'read write',
      };

      const url = buildAuthorizationUrl(config);

      expect(url).toContain('https://auth.example.com/authorize');
      expect(url).toContain('client_id=test-client-id');
      expect(url).toContain('response_type=code');
      expect(url).toContain('redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fcallback');
      expect(url).toContain('scope=read+write');
    });

    it('should build authorization URL for PKCE flow', () => {
      const config: OAuth2Config = {
        grantType: 'pkce',
        clientId: 'test-client-id',
        authUrl: 'https://auth.example.com/authorize',
        redirectUri: 'http://localhost:8080/callback',
      };

      const url = buildAuthorizationUrl(config);

      expect(url).toContain('https://auth.example.com/authorize');
      expect(url).toContain('client_id=test-client-id');
      expect(url).toContain('response_type=code');
      expect(url).toContain('code_challenge=');
      expect(url).toContain('code_challenge_method=S256');
      expect(config.codeVerifier).toBeDefined();
      expect(config.codeChallenge).toBeDefined();
    });

    it('should build authorization URL for implicit flow', () => {
      const config: OAuth2Config = {
        grantType: 'implicit',
        clientId: 'test-client-id',
        authUrl: 'https://auth.example.com/authorize',
      };

      const url = buildAuthorizationUrl(config);

      expect(url).toContain('response_type=token');
    });

    it('should throw error if auth URL is missing', () => {
      const config: OAuth2Config = {
        grantType: 'authorization_code',
        clientId: 'test-client-id',
      };

      expect(() => buildAuthorizationUrl(config)).toThrow('Authorization URL is required');
    });
  });

  describe('exchangeCodeForToken', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should exchange authorization code for access token', async () => {
      const config: OAuth2Config = {
        grantType: 'authorization_code',
        clientId: 'test-client-id',
        clientSecret: 'test-client-secret',
        tokenUrl: 'https://auth.example.com/token',
      };

      const mockResponse = {
        data: {
          access_token: 'test-access-token',
          refresh_token: 'test-refresh-token',
          token_type: 'Bearer',
          expires_in: 3600,
        },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await exchangeCodeForToken(config, 'auth-code-123');

      expect(result.accessToken).toBe('test-access-token');
      expect(result.refreshToken).toBe('test-refresh-token');
      expect(result.tokenType).toBe('Bearer');
      expect(result.expiresIn).toBe(3600);
      expect(result.expiresAt).toBeInstanceOf(Date);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://auth.example.com/token',
        expect.objectContaining({
          grant_type: 'authorization_code',
          code: 'auth-code-123',
          client_id: 'test-client-id',
          client_secret: 'test-client-secret',
        }),
        expect.any(Object)
      );
    });

    it('should handle PKCE flow without client secret', async () => {
      const config: OAuth2Config = {
        grantType: 'pkce',
        clientId: 'test-client-id',
        tokenUrl: 'https://auth.example.com/token',
        codeVerifier: 'test-code-verifier',
      };

      const mockResponse = {
        data: {
          access_token: 'test-access-token',
          token_type: 'Bearer',
        },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      await exchangeCodeForToken(config, 'auth-code-123');

      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://auth.example.com/token',
        expect.objectContaining({
          code_verifier: 'test-code-verifier',
        }),
        expect.any(Object)
      );
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://auth.example.com/token',
        expect.not.objectContaining({
          client_secret: expect.anything(),
        }),
        expect.any(Object)
      );
    });
  });

  describe('getClientCredentialsToken', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should get access token using client credentials', async () => {
      const config: OAuth2Config = {
        grantType: 'client_credentials',
        clientId: 'test-client-id',
        clientSecret: 'test-client-secret',
        tokenUrl: 'https://auth.example.com/token',
        scope: 'api.read api.write',
      };

      const mockResponse = {
        data: {
          access_token: 'test-access-token',
          token_type: 'Bearer',
          expires_in: 7200,
        },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await getClientCredentialsToken(config);

      expect(result.accessToken).toBe('test-access-token');
      expect(result.tokenType).toBe('Bearer');
      expect(result.expiresIn).toBe(7200);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://auth.example.com/token',
        expect.objectContaining({
          grant_type: 'client_credentials',
          client_id: 'test-client-id',
          client_secret: 'test-client-secret',
          scope: 'api.read api.write',
        }),
        expect.any(Object)
      );
    });

    it('should throw error if client secret is missing', async () => {
      const config: OAuth2Config = {
        grantType: 'client_credentials',
        clientId: 'test-client-id',
        tokenUrl: 'https://auth.example.com/token',
      };

      await expect(getClientCredentialsToken(config)).rejects.toThrow(
        'Client secret is required'
      );
    });
  });

  describe('refreshAccessToken', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should refresh access token', async () => {
      const config: OAuth2Config = {
        grantType: 'authorization_code',
        clientId: 'test-client-id',
        clientSecret: 'test-client-secret',
        tokenUrl: 'https://auth.example.com/token',
        refreshToken: 'test-refresh-token',
      };

      const mockResponse = {
        data: {
          access_token: 'new-access-token',
          refresh_token: 'new-refresh-token',
          token_type: 'Bearer',
          expires_in: 3600,
        },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await refreshAccessToken(config);

      expect(result.accessToken).toBe('new-access-token');
      expect(result.refreshToken).toBe('new-refresh-token');
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://auth.example.com/token',
        expect.objectContaining({
          grant_type: 'refresh_token',
          refresh_token: 'test-refresh-token',
        }),
        expect.any(Object)
      );
    });
  });

  describe('isTokenExpired', () => {
    it('should return false if no expiry information', () => {
      const config: OAuth2Config = {
        grantType: 'authorization_code',
        clientId: 'test-client-id',
        accessToken: 'test-token',
      };

      expect(isTokenExpired(config)).toBe(false);
    });

    it('should return false if token is not expired', () => {
      const config: OAuth2Config = {
        grantType: 'authorization_code',
        clientId: 'test-client-id',
        accessToken: 'test-token',
        expiresAt: new Date(Date.now() + 3600000), // 1 hour from now
      };

      expect(isTokenExpired(config)).toBe(false);
    });

    it('should return true if token is expired', () => {
      const config: OAuth2Config = {
        grantType: 'authorization_code',
        clientId: 'test-client-id',
        accessToken: 'test-token',
        expiresAt: new Date(Date.now() - 3600000), // 1 hour ago
      };

      expect(isTokenExpired(config)).toBe(true);
    });
  });

  describe('applyOAuth2Auth', () => {
    it('should apply OAuth2 token to headers', () => {
      const config: OAuth2Config = {
        grantType: 'authorization_code',
        clientId: 'test-client-id',
        accessToken: 'test-access-token',
        tokenType: 'Bearer',
      };

      const headers: Record<string, string> = {};

      applyOAuth2Auth(config, headers);

      expect(headers['Authorization']).toBe('Bearer test-access-token');
    });

    it('should throw error if no access token', () => {
      const config: OAuth2Config = {
        grantType: 'authorization_code',
        clientId: 'test-client-id',
      };

      const headers: Record<string, string> = {};

      expect(() => applyOAuth2Auth(config, headers)).toThrow('No access token available');
    });
  });
});

