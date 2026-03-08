import axios, { type AxiosInstance, AxiosError, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios';
import { storageHelper } from '../../utils/storageHelper';
import { STORAGE_KEYS } from '../../utils/constants';
import { toast } from 'sonner';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

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
    const userInfo = storageHelper.get<{ empId?: string; fullName?: string }>(STORAGE_KEYS.USER_INFO);
    if (userInfo && config.headers) {
      config.headers['X-Username'] = userInfo.empId ?? userInfo.fullName ?? 'unknown';
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
// Response interceptor - Handle common errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url || '';

    // ✅ Endpoints that should NEVER trigger session-expired logout
    const isManagementEndpoint =
      requestUrl.includes('/auth/employees') ||
      requestUrl.includes('/auth/resend-verification') ||
      requestUrl.includes('/auth/verify-email') ||
      requestUrl.includes('/auth/departments') ||
      requestUrl.includes('/auth/roles');

    if (status === 401 && !isManagementEndpoint) {  // ← ONLY CHANGE HERE
      console.error('Unauthorized access - Session expired');

      storageHelper.remove(STORAGE_KEYS.AUTH_TOKEN);
      storageHelper.remove(STORAGE_KEYS.USER_INFO);
      storageHelper.remove(STORAGE_KEYS.TOKEN_EXPIRY);

      import('../../stores/authStore').then(({ useAuthStore }) => {
        useAuthStore.getState().clearAuth();
      });

      if (!hasShownSessionExpiredMessage) {
        hasShownSessionExpiredMessage = true;

        const userConfirmed = window.confirm(
          'Your session has expired! You need to login again.\n\nClick OK to go to the login page.'
        );

        setTimeout(() => { hasShownSessionExpiredMessage = false; }, 2000);

        const currentPath = window.location.pathname;
        if (currentPath !== '/auth/login' && currentPath !== '/admin/login') {
          if (userConfirmed) {
            window.location.href = '/auth/login';
          } else {
            setTimeout(() => { window.location.href = '/auth/login'; }, 3000);
          }
        }
      }
    } else if (status === 403) {
      if (!requestUrl.includes('/auth/login')) {
        toast.error('You do not have permission to access this resource.');
      }
    } else if (status === 409) {
      const errorMessage = (error.response?.data as any)?.message || 'You are already logged in on another device.';
      toast.error(errorMessage, { duration: 5000, position: 'top-center' });
    } else if (status === 500) {
      console.error('Server error');
      toast.error('Server error. Please try again later.');
    }

    return Promise.reject(error);
  }
);


export default apiClient;
