// src/hooks/prereport/usePreReports.ts
import { useQuery,useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../lib/api-client';

interface PreReportListItem {
  id: number;
  reportId: string;
  clientName: string;
  leadType: string;
  status: string;
  createdBy: string;
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



interface PreReportListResponse {
  reports: PreReportListItem[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalReports: number;
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
  const { page = 1, size = 10, clientId, leadType, status, createdBy } = params;
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
      const { data } = await apiClient.get<PreReportListResponse>(endpoint, {
        params: { page, size },
      });
      return data;
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

