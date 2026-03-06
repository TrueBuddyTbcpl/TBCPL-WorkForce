// ─── Backend-aligned types ────────────────────────────────────────────────────

export interface CaseOnlinePresence {
  id: number;
  platformName: string;
  link: string;
}

export interface CaseUpdate {
  id: number;
  updateDate: string;
  updatedBy: string;
  status: string;
  description: string;
}

export interface CaseListItem {
  id: number;
  caseNumber: string;
  caseTitle: string;
  priority: string;
  status: string;
  caseType: string;
  leadType: string;
  clientName: string;
  clientProduct: string;
  dateOpened: string;
  estimatedCompletionDate?: string;
  createdBy: string;
  createdAt: string;
}

export interface CaseDetail {
  id: number;
  caseNumber: string;
  prereportReportId: string;
  leadType: string;

  caseTitle: string;
  priority: string;
  status: string;
  caseType: string;
  dateOpened: string;
  dateClosed?: string;

  clientId: number;
  clientName: string;
  clientProduct: string;
  clientSpocName?: string;
  clientSpocContact?: string;
  clientSpocDesignation?: string;
  clientEmail?: string;

  entityName?: string;
  suspectName?: string;
  contactNumbers?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  pincode?: string;
  productDetails?: string;

  assignedEmployees?: string[];
  estimatedCompletionDate?: string;
  actualCompletionDate?: string;

  onlinePresences: CaseOnlinePresence[];
  updates: CaseUpdate[];

  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface AddCaseUpdateRequest {
  status: string;
  description: string;
}

export interface CasePagination {
  currentPage: number;
  totalPages: number;
  totalCases: number;
  pageSize: number;
}

export interface CaseListResponse {
  cases: CaseListItem[];
  pagination: CasePagination;
}

// ── Add this to existing case.types.ts ────────────────────────────────
export interface CaseDocumentResponse {
  id: number;
  fileName: string;
  originalName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedBy: string;
  uploadedAt: string;
}
