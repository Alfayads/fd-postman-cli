# Advanced Authentication Guide

fd-postman-cli supports multiple advanced authentication methods for securing your API requests. This guide covers OAuth 2.0, AWS Signature Version 4, Digest Authentication, and Custom Authentication.

## Table of Contents

- [OAuth 2.0](#oauth-20)
  - [Authorization Code Flow](#authorization-code-flow)
  - [PKCE Flow](#pkce-flow)
  - [Client Credentials Flow](#client-credentials-flow)
  - [Implicit Flow](#implicit-flow)
- [AWS Signature Version 4](#aws-signature-version-4)
- [Digest Authentication](#digest-authentication)
- [Custom Authentication](#custom-authentication)

---

## OAuth 2.0

OAuth 2.0 is the industry-standard protocol for authorization. fd-postman-cli supports all major OAuth 2.0 flows.

### Authorization Code Flow

The authorization code flow is used by web and mobile applications. It requires user interaction to grant authorization.

#### Step 1: Generate Authorization URL

```bash
fp auth oauth2-url \
  --client-id "your-client-id" \
  --auth-url "https://auth.example.com/oauth/authorize" \
  --redirect-uri "http://localhost:8080/callback" \
  --scope "read write"
```

This will output an authorization URL. Open it in your browser to grant access.

#### Step 2: Exchange Authorization Code for Token

After authorization, you'll receive an authorization code in the redirect URL. Use it to get an access token:

```bash
fp auth oauth2-token \
  --client-id "your-client-id" \
  --client-secret "your-client-secret" \
  --token-url "https://auth.example.com/oauth/token" \
  --code "authorization-code-from-redirect"
```

#### Step 3: Use the Access Token

Save the access token in your environment:

```bash
fp env set access_token "your-access-token"
```

Then use it in requests:

```bash
fp get https://api.example.com/user \
  --auth-type bearer \
  --token "{{access_token}}"
```

### PKCE Flow

PKCE (Proof Key for Code Exchange) is a more secure version of the authorization code flow, designed for mobile and native applications.

#### Generate PKCE Credentials

```bash
fp auth pkce-generate
```

This generates a code verifier and challenge. Save the code verifier for later.

#### Step 1: Generate Authorization URL with PKCE

```bash
fp auth oauth2-url \
  --client-id "your-client-id" \
  --auth-url "https://auth.example.com/oauth/authorize" \
  --pkce
```

The tool will generate the code challenge automatically and display the code verifier.

#### Step 2: Exchange Code with PKCE

```bash
fp auth oauth2-token \
  --client-id "your-client-id" \
  --token-url "https://auth.example.com/oauth/token" \
  --code "authorization-code" \
  --code-verifier "code-verifier-from-step-1"
```

### Client Credentials Flow

The client credentials flow is used for server-to-server authentication, without user interaction.

```bash
fp auth oauth2-client-credentials \
  --client-id "your-client-id" \
  --client-secret "your-client-secret" \
  --token-url "https://auth.example.com/oauth/token" \
  --scope "api.read api.write"
```

This directly returns an access token that you can use in your requests.

### Implicit Flow

The implicit flow is a simplified OAuth 2.0 flow for single-page applications. It returns the access token directly in the redirect URL (not recommended for production).

```bash
fp auth oauth2-url \
  --client-id "your-client-id" \
  --auth-url "https://auth.example.com/oauth/authorize" \
  --scope "read"
```

After authorization, extract the access token from the URL fragment.

---

## AWS Signature Version 4

AWS SigV4 is used to authenticate requests to AWS services like S3, DynamoDB, Lambda, etc.

### Configuration

To use AWS SigV4, you need to configure your AWS credentials in a collection or environment. Here's an example environment configuration:

```json
{
  "name": "aws-production",
  "variables": {
    "aws_access_key_id": "AKIAIOSFODNN7EXAMPLE",
    "aws_secret_access_key": "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
    "aws_region": "us-east-1",
    "aws_service": "s3"
  }
}
```

### Collection with AWS SigV4

```json
{
  "name": "AWS API Requests",
  "settings": {
    "auth": {
      "type": "aws-sigv4",
      "awsSigV4": {
        "accessKeyId": "{{aws_access_key_id}}",
        "secretAccessKey": "{{aws_secret_access_key}}",
        "region": "{{aws_region}}",
        "service": "{{aws_service}}"
      }
    }
  },
  "requests": [
    {
      "name": "List S3 Buckets",
      "method": "GET",
      "url": "https://s3.amazonaws.com/"
    }
  ]
}
```

### Using AWS SigV4 with Session Tokens

For temporary credentials (e.g., from AWS STS), include the session token:

```json
{
  "type": "aws-sigv4",
  "awsSigV4": {
    "accessKeyId": "temporary-access-key",
    "secretAccessKey": "temporary-secret-key",
    "sessionToken": "session-token",
    "region": "us-east-1",
    "service": "dynamodb"
  }
}
```

---

## Digest Authentication

Digest Authentication provides a more secure alternative to Basic Authentication by hashing credentials.

### Using Digest Auth in Collections

```json
{
  "name": "Digest Auth Example",
  "settings": {
    "auth": {
      "type": "digest",
      "digest": {
        "username": "your-username",
        "password": "your-password"
      }
    }
  },
  "requests": [
    {
      "name": "Get Protected Resource",
      "method": "GET",
      "url": "https://api.example.com/protected"
    }
  ]
}
```

### How Digest Auth Works

1. First request is made without authentication
2. Server responds with 401 and a challenge (realm, nonce, etc.)
3. fd-postman-cli calculates the response hash using your credentials
4. Second request includes the Authorization header with the digest
5. Server validates and grants access

---

## Custom Authentication

Custom authentication allows you to write JavaScript code to implement any authentication scheme.

### Basic Custom Auth Example

```json
{
  "name": "Custom Auth Example",
  "settings": {
    "auth": {
      "type": "custom",
      "custom": {
        "script": "const timestamp = Date.now().toString();\nconst crypto = require('crypto');\nconst signature = crypto.createHmac('sha256', 'secret-key').update(timestamp).digest('hex');\nresult.headers['X-Timestamp'] = timestamp;\nresult.headers['X-Signature'] = signature;",
        "context": {
          "apiKey": "my-api-key",
          "secretKey": "my-secret-key"
        }
      }
    }
  }
}
```

### Custom Auth Script Structure

Your custom auth script has access to:

- `request` - Request information (method, url, headers, params)
- `context` - User-defined variables
- `result` - Object to populate with headers/params
- `crypto` - Node.js crypto module
- `Buffer` - Node.js Buffer
- `btoa()` - Base64 encode
- `atob()` - Base64 decode
- `Date`, `Math` - Standard JavaScript objects

### Custom Auth Examples

#### 1. HMAC Signature

```javascript
const crypto = require('crypto');
const timestamp = Date.now().toString();
const message = request.method + request.url + timestamp;
const signature = crypto
  .createHmac('sha256', context.secretKey)
  .update(message)
  .digest('hex');

result.headers['X-Timestamp'] = timestamp;
result.headers['X-Signature'] = signature;
result.headers['X-API-Key'] = context.apiKey;
```

#### 2. JWT Generation

```javascript
const crypto = require('crypto');

const header = { alg: 'HS256', typ: 'JWT' };
const payload = {
  sub: context.userId,
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + 3600
};

const encodedHeader = btoa(JSON.stringify(header));
const encodedPayload = btoa(JSON.stringify(payload));
const signature = crypto
  .createHmac('sha256', context.secretKey)
  .update(encodedHeader + '.' + encodedPayload)
  .digest('base64url');

const jwt = `${encodedHeader}.${encodedPayload}.${signature}`;
result.headers['Authorization'] = `Bearer ${jwt}`;
```

#### 3. API Key with Request Signing

```javascript
const crypto = require('crypto');
const params = Object.entries(request.params)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([k, v]) => `${k}=${v}`)
  .join('&');

const signatureBase = request.method + '&' + request.url + '&' + params;
const signature = crypto
  .createHmac('sha256', context.apiSecret)
  .update(signatureBase)
  .digest('hex');

result.params['api_key'] = context.apiKey;
result.params['signature'] = signature;
result.params['timestamp'] = Date.now().toString();
```

#### 4. Conditional Auth Based on Environment

```javascript
if (context.environment === 'production') {
  // Use OAuth token in production
  result.headers['Authorization'] = `Bearer ${context.prodToken}`;
} else {
  // Use API key in dev/staging
  result.headers['X-API-Key'] = context.devApiKey;
}
```

### Error Handling in Custom Scripts

```javascript
try {
  // Your auth logic
  const token = context.token || '';
  if (!token) {
    throw new Error('Token is required');
  }
  result.headers['Authorization'] = `Bearer ${token}`;
} catch (error) {
  console.error('Auth error:', error.message);
  throw error;
}
```

---

## Storing Authentication in Collections vs Environments

### Collection-Level Auth

Best for auth that's specific to an API:

```bash
fp collection create my-api
# Edit collection JSON to add auth config
```

### Environment-Level Auth

Best for credentials that vary by environment (dev/staging/prod):

```bash
fp env set oauth_token "production-token"
fp env use production
```

### Request-Level Auth Override

Individual requests can override collection/environment auth:

```json
{
  "name": "Special Request",
  "method": "GET",
  "url": "https://api.example.com/special",
  "headers": {
    "Authorization": "Bearer special-token"
  }
}
```

---

## Security Best Practices

1. **Never commit credentials** - Use environment variables or `.gitignore`
2. **Use PKCE** for mobile/desktop apps instead of authorization code flow
3. **Rotate tokens** regularly and implement refresh token logic
4. **Use HTTPS** - Never send auth credentials over unencrypted connections
5. **Validate tokens** - Check expiration and refresh when needed
6. **Limit scopes** - Request only the permissions you need
7. **Store secrets securely** - Use system keychain or encrypted storage

---

## Troubleshooting

### OAuth 2.0 Issues

**Problem**: "Invalid client" error
- **Solution**: Verify your client ID and secret are correct

**Problem**: Token expired
- **Solution**: Use refresh token to get a new access token

### AWS SigV4 Issues

**Problem**: "SignatureDoesNotMatch" error
- **Solution**: Check your access key, secret key, region, and service name
- Ensure your system clock is accurate (AWS requires time sync)

### Digest Auth Issues

**Problem**: 401 even with correct credentials
- **Solution**: Server may require specific algorithm or qop values
- Check server documentation for required digest parameters

### Custom Auth Issues

**Problem**: Script timeout
- **Solution**: Optimize your script or reduce complexity
- Scripts have a 5-second timeout

**Problem**: "require is not defined"
- **Solution**: Use `require('module-name')` syntax, not ES6 imports

---

## Examples Repository

Check out our examples repository for complete working examples:

```bash
# OAuth 2.0 with GitHub API
fp collection import examples/github-oauth2.json

# AWS S3 operations
fp collection import examples/aws-s3.json

# Custom HMAC authentication
fp collection import examples/custom-hmac.json
```

---

## Need Help?

- **Documentation**: https://github.com/Alfayads/fd-postman-cli
- **Issues**: https://github.com/Alfayads/fd-postman-cli/issues
- **Discussions**: https://github.com/Alfayads/fd-postman-cli/discussions

---

**Happy API Testing! 🚀**

