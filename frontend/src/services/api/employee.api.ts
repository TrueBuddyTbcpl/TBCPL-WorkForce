import apiClient from './apiClient';
import { AUTH_ENDPOINTS } from '../../utils/constants';
import type {
  Employee,
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
  EmployeeListResponse,
  EmployeeFilters,
} from '../../types/employee.types';
import type { ApiResponse } from '../../types/auth.types';

/**
 * Get all employees with filters/pagination
 */
export const getEmployees = async (
  filters?: EmployeeFilters
): Promise<ApiResponse<EmployeeListResponse>> => {
  const params = new URLSearchParams();
  
  if (filters?.page !== undefined) params.append('page', filters.page.toString());
  if (filters?.size !== undefined) params.append('size', filters.size.toString());
  if (filters?.departmentId) params.append('departmentId', filters.departmentId.toString());
  if (filters?.roleId) params.append('roleId', filters.roleId.toString());
  if (filters?.search) params.append('name', filters.search);

  const url = `${AUTH_ENDPOINTS.EMPLOYEES}?${params.toString()}`;
  console.log('🔍 EMPLOYEES API CALL:', url);
  
  try {
    const response = await apiClient.get<ApiResponse<EmployeeListResponse>>(url);
    console.log('📡 EMPLOYEES API RESPONSE:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ EMPLOYEES API ERROR:', error);
    throw error;
  }
};

/**
 * Get employee by empId
 */
export const getEmployeeById = async (empId: string): Promise<ApiResponse<Employee>> => {
  // ✅ ADD CONSOLE LOGS
  console.log('🔍 getEmployeeById - Input empId:', empId);
  
  const url = `/auth/employees/empId/${encodeURIComponent(empId)}`;
  console.log('🌐 getEmployeeById - URL:', url);
  
  try {
    const response = await apiClient.get<ApiResponse<Employee>>(url);
    console.log('✅ getEmployeeById - SUCCESS:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ getEmployeeById - ERROR:', error);
    throw error;
  }
};

/**
 * Create new employee
 */
export const createEmployee = async (
  data: CreateEmployeeRequest
): Promise<ApiResponse<Employee>> => {
  console.log('➕ Creating employee:', data);
  const response = await apiClient.post<ApiResponse<Employee>>(
    AUTH_ENDPOINTS.EMPLOYEES,
    data
  );
  return response.data;
};

/**
 * Update employee
 */
export const updateEmployee = async (
  empId: string,
  data: UpdateEmployeeRequest
): Promise<ApiResponse<Employee>> => {
  const response = await apiClient.put<ApiResponse<Employee>>(
    AUTH_ENDPOINTS.EMPLOYEE_BY_ID(empId),
    data
  );
  return response.data;
};

/**
 * Delete employee (soft delete)
 */
export const deleteEmployee = async (empId: string): Promise<ApiResponse<null>> => {
  const response = await apiClient.delete<ApiResponse<null>>(
    AUTH_ENDPOINTS.EMPLOYEE_BY_ID(empId)
  );
  return response.data;
};
