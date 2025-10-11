/**
 * Unit tests for JSON path extraction
 */

import { extractJsonPath, formatExtractedData } from '../../../src/utils/json-path';

describe('JSON Path Extraction', () => {
  const testData = {
    name: 'John Doe',
    age: 30,
    email: 'john@example.com',
    address: {
      street: '123 Main St',
      city: 'New York',
      country: 'USA',
    },
    hobbies: ['reading', 'coding', 'travel'],
    projects: [
      { name: 'Project A', status: 'active' },
      { name: 'Project B', status: 'completed' },
    ],
  };

  describe('Simple Property Access', () => {
    it('should extract top-level property', () => {
      expect(extractJsonPath(testData, 'name')).toBe('John Doe');
      expect(extractJsonPath(testData, 'age')).toBe(30);
      expect(extractJsonPath(testData, 'email')).toBe('john@example.com');
    });

    it('should return undefined for non-existent property', () => {
      expect(extractJsonPath(testData, 'nonexistent')).toBeUndefined();
    });
  });

  describe('Nested Property Access', () => {
    it('should extract nested properties', () => {
      expect(extractJsonPath(testData, 'address.street')).toBe('123 Main St');
      expect(extractJsonPath(testData, 'address.city')).toBe('New York');
      expect(extractJsonPath(testData, 'address.country')).toBe('USA');
    });

    it('should return undefined for non-existent nested property', () => {
      expect(extractJsonPath(testData, 'address.zipcode')).toBeUndefined();
      expect(extractJsonPath(testData, 'foo.bar.baz')).toBeUndefined();
    });
  });

  describe('Array Access', () => {
    it('should extract array element by index', () => {
      expect(extractJsonPath(testData, 'hobbies[0]')).toBe('reading');
      expect(extractJsonPath(testData, 'hobbies[1]')).toBe('coding');
      expect(extractJsonPath(testData, 'hobbies[2]')).toBe('travel');
    });

    it('should return undefined for out-of-bounds index', () => {
      expect(extractJsonPath(testData, 'hobbies[10]')).toBeUndefined();
    });

    it('should return entire array with asterisk', () => {
      const result = extractJsonPath(testData, 'hobbies[*]');
      expect(result).toEqual(['reading', 'coding', 'travel']);
    });
  });

  describe('Complex Path Access', () => {
    it('should extract nested object in array', () => {
      expect(extractJsonPath(testData, 'projects[0].name')).toBe('Project A');
      expect(extractJsonPath(testData, 'projects[0].status')).toBe('active');
      expect(extractJsonPath(testData, 'projects[1].name')).toBe('Project B');
      expect(extractJsonPath(testData, 'projects[1].status')).toBe('completed');
    });

    it('should handle entire object extraction', () => {
      const result = extractJsonPath(testData, 'address');
      expect(result).toEqual({
        street: '123 Main St',
        city: 'New York',
        country: 'USA',
      });
    });
  });

  describe('Edge Cases', () => {
    it('should return entire data for root path', () => {
      expect(extractJsonPath(testData, '.')).toBe(testData);
      expect(extractJsonPath(testData, '')).toBe(testData);
    });

    it('should handle null/undefined gracefully', () => {
      expect(extractJsonPath(null, 'name')).toBeUndefined();
      expect(extractJsonPath(undefined, 'name')).toBeUndefined();
    });

    it('should handle primitive values', () => {
      expect(extractJsonPath('string', 'property')).toBeUndefined();
      expect(extractJsonPath(123, 'property')).toBeUndefined();
    });
  });

  describe('Format Extracted Data', () => {
    it('should format object as JSON', () => {
      const obj = { key: 'value' };
      expect(formatExtractedData(obj, false)).toBe('{"key":"value"}');
      expect(formatExtractedData(obj, true)).toContain('key');
    });

    it('should format primitives as strings', () => {
      expect(formatExtractedData('text', true)).toBe('text');
      expect(formatExtractedData(123, true)).toBe('123');
      expect(formatExtractedData(true, true)).toBe('true');
    });

    it('should handle null/undefined', () => {
      expect(formatExtractedData(null, true)).toBe('(null)');
      expect(formatExtractedData(undefined, true)).toBe('(null)');
    });
  });
});

