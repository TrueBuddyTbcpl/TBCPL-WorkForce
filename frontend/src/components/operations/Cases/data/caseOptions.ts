export const caseTypes = [
  'Theft',
  'Fraud',
  'Violence',
  'Property Damage',
  'Harassment',
  'Trespassing',
  'Cybercrime',
  'Employee Misconduct',
  'Product Tampering',
  'Data Breach',
  'Other',
];

export const caseStatuses = [
  'Open',
  'Under Investigation',
  'On Hold',
  'Closed',
  'Pending',
];

export const priorityLevels = [
  'Low',
  'Medium',
  'High',
  'Critical',
];

export const leadTypes = [
  'Client Lead',
  'Trubuddy Lead',
];

// ✅ New: Client Names
export const clientNames = [
  'Syngenta',
  'FMC',
  'Bayer',
  'Dhanuka',
  'UPL',
  'Corteva',
  'BASF',
  'AAL',
  'TVS',
  'Supreme',
  'Ashirwad',
  'NSS',
  'Welspun',
  'Sumitomo',
];

// ✅ New: Client Products mapped to each client
export const clientProducts: Record<string, string[]> = {
  'Syngenta': [
    'Actara - Insecticide',
    'Amistar - Fungicide',
    'Elatus - Fungicide',
    'Gramoxone - Herbicide',
    'Proclaim - Insecticide',
    'Vertimec - Insecticide',
    'Topik - Herbicide',
    'Amistar Top - Fungicide',
  ],
  'FMC': [
    'Coragen - Insecticide',
    'Talstar - Insecticide',
    'Authority - Herbicide',
    'Hero - Herbicide',
    'Rynaxypyr - Insecticide',
    'Cyazypyr - Insecticide',
  ],
  'Bayer': [
    'Confidor - Insecticide',
    'Oberon - Insecticide',
    'Nativo - Fungicide',
    'Luna - Fungicide',
    'Atlantis - Herbicide',
    'Proline - Fungicide',
    'Sivanto - Insecticide',
    'Admire - Insecticide',
  ],
  'Dhanuka': [
    'Takumi - Herbicide',
    'Caldan - Fungicide',
    'EM-1 - Insecticide',
    'Areva - Insecticide',
    'Sempra - Herbicide',
    'Taqat - Insecticide',
    'Deciding - Insecticide',
  ],
  'UPL': [
    'Saaf - Fungicide',
    'Score - Fungicide',
    'Ergon - Fungicide',
    'Indofil M-45 - Fungicide',
    'Prithvi - Insecticide',
    'Fytolan - Fungicide',
    'Sixer - Insecticide',
    'Ulala - Herbicide',
  ],
  'Corteva': [
    'Delegate - Insecticide',
    'Transform - Insecticide',
    'Zorvec - Fungicide',
    'Resibon - Insecticide',
    'Isoclast - Insecticide',
    'Jivamrit - Bio Insecticide',
  ],
  'BASF': [
    'Opera - Fungicide',
    'Serifel - Fungicide',
    'Basta - Herbicide',
    'Fastac - Insecticide',
    'Signum - Fungicide',
    'Efficon - Fungicide',
    'Axial - Herbicide',
  ],
  'AAL': [
    'AAL Premium Pipes - PVC Pipes',
    'AAL Agri Pipes - Agricultural Pipes',
    'AAL Column Pipes - Column Pipes',
    'AAL SWR Pipes - Sewerage Pipes',
    'AAL Casing Pipes - Casing Pipes',
  ],
  'TVS': [
    'TVS Apache - Motorcycle',
    'TVS Ntorq - Scooter',
    'TVS Jupiter - Scooter',
    'TVS Raider - Motorcycle',
    'TVS XL100 - Moped',
    'TVS Sport - Motorcycle',
  ],
  'Supreme': [
    'Supreme PVC Pipes - Plumbing',
    'Supreme CPVC Pipes - Hot & Cold Water',
    'Supreme SWR Pipes - Sewerage',
    'Supreme Column Pipes - Construction',
    'Supreme Casing Pipes - Borewell',
  ],
  'Ashirwad': [
    'Ashirwad uPVC Pipes - Plumbing',
    'Ashirwad CPVC Pipes - Hot Water',
    'Ashirwad SWR Pipes - Drainage',
    'Ashirwad Column Pipes - Structure',
  ],
  'NSS': [
    'NSS PVC Pipes - Water Supply',
    'NSS Agricultural Pipes - Irrigation',
    'NSS Column Pipes - Building',
    'NSS Casing Pipes - Borewell',
  ],
  'Welspun': [
    'Welspun Steel Pipes - Construction',
    'Welspun Line Pipes - Oil & Gas',
    'Welspun HSAW Pipes - Water Supply',
    'Welspun Spiral Pipes - Infrastructure',
  ],
  'Sumitomo': [
    'Danitol - Insecticide',
    'Valiant - Insecticide',
    'Discovery - Insecticide',
    'Trebon - Insecticide',
    'Pentagon - Fungicide',
  ],
};

// Sample employees - In production, fetch from API
export interface Employee {
  id: string;
  name: string;
  role: string;
  email: string;
  department: string;
}

export const availableEmployees: Employee[] = [
  {
    id: 'EMP-001',
    name: 'John Doe',
    role: 'Senior Investigator',
    email: 'john.doe@trubuddy.com',
    department: 'Investigation',
  },
  {
    id: 'EMP-002',
    name: 'Jane Smith',
    role: 'Case Manager',
    email: 'jane.smith@trubuddy.com',
    department: 'Case Management',
  },
  {
    id: 'EMP-003',
    name: 'Mike Johnson',
    role: 'Field Investigator',
    email: 'mike.johnson@trubuddy.com',
    department: 'Investigation',
  },
  {
    id: 'EMP-004',
    name: 'Sarah Williams',
    role: 'Forensic Analyst',
    email: 'sarah.williams@trubuddy.com',
    department: 'Forensics',
  },
  {
    id: 'EMP-005',
    name: 'David Brown',
    role: 'Legal Advisor',
    email: 'david.brown@trubuddy.com',
    department: 'Legal',
  },
  {
    id: 'EMP-006',
    name: 'Emily Davis',
    role: 'Junior Investigator',
    email: 'emily.davis@trubuddy.com',
    department: 'Investigation',
  },
];

// Sample culprit profiles - In production, fetch from API
export interface CulpritProfile {
  id: string;
  name: string;
  status: string;
}

export const availableCulprits: CulpritProfile[] = [
  {
    id: 'PROF-001',
    name: 'John Anderson',
    status: 'Active',
  },
  {
    id: 'PROF-002',
    name: 'Robert Miller',
    status: 'Under Investigation',
  },
  {
    id: 'PROF-003',
    name: 'Michael Wilson',
    status: 'Active',
  },
];
