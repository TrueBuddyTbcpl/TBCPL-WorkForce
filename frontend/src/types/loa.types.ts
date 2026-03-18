export type LoaStatus = 'DRAFT' | 'FINALIZED';

export interface LoaResponse {
  id: number;
  loaNumber: string;
  employeeId: number;
  employeeName: string;
  employeeEmail: string;
  clientId: number;
  clientName: string;
  validUpto: string;        // "YYYY-MM-DD"
  status: LoaStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface LoaRequest {
  employeeId: number;
  clientId: number;
  validUpto: string;        // "YYYY-MM-DD"
}

export interface EmployeeDropdown {
  id: number;
  empId: string;
  fullName: string;
  email: string;
}

export interface ClientDropdown {
  clientId: number;
  clientName: string;
}

export interface LoaPage {
  content: LoaResponse[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
