/**
 * Authentication utilities
 * Handles various authentication methods including advanced flows
 */

import { AuthConfig, CommandOptions } from '../models';
import { applyOAuth2Auth, isTokenExpired, refreshAccessToken } from './auth-oauth2';
import { applyAWSSigV4Auth } from './auth-aws-sigv4';
import { applyDigestAuth } from './auth-digest';
import { applyCustomAuth } from './auth-custom';

/**
 * Build authentication configuration from CLI options
 */
export function buildAuthConfig(options: CommandOptions): AuthConfig | undefined {
  const authType = options.authType?.toLowerCase();

  if (!authType || authType === 'none') {
    return undefined;
  }

  const config: AuthConfig = {
    type: authType as AuthConfig['type'],
  };

  switch (authType) {
    case 'bearer':
      if (!options.token) {
        throw new Error('Bearer token required. Use --token flag');
      }
      config.token = options.token;
      break;

    case 'basic':
      if (!options.username || !options.password) {
        throw new Error('Username and password required for basic auth');
      }
      config.username = options.username;
      config.password = options.password;
      break;

    case 'apikey':
      if (!options.apiKey) {
        throw new Error('API key required. Use --api-key flag');
      }
      config.apiKey = options.apiKey;
      config.apiKeyName = options.apiKeyName || 'X-API-Key';
      config.apiKeyLocation = (options.apiKeyIn as 'header' | 'query') || 'header';
      break;

    case 'oauth2':
    case 'aws-sigv4':
    case 'digest':
    case 'custom':
      // These auth types require configuration from files/environments
      // They should be loaded from saved configurations
      throw new Error(`${authType} authentication requires a saved configuration. Use collections or environments to store ${authType} config.`);

    default:
      throw new Error(`Unknown authentication type: ${authType}`);
  }

  return config;
}

/**
 * Apply authentication to request headers/params
 * Supports both simple and advanced authentication methods
 */
export async function applyAuth(
  auth: AuthConfig,
  method: string,
  url: string,
  headers: Record<string, string>,
  params: Record<string, string>,
  body?: string
): Promise<void> {
  switch (auth.type) {
    case 'bearer':
      if (auth.token) {
        headers['Authorization'] = `Bearer ${auth.token}`;
      }
      break;

    case 'basic':
      if (auth.username && auth.password) {
        const credentials = Buffer.from(`${auth.username}:${auth.password}`).toString('base64');
        headers['Authorization'] = `Basic ${credentials}`;
      }
      break;

    case 'apikey':
      if (auth.apiKey && auth.apiKeyName) {
        if (auth.apiKeyLocation === 'header') {
          headers[auth.apiKeyName] = auth.apiKey;
        } else if (auth.apiKeyLocation === 'query') {
          params[auth.apiKeyName] = auth.apiKey;
        }
      }
      break;

    case 'oauth2':
      if (!auth.oauth2) {
        throw new Error('OAuth2 configuration is missing');
      }
      
      // Check if token is expired and refresh if needed
      if (isTokenExpired(auth.oauth2) && auth.oauth2.refreshToken) {
        auth.oauth2 = await refreshAccessToken(auth.oauth2);
      }
      
      applyOAuth2Auth(auth.oauth2, headers);
      break;

    case 'aws-sigv4':
      if (!auth.awsSigV4) {
        throw new Error('AWS SigV4 configuration is missing');
      }
      applyAWSSigV4Auth(auth.awsSigV4, method, url, headers, body);
      break;

    case 'digest':
      if (!auth.digest) {
        throw new Error('Digest authentication configuration is missing');
      }
      // Digest auth requires a callback to make the initial request
      // This will be handled by the HTTP client
      break;

    case 'custom':
      if (!auth.custom) {
        throw new Error('Custom authentication configuration is missing');
      }
      await applyCustomAuth(auth.custom, method, url, headers, params);
      break;
  }
}
