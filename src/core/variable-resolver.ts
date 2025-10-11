/**
 * Variable Resolver with multiple scopes
 * Resolves variables from: Local > Collection > Environment > Global
 */

import { VariableScope } from '../models/variables';
import { interpolateVariables } from '../utils/variables';

export class VariableResolver {
  private scopes: Map<VariableScope, Record<string, string>> = new Map();

  /**
   * Set variables for a specific scope
   */
  setScope(scope: VariableScope, variables: Record<string, string>): void {
    this.scopes.set(scope, variables);
  }

  /**
   * Clear a specific scope
   */
  clearScope(scope: VariableScope): void {
    this.scopes.delete(scope);
  }

  /**
   * Clear all scopes
   */
  clearAll(): void {
    this.scopes.clear();
  }

  /**
   * Get merged variables with proper precedence
   * Order: Local > Collection > Environment > Global
   */
  getMergedVariables(): Record<string, string> {
    const merged: Record<string, string> = {};

    // Apply in reverse order of precedence
    const orderedScopes = [
      VariableScope.GLOBAL,
      VariableScope.ENVIRONMENT,
      VariableScope.COLLECTION,
      VariableScope.LOCAL,
    ];

    for (const scope of orderedScopes) {
      const vars = this.scopes.get(scope);
      if (vars) {
        Object.assign(merged, vars);
      }
    }

    return merged;
  }

  /**
   * Resolve a string with variables from all scopes
   */
  resolve(text: string): string {
    const merged = this.getMergedVariables();
    return interpolateVariables(text, merged);
  }

  /**
   * Resolve an object recursively
   */
  resolveObject(obj: unknown): unknown {
    const merged = this.getMergedVariables();
    return this.resolveObjectWithVars(obj, merged);
  }

  /**
   * Get a specific variable (respects precedence)
   */
  getVariable(name: string): string | undefined {
    const merged = this.getMergedVariables();
    return merged[name];
  }

  /**
   * Check if a variable exists in any scope
   */
  hasVariable(name: string): boolean {
    return this.getVariable(name) !== undefined;
  }

  /**
   * Get variables from a specific scope
   */
  getScopeVariables(scope: VariableScope): Record<string, string> {
    return this.scopes.get(scope) || {};
  }

  /**
   * Recursively resolve variables in object
   */
  private resolveObjectWithVars(obj: unknown, variables: Record<string, string>): unknown {
    if (typeof obj === 'string') {
      return interpolateVariables(obj, variables);
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => this.resolveObjectWithVars(item, variables));
    }

    if (obj && typeof obj === 'object') {
      const resolved: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(obj)) {
        const resolvedKey = interpolateVariables(key, variables);
        resolved[resolvedKey] = this.resolveObjectWithVars(value, variables);
      }
      return resolved;
    }

    return obj;
  }
}
