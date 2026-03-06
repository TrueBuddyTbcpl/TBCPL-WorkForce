import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateReportStatus } from '../../services/finalReportService';
import type { FinalReportStatusUpdateRequest } from '../../components/operations/report-create/types/report.types';

export const useUpdateReportStatus = (reportId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      payload,
      username,
    }: {
      payload: FinalReportStatusUpdateRequest;
      username: string;
    }) => updateReportStatus(reportId, payload, username),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finalreport', reportId] });
    },
  });
};
