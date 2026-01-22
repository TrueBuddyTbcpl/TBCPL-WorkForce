// src/hooks/prereport/useCreatePreReport.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../lib/api-client';

interface CreatePreReportRequest {
  clientId: string;
  productIds: string[];
  leadType: 'CLIENT_LEAD' | 'TRUEBUDDY_LEAD';
}

interface CreatePreReportResponse {
  success: boolean;
  message: string;
  reportId: string;
  prereportId: number;
}

export const useCreatePreReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePreReportRequest) => {
      const { data: response } = await apiClient.post<CreatePreReportResponse>(
        '/operation/prereport/initialize',
        data
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prereports'] });
    },
  });
};
