/**
 * Unit tests for file system operations
 */

import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';
import { FileSystem } from '../../../src/storage/file-system';

describe('FileSystem', () => {
  let fileSystem: FileSystem;
  let testDir: string;

  beforeEach(() => {
    // Create a temporary test directory
    testDir = path.join(os.tmpdir(), `fd-postman-test-${Date.now()}`);
    fileSystem = new FileSystem(testDir);
  });

  afterEach(() => {
    // Clean up test directory
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  it('should create base directory', () => {
    expect(fs.existsSync(testDir)).toBe(true);
  });

  it('should write and read JSON', () => {
    const data = { name: 'test', value: 123 };
    fileSystem.writeJson('test.json', data);
    
    const result = fileSystem.readJson<typeof data>('test.json');
    expect(result).toEqual(data);
  });

  it('should return null for non-existent file', () => {
    const result = fileSystem.readJson('nonexistent.json');
    expect(result).toBeNull();
  });

  it('should check if file exists', () => {
    fileSystem.writeJson('test.json', { data: 'test' });
    
    expect(fileSystem.exists('test.json')).toBe(true);
    expect(fileSystem.exists('nonexistent.json')).toBe(false);
  });

  it('should delete file', () => {
    fileSystem.writeJson('test.json', { data: 'test' });
    expect(fileSystem.exists('test.json')).toBe(true);
    
    fileSystem.deleteFile('test.json');
    expect(fileSystem.exists('test.json')).toBe(false);
  });

  it('should list files in directory', () => {
    fileSystem.writeJson('file1.json', { data: 1 });
    fileSystem.writeJson('file2.json', { data: 2 });
    
    const files = fileSystem.listFiles('');
    expect(files).toContain('file1.json');
    expect(files).toContain('file2.json');
  });
});

