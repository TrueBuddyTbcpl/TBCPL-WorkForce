import { useState, useEffect } from 'react';
import { storageHelper } from '../utils/storageHelper';

/**
 * Custom hook for using localStorage with React state
 * Automatically syncs state with localStorage
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  // Get initial value from localStorage or use provided initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    const item = storageHelper.get<T>(key);
    return item !== null ? item : initialValue;
  });

  // Update localStorage when state changes
  useEffect(() => {
    storageHelper.set(key, storedValue);
  }, [key, storedValue]);

  // Listen for changes in other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error('Error parsing storage event:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setStoredValue] as const;
}
