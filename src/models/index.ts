/**
 * Data models and type definitions for fd-postman-cli
 */

// Authentication Types
export type AuthType = 
  | 'none' 
  | 'bearer' 
  | 'basic' 
  | 'apikey'
  | 'oauth2'
  | 'aws-sigv4'
  | 'digest'
  | 'custom';

export interface OAuth2Config {
  grantType: 'authorization_code' | 'client_credentials' | 'implicit' | 'pkce';
  clientId: string;
  clientSecret?: string; // Not needed for PKCE or Implicit
  authUrl?: string; // Authorization endpoint
  tokenUrl?: string; // Token endpoint
  redirectUri?: string;
  scope?: string;
  state?: string;
  // For PKCE
  codeVerifier?: string;
  codeChallenge?: string;
  codeChallengeMethod?: 'S256' | 'plain';
  // For storing obtained tokens
  accessToken?: string;
  refreshToken?: string;
  tokenType?: string;
  expiresIn?: number;
  expiresAt?: Date;
}

export interface AWSSigV4Config {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  service: string; // e.g., 's3', 'dynamodb', 'lambda'
  sessionToken?: string; // For temporary credentials
}

export interface DigestAuthConfig {
  username: string;
  password: string;
  // These fields are populated from server's WWW-Authenticate header
  realm?: string;
  nonce?: string;
  qop?: string;
  opaque?: string;
  algorithm?: string;
}

export interface CustomAuthConfig {
  script: string; // JavaScript code to execute
  context?: Record<string, unknown>; // Variables available to the script
}

export interface AuthConfig {
  type: AuthType;
  // Basic/Bearer/API Key (existing)
  token?: string; // For Bearer Token
  username?: string; // For Basic Auth
  password?: string; // For Basic Auth
  apiKey?: string; // For API Key
  apiKeyLocation?: 'header' | 'query'; // Where to put API key
  apiKeyName?: string; // Name of the header/query param
  // Advanced auth configurations
  oauth2?: OAuth2Config;
  awsSigV4?: AWSSigV4Config;
  digest?: DigestAuthConfig;
  custom?: CustomAuthConfig;
}

// HTTP Request and Response Models
export interface RequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
  url: string;
  headers?: Record<string, string>;
  params?: Record<string, string>;
  data?: unknown;
  timeout?: number;
  auth?: AuthConfig;
  followRedirects?: boolean;
  rejectUnauthorized?: boolean; // SSL certificate validation
  maxRedirects?: number;
}

export interface ResponseData {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: unknown;
  duration: number;
}

// Collection Models
export interface Collection {
  id: string;
  name: string;
  description?: string;
  requests: CollectionRequest[];
  // Collection-level settings
  settings?: CollectionSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface CollectionSettings {
  baseUrl?: string;
  headers?: Record<string, string>; // Default headers for all requests
  auth?: AuthConfig; // Default auth for all requests
  variables?: Record<string, string>; // Collection-specific variables
  timeout?: number; // Default timeout
}

export interface CollectionRequest {
  id: string;
  name: string;
  method: RequestOptions['method'];
  url: string;
  headers?: Record<string, string>;
  params?: Record<string, string>;
  body?: unknown;
  tests?: TestAssertion[];
}

// Environment Models
export interface Environment {
  id: string;
  name: string;
  variables: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
}

// History Models
export interface HistoryEntry {
  id: string;
  request: RequestOptions;
  response: ResponseData;
  timestamp: Date;
}

// Test and Assertion Models
export interface TestAssertion {
  name: string;
  assertion: string;
  expected: unknown;
  actual?: unknown;
  passed?: boolean;
}

export interface TestResult {
  name: string;
  passed: boolean;
  assertions: TestAssertion[];
  duration: number;
}

// Workflow Models
export interface Workflow {
  name: string;
  description?: string;
  environment?: string;
  steps: WorkflowStep[];
}

export interface WorkflowStep {
  name: string;
  request: {
    method: string;
    url: string;
    headers?: Record<string, string>;
    params?: Record<string, string>;
    body?: unknown;
    tests?: TestAssertion[];
  };
  extractVariables?: VariableExtraction[];
  continueOnError?: boolean;
}

export interface VariableExtraction {
  name: string;
  path: string;
  scope: 'workflow' | 'environment' | 'global';
}

// Body Types
export type BodyType = 'json' | 'form' | 'multipart' | 'raw' | 'xml';

// CLI Command Options
export interface CommandOptions {
  header?: string[];
  query?: string[];
  data?: string;
  form?: string[];
  file?: string[]; // For multipart file uploads (format: "field=@path/to/file")
  output?: string;
  pretty?: boolean;
  timeout?: string;
  env?: string;
  collection?: string;
  save?: string;
  // Authentication options
  authType?: string;
  token?: string; // Bearer token
  username?: string; // Basic auth username
  password?: string; // Basic auth password
  apiKey?: string; // API key value
  apiKeyName?: string; // API key header/query param name
  apiKeyIn?: string; // 'header' or 'query'
  // SSL/TLS options
  insecure?: boolean; // Skip SSL certificate validation
  followRedirects?: boolean;
  maxRedirects?: string;
  // Response handling options
  raw?: boolean; // Show raw response without formatting
  filter?: string; // JSON path filter (JQ-like)
  saveHeaders?: string; // Save headers to file
  saveBody?: string; // Save body to file (alias for output)
  verbose?: boolean; // Show detailed request/response info
}
