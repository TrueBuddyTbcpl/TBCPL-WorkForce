// src/hooks/prereport/usePreReportDetail.ts
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../lib/api-client';
import type { PreReportDetailResponse } from '../../types/prereport.types';

export const usePreReportDetail = (reportId: string) => {
  return useQuery<PreReportDetailResponse>({
    queryKey: ['prereport', reportId, 'detail'],
    queryFn: async () => {
      const { data } = await apiClient.get<PreReportDetailResponse>(
        `/operation/prereport/${reportId}/detail`
      );
      
      console.log('API Response:', data); // Debug log
      
      return data;
    },
    enabled: !!reportId,
    staleTime: 30 * 1000,
  });
};
