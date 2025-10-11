/**
 * Collection management logic
 * Handles creation, retrieval, update, and deletion of collections
 */

import { Collection, CollectionRequest } from '../models';
import { CollectionStorage } from '../storage/collection-storage';

export class CollectionManager {
  private storage?: CollectionStorage;

  /**
   * Set storage implementation
   */
  setStorage(storage: CollectionStorage): void {
    this.storage = storage;
  }

  /**
   * Create a new collection
   */
  async createCollection(name: string, description?: string): Promise<Collection> {
    const collection: Collection = {
      id: this.generateId(),
      name,
      description,
      requests: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Save to storage if available
    if (this.storage) {
      await this.storage.save(collection);
    }

    return collection;
  }

  /**
   * Get a collection by name or ID
   */
  async getCollection(identifier: string): Promise<Collection | null> {
    if (!this.storage) {
      return null;
    }

    // Try to get by ID first
    let collection = await this.storage.getById(identifier);

    // If not found, try by name
    if (!collection) {
      collection = await this.storage.getByName(identifier);
    }

    return collection;
  }

  /**
   * List all collections
   */
  async listCollections(): Promise<Collection[]> {
    if (!this.storage) {
      return [];
    }
    return this.storage.listAll();
  }

  /**
   * Add a request to a collection
   */
  async addRequest(collectionId: string, request: CollectionRequest): Promise<Collection> {
    if (!this.storage) {
      throw new Error('Storage not configured');
    }

    // Retrieve current collection
    const collection = await this.storage.getById(collectionId);
    if (!collection) {
      throw new Error(`Collection with ID ${collectionId} not found`);
    }

    // Add request
    collection.requests.push(request);
    collection.updatedAt = new Date();

    // Save to storage
    await this.storage.save(collection);

    return collection;
  }

  /**
   * Update a collection
   */
  async updateCollection(collectionId: string, updates: Partial<Collection>): Promise<Collection> {
    if (!this.storage) {
      throw new Error('Storage not configured');
    }

    // Retrieve current collection
    const current = await this.storage.getById(collectionId);
    if (!current) {
      throw new Error(`Collection with ID ${collectionId} not found`);
    }

    // Apply updates
    const updated: Collection = {
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
   * Delete a collection
   */
  async deleteCollection(collectionId: string): Promise<void> {
    if (!this.storage) {
      throw new Error('Storage not configured');
    }
    await this.storage.delete(collectionId);
  }

  /**
   * Generate a unique ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }
}
