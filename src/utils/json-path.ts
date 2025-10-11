/**
 * JSON Path extraction utility (JQ-like functionality)
 * Supports simple path syntax: data.user.name, data.items[0], etc.
 */

/**
 * Extract value from object using JSON path
 * Supports: obj.key, obj.key.nested, obj.array[0], obj.array[*]
 */
export function extractJsonPath(data: unknown, path: string): unknown {
  if (!path || path === '.') {
    return data;
  }

  // Remove leading dot if present
  const cleanPath = path.startsWith('.') ? path.slice(1) : path;
  const parts = parseJsonPath(cleanPath);

  let current: unknown = data;

  for (const part of parts) {
    if (current === null || current === undefined) {
      return undefined;
    }

    if (part.type === 'property') {
      if (typeof current === 'object' && !Array.isArray(current)) {
        current = (current as Record<string, unknown>)[part.value];
      } else {
        return undefined;
      }
    } else if (part.type === 'array') {
      if (Array.isArray(current)) {
        if (part.value === '*') {
          // Return all array elements
          return current;
        } else {
          const index = parseInt(part.value, 10);
          if (!isNaN(index)) {
            current = current[index];
          } else {
            return undefined;
          }
        }
      } else {
        return undefined;
      }
    }
  }

  return current;
}

interface PathPart {
  type: 'property' | 'array';
  value: string;
}

/**
 * Parse JSON path into parts
 * Examples:
 *   "user.name" -> [{type: 'property', value: 'user'}, {type: 'property', value: 'name'}]
 *   "items[0]" -> [{type: 'property', value: 'items'}, {type: 'array', value: '0'}]
 */
function parseJsonPath(path: string): PathPart[] {
  const parts: PathPart[] = [];
  const segments = path.split('.');

  for (const segment of segments) {
    // Check for array notation
    const arrayMatch = segment.match(/^([^[]+)\[([^\]]+)\]$/);

    if (arrayMatch && arrayMatch[1] && arrayMatch[2]) {
      // Property with array access: items[0]
      parts.push({ type: 'property', value: arrayMatch[1] });
      parts.push({ type: 'array', value: arrayMatch[2] });
    } else if (segment.includes('[')) {
      // Complex array access
      const propertyPart = segment.substring(0, segment.indexOf('['));
      if (propertyPart) {
        parts.push({ type: 'property', value: propertyPart });
      }

      const bracketPart = segment.substring(segment.indexOf('['));
      const matches = bracketPart.matchAll(/\[([^\]]+)\]/g);
      for (const match of matches) {
        if (match[1]) {
          parts.push({ type: 'array', value: match[1] });
        }
      }
    } else {
      // Simple property
      parts.push({ type: 'property', value: segment });
    }
  }

  return parts;
}

/**
 * Format extracted data for display
 */
export function formatExtractedData(data: unknown, pretty = true): string {
  if (data === null || data === undefined) {
    return '(null)';
  }

  if (typeof data === 'object') {
    return pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);
  }

  return String(data);
}
