/**
 * Test Runner - Executes test assertions against API responses
 */

import { TestAssertion, TestResult, ResponseData } from '../models';
import { logger } from '../utils/logger';

export class TestRunner {
  /**
   * Run test assertions against a response
   */
  runTests(tests: TestAssertion[], response: ResponseData): TestResult {
    const startTime = Date.now();
    const assertions: TestAssertion[] = [];
    let allPassed = true;

    for (const test of tests) {
      const result = this.executeAssertion(test, response);
      assertions.push(result);
      if (!result.passed) {
        allPassed = false;
      }
    }

    const duration = Date.now() - startTime;

    return {
      name: 'API Tests',
      passed: allPassed,
      assertions,
      duration,
    };
  }

  /**
   * Execute a single assertion
   */
  private executeAssertion(test: TestAssertion, response: ResponseData): TestAssertion {
    try {
      const actual = this.extractValue(test.assertion, response);
      const passed = this.compareValues(actual, test.expected);

      logger.debug('Test assertion', {
        name: test.name,
        passed,
        expected: test.expected,
        actual,
      });

      return {
        ...test,
        actual,
        passed,
      };
    } catch (error) {
      logger.warn('Test assertion failed with error', { name: test.name, error });
      return {
        ...test,
        actual: error instanceof Error ? error.message : 'Unknown error',
        passed: false,
      };
    }
  }

  /**
   * Extract value from response based on assertion path
   * Supports: status, statusText, headers.*, data.*
   */
  private extractValue(path: string, response: ResponseData): unknown {
    const parts = path.split('.');

    if (parts[0] === 'status') {
      return response.status;
    }

    if (parts[0] === 'statusText') {
      return response.statusText;
    }

    if (parts[0] === 'headers' && parts.length > 1 && parts[1]) {
      return response.headers[parts[1]];
    }

    if (parts[0] === 'data') {
      let value: unknown = response.data;
      for (let i = 1; i < parts.length; i++) {
        const part = parts[i];
        if (part && value && typeof value === 'object') {
          value = (value as Record<string, unknown>)[part];
        } else {
          return undefined;
        }
      }
      return value;
    }

    if (parts[0] === 'duration') {
      return response.duration;
    }

    return undefined;
  }

  /**
   * Compare actual and expected values
   */
  private compareValues(actual: unknown, expected: unknown): boolean {
    // Handle null/undefined
    if (actual === null || actual === undefined) {
      return actual === expected;
    }

    // Handle arrays
    if (Array.isArray(expected)) {
      if (!Array.isArray(actual)) return false;
      if (actual.length !== expected.length) return false;
      return expected.every((val, idx) => this.compareValues(actual[idx], val));
    }

    // Handle objects
    if (typeof expected === 'object' && expected !== null) {
      if (typeof actual !== 'object' || actual === null) return false;
      const expectedObj = expected as Record<string, unknown>;
      const actualObj = actual as Record<string, unknown>;
      return Object.keys(expectedObj).every((key) =>
        this.compareValues(actualObj[key], expectedObj[key])
      );
    }

    // Handle primitives
    return actual === expected;
  }
}
