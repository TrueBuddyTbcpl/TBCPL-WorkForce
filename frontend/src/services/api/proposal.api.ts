import apiClient from './apiClient';
import { PROPOSAL_ENDPOINTS } from '../../utils/constants';
import type {
  ApiResponse,
  PageResponse,
  ProposalSummaryResponse,
  ProposalDetailResponse,
  ProposalStepStatusResponse,
  ProposalBackgroundResponse,
  ProposalScopeResponse,
  ProposalMethodologyResponse,
  ProposalFeeResponse,
  ProposalPaymentTermsResponse,
  ProposalConfidentialityResponse,
  ProposalObligationsResponse,
  ProposalConclusionResponse,
  CreateProposalRequest,
  UpdateProposalRequest,
  ProposalBackgroundRequest,
  ProposalScopeRequest,
  ProposalMethodologyRequest,
  ProposalFeeRequest,
  ProposalPaymentTermsRequest,
  ProposalConfidentialityRequest,
  ProposalObligationsRequest,
  ProposalConclusionRequest,
  ProposalStatusUpdateRequest,
} from '../../types/proposal.types';

export const createProposal = async (data: CreateProposalRequest): Promise<ApiResponse<ProposalSummaryResponse>> => {
  const res = await apiClient.post<ApiResponse<ProposalSummaryResponse>>(PROPOSAL_ENDPOINTS.BASE, data);
  return res.data;
};

export const getAllProposals = async (page = 0, size = 10): Promise<ApiResponse<PageResponse<ProposalSummaryResponse>>> => {
  const res = await apiClient.get<ApiResponse<PageResponse<ProposalSummaryResponse>>>(
    `${PROPOSAL_ENDPOINTS.BASE}?page=${page}&size=${size}&sortBy=createdAt&sortDir=desc`
  );
  return res.data;
};

export const getProposalById = async (id: number): Promise<ApiResponse<ProposalDetailResponse>> => {
  const res = await apiClient.get<ApiResponse<ProposalDetailResponse>>(PROPOSAL_ENDPOINTS.BY_ID(id));
  return res.data;
};

export const updateProposal = async (id: number, data: UpdateProposalRequest): Promise<ApiResponse<ProposalSummaryResponse>> => {
  const res = await apiClient.put<ApiResponse<ProposalSummaryResponse>>(PROPOSAL_ENDPOINTS.BY_ID(id), data);
  return res.data;
};

export const deleteProposal = async (id: number): Promise<ApiResponse<void>> => {
  const res = await apiClient.delete<ApiResponse<void>>(PROPOSAL_ENDPOINTS.BY_ID(id));
  return res.data;
};

export const saveBackground = async (id: number, data: ProposalBackgroundRequest): Promise<ApiResponse<ProposalBackgroundResponse>> => {
  const res = await apiClient.put<ApiResponse<ProposalBackgroundResponse>>(PROPOSAL_ENDPOINTS.BACKGROUND(id), data);
  return res.data;
};

export const saveScope = async (id: number, data: ProposalScopeRequest): Promise<ApiResponse<ProposalScopeResponse>> => {
  const res = await apiClient.put<ApiResponse<ProposalScopeResponse>>(PROPOSAL_ENDPOINTS.SCOPE(id), data);
  return res.data;
};

export const saveMethodology = async (id: number, data: ProposalMethodologyRequest): Promise<ApiResponse<ProposalMethodologyResponse>> => {
  const res = await apiClient.put<ApiResponse<ProposalMethodologyResponse>>(PROPOSAL_ENDPOINTS.METHODOLOGY(id), data);
  return res.data;
};

export const saveFee = async (id: number, data: ProposalFeeRequest): Promise<ApiResponse<ProposalFeeResponse>> => {
  const res = await apiClient.put<ApiResponse<ProposalFeeResponse>>(PROPOSAL_ENDPOINTS.FEE(id), data);
  return res.data;
};

export const savePaymentTerms = async (id: number, data: ProposalPaymentTermsRequest): Promise<ApiResponse<ProposalPaymentTermsResponse>> => {
  const res = await apiClient.put<ApiResponse<ProposalPaymentTermsResponse>>(PROPOSAL_ENDPOINTS.PAYMENT_TERMS(id), data);
  return res.data;
};

export const saveConfidentiality = async (id: number, data: ProposalConfidentialityRequest): Promise<ApiResponse<ProposalConfidentialityResponse>> => {
  const res = await apiClient.put<ApiResponse<ProposalConfidentialityResponse>>(PROPOSAL_ENDPOINTS.CONFIDENTIALITY(id), data);
  return res.data;
};

export const saveObligations = async (id: number, data: ProposalObligationsRequest): Promise<ApiResponse<ProposalObligationsResponse>> => {
  const res = await apiClient.put<ApiResponse<ProposalObligationsResponse>>(PROPOSAL_ENDPOINTS.OBLIGATIONS(id), data);
  return res.data;
};

export const saveConclusion = async (id: number, data: ProposalConclusionRequest): Promise<ApiResponse<ProposalConclusionResponse>> => {
  const res = await apiClient.put<ApiResponse<ProposalConclusionResponse>>(PROPOSAL_ENDPOINTS.CONCLUSION(id), data);
  return res.data;
};

export const getStepStatuses = async (id: number): Promise<ApiResponse<ProposalStepStatusResponse[]>> => {
  const res = await apiClient.get<ApiResponse<ProposalStepStatusResponse[]>>(PROPOSAL_ENDPOINTS.STEPS(id));
  return res.data;
};

export const updateProposalStatus = async (id: number, data: ProposalStatusUpdateRequest): Promise<ApiResponse<ProposalSummaryResponse>> => {
  const res = await apiClient.patch<ApiResponse<ProposalSummaryResponse>>(PROPOSAL_ENDPOINTS.STATUS(id), data);
  return res.data;
};

export const uploadSignatureStamp = async (id: number, file: File): Promise<ApiResponse<ProposalSummaryResponse>> => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await apiClient.post<ApiResponse<ProposalSummaryResponse>>(
    PROPOSAL_ENDPOINTS.SIGNATURE(id),
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return res.data;
};
