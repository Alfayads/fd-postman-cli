/**
 * Integration tests for variable scopes and resolution
 */

import { VariableResolver } from '../../src/core/variable-resolver';
import { VariableScope } from '../../src/models/variables';

describe('Variable Scopes Integration', () => {
  let resolver: VariableResolver;

  beforeEach(() => {
    resolver = new VariableResolver();
  });

  it('should demonstrate complete scope precedence', () => {
    // Setup: Same variable in all scopes
    resolver.setScope(VariableScope.GLOBAL, {
      apiUrl: 'https://api.global.com',
      token: 'global-token',
      timeout: '30000',
    });

    resolver.setScope(VariableScope.ENVIRONMENT, {
      apiUrl: 'https://api.production.com',
      token: 'prod-token',
    });

    resolver.setScope(VariableScope.COLLECTION, {
      apiUrl: 'https://api.collection.com',
    });

    resolver.setScope(VariableScope.LOCAL, {
      apiUrl: 'https://api.local.com',
    });

    // Local should win (highest priority)
    expect(resolver.resolve('{{apiUrl}}')).toBe('https://api.local.com');

    // Clear local, collection should win
    resolver.clearScope(VariableScope.LOCAL);
    expect(resolver.resolve('{{apiUrl}}')).toBe('https://api.collection.com');

    // Clear collection, environment should win
    resolver.clearScope(VariableScope.COLLECTION);
    expect(resolver.resolve('{{apiUrl}}')).toBe('https://api.production.com');

    // Clear environment, global should win
    resolver.clearScope(VariableScope.ENVIRONMENT);
    expect(resolver.resolve('{{apiUrl}}')).toBe('https://api.global.com');

    // Token should come from environment (not in local or collection)
    resolver.setScope(VariableScope.ENVIRONMENT, {
      apiUrl: 'https://api.production.com',
      token: 'prod-token',
    });
    expect(resolver.resolve('{{token}}')).toBe('prod-token');

    // Timeout should come from global (not in other scopes)
    expect(resolver.resolve('{{timeout}}')).toBe('30000');
  });

  it('should resolve complex URL with multiple scopes', () => {
    resolver.setScope(VariableScope.GLOBAL, {
      protocol: 'https',
      domain: 'example.com',
    });

    resolver.setScope(VariableScope.ENVIRONMENT, {
      subdomain: 'api',
    });

    resolver.setScope(VariableScope.COLLECTION, {
      version: 'v1',
    });

    resolver.setScope(VariableScope.LOCAL, {
      endpoint: 'users',
      userId: '123',
    });

    const url = '{{protocol}}://{{subdomain}}.{{domain}}/{{version}}/{{endpoint}}/{{userId}}';
    const resolved = resolver.resolve(url);

    expect(resolved).toBe('https://api.example.com/v1/users/123');
  });

  it('should resolve request with all scopes', () => {
    // Real-world scenario
    resolver.setScope(VariableScope.GLOBAL, {
      defaultTimeout: '5000',
      userAgent: 'MyApp/1.0',
    });

    resolver.setScope(VariableScope.ENVIRONMENT, {
      apiUrl: 'https://api.production.com',
      token: 'prod-token-xyz',
    });

    resolver.setScope(VariableScope.COLLECTION, {
      endpoint: 'users',
    });

    resolver.setScope(VariableScope.LOCAL, {
      userId: '42',
    });

    const requestData = {
      url: '{{apiUrl}}/{{endpoint}}/{{userId}}',
      headers: {
        Authorization: 'Bearer {{token}}',
        'User-Agent': '{{userAgent}}',
      },
      body: {
        userId: '{{userId}}',
        timeout: '{{defaultTimeout}}',
      },
    };

    const resolved = resolver.resolveObject(requestData);

    expect(resolved).toEqual({
      url: 'https://api.production.com/users/42',
      headers: {
        Authorization: 'Bearer prod-token-xyz',
        'User-Agent': 'MyApp/1.0',
      },
      body: {
        userId: '42',
        timeout: '5000',
      },
    });
  });

  it('should handle missing variables gracefully', () => {
    resolver.setScope(VariableScope.GLOBAL, {
      known: 'value',
    });

    const text = 'Known: {{known}}, Unknown: {{unknown}}';
    const resolved = resolver.resolve(text);

    expect(resolved).toBe('Known: value, Unknown: {{unknown}}');
  });

  it('should handle empty scopes', () => {
    const text = '{{var1}} and {{var2}}';
    const resolved = resolver.resolve(text);

    expect(resolved).toBe('{{var1}} and {{var2}}');
  });
});

