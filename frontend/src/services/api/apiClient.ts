// src/services/api/apiClient.ts  ← SINGLE apiClient for entire project

import axios, { type AxiosInstance, AxiosError, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios';
import { storageHelper } from '../../utils/storageHelper';
import { STORAGE_KEYS } from '../../utils/constants';
import { toast } from 'sonner';

let isSessionExpiredModalShown = false;

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// ── Request Interceptor ───────────────────────────────────────────────────────
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

    // ✅ Let browser set Content-Type + boundary for multipart uploads
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// ── Response Interceptor ──────────────────────────────────────────────────────
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url || '';

    const isManagementEndpoint =
      requestUrl.includes('/auth/employees') ||
      requestUrl.includes('/auth/resend-verification') ||
      requestUrl.includes('/auth/verify-email') ||
      requestUrl.includes('/auth/departments') ||
      requestUrl.includes('/auth/roles');

    if (status === 401 && !isManagementEndpoint && !isSessionExpiredModalShown) {
      isSessionExpiredModalShown = true;
      storageHelper.remove(STORAGE_KEYS.AUTH_TOKEN);
      storageHelper.remove(STORAGE_KEYS.USER_INFO);
      storageHelper.remove(STORAGE_KEYS.TOKEN_EXPIRY);

      import('../../stores/authStore').then(({ useAuthStore }) => {
        useAuthStore.getState().clearAuth();
      });

      window.dispatchEvent(new CustomEvent('session-expired'));

      setTimeout(() => { isSessionExpiredModalShown = false; }, 2000);

      const currentPath = window.location.pathname;
      if (currentPath !== '/auth/login') {
        window.location.href = '/auth/login';
      }
    } else if (status === 403 && !requestUrl.includes('/auth/login')) {
      toast.error('You do not have permission to access this resource.');
    } else if (status === 409) {
      const errorMessage = (error.response?.data as any)?.message || 'You are already logged in on another device.';
      toast.error(errorMessage, { duration: 5000, position: 'top-center' });
    } else if (status === 500) {
      toast.error('Server error. Please try again later.');
    }

    return Promise.reject(error);
  }
);

export const resetSessionExpiredFlag = () => { isSessionExpiredModalShown = false; };
export default apiClient;