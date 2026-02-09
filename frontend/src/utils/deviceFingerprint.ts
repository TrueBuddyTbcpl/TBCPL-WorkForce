import { storageHelper } from './storageHelper';
import { STORAGE_KEYS } from './constants';

/**
 * Generate a unique device fingerprint for login tracking
 */
export const getDeviceFingerprint = (): string => {
  // Check if device ID already exists
  const existingDeviceId = storageHelper.get<string>(STORAGE_KEYS.DEVICE_ID);
  if (existingDeviceId) {
    return existingDeviceId;
  }

  // Create new device fingerprint
  const fingerprint = generateFingerprint();
  
  // Store for future use
  storageHelper.set(STORAGE_KEYS.DEVICE_ID, fingerprint);
  
  return fingerprint;
};

/**
 * Generate device fingerprint based on browser/system info
 */
const generateFingerprint = (): string => {
  const components = [
    navigator.userAgent,
    navigator.language,
    screen.width.toString(),
    screen.height.toString(),
    screen.colorDepth.toString(),
    new Date().getTimezoneOffset().toString(),
    navigator.cookieEnabled ? 'true' : 'false',
    navigator.platform,
  ];

  const fingerprint = components.join('|');
  
  // Generate hash-like string
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  return `device-${Math.abs(hash)}-${Date.now()}`;
};

/**
 * Get user's IP address (fallback to 0.0.0.0 if unavailable)
 */
export const getUserIP = async (): Promise<string> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip || '0.0.0.0';
  } catch (error) {
    console.error('Failed to fetch IP address:', error);
    return '0.0.0.0';
  }
};
