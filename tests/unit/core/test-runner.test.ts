/**
 * Unit tests for TestRunner
 */

import { TestRunner } from '../../../src/core/test-runner';
import { TestAssertion, ResponseData } from '../../../src/models';

describe('TestRunner', () => {
  let testRunner: TestRunner;
  let mockResponse: ResponseData;

  beforeEach(() => {
    testRunner = new TestRunner();
    mockResponse = {
      status: 200,
      statusText: 'OK',
      headers: {
        'content-type': 'application/json',
        'x-custom-header': 'test-value',
      },
      data: {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        profile: {
          age: 30,
          city: 'New York',
        },
      },
      duration: 150,
    };
  });

  describe('Status Assertions', () => {
    it('should pass when status matches', () => {
      const tests: TestAssertion[] = [
        { name: 'Status is 200', assertion: 'status', expected: 200 },
      ];

      const result = testRunner.runTests(tests, mockResponse);

      expect(result.passed).toBe(true);
      expect(result.assertions[0]?.passed).toBe(true);
      expect(result.assertions[0]?.actual).toBe(200);
    });

    it('should fail when status does not match', () => {
      const tests: TestAssertion[] = [
        { name: 'Status is 404', assertion: 'status', expected: 404 },
      ];

      const result = testRunner.runTests(tests, mockResponse);

      expect(result.passed).toBe(false);
      expect(result.assertions[0]?.passed).toBe(false);
      expect(result.assertions[0]?.actual).toBe(200);
      expect(result.assertions[0]?.expected).toBe(404);
    });
  });

  describe('Header Assertions', () => {
    it('should pass when header value matches', () => {
      const tests: TestAssertion[] = [
        {
          name: 'Content-Type is JSON',
          assertion: 'headers.content-type',
          expected: 'application/json',
        },
      ];

      const result = testRunner.runTests(tests, mockResponse);

      expect(result.passed).toBe(true);
      expect(result.assertions[0]?.passed).toBe(true);
    });

    it('should fail when header value does not match', () => {
      const tests: TestAssertion[] = [
        {
          name: 'Content-Type is XML',
          assertion: 'headers.content-type',
          expected: 'application/xml',
        },
      ];

      const result = testRunner.runTests(tests, mockResponse);

      expect(result.passed).toBe(false);
      expect(result.assertions[0]?.passed).toBe(false);
    });
  });

  describe('Data Field Assertions', () => {
    it('should pass when data field matches', () => {
      const tests: TestAssertion[] = [
        { name: 'User ID is 1', assertion: 'data.id', expected: 1 },
        { name: 'User name is John Doe', assertion: 'data.name', expected: 'John Doe' },
      ];

      const result = testRunner.runTests(tests, mockResponse);

      expect(result.passed).toBe(true);
      expect(result.assertions).toHaveLength(2);
      expect(result.assertions[0]?.passed).toBe(true);
      expect(result.assertions[1]?.passed).toBe(true);
    });

    it('should pass when nested data field matches', () => {
      const tests: TestAssertion[] = [
        { name: 'User age is 30', assertion: 'data.profile.age', expected: 30 },
        { name: 'User city is New York', assertion: 'data.profile.city', expected: 'New York' },
      ];

      const result = testRunner.runTests(tests, mockResponse);

      expect(result.passed).toBe(true);
      expect(result.assertions[0]?.passed).toBe(true);
      expect(result.assertions[1]?.passed).toBe(true);
    });

    it('should fail when data field does not match', () => {
      const tests: TestAssertion[] = [
        { name: 'User ID is 2', assertion: 'data.id', expected: 2 },
      ];

      const result = testRunner.runTests(tests, mockResponse);

      expect(result.passed).toBe(false);
      expect(result.assertions[0]?.passed).toBe(false);
      expect(result.assertions[0]?.actual).toBe(1);
    });
  });

  describe('Duration Assertions', () => {
    it('should pass when duration matches', () => {
      const tests: TestAssertion[] = [
        { name: 'Duration is 150ms', assertion: 'duration', expected: 150 },
      ];

      const result = testRunner.runTests(tests, mockResponse);

      expect(result.passed).toBe(true);
      expect(result.assertions[0]?.passed).toBe(true);
    });
  });

  describe('Multiple Assertions', () => {
    it('should handle multiple passing assertions', () => {
      const tests: TestAssertion[] = [
        { name: 'Status is 200', assertion: 'status', expected: 200 },
        { name: 'User ID is 1', assertion: 'data.id', expected: 1 },
        { name: 'Has email', assertion: 'data.email', expected: 'john@example.com' },
      ];

      const result = testRunner.runTests(tests, mockResponse);

      expect(result.passed).toBe(true);
      expect(result.assertions).toHaveLength(3);
      expect(result.assertions.every((a) => a.passed)).toBe(true);
    });

    it('should fail if any assertion fails', () => {
      const tests: TestAssertion[] = [
        { name: 'Status is 200', assertion: 'status', expected: 200 }, // Pass
        { name: 'User ID is 2', assertion: 'data.id', expected: 2 }, // Fail
        { name: 'Has email', assertion: 'data.email', expected: 'john@example.com' }, // Pass
      ];

      const result = testRunner.runTests(tests, mockResponse);

      expect(result.passed).toBe(false); // Overall result fails
      expect(result.assertions[0]?.passed).toBe(true);
      expect(result.assertions[1]?.passed).toBe(false);
      expect(result.assertions[2]?.passed).toBe(true);
    });
  });
});

