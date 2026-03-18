import apiClient from './apiClient';
import type { LoaRequest, LoaResponse, EmployeeDropdown, ClientDropdown, LoaPage } from '../../types/loa.types';

const BASE = '/grnd-operation/loa';

export const loaApi = {

  // Dropdowns
  getEmployeeDropdown: async (): Promise<EmployeeDropdown[]> => {
    const res = await apiClient.get(`${BASE}/dropdown/employees`);
    return res.data.data;
  },

  getClientDropdown: async (): Promise<ClientDropdown[]> => {
    const res = await apiClient.get(`${BASE}/dropdown/clients`);
    return res.data.data;
  },

  // CRUD
  createLoa: async (data: LoaRequest): Promise<LoaResponse> => {
    const res = await apiClient.post(BASE, data);
    return res.data.data;
  },

  updateLoa: async (id: number, data: LoaRequest): Promise<LoaResponse> => {
    const res = await apiClient.put(`${BASE}/${id}`, data);
    return res.data.data;
  },

  finalizeLoa: async (id: number): Promise<LoaResponse> => {
    const res = await apiClient.put(`${BASE}/${id}/finalize`);
    return res.data.data;
  },

  // Mail
  sendMail: async (id: number): Promise<void> => {
    await apiClient.post(`${BASE}/${id}/send-mail`);
  },

  // PDF preview — returns blob URL string (caller must revoke when done)
  getPreviewBlobUrl: async (id: number): Promise<string> => {
    const res = await apiClient.get(`${BASE}/${id}/preview`, {
      responseType: 'blob',
    });
    return URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
  },

  // Download PDF — triggers browser download
  downloadPdf: async (id: number, loaNumber: string): Promise<void> => {
    const res = await apiClient.get(`${BASE}/${id}/preview`, {
      responseType: 'blob',
    });
    const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `${loaNumber}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  // List (paginated)
  getAllLoas: async (page = 0, size = 10): Promise<LoaPage> => {
    const res = await apiClient.get(BASE, {
      params: { page, size, sort: 'createdAt', direction: 'DESC' },
    });
    return res.data.data;
  },

  // Single LOA
  getLoaById: async (id: number): Promise<LoaResponse> => {
    const res = await apiClient.get(`${BASE}/${id}`);
    return res.data.data;
  },

  // Field Associate: all LOAs assigned to specific employee
  getLoasByEmployee: async (employeeId: number, page = 0, size = 10): Promise<LoaPage> => {
    const res = await apiClient.get(BASE, {
      params: { page, size, sort: 'createdAt', direction: 'DESC' },
    });
    // Filter client-side since backend returns all; field associate sees their own
    const all: LoaPage = res.data.data;
    const filtered = all.content.filter(l => l.employeeId === employeeId);
    return { ...all, content: filtered, totalElements: filtered.length };
  },
};
