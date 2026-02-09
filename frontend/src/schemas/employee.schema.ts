import { z } from 'zod';
import { emailSchema, passwordSchema } from './auth.schema';

// Name validation
const nameSchema = z
  .string()
  .min(2, 'Must be at least 2 characters')
  .max(50, 'Must be less than 50 characters')
  .regex(/^[a-zA-Z]+$/, 'Only letters are allowed');

// Create Employee Schema
export const createEmployeeSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: nameSchema,
  middleName: z
    .string()
    .max(50, 'Must be less than 50 characters')
    .regex(/^[a-zA-Z]*$/, 'Only letters are allowed')
    .optional()
    .or(z.literal('')),
  lastName: nameSchema,
  departmentId: z.number().min(1, 'Department is required'),
  roleId: z.number().min(1, 'Role is required'),
});

export type CreateEmployeeFormData = z.infer<typeof createEmployeeSchema>;

// Update Employee Schema (no password or email)
export const updateEmployeeSchema = z.object({
  firstName: nameSchema,
  middleName: z
    .string()
    .max(50, 'Must be less than 50 characters')
    .regex(/^[a-zA-Z]*$/, 'Only letters are allowed')
    .optional()
    .or(z.literal('')),
  lastName: nameSchema,
  departmentId: z.number().min(1, 'Department is required'),
  roleId: z.number().min(1, 'Role is required'),
  isActive: z.boolean(),
});

export type UpdateEmployeeFormData = z.infer<typeof updateEmployeeSchema>;

// Department Schema
export const departmentSchema = z.object({
  departmentName: z
    .string()
    .min(2, 'Department name must be at least 2 characters')
    .max(50, 'Department name must be less than 50 characters')
    .regex(/^[a-zA-Z0-9\s_-]+$/, 'Only letters, numbers, spaces, hyphens and underscores allowed'),
});

export type DepartmentFormData = z.infer<typeof departmentSchema>;

// Update Department Schema
export const updateDepartmentSchema = z.object({
  departmentName: z
    .string()
    .min(2, 'Department name must be at least 2 characters')
    .max(50, 'Department name must be less than 50 characters')
    .regex(/^[a-zA-Z0-9\s_-]+$/, 'Only letters, numbers, spaces, hyphens and underscores allowed'),
  isActive: z.boolean(),
});

export type UpdateDepartmentFormData = z.infer<typeof updateDepartmentSchema>;

// Role Schema
export const roleSchema = z.object({
  roleName: z
    .string()
    .min(2, 'Role name must be at least 2 characters')
    .max(50, 'Role name must be less than 50 characters')
    .regex(/^[a-zA-Z0-9\s_-]+$/, 'Only letters, numbers, spaces, hyphens and underscores allowed'),
});

export type RoleFormData = z.infer<typeof roleSchema>;

// Update Role Schema
export const updateRoleSchema = z.object({
  roleName: z
    .string()
    .min(2, 'Role name must be at least 2 characters')
    .max(50, 'Role name must be less than 50 characters')
    .regex(/^[a-zA-Z0-9\s_-]+$/, 'Only letters, numbers, spaces, hyphens and underscores allowed'),
  isActive: z.boolean(),
});

export type UpdateRoleFormData = z.infer<typeof updateRoleSchema>;
