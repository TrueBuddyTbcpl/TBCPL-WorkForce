import { useState, useEffect } from 'react';
import { getDropdownOptions } from '../services/dropdownApi';

interface UseDropdownOptionsResult {
  options: string[];
  loading: boolean;
}

// Module-level cache — survives re-renders but not page reload
const optionsCache = new Map<string, string[]>();

export const useDropdownOptions = (fieldName: string): UseDropdownOptionsResult => {
  const [options, setOptions] = useState<string[]>(() => optionsCache.get(fieldName) ?? []);
  const [loading, setLoading] = useState(!optionsCache.has(fieldName));

  useEffect(() => {
    if (!fieldName) return;

    // If already cached, use it immediately — no loader flash
    if (optionsCache.has(fieldName)) {
      setOptions(optionsCache.get(fieldName)!);
      setLoading(false);
      return;
    }

    setLoading(true);
    getDropdownOptions(fieldName)
      .then((data: string[]) => {
        optionsCache.set(fieldName, data);
        setOptions(data);
      })
      .catch(() => {
        setOptions(['OTHER']); // fallback — never block the form
      })
      .finally(() => setLoading(false));
  }, [fieldName]); // ← fieldName as dependency is critical

  return { options, loading };
};