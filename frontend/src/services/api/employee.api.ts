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

  const response = await apiClient.get<ApiResponse<EmployeeListResponse>>(
    `${AUTH_ENDPOINTS.EMPLOYEES}?${params.toString()}`
  );
  return response.data;
};


/**
 * Get employee by empId (e.g., 2026/001)
 * FIX: Was using wrong URL /empId/ — correct path is /emp/
 */
export const getEmployeeById = async (id: number): Promise<ApiResponse<Employee>> => {
  const response = await apiClient.get<ApiResponse<Employee>>(
    AUTH_ENDPOINTS.EMPLOYEE_BY_DB_ID(id)   // ← uses /employees/{numericId}
  );
  return response.data;
};


/**
 * Create new employee
 * Backend auto-generates email from firstName + lastName + year + emailDomain
 */
export const createEmployee = async (
  data: CreateEmployeeRequest
): Promise<ApiResponse<Employee>> => {
  const response = await apiClient.post<ApiResponse<Employee>>(
    AUTH_ENDPOINTS.EMPLOYEES,
    data
  );
  return response.data;
};


/**
 * Update employee details
 * Uses DB numeric ID not empId
 */
export const updateEmployee = async (
  id: number,                                      // ← FIXED: was string empId, backend needs numeric id
  data: UpdateEmployeeRequest
): Promise<ApiResponse<Employee>> => {
  const response = await apiClient.put<ApiResponse<Employee>>(
    AUTH_ENDPOINTS.EMPLOYEE_BY_DB_ID(id),          // ← FIXED: use numeric DB id endpoint
    data
  );
  return response.data;
};


/**
 * Delete employee (soft delete)
 * Uses DB numeric ID
 */
export const deleteEmployee = async (id: number): Promise<ApiResponse<null>> => {  // ← FIXED: number not string
  const response = await apiClient.delete<ApiResponse<null>>(
    AUTH_ENDPOINTS.EMPLOYEE_BY_DB_ID(id)           // ← FIXED: use numeric DB id endpoint
  );
  return response.data;
};


/**
 * Get employees eligible as reporting managers
 * Returns: SUPER_ADMIN, ADMIN, MANAGER, HR_MANAGER roles only
 */
export const getReportingManagers = async (): Promise<ApiResponse<Employee[]>> => {
  const response = await apiClient.get<ApiResponse<Employee[]>>(
    AUTH_ENDPOINTS.REPORTING_MANAGERS
  );
  return response.data;
};


/**
 * Upload or replace employee profile photo
 * Sends as multipart/form-data to Cloudinary via backend
 */
export const uploadProfilePhoto = async (      // ← NEW
  id: number,
  file: File
): Promise<ApiResponse<Employee>> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post<ApiResponse<Employee>>(
    AUTH_ENDPOINTS.EMPLOYEE_PROFILE_PHOTO(id),
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return response.data;
};


/**
 * Resend email verification for an employee
 * ADMIN / SUPER_ADMIN only
 */
export const resendVerificationEmail = async (empId: string): Promise<ApiResponse<string>> => {  // ← NEW
  const response = await apiClient.post<ApiResponse<string>>(
    AUTH_ENDPOINTS.RESEND_VERIFICATION(empId)
  );
  return response.data;
};
