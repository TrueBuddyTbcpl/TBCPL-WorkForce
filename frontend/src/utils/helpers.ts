import type { LeadType } from './constants';
import { STEP_COUNTS } from './constants';

// Get step count based on lead type
export const getStepCount = (leadType: LeadType): number => {
  return STEP_COUNTS[leadType] || 0;
};

// Calculate progress percentage
export const calculateProgress = (currentStep: number, totalSteps: number): number => {
  if (totalSteps === 0) return 0;
  return Math.round((currentStep / totalSteps) * 100);
};

// Check if step is completed
export const isStepCompleted = (currentStep: number, stepNumber: number): boolean => {
  return currentStep >= stepNumber;
};

// Get step title
export const getStepTitle = (leadType: LeadType, stepNumber: number): string => {
  if (leadType === 'CLIENT_LEAD') {
    const titles: Record<number, string> = {
      1: 'Basic Information',
      2: 'Scope Selection',
      3: 'Target Details',
      4: 'Verification',
      5: 'Observations',
      6: 'Quality Assessment',
      7: 'Assessment',
      8: 'Recommendations',
      9: 'Remarks',
      10: 'Disclaimer',
    };
    return titles[stepNumber] || `Step ${stepNumber}`;
  } else {
    const titles: Record<number, string> = {
      1: 'Basic Information',
      2: 'Scope',
      3: 'Intelligence Nature',
      4: 'Verification',
      5: 'Observations',
      6: 'Risk Assessment',
      7: 'Assessment',
      8: 'Recommendations',
      9: 'Confidentiality',
      10: 'Remarks',
      11: 'Disclaimer',
    };
    return titles[stepNumber] || `Step ${stepNumber}`;
  }
};

// Validate email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone number (Indian format)
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[6-9]\d{9}$/;
  const cleaned = phone.replace(/\D/g, '');
  return phoneRegex.test(cleaned);
};

// Generate random ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

// Deep clone object
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

// Check if object is empty
export const isEmpty = (obj: any): boolean => {
  if (obj === null || obj === undefined) return true;
  if (Array.isArray(obj)) return obj.length === 0;
  if (typeof obj === 'object') return Object.keys(obj).length === 0;
  return false;
};

// Debounce function
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
