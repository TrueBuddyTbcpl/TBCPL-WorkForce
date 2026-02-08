import apiClient from './apiClient';
import type {
  Client,
  Product,
  PreReport,
  InitializeReportRequest,
  PaginatedResponse,
  PreReportDetailResponse,
  CustomScope,
  PreReportStepStatusResponse,
  CreateCustomScopeRequest,
  UpdateStatusRequest,
  ClientLeadStep1,
  ClientLeadStep2,
  ClientLeadStep3,
  ClientLeadStep4,
  ClientLeadStep5,
  ClientLeadStep6,
  ClientLeadStep7,
  ClientLeadStep8,
  ClientLeadStep9,
  ClientLeadStep10,
  TrueBuddyLeadStep1,
  TrueBuddyLeadStep2,
  TrueBuddyLeadStep3,
  TrueBuddyLeadStep4,
  TrueBuddyLeadStep5,
  TrueBuddyLeadStep6,
  TrueBuddyLeadStep7,
  TrueBuddyLeadStep8,
  TrueBuddyLeadStep9,
  TrueBuddyLeadStep10,
  TrueBuddyLeadStep11,
} from '../../types/prereport.types';
import { LeadType, ReportStatus } from '../../utils/constants';

const BASE_PATH = '/operation/prereport';

// ==================== DROPDOWN APIs ====================
export const getClients = async (): Promise<Client[]> => {
  const response = await apiClient.get<Client[]>(`${BASE_PATH}/dropdown/clients`);
  return response.data;
};

export const getProductsByClientId = async (clientId: number): Promise<Product[]> => {
  const response = await apiClient.get<Product[]>(`${BASE_PATH}/dropdown/products/client/${clientId}`);
  return response.data;
};

// ==================== REPORT MANAGEMENT APIs ====================
export const initializeReport = async (data: InitializeReportRequest): Promise<PreReport> => {
  const response = await apiClient.post<PreReport>(`${BASE_PATH}/initialize`, data);
  return response.data;
};

export const getAllReports = async (page = 0, size = 10): Promise<PaginatedResponse<PreReport>> => {
  const response = await apiClient.get<PaginatedResponse<PreReport>>(`${BASE_PATH}/list`, {
    params: { page, size },
  });
  return response.data;
};

export const getReportById = async (reportId: string): Promise<PreReport> => {
  const response = await apiClient.get<PreReport>(`${BASE_PATH}/${reportId}`);
  return response.data;
};

export const getReportDetail = async (reportId: string): Promise<PreReportDetailResponse> => {
  const response = await apiClient.get<PreReportDetailResponse>(`${BASE_PATH}/${reportId}/detail`);
  return response.data;
};

export const getReportsByClient = async (
  clientId: number,
  page = 0,
  size = 10
): Promise<PaginatedResponse<PreReport>> => {
  const response = await apiClient.get<PaginatedResponse<PreReport>>(
    `${BASE_PATH}/list/client/${clientId}`,
    { params: { page, size } }
  );
  return response.data;
};

export const getReportsByLeadType = async (
  leadType: LeadType,
  page = 0,
  size = 10
): Promise<PaginatedResponse<PreReport>> => {
  const response = await apiClient.get<PaginatedResponse<PreReport>>(
    `${BASE_PATH}/list/lead-type/${leadType}`,
    { params: { page, size } }
  );
  return response.data;
};

export const getReportsByStatus = async (
  status: ReportStatus,
  page = 0,
  size = 10
): Promise<PaginatedResponse<PreReport>> => {
  const response = await apiClient.get<PaginatedResponse<PreReport>>(
    `${BASE_PATH}/list/status/${status}`,
    { params: { page, size } }
  );
  return response.data;
};

export const getReportsByCreator = async (
  createdBy: string,
  page = 0,
  size = 10
): Promise<PaginatedResponse<PreReport>> => {
  const response = await apiClient.get<PaginatedResponse<PreReport>>(
    `${BASE_PATH}/list/created-by/${createdBy}`,
    { params: { page, size } }
  );
  return response.data;
};

export const updateReportStatus = async (
  reportId: string,
  data: UpdateStatusRequest
): Promise<PreReport> => {
  const response = await apiClient.patch<PreReport>(`${BASE_PATH}/${reportId}/status`, data);
  return response.data;
};

export const deleteReport = async (reportId: string): Promise<void> => {
  await apiClient.delete(`${BASE_PATH}/${reportId}`);
};

// ==================== CLIENT LEAD - STEP APIs ====================
export const updateClientLeadStep1 = async (
  prereportId: number,
  data: ClientLeadStep1
): Promise<void> => {
  await apiClient.put(`${BASE_PATH}/${prereportId}/client-lead/step/1`, data);
};

export const updateClientLeadStep2 = async (
  prereportId: number,
  data: ClientLeadStep2
): Promise<void> => {
  await apiClient.put(`${BASE_PATH}/${prereportId}/client-lead/step/2`, data);
};

export const updateClientLeadStep3 = async (
  prereportId: number,
  data: ClientLeadStep3
): Promise<void> => {
  await apiClient.put(`${BASE_PATH}/${prereportId}/client-lead/step/3`, data);
};

export const updateClientLeadStep4 = async (
  prereportId: number,
  data: ClientLeadStep4
): Promise<void> => {
  await apiClient.put(`${BASE_PATH}/${prereportId}/client-lead/step/4`, data);
};

export const updateClientLeadStep5 = async (
  prereportId: number,
  data: ClientLeadStep5
): Promise<void> => {
  await apiClient.put(`${BASE_PATH}/${prereportId}/client-lead/step/5`, data);
};

export const updateClientLeadStep6 = async (
  prereportId: number,
  data: ClientLeadStep6
): Promise<void> => {
  await apiClient.put(`${BASE_PATH}/${prereportId}/client-lead/step/6`, data);
};

export const updateClientLeadStep7 = async (
  prereportId: number,
  data: ClientLeadStep7
): Promise<void> => {
  await apiClient.put(`${BASE_PATH}/${prereportId}/client-lead/step/7`, data);
};

export const updateClientLeadStep8 = async (
  prereportId: number,
  data: ClientLeadStep8
): Promise<void> => {
  await apiClient.put(`${BASE_PATH}/${prereportId}/client-lead/step/8`, data);
};

export const updateClientLeadStep9 = async (
  prereportId: number,
  data: ClientLeadStep9
): Promise<void> => {
  await apiClient.put(`${BASE_PATH}/${prereportId}/client-lead/step/9`, data);
};

export const updateClientLeadStep10 = async (
  prereportId: number,
  data: ClientLeadStep10
): Promise<void> => {
  await apiClient.put(`${BASE_PATH}/${prereportId}/client-lead/step/10`, data);
};

// ==================== TRUEBUDDY LEAD - STEP APIs ====================
export const updateTrueBuddyLeadStep1 = async (
  prereportId: number,
  data: TrueBuddyLeadStep1
): Promise<void> => {
  await apiClient.put(`${BASE_PATH}/${prereportId}/truebuddy-lead/step/1`, data);
};

export const updateTrueBuddyLeadStep2 = async (
  prereportId: number,
  data: TrueBuddyLeadStep2
): Promise<void> => {
  await apiClient.put(`${BASE_PATH}/${prereportId}/truebuddy-lead/step/2`, data);
};

export const updateTrueBuddyLeadStep3 = async (
  prereportId: number,
  data: TrueBuddyLeadStep3
): Promise<void> => {
  await apiClient.put(`${BASE_PATH}/${prereportId}/truebuddy-lead/step/3`, data);
};

export const updateTrueBuddyLeadStep4 = async (
  prereportId: number,
  data: TrueBuddyLeadStep4
): Promise<void> => {
  await apiClient.put(`${BASE_PATH}/${prereportId}/truebuddy-lead/step/4`, data);
};

export const updateTrueBuddyLeadStep5 = async (
  prereportId: number,
  data: TrueBuddyLeadStep5
): Promise<void> => {
  await apiClient.put(`${BASE_PATH}/${prereportId}/truebuddy-lead/step/5`, data);
};

export const updateTrueBuddyLeadStep6 = async (
  prereportId: number,
  data: TrueBuddyLeadStep6
): Promise<void> => {
  await apiClient.put(`${BASE_PATH}/${prereportId}/truebuddy-lead/step/6`, data);
};

export const updateTrueBuddyLeadStep7 = async (
  prereportId: number,
  data: TrueBuddyLeadStep7
): Promise<void> => {
  await apiClient.put(`${BASE_PATH}/${prereportId}/truebuddy-lead/step/7`, data);
};

export const updateTrueBuddyLeadStep8 = async (
  prereportId: number,
  data: TrueBuddyLeadStep8
): Promise<void> => {
  await apiClient.put(`${BASE_PATH}/${prereportId}/truebuddy-lead/step/8`, data);
};

export const updateTrueBuddyLeadStep9 = async (
  prereportId: number,
  data: TrueBuddyLeadStep9
): Promise<void> => {
  await apiClient.put(`${BASE_PATH}/${prereportId}/truebuddy-lead/step/9`, data);
};

export const updateTrueBuddyLeadStep10 = async (
  prereportId: number,
  data: TrueBuddyLeadStep10
): Promise<void> => {
  await apiClient.put(`${BASE_PATH}/${prereportId}/truebuddy-lead/step/10`, data);
};

export const updateTrueBuddyLeadStep11 = async (
  prereportId: number,
  data: TrueBuddyLeadStep11
): Promise<void> => {
  await apiClient.put(`${BASE_PATH}/${prereportId}/truebuddy-lead/step/11`, data);
};

// Add this with your other API functions
export const getReportStepStatus = async (prereportId: number): Promise<PreReportStepStatusResponse> => {
  const response = await apiClient.get<PreReportStepStatusResponse>(
    `${BASE_PATH}/${prereportId}/step-status`
  );
  return response.data;
};


// ==================== CUSTOM SCOPE APIs ====================
export const getCustomScopes = async (prereportId: number): Promise<CustomScope[]> => {
  const response = await apiClient.get<CustomScope[]>(`${BASE_PATH}/${prereportId}/custom-scope`);
  return response.data;
};

export const createCustomScope = async (
  prereportId: number,
  data: CreateCustomScopeRequest
): Promise<CustomScope> => {
  const response = await apiClient.post<CustomScope>(
    `${BASE_PATH}/${prereportId}/custom-scope`,
    data
  );
  return response.data;
};

export const updateCustomScope = async (id: number, data: CreateCustomScopeRequest): Promise<CustomScope> => {
  const response = await apiClient.put<CustomScope>(`${BASE_PATH}/custom-scope/${id}`, data);
  return response.data;
};

export const deleteCustomScope = async (id: number): Promise<void> => {
  await apiClient.delete(`${BASE_PATH}/custom-scope/${id}`);
};
