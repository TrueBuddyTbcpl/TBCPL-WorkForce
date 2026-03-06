// ── Backend API Types ─────────────────────────────────────────────────────

export type ReportStatus =
  | 'DRAFT'
  | 'WAITING_FOR_APPROVAL'
  | 'REQUEST_CHANGES'
  | 'APPROVED';

export interface CaseReportPrefillResponse {
  caseId: number;
  caseNumber: string;
  clientId: number;
  clientName: string;
  clientLogoUrl: string | null;
  reportAlreadyExists: boolean;
  existingReportId: number | null;
}

export interface FinalReportResponse {
  id: number;
  reportNumber: string;
  caseId: number;
  caseNumber: string;
  clientId: number;
  clientName: string;
  clientLogoUrl: string | null;
  reportTitle: string;
  reportSubtitle: string;
  preparedFor: string;
  preparedBy: string;
  reportDate: string;
  sections: Section[];
  tableOfContents: string[];
  reportStatus: ReportStatus;
  changeComments: string | null;
  previewEnabled: boolean;
  sendReportEnabled: boolean;
  generatePdfEnabled: boolean;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface FinalReportListItemResponse {
  id: number;
  reportNumber: string;
  caseId: number;
  caseNumber: string;
  clientName: string;
  clientLogoUrl: string | null;
  reportTitle: string;
  reportDate: string;
  reportStatus: ReportStatus;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ImageUploadResponse {
  successCount: number;
  failedCount: number;
  images: {
    index: number;
    originalName: string;
    url: string;
    publicId: string;
    success: boolean;
    error: string | null;
  }[];
}

export interface CreateFinalReportRequest {
  caseId: number;
  reportTitle: string;
  reportSubtitle: string;
  preparedFor: string;
  preparedBy: string;
  reportDate: string; // "YYYY-MM-DD"
  sections: Section[];
  tableOfContents: string[];
}

export interface UpdateFinalReportRequest {
  reportTitle: string;
  reportSubtitle: string;
  preparedFor: string;
  preparedBy: string;
  reportDate: string;
  sections: Section[];
  tableOfContents: string[];
}

export interface FinalReportStatusUpdateRequest {
  reportStatus: 'REQUEST_CHANGES' | 'APPROVED';
  changeComments: string | null;
}

// ── Local Form Types ──────────────────────────────────────────────────────

export interface ReportData {
  // Backend fields (set after save)
  reportId?: number;
  reportNumber?: string;
  reportStatus?: ReportStatus;
  caseId?: number;
  // Client info from prefill
  clientLogoUrl?: string | null;
  // Form header
  header: {
    title: string;
    subtitle: string;
    preparedFor: string;
    preparedBy: string;
    date: string;
    clientLogo?: string; // Cloudinary URL or base64 (legacy)
  };
  tableOfContents: string[];
  sections: Section[];
}

export interface Section {
  id: string;
  title: string;
  type: 'table' | 'narrative' | 'mixed' | 'custom-table';
  content: TableContent | NarrativeContent | MixedContent | CustomTableContent;
  images?: string[]; // Cloudinary URLs only
}

export interface TableContent {
  columns: string[];
  rows: Record<string, string>[];
}

export interface NarrativeContent {
  text: string;
}

export interface MixedContent {
  items: (TableContent | NarrativeContent)[];
}

export interface CustomTableContent {
  columnCount: number;
  columnHeaders: string[];
  rows: string[][];
}

export interface FormStepProps {
  onNext: (data: Partial<ReportData>) => void;
  onBack?: () => void;
  initialData?: Partial<ReportData>;
}

export interface SectionFormData {
  title: string;
  type: 'table' | 'narrative' | 'mixed' | 'custom-table';
  tableColumns?: string[];
  tableRows?: Record<string, string>[];
  narrativeText?: string;
  customTableColumnCount?: number;
  customTableHeaders?: string[];
  customTableRows?: string[][];
}
