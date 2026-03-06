import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../services/api/apiClient';
import type { CaseDocumentResponse } from '../../components/operations/Cases/types/case.types';

// ── Fetch all documents for a case ────────────────────────────────────
export const useCaseDocuments = (caseId: number) => {
  return useQuery({
    queryKey: ['case-documents', caseId],
    queryFn: async (): Promise<CaseDocumentResponse[]> => {
      const res = await apiClient.get(`/operation/cases/${caseId}/documents`);
      return res.data?.data || [];
    },
    enabled: !!caseId,
  });
};

// ── Upload document ────────────────────────────────────────────────────
export const useUploadDocument = (caseId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      file,
      uploadedBy,
    }: {
      file: File;
      uploadedBy: string;
    }): Promise<CaseDocumentResponse> => {
      const formData = new FormData();
      formData.append('file', file);

      const res = await apiClient.post(
        `/operation/cases/${caseId}/documents`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'X-Username': uploadedBy,
          },
        }
      );
      return res.data?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['case-documents', caseId] });
    },
  });
};

// ── Delete document ────────────────────────────────────────────────────
export const useDeleteDocument = (caseId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      documentId,
      requestedBy,
    }: {
      documentId: number;
      requestedBy: string;
    }): Promise<void> => {
      await apiClient.delete(
        `/operation/cases/${caseId}/documents/${documentId}`,
        {
          headers: { 'X-Username': requestedBy },
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['case-documents', caseId] });
    },
  });
};
