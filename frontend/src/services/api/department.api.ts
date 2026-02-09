import apiClient from './apiClient';
import { AUTH_ENDPOINTS } from '../../utils/constants';
import type { Department, CreateDepartmentRequest, UpdateDepartmentRequest } from '../../types/employee.types';
import type { ApiResponse } from '../../types/auth.types';

/**
 * Get all departments
 */
export const getDepartments = async (): Promise<ApiResponse<Department[]>> => {
  console.log('🏢 Fetching departments from:', AUTH_ENDPOINTS.DEPARTMENTS);
  const response = await apiClient.get<ApiResponse<Department[]>>(AUTH_ENDPOINTS.DEPARTMENTS);
  console.log('📋 Departments response:', response.data);
  return response.data;
};

/**
 * Get department by ID
 */
export const getDepartmentById = async (id: number): Promise<ApiResponse<Department>> => {
  const response = await apiClient.get<ApiResponse<Department>>(
    AUTH_ENDPOINTS.DEPARTMENT_BY_ID(id)
  );
  return response.data;
};

/**
 * Create new department
 */
export const createDepartment = async (
  data: CreateDepartmentRequest
): Promise<ApiResponse<Department>> => {
  const response = await apiClient.post<ApiResponse<Department>>(
    AUTH_ENDPOINTS.DEPARTMENTS,
    data
  );
  return response.data;
};

/**
 * Update department
 */
export const updateDepartment = async (
  id: number,
  data: UpdateDepartmentRequest
): Promise<ApiResponse<Department>> => {
  const response = await apiClient.put<ApiResponse<Department>>(
    AUTH_ENDPOINTS.DEPARTMENT_BY_ID(id),
    data
  );
  return response.data;
};

/**
 * Delete department
 */
export const deleteDepartment = async (id: number): Promise<ApiResponse<null>> => {
  const response = await apiClient.delete<ApiResponse<null>>(
    AUTH_ENDPOINTS.DEPARTMENT_BY_ID(id)
  );
  return response.data;
};
