/**
 * Digest Authentication (RFC 2617)
 * For HTTP Digest Access Authentication
 */

import crypto from 'crypto';
import { DigestAuthConfig } from '../models';

/**
 * Parse WWW-Authenticate header to extract digest parameters
 */
export function parseDigestChallenge(header: string): Partial<DigestAuthConfig> {
  const params: Partial<DigestAuthConfig> = {};
  
  // Remove "Digest " prefix
  const authHeader = header.replace(/^Digest\s+/i, '');
  
  // Parse key="value" pairs
  const regex = /(\w+)=["']?([^"',]+)["']?/g;
  let match;
  
  while ((match = regex.exec(authHeader)) !== null) {
    const [, key, value] = match;
    
    switch (key.toLowerCase()) {
      case 'realm':
        params.realm = value;
        break;
      case 'nonce':
        params.nonce = value;
        break;
      case 'qop':
        params.qop = value;
        break;
      case 'opaque':
        params.opaque = value;
        break;
      case 'algorithm':
        params.algorithm = value;
        break;
    }
  }
  
  return params;
}

/**
 * Generate MD5 hash
 */
function md5(data: string): string {
  return crypto.createHash('md5').update(data).digest('hex');
}

/**
 * Generate a random client nonce
 */
function generateCnonce(): string {
  return crypto.randomBytes(16).toString('hex');
}

/**
 * Calculate digest response
 */
export function calculateDigestResponse(
  config: DigestAuthConfig,
  method: string,
  uri: string,
  nonceCount: number = 1
): string {
  const { username, password, realm, nonce, qop, algorithm = 'MD5' } = config;
  
  if (!realm || !nonce) {
    throw new Error('Realm and nonce are required for digest authentication');
  }
  
  // HA1 = MD5(username:realm:password)
  const ha1 = md5(`${username}:${realm}:${password}`);
  
  // HA2 = MD5(method:uri)
  const ha2 = md5(`${method}:${uri}`);
  
  let response: string;
  
  if (qop === 'auth' || qop === 'auth-int') {
    // With QoP
    const cnonce = generateCnonce();
    const nc = nonceCount.toString(16).padStart(8, '0');
    
    // response = MD5(HA1:nonce:nc:cnonce:qop:HA2)
    response = md5(`${ha1}:${nonce}:${nc}:${cnonce}:${qop}:${ha2}`);
    
    return response;
  } else {
    // Without QoP (legacy)
    // response = MD5(HA1:nonce:HA2)
    response = md5(`${ha1}:${nonce}:${ha2}`);
    
    return response;
  }
}

/**
 * Build Digest Authorization header
 */
export function buildDigestAuthHeader(
  config: DigestAuthConfig,
  method: string,
  uri: string,
  nonceCount: number = 1
): string {
  const { username, realm, nonce, qop, opaque, algorithm = 'MD5' } = config;
  
  if (!realm || !nonce) {
    throw new Error('Realm and nonce are required. Make an initial request to get the challenge.');
  }
  
  const cnonce = generateCnonce();
  const nc = nonceCount.toString(16).padStart(8, '0');
  const response = calculateDigestResponse(config, method, uri, nonceCount);
  
  const parts = [
    `username="${username}"`,
    `realm="${realm}"`,
    `nonce="${nonce}"`,
    `uri="${uri}"`,
    `algorithm=${algorithm}`,
    `response="${response}"`,
  ];
  
  if (qop) {
    parts.push(`qop=${qop}`);
    parts.push(`nc=${nc}`);
    parts.push(`cnonce="${cnonce}"`);
  }
  
  if (opaque) {
    parts.push(`opaque="${opaque}"`);
  }
  
  return `Digest ${parts.join(', ')}`;
}

/**
 * Apply Digest authentication to request
 * Note: This requires making an initial request to get the challenge
 */
export async function applyDigestAuth(
  config: DigestAuthConfig,
  method: string,
  url: string,
  headers: Record<string, string>,
  makeRequest: (headers: Record<string, string>) => Promise<{ status: number; headers: Record<string, string> }>
): Promise<void> {
  // If we don't have realm/nonce, we need to make an initial request
  if (!config.realm || !config.nonce) {
    try {
      // Make initial request to get challenge
      const response = await makeRequest({});
      
      if (response.status === 401) {
        const wwwAuth = response.headers['www-authenticate'];
        
        if (wwwAuth && wwwAuth.toLowerCase().startsWith('digest')) {
          const challenge = parseDigestChallenge(wwwAuth);
          
          // Update config with challenge parameters
          config.realm = challenge.realm;
          config.nonce = challenge.nonce;
          config.qop = challenge.qop;
          config.opaque = challenge.opaque;
          config.algorithm = challenge.algorithm;
        } else {
          throw new Error('Server did not return a Digest challenge');
        }
      }
    } catch (error) {
      // Initial request failed, but we'll try anyway
      console.warn('Failed to obtain digest challenge:', error);
    }
  }
  
  // Parse URI from URL
  const urlObj = new URL(url);
  const uri = urlObj.pathname + urlObj.search;
  
  // Build and apply authorization header
  const authHeader = buildDigestAuthHeader(config, method, uri);
  headers['Authorization'] = authHeader;
}

