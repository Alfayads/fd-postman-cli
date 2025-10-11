/**
 * Storage module for collections
 */

import { Collection } from '../models';
import { FileSystem } from './file-system';

export class CollectionStorage {
  private readonly fs: FileSystem;
  private readonly collectionsDir = 'collections';

  constructor(fs: FileSystem) {
    this.fs = fs;
    this.fs.ensureDir(this.collectionsDir);
  }

  /**
   * Save a collection
   */
  async save(collection: Collection): Promise<void> {
    const filePath = `${this.collectionsDir}/${collection.id}.json`;
    this.fs.writeJson(filePath, collection);
  }

  /**
   * Get a collection by ID
   */
  async getById(id: string): Promise<Collection | null> {
    const filePath = `${this.collectionsDir}/${id}.json`;
    const collection = this.fs.readJson<Collection>(filePath);
    if (collection) {
      return this.deserialize(collection);
    }
    return null;
  }

  /**
   * Get a collection by name
   */
  async getByName(name: string): Promise<Collection | null> {
    const collections = await this.listAll();
    return collections.find((c) => c.name === name) || null;
  }

  /**
   * List all collections
   */
  async listAll(): Promise<Collection[]> {
    const files = this.fs.listFiles(this.collectionsDir);
    const collections: Collection[] = [];

    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = `${this.collectionsDir}/${file}`;
        const collection = this.fs.readJson<Collection>(filePath);
        if (collection) {
          collections.push(this.deserialize(collection));
        }
      }
    }

    return collections;
  }

  /**
   * Deserialize collection (convert date strings to Date objects)
   */
  private deserialize(col: Collection): Collection {
    return {
      ...col,
      createdAt: new Date(col.createdAt),
      updatedAt: new Date(col.updatedAt),
    };
  }

  /**
   * Delete a collection
   */
  async delete(id: string): Promise<void> {
    const filePath = `${this.collectionsDir}/${id}.json`;
    this.fs.deleteFile(filePath);
  }

  /**
   * Check if a collection exists
   */
  async exists(id: string): Promise<boolean> {
    const filePath = `${this.collectionsDir}/${id}.json`;
    return this.fs.exists(filePath);
  }
}
