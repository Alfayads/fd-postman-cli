/**
 * Unit tests for HTTP client
 */

import { makeRequest } from '../../../src/core/http-client';
import { RequestOptions } from '../../../src/models';

describe('makeRequest', () => {
  it('should make a successful GET request', async () => {
    const options: RequestOptions = {
      method: 'GET',
      url: 'https://jsonplaceholder.typicode.com/posts/1',
    };

    const response = await makeRequest(options);

    expect(response.status).toBe(200);
    expect(response.data).toBeDefined();
    expect(response.duration).toBeGreaterThan(0);
  }, 10000);

  it('should handle 404 errors gracefully', async () => {
    const options: RequestOptions = {
      method: 'GET',
      url: 'https://jsonplaceholder.typicode.com/posts/999999',
    };

    const response = await makeRequest(options);

    expect(response.status).toBe(404);
    expect(response.duration).toBeGreaterThan(0);
  }, 10000);

  it('should include custom headers', async () => {
    const options: RequestOptions = {
      method: 'GET',
      url: 'https://jsonplaceholder.typicode.com/posts/1',
      headers: {
        'X-Custom-Header': 'test-value',
      },
    };

    const response = await makeRequest(options);

    expect(response.status).toBe(200);
    expect(response.data).toBeDefined();
  }, 10000);
});

