import { AxiosError } from 'axios';
import type { ApiResponse } from '../types/auth.types';

/**
 * Extract error message from API response
 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const response = error.response?.data as ApiResponse<null> | undefined;
    
    if (response?.message) {
      return response.message;
    }
    
    // Handle common HTTP errors
    if (error.response?.status === 401) {
      return 'Invalid credentials. Please check your email and password.';
    }
    
    if (error.response?.status === 403) {
      return 'You do not have permission to perform this action.';
    }
    
    if (error.response?.status === 423) {
      return 'Account locked due to multiple failed login attempts. Please try again after 15 minutes.';
    }
    
    if (error.response?.status === 409) {
      return 'Already logged in on another device. Please logout from other device first.';
    }
    
    if (error.response?.status === 404) {
      return 'Resource not found.';
    }
    
    if (error.response?.status === 500) {
      return 'Server error. Please try again later.';
    }
    
    if (error.code === 'ECONNABORTED') {
      return 'Request timeout. Please check your internet connection.';
    }
    
    if (error.code === 'ERR_NETWORK') {
      return 'Network error. Please check your internet connection.';
    }
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred. Please try again.';
};

/**
 * Check if error is authentication related
 */
export const isAuthError = (error: unknown): boolean => {
  if (error instanceof AxiosError) {
    return error.response?.status === 401 || error.response?.status === 403;
  }
  return false;
};

/**
 * Check if account is locked
 */
export const isAccountLocked = (error: unknown): boolean => {
  if (error instanceof AxiosError) {
    return error.response?.status === 423;
  }
  return false;
};
