// src/hooks/prereport/usePreReports.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../lib/api-client';


interface PreReportListItem {
  id: number;
  reportId: string;
  clientName: string;
  leadType: string;
  status: string;
  createdBy: number;
  createdAt: string;
  productCount: number;
  clientId?: string;
  productIds?: string[];
  productNames?: string[];
  reportStatus?: string;
  isCompleted?: boolean;
}


interface DeletePreReportResponse {
  success: boolean;
  message: string;
}


// ✅ Backend Response (flat structure)
interface BackendPreReportListResponse {
  reports: PreReportListItem[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
}


// ✅ Frontend Response (nested structure for compatibility)
interface PreReportListResponse {
  reports: PreReportListItem[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalReports: number;
    totalElements: number;
    pageSize: number;
  };
}


interface UsePreReportsParams {
  page?: number;
  size?: number;
  clientId?: string;
  leadType?: string;
  status?: string;
  createdBy?: string;
}


export const usePreReports = (params: UsePreReportsParams = {}) => {
  const { page = 0, size = 10, clientId, leadType, status, createdBy } = params;
  
  // Build the appropriate endpoint based on filters
  let endpoint = '/operation/prereport/list';
  
  if (clientId) {
    endpoint = `/operation/prereport/list/client/${clientId}`;
  } else if (leadType) {
    endpoint = `/operation/prereport/list/lead-type/${leadType}`;
  } else if (status) {
    endpoint = `/operation/prereport/list/status/${status}`;
  } else if (createdBy) {
    endpoint = `/operation/prereport/list/created-by/${createdBy}`;
  }

  return useQuery({
    queryKey: ['prereports', page, size, clientId, leadType, status, createdBy],
    queryFn: async () => {
      const { data } = await apiClient.get<BackendPreReportListResponse>(endpoint, {
        params: { page, size },
      });
      
      // ✅ Transform backend response to include both flat and nested structures
      const transformedData: PreReportListResponse = {
        reports: data.reports,
        currentPage: data.currentPage,
        totalPages: data.totalPages,
        totalElements: data.totalElements,
        pageSize: data.pageSize,
        pagination: {
          currentPage: data.currentPage,
          totalPages: data.totalPages,
          totalReports: data.totalElements,  // Map totalElements to totalReports for backward compatibility
          totalElements: data.totalElements,
          pageSize: data.pageSize,
        },
      };
      
      return transformedData;
    },
    staleTime: 30 * 1000, // 30 seconds
  });
};


export const useDeleteReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reportId: string) => {
      const { data } = await apiClient.delete<DeletePreReportResponse>(
        `/operation/prereport/${reportId}`
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prereports'] });
    },
  });
};
