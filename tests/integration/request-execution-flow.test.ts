/**
 * Integration tests for complete request execution flow
 * Tests the interaction between CLI, Core, and Storage layers
 */

import { RequestExecutor } from '../../src/core/request-executor';
import { EnvironmentManager } from '../../src/core/environment-manager';
import { HistoryManager } from '../../src/core/history-manager';
import { TestRunner } from '../../src/core/test-runner';
import { RequestOptions, TestAssertion } from '../../src/models';

describe('Request Execution Flow Integration', () => {
  let requestExecutor: RequestExecutor;
  let environmentManager: EnvironmentManager;
  let historyManager: HistoryManager;
  let testRunner: TestRunner;

  beforeEach(() => {
    environmentManager = new EnvironmentManager();
    historyManager = new HistoryManager();
    testRunner = new TestRunner();
    requestExecutor = new RequestExecutor(environmentManager, historyManager, testRunner);
  });

  it('should execute a simple GET request without environment', async () => {
    const requestOptions: RequestOptions = {
      method: 'GET',
      url: 'https://jsonplaceholder.typicode.com/posts/1',
      timeout: 10000,
    };

    const { response } = await requestExecutor.executeRequest(requestOptions);

    expect(response).toBeDefined();
    expect(response.status).toBe(200);
    expect(response.data).toBeDefined();
    expect(response.duration).toBeGreaterThan(0);
  }, 15000);

  it('should execute a request and run test assertions', async () => {
    const requestOptions: RequestOptions = {
      method: 'GET',
      url: 'https://jsonplaceholder.typicode.com/posts/1',
      timeout: 10000,
    };

    const tests: TestAssertion[] = [
      { name: 'Status should be 200', assertion: 'status', expected: 200 },
      { name: 'Response should have id', assertion: 'data.id', expected: 1 },
    ];

    const { response, testResults } = await requestExecutor.executeRequest(
      requestOptions,
      undefined,
      tests
    );

    expect(response.status).toBe(200);
    expect(testResults).toBeDefined();
    expect(testResults?.passed).toBe(true);
    expect(testResults?.assertions).toHaveLength(2);
    expect(testResults?.assertions[0]?.passed).toBe(true);
    expect(testResults?.assertions[1]?.passed).toBe(true);
  }, 15000);

  it('should handle failed test assertions', async () => {
    const requestOptions: RequestOptions = {
      method: 'GET',
      url: 'https://jsonplaceholder.typicode.com/posts/1',
      timeout: 10000,
    };

    const tests: TestAssertion[] = [
      { name: 'Status should be 404', assertion: 'status', expected: 404 }, // This will fail
    ];

    const { response, testResults } = await requestExecutor.executeRequest(
      requestOptions,
      undefined,
      tests
    );

    expect(response.status).toBe(200); // Actual status
    expect(testResults).toBeDefined();
    expect(testResults?.passed).toBe(false); // Test should fail
    expect(testResults?.assertions[0]?.passed).toBe(false);
    expect(testResults?.assertions[0]?.actual).toBe(200);
    expect(testResults?.assertions[0]?.expected).toBe(404);
  }, 15000);

  it('should handle network errors gracefully', async () => {
    const requestOptions: RequestOptions = {
      method: 'GET',
      url: 'https://this-domain-does-not-exist-12345.com',
      timeout: 5000,
    };

    await expect(requestExecutor.executeRequest(requestOptions)).rejects.toThrow();
  }, 10000);

  it('should execute POST request with data', async () => {
    const requestOptions: RequestOptions = {
      method: 'POST',
      url: 'https://jsonplaceholder.typicode.com/posts',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        title: 'Test Post',
        body: 'This is a test',
        userId: 1,
      },
      timeout: 10000,
    };

    const tests: TestAssertion[] = [
      { name: 'Status should be 201', assertion: 'status', expected: 201 },
    ];

    const { response, testResults } = await requestExecutor.executeRequest(
      requestOptions,
      undefined,
      tests
    );

    expect(response.status).toBe(201);
    expect(testResults?.passed).toBe(true);
  }, 15000);
});

