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
  DISAPPROVED_BY_CLIENT: 'DISAPPROVED_BY_CLIENT',
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
  COMPLETED: 'COMPLETED',
  INCOMPLETED: 'INCOMPLETED',
  PARTIALLY_COMPLETED: 'PARTIALLY_COMPLETED',
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
  NOT_KNOWN: 'NOT_KNOWN',
} as const;
export type YesNoUnknown = (typeof YesNoUnknown)[keyof typeof YesNoUnknown];

export const YesNo = {
  YES: 'YES',
  NO: 'NO',
} as const;
export type YesNo = (typeof YesNo)[keyof typeof YesNo];

// Risk Levels
export const RiskLevel = {
  HIGH: 'HIGH',
  MEDIUM: 'MEDIUM',
  LOW: 'LOW',
} as const;
export type RiskLevel = (typeof RiskLevel)[keyof typeof RiskLevel];



// REPLACE existing block with this
export const ProductCategory = {
  CROP_PROTECTION: 'CROP_PROTECTION',
  SEEDS: 'SEEDS',
  CUSTOM: 'CUSTOM',        // ← ADD
} as const;
export type ProductCategory = (typeof ProductCategory)[keyof typeof ProductCategory];

// REPLACE existing block with this
export const InfringementType = {
  COUNTERFEIT: 'COUNTERFEIT',
  LOOKALIKE: 'LOOKALIKE',    // ← ADD
  TRADEMARK: 'TRADEMARK',
  PATENT: 'PATENT',
  OTHER: 'OTHER',
  CUSTOM: 'CUSTOM',          // ← ADD
} as const;
export type InfringementType = (typeof InfringementType)[keyof typeof InfringementType];

// REPLACE existing block with this
export const NatureOfEntity = {
  SUPPLIER: 'SUPPLIER',        // ← ADD
  MANUFACTURER: 'MANUFACTURER',
  PACKAGER: 'PACKAGER',        // ← ADD
  STOCKIST: 'STOCKIST',        // ← ADD
  DISTRIBUTOR: 'DISTRIBUTOR',
  RETAILER: 'RETAILER',
  ONLINE_SELLER: 'ONLINE_SELLER',
  CUSTOM: 'CUSTOM',            // ← ADD
} as const;
export type NatureOfEntity = (typeof NatureOfEntity)[keyof typeof NatureOfEntity];

// Operation Scale
export const OperationScale = {
  SMALL: 'SMALL',
  MEDIUM: 'MEDIUM',
  LARGE: 'LARGE',
} as const;
export type OperationScale = (typeof OperationScale)[keyof typeof OperationScale];

// REPLACE existing block with this
export const BrandExposure = {
  SINGLE_BRAND: 'SINGLE_BRAND',
  MULTIPLE_BRANDS: 'MULTIPLE_BRANDS',
  CUSTOM: 'CUSTOM',    // ← ADD
} as const;
export type BrandExposure = (typeof BrandExposure)[keyof typeof BrandExposure];

export const ReasonOfSuspicion = {
  SIGNIFICANTLY_LOW_COST: 'SIGNIFICANTLY_LOW_COST',
  UNAUTHORISED_ILLEGAL_SUPPLIER: 'UNAUTHORISED_ILLEGAL_SUPPLIER',
  POOR_PRINTING_AND_PACKAGING_QUALITY: 'POOR_PRINTING_AND_PACKAGING_QUALITY',
  BLACK_LISTED_SERIAL_NUMBERS: 'BLACK_LISTED_SERIAL_NUMBERS',
  REPEATED_SERIAL_NUMBERS: 'REPEATED_SERIAL_NUMBERS',
  SUSPICIOUS_BLACKLISTED_BATCH_NUMBER: 'SUSPICIOUS_BLACKLISTED_BATCH_NUMBER',
  PRINTING_ERROR: 'PRINTING_ERROR',
  CUSTOM: 'CUSTOM',
} as const;
export type ReasonOfSuspicion = (typeof ReasonOfSuspicion)[keyof typeof ReasonOfSuspicion];



// REPLACE existing block with this
export const IntelNature = {
  MARKET_INFORMATION: 'MARKET_INFORMATION',   // ← REPLACE all 3 old values
  SOURCE_INFORMATION: 'SOURCE_INFORMATION',
  CUSTOM: 'CUSTOM',
} as const;
export type IntelNature = (typeof IntelNature)[keyof typeof IntelNature];

// REPLACE existing block with this
export const SuspectedActivity = {
  COUNTERFEITING: 'COUNTERFEITING',
  LOOKALIKE: 'LOOKALIKE',                      // ← ADD
  LOOK_ALIKE_PRODUCTS: 'LOOK_ALIKE_PRODUCTS',
  SPURIOUS: 'SPURIOUS',                        // ← ADD
  SPURIOUS_DISTRIBUTION: 'SPURIOUS_DISTRIBUTION',
  CUSTOM: 'CUSTOM',                            // ← ADD
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
  [ReportStatus.DISAPPROVED_BY_CLIENT]: 'Disapproved by Client',
  [ReportStatus.READY_FOR_CREATE_CASE]: 'Ready for Case Creation',
};

// Status Colors for Tailwind
export const STATUS_COLORS: Record<ReportStatus, string> = {
  [ReportStatus.DRAFT]: 'bg-gray-100 text-gray-800',
  [ReportStatus.IN_PROGRESS]: 'bg-blue-100 text-blue-800',
  [ReportStatus.WAITING_FOR_APPROVAL]: 'bg-yellow-100 text-yellow-800',
  [ReportStatus.REQUESTED_FOR_CHANGES]: 'bg-orange-100 text-orange-800',
  [ReportStatus.DISAPPROVED_BY_CLIENT]: 'bg-red-100 text-red-800',
  [ReportStatus.READY_FOR_CREATE_CASE]: 'bg-green-100 text-green-800',
};

// Lead Type Labels
export const LEAD_TYPE_LABELS: Record<LeadType, string> = {
  [LeadType.CLIENT_LEAD]: 'Client Lead',
  [LeadType.TRUEBUDDY_LEAD]: 'TrueBuddy Lead',
};

// REPLACE existing block with this
export const STEP_COUNTS = {
  [LeadType.CLIENT_LEAD]: 10,
  [LeadType.TRUEBUDDY_LEAD]: 10,   // ← CHANGE from 11 to 10
};

// API Endpoints
export const API_ENDPOINTS = {
  PREREPORT: '/operation/prereport',
  DROPDOWN: {
    CLIENTS: '/operation/prereport/dropdown/clients',
    PRODUCTS: (clientId: number) => `/operation/prereport/dropdown/products/client/${clientId}`,
  },
} as const;

// ==================== AUTH CONSTANTS ====================

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER_INFO: 'userInfo',
  TOKEN_EXPIRY: 'tokenExpiry',
  DEVICE_ID: 'deviceId',
} as const;

// Role Types
export const UserRole = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  HR_MANAGER: 'HR_MANAGER',
  MANAGER: 'MANAGER',
  EMPLOYEE: 'EMPLOYEE',
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];


// ── Proposal Endpoints ──────────────────────────────────────────────────────
export const PROPOSAL_ENDPOINTS = {
  BASE:              '/admin/proposals',
  BY_ID:             (id: number) => `/admin/proposals/${id}`,
  BACKGROUND:        (id: number) => `/admin/proposals/${id}/background`,
  SCOPE:             (id: number) => `/admin/proposals/${id}/scope`,
  METHODOLOGY:       (id: number) => `/admin/proposals/${id}/methodology`,
  FEE:               (id: number) => `/admin/proposals/${id}/fee`,
  PAYMENT_TERMS:     (id: number) => `/admin/proposals/${id}/payment-terms`,
  CONFIDENTIALITY:   (id: number) => `/admin/proposals/${id}/confidentiality`,
  OBLIGATIONS:       (id: number) => `/admin/proposals/${id}/obligations`,
  CONCLUSION:        (id: number) => `/admin/proposals/${id}/conclusion`,
  STEPS:             (id: number) => `/admin/proposals/${id}/steps`,
  STATUS:            (id: number) => `/admin/proposals/${id}/status`,
  SIGNATURE:         (id: number) => `/admin/proposals/${id}/signature`,
} as const;

// ── Proposal Query Keys ─────────────────────────────────────────────────────
export const PROPOSAL_QUERY_KEYS = {
  ALL:    'proposals',
  DETAIL: (id: number) => ['proposal', id],
  STEPS:  (id: number) => ['proposal-steps', id],
} as const;

// ── Proposal Status Labels ──────────────────────────────────────────────────
export const PROPOSAL_STATUS_LABELS: Record<string, string> = {
  DRAFT:                  'Draft',
  IN_PROGRESS:            'In Progress',
  WAITING_FOR_APPROVAL:   'Waiting for Approval',
  REQUEST_FOR_CHANGES:    'Changes Requested',
  APPROVED:               'Approved',
  DECLINED:               'Declined',
};

// ── Proposal Status Colors ──────────────────────────────────────────────────
export const PROPOSAL_STATUS_COLORS: Record<string, string> = {
  DRAFT:                'bg-gray-100 text-gray-800',
  IN_PROGRESS:          'bg-blue-100 text-blue-800',
  WAITING_FOR_APPROVAL: 'bg-yellow-100 text-yellow-800',
  REQUEST_FOR_CHANGES:  'bg-orange-100 text-orange-800',
  APPROVED:             'bg-green-100 text-green-800',
  DECLINED:             'bg-red-100 text-red-800',
};

// ── Proposal Step Labels ────────────────────────────────────────────────────
export const PROPOSAL_STEP_LABELS: Record<string, string> = {
  MAIN:                'Basic Info',
  BACKGROUND:          'Background',
  SCOPE_OF_WORK:       'Scope of Work',
  APPROACH_METHODOLOGY:'Methodology',
  PROFESSIONAL_FEE:    'Professional Fee',
  PAYMENT_TERMS:       'Payment Terms',
  CONFIDENTIALITY:     'Confidentiality',
  SPECIAL_OBLIGATIONS: 'Special Obligations',
  CONCLUSION:          'Conclusion',
};

// API Endpoints - Auth Module
export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  ADMIN_RESET_PASSWORD: '/auth/admin/reset-password',
  CHANGE_PASSWORD: '/auth/change-password',
  EMPLOYEE_BY_DB_ID: (id: number) => `/auth/employees/${id}`, 
  RESET_PASSWORD: '/auth/reset-password',
  RESEND_VERIFICATION: (empId: string) => `/auth/resend-verification/${empId}`, 
  PROFILE: '/auth/profile',                                              // ← ADD
  VERIFY_EMAIL: (token: string) => `/auth/verify-email?token=${token}`,
  EMPLOYEES: '/auth/employees',
  EMPLOYEE_BY_ID: (empId: string) => `/auth/employees/empId/${empId}`,
  EMPLOYEE_BY_EMP_ID: (empId: string) => `/auth/employees/emp/${empId}`, // ← ADD (matches backend)
  EMPLOYEE_PROFILE_PHOTO: (id: number) => `/auth/employees/${id}/profile-photo`, // ← ADD
  REPORTING_MANAGERS: '/auth/employees/reporting-managers',  
  DEPARTMENTS: '/auth/departments',
  DEPARTMENT_BY_ID: (id: number) => `/auth/departments/${id}`,
  ROLES: '/auth/roles',
  ROLE_BY_ID: (id: number) => `/auth/roles/${id}`,
  ROLES_ASSIGNABLE: '/auth/roles/assignable', 
  LOGIN_ATTEMPTS: '/auth/login-attempts',
  LOGIN_ATTEMPTS_BLOCKED: '/auth/login-attempts/blocked',
  LOGIN_ATTEMPTS_BY_EMP: (empId: string) => `/auth/login-attempts/employee/${empId}`,

   LOGIN_HISTORY: '/auth/login-history',
} as const;

// Query Keys - Auth Module
export const AUTH_QUERY_KEYS = {
  EMPLOYEES: 'employees',                                  // ← Changed array to string (consistent)
  EMPLOYEE_DETAIL: (empId: string) => ['employee', empId],
  DEPARTMENTS: 'departments',
  ROLES: 'roles',
  ROLES_ASSIGNABLE: 'roles-assignable',                   // ← ADD
  REPORTING_MANAGERS: 'reporting-managers',               // ← ADD
  LOGIN_ATTEMPTS: 'loginAttempts',
  LOGIN_ATTEMPTS_BLOCKED: 'loginAttemptsBlocked',         // ← ADD
  LOGIN_ATTEMPTS_BY_EMP: (empId: string) => ['loginAttempts', empId],
  LOGIN_HISTORY: 'loginHistory',                          // ← ADD
  LOGIN_HISTORY_BY_EMP: (empId: string) => ['loginHistory', empId], // ← ADD
} as const;

// Add to ADMIN_ENDPOINTS
export const ADMIN_ENDPOINTS = {
  // ... existing endpoints
  
  // Client endpoints
  CLIENTS: '/admin/clients',
  CLIENT_BY_ID: (id: number) => `/admin/clients/${id}`,
  CLIENT_LOGO: (id: number) => `/admin/clients/${id}/logo`,
  
  // Client Product endpoints
  CLIENT_PRODUCTS: '/admin/client-products',
  CLIENT_PRODUCT_BY_ID: (id: number) => `/admin/client-products/${id}`,
  CLIENT_PRODUCTS_BY_CLIENT: (clientId: number) => `/admin/client-products/client/${clientId}`,
} as const;

// Add to ADMIN_QUERY_KEYS
export const ADMIN_QUERY_KEYS = {
  // ... existing keys
  CLIENTS: 'clients',
  CLIENT_DETAIL: (id: number) => ['client', id],
  CLIENT_PRODUCTS: 'client-products',
  CLIENT_PRODUCT_DETAIL: (id: number) => ['client-product', id],
  CLIENT_PRODUCTS_BY_CLIENT: (clientId: number) => ['client-products-by-client', clientId],
} as const;


// Password Requirements Display
export const PASSWORD_REQUIREMENTS = [
  'At least 8 characters',
  'At least 1 uppercase letter',
  'At least 1 lowercase letter',
  'At least 1 number',
  'At least 1 special character (@#$%^&+=!)',
] as const;

// Token Expiry (8 hours in milliseconds)
export const TOKEN_EXPIRY_TIME = 8 * 60 * 60 * 1000; // 28800000ms

// Account Lockout Settings
export const LOCKOUT_CONFIG = {
  MAX_ATTEMPTS: 5,
  LOCKOUT_DURATION_MINUTES: 15,
} as const;

