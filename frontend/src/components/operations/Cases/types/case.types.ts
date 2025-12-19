export interface CaseBasicInfo {
  caseNumber: string;
  clientName: string;  // ✅ Changed from caseTitle to clientName
  clientProduct: string;  // ✅ Changed from caseType to clientProduct
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  description: string;
  reportedDate: string;
  status: 'Open' | 'Under Investigation' | 'On Hold' | 'Closed' | 'Pending';
}

export interface ClientDetails {
  clientName: string;
  clientContact?: string;
  clientEmail?: string;
  productService: string;
  leadType: 'Client Lead' | 'Trubuddy Lead';
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
}

export interface InvestigationDetails {
  assignedEmployees: string[];
  linkedCulprits: string[];
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
