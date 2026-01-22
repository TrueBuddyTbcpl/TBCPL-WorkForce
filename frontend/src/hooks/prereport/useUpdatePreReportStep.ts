// src/hooks/prereport/useUpdatePreReportStep.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../lib/api-client';

interface UpdateStepRequest {
  reportId: string;
  step: number;
  leadType: 'CLIENT_LEAD' | 'TRUEBUDDY_LEAD';
  data: any;
}

interface UpdateStepResponse {
  success: boolean;
  message: string;
  step: number;
  data: any;
}

export const useUpdatePreReportStep = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ reportId, step, leadType, data }: UpdateStepRequest) => {
      const leadTypeSlug = leadType === 'CLIENT_LEAD' ? 'client-lead' : 'truebuddy-lead';
      
      const { data: response } = await apiClient.put<UpdateStepResponse>(
        `/operation/prereport/${reportId}/${leadTypeSlug}/step/${step}`,
        data
      );
      return response;
    },
    onSuccess: (_, variables) => {
      // Invalidate the detail query to refresh data
      queryClient.invalidateQueries({ 
        queryKey: ['prereport', variables.reportId] 
      });
    },
    onError: (error: any) => {
      console.error('Failed to update step:', error);
      throw error;
    },
  });
};
