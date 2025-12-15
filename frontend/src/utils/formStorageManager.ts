import { storageHelper } from './storageHelper';

/**
 * Form storage manager for multi-step forms
 * Provides autosave and step persistence
 */
export class FormStorageManager {
  private dataKey: string;
  private stepKey: string;

  constructor(formId: string) {
    this.dataKey = `form_${formId}_data`;
    this.stepKey = `form_${formId}_step`;
  }

  // Save form data
  saveData(data: any): void {
    storageHelper.set(this.dataKey, data);
  }

  // Get form data
  getData<T>(): T | null {
    return storageHelper.get<T>(this.dataKey);
  }

  // Save current step
  saveStep(step: number): void {
    storageHelper.set(this.stepKey, step);
  }

  // Get current step
  getStep(): number {
    return storageHelper.get<number>(this.stepKey) || 1;
  }

  // Clear all form data
  clear(): void {
    storageHelper.remove(this.dataKey);
    storageHelper.remove(this.stepKey);
  }

  // Check if form has saved data
  hasSavedData(): boolean {
    return storageHelper.has(this.dataKey);
  }

  // Get form timestamp (when last saved)
  getLastSaved(): Date | null {
    const data = this.getData<any>();
    return data?._lastSaved ? new Date(data._lastSaved) : null;
  }

  // Save data with timestamp
  saveDataWithTimestamp(data: any): void {
    this.saveData({
      ...data,
      _lastSaved: new Date().toISOString(),
    });
  }
}
