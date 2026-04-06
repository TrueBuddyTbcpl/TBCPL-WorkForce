// src/schemas/prereport.schemas.ts
import { z } from 'zod';
import {
  LeadType,
  VerificationStatus,
  AssessmentType,
  QACompleteness,
  QAAccuracy,
  YesNoUnknown,
  YesNo,                 // ← ADD
  RiskLevel,
  ProductCategory,
  InfringementType,
  NatureOfEntity,
  OperationScale,
  BrandExposure,
  IntelNature,
  SuspectedActivity,
  ReasonOfSuspicion,     // ← ADD
  // ❌ REMOVED: SupplyChainStage
} from '../utils/constants';


const createEnumValidator = <T extends Record<string, string>>(enumObj: T) => {
  return z.enum(Object.values(enumObj) as [string, ...string[]]);
};


export const onlinePresenceSchema = z.object({
  platformName: z.string().optional(),
  link: z.string().url('Invalid URL format').optional(),
});


export const initializeReportSchema = z.object({
  clientId: z.number().min(1, 'Client is required'),
  productIds: z.array(z.number()).min(1, 'At least one product is required'),
  leadType: createEnumValidator(LeadType),
});


// ===================================
// CLIENT LEAD SCHEMAS — no changes
// ===================================

export const clientLeadStep1Schema = z.object({
  dateInfoReceived: z.string().optional(),
  clientSpocName: z.string().optional(),
  clientSpocContact: z.string().optional(),
});

export const clientLeadStep2Schema = z.object({
  scopeDueDiligence: z.boolean().optional(),
  scopeIprRetailer: z.boolean().optional(),
  scopeIprSupplier: z.boolean().optional(),
  scopeIprManufacturer: z.boolean().optional(),
  scopeOnlinePurchase: z.boolean().optional(),
  scopeOfflinePurchase: z.boolean().optional(),
  scopeCustomIds: z.array(z.number()).optional(),
});

export const clientLeadStep3Schema = z.object({
  entityName: z.string().optional(),
  suspectName: z.string().optional(),
  contactNumbers: z.string().optional(),
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  onlinePresences: z.array(onlinePresenceSchema).optional(),
  productDetails: z.string().optional(),
  photosProvided: createEnumValidator(YesNoUnknown).optional(),
  videoProvided: createEnumValidator(YesNoUnknown).optional(),
  invoiceAvailable: createEnumValidator(YesNoUnknown).optional(),
  sourceNarrative: z.string().optional(),
});

export const clientLeadStep4Schema = z.object({
  verificationClientDiscussion: createEnumValidator(VerificationStatus).optional(),
  verificationClientDiscussionNotes: z.string().optional(),
  verificationOsint: createEnumValidator(VerificationStatus).optional(),
  verificationOsintNotes: z.string().optional(),
  verificationMarketplace: createEnumValidator(VerificationStatus).optional(),
  verificationMarketplaceNotes: z.string().optional(),
  verificationPretextCalling: createEnumValidator(VerificationStatus).optional(),
  verificationPretextCallingNotes: z.string().optional(),
  verificationProductReview: createEnumValidator(VerificationStatus).optional(),
  verificationProductReviewNotes: z.string().optional(),
});

export const clientLeadStep5Schema = z.object({
  obsIdentifiableTarget: z.string().optional(),
  obsTraceability: z.string().optional(),
  obsProductVisibility: z.string().optional(),
  obsCounterfeitingIndications: z.string().optional(),
  obsEvidentiary_gaps: z.string().optional(),
});

export const clientLeadStep6Schema = z.object({
  qaCompleteness: createEnumValidator(QACompleteness).optional(),
  qaAccuracy: createEnumValidator(QAAccuracy).optional(),
  qaIndependentInvestigation: createEnumValidator(YesNoUnknown).optional(),
  qaPriorConfrontation: createEnumValidator(YesNoUnknown).optional(),
  qaContaminationRisk: createEnumValidator(RiskLevel).optional(),
});

export const clientLeadStep7Schema = z.object({
  assessmentOverall: createEnumValidator(AssessmentType).optional(),
  assessmentRationale: z.string().optional(),
});

export const clientLeadStep8Schema = z.object({
  recMarketSurvey: z.boolean().optional(),
  recCovertInvestigation: z.boolean().optional(),
  recTestPurchase: z.boolean().optional(),
  recEnforcementAction: z.boolean().optional(),
  recAdditionalInfo: z.boolean().optional(),
  recClosureHold: z.boolean().optional(),
});

export const clientLeadStep9Schema = z.object({
  remarks: z.string().optional(),
});

export const clientLeadStep10Schema = z.object({
  customDisclaimer: z.string().optional(),
});


// ===================================
// TRUEBUDDY LEAD SCHEMAS (Steps 1-10)
// ===================================

// ✅ Step 1: removed clientSpocName/Designation, added reasonOfSuspicion + expectedSeizure + customIds
export const trueBuddyLeadStep1Schema = z.object({
  dateInternalLeadGeneration:   z.string().optional(),
  productCategory:              createEnumValidator(ProductCategory).optional(),
  productCategoryCustomText:    z.string().optional(),        // ← CHANGED: z.number() → z.string()
  infringementType:             createEnumValidator(InfringementType).optional(),
  infringementTypeCustomText:   z.string().optional(),        // ← CHANGED: z.number() → z.string()
  broadGeography:               z.string().optional(),
  reasonOfSuspicion: z
    .array(createEnumValidator(ReasonOfSuspicion))
    .optional(),
  reasonOfSuspicionCustomText:  z.string().optional(),        // ← CHANGED: z.number() → z.string()
  expectedSeizure:              z.string().optional(),
  natureOfEntity:               createEnumValidator(NatureOfEntity).optional(),
  natureOfEntityCustomText:     z.string().optional(),        // ← CHANGED: z.number() → z.string()
});

// ✅ Step 2: no changes
export const trueBuddyLeadStep2Schema = z.object({
  scopeIprSupplier: z.boolean().optional(),
  scopeIprManufacturer: z.boolean().optional(),
  scopeIprStockist: z.boolean().optional(),
  scopeMarketVerification: z.boolean().optional(),
  scopeEtp: z.boolean().optional(),
  scopeEnforcement: z.boolean().optional(),
});

// ✅ Step 3: removed supplyChainStage, added customIds, YesNoUnknown → YesNo
export const trueBuddyLeadStep3Schema = z.object({
  intelNature:                  createEnumValidator(IntelNature).optional(),
  intelNatureCustomText:        z.string().optional(),        // ← CHANGED: z.number() → z.string()
  suspectedActivity:            createEnumValidator(SuspectedActivity).optional(),
  suspectedActivityCustomText:  z.string().optional(),        // ← CHANGED: z.number() → z.string()
  productSegment:               createEnumValidator(ProductCategory).optional(),
  productSegmentCustomText:     z.string().optional(),        // ← CHANGED: z.number() → z.string()
  repeatIntelligence:           createEnumValidator(YesNo).optional(),
  multiBrandRisk:               createEnumValidator(YesNo).optional(),
});

// ✅ Step 4: no changes
export const trueBuddyLeadStep4Schema = z.object({
  verificationIntelCorroboration: createEnumValidator(VerificationStatus).optional(),
  verificationIntelCorroborationNotes: z.string().optional(),
  verificationOsint: createEnumValidator(VerificationStatus).optional(),
  verificationOsintNotes: z.string().optional(),
  verificationPatternMapping: createEnumValidator(VerificationStatus).optional(),
  verificationPatternMappingNotes: z.string().optional(),
  verificationJurisdiction: createEnumValidator(VerificationStatus).optional(),
  verificationJurisdictionNotes: z.string().optional(),
  verificationRiskAssessment: createEnumValidator(VerificationStatus).optional(),
  verificationRiskAssessmentNotes: z.string().optional(),
});

// ✅ Step 5: removed obsLeakageRisk, added obsBrandExposureCustomId
export const trueBuddyLeadStep5Schema = z.object({
  obsOperationScale:           createEnumValidator(OperationScale).optional(),
  obsCounterfeitLikelihood:    createEnumValidator(RiskLevel).optional(),
  obsBrandExposure:            createEnumValidator(BrandExposure).optional(),
  obsBrandExposureCustomText:  z.string().optional(),         // ← CHANGED: z.number() → z.string()
  obsEnforcementSensitivity:   createEnumValidator(RiskLevel).optional(),
});

// ✅ Step 6: removed riskPrematureDisclosure, YesNoUnknown → YesNo
export const trueBuddyLeadStep6Schema = z.object({
  riskSourceReliability: createEnumValidator(RiskLevel).optional(),
  riskClientConflict: createEnumValidator(RiskLevel).optional(),
  riskImmediateAction: createEnumValidator(YesNo).optional(),        // ← CHANGED from YesNoUnknown
  riskControlledValidation: createEnumValidator(YesNo).optional(),   // ← CHANGED from YesNoUnknown
  // ❌ REMOVED: riskPrematureDisclosure
});

// ✅ Step 7: no changes
export const trueBuddyLeadStep7Schema = z.object({
  assessmentOverall: createEnumValidator(AssessmentType).optional(),
  assessmentRationale: z.string().optional(),
});

// ✅ Step 8: no changes
export const trueBuddyLeadStep8Schema = z.object({
  recCovertValidation: z.boolean().optional(),
  recEtp: z.boolean().optional(),
  recMarketReconnaissance: z.boolean().optional(),
  recEnforcementDeferred: z.boolean().optional(),
  recContinuedMonitoring: z.boolean().optional(),
  recClientSegregation: z.boolean().optional(),
});

// ✅ Step 9 (was Step10): Remarks
export const trueBuddyLeadStep9Schema = z.object({
  remarks: z.string().optional(),
  // ❌ REMOVED: old step9 was confidentialityNote — that schema is gone
});

// ✅ Step 10 (was Step11): Disclaimer
export const trueBuddyLeadStep10Schema = z.object({
  customDisclaimer: z.string().optional(),
});

// ❌ REMOVED: trueBuddyLeadStep11Schema (disclaimer moved to step10)
// ❌ REMOVED: old trueBuddyLeadStep9Schema (confidentialityNote)


// ===================================
// EXPORTED TYPES
// ===================================

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
export type TrueBuddyLeadStep9Input = z.infer<typeof trueBuddyLeadStep9Schema>;   // ← was Step10
export type TrueBuddyLeadStep10Input = z.infer<typeof trueBuddyLeadStep10Schema>; // ← was Step11
// ❌ REMOVED: TrueBuddyLeadStep11Input