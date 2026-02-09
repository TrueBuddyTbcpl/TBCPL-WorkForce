import apiClient from './apiClient';
import { ADMIN_ENDPOINTS } from '../../utils/constants';
import type { ApiResponse } from '../../types/auth.types';

// ✅ Match your actual backend fields
export interface ClientProduct {
  id: number;
  productName: string;
  clientId?: number;
  clientName?: string;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
}

// ✅ Simplified request (only what backend needs)
export interface CreateClientProductRequest {
  productName: string;
  clientId: number;
}

export interface UpdateClientProductRequest {
  productName: string;
  clientId: number;
}

/**
 * Get all client products
 */
export const getClientProducts = async (): Promise<ApiResponse<ClientProduct[]>> => {
  console.log('📦 Fetching all client products');
  const response = await apiClient.get<ApiResponse<ClientProduct[]>>(
    ADMIN_ENDPOINTS.CLIENT_PRODUCTS
  );
  console.log('✅ Products fetched:', response.data);
  return response.data;
};

/**
 * Get products by client ID
 */
export const getProductsByClientId = async (
  clientId: number
): Promise<ApiResponse<ClientProduct[]>> => {
  console.log('📦 Fetching products for client:', clientId);
  const response = await apiClient.get<ApiResponse<ClientProduct[]>>(
    ADMIN_ENDPOINTS.CLIENT_PRODUCTS_BY_CLIENT(clientId)
  );
  console.log('✅ Products response:', response.data);
  return response.data;
};

/**
 * Get product by ID
 */
export const getClientProductById = async (
  id: number
): Promise<ApiResponse<ClientProduct>> => {
  const response = await apiClient.get<ApiResponse<ClientProduct>>(
    ADMIN_ENDPOINTS.CLIENT_PRODUCT_BY_ID(id)
  );
  return response.data;
};

/**
 * Create new client product
 */
export const createClientProduct = async (
  data: CreateClientProductRequest
): Promise<ApiResponse<ClientProduct>> => {
  console.log('➕ Creating client product:', data);
  const response = await apiClient.post<ApiResponse<ClientProduct>>(
    ADMIN_ENDPOINTS.CLIENT_PRODUCTS,
    data
  );
  return response.data;
};

/**
 * Update client product
 */
export const updateClientProduct = async (
  id: number,
  data: UpdateClientProductRequest
): Promise<ApiResponse<ClientProduct>> => {
  const response = await apiClient.put<ApiResponse<ClientProduct>>(
    ADMIN_ENDPOINTS.CLIENT_PRODUCT_BY_ID(id),
    data
  );
  return response.data;
};

/**
 * Delete client product
 */
export const deleteClientProduct = async (id: number): Promise<ApiResponse<null>> => {
  const response = await apiClient.delete<ApiResponse<null>>(
    ADMIN_ENDPOINTS.CLIENT_PRODUCT_BY_ID(id)
  );
  return response.data;
};
