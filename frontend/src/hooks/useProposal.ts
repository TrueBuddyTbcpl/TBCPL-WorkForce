import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { PROPOSAL_QUERY_KEYS } from '../utils/constants';
import {
  createProposal, getAllProposals, getProposalById,
  updateProposal, deleteProposal,
  saveBackground, saveScope, saveMethodology, saveFee,
  savePaymentTerms, saveConfidentiality, saveObligations, saveConclusion,
  getStepStatuses, updateProposalStatus, uploadSignatureStamp,
} from '../services/api/proposal.api';
import type {
  CreateProposalRequest, UpdateProposalRequest,
  ProposalBackgroundRequest, ProposalScopeRequest,
  ProposalMethodologyRequest, ProposalFeeRequest,
  ProposalPaymentTermsRequest, ProposalConfidentialityRequest,
  ProposalObligationsRequest, ProposalConclusionRequest,
  ProposalStatusUpdateRequest,
} from '../types/proposal.types';

export const useProposals = (page = 0, size = 10) =>
  useQuery({
    queryKey: [PROPOSAL_QUERY_KEYS.ALL, page, size],
    queryFn:  () => getAllProposals(page, size),
  });

export const useProposal = (id: number) =>
  useQuery({
    queryKey: PROPOSAL_QUERY_KEYS.DETAIL(id),
    queryFn:  () => getProposalById(id),
    enabled:  !!id,
  });

export const useProposalSteps = (id: number) =>
  useQuery({
    queryKey: PROPOSAL_QUERY_KEYS.STEPS(id),
    queryFn:  () => getStepStatuses(id),
    enabled:  !!id,
  });

export const useCreateProposal = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateProposalRequest) => createProposal(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [PROPOSAL_QUERY_KEYS.ALL] });
      toast.success('Proposal created successfully');
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed to create proposal'),
  });
};

export const useUpdateProposal = (id: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateProposalRequest) => updateProposal(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PROPOSAL_QUERY_KEYS.DETAIL(id) });
      toast.success('Proposal updated successfully');
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed to update proposal'),
  });
};

export const useDeleteProposal = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteProposal(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [PROPOSAL_QUERY_KEYS.ALL] });
      toast.success('Proposal deleted successfully');
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed to delete proposal'),
  });
};

// ─── Step save hooks ──────────────────────────────────────────────────────────

const makeStepMutation = <T>(
  id: number,
  mutationFn: (data: T) => Promise<any>,
  label: string,
  qc: ReturnType<typeof useQueryClient>
) => ({
  mutationFn,
  onSuccess: () => {
    qc.invalidateQueries({ queryKey: PROPOSAL_QUERY_KEYS.DETAIL(id) });
    qc.invalidateQueries({ queryKey: PROPOSAL_QUERY_KEYS.STEPS(id) });
    toast.success(`${label} saved successfully`);
  },
  onError: (err: any) => toast.error(err?.response?.data?.message || `Failed to save ${label}`),
});

export const useSaveBackground = (id: number) => {
  const qc = useQueryClient();
  return useMutation(makeStepMutation<ProposalBackgroundRequest>(
    id, (data) => saveBackground(id, data), 'Background', qc
  ));
};

export const useSaveScope = (id: number) => {
  const qc = useQueryClient();
  return useMutation(makeStepMutation<ProposalScopeRequest>(
    id, (data) => saveScope(id, data), 'Scope of Work', qc
  ));
};

export const useSaveMethodology = (id: number) => {
  const qc = useQueryClient();
  return useMutation(makeStepMutation<ProposalMethodologyRequest>(
    id, (data) => saveMethodology(id, data), 'Methodology', qc
  ));
};

export const useSaveFee = (id: number) => {
  const qc = useQueryClient();
  return useMutation(makeStepMutation<ProposalFeeRequest>(
    id, (data) => saveFee(id, data), 'Professional Fee', qc
  ));
};

export const useSavePaymentTerms = (id: number) => {
  const qc = useQueryClient();
  return useMutation(makeStepMutation<ProposalPaymentTermsRequest>(
    id, (data) => savePaymentTerms(id, data), 'Payment Terms', qc
  ));
};

export const useSaveConfidentiality = (id: number) => {
  const qc = useQueryClient();
  return useMutation(makeStepMutation<ProposalConfidentialityRequest>(
    id, (data) => saveConfidentiality(id, data), 'Confidentiality', qc
  ));
};

export const useSaveObligations = (id: number) => {
  const qc = useQueryClient();
  return useMutation(makeStepMutation<ProposalObligationsRequest>(
    id, (data) => saveObligations(id, data), 'Special Obligations', qc
  ));
};

export const useSaveConclusion = (id: number) => {
  const qc = useQueryClient();
  return useMutation(makeStepMutation<ProposalConclusionRequest>(
    id, (data) => saveConclusion(id, data), 'Conclusion', qc
  ));
};

export const useUpdateProposalStatus = (id: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ProposalStatusUpdateRequest) => updateProposalStatus(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PROPOSAL_QUERY_KEYS.DETAIL(id) });
      qc.invalidateQueries({ queryKey: [PROPOSAL_QUERY_KEYS.ALL] });
      toast.success('Status updated successfully');
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed to update status'),
  });
};

export const useUploadSignatureStamp = (id: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => uploadSignatureStamp(id, file),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PROPOSAL_QUERY_KEYS.DETAIL(id) });
      toast.success('Signature stamp uploaded successfully');
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed to upload signature'),
  });
};
