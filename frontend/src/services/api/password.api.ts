// src/services/api/password.api.ts
import apiClient from './apiClient';
import type { ApiResponse } from '../../types/auth.types';

const BASE = '/auth/password';

export const changePassword = async (
  currentPassword: string,
  newPassword: string,
  confirmPassword: string
): Promise<ApiResponse<null>> => {
  const res = await apiClient.post<ApiResponse<null>>(`${BASE}/change`, {
    currentPassword, newPassword, confirmPassword,
  });
  return res.data;
};

export const requestPasswordReset = async (): Promise<ApiResponse<null>> => {
  const res = await apiClient.post<ApiResponse<null>>(`${BASE}/reset-request`);
  return res.data;
};

export const confirmPasswordReset = async (
  token: string,
  newPassword: string,
  confirmPassword: string
): Promise<ApiResponse<null>> => {
  const res = await apiClient.post<ApiResponse<null>>(`${BASE}/reset-confirm`, {
    token, newPassword, confirmPassword,
  });
  return res.data;
};

export const adminResetPassword = async (
  employeeId: number,
  newPassword: string,
  confirmPassword: string
): Promise<ApiResponse<null>> => {
  const res = await apiClient.post<ApiResponse<null>>(`${BASE}/admin-reset`, {
    employeeId, newPassword, confirmPassword,
  });
  return res.data;
};
