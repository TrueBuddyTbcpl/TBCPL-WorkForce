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
  photographicEvidence?: PhotographicEvidence;
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
  reportDate: string;
  sections: Section[];
  tableOfContents: string[];
  photographicEvidence?: PhotographicEvidence;
}

export interface UpdateFinalReportRequest {
  reportTitle: string;
  reportSubtitle: string;
  preparedFor: string;
  preparedBy: string;
  reportDate: string;
  sections: Section[];
  tableOfContents: string[];
  photographicEvidence?: PhotographicEvidence;
}

export interface FinalReportStatusUpdateRequest {
  reportStatus: 'REQUEST_CHANGES' | 'APPROVED';
  changeComments: string | null;
}

// ── Photographic Evidence ─────────────────────────────────────────────────

export type PhotoOrientation = 'portrait' | 'landscape';

export interface PhotographicImage {
  url: string;
  reason: string;
  orientation: PhotoOrientation;
}

export interface PhotographicEvidence {
  showHeading: boolean;
  heading: string;
  images: PhotographicImage[];
}

export type CollageLayout =
  | '1-full' | '2-side' | '3-row' | '2+1' | '1+2' | '2x2' | '2+3' | '3x2' | 'auto';

export interface PhotographicEvidence {
  showHeading: boolean;
  heading: string;
  images: Array<{
    url: string;
    reason: string;
    orientation: 'portrait' | 'landscape';
  }>;
  collageLayout?: CollageLayout; // ✅ ADD THIS
}

// ── Local Form Types ──────────────────────────────────────────────────────

export interface ReportData {
  reportId?: number;
  reportNumber?: string;
  reportStatus?: ReportStatus;
  caseId?: number;
  clientLogoUrl?: string | null;
  header: {
    title: string;
    subtitle: string;
    preparedFor: string;
    preparedBy: string;
    date: string;
    clientLogo?: string;
  };
  tableOfContents: string[];
  sections: Section[];
  photographicEvidence?: PhotographicEvidence;
}

export interface Section {
  id: string;
  title: string;
  type: 'table' | 'narrative' | 'mixed' | 'custom-table' | 'image';
  content: TableContent | NarrativeContent | MixedContent | CustomTableContent | ImageSectionContent;
  images?: string[];
  notes?: string;
  notesHeading?: string;
}

export interface TableContent {
  columns: string[];
  rows: Record<string, string>[];
  useCustomHeadings?: boolean;
  col1Label?: string;
  col2Label?: string;
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
  showSingleColumnHeader?: boolean;
}

export interface ImageSectionContent {
  images: Array<{ url: string; reason: string }>;
  reason: string;
  showHeading: boolean;
  heading: string;
}

export interface FormStepProps {
  onNext: (data: Partial<ReportData>) => void;
  onBack?: () => void;
  initialData?: Partial<ReportData>;
}

export interface SectionFormData {
  title: string;
  type: 'table' | 'narrative' | 'mixed' | 'custom-table' | 'image';
  tableColumns?: string[];
  tableRows?: Record<string, string>[];
  narrativeText?: string;
  customTableColumnCount?: number;
  customTableHeaders?: string[];
  customTableRows?: string[][];
}