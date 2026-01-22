// src/schemas/prereport.schemas.ts
import { z } from 'zod';
import {
  LeadType,
  VerificationStatus,
  AssessmentType,
  QACompleteness,
  QAAccuracy,
  YesNoUnknown,
  RiskLevel,
  ProductCategory,
  InfringementType,
  NatureOfEntity,
  OperationScale,
  BrandExposure,
  SupplyChainStage,
  IntelNature,
  SuspectedActivity,
} from '../utils/constants';

// Helper function to create enum validator from const object
const createEnumValidator = <T extends Record<string, string>>(enumObj: T) => {
  return z.enum(Object.values(enumObj) as [string, ...string[]]);
};

// Online Presence Schema
export const onlinePresenceSchema = z.object({
  platformName: z.string().min(1, 'Platform name is required'),
  link: z.string().url('Invalid URL format'),
});

// Initialize Report Schema
export const initializeReportSchema = z.object({
  clientId: z.number().min(1, 'Client is required'),
  productIds: z.array(z.number()).min(1, 'At least one product is required'),
  leadType: createEnumValidator(LeadType),
});

// ===================================
// CLIENT LEAD SCHEMAS (Steps 1-10)
// ===================================

export const clientLeadStep1Schema = z.object({
  dateInfoReceived: z.string().min(1, 'Date is required'),
  clientSpocName: z.string().min(2, 'Name must be at least 2 characters'),
  clientSpocContact: z.string().min(10, 'Valid contact number is required'),
});

export const clientLeadStep2Schema = z.object({
  scopeDueDiligence: z.boolean(),
  scopeIprRetailer: z.boolean(),
  scopeIprSupplier: z.boolean(),
  scopeIprManufacturer: z.boolean(),
  scopeOnlinePurchase: z.boolean(),
  scopeOfflinePurchase: z.boolean(),
  scopeCustomIds: z.array(z.number()).optional(),
});

export const clientLeadStep3Schema = z.object({
  entityName: z.string().min(2, 'Entity name is required'),
  suspectName: z.string().min(2, 'Suspect name is required'),
  contactNumbers: z.string().min(10, 'Contact number is required'),
  addressLine1: z.string().min(5, 'Address is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().regex(/^\d{6}$/, 'Pincode must be 6 digits'),
  onlinePresences: z.array(onlinePresenceSchema).optional(),
  productDetails: z.string().min(10, 'Product details are required'),
  photosProvided: createEnumValidator(YesNoUnknown),
  videoProvided: createEnumValidator(YesNoUnknown),
  invoiceAvailable: createEnumValidator(YesNoUnknown),
  sourceNarrative: z.string().min(20, 'Source narrative must be detailed'),
});

export const clientLeadStep4Schema = z.object({
  verificationClientDiscussion: createEnumValidator(VerificationStatus),
  verificationClientDiscussionNotes: z.string().optional(),
  verificationOsint: createEnumValidator(VerificationStatus),
  verificationOsintNotes: z.string().optional(),
  verificationMarketplace: createEnumValidator(VerificationStatus),
  verificationMarketplaceNotes: z.string().optional(),
  verificationPretextCalling: createEnumValidator(VerificationStatus),
  verificationPretextCallingNotes: z.string().optional(),
  verificationProductReview: createEnumValidator(VerificationStatus),
  verificationProductReviewNotes: z.string().optional(),
});

export const clientLeadStep5Schema = z.object({
  obsIdentifiableTarget: z.string().min(10, 'Observation required'),
  obsTraceability: z.string().min(10, 'Observation required'),
  obsProductVisibility: z.string().min(10, 'Observation required'),
  obsCounterfeitingIndications: z.string().min(10, 'Observation required'),
  obsEvidentiary_gaps: z.string().min(10, 'Observation required'),
});

export const clientLeadStep6Schema = z.object({
  qaCompleteness: createEnumValidator(QACompleteness),
  qaAccuracy: createEnumValidator(QAAccuracy),
  qaIndependentInvestigation: createEnumValidator(YesNoUnknown),
  qaPriorConfrontation: createEnumValidator(YesNoUnknown),
  qaContaminationRisk: createEnumValidator(RiskLevel),
});

export const clientLeadStep7Schema = z.object({
  assessmentOverall: createEnumValidator(AssessmentType),
  assessmentRationale: z.string().min(20, 'Detailed rationale is required'),
});

export const clientLeadStep8Schema = z.object({
  recMarketSurvey: z.boolean(),
  recCovertInvestigation: z.boolean(),
  recTestPurchase: z.boolean(),
  recEnforcementAction: z.boolean(),
  recAdditionalInfo: z.boolean(),
  recClosureHold: z.boolean(),
});

export const clientLeadStep9Schema = z.object({
  remarks: z.string().min(10, 'Remarks are required'),
});

export const clientLeadStep10Schema = z.object({
  customDisclaimer: z.string().min(20, 'Disclaimer text is required'),
});

// ===================================
// TRUEBUDDY LEAD SCHEMAS (Steps 1-11)
// ===================================

export const trueBuddyLeadStep1Schema = z.object({
  dateInternalLeadGeneration: z.string().min(1, 'Date is required'),
  productCategory: createEnumValidator(ProductCategory),
  infringementType: createEnumValidator(InfringementType),
  broadGeography: z.string().min(5, 'Geography is required'),
  clientSpocName: z.string().min(2, 'SPOC name is required'),
  clientSpocDesignation: z.string().min(2, 'Designation is required'),
  natureOfEntity: createEnumValidator(NatureOfEntity),
});

export const trueBuddyLeadStep2Schema = z.object({
  scopeIprSupplier: z.boolean(),
  scopeIprManufacturer: z.boolean(),
  scopeIprStockist: z.boolean(),
  scopeMarketVerification: z.boolean(),
  scopeEtp: z.boolean(),
  scopeEnforcement: z.boolean(),
});

export const trueBuddyLeadStep3Schema = z.object({
  intelNature: createEnumValidator(IntelNature),
  suspectedActivity: createEnumValidator(SuspectedActivity),
  productSegment: createEnumValidator(ProductCategory),
  supplyChainStage: createEnumValidator(SupplyChainStage),
  repeatIntelligence: createEnumValidator(YesNoUnknown),
  multiBrandRisk: createEnumValidator(YesNoUnknown),
});

export const trueBuddyLeadStep4Schema = z.object({
  verificationIntelCorroboration: createEnumValidator(VerificationStatus),
  verificationIntelCorroborationNotes: z.string().optional(),
  verificationOsint: createEnumValidator(VerificationStatus),
  verificationOsintNotes: z.string().optional(),
  verificationPatternMapping: createEnumValidator(VerificationStatus),
  verificationPatternMappingNotes: z.string().optional(),
  verificationJurisdiction: createEnumValidator(VerificationStatus),
  verificationJurisdictionNotes: z.string().optional(),
  verificationRiskAssessment: createEnumValidator(VerificationStatus),
  verificationRiskAssessmentNotes: z.string().optional(),
});

export const trueBuddyLeadStep5Schema = z.object({
  obsOperationScale: createEnumValidator(OperationScale),
  obsCounterfeitLikelihood: createEnumValidator(RiskLevel),
  obsBrandExposure: createEnumValidator(BrandExposure),
  obsEnforcementSensitivity: createEnumValidator(RiskLevel),
  obsLeakageRisk: createEnumValidator(RiskLevel),
});

export const trueBuddyLeadStep6Schema = z.object({
  riskSourceReliability: createEnumValidator(RiskLevel),
  riskClientConflict: createEnumValidator(RiskLevel),
  riskImmediateAction: createEnumValidator(YesNoUnknown),
  riskControlledValidation: createEnumValidator(YesNoUnknown),
  riskPrematureDisclosure: createEnumValidator(RiskLevel),
});

export const trueBuddyLeadStep7Schema = z.object({
  assessmentOverall: createEnumValidator(AssessmentType),
  assessmentRationale: z.string().min(20, 'Detailed rationale is required'),
});

export const trueBuddyLeadStep8Schema = z.object({
  recCovertValidation: z.boolean(),
  recEtp: z.boolean(),
  recMarketReconnaissance: z.boolean(),
  recEnforcementDeferred: z.boolean(),
  recContinuedMonitoring: z.boolean(),
  recClientSegregation: z.boolean(),
});

export const trueBuddyLeadStep9Schema = z.object({
  confidentialityNote: z.string().min(10, 'Confidentiality note is required'),
});

export const trueBuddyLeadStep10Schema = z.object({
  remarks: z.string().min(10, 'Remarks are required'),
});

export const trueBuddyLeadStep11Schema = z.object({
  customDisclaimer: z.string().min(20, 'Disclaimer text is required'),
});

// Export types
export type InitializeReportInput = z.infer<typeof initializeReportSchema>;
export type ClientLeadStep1Input = z.infer<typeof clientLeadStep1Schema>;
export type ClientLeadStep2Input = z.infer<typeof clientLeadStep2Schema>;
export type ClientLeadStep3Input = z.infer<typeof clientLeadStep3Schema>;
export type ClientLeadStep4Input = z.infer<typeof clientLeadStep4Schema>;
export type ClientLeadStep5Input = z.infer<typeof clientLeadStep5Schema>;
export type ClientLeadStep6Input = z.infer<typeof clientLeadStep6Schema>;
export type ClientLeadStep7Input = z.infer<typeof clientLeadStep7Schema>;
export type ClientLeadStep8Input = z.infer<typeof clientLeadStep8Schema>;
export type ClientLeadStep9Input = z.infer<typeof clientLeadStep9Schema>;
export type ClientLeadStep10Input = z.infer<typeof clientLeadStep10Schema>;
export type TrueBuddyLeadStep1Input = z.infer<typeof trueBuddyLeadStep1Schema>;
export type TrueBuddyLeadStep2Input = z.infer<typeof trueBuddyLeadStep2Schema>;
export type TrueBuddyLeadStep3Input = z.infer<typeof trueBuddyLeadStep3Schema>;
export type TrueBuddyLeadStep4Input = z.infer<typeof trueBuddyLeadStep4Schema>;
export type TrueBuddyLeadStep5Input = z.infer<typeof trueBuddyLeadStep5Schema>;
export type TrueBuddyLeadStep6Input = z.infer<typeof trueBuddyLeadStep6Schema>;
export type TrueBuddyLeadStep7Input = z.infer<typeof trueBuddyLeadStep7Schema>;
export type TrueBuddyLeadStep8Input = z.infer<typeof trueBuddyLeadStep8Schema>;
export type TrueBuddyLeadStep9Input = z.infer<typeof trueBuddyLeadStep9Schema>;
export type TrueBuddyLeadStep10Input = z.infer<typeof trueBuddyLeadStep10Schema>;
export type TrueBuddyLeadStep11Input = z.infer<typeof trueBuddyLeadStep11Schema>;
