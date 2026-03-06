import { useQuery } from '@tanstack/react-query';
import { fetchPrefill } from '../../services/finalReportService';

export const useFinalReportPrefill = (caseId: number | null) => {
  return useQuery({
    queryKey: ['finalreport-prefill', caseId],
    queryFn: () => fetchPrefill(caseId!),
    enabled: !!caseId,
    staleTime: 0,
    retry: false,
  });
};
