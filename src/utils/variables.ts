/**
 * Variable interpolation utilities
 */

/**
 * Interpolate variables in a string
 * Supports {{variable}} syntax
 */
export function interpolateVariables(text: string, variables: Record<string, string>): string {
  return text.replace(/\{\{(\w+)\}\}/g, (match, varName) => {
    return variables[varName] || match;
  });
}

/**
 * Extract variable names from a string
 */
export function extractVariableNames(text: string): string[] {
  const matches = text.match(/\{\{(\w+)\}\}/g) || [];
  return matches.map((match) => match.replace(/[{}]/g, ''));
}

/**
 * Check if a string contains variables
 */
export function hasVariables(text: string): boolean {
  return /\{\{\w+\}\}/.test(text);
}

/**
 * Validate variable name
 */
export function isValidVariableName(name: string): boolean {
  return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name);
}
