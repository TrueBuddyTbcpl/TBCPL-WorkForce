import apiClient from './apiClient';
import { AUTH_ENDPOINTS } from '../../utils/constants';
import type { Role, CreateRoleRequest, UpdateRoleRequest } from '../../types/employee.types';
import type { ApiResponse } from '../../types/auth.types';

/**
 * Get all roles
 */
export const getRoles = async (): Promise<ApiResponse<Role[]>> => {
  console.log('👥 Fetching roles from:', AUTH_ENDPOINTS.ROLES);
  const response = await apiClient.get<ApiResponse<Role[]>>(AUTH_ENDPOINTS.ROLES);
  console.log('📋 Roles response:', response.data);
  return response.data;
};

/**
 * Get role by ID
 */
export const getRoleById = async (id: number): Promise<ApiResponse<Role>> => {
  const response = await apiClient.get<ApiResponse<Role>>(
    AUTH_ENDPOINTS.ROLE_BY_ID(id)
  );
  return response.data;
};

/**
 * Create new role
 */
export const createRole = async (
  data: CreateRoleRequest
): Promise<ApiResponse<Role>> => {
  const response = await apiClient.post<ApiResponse<Role>>(
    AUTH_ENDPOINTS.ROLES,
    data
  );
  return response.data;
};

/**
 * Update role
 */
export const updateRole = async (
  id: number,
  data: UpdateRoleRequest
): Promise<ApiResponse<Role>> => {
  const response = await apiClient.put<ApiResponse<Role>>(
    AUTH_ENDPOINTS.ROLE_BY_ID(id),
    data
  );
  return response.data;
};

/**
 * Delete role
 */
export const deleteRole = async (id: number): Promise<ApiResponse<null>> => {
  const response = await apiClient.delete<ApiResponse<null>>(
    AUTH_ENDPOINTS.ROLE_BY_ID(id)
  );
  return response.data;
};
