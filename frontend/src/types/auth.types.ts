// Authentication Types
export interface LoginRequest {
  email: string;
  password: string;
  deviceId: string;
  ipAddress: string;
}

export interface LoginResponse {
  token: string;
  tokenType: string;
  expiresIn: number;
  empId: string;
  email: string;
  fullName: string;
  departmentName: string;
  roleName: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ResetPasswordRequest {
  empId: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  empId: string;
  passwordChanged: boolean;
  lastPasswordChangeDate: string;
}

export interface ResetPasswordResponse {
  empId: string;
  resetBy: string;
  lastPasswordChangeDate: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

// User Info stored in state
export interface UserInfo {
  empId: string;
  email: string;
  fullName: string;
  departmentName: string;
  roleName: string;
}

// Auth Store State
export interface AuthState {
  token: string | null;
  user: UserInfo | null;
  isAuthenticated: boolean;
  tokenExpiry: number | null;
  login: (token: string, user: UserInfo, expiresIn: number) => void;
  logout: () => void;
  clearAuth: () => void;
  isTokenExpired: () => boolean;
}
