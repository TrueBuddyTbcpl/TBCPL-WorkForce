// src/hooks/prereport/useUpdatePreReportStatus.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../lib/api-client';

interface UpdateStatusRequest {
  reportId: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
}

interface UpdateStatusResponse {
  success: boolean;
  message: string;
  reportId: string;
  status: string;
}

export const useUpdatePreReportStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ reportId, status }: UpdateStatusRequest) => {
      const { data } = await apiClient.patch<UpdateStatusResponse>(
        `/operation/prereport/${reportId}/status`,
        { status }
      );
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['prereport', variables.reportId] });
      queryClient.invalidateQueries({ queryKey: ['prereports'] });
    },
  });
};
