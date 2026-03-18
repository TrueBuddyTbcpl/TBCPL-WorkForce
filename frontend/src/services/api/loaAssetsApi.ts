import apiClient from './apiClient';
import type { LoaAssetsResponse } from '../../types/loaAssets.types';

const BASE = '/grnd-operation/loa/assets';

export const loaAssetsApi = {

  getAssets: async (): Promise<LoaAssetsResponse> => {
    const res = await apiClient.get(BASE);
    return res.data.data;
  },

  uploadLogo: async (file: File): Promise<LoaAssetsResponse> => {
    const form = new FormData();
    form.append('file', file);
    const res = await apiClient.post(`${BASE}/logo`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  },

  uploadStamp: async (file: File): Promise<LoaAssetsResponse> => {
    const form = new FormData();
    form.append('file', file);
    const res = await apiClient.post(`${BASE}/stamp`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  },

  uploadSignature: async (file: File): Promise<LoaAssetsResponse> => {
    const form = new FormData();
    form.append('file', file);
    const res = await apiClient.post(`${BASE}/signature`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  },

  deleteLogo: async (): Promise<LoaAssetsResponse> => {
    const res = await apiClient.delete(`${BASE}/logo`);
    return res.data.data;
  },

  deleteStamp: async (): Promise<LoaAssetsResponse> => {
    const res = await apiClient.delete(`${BASE}/stamp`);
    return res.data.data;
  },

  deleteSignature: async (): Promise<LoaAssetsResponse> => {
    const res = await apiClient.delete(`${BASE}/signature`);
    return res.data.data;
  },
};
