export interface Employee {
  empId: string;
  email: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  fullName: string;
  departmentName: string;
  roleName: string;
  isActive: boolean;
  lastPasswordChangeDate: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface CreateEmployeeRequest {
  email: string;
  password: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  departmentId: number;
  roleId: number;
}

export interface UpdateEmployeeRequest {
  firstName: string;
  middleName?: string;
  lastName: string;
  departmentId: number;
  roleId: number;
  isActive: boolean;
}

export interface EmployeeListResponse {
  employees: Employee[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
}

export interface EmployeeFilters {
  page?: number;
  size?: number;
  departmentId?: number;
  roleId?: number;
  search?: string;
}

export interface Department {
  id: number;
  departmentName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface CreateDepartmentRequest {
  departmentName: string;
}

export interface UpdateDepartmentRequest {
  departmentName: string;
  isActive: boolean;
}

export interface Role {
  id: number;
  roleName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface CreateRoleRequest {
  roleName: string;
}

export interface UpdateRoleRequest {
  roleName: string;
  isActive: boolean;
}

export interface LoginAttempt {
  id: number;
  empId: string;
  email: string;
  ipAddress: string;
  deviceId: string;
  attemptTime: string;
  successful: boolean;
  failedAttempts: number;
}
