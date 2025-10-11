/**
 * AWS Signature Version 4 Authentication
 * For signing requests to AWS services (S3, DynamoDB, Lambda, etc.)
 */

import crypto from 'crypto';
import { AWSSigV4Config } from '../models';

interface SignatureParams {
  method: string;
  url: string;
  headers: Record<string, string>;
  body?: string;
  region: string;
  service: string;
}

/**
 * Generate AWS SigV4 signature
 */
export function generateAWSSigV4Signature(
  config: AWSSigV4Config,
  params: SignatureParams
): Record<string, string> {
  const { method, url, headers, body = '' } = params;
  const { accessKeyId, secretAccessKey, region, service, sessionToken } = config;
  
  // Parse URL
  const urlObj = new URL(url);
  const host = urlObj.hostname;
  const path = urlObj.pathname || '/';
  const queryString = urlObj.search.slice(1); // Remove leading '?'
  
  // Get current date/time
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
  const dateStamp = amzDate.slice(0, 8);
  
  // Prepare headers
  const signedHeaders: Record<string, string> = {
    ...headers,
    'host': host,
    'x-amz-date': amzDate,
  };
  
  // Add session token if present (for temporary credentials)
  if (sessionToken) {
    signedHeaders['x-amz-security-token'] = sessionToken;
  }
  
  // Create canonical headers
  const canonicalHeaders = Object.keys(signedHeaders)
    .sort()
    .map(key => `${key.toLowerCase()}:${signedHeaders[key].trim()}`)
    .join('\n') + '\n';
  
  const signedHeadersList = Object.keys(signedHeaders)
    .sort()
    .map(key => key.toLowerCase())
    .join(';');
  
  // Create canonical request
  const payloadHash = crypto.createHash('sha256').update(body).digest('hex');
  
  const canonicalRequest = [
    method.toUpperCase(),
    path,
    queryString,
    canonicalHeaders,
    signedHeadersList,
    payloadHash,
  ].join('\n');
  
  // Create string to sign
  const algorithm = 'AWS4-HMAC-SHA256';
  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
  const canonicalRequestHash = crypto.createHash('sha256').update(canonicalRequest).digest('hex');
  
  const stringToSign = [
    algorithm,
    amzDate,
    credentialScope,
    canonicalRequestHash,
  ].join('\n');
  
  // Calculate signature
  const kDate = hmacSha256(`AWS4${secretAccessKey}`, dateStamp);
  const kRegion = hmacSha256(kDate, region);
  const kService = hmacSha256(kRegion, service);
  const kSigning = hmacSha256(kService, 'aws4_request');
  const signature = hmacSha256(kSigning, stringToSign).toString('hex');
  
  // Create authorization header
  const authorizationHeader = [
    `${algorithm} Credential=${accessKeyId}/${credentialScope}`,
    `SignedHeaders=${signedHeadersList}`,
    `Signature=${signature}`,
  ].join(', ');
  
  // Return headers with signature
  return {
    ...signedHeaders,
    'Authorization': authorizationHeader,
    'x-amz-content-sha256': payloadHash,
  };
}

/**
 * Helper function to compute HMAC SHA256
 */
function hmacSha256(key: string | Buffer, data: string): Buffer {
  return crypto.createHmac('sha256', key).update(data).digest();
}

/**
 * Apply AWS SigV4 authentication to request
 */
export function applyAWSSigV4Auth(
  config: AWSSigV4Config,
  method: string,
  url: string,
  headers: Record<string, string>,
  body?: string
): void {
  const signedHeaders = generateAWSSigV4Signature(config, {
    method,
    url,
    headers,
    body,
    region: config.region,
    service: config.service,
  });
  
  // Merge signed headers into original headers
  Object.assign(headers, signedHeaders);
}

