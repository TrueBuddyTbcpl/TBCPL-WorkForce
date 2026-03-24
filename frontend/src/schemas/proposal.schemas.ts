import { z } from 'zod';

export const createProposalSchema = z.object({
  clientId:          z.number().min(1, 'Client is required'),
  clientCompanyType: z.string().max(100).optional().or(z.literal('')),
  suspectEntityName: z.string().max(255).optional().or(z.literal('')),
  suspectEntityType: z.string().max(100).optional().or(z.literal('')),
  projectTitle:      z.string().max(255).optional().or(z.literal('')),
  proposalDate:      z.string().min(1, 'Proposal date is required'),
  targetProducts:    z.string().max(500).optional().or(z.literal('')),
  serviceType:       z.enum([
    'DUE_DILIGENCE_INVESTIGATION',
    'INTELLECTUAL_PROPERTY_INVESTIGATION',
    'CORPORATE_INVESTIGATION',
    'ONLINE_MONITORING',
  ] as const),
});

export type CreateProposalFormData = z.infer<typeof createProposalSchema>;

export const proposalStatusUpdateSchema = z.object({
  status:                  z.enum(['DRAFT','IN_PROGRESS','WAITING_FOR_APPROVAL','REQUEST_FOR_CHANGES','APPROVED','DECLINED'] as const),
  remarks:                 z.string().optional().or(z.literal('')),
  sectionsNeedingChanges:  z.string().optional().or(z.literal('')),
});

export type ProposalStatusUpdateFormData = z.infer<typeof proposalStatusUpdateSchema>;
