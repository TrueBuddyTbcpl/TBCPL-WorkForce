import { useQuery } from '@tanstack/react-query';
import { getFinalReportById, getFinalReportByCaseId } from '../../services/finalReportService';

export const useGetFinalReport = (reportId: number | null) => {
  return useQuery({
    queryKey: ['finalreport', reportId],
    queryFn: () => getFinalReportById(reportId!),
    enabled: !!reportId,
    staleTime: 30_000,
  });
};

export const useGetFinalReportByCaseId = (caseId: number | null) => {
  return useQuery({
    queryKey: ['finalreport-by-case', caseId],
    queryFn: () => getFinalReportByCaseId(caseId!),
    enabled: !!caseId,
    staleTime: 30_000,
  });
};
