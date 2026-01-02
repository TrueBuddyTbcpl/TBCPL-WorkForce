export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  phone: string;
  avatar?: string;
  joinDate: string;
}

export interface Client {
  id: string;
  name: string;
  productName: string;
  logo?: string;
}

export interface Case {
  id: string;
  caseNumber: string;
  title: string;
  client: Client;
  assignedTo: Employee;
  status: 'open' | 'closed' | 'in-progress' | 'on-hold';
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdDate: string;
  lastUpdated: string;
  description: string;
  profilesLinked: number;
  reportsGenerated: number;
}

export interface RecentProfile {
  id: string;
  name: string;
  alias: string;
  createdBy: string;
  createdDate: string;
  thumbnail?: string;
  caseLinked?: string;
}

export interface DashboardStats {
  totalCases: number;
  openCases: number;
  closedCases: number;
  profilesCreated: number;
  reportsGenerated: number;
  activeCases: number;
}

export interface DashboardFilters {
  searchQuery: string;
  clientName: string[];
  productName: string[];
  status: string[];
  priority: string[];
  assignedTo: string[];
}
