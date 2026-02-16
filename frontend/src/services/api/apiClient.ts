import axios, { type AxiosInstance, AxiosError, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios';
import { storageHelper } from '../../utils/storageHelper';
import { STORAGE_KEYS } from '../../utils/constants';
import { toast } from 'sonner';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://tbcpl-workforce-backend.onrender.com/api/v1';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add JWT token to all requests
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = storageHelper.get<string>(STORAGE_KEYS.AUTH_TOKEN);
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// ✅ Track if we've already shown the session expired message
let hasShownSessionExpiredMessage = false;

// Response interceptor - Handle common errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // ✅ Unauthorized - Session expired or invalid token
      console.error('Unauthorized access - Session expired');
      
      // Clear all auth data from localStorage
      storageHelper.remove(STORAGE_KEYS.AUTH_TOKEN);
      storageHelper.remove(STORAGE_KEYS.USER_INFO);
      storageHelper.remove(STORAGE_KEYS.TOKEN_EXPIRY);
      
      // ✅ Clear Zustand store (dynamic import to avoid circular dependency)
      import('../../stores/authStore').then(({ useAuthStore }) => {
        useAuthStore.getState().clearAuth();
      });
      
      // ✅ Show session expired alert only once
      if (!hasShownSessionExpiredMessage) {
        hasShownSessionExpiredMessage = true;
        
        // ✅ Show custom alert with confirm button
        const userConfirmed = window.confirm(
          'Your session has expired! You need to login again.\n\nClick OK to go to the login page.'
        );
        
        // Reset flag after showing alert
        setTimeout(() => {
          hasShownSessionExpiredMessage = false;
        }, 2000);
        
        // ✅ Redirect to login page
        const currentPath = window.location.pathname;
        if (currentPath !== '/auth/login' && currentPath !== '/admin/login') {
          if (userConfirmed) {
            window.location.href = '/auth/login';
          } else {
            // If user clicks Cancel, still redirect after 3 seconds
            setTimeout(() => {
              window.location.href = '/auth/login';
            }, 3000);
          }
        }
      }
    } else if (error.response?.status === 403) {
      // ✅ Forbidden
      console.error('Forbidden access');
      toast.error('You do not have permission to access this resource.');
    } else if (error.response?.status === 409) {
      // ✅ Conflict - Duplicate session
      const errorMessage = (error.response?.data as any)?.message || 'You are already logged in on another device.';
      toast.error(errorMessage, {
        duration: 5000,
        position: 'top-center',
      });
    } else if (error.response?.status === 500) {
      // ✅ Server error
      console.error('Server error');
      toast.error('Server error. Please try again later.');
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
