/**
 * Storage module for request history
 */

import { HistoryEntry } from '../models';
import { FileSystem } from './file-system';

export class HistoryStorage {
  private readonly fs: FileSystem;
  private readonly historyFile = 'history.json';

  constructor(fs: FileSystem) {
    this.fs = fs;
  }

  /**
   * Add an entry to history
   */
  async add(entry: HistoryEntry): Promise<void> {
    const history = await this.getAll();
    history.unshift(entry); // Add to beginning

    // Keep only the last 1000 entries
    const trimmedHistory = history.slice(0, 1000);

    this.fs.writeJson(this.historyFile, trimmedHistory);
  }

  /**
   * Get an entry by ID
   */
  async getById(id: string): Promise<HistoryEntry | null> {
    const history = await this.getAll();
    return history.find((entry) => entry.id === id) || null;
  }

  /**
   * Get all history entries
   */
  async getAll(): Promise<HistoryEntry[]> {
    const history = this.fs.readJson<HistoryEntry[]>(this.historyFile);
    if (!history) {
      return [];
    }
    return history.map((entry) => this.deserialize(entry));
  }

  /**
   * Deserialize history entry (convert date strings to Date objects)
   */
  private deserialize(entry: HistoryEntry): HistoryEntry {
    return {
      ...entry,
      timestamp: new Date(entry.timestamp),
    };
  }

  /**
   * Get paginated history entries
   */
  async list(limit = 50, offset = 0): Promise<HistoryEntry[]> {
    const history = await this.getAll();
    return history.slice(offset, offset + limit);
  }

  /**
   * Search history entries
   */
  async search(query: string): Promise<HistoryEntry[]> {
    const history = await this.getAll();
    const lowerQuery = query.toLowerCase();

    return history.filter((entry) => {
      const url = entry.request.url.toLowerCase();
      const method = entry.request.method.toLowerCase();
      return url.includes(lowerQuery) || method.includes(lowerQuery);
    });
  }

  /**
   * Clear all history
   */
  async clear(): Promise<void> {
    this.fs.writeJson(this.historyFile, []);
  }

  /**
   * Delete a specific entry
   */
  async delete(id: string): Promise<void> {
    const history = await this.getAll();
    const filtered = history.filter((entry) => entry.id !== id);
    this.fs.writeJson(this.historyFile, filtered);
  }
}
