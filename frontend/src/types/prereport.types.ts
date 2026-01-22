import { LeadType, ReportStatus, VerificationStatus, AssessmentType, QACompleteness, QAAccuracy, YesNoUnknown, RiskLevel, ProductCategory, InfringementType, NatureOfEntity, OperationScale, BrandExposure, SupplyChainStage, IntelNature, SuspectedActivity } from '../utils/constants';

// Dropdown Types
export interface Client {
  clientId: number;
  clientName: string;
}

export interface Product {
  productId: number;
  productName: string;
  clientId: number;
}

// PreReport Base
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
}

// Initialize Request
export interface InitializeReportRequest {
  clientId: number;
  productIds: number[];
  leadType: LeadType;
}

// Paginated Response
export interface PaginatedResponse<T> {
  reports: T[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
}

// Online Presence
export interface OnlinePresence {
  platformName: string;
  link: string;
}

// Client Lead Data Types
export interface ClientLeadStep1 {
  dateInfoReceived: string;
  clientSpocName: string;
  clientSpocContact: string;
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
}

// TrueBuddy Lead Data Types
export interface TrueBuddyLeadStep1 {
  dateInternalLeadGeneration: string;
  productCategory: ProductCategory;
  infringementType: InfringementType;
  broadGeography: string;
  clientSpocName: string;
  clientSpocDesignation: string;
  natureOfEntity: NatureOfEntity;
}

export interface TrueBuddyLeadStep2 {
  scopeIprSupplier: boolean;
  scopeIprManufacturer: boolean;
  scopeIprStockist: boolean;
  scopeMarketVerification: boolean;
  scopeEtp: boolean;
  scopeEnforcement: boolean;
}

export interface TrueBuddyLeadStep3 {
  intelNature: IntelNature;
  suspectedActivity: SuspectedActivity;
  productSegment: ProductCategory;
  supplyChainStage: SupplyChainStage;
  repeatIntelligence: YesNoUnknown;
  multiBrandRisk: YesNoUnknown;
}

export interface TrueBuddyLeadStep4 {
  verificationIntelCorroboration: VerificationStatus;
  verificationIntelCorroborationNotes: string;
  verificationOsint: VerificationStatus;
  verificationOsintNotes: string;
  verificationPatternMapping: VerificationStatus;
  verificationPatternMappingNotes: string;
  verificationJurisdiction: VerificationStatus;
  verificationJurisdictionNotes: string;
  verificationRiskAssessment: VerificationStatus;
  verificationRiskAssessmentNotes: string;
}

export interface TrueBuddyLeadStep5 {
  obsOperationScale: OperationScale;
  obsCounterfeitLikelihood: RiskLevel;
  obsBrandExposure: BrandExposure;
  obsEnforcementSensitivity: RiskLevel;
  obsLeakageRisk: RiskLevel;
}

export interface TrueBuddyLeadStep6 {
  riskSourceReliability: RiskLevel;
  riskClientConflict: RiskLevel;
  riskImmediateAction: YesNoUnknown;
  riskControlledValidation: YesNoUnknown;
  riskPrematureDisclosure: RiskLevel;
}

export interface TrueBuddyLeadStep7 {
  assessmentOverall: AssessmentType;
  assessmentRationale: string;
}

export interface TrueBuddyLeadStep8 {
  recCovertValidation: boolean;
  recEtp: boolean;
  recMarketReconnaissance: boolean;
  recEnforcementDeferred: boolean;
  recContinuedMonitoring: boolean;
  recClientSegregation: boolean;
}

export interface TrueBuddyLeadStep9 {
  confidentialityNote: string;
}

export interface TrueBuddyLeadStep10 {
  remarks: string;
}

export interface TrueBuddyLeadStep11 {
  customDisclaimer: string;
}

export interface TrueBuddyLeadData {
  // Step 1: Basic Information
  dateInternalLeadGeneration?: string;
  productCategory?: string;  // Changed from ProductCategory enum
  infringementType?: string;  // Changed from InfringementType enum
  broadGeography?: string;
  clientSpocName?: string;
  clientSpocDesignation?: string;
  natureOfEntity?: string;  // Changed from NatureOfEntity enum

  // Step 2: Scope
  scopeIprSupplier?: boolean;
  scopeIprManufacturer?: boolean;
  scopeIprStockist?: boolean;
  scopeMarketVerification?: boolean;
  scopeEtp?: boolean;
  scopeEnforcement?: boolean;

  // Step 3: Intelligence
  intelNature?: string;  // Changed from IntelNature enum
  suspectedActivity?: string;  // Changed from SuspectedActivity enum
  productSegment?: string;  // Changed from ProductCategory enum
  supplyChainStage?: string;  // Changed from SupplyChainStage enum
  repeatIntelligence?: string;  // Changed from YesNoUnknown enum
  multiBrandRisk?: string;  // Changed from YesNoUnknown enum

  // Step 4: Verification
  verificationIntelCorroboration?: string;  // Changed from VerificationStatus enum
  verificationIntelCorroborationNotes?: string;
  verificationOsint?: string;  // Changed from VerificationStatus enum
  verificationOsintNotes?: string;
  verificationPatternMapping?: string;  // Changed from VerificationStatus enum
  verificationPatternMappingNotes?: string;
  verificationJurisdiction?: string;  // Changed from VerificationStatus enum
  verificationJurisdictionNotes?: string;
  verificationRiskAssessment?: string;  // Changed from VerificationStatus enum
  verificationRiskAssessmentNotes?: string;

  // Step 5: Observations
  obsOperationScale?: string;  // Changed from OperationScale enum
  obsCounterfeitLikelihood?: string;  // Changed from RiskLevel enum
  obsBrandExposure?: string;  // Changed from BrandExposure enum
  obsEnforcementSensitivity?: string;  // Changed from RiskLevel enum
  obsLeakageRisk?: string;  // Changed from RiskLevel enum

  // Step 6: Risk Assessment
  riskSourceReliability?: string;  // Changed from RiskLevel enum
  riskClientConflict?: string;  // Changed from RiskLevel enum
  riskImmediateAction?: string;  // Changed from YesNoUnknown enum
  riskControlledValidation?: string;  // Changed from YesNoUnknown enum
  riskPrematureDisclosure?: string;  // Changed from RiskLevel enum

  // Step 7: Assessment
  assessmentOverall?: string;  // Changed from AssessmentType enum
  assessmentRationale?: string;

  // Step 8: Recommendations
  recCovertValidation?: boolean;
  recEtp?: boolean;
  recMarketReconnaissance?: boolean;
  recEnforcementDeferred?: boolean;
  recContinuedMonitoring?: boolean;
  recClientSegregation?: boolean;

  // Step 9: Confidentiality
  confidentialityNote?: string;

  // Step 10: Remarks
  remarks?: string;

  // Step 11: Disclaimer
  customDisclaimer?: string;
}

// Report Detail Response
export interface PreReportDetailResponse {
  preReport: PreReport;
  clientLeadData: ClientLeadData | null;
  trueBuddyLeadData: TrueBuddyLeadData | null;
}

// Custom Scope
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

// Update Status Request
export interface UpdateStatusRequest {
  reportStatus: ReportStatus;
}
