import { useEffect, useState, useCallback, useRef } from 'react';
import { FormStorageManager } from '../utils/formStorageManager';

interface UseFormAutosaveOptions {
  formId: string;
  onRestore?: (data: any) => void;
  debounceMs?: number;
}

export function useFormAutosave({ 
  formId, 
  onRestore, 
  debounceMs = 500 
}: UseFormAutosaveOptions) {
  const [formManager] = useState(() => new FormStorageManager(formId));
  const [autoSaveIndicator, setAutoSaveIndicator] = useState(false);
  const [currentStep, setCurrentStep] = useState(() => formManager.getStep());
  const debounceTimerRef = useRef<number | null>(null);
  const hasRestoredRef = useRef(false);  // ✅ Add flag to prevent multiple restores

  // Restore saved data on mount ONLY ONCE
  useEffect(() => {
    if (!hasRestoredRef.current && onRestore && formManager.hasSavedData()) {
      const savedData = formManager.getData();
      if (savedData) {
        onRestore(savedData);
        hasRestoredRef.current = true;  // ✅ Mark as restored
      }
    }
    // ✅ Remove formManager and onRestore from dependencies
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Save step whenever it changes
  useEffect(() => {
    formManager.saveStep(currentStep);
  }, [currentStep, formManager]);

  // Debounced autosave function
  const autoSave = useCallback((data: any) => {
    // Clear existing timer
    if (debounceTimerRef.current !== null) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer
    debounceTimerRef.current = window.setTimeout(() => {
      formManager.saveDataWithTimestamp(data);
      setAutoSaveIndicator(true);
      setTimeout(() => setAutoSaveIndicator(false), 2000);
    }, debounceMs);
  }, [debounceMs, formManager]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current !== null) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Clear form data
  const clearFormData = useCallback(() => {
    formManager.clear();
    hasRestoredRef.current = false;  // ✅ Reset flag when clearing
  }, [formManager]);

  // Check if has saved data
  const hasSavedData = useCallback(() => {
    return formManager.hasSavedData();
  }, [formManager]);

  // Get last saved timestamp
  const getLastSaved = useCallback(() => {
    return formManager.getLastSaved();
  }, [formManager]);

  return {
    currentStep,
    setCurrentStep,
    autoSave,
    autoSaveIndicator,
    clearFormData,
    hasSavedData,
    getLastSaved,
    formManager,
  };
}
