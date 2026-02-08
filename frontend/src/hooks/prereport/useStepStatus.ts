import { useQuery } from '@tanstack/react-query';
import { getReportStepStatus } from '../../services/api/prereport.service';

export const useStepStatus = (prereportId: number | undefined) => {
  return useQuery({
    queryKey: ['prereport-step-status', prereportId],
    queryFn: () => getReportStepStatus(prereportId!),
    enabled: !!prereportId,
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: true,
  });
};
