/**
 * Generic localStorage helper utility
 * Can be used across the entire application
 */

export const storageHelper = {
  /**
   * Save data to localStorage
   */
  set: <T>(key: string, value: T): void => {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
    } catch (error) {
      console.error(`Error saving to localStorage (${key}):`, error);
    }
  },

  /**
   * Get data from localStorage
   */
  get: <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading from localStorage (${key}):`, error);
      return null;
    }
  },

  /**
   * Remove specific item from localStorage
   */
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from localStorage (${key}):`, error);
    }
  },

  /**
   * Clear all localStorage
   */
  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },

  /**
   * Check if key exists
   */
  has: (key: string): boolean => {
    return localStorage.getItem(key) !== null;
  },

  /**
   * Get all keys matching a pattern
   */
  getKeys: (pattern?: string): string[] => {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (!pattern || key.includes(pattern))) {
        keys.push(key);
      }
    }
    return keys;
  },

  /**
   * Remove multiple items by pattern
   */
  removeByPattern: (pattern: string): void => {
    const keys = storageHelper.getKeys(pattern);
    keys.forEach(key => storageHelper.remove(key));
  },
};
