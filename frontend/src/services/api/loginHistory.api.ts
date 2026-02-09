import apiClient from './apiClient';
import { AUTH_ENDPOINTS } from '../../utils/constants';
import type { ApiResponse } from '../../types/auth.types';
import type {
  LoginHistoryListResponse,
  LoginAttemptsListResponse,
  LoginHistoryFilters,
  LoginAttemptsFilters,
} from '../../types/loginHistory.types';

/**
 * Get login history (paginated)
 */
export const getLoginHistory = async (
  filters?: LoginHistoryFilters
): Promise<ApiResponse<LoginHistoryListResponse>> => {
  const params = new URLSearchParams();
  
  if (filters?.page !== undefined) params.append('page', filters.page.toString());
  if (filters?.size !== undefined) params.append('size', filters.size.toString());
  if (filters?.empId) params.append('empId', filters.empId);
  if (filters?.startDate) params.append('startDate', filters.startDate);
  if (filters?.endDate) params.append('endDate', filters.endDate);
  if (filters?.isActive !== undefined) params.append('isActive', filters.isActive.toString());

  const response = await apiClient.get<ApiResponse<LoginHistoryListResponse>>(
    `${AUTH_ENDPOINTS.LOGIN_HISTORY}?${params.toString()}`
  );
  return response.data;
};

/**
 * Get login attempts (paginated)
 */
export const getLoginAttempts = async (
  filters?: LoginAttemptsFilters
): Promise<ApiResponse<LoginAttemptsListResponse>> => {
  const params = new URLSearchParams();
  
  if (filters?.page !== undefined) params.append('page', filters.page.toString());
  if (filters?.size !== undefined) params.append('size', filters.size.toString());
  if (filters?.empId) params.append('empId', filters.empId);
  if (filters?.startDate) params.append('startDate', filters.startDate);
  if (filters?.endDate) params.append('endDate', filters.endDate);
  if (filters?.isSuccess !== undefined) params.append('isSuccess', filters.isSuccess.toString());

  const response = await apiClient.get<ApiResponse<LoginAttemptsListResponse>>(
    `${AUTH_ENDPOINTS.LOGIN_ATTEMPTS}?${params.toString()}`
  );
  return response.data;
};

/**
 * Get login attempts by employee ID
 */
export const getLoginAttemptsByEmployee = async (
  empId: string,
  filters?: LoginAttemptsFilters
): Promise<ApiResponse<LoginAttemptsListResponse>> => {
  const params = new URLSearchParams();
  
  if (filters?.page !== undefined) params.append('page', filters.page.toString());
  if (filters?.size !== undefined) params.append('size', filters.size.toString());
  if (filters?.startDate) params.append('startDate', filters.startDate);
  if (filters?.endDate) params.append('endDate', filters.endDate);
  if (filters?.isSuccess !== undefined) params.append('isSuccess', filters.isSuccess.toString());

  const response = await apiClient.get<ApiResponse<LoginAttemptsListResponse>>(
    `${AUTH_ENDPOINTS.LOGIN_ATTEMPTS_BY_EMP(empId)}?${params.toString()}`
  );
  return response.data;
};
