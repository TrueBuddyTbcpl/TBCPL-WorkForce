export interface CaseBasicInfo {
  caseNumber: string;
  caseTitle: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in-progress' | 'on-hold' | 'closed';
  caseType: string;
  clientName: string; // ✅ Added
  clientProduct: string; // ✅ Added
  description: string;
  dateOpened: string;
  dateClosed?: string;
}

export interface ClientDetails {
  clientName: string;
  productService: string;
  clientContact?: string;
  clientEmail?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
}

export interface InvestigationDetails {
  leadType: 'Client Lead' | 'Trubuddy Lead';
  assignedEmployees: string[];
  linkedCulprits?: string[];
  estimatedCompletionDate?: string;
  actualCompletionDate?: string;
}

export interface CaseDocument {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedBy: string;
  uploadedAt: string;
  size: number;
}

export interface InvestigationUpdate {
  id: string;
  updateDate: string;
  updatedBy: string;
  status: string;
  description: string;
  attachments?: string[];
}

export interface CaseData {
  id: string;
  basicInfo: CaseBasicInfo;
  clientDetails: ClientDetails;
  investigation: InvestigationDetails;
  documents: CaseDocument[];
  updates: InvestigationUpdate[];
  createdAt: string;
  createdBy: string;
  lastUpdated: string;
}
