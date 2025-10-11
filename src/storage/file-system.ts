/**
 * Abstract layer for file system operations
 * Handles all interactions with the file system
 */

import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

export class FileSystem {
  private readonly baseDir: string;

  constructor(baseDir?: string) {
    // Default to ~/.fd-postman-cli
    this.baseDir = baseDir || path.join(os.homedir(), '.fd-postman-cli');
    this.ensureBaseDir();
  }

  /**
   * Get the base directory path
   */
  getBaseDir(): string {
    return this.baseDir;
  }

  /**
   * Ensure base directory exists
   */
  private ensureBaseDir(): void {
    if (!fs.existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir, { recursive: true });
    }
  }

  /**
   * Ensure a directory exists
   */
  ensureDir(dirPath: string): void {
    const fullPath = path.join(this.baseDir, dirPath);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
  }

  /**
   * Read a JSON file
   */
  readJson<T>(filePath: string): T | null {
    try {
      const fullPath = path.join(this.baseDir, filePath);
      if (!fs.existsSync(fullPath)) {
        return null;
      }
      const content = fs.readFileSync(fullPath, 'utf-8');
      return JSON.parse(content) as T;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to read ${filePath}: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Write a JSON file
   */
  writeJson<T>(filePath: string, data: T): void {
    try {
      const fullPath = path.join(this.baseDir, filePath);
      const dirPath = path.dirname(fullPath);

      // Ensure directory exists
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }

      const content = JSON.stringify(data, null, 2);
      fs.writeFileSync(fullPath, content, 'utf-8');
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to write ${filePath}: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Delete a file
   */
  deleteFile(filePath: string): void {
    try {
      const fullPath = path.join(this.baseDir, filePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to delete ${filePath}: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Check if a file exists
   */
  exists(filePath: string): boolean {
    const fullPath = path.join(this.baseDir, filePath);
    return fs.existsSync(fullPath);
  }

  /**
   * List files in a directory
   */
  listFiles(dirPath: string): string[] {
    try {
      const fullPath = path.join(this.baseDir, dirPath);
      if (!fs.existsSync(fullPath)) {
        return [];
      }
      return fs.readdirSync(fullPath);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to list files in ${dirPath}: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Read a text file
   */
  readText(filePath: string): string | null {
    try {
      const fullPath = path.join(this.baseDir, filePath);
      if (!fs.existsSync(fullPath)) {
        return null;
      }
      return fs.readFileSync(fullPath, 'utf-8');
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to read ${filePath}: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Write a text file
   */
  writeText(filePath: string, content: string): void {
    try {
      const fullPath = path.join(this.baseDir, filePath);
      const dirPath = path.dirname(fullPath);

      // Ensure directory exists
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }

      fs.writeFileSync(fullPath, content, 'utf-8');
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to write ${filePath}: ${error.message}`);
      }
      throw error;
    }
  }
}
