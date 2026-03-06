import { useQuery } from '@tanstack/react-query';
import apiClient from '../../services/api/apiClient';
import type { CaseDetail } from '../../components/operations/Cases/types/case.types';

export const useCaseDetail = (caseId: number | null) => {
  return useQuery({
    queryKey: ['case', caseId],
    queryFn: async (): Promise<CaseDetail> => {
      const res = await apiClient.get(`/operation/cases/${caseId}`);
      return res.data?.data;
    },
    enabled: !!caseId,
  });
};
