export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface Department {
  id: number;
  departmentName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}


export interface Employee {
  id: number;
  empId: string;
  email: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  fullName: string;
  departmentName: string;
  roleName: string;
  reportingManagerEmpId?: string;         // ← ADD
  reportingManagerName?: string;          // ← ADD
  profilePhotoUrl?: string;               // ← ADD
  emailVerified: boolean;
  isActive: boolean;
  lastPasswordChangeDate: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface CreateEmployeeRequest {
  firstName: string;
  lastName: string;
  middleName?: string;
  emailPrefix: string;    // ← ADD THIS
  emailDomain: string;    // ← already exists, keep it
  password: string;
  departmentId: number;
  roleId: number;
  reportingManagerEmpId?: string;
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
  content: Employee[];        // ← Spring Page uses "content"
  number: number;             // ← Spring Page uses "number" for current page
  totalPages: number;
  totalElements: number;
  size: number;
  first: boolean;
  last: boolean;
}

export interface EmployeeFilters {
  page?: number;
  size?: number;
  departmentId?: number;
  roleId?: number;
  search?: string;
}

export interface ReportingManagerOption {
  empId: string;
  fullName: string;
  roleName: string;
  departmentName: string;
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
