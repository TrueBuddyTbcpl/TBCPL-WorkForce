// src/hooks/prereport/usePreReportDetail.ts
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../lib/api-client';
import type { PreReport, ClientLeadData, TrueBuddyLeadData } from '../../types/prereport.types';

interface PreReportDetailResponse {
  preReport: PreReport;
  clientLeadData: ClientLeadData | null;
  trueBuddyLeadData: TrueBuddyLeadData | null;
}

export const usePreReportDetail = (reportId: string) => {
  return useQuery({
    queryKey: ['prereport', reportId],
    queryFn: async () => {
      const { data } = await apiClient.get<PreReportDetailResponse>(
        `/operation/prereport/${reportId}/detail`
      );
      return data;
    },
    enabled: !!reportId,
    staleTime: 30 * 1000,
  });
};
