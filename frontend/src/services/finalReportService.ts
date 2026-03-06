import apiClient from './api/apiClient';
import type {
  CaseReportPrefillResponse,
  FinalReportResponse,
  FinalReportListItemResponse,
  ImageUploadResponse,
  CreateFinalReportRequest,
  UpdateFinalReportRequest,
  FinalReportStatusUpdateRequest
} from '../components/operations/report-create/types/report.types';

const BASE = '/operation/finalreport';

// ── Prefill ───────────────────────────────────────────────────────────────
export const fetchPrefill = async (
  caseId: number
): Promise<CaseReportPrefillResponse> => {
  const res = await apiClient.get(`${BASE}/prefill/${caseId}`);
  return res.data.data;
};

// ── Image Upload ──────────────────────────────────────────────────────────
export const uploadSectionImages = async (
  caseId: number,
  files: File[],
  username: string
  
): Promise<ImageUploadResponse> => {
  console.log('🔥 3. SERVICE CALLED, caseId:', caseId, 'files:', files.length);
  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));

  const res = await apiClient.post(`${BASE}/${caseId}/images`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'X-Username': username,
    },
  });
  return res.data.data;
};

// ── Create ────────────────────────────────────────────────────────────────
export const createFinalReport = async (
  payload: CreateFinalReportRequest,
  username: string
): Promise<FinalReportResponse> => {
  const res = await apiClient.post(BASE, payload, {
    headers: { 'X-Username': username },
  });
  return res.data.data;
};

// ── Get by ID ─────────────────────────────────────────────────────────────
export const getFinalReportById = async (
  reportId: number
): Promise<FinalReportResponse> => {
  const res = await apiClient.get(`${BASE}/${reportId}`);
  return res.data.data;
};

// ── Get by Case ID ────────────────────────────────────────────────────────
export const getFinalReportByCaseId = async (
  caseId: number
): Promise<FinalReportResponse> => {
  const res = await apiClient.get(`${BASE}/by-case/${caseId}`);
  return res.data.data;
};

// ── Update ────────────────────────────────────────────────────────────────
// ── Update ────────────────────────────────────────────────────────────────
export const updateFinalReport = async (
  reportId: number,
  payload: UpdateFinalReportRequest,
  username: string,
  isAdminEdit = false,
): Promise<FinalReportResponse> => {
  const res = await apiClient.put(`${BASE}/${reportId}`, payload, {
    headers: {
      'X-Username': username,
      'X-Admin-Edit': isAdminEdit ? 'true' : 'false',
    },
  });
  return res.data.data;
};


// ── Submit for Approval ───────────────────────────────────────────────────
export const submitForApproval = async (
  reportId: number,
  username: string
): Promise<FinalReportResponse> => {
  const res = await apiClient.post(
    `${BASE}/${reportId}/submit`,
    {},
    { headers: { 'X-Username': username } }
  );
  return res.data.data;
};

// ── Admin Status Update ───────────────────────────────────────────────────
export const updateReportStatus = async (
  reportId: number,
  payload: FinalReportStatusUpdateRequest,
  username: string
): Promise<FinalReportResponse> => {
  const res = await apiClient.patch(`${BASE}/${reportId}/status`, payload, {
    headers: { 'X-Username': username },
  });
  return res.data.data;
};

// ── List All ──────────────────────────────────────────────────────────────
export const getAllReports = async (
  page = 0,
  size = 10
): Promise<{ content: FinalReportListItemResponse[]; totalElements: number; totalPages: number }> => {
  const res = await apiClient.get(`${BASE}?page=${page}&size=${size}`);
  return res.data.data;
};

// ── Delete ────────────────────────────────────────────────────────────────
export const deleteFinalReport = async (reportId: number): Promise<void> => {
  await apiClient.delete(`${BASE}/${reportId}`);
};
