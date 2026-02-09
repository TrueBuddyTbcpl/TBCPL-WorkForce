import apiClient from './apiClient';
import { AUTH_ENDPOINTS } from '../../utils/constants';
import type { ApiResponse } from '../../types/auth.types';

/**
 * Admin reset employee password
 */
export interface AdminResetPasswordRequest {
  empId: string;
  newPassword: string;
}

export interface AdminResetPasswordResponse {
  message: string;
  empId: string;
  email: string;
}

export const adminResetPassword = async (
  data: AdminResetPasswordRequest
): Promise<ApiResponse<AdminResetPasswordResponse>> => {
  const response = await apiClient.post<ApiResponse<AdminResetPasswordResponse>>(
    AUTH_ENDPOINTS.ADMIN_RESET_PASSWORD,
    data
  );
  return response.data;
};
