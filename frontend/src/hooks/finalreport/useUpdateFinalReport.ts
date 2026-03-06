import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateFinalReport } from '../../services/finalReportService';
import type { UpdateFinalReportRequest } from '../../components/operations/report-create/types/report.types';

type UpdateFinalReportArgs = {
  payload: UpdateFinalReportRequest;
  username: string;
  isAdminEdit?: boolean;
};

export const useUpdateFinalReport = (reportId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ payload, username, isAdminEdit = false }: UpdateFinalReportArgs) =>
      updateFinalReport(reportId, payload, username, isAdminEdit),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finalreport', reportId] });
    },
  });
};
