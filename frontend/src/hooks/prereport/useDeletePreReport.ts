// src/hooks/prereport/useDeletePreReport.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../lib/api-client';

interface DeletePreReportResponse {
  success: boolean;
  message: string;
}

export const useDeletePreReport = () => {
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
