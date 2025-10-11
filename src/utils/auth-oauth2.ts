/**
 * OAuth 2.0 Authentication Handler
 * Supports Authorization Code, PKCE, Client Credentials, and Implicit flows
 */

import axios from 'axios';
import crypto from 'crypto';
import { OAuth2Config } from '../models';
import { logger } from './logger';

/**
 * Generate PKCE code verifier and challenge
 */
export function generatePKCE(): { codeVerifier: string; codeChallenge: string } {
  // Generate a random 43-128 character string
  const codeVerifier = crypto.randomBytes(32).toString('base64url');
  
  // Create SHA256 hash and base64url encode it
  const hash = crypto.createHash('sha256').update(codeVerifier).digest();
  const codeChallenge = hash.toString('base64url');
  
  return { codeVerifier, codeChallenge };
}

/**
 * Generate a random state parameter for CSRF protection
 */
export function generateState(): string {
  return crypto.randomBytes(16).toString('base64url');
}

/**
 * Build authorization URL for Authorization Code or Implicit flow
 */
export function buildAuthorizationUrl(config: OAuth2Config): string {
  if (!config.authUrl) {
    throw new Error('Authorization URL is required');
  }
  
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri || 'http://localhost:8080/callback',
    response_type: config.grantType === 'implicit' ? 'token' : 'code',
    state: config.state || generateState(),
  });
  
  if (config.scope) {
    params.append('scope', config.scope);
  }
  
  // Add PKCE parameters if using PKCE flow
  if (config.grantType === 'pkce') {
    if (!config.codeChallenge) {
      const pkce = generatePKCE();
      config.codeVerifier = pkce.codeVerifier;
      config.codeChallenge = pkce.codeChallenge;
    }
    params.append('code_challenge', config.codeChallenge);
    params.append('code_challenge_method', config.codeChallengeMethod || 'S256');
  }
  
  return `${config.authUrl}?${params.toString()}`;
}

/**
 * Exchange authorization code for access token
 */
export async function exchangeCodeForToken(
  config: OAuth2Config,
  authorizationCode: string
): Promise<OAuth2Config> {
  if (!config.tokenUrl) {
    throw new Error('Token URL is required');
  }
  
  const body: Record<string, string> = {
    grant_type: 'authorization_code',
    code: authorizationCode,
    client_id: config.clientId,
    redirect_uri: config.redirectUri || 'http://localhost:8080/callback',
  };
  
  // Add client secret if provided (not used in PKCE)
  if (config.clientSecret && config.grantType !== 'pkce') {
    body.client_secret = config.clientSecret;
  }
  
  // Add PKCE code verifier if using PKCE
  if (config.grantType === 'pkce' && config.codeVerifier) {
    body.code_verifier = config.codeVerifier;
  }
  
  try {
    logger.debug('Exchanging authorization code for access token...');
    
    const response = await axios.post(config.tokenUrl, body, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    
    const tokenData = response.data;
    
    // Update config with token information
    config.accessToken = tokenData.access_token;
    config.refreshToken = tokenData.refresh_token;
    config.tokenType = tokenData.token_type || 'Bearer';
    config.expiresIn = tokenData.expires_in;
    
    if (tokenData.expires_in) {
      config.expiresAt = new Date(Date.now() + tokenData.expires_in * 1000);
    }
    
    logger.success('Successfully obtained access token');
    
    return config;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Token exchange failed: ${error.response?.data?.error_description || error.message}`);
    }
    throw error;
  }
}

/**
 * Obtain access token using Client Credentials flow
 */
export async function getClientCredentialsToken(config: OAuth2Config): Promise<OAuth2Config> {
  if (!config.tokenUrl) {
    throw new Error('Token URL is required for client credentials flow');
  }
  
  if (!config.clientSecret) {
    throw new Error('Client secret is required for client credentials flow');
  }
  
  const body: Record<string, string> = {
    grant_type: 'client_credentials',
    client_id: config.clientId,
    client_secret: config.clientSecret,
  };
  
  if (config.scope) {
    body.scope = config.scope;
  }
  
  try {
    logger.debug('Requesting access token using client credentials...');
    
    const response = await axios.post(config.tokenUrl, body, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    
    const tokenData = response.data;
    
    config.accessToken = tokenData.access_token;
    config.tokenType = tokenData.token_type || 'Bearer';
    config.expiresIn = tokenData.expires_in;
    
    if (tokenData.expires_in) {
      config.expiresAt = new Date(Date.now() + tokenData.expires_in * 1000);
    }
    
    logger.success('Successfully obtained access token');
    
    return config;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Client credentials request failed: ${error.response?.data?.error_description || error.message}`);
    }
    throw error;
  }
}

/**
 * Refresh an expired access token
 */
export async function refreshAccessToken(config: OAuth2Config): Promise<OAuth2Config> {
  if (!config.tokenUrl) {
    throw new Error('Token URL is required');
  }
  
  if (!config.refreshToken) {
    throw new Error('Refresh token is required');
  }
  
  const body: Record<string, string> = {
    grant_type: 'refresh_token',
    refresh_token: config.refreshToken,
    client_id: config.clientId,
  };
  
  if (config.clientSecret) {
    body.client_secret = config.clientSecret;
  }
  
  try {
    logger.debug('Refreshing access token...');
    
    const response = await axios.post(config.tokenUrl, body, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    
    const tokenData = response.data;
    
    config.accessToken = tokenData.access_token;
    config.tokenType = tokenData.token_type || 'Bearer';
    config.expiresIn = tokenData.expires_in;
    
    if (tokenData.refresh_token) {
      config.refreshToken = tokenData.refresh_token;
    }
    
    if (tokenData.expires_in) {
      config.expiresAt = new Date(Date.now() + tokenData.expires_in * 1000);
    }
    
    logger.success('Successfully refreshed access token');
    
    return config;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Token refresh failed: ${error.response?.data?.error_description || error.message}`);
    }
    throw error;
  }
}

/**
 * Check if access token is expired
 */
export function isTokenExpired(config: OAuth2Config): boolean {
  if (!config.expiresAt) {
    return false; // No expiry information
  }
  
  // Add 60 second buffer before actual expiry
  return new Date().getTime() > (config.expiresAt.getTime() - 60000);
}

/**
 * Apply OAuth 2.0 authentication to request headers
 */
export function applyOAuth2Auth(
  config: OAuth2Config,
  headers: Record<string, string>
): void {
  if (!config.accessToken) {
    throw new Error('No access token available. Please authenticate first.');
  }
  
  const tokenType = config.tokenType || 'Bearer';
  headers['Authorization'] = `${tokenType} ${config.accessToken}`;
}

