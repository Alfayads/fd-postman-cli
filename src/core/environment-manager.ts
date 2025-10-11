/**
 * Environment management logic
 * Handles environment variables and their interpolation
 */

import { Environment } from '../models';
import { EnvironmentStorage } from '../storage/environment-storage';

export class EnvironmentManager {
  private storage?: EnvironmentStorage;

  /**
   * Set storage implementation
   */
  setStorage(storage: EnvironmentStorage): void {
    this.storage = storage;
  }

  /**
   * Create a new environment
   */
  async createEnvironment(name: string, variables: Record<string, string>): Promise<Environment> {
    const environment: Environment = {
      id: this.generateId(),
      name,
      variables,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Save to storage if available
    if (this.storage) {
      await this.storage.save(environment);
    }

    return environment;
  }

  /**
   * Get an environment by name or ID
   */
  async getEnvironment(identifier: string): Promise<Environment | null> {
    if (!this.storage) {
      return null;
    }

    // Try to get by ID first
    let environment = await this.storage.getById(identifier);

    // If not found, try by name
    if (!environment) {
      environment = await this.storage.getByName(identifier);
    }

    return environment;
  }

  /**
   * List all environments
   */
  async listEnvironments(): Promise<Environment[]> {
    if (!this.storage) {
      return [];
    }
    return this.storage.listAll();
  }

  /**
   * Update an environment
   */
  async updateEnvironment(
    environmentId: string,
    updates: Partial<Environment>
  ): Promise<Environment> {
    if (!this.storage) {
      throw new Error('Storage not configured');
    }

    // Retrieve current environment
    const current = await this.storage.getById(environmentId);
    if (!current) {
      throw new Error(`Environment with ID ${environmentId} not found`);
    }

    // Apply updates
    const updated: Environment = {
      ...current,
      ...updates,
      id: current.id, // Ensure ID doesn't change
      updatedAt: new Date(),
    };

    // Save to storage
    await this.storage.save(updated);

    return updated;
  }

  /**
   * Delete an environment
   */
  async deleteEnvironment(environmentId: string): Promise<void> {
    if (!this.storage) {
      throw new Error('Storage not configured');
    }
    await this.storage.delete(environmentId);
  }

  /**
   * Interpolate environment variables in a string
   * Supports {{variable}} syntax
   */
  interpolate(text: string, environment: Environment): string {
    return text.replace(/\{\{(\w+)\}\}/g, (match, varName) => {
      return environment.variables[varName] || match;
    });
  }

  /**
   * Generate a unique ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }
}
