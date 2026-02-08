// Lead Types
export const LeadType = {
  CLIENT_LEAD: 'CLIENT_LEAD',
  TRUEBUDDY_LEAD: 'TRUEBUDDY_LEAD',
} as const;
export type LeadType = (typeof LeadType)[keyof typeof LeadType];

// Report Status
export const ReportStatus = {
  DRAFT: 'DRAFT',
  IN_PROGRESS: 'IN_PROGRESS',
  WAITING_FOR_APPROVAL: 'WAITING_FOR_APPROVAL',
  REQUESTED_FOR_CHANGES: 'REQUESTED_FOR_CHANGES',
  REJECTED_BY_CLIENT: 'REJECTED_BY_CLIENT',
  READY_FOR_CREATE_CASE: 'READY_FOR_CREATE_CASE',
} as const;
export type ReportStatus = (typeof ReportStatus)[keyof typeof ReportStatus];

// Verification Status
export const VerificationStatus = {
  DONE: 'DONE',
  NOT_DONE: 'NOT_DONE',
  IN_PROGRESS: 'IN_PROGRESS',
} as const;
export type VerificationStatus = (typeof VerificationStatus)[keyof typeof VerificationStatus];

// Assessment Options
export const AssessmentType = {
  ACTIONABLE: 'ACTIONABLE',
  NOT_ACTIONABLE: 'NOT_ACTIONABLE',
  ACTIONABLE_AFTER_VALIDATION: 'ACTIONABLE_AFTER_VALIDATION',
  HOLD: 'HOLD',
} as const;
export type AssessmentType = (typeof AssessmentType)[keyof typeof AssessmentType];

// Quality Assessment - Completeness
export const QACompleteness = {
  COMPLETE: 'COMPLETE',
  INCOMPLETE: 'INCOMPLETE',
  PARTIAL: 'PARTIAL',
} as const;
export type QACompleteness = (typeof QACompleteness)[keyof typeof QACompleteness];

// Quality Assessment - Accuracy
export const QAAccuracy = {
  ACCURATE: 'ACCURATE',
  INACCURATE: 'INACCURATE',
  UNCERTAIN: 'UNCERTAIN',
} as const;
export type QAAccuracy = (typeof QAAccuracy)[keyof typeof QAAccuracy];

// Yes/No/Unknown
export const YesNoUnknown = {
  YES: 'YES',
  NO: 'NO',
  UNKNOWN: 'UNKNOWN',
} as const;
export type YesNoUnknown = (typeof YesNoUnknown)[keyof typeof YesNoUnknown];

// Risk Levels
export const RiskLevel = {
  HIGH: 'HIGH',
  MEDIUM: 'MEDIUM',
  LOW: 'LOW',
} as const;
export type RiskLevel = (typeof RiskLevel)[keyof typeof RiskLevel];

// Product Category (TrueBuddy)
export const ProductCategory = {
  CROP_PROTECTION: 'CROP_PROTECTION',
  SEEDS: 'SEEDS',
} as const;
export type ProductCategory = (typeof ProductCategory)[keyof typeof ProductCategory];

// Infringement Type (TrueBuddy)
export const InfringementType = {
  COUNTERFEIT: 'COUNTERFEIT',
  TRADEMARK: 'TRADEMARK',
  PATENT: 'PATENT',
  OTHER: 'OTHER',
} as const;
export type InfringementType = (typeof InfringementType)[keyof typeof InfringementType];

// Nature of Entity (TrueBuddy)
export const NatureOfEntity = {
  MANUFACTURER: 'MANUFACTURER',
  DISTRIBUTOR: 'DISTRIBUTOR',
  RETAILER: 'RETAILER',
  ONLINE_SELLER: 'ONLINE_SELLER',
} as const;
export type NatureOfEntity = (typeof NatureOfEntity)[keyof typeof NatureOfEntity];

// Operation Scale
export const OperationScale = {
  SMALL: 'SMALL',
  MEDIUM: 'MEDIUM',
  LARGE: 'LARGE',
} as const;
export type OperationScale = (typeof OperationScale)[keyof typeof OperationScale];

// Brand Exposure
export const BrandExposure = {
  SINGLE_BRAND: 'SINGLE_BRAND',
  MULTIPLE_BRANDS: 'MULTIPLE_BRANDS',
} as const;
export type BrandExposure = (typeof BrandExposure)[keyof typeof BrandExposure];

// Supply Chain Stage
export const SupplyChainStage = {
  UPSTREAM: 'UPSTREAM',
  MIDSTREAM: 'MIDSTREAM',
  DOWNSTREAM: 'DOWNSTREAM',
} as const;
export type SupplyChainStage = (typeof SupplyChainStage)[keyof typeof SupplyChainStage];

// Intelligence Nature
export const IntelNature = {
  MANUFACTURING: 'MANUFACTURING',
  DISTRIBUTION: 'MARKET',
  RETAIL: 'SUPPLY_CHAIN',
} as const;
export type IntelNature = (typeof IntelNature)[keyof typeof IntelNature];

// Suspected Activity
export const SuspectedActivity = {
  COUNTERFEITING: 'COUNTERFEITING',
  LOOK_ALIKE_PRODUCTS: 'LOOK_ALIKE_PRODUCTS',
  SPURIOUS_DISTRIBUTION: 'SPURIOUS_DISTRIBUTION',
} as const;
export type SuspectedActivity = (typeof SuspectedActivity)[keyof typeof SuspectedActivity];

// Query Keys
export const QUERY_KEYS = {
  CLIENTS: ['clients'],
  PRODUCTS: (clientId: number) => ['products', clientId],
  PREREPORTS: ['prereports'],
  PREREPORT_DETAIL: (reportId: string) => ['prereport', reportId],
  PREREPORT_BY_CLIENT: (clientId: number) => ['prereports', 'client', clientId],
  PREREPORT_BY_LEAD_TYPE: (leadType: LeadType) => ['prereports', 'leadType', leadType],
  PREREPORT_BY_STATUS: (status: ReportStatus) => ['prereports', 'status', status],
  CUSTOM_SCOPES: (prereportId: number) => ['customScopes', prereportId],
} as const;

// Status Display Labels
export const STATUS_LABELS: Record<ReportStatus, string> = {
  [ReportStatus.DRAFT]: 'Draft',
  [ReportStatus.IN_PROGRESS]: 'In Progress',
  [ReportStatus.WAITING_FOR_APPROVAL]: 'Waiting for Approval',
  [ReportStatus.REQUESTED_FOR_CHANGES]: 'Changes Requested',
  [ReportStatus.REJECTED_BY_CLIENT]: 'Rejected by Client',
  [ReportStatus.READY_FOR_CREATE_CASE]: 'Ready for Case Creation',
};

// Status Colors for Tailwind
export const STATUS_COLORS: Record<ReportStatus, string> = {
  [ReportStatus.DRAFT]: 'bg-gray-100 text-gray-800',
  [ReportStatus.IN_PROGRESS]: 'bg-blue-100 text-blue-800',
  [ReportStatus.WAITING_FOR_APPROVAL]: 'bg-yellow-100 text-yellow-800',
  [ReportStatus.REQUESTED_FOR_CHANGES]: 'bg-orange-100 text-orange-800',
  [ReportStatus.REJECTED_BY_CLIENT]: 'bg-red-100 text-red-800',
  [ReportStatus.READY_FOR_CREATE_CASE]: 'bg-green-100 text-green-800',
};

// Lead Type Labels
export const LEAD_TYPE_LABELS: Record<LeadType, string> = {
  [LeadType.CLIENT_LEAD]: 'Client Lead',
  [LeadType.TRUEBUDDY_LEAD]: 'TrueBuddy Lead',
};

// Step Counts
export const STEP_COUNTS = {
  [LeadType.CLIENT_LEAD]: 10,
  [LeadType.TRUEBUDDY_LEAD]: 11,
};

// API Endpoints
export const API_ENDPOINTS = {
  PREREPORT: '/operation/prereport',
  DROPDOWN: {
    CLIENTS: '/operation/prereport/dropdown/clients',
    PRODUCTS: (clientId: number) => `/operation/prereport/dropdown/products/client/${clientId}`,
  },
} as const;
