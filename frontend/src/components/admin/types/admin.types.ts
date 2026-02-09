export type Department = 'Operations' | 'HR' | 'Account';

// ✅ ADD THIS LINE:
export type ViewMode = 'employees' | 'cases' | 'profiles' | 'prereports' | 'clients';

export interface DepartmentStats {
  department: Department;
  totalEmployees: number;
  manager: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  activeCases?: number;
  profilesCreated?: number;
  reportsGenerated?: number;
}

export interface EmployeeActivity {
  employeeId: string;
  employeeName: string;
  lastActive: string;
  casesAssigned: string[];
  reportsCreated: number;
  profilesCreated: number;
  recentActions: ActivityLog[];
}

export interface ActivityLog {
  id: string;
  action: string;
  module: 'case' | 'profile' | 'report';
  entityId: string;
  entityName: string;
  timestamp: string;
  description: string;
}
