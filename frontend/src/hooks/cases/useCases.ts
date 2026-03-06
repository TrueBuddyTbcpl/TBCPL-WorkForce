import { useQuery } from '@tanstack/react-query';
import apiClient from '../../services/api/apiClient';
import type { CaseListResponse } from '../../components/operations/Cases/types/case.types';

interface UseCasesParams {
  page?: number;
  size?: number;
  status?: string;
  clientId?: number;
}

export const useCases = ({ page = 0, size = 15, status, clientId }: UseCasesParams = {}) => {
  return useQuery({
    queryKey: ['cases', page, size, status, clientId],
    queryFn: async (): Promise<CaseListResponse> => {
      let url = '/operation/cases';

      if (status) {
        url = `/operation/cases/by-status/${status}`;
      } else if (clientId) {
        url = `/operation/cases/by-client/${clientId}`;
      }

      const res = await apiClient.get(url, {
        params: { page, size },
      });

      const data = res.data?.data;
      return {
        cases: data?.content || [],
        pagination: {
          currentPage: data?.number ?? page,
          totalPages: data?.totalPages ?? 1,
          totalCases: data?.totalElements ?? 0,
          pageSize: data?.size ?? size,
        },
      };
    },
  });
};
