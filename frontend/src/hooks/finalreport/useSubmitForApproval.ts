import { useMutation, useQueryClient } from '@tanstack/react-query';
import { submitForApproval } from '../../services/finalReportService';

export const useSubmitForApproval = (reportId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (username: string) => submitForApproval(reportId, username),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finalreport', reportId] });
    },
  });
};
