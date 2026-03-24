// ─── Enums ────────────────────────────────────────────────────────────────────

export const ProposalStatus = {
  DRAFT:                'DRAFT',
  IN_PROGRESS:          'IN_PROGRESS',
  WAITING_FOR_APPROVAL: 'WAITING_FOR_APPROVAL',
  REQUEST_FOR_CHANGES:  'REQUEST_FOR_CHANGES',
  APPROVED:             'APPROVED',
  DECLINED:             'DECLINED',
} as const;
export type ProposalStatus = (typeof ProposalStatus)[keyof typeof ProposalStatus];

export const ProposalServiceType = {
  DUE_DILIGENCE_INVESTIGATION:         'DUE_DILIGENCE_INVESTIGATION',
  INTELLECTUAL_PROPERTY_INVESTIGATION: 'INTELLECTUAL_PROPERTY_INVESTIGATION',
  CORPORATE_INVESTIGATION:             'CORPORATE_INVESTIGATION',
  ONLINE_MONITORING:                   'ONLINE_MONITORING',
} as const;
export type ProposalServiceType = (typeof ProposalServiceType)[keyof typeof ProposalServiceType];

export const ProposalServiceTypeLabels: Record<ProposalServiceType, string> = {
  DUE_DILIGENCE_INVESTIGATION:         'Due Diligence Investigation',
  INTELLECTUAL_PROPERTY_INVESTIGATION: 'Intellectual Property Investigation (IPR)',
  CORPORATE_INVESTIGATION:             'Corporate Investigation',
  ONLINE_MONITORING:                   'Online Monitoring',
};

export const StepName = {
  MAIN:                'MAIN',
  BACKGROUND:          'BACKGROUND',
  SCOPE_OF_WORK:       'SCOPE_OF_WORK',
  APPROACH_METHODOLOGY:'APPROACH_METHODOLOGY',
  PROFESSIONAL_FEE:    'PROFESSIONAL_FEE',
  PAYMENT_TERMS:       'PAYMENT_TERMS',
  CONFIDENTIALITY:     'CONFIDENTIALITY',
  SPECIAL_OBLIGATIONS: 'SPECIAL_OBLIGATIONS',
  CONCLUSION:          'CONCLUSION',
} as const;
export type StepName = (typeof StepName)[keyof typeof StepName];

export const StepStatus = {
  NOT_COMPLETED: 'NOT_COMPLETED',
  COMPLETED:     'COMPLETED',
} as const;
export type StepStatus = (typeof StepStatus)[keyof typeof StepStatus];

export const TextMode = {
  DEFAULT: 'DEFAULT',
  CUSTOM:  'CUSTOM',
} as const;
export type TextMode = (typeof TextMode)[keyof typeof TextMode];

// ─── Inner DTOs ───────────────────────────────────────────────────────────────

export interface ScopeItemDto {
  key:          string;
  label:        string;
  isPredefined: boolean;
  selected:     boolean;
}

export interface FeeComponentDto {
  type:      string;
  label:     string;
  amount:    number | null;
  isActuals: boolean;
}

// ─── Step Status ──────────────────────────────────────────────────────────────

export interface ProposalStepStatusResponse {
  stepName: StepName;
  status:   StepStatus;
}

// ─── Step Response Types ──────────────────────────────────────────────────────

export interface ProposalBackgroundResponse {
  id:             number;
  mode:           TextMode;
  backgroundText: string;
}

export interface ProposalScopeResponse {
  id:         number;
  scopeItems: ScopeItemDto[];
}

export interface ProposalMethodologyResponse {
  id:                              number;
  desktopDueDiligencePoints:       string[];
  marketGroundIntelligencePoints:  string[];
  productVerificationPoints:       string[];
  testPurchasePoints:              string[];
}

export interface ProposalFeeResponse {
  id:                      number;
  dueDiligenceFeeAmount:   number;
  feeComponents:           FeeComponentDto[];
  specialConditions:       string[];
}

export interface ProposalPaymentTermsResponse {
  id:               number;
  paymentTermsText: string;
}

export interface ProposalConfidentialityResponse {
  id:            number;
  paragraphMode: TextMode;
  paragraphText: string;
  customPoints:  string[];
}

export interface ProposalObligationsResponse {
  id:               number;
  clientId:         number;
  clientName:       string;
  obligationPoints: string[];
}

export interface ProposalConclusionResponse {
  id:            number;
  paragraphMode: TextMode;
  paragraphText: string;
}

// ─── Summary (List) ───────────────────────────────────────────────────────────

export interface ProposalSummaryResponse {
  proposalId:             number;
  proposalCode:           string;
  clientId:               number;
  clientName:             string;
  suspectEntityName:      string;
  projectTitle:           string;
  serviceType:            ProposalServiceType;
  serviceTypeDisplayName: string;
  status:                 ProposalStatus;
  proposalDate:           string;
  createdAt:              string;
  updatedAt:              string;
  createdBy:              string;
  steps:                  ProposalStepStatusResponse[];
}

// ─── Detail (Full) ────────────────────────────────────────────────────────────

export interface ProposalDetailResponse {
  proposalId:             number;
  proposalCode:           string;
  clientId:               number;
  clientName:             string;
  clientCompanyType:      string;
  suspectEntityName:      string;
  suspectEntityType:      string;
  projectTitle:           string;
  proposalDate:           string;
  targetProducts:         string;
  serviceType:            ProposalServiceType;
  serviceTypeDisplayName: string;
  status:                 ProposalStatus;
  preparedBy:             string;
  signatureStampPath:     string;
  createdAt:              string;
  updatedAt:              string;
  createdBy:              string;
  steps:                  ProposalStepStatusResponse[];
  background:             ProposalBackgroundResponse     | null;
  scopeOfWork:            ProposalScopeResponse          | null;
  methodology:            ProposalMethodologyResponse    | null;
  professionalFee:        ProposalFeeResponse            | null;
  paymentTerms:           ProposalPaymentTermsResponse   | null;
  confidentiality:        ProposalConfidentialityResponse| null;
  specialObligations:     ProposalObligationsResponse    | null;
  conclusion:             ProposalConclusionResponse     | null;
}

// ─── Paginated Response ───────────────────────────────────────────────────────

export interface PageResponse<T> {
  content:          T[];
  totalElements:    number;
  totalPages:       number;
  size:             number;
  number:           number;
  first:            boolean;
  last:             boolean;
}

// ─── API Response Wrapper ─────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success:   boolean;
  message:   string;
  data:      T;
  timestamp: string;
  errors:    any;
}

// ─── Request Types ────────────────────────────────────────────────────────────

export interface CreateProposalRequest {
  clientId:          number;
  clientCompanyType: string;
  suspectEntityName: string;
  suspectEntityType: string;
  projectTitle:      string;
  proposalDate:      string;
  targetProducts:    string;
  serviceType:       ProposalServiceType;
}

export interface UpdateProposalRequest extends CreateProposalRequest {}

export interface ProposalBackgroundRequest {
  mode:           TextMode;
  backgroundText: string;
}

export interface ProposalScopeRequest {
  scopeItems: ScopeItemDto[];
}

export interface ProposalMethodologyRequest {
  desktopDueDiligencePoints:      string[];
  marketGroundIntelligencePoints: string[];
  productVerificationPoints:      string[];
  testPurchasePoints:             string[];
}

export interface ProposalFeeRequest {
  dueDiligenceFeeAmount: number;
  feeComponents:         FeeComponentDto[];
  specialConditions:     string[];
}

export interface ProposalPaymentTermsRequest {
  paymentTermsText: string;
}

export interface ProposalConfidentialityRequest {
  paragraphMode: TextMode;
  paragraphText: string;
  customPoints:  string[];
}

export interface ProposalObligationsRequest {
  obligationPoints: string[];
}

export interface ProposalConclusionRequest {
  paragraphMode: TextMode;
  paragraphText: string;
}

export interface ProposalStatusUpdateRequest {
  status:                 ProposalStatus;
  remarks?:               string;
  sectionsNeedingChanges?:string;
}
