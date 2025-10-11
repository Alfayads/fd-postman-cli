/**
 * Unit tests for GlobalStorage
 */

import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';
import { GlobalStorage } from '../../../src/storage/global-storage';
import { FileSystem } from '../../../src/storage/file-system';

describe('GlobalStorage', () => {
  let globalStorage: GlobalStorage;
  let fileSystem: FileSystem;
  let testDir: string;

  beforeEach(() => {
    testDir = path.join(os.tmpdir(), `fd-postman-test-${Date.now()}`);
    fileSystem = new FileSystem(testDir);
    globalStorage = new GlobalStorage(fileSystem);
  });

  afterEach(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  describe('Global Variables', () => {
    it('should return empty variables by default', () => {
      const globals = globalStorage.getGlobalVariables();

      expect(globals.variables).toEqual({});
      expect(globals.updatedAt).toBeInstanceOf(Date);
    });

    it('should save and retrieve global variables', () => {
      const vars = { key1: 'value1', key2: 'value2' };
      globalStorage.updateGlobalVariables(vars);

      const retrieved = globalStorage.getGlobalVariables();

      expect(retrieved.variables).toEqual(vars);
      expect(retrieved.updatedAt).toBeInstanceOf(Date);
    });

    it('should merge new variables with existing ones', () => {
      globalStorage.updateGlobalVariables({ key1: 'value1' });
      globalStorage.updateGlobalVariables({ key2: 'value2' });

      const globals = globalStorage.getGlobalVariables();

      expect(globals.variables).toEqual({
        key1: 'value1',
        key2: 'value2',
      });
    });

    it('should update existing variables', () => {
      globalStorage.updateGlobalVariables({ key1: 'value1' });
      globalStorage.updateGlobalVariables({ key1: 'updated' });

      const globals = globalStorage.getGlobalVariables();

      expect(globals.variables.key1).toBe('updated');
    });

    it('should delete specific variables', () => {
      globalStorage.updateGlobalVariables({
        key1: 'value1',
        key2: 'value2',
        key3: 'value3',
      });

      globalStorage.deleteGlobalVariables(['key1', 'key3']);

      const globals = globalStorage.getGlobalVariables();

      expect(globals.variables).toEqual({ key2: 'value2' });
    });

    it('should clear all global variables', () => {
      globalStorage.updateGlobalVariables({ key1: 'value1', key2: 'value2' });

      globalStorage.clearGlobalVariables();

      const globals = globalStorage.getGlobalVariables();

      expect(globals.variables).toEqual({});
    });
  });

  describe('Active Environment', () => {
    it('should return null when no active environment', () => {
      const active = globalStorage.getActiveEnvironment();

      expect(active).toBeNull();
    });

    it('should save and retrieve active environment', () => {
      const active = globalStorage.setActiveEnvironment('production', 'prod-123');

      expect(active.name).toBe('production');
      expect(active.environmentId).toBe('prod-123');
      expect(active.activatedAt).toBeInstanceOf(Date);

      const retrieved = globalStorage.getActiveEnvironment();

      expect(retrieved?.name).toBe('production');
      expect(retrieved?.environmentId).toBe('prod-123');
      expect(retrieved?.activatedAt).toBeInstanceOf(Date);
    });

    it('should update active environment when setting new one', () => {
      globalStorage.setActiveEnvironment('dev', 'dev-123');
      globalStorage.setActiveEnvironment('prod', 'prod-456');

      const active = globalStorage.getActiveEnvironment();

      expect(active?.name).toBe('prod');
      expect(active?.environmentId).toBe('prod-456');
    });

    it('should clear active environment', () => {
      globalStorage.setActiveEnvironment('production', 'prod-123');

      expect(globalStorage.getActiveEnvironment()).not.toBeNull();

      globalStorage.clearActiveEnvironment();

      expect(globalStorage.getActiveEnvironment()).toBeNull();
    });
  });
});

