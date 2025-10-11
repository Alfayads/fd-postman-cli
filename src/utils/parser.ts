/**
 * Utility functions for parsing command-line arguments
 */

import * as fs from 'fs';

/**
 * Parse header strings into key-value pairs
 * Format: "Key: Value" or "Key=Value"
 */
export function parseHeaders(headers: string[] | undefined): Record<string, string> {
  if (!headers) return {};

  const parsed: Record<string, string> = {};

  headers.forEach((header) => {
    const colonIndex = header.indexOf(':');
    const equalIndex = header.indexOf('=');

    let key: string;
    let value: string;

    if (colonIndex !== -1 && (equalIndex === -1 || colonIndex < equalIndex)) {
      // Use colon as separator
      key = header.substring(0, colonIndex).trim();
      value = header.substring(colonIndex + 1).trim();
    } else if (equalIndex !== -1) {
      // Use equals as separator
      key = header.substring(0, equalIndex).trim();
      value = header.substring(equalIndex + 1).trim();
    } else {
      console.warn(`Invalid header format: ${header}`);
      return;
    }

    parsed[key] = value;
  });

  return parsed;
}

/**
 * Parse query parameter strings into key-value pairs
 * Format: "key=value"
 */
export function parseQueryParams(params: string[] | undefined): Record<string, string> {
  if (!params) return {};

  const parsed: Record<string, string> = {};

  params.forEach((param) => {
    const index = param.indexOf('=');
    if (index === -1) {
      console.warn(`Invalid query parameter format: ${param}`);
      return;
    }

    const key = param.substring(0, index).trim();
    const value = param.substring(index + 1).trim();
    parsed[key] = value;
  });

  return parsed;
}

/**
 * Parse form field strings into key-value pairs
 * Format: "key=value"
 */
export function parseFormData(fields: string[] | undefined): Record<string, string> {
  if (!fields) return {};

  const parsed: Record<string, string> = {};

  fields.forEach((field) => {
    const index = field.indexOf('=');
    if (index === -1) {
      console.warn(`Invalid form field format: ${field}`);
      return;
    }

    const key = field.substring(0, index).trim();
    const value = field.substring(index + 1).trim();
    parsed[key] = value;
  });

  return parsed;
}

/**
 * Parse request body data
 * Can be JSON string or @filepath
 */
export function parseData(data: string | undefined): unknown {
  if (!data) return undefined;

  // Check if data is a file reference
  if (data.startsWith('@')) {
    const filePath = data.substring(1);
    try {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(fileContent);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to read or parse file ${filePath}: ${error.message}`);
      }
      throw error;
    }
  }

  // Try to parse as JSON
  try {
    return JSON.parse(data);
  } catch {
    // If not valid JSON, return as string
    return data;
  }
}
