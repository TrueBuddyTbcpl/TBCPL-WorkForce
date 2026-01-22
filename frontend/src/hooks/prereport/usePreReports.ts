import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllReports,
  getReportsByClient,
  getReportsByLeadType,
  getReportsByStatus,
  deleteReport,
} from '../../services/api/prereport.service';
import { QUERY_KEYS } from '../../utils/constants';
import { LeadType, ReportStatus } from '../../utils/constants';

export const usePreReports = (page = 0, size = 10) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.PREREPORTS, page, size],
    queryFn: () => getAllReports(page, size),
  });
};

export const usePreReportsByClient = (clientId: number, page = 0, size = 10) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.PREREPORT_BY_CLIENT(clientId), page, size],
    queryFn: () => getReportsByClient(clientId, page, size),
    enabled: !!clientId,
  });
};

export const usePreReportsByLeadType = (leadType: LeadType, page = 0, size = 10) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.PREREPORT_BY_LEAD_TYPE(leadType), page, size],
    queryFn: () => getReportsByLeadType(leadType, page, size),
  });
};

export const usePreReportsByStatus = (status: ReportStatus, page = 0, size = 10) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.PREREPORT_BY_STATUS(status), page, size],
    queryFn: () => getReportsByStatus(status, page, size),
  });
};

export const useDeleteReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PREREPORTS });
    },
  });
};
