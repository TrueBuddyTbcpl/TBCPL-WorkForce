import { z } from 'zod';

export const basicInfoSchema = z.object({
  caseNumber: z.string().min(1, 'Case number is required'),
  clientName: z.string().min(1, 'Client name is required'),  // ✅ Changed
  clientProduct: z.string().min(1, 'Client product is required'),  // ✅ Changed
  priority: z.enum(['Low', 'Medium', 'High', 'Critical']),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  reportedDate: z.string().min(1, 'Reported date is required'),
  status: z.enum(['Open', 'Under Investigation', 'On Hold', 'Closed', 'Pending']),
});

export const clientDetailsSchema = z.object({
  clientName: z.string().min(2, 'Client name is required'),
  clientContact: z.string().optional(),
  clientEmail: z.string().email('Valid email required').optional().or(z.literal('')),
  productService: z.string().min(2, 'Product/Service information is required'),
  leadType: z.enum(['Client Lead', 'Trubuddy Lead']),
});

export const investigationSchema = z.object({
  assignedEmployees: z.array(z.string()).min(1, 'At least one employee must be assigned'),
  linkedCulprits: z.array(z.string()),
  estimatedCompletionDate: z.string().optional(),
  actualCompletionDate: z.string().optional(),
});
