import { create } from 'zustand';
import { storageHelper } from '../utils/storageHelper';
import { STORAGE_KEYS  } from '../utils/constants';
import type { AuthState, UserInfo } from '../types/auth.types';

export const useAuthStore = create<AuthState>((set, get) => ({
  token: storageHelper.get<string>(STORAGE_KEYS.AUTH_TOKEN),
  user: storageHelper.get<UserInfo>(STORAGE_KEYS.USER_INFO),
  isAuthenticated: !!storageHelper.get<string>(STORAGE_KEYS.AUTH_TOKEN),
  tokenExpiry: storageHelper.get<number>(STORAGE_KEYS.TOKEN_EXPIRY),

  login: (token: string, user: UserInfo, expiresIn: number) => {
    const expiryTime = Date.now() + expiresIn;
    
    // Store in localStorage
    storageHelper.set(STORAGE_KEYS.AUTH_TOKEN, token);
    storageHelper.set(STORAGE_KEYS.USER_INFO, user);
    storageHelper.set(STORAGE_KEYS.TOKEN_EXPIRY, expiryTime);
    
    // Update state
    set({
      token,
      user,
      isAuthenticated: true,
      tokenExpiry: expiryTime,
    });
  },

  logout: () => {
    // Clear localStorage
    storageHelper.remove(STORAGE_KEYS.AUTH_TOKEN);
    storageHelper.remove(STORAGE_KEYS.USER_INFO);
    storageHelper.remove(STORAGE_KEYS.TOKEN_EXPIRY);
    
    // Reset state
    set({
      token: null,
      user: null,
      isAuthenticated: false,
      tokenExpiry: null,
    });
  },

  // ✅ NEW: Clear auth (same as logout but explicit for session expiry)
  clearAuth: () => {
    // Clear localStorage
    storageHelper.remove(STORAGE_KEYS.AUTH_TOKEN);
    storageHelper.remove(STORAGE_KEYS.USER_INFO);
    storageHelper.remove(STORAGE_KEYS.TOKEN_EXPIRY);
    
    // Reset state
    set({
      token: null,
      user: null,
      isAuthenticated: false,
      tokenExpiry: null,
    });
  },

  isTokenExpired: () => {
    const { tokenExpiry } = get();
    if (!tokenExpiry) return true;
    return Date.now() > tokenExpiry;
  },
}));
