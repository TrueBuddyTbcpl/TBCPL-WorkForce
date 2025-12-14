import { z } from 'zod';

export const personalInfoSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  middleName: z.string().optional(),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['Male', 'Female', 'Other']),
  bloodGroup: z.string().optional(),
  nationality: z.string().min(2, 'Nationality is required'),
  profilePhoto: z.string().optional(),
});


export const physicalAttributesSchema = z.object({
  height: z.string().min(1, 'Height is required'),
  weight: z.string().min(1, 'Weight is required'),
  eyeColor: z.string().optional(),
  hairColor: z.string().optional(),
  skinTone: z.string().optional(),
  identificationMarks: z.string().optional(),
  disabilities: z.string().optional(),
});

export const addressInfoSchema = z.object({
  addressLine1: z.string().min(5, 'Address line 1 is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().regex(/^\d{6}$/, 'Valid 6-digit pincode required'),
  country: z.string().min(2, 'Country is required'),
  permanentAddressSame: z.boolean(),
});

export const contactInfoSchema = z.object({
  primaryPhone: z.string().regex(/^\d{10}$/, 'Valid 10-digit phone required'),
  secondaryPhone: z.string().regex(/^\d{10}$/, 'Valid 10-digit phone required').optional().or(z.literal('')),
  primaryEmail: z.string().email('Valid email required'),
  secondaryEmail: z.string().email('Valid email required').optional().or(z.literal('')),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().regex(/^\d{10}$/, 'Valid 10-digit phone required').optional().or(z.literal('')),
  emergencyContactRelation: z.string().optional(),
});

export const identificationDocsSchema = z.object({
  employeeId: z.string().optional(),
  aadhaarNumber: z.string().regex(/^\d{12}$/, 'Valid 12-digit Aadhaar required').optional().or(z.literal('')),
  aadhaarPhoto: z.string().optional(),
  panNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Valid PAN format required (e.g., ABCDE1234F)').optional().or(z.literal('')),
  panPhoto: z.string().optional(),
  drivingLicense: z.string().optional(),
  dlPhoto: z.string().optional(),
  passportNumber: z.string().optional(),
  passportPhoto: z.string().optional(),
  otherIdType: z.string().optional(),
  otherIdNumber: z.string().optional(),
  otherIdPhoto: z.string().optional(),
});

export const additionalInfoSchema = z.object({
  notes: z.string().optional(),
  behavioralNotes: z.string().optional(),
  riskLevel: z.enum(['Low', 'Medium', 'High', 'Critical']).optional(),
});
