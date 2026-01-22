import { useQuery } from '@tanstack/react-query';
import { getReportDetail } from '../../services/api/prereport.service';
import { QUERY_KEYS } from '../../utils/constants';

export const usePreReportDetail = (reportId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.PREREPORT_DETAIL(reportId),
    queryFn: () => getReportDetail(reportId),
    enabled: !!reportId,
  });
};
