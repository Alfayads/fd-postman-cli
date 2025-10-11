/**
 * Authentication utilities
 * Handles various authentication methods
 */

import { AuthConfig, CommandOptions } from '../models';

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

    default:
      throw new Error(`Unknown authentication type: ${authType}`);
  }

  return config;
}

/**
 * Apply authentication to request headers/params
 */
export function applyAuth(
  auth: AuthConfig,
  headers: Record<string, string>,
  params: Record<string, string>
): void {
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
  }
}
