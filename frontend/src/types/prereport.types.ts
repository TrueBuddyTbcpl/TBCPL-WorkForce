// src/types/prereport.types.ts
import {
  LeadType,
  ReportStatus,
  VerificationStatus,
  AssessmentType,
  QACompleteness,
  QAAccuracy,
  YesNoUnknown,
  YesNo,              // ← ADD
  RiskLevel,
  ProductCategory,
  InfringementType,
  NatureOfEntity,
  OperationScale,
  BrandExposure,
  ReasonOfSuspicion,  // ← ADD
  IntelNature,
  SuspectedActivity,
  // ❌ REMOVED: SupplyChainStage
} from '../utils/constants';


// ─── Dropdown Types ────────────────────────────────────────────────────────────
export interface Client {
  clientId: number;
  clientName: string;
}

export interface Product {
  productId: number;
  productName: string;
  clientId: number;
}


// ─── PreReport Base ────────────────────────────────────────────────────────────
export interface PreReport {
  id: number;
  reportId: string;
  clientId: number;
  clientName: string;
  productIds: number[];
  productNames: string[];
  leadType: LeadType;
  reportStatus: ReportStatus;
  currentStep: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  changeComments?: string;
  rejectionReason?: string;
}


// ─── Initialize Request ────────────────────────────────────────────────────────
export interface InitializeReportRequest {
  clientId: number;
  productIds: number[];
  leadType: LeadType;
}


// ─── Paginated Response ────────────────────────────────────────────────────────
export interface PaginatedResponse<T> {
  reports: T[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
}


// ─── Online Presence ───────────────────────────────────────────────────────────
export interface OnlinePresence {
  platformName: string;
  link: string;
}


// ══════════════════════════════════════════════════════════════════════════════
// CLIENT LEAD DATA TYPES (unchanged)
// ══════════════════════════════════════════════════════════════════════════════
export interface ClientLeadStep1 {
  dateInfoReceived: string;
}

export interface ClientLeadStep2 {
  scopeDueDiligence: boolean;
  scopeIprRetailer: boolean;
  scopeIprSupplier: boolean;
  scopeIprManufacturer: boolean;
  scopeOnlinePurchase: boolean;
  scopeOfflinePurchase: boolean;
  scopeCustomIds: number[];
}

export interface ClientLeadStep3 {
  entityName: string;
  suspectName: string;
  contactNumbers: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  onlinePresences: OnlinePresence[];
  productDetails: string;
  photosProvided: YesNoUnknown;
  videoProvided: YesNoUnknown;
  invoiceAvailable: YesNoUnknown;
  sourceNarrative: string;
}

export interface ClientLeadStep4 {
  verificationClientDiscussion: VerificationStatus;
  verificationClientDiscussionNotes: string;
  verificationOsint: VerificationStatus;
  verificationOsintNotes: string;
  verificationMarketplace: VerificationStatus;
  verificationMarketplaceNotes: string;
  verificationPretextCalling: VerificationStatus;
  verificationPretextCallingNotes: string;
  verificationProductReview: VerificationStatus;
  verificationProductReviewNotes: string;
}

export interface ClientLeadStep5 {
  obsIdentifiableTarget: string;
  obsTraceability: string;
  obsProductVisibility: string;
  obsCounterfeitingIndications: string;
  obsEvidentiary_gaps: string;
}

export interface ClientLeadStep6 {
  qaCompleteness: QACompleteness;
  qaAccuracy: QAAccuracy;
  qaIndependentInvestigation: YesNoUnknown;
  qaPriorConfrontation: YesNoUnknown;
  qaContaminationRisk: RiskLevel;
}

export interface ClientLeadStep7 {
  assessmentOverall: AssessmentType;
  assessmentRationale: string;
}

export interface ClientLeadStep8 {
  recMarketSurvey: boolean;
  recCovertInvestigation: boolean;
  recTestPurchase: boolean;
  recEnforcementAction: boolean;
  recAdditionalInfo: boolean;
  recClosureHold: boolean;
}

export interface ClientLeadStep9 {
  remarks: string;
}

export interface ClientLeadStep10 {
  customDisclaimer: string;
}

export interface ClientLeadData {
  id: number;
  prereportId: number;
  dateInfoReceived?: string;
  clientSpocName?: string;
  clientSpocContact?: string;
  scopeDueDiligence?: boolean;
  scopeIprRetailer?: boolean;
  scopeIprSupplier?: boolean;
  scopeIprManufacturer?: boolean;
  scopeOnlinePurchase?: boolean;
  scopeOfflinePurchase?: boolean;
  scopeCustomIds?: number[];
  entityName?: string;
  suspectName?: string;
  contactNumbers?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  pincode?: string;
  onlinePresences?: OnlinePresence[];
  productDetails?: string;
  photosProvided?: YesNoUnknown;
  videoProvided?: YesNoUnknown;
  invoiceAvailable?: YesNoUnknown;
  sourceNarrative?: string;
  verificationClientDiscussion?: VerificationStatus;
  verificationClientDiscussionNotes?: string;
  verificationOsint?: VerificationStatus;
  verificationOsintNotes?: string;
  verificationMarketplace?: VerificationStatus;
  verificationMarketplaceNotes?: string;
  verificationPretextCalling?: VerificationStatus;
  verificationPretextCallingNotes?: string;
  verificationProductReview?: VerificationStatus;
  verificationProductReviewNotes?: string;
  obsIdentifiableTarget?: string;
  obsTraceability?: string;
  obsProductVisibility?: string;
  obsCounterfeitingIndications?: string;
  obsEvidentiary_gaps?: string;
  qaCompleteness?: QACompleteness;
  qaAccuracy?: QAAccuracy;
  qaIndependentInvestigation?: YesNoUnknown;
  qaPriorConfrontation?: YesNoUnknown;
  qaContaminationRisk?: RiskLevel;
  assessmentOverall?: AssessmentType;
  assessmentRationale?: string;
  recMarketSurvey?: boolean;
  recCovertInvestigation?: boolean;
  recTestPurchase?: boolean;
  recEnforcementAction?: boolean;
  recAdditionalInfo?: boolean;
  recClosureHold?: boolean;
  remarks?: string;
  customDisclaimer?: string;
  verificationCustomData?: { optionId: number; status: string; notes: string }[];
  observationsCustomData?: { optionId: number; text: string }[];
  recCustomIds?: number[];
}


// ══════════════════════════════════════════════════════════════════════════════
// TRUEBUDDY LEAD STEP INTERFACES
// ══════════════════════════════════════════════════════════════════════════════

// ── Step 1 ────────────────────────────────────────────────────────────────────
export interface TrueBuddyLeadStep1 {
  dateInternalLeadGeneration: string;
  productCategory:            ProductCategory;
  productCategoryCustomText?: string;          // ← CHANGED: number → string
  infringementType:           InfringementType;
  infringementTypeCustomText?: string;         // ← CHANGED: number → string
  broadGeography:             string;
  reasonOfSuspicion?: ReasonOfSuspicion[];
  reasonOfSuspicionCustomText?: string;        // ← CHANGED: number → string
  expectedSeizure?:           string;
  natureOfEntity:             NatureOfEntity;
  natureOfEntityCustomText?:  string;          // ← CHANGED: number → string
}

// ── Step 2 (unchanged) ────────────────────────────────────────────────────────
export interface TrueBuddyLeadStep2 {
  scopeIprSupplier:        boolean;
  scopeIprManufacturer:    boolean;
  scopeIprStockist:        boolean;
  scopeMarketVerification: boolean;
  scopeEtp:                boolean;
  scopeEnforcement:        boolean;
}

// ── Step 3 ────────────────────────────────────────────────────────────────────
// ── Step 3 ────────────────────────────────────────────────────────────────────
export interface TrueBuddyLeadStep3 {
  intelNature:                 IntelNature;
  intelNatureCustomText?:      string;         // ← CHANGED: number → string
  suspectedActivity:           SuspectedActivity;
  suspectedActivityCustomText?: string;        // ← CHANGED: number → string
  productSegment:              ProductCategory;
  productSegmentCustomText?:   string;         // ← CHANGED: number → string
  repeatIntelligence:          YesNo;
  multiBrandRisk:              YesNo;
}

// ── Step 4 (unchanged) ────────────────────────────────────────────────────────
export interface TrueBuddyLeadStep4 {
  verificationIntelCorroboration:      VerificationStatus;
  verificationIntelCorroborationNotes: string;
  verificationOsint:                   VerificationStatus;
  verificationOsintNotes:              string;
  verificationPatternMapping:          VerificationStatus;
  verificationPatternMappingNotes:     string;
  verificationJurisdiction:            VerificationStatus;
  verificationJurisdictionNotes:       string;
  verificationRiskAssessment:          VerificationStatus;
  verificationRiskAssessmentNotes:     string;
}

// ── Step 5 ────────────────────────────────────────────────────────────────────
export interface TrueBuddyLeadStep5 {
  obsOperationScale:           OperationScale;
  obsCounterfeitLikelihood:    RiskLevel;
  obsBrandExposure:            BrandExposure;
  obsBrandExposureCustomText?: string;         // ← CHANGED: number → string
  obsEnforcementSensitivity:   RiskLevel;
}

// ── Step 6 ────────────────────────────────────────────────────────────────────
export interface TrueBuddyLeadStep6 {
  riskSourceReliability:    RiskLevel;
  riskClientConflict:       RiskLevel;
  riskImmediateAction:      YesNo;   // ← CHANGED from YesNoUnknown
  riskControlledValidation: YesNo;   // ← CHANGED from YesNoUnknown
  // ❌ REMOVED: riskPrematureDisclosure
}

// ── Step 7 (unchanged) ────────────────────────────────────────────────────────
export interface TrueBuddyLeadStep7 {
  assessmentOverall:   AssessmentType;
  assessmentRationale: string;
}

// ── Step 8 (unchanged) ────────────────────────────────────────────────────────
export interface TrueBuddyLeadStep8 {
  recCovertValidation:     boolean;
  recEtp:                  boolean;
  recMarketReconnaissance: boolean;
  recEnforcementDeferred:  boolean;
  recContinuedMonitoring:  boolean;
  recClientSegregation:    boolean;
}

// ── Step 9 ────────────────────────────────────────────────────────────────────
export interface TrueBuddyLeadStep9 {
  remarks: string;             // ← CHANGED from confidentialityNote
}

// ── Step 10 ───────────────────────────────────────────────────────────────────
export interface TrueBuddyLeadStep10 {
  customDisclaimer: string;    // ← CHANGED from remarks
}



// ══════════════════════════════════════════════════════════════════════════════
// TRUEBUDDY LEAD DATA (flat merged type used across all steps)
// ══════════════════════════════════════════════════════════════════════════════
export interface TrueBuddyLeadData {


  // ── Step 1 ─────────────────────────────────────────────────────────────────
  dateInternalLeadGeneration?: string;
  productCategory?:            string;
  productCategoryCustomText?:  string;         // ← CHANGED: number → string
  infringementType?:           string;
  infringementTypeCustomText?: string;         // ← CHANGED: number → string
  broadGeography?:             string;
  reasonOfSuspicion?:          string[];
  reasonOfSuspicionCustomText?: string;        // ← CHANGED: number → string
  expectedSeizure?:            string;
  natureOfEntity?:             string;
  natureOfEntityCustomText?:   string;         // ← CHANGED: number → string

  // ❌ REMOVED: clientSpocName, clientSpocDesignation

  // ── Step 2: Scope ──────────────────────────────────────────────────────────
  scopeIprSupplier?:        boolean;
  scopeIprManufacturer?:    boolean;
  scopeIprStockist?:        boolean;
  scopeMarketVerification?: boolean;
  scopeEtp?:                boolean;
  scopeEnforcement?:        boolean;

  // ── Step 3: Intelligence ───────────────────────────────────────────────────
  intelNature?:                 string;
  intelNatureCustomText?:       string;        // ← CHANGED: number → string
  suspectedActivity?:           string;
  suspectedActivityCustomText?: string;        // ← CHANGED: number → string
  productSegment?:              string;
  productSegmentCustomText?:    string;        // ← CHANGED: number → string
  repeatIntelligence?:          string;
  multiBrandRisk?:              string;

  // ── Step 4: Verification ───────────────────────────────────────────────────
  verificationIntelCorroboration?:      string;
  verificationIntelCorroborationNotes?: string;
  verificationOsint?:                   string;
  verificationOsintNotes?:              string;
  verificationPatternMapping?:          string;
  verificationPatternMappingNotes?:     string;
  verificationJurisdiction?:            string;
  verificationJurisdictionNotes?:       string;
  verificationRiskAssessment?:          string;
  verificationRiskAssessmentNotes?:     string;

  // ── Step 5: Observations ───────────────────────────────────────────────────
  obsOperationScale?:          string;
  obsCounterfeitLikelihood?:   string;
  obsBrandExposure?:           string;
  obsBrandExposureCustomText?: string;         // ← CHANGED: number → string
  obsEnforcementSensitivity?:  string;

  // ── Step 6: Risk Assessment ────────────────────────────────────────────────
  riskSourceReliability?:    string;
  riskClientConflict?:       string;
  riskImmediateAction?:      string;      // now YesNo values only
  riskControlledValidation?: string;      // now YesNo values only
  // ❌ REMOVED: riskPrematureDisclosure

  // ── Step 7: Assessment ────────────────────────────────────────────────────
  assessmentOverall?:   string;
  assessmentRationale?: string;

  // ── Step 8: Recommendations ───────────────────────────────────────────────
  recCovertValidation?:     boolean;
  recEtp?:                  boolean;
  recMarketReconnaissance?: boolean;
  recEnforcementDeferred?:  boolean;
  recContinuedMonitoring?:  boolean;
  recClientSegregation?:    boolean;

  // ── Step 9: Remarks ────────────────────────────────────────────────────────
  remarks?: string;              // ← MOVED from Step 10 (was confidentialityNote in Step 9)
  // ❌ REMOVED: confidentialityNote

  // ── Step 10: Disclaimer ────────────────────────────────────────────────────
  customDisclaimer?: string;     // ← MOVED from Step 11

  // ── Custom Data Payloads ───────────────────────────────────────────────────
  scopeCustomIds?:          number[];
  verificationCustomData?:  { optionId: number; status: string; notes: string }[];
  observationsCustomData?:  { optionId: number; text: string }[];
  riskCustomData?:          { optionId: number; value: string }[];
  recCustomIds?:            number[];
}


// ─── Report Detail Response ────────────────────────────────────────────────────
export interface PreReportDetailResponse {
  preReport: PreReport;
  clientLeadData: ClientLeadData | null;
  trueBuddyLeadData: TrueBuddyLeadData | null;
}


// ─── Custom Scope ──────────────────────────────────────────────────────────────
export interface CustomScope {
  id: number;
  prereportId: number;
  scopeName: string;
  scopeDescription: string;
}

export interface CreateCustomScopeRequest {
  scopeName: string;
  scopeDescription: string;
}


// ─── Update Status Request ─────────────────────────────────────────────────────
export interface UpdateStatusRequest {
  reportStatus: ReportStatus;
}


// ─── Step Status ───────────────────────────────────────────────────────────────
export interface StepStatusDetail {
  stepNumber: number;
  stepName: string;
  status: 'PENDING' | 'COMPLETED';
}

export interface PreReportStepStatusResponse {
  prereportId:      number;
  reportId:         string;
  leadType:         LeadType;
  reportStatus:     ReportStatus;
  currentStep:      number;
  canEdit:          boolean;
  changeComments?:  string;
  rejectionReason?: string;
  steps:            StepStatusDetail[];
}

export interface PreReportListResponse {
  reports:       PreReport[];
  currentPage:   number;
  totalPages:    number;
  totalElements: number;
  pageSize:      number;
}