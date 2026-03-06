import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createFinalReport } from '../../services/finalReportService';
import type { CreateFinalReportRequest } from '../../components/operations/report-create/types/report.types';

export const useCreateFinalReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      payload,
      username,
    }: {
      payload: CreateFinalReportRequest;
      username: string;
    }) => createFinalReport(payload, username),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finalreports'] });
    },
  });
};
