import { useMutation } from '@tanstack/react-query';
import { uploadSectionImages } from '../../services/finalReportService';

export const useUploadSectionImages = (caseId: number) => {
  return useMutation({
    mutationFn: ({
      files,
      username,
    }: {
      files: File[];
      username: string;
    }) => uploadSectionImages(caseId, files, username),
  });
};
