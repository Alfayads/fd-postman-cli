/**
 * Input validation for CLI arguments
 */

/**
 * Validate URL format
 */
export function validateUrl(url: string): void {
  try {
    new URL(url);
  } catch {
    throw new Error(`Invalid URL: ${url}`);
  }
}

/**
 * Validate header format
 */
export function validateHeader(header: string): void {
  const colonIndex = header.indexOf(':');
  const equalIndex = header.indexOf('=');

  if (colonIndex === -1 && equalIndex === -1) {
    throw new Error(`Invalid header format: ${header}. Expected "Key: Value" or "Key=Value"`);
  }
}

/**
 * Validate query parameter format
 */
export function validateQueryParam(param: string): void {
  if (!param.includes('=')) {
    throw new Error(`Invalid query parameter format: ${param}. Expected "key=value"`);
  }
}

/**
 * Validate form field format
 */
export function validateFormField(field: string): void {
  if (!field.includes('=')) {
    throw new Error(`Invalid form field format: ${field}. Expected "key=value"`);
  }
}

/**
 * Validate timeout value
 */
export function validateTimeout(timeout: string): number {
  const value = parseInt(timeout, 10);

  if (isNaN(value) || value <= 0) {
    throw new Error(`Invalid timeout value: ${timeout}. Must be a positive number`);
  }

  return value;
}
