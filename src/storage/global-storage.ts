/**
 * Storage for global variables and active environment
 */

import { FileSystem } from './file-system';
import { GlobalVariables, ActiveEnvironment } from '../models/variables';

export class GlobalStorage {
  private readonly fs: FileSystem;
  private readonly globalsFile = 'globals.json';
  private readonly activeEnvFile = 'active-environment.json';

  constructor(fs: FileSystem) {
    this.fs = fs;
  }

  /**
   * Get global variables
   */
  getGlobalVariables(): GlobalVariables {
    const globals = this.fs.readJson<GlobalVariables>(this.globalsFile);
    if (globals) {
      return {
        ...globals,
        updatedAt: new Date(globals.updatedAt),
      };
    }
    return {
      variables: {},
      updatedAt: new Date(),
    };
  }

  /**
   * Save global variables
   */
  saveGlobalVariables(globals: GlobalVariables): void {
    this.fs.writeJson(this.globalsFile, globals);
  }

  /**
   * Update global variables
   */
  updateGlobalVariables(updates: Record<string, string>): GlobalVariables {
    const current = this.getGlobalVariables();
    const updated: GlobalVariables = {
      variables: { ...current.variables, ...updates },
      updatedAt: new Date(),
    };
    this.saveGlobalVariables(updated);
    return updated;
  }

  /**
   * Delete global variables
   */
  deleteGlobalVariables(keys: string[]): GlobalVariables {
    const current = this.getGlobalVariables();
    const variables = { ...current.variables };
    keys.forEach((key) => delete variables[key]);
    const updated: GlobalVariables = {
      variables,
      updatedAt: new Date(),
    };
    this.saveGlobalVariables(updated);
    return updated;
  }

  /**
   * Clear all global variables
   */
  clearGlobalVariables(): void {
    this.saveGlobalVariables({
      variables: {},
      updatedAt: new Date(),
    });
  }

  /**
   * Get active environment
   */
  getActiveEnvironment(): ActiveEnvironment | null {
    const active = this.fs.readJson<ActiveEnvironment>(this.activeEnvFile);
    if (active) {
      return {
        ...active,
        activatedAt: new Date(active.activatedAt),
      };
    }
    return null;
  }

  /**
   * Set active environment
   */
  setActiveEnvironment(name: string, environmentId: string): ActiveEnvironment {
    const active: ActiveEnvironment = {
      name,
      environmentId,
      activatedAt: new Date(),
    };
    this.fs.writeJson(this.activeEnvFile, active);
    return active;
  }

  /**
   * Clear active environment
   */
  clearActiveEnvironment(): void {
    this.fs.deleteFile(this.activeEnvFile);
  }
}
