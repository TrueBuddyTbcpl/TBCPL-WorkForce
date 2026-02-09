import apiClient from './apiClient';
import { AUTH_ENDPOINTS } from '../../utils/constants';
import type {
  LoginRequest,
  LoginResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  ApiResponse,
} from '../../types/auth.types';

/**
 * Login user
 */
export const loginUser = async (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
  const response = await apiClient.post<ApiResponse<LoginResponse>>(AUTH_ENDPOINTS.LOGIN, data);
  return response.data;
};

/**
 * Logout user
 */
export const logoutUser = async (): Promise<ApiResponse<null>> => {
  const response = await apiClient.post<ApiResponse<null>>(AUTH_ENDPOINTS.LOGOUT);
  return response.data;
};

/**
 * Change own password
 */
export const changePassword = async (
  data: ChangePasswordRequest
): Promise<ApiResponse<ChangePasswordResponse>> => {
  const response = await apiClient.post<ApiResponse<ChangePasswordResponse>>(
    AUTH_ENDPOINTS.CHANGE_PASSWORD,
    data
  );
  return response.data;
};

/**
 * Admin reset user password
 */
export const resetPassword = async (
  data: ResetPasswordRequest
): Promise<ApiResponse<ResetPasswordResponse>> => {
  const response = await apiClient.post<ApiResponse<ResetPasswordResponse>>(
    AUTH_ENDPOINTS.RESET_PASSWORD,
    data
  );
  return response.data;
};
