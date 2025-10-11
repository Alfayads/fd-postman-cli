/**
 * Custom Authentication Handler
 * Allows users to define custom authentication logic using JavaScript
 */

import { CustomAuthConfig } from '../models';
import { logger } from './logger';
import vm from 'vm';

/**
 * Execute custom authentication script
 * The script should return an object with headers and/or params to add
 */
export async function executeCustomAuth(
  config: CustomAuthConfig,
  requestContext: {
    method: string;
    url: string;
    headers: Record<string, string>;
    params: Record<string, string>;
  }
): Promise<{
  headers?: Record<string, string>;
  params?: Record<string, string>;
}> {
  try {
    // Create a sandbox context for the script
    const sandbox = {
      // Request information
      request: {
        method: requestContext.method,
        url: requestContext.url,
        headers: { ...requestContext.headers },
        params: { ...requestContext.params },
      },
      // User-provided context variables
      context: config.context || {},
      // Utility functions
      Buffer,
      crypto: require('crypto'),
      btoa: (str: string) => Buffer.from(str).toString('base64'),
      atob: (str: string) => Buffer.from(str, 'base64').toString('utf-8'),
      // Console for debugging
      console: {
        log: (...args: unknown[]) => logger.debug('[Custom Auth]', ...args),
        warn: (...args: unknown[]) => logger.warn('[Custom Auth]', ...args),
        error: (...args: unknown[]) => logger.error('[Custom Auth]', ...args),
      },
      // Date utilities
      Date,
      Math,
      // Result object to be populated by the script
      result: {
        headers: {} as Record<string, string>,
        params: {} as Record<string, string>,
      },
    };
    
    // Create VM context
    const context = vm.createContext(sandbox);
    
    // Wrap the user's script to ensure it populates the result object
    const wrappedScript = `
      (function() {
        ${config.script}
      })();
      result;
    `;
    
    // Execute the script with timeout
    const script = new vm.Script(wrappedScript);
    const result = script.runInContext(context, {
      timeout: 5000, // 5 second timeout
      displayErrors: true,
    });
    
    logger.debug('Custom auth script executed successfully');
    
    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Custom auth script failed: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Apply custom authentication to request
 */
export async function applyCustomAuth(
  config: CustomAuthConfig,
  method: string,
  url: string,
  headers: Record<string, string>,
  params: Record<string, string>
): Promise<void> {
  const result = await executeCustomAuth(config, {
    method,
    url,
    headers,
    params,
  });
  
  // Merge custom headers
  if (result.headers) {
    Object.assign(headers, result.headers);
  }
  
  // Merge custom params
  if (result.params) {
    Object.assign(params, result.params);
  }
}

/**
 * Validate custom auth script
 * Performs basic syntax checking
 */
export function validateCustomAuthScript(script: string): { valid: boolean; error?: string } {
  try {
    // Try to compile the script
    new vm.Script(script);
    return { valid: true };
  } catch (error) {
    if (error instanceof Error) {
      return { valid: false, error: error.message };
    }
    return { valid: false, error: 'Unknown error' };
  }
}

