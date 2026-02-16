import axios from 'axios';
import { STORAGE_KEYS } from '../utils/constants';
import { storageHelper } from '../utils/storageHelper';

// Flag to prevent multiple session expiry alerts
let isSessionExpiredModalShown = false;

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://tbcpl-workforce-backend.onrender.com/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config) => {
    // ✅ Use correct storage key from constants
    const token = storageHelper.get<string>(STORAGE_KEYS.AUTH_TOKEN);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle session expiry
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // ✅ Handle 401 Unauthorized (Session Expired)
    if (error.response?.status === 401 && !isSessionExpiredModalShown) {
      isSessionExpiredModalShown = true;
      
      // Clear auth data
      storageHelper.remove(STORAGE_KEYS.AUTH_TOKEN);
      storageHelper.remove(STORAGE_KEYS.USER_INFO);
      storageHelper.remove(STORAGE_KEYS.TOKEN_EXPIRY);
      
      // Dispatch custom event for session expiry
      window.dispatchEvent(new CustomEvent('session-expired'));
    }
    
    // ✅ Handle 403 Forbidden (could also be session issue)
    if (error.response?.status === 403 && !isSessionExpiredModalShown) {
      const errorMessage = error.response?.data?.message || '';
      
      // Check if it's a token expiry issue
      if (errorMessage.toLowerCase().includes('token') || 
          errorMessage.toLowerCase().includes('expired') ||
          errorMessage.toLowerCase().includes('invalid')) {
        
        isSessionExpiredModalShown = true;
        
        // Clear auth data
        storageHelper.remove(STORAGE_KEYS.AUTH_TOKEN);
        storageHelper.remove(STORAGE_KEYS.USER_INFO);
        storageHelper.remove(STORAGE_KEYS.TOKEN_EXPIRY);
        
        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('session-expired'));
      }
    }
    
    return Promise.reject(error);
  }
);

// Reset flag function (called after redirect)
export const resetSessionExpiredFlag = () => {
  isSessionExpiredModalShown = false;
};
