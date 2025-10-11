/**
 * fd-postman-cli - A powerful CLI tool for API testing
 * Main entry point for the library
 */

// Core functionality
export { makeRequest } from './core/http-client';
export { CollectionManager } from './core/collection-manager';
export { EnvironmentManager } from './core/environment-manager';
export { HistoryManager } from './core/history-manager';
export { RequestExecutor } from './core/request-executor';
export { TestRunner } from './core/test-runner';
export { VariableResolver } from './core/variable-resolver';
export { CollectionRunner } from './core/collection-runner';
export type { CollectionRunResult, RequestRunResult } from './core/collection-runner';
export { WorkflowEngine } from './core/workflow-engine';
export type { WorkflowRunResult, StepRunResult } from './core/workflow-engine';

// Storage
export * from './storage';

// Utilities
export { parseHeaders, parseQueryParams, parseFormData, parseData } from './utils/parser';
export {
  formatResponse,
  saveResponse,
  displayTestResults,
  displayFilteredResponse,
  saveHeaders,
} from './utils/formatter';
export { logger, Logger, LogLevel } from './utils/logger';
export { buildAuthConfig, applyAuth } from './utils/auth';
export { extractJsonPath, formatExtractedData } from './utils/json-path';
export * from './utils/variables';
export * from './utils/errors';
export * from './utils/paths';

// Models
export type {
  RequestOptions,
  ResponseData,
  Collection,
  CollectionRequest,
  CollectionSettings,
  Environment,
  HistoryEntry,
  TestAssertion,
  TestResult,
  Workflow,
  WorkflowStep,
  VariableExtraction,
  CommandOptions,
  AuthConfig,
  AuthType,
  BodyType,
} from './models';

export type {
  VariableScope,
  VariableSet,
  GlobalVariables,
  ActiveEnvironment,
} from './models/variables';
