/**
 * Unit tests for parser utilities
 */

import { parseHeaders, parseQueryParams, parseFormData } from '../../../src/utils/parser';

describe('parseHeaders', () => {
  it('should parse headers with colon separator', () => {
    const result = parseHeaders(['Content-Type: application/json', 'Authorization: Bearer token']);
    expect(result).toEqual({
      'Content-Type': 'application/json',
      Authorization: 'Bearer token',
    });
  });

  it('should parse headers with equals separator', () => {
    const result = parseHeaders(['Content-Type=application/json', 'Authorization=Bearer token']);
    expect(result).toEqual({
      'Content-Type': 'application/json',
      Authorization: 'Bearer token',
    });
  });

  it('should handle empty input', () => {
    const result = parseHeaders(undefined);
    expect(result).toEqual({});
  });

  it('should trim whitespace', () => {
    const result = parseHeaders(['  Content-Type  :  application/json  ']);
    expect(result).toEqual({
      'Content-Type': 'application/json',
    });
  });
});

describe('parseQueryParams', () => {
  it('should parse query parameters', () => {
    const result = parseQueryParams(['page=1', 'limit=10', 'sort=name']);
    expect(result).toEqual({
      page: '1',
      limit: '10',
      sort: 'name',
    });
  });

  it('should handle empty input', () => {
    const result = parseQueryParams(undefined);
    expect(result).toEqual({});
  });

  it('should trim whitespace', () => {
    const result = parseQueryParams(['  page = 1  ', '  limit = 10  ']);
    expect(result).toEqual({
      page: '1',
      limit: '10',
    });
  });
});

describe('parseFormData', () => {
  it('should parse form fields', () => {
    const result = parseFormData(['name=John', 'email=john@example.com']);
    expect(result).toEqual({
      name: 'John',
      email: 'john@example.com',
    });
  });

  it('should handle empty input', () => {
    const result = parseFormData(undefined);
    expect(result).toEqual({});
  });
});

