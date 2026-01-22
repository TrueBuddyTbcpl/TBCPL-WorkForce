import { useMutation, useQueryClient } from '@tanstack/react-query';
import { initializeReport } from '../../services/api/prereport.service';
import { QUERY_KEYS } from '../../utils/constants';
import type { InitializeReportRequest } from '../../types/prereport.types';

export const useCreatePreReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: InitializeReportRequest) => initializeReport(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PREREPORTS });
    },
  });
};
