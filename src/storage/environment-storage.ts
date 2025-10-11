/**
 * Storage module for environments
 */

import { Environment } from '../models';
import { FileSystem } from './file-system';

export class EnvironmentStorage {
  private readonly fs: FileSystem;
  private readonly environmentsDir = 'environments';

  constructor(fs: FileSystem) {
    this.fs = fs;
    this.fs.ensureDir(this.environmentsDir);
  }

  /**
   * Save an environment
   */
  async save(environment: Environment): Promise<void> {
    const filePath = `${this.environmentsDir}/${environment.id}.json`;
    this.fs.writeJson(filePath, environment);
  }

  /**
   * Get an environment by ID
   */
  async getById(id: string): Promise<Environment | null> {
    const filePath = `${this.environmentsDir}/${id}.json`;
    const environment = this.fs.readJson<Environment>(filePath);
    if (environment) {
      return this.deserialize(environment);
    }
    return null;
  }

  /**
   * Get an environment by name
   */
  async getByName(name: string): Promise<Environment | null> {
    const environments = await this.listAll();
    return environments.find((e) => e.name === name) || null;
  }

  /**
   * List all environments
   */
  async listAll(): Promise<Environment[]> {
    const files = this.fs.listFiles(this.environmentsDir);
    const environments: Environment[] = [];

    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = `${this.environmentsDir}/${file}`;
        const environment = this.fs.readJson<Environment>(filePath);
        if (environment) {
          environments.push(this.deserialize(environment));
        }
      }
    }

    return environments;
  }

  /**
   * Deserialize environment (convert date strings to Date objects)
   */
  private deserialize(env: Environment): Environment {
    return {
      ...env,
      createdAt: new Date(env.createdAt),
      updatedAt: new Date(env.updatedAt),
    };
  }

  /**
   * Delete an environment
   */
  async delete(id: string): Promise<void> {
    const filePath = `${this.environmentsDir}/${id}.json`;
    this.fs.deleteFile(filePath);
  }

  /**
   * Check if an environment exists
   */
  async exists(id: string): Promise<boolean> {
    const filePath = `${this.environmentsDir}/${id}.json`;
    return this.fs.exists(filePath);
  }
}
