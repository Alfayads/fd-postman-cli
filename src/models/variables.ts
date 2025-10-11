/**
 * Variable scope and resolution models
 */

// Variable Scopes (in order of precedence, highest to lowest)
export enum VariableScope {
  LOCAL = 'local', // Request-specific (highest priority)
  COLLECTION = 'collection', // Collection-level
  ENVIRONMENT = 'environment', // Environment-level
  GLOBAL = 'global', // Global (lowest priority)
}

export interface VariableSet {
  scope: VariableScope;
  variables: Record<string, string>;
}

export interface GlobalVariables {
  variables: Record<string, string>;
  updatedAt: Date;
}

export interface ActiveEnvironment {
  name: string;
  environmentId: string;
  activatedAt: Date;
}
