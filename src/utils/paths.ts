/**
 * File path management utilities
 */

import * as path from 'path';
import * as os from 'os';

/**
 * Get the application data directory
 */
export function getAppDataDir(): string {
  return path.join(os.homedir(), '.fd-postman-cli');
}

/**
 * Get collections directory
 */
export function getCollectionsDir(): string {
  return path.join(getAppDataDir(), 'collections');
}

/**
 * Get environments directory
 */
export function getEnvironmentsDir(): string {
  return path.join(getAppDataDir(), 'environments');
}

/**
 * Get history file path
 */
export function getHistoryFilePath(): string {
  return path.join(getAppDataDir(), 'history.json');
}

/**
 * Resolve a file path (handles ~ and relative paths)
 */
export function resolvePath(filePath: string): string {
  if (filePath.startsWith('~')) {
    return path.join(os.homedir(), filePath.slice(1));
  }
  return path.resolve(filePath);
}

/**
 * Get file extension
 */
export function getFileExtension(filePath: string): string {
  return path.extname(filePath).toLowerCase();
}

/**
 * Check if path is absolute
 */
export function isAbsolutePath(filePath: string): boolean {
  return path.isAbsolute(filePath);
}
