import { z } from 'zod';

// Basic Info Schema (Step 1) - Combined with Client Details
export const basicInfoSchema = z.object({
  caseNumber: z.string().min(1, 'Case number is required'),
  caseTitle: z.string().min(1, 'Case title is required'),
  clientName: z.string().min(1, 'Client name is required'),
  clientProduct: z.string().min(1, 'Client product is required'),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  status: z.enum(['open', 'in-progress', 'on-hold', 'closed']),
  description: z.string().optional(),
  dateOpened: z.string().min(1, 'Date opened is required'),
  dateClosed: z.string().optional(),
});

// Investigation Schema (Step 2)
export const investigationSchema = z.object({
  leadType: z.enum(['Client Lead', 'Trubuddy Lead']),
  assignedEmployees: z.array(z.string()).min(1, 'At least one employee must be assigned'),
  linkedCulprits: z.array(z.string()).optional(),
  estimatedCompletionDate: z.string().optional(),
  actualCompletionDate: z.string().optional(),
});

// Type exports
export type BasicInfoFormData = z.infer<typeof basicInfoSchema>;
export type InvestigationFormData = z.infer<typeof investigationSchema>;
