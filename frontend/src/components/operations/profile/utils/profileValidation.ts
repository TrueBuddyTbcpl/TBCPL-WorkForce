import { z } from 'zod';

export const personalInfoSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),  // required
  middleName: z.string().optional(),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  dateOfBirth: z.string().optional(),
  gender: z.enum(['Male', 'Female', 'Other']).optional(),
  bloodGroup: z.string().optional(),
  nationality: z.string().optional(),
  profilePhoto: z.string().optional(),
});

export const physicalAttributesSchema = z.object({
  height: z.string().optional(),
  weight: z.string().optional(),
  eyeColor: z.string().optional(),
  hairColor: z.string().optional(),
  skinTone: z.string().optional(),
  identificationMarks: z.string().optional(),
  disabilities: z.string().optional(),
});

export const addressInfoSchema = z.object({
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  country: z.string().optional(),
  permanentAddressSame: z.boolean().optional(),
  permanentAddress: z.object({
    addressLine1: z.string().optional(),
    addressLine2: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    pincode: z.string().optional(),
    country: z.string().optional(),
  }).optional(),
});


export const contactInfoSchema = z.object({
  primaryPhone: z.string().optional(),
  secondaryPhone: z.string().optional(),
  primaryEmail: z.string().optional(),
  secondaryEmail: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  emergencyContactRelation: z.string().optional(),
});

export const identificationDocsSchema = z.object({
  employeeId: z.string().optional(),
  aadhaarNumber: z.string().optional(),
  aadhaarPhoto: z.string().optional(),
  panNumber: z.string().optional(),
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
  tags: z.array(z.string()).optional(),
  additionalPhotos: z.array(z.string()).optional(),
  attachments: z.array(z.string()).optional(),
  linkedCases: z.array(z.string()).optional(),
});
