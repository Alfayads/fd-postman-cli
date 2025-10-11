/**
 * History management logic
 * Tracks and manages request/response history
 */

import { HistoryEntry, RequestOptions, ResponseData } from '../models';
import { HistoryStorage } from '../storage/history-storage';

export class HistoryManager {
  private storage?: HistoryStorage;

  /**
   * Set storage implementation
   */
  setStorage(storage: HistoryStorage): void {
    this.storage = storage;
  }

  /**
   * Add an entry to the history
   */
  async addEntry(request: RequestOptions, response: ResponseData): Promise<HistoryEntry> {
    const entry: HistoryEntry = {
      id: this.generateId(),
      request,
      response,
      timestamp: new Date(),
    };

    // Save to storage if available
    if (this.storage) {
      await this.storage.add(entry);
    }

    return entry;
  }

  /**
   * Get a specific history entry
   */
  async getEntry(entryId: string): Promise<HistoryEntry | null> {
    if (!this.storage) {
      return null;
    }
    return this.storage.getById(entryId);
  }

  /**
   * List history entries
   * @param limit - Maximum number of entries to return
   * @param offset - Number of entries to skip
   */
  async listEntries(limit = 50, offset = 0): Promise<HistoryEntry[]> {
    if (!this.storage) {
      return [];
    }
    return this.storage.list(limit, offset);
  }

  /**
   * Search history entries
   */
  async searchEntries(query: string): Promise<HistoryEntry[]> {
    if (!this.storage) {
      return [];
    }
    return this.storage.search(query);
  }

  /**
   * Clear all history
   */
  async clearHistory(): Promise<void> {
    if (!this.storage) {
      throw new Error('Storage not configured');
    }
    await this.storage.clear();
  }

  /**
   * Delete a specific entry
   */
  async deleteEntry(entryId: string): Promise<void> {
    if (!this.storage) {
      throw new Error('Storage not configured');
    }
    await this.storage.delete(entryId);
  }

  /**
   * Generate a unique ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }
}
