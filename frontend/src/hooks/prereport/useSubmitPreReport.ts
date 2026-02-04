// src/hooks/prereport/useSubmitPreReport.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../lib/api-client';

interface SubmitPreReportResponse {
  success: boolean;
  message: string;
  reportId: string;
  status: string;
}

export const useSubmitPreReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reportId: string) => {
      const { data } = await apiClient.patch<SubmitPreReportResponse>(
        `/operation/prereport/${reportId}/status`,
        { reportStatus: 'WAITING_FOR_APPROVAL' }  // ✅ Backend expects "reportStatus"
      );
      return data;
    },
    onSuccess: (_, reportId) => {
      queryClient.invalidateQueries({ queryKey: ['prereport', reportId] });
      queryClient.invalidateQueries({ queryKey: ['prereports'] });
    },
    onError: (error: any) => {
      console.error('Failed to submit report:', error);
      throw error;
    },
  });
};
