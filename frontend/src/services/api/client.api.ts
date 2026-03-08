import apiClient from './apiClient';
import { ADMIN_ENDPOINTS } from '../../utils/constants';
import type { ApiResponse } from '../../types/auth.types';

// ✅ Match your backend field names
export interface Client {
  clientId: number;  // ✅ Changed from 'id' to 'clientId'
  clientName: string;
  clientCode?: string;  // Optional if not in backend
  industry?: string;
  address?: string;
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
  isActive?: boolean;
  logoUrl?: string;
  clientLogo?: string;
  createdAt: string;
  updatedAt: string;
  deleted?: boolean;
}

export interface CreateClientRequest {
  clientName: string;
  clientCode?: string;
  industry?: string;
  address?: string;
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
}

export interface UpdateClientRequest extends CreateClientRequest {
  isActive?: boolean;
}

/**
 * Get all clients
 */
export const getClients = async (): Promise<ApiResponse<Client[]>> => {
  console.log('🏢 Fetching all clients');
  const response = await apiClient.get<ApiResponse<Client[]>>(ADMIN_ENDPOINTS.CLIENTS);
  console.log('✅ Clients fetched:', response.data);
  return response.data;
};

/**
 * Get client by ID
 */
export const getClientById = async (clientId: number): Promise<ApiResponse<Client>> => {
  const response = await apiClient.get<ApiResponse<Client>>(
    ADMIN_ENDPOINTS.CLIENT_BY_ID(clientId)
  );
  return response.data;
};

/**
 * Create new client
 */
export const createClient = async (
  data: CreateClientRequest
): Promise<ApiResponse<Client>> => {
  console.log('➕ Creating client:', data);
  const response = await apiClient.post<ApiResponse<Client>>(
    ADMIN_ENDPOINTS.CLIENTS,
    data
  );
  return response.data;
};




/**
 * Update client
 */
export const updateClient = async (
  clientId: number,
  data: UpdateClientRequest
): Promise<ApiResponse<Client>> => {
  const response = await apiClient.put<ApiResponse<Client>>(
    ADMIN_ENDPOINTS.CLIENT_BY_ID(clientId),
    data
  );
  return response.data;
};



/**
 * Delete client
 */
export const deleteClient = async (clientId: number): Promise<ApiResponse<null>> => {
  const response = await apiClient.delete<ApiResponse<null>>(
    ADMIN_ENDPOINTS.CLIENT_BY_ID(clientId)
  );
  return response.data;
};

/**
 * Upload client logo
 */
// Add to src/services/api/client.api.ts
export const uploadClientLogo = async (clientId: number, file: File) => {
  const formData = new FormData();
  formData.append('file', file); // must match @RequestParam("file") in backend

  const { data } = await apiClient.post(
    `/admin/clients/${clientId}/logo`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );

  return data.data; // returns ClientResponseDTO
};

