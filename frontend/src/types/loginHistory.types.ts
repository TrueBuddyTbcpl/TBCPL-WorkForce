/**
 * Login History Types
 */

export interface LoginHistory {
  id: number;
  empId: string;
  email: string;
  fullName: string;
  loginTime: string;
  logoutTime: string | null;
  ipAddress: string;
  userAgent: string;
  isActive: boolean;
  sessionDuration?: string;
}

export interface LoginAttempt {
  id: number;
  empId: string | null;
  email: string;
  attemptTime: string;
  ipAddress: string;
  userAgent: string;
  isSuccess: boolean;
  failureReason: string | null;
}

export interface LoginHistoryFilters {
  page?: number;
  size?: number;
  empId?: string;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
}

export interface LoginAttemptsFilters {
  page?: number;
  size?: number;
  empId?: string;
  startDate?: string;
  endDate?: string;
  isSuccess?: boolean;
}

export interface LoginHistoryListResponse {
  loginHistories: LoginHistory[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
}

export interface LoginAttemptsListResponse {
  loginAttempts: LoginAttempt[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
}
