export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: 'Operations' | 'HR' | 'Account';
  managerId?: string;
  joinDate: string;
  avatar?: string;
  reportingManager?: string; // ID of the reporting manager
  isManager: boolean;
  assignedCases: string[];
  reportsCreated: number;
  profilesCreated: number;
}

export const mockEmployees: Employee[] = [
  // Operations Department
  {
    id: 'emp001',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@tbcpl.com',
    phone: '+91 98765 43210',
    role: 'Operations Manager',
    department: 'Operations',
    joinDate: '2023-01-15',
    isManager: true,
    reportingManager: undefined, // ✅ Top-level manager - no reporting manager
    assignedCases: [],
    reportsCreated: 0,
    profilesCreated: 0,
  },
  {
    id: 'emp002',
    name: 'Priya Sharma',
    email: 'priya.sharma@tbcpl.com',
    phone: '+91 98765 43211',
    role: 'Senior Investigator',
    department: 'Operations',
    managerId: 'emp001',
    reportingManager: 'emp001', // ✅ Reports to Rajesh Kumar
    joinDate: '2023-03-20',
    isManager: false,
    assignedCases: ['case001', 'case002', 'case003'],
    reportsCreated: 12,
    profilesCreated: 8,
  },
  {
    id: 'emp003',
    name: 'Amit Patel',
    email: 'amit.patel@tbcpl.com',
    phone: '+91 98765 43212',
    role: 'Investigator',
    department: 'Operations',
    managerId: 'emp001',
    reportingManager: 'emp001', // ✅ Reports to Rajesh Kumar
    joinDate: '2023-06-10',
    isManager: false,
    assignedCases: ['case004', 'case005'],
    reportsCreated: 8,
    profilesCreated: 6,
  },
  {
    id: 'emp004',
    name: 'Sneha Reddy',
    email: 'sneha.reddy@tbcpl.com',
    phone: '+91 98765 43213',
    role: 'Junior Investigator',
    department: 'Operations',
    managerId: 'emp001',
    reportingManager: 'emp001', // ✅ Reports to Rajesh Kumar
    joinDate: '2024-01-05',
    isManager: false,
    assignedCases: ['case006', 'case007'],
    reportsCreated: 5,
    profilesCreated: 4,
  },
  {
    id: 'emp005',
    name: 'Vikram Singh',
    email: 'vikram.singh@tbcpl.com',
    phone: '+91 98765 43214',
    role: 'Field Investigator',
    department: 'Operations',
    managerId: 'emp001',
    reportingManager: 'emp001', // ✅ Reports to Rajesh Kumar
    joinDate: '2023-09-15',
    isManager: false,
    assignedCases: ['case008', 'case009', 'case010'],
    reportsCreated: 10,
    profilesCreated: 7,
  },

  // HR Department
  {
    id: 'emp006',
    name: 'Anjali Mehta',
    email: 'anjali.mehta@tbcpl.com',
    phone: '+91 98765 43215',
    role: 'HR Manager',
    department: 'HR',
    joinDate: '2022-11-01',
    isManager: true,
    reportingManager: undefined, // ✅ Top-level manager - no reporting manager
    assignedCases: [],
    reportsCreated: 0,
    profilesCreated: 0,
  },
  {
    id: 'emp007',
    name: 'Rahul Verma',
    email: 'rahul.verma@tbcpl.com',
    phone: '+91 98765 43216',
    role: 'HR Executive',
    department: 'HR',
    managerId: 'emp006',
    reportingManager: 'emp006', // ✅ Reports to Anjali Mehta
    joinDate: '2023-04-12',
    isManager: false,
    assignedCases: [],
    reportsCreated: 0,
    profilesCreated: 0,
  },

  // Account Department
  {
    id: 'emp008',
    name: 'Kavita Joshi',
    email: 'kavita.joshi@tbcpl.com',
    phone: '+91 98765 43217',
    role: 'Account Manager',
    department: 'Account',
    joinDate: '2022-08-20',
    isManager: true,
    reportingManager: undefined, // ✅ Top-level manager - no reporting manager
    assignedCases: [],
    reportsCreated: 0,
    profilesCreated: 0,
  },
  {
    id: 'emp009',
    name: 'Suresh Iyer',
    email: 'suresh.iyer@tbcpl.com',
    phone: '+91 98765 43218',
    role: 'Accountant',
    department: 'Account',
    managerId: 'emp008',
    reportingManager: 'emp008', // ✅ Reports to Kavita Joshi
    joinDate: '2023-07-01',
    isManager: false,
    assignedCases: [],
    reportsCreated: 0,
    profilesCreated: 0,
  },
];

// ✅ Helper function to get employee's reporting manager details
export const getReportingManager = (employeeId: string): Employee | undefined => {
  const employee = mockEmployees.find(emp => emp.id === employeeId);
  if (!employee?.reportingManager) return undefined;
  return mockEmployees.find(emp => emp.id === employee.reportingManager);
};

// ✅ Helper function to get all employees reporting to a manager
export const getDirectReports = (managerId: string): Employee[] => {
  return mockEmployees.filter(emp => emp.reportingManager === managerId);
};

export const getEmployeesByDepartment = (department: string) => {
  return mockEmployees.filter(emp => emp.department === department);
};

export const getManagerByDepartment = (department: string) => {
  return mockEmployees.find(emp => emp.department === department && emp.isManager);
};

export const getEmployeeById = (id: string) => {
  return mockEmployees.find(emp => emp.id === id);
};
