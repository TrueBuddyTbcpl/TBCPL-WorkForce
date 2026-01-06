export interface ProfileChangeHistory {
  id: string;
  changeType: 'created' | 'updated' | 'field_added' | 'field_removed';
  changedBy: string;
  changedByName: string;
  timestamp: string;
  field?: string;
  oldValue?: string;
  newValue?: string;
  description: string;
}

export interface MockProfile {
  id: string;
  name: string;
  alias: string;
  personal: {
    firstName: string;
    middleName?: string;
    lastName: string;
    dateOfBirth: string;
    age: number;
    gender: string;
    nationality: string;
    photo?: string;
  };
  address: {
    current: string;
    permanent: string;
    city: string;
    state: string;
    pincode: string;
  };
  contact: {
    mobile: string;
    email?: string;
    whatsapp?: string;
  };
  status: string;
  createdAt: string;
  createdBy: string;
  createdByName: string;
  lastUpdated: string;
  caseLinked?: string;
  changeHistory: ProfileChangeHistory[];
}

export const mockProfiles: MockProfile[] = [
  // Profile 1-5: Case 001 (Samsung)
  {
    id: 'profile001',
    name: 'Ramesh Kumar Gupta',
    alias: 'Ramu',
    personal: {
      firstName: 'Ramesh',
      middleName: 'Kumar',
      lastName: 'Gupta',
      dateOfBirth: '1985-03-15',
      age: 40,
      gender: 'Male',
      nationality: 'Indian',
    },
    address: {
      current: 'Shop No. 45, Lajpat Nagar Market, Delhi',
      permanent: 'Village Khera, District Sonipat, Haryana',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110024',
    },
    contact: {
      mobile: '+91 98765 11111',
      whatsapp: '+91 98765 11111',
    },
    status: 'Active',
    createdAt: '2025-12-02T10:30:00',
    createdBy: 'emp002',
    createdByName: 'Priya Sharma',
    lastUpdated: '2025-12-15T14:20:00',
    caseLinked: 'case001',
    changeHistory: [
      {
        id: 'ph001',
        changeType: 'created',
        changedBy: 'emp002',
        changedByName: 'Priya Sharma',
        timestamp: '2025-12-02T10:30:00',
        description: 'Profile created',
      },
      {
        id: 'ph002',
        changeType: 'updated',
        changedBy: 'emp002',
        changedByName: 'Priya Sharma',
        timestamp: '2025-12-15T14:20:00',
        field: 'address.current',
        oldValue: 'Shop No. 45, Lajpat Nagar',
        newValue: 'Shop No. 45, Lajpat Nagar Market, Delhi',
        description: 'Updated current address with complete details',
      },
    ],
  },
  {
    id: 'profile002',
    name: 'Vijay Sharma',
    alias: 'VJ',
    personal: {
      firstName: 'Vijay',
      lastName: 'Sharma',
      dateOfBirth: '1988-11-10',
      age: 37,
      gender: 'Male',
      nationality: 'Indian',
    },
    address: {
      current: 'Flat 302, Saket Apartments, South Delhi',
      permanent: 'Village Jhajjar, Haryana',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110017',
    },
    contact: {
      mobile: '+91 98765 22222',
    },
    status: 'Active',
    createdAt: '2025-12-05T15:30:00',
    createdBy: 'emp002',
    createdByName: 'Priya Sharma',
    lastUpdated: '2025-12-05T15:30:00',
    caseLinked: 'case001',
    changeHistory: [
      {
        id: 'ph003',
        changeType: 'created',
        changedBy: 'emp002',
        changedByName: 'Priya Sharma',
        timestamp: '2025-12-05T15:30:00',
        description: 'Profile created',
      },
    ],
  },
  {
    id: 'profile003',
    name: 'Suresh Chand',
    alias: 'Suri',
    personal: {
      firstName: 'Suresh',
      lastName: 'Chand',
      dateOfBirth: '1992-06-20',
      age: 33,
      gender: 'Male',
      nationality: 'Indian',
    },
    address: {
      current: 'Shop No. 78, Nehru Place, Delhi',
      permanent: 'Gali No. 5, Rohini, Delhi',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110019',
    },
    contact: {
      mobile: '+91 98765 33333',
      email: 'suresh.chand@example.com',
    },
    status: 'Under Investigation',
    createdAt: '2025-12-08T11:00:00',
    createdBy: 'emp002',
    createdByName: 'Priya Sharma',
    lastUpdated: '2026-01-03T16:45:00',
    caseLinked: 'case001',
    changeHistory: [
      {
        id: 'ph004',
        changeType: 'created',
        changedBy: 'emp002',
        changedByName: 'Priya Sharma',
        timestamp: '2025-12-08T11:00:00',
        description: 'Profile created',
      },
      {
        id: 'ph005',
        changeType: 'updated',
        changedBy: 'emp002',
        changedByName: 'Priya Sharma',
        timestamp: '2026-01-03T16:45:00',
        field: 'status',
        oldValue: 'Active',
        newValue: 'Under Investigation',
        description: 'Status changed to Under Investigation',
      },
    ],
  },

  // Profile 4-8: Case 002 (Adidas)
  {
    id: 'profile004',
    name: 'Mohammad Khan',
    alias: 'Bunty',
    personal: {
      firstName: 'Mohammad',
      lastName: 'Khan',
      dateOfBirth: '1990-07-22',
      age: 35,
      gender: 'Male',
      nationality: 'Indian',
    },
    address: {
      current: 'House No. 234, Karol Bagh, Delhi',
      permanent: 'Mohalla Jama Masjid, Old Delhi',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110005',
    },
    contact: {
      mobile: '+91 98765 44444',
      email: 'khan.bunty@example.com',
    },
    status: 'Under Investigation',
    createdAt: '2025-12-16T09:00:00',
    createdBy: 'emp002',
    createdByName: 'Priya Sharma',
    lastUpdated: '2026-01-02T11:45:00',
    caseLinked: 'case002',
    changeHistory: [
      {
        id: 'ph006',
        changeType: 'created',
        changedBy: 'emp002',
        changedByName: 'Priya Sharma',
        timestamp: '2025-12-16T09:00:00',
        description: 'Profile created',
      },
      {
        id: 'ph007',
        changeType: 'field_added',
        changedBy: 'emp002',
        changedByName: 'Priya Sharma',
        timestamp: '2025-12-20T14:30:00',
        field: 'contact.email',
        newValue: 'khan.bunty@example.com',
        description: 'Added email address',
      },
    ],
  },
  {
    id: 'profile005',
    name: 'Rajesh Malhotra',
    alias: 'Raju',
    personal: {
      firstName: 'Rajesh',
      lastName: 'Malhotra',
      dateOfBirth: '1987-02-14',
      age: 38,
      gender: 'Male',
      nationality: 'Indian',
    },
    address: {
      current: 'Shop No. 12, Lajpat Nagar Central Market',
      permanent: 'H-45, Patel Nagar, Delhi',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110024',
    },
    contact: {
      mobile: '+91 98765 55555',
      whatsapp: '+91 98765 55555',
    },
    status: 'Active',
    createdAt: '2025-12-17T10:15:00',
    createdBy: 'emp002',
    createdByName: 'Priya Sharma',
    lastUpdated: '2025-12-17T10:15:00',
    caseLinked: 'case002',
    changeHistory: [
      {
        id: 'ph008',
        changeType: 'created',
        changedBy: 'emp002',
        changedByName: 'Priya Sharma',
        timestamp: '2025-12-17T10:15:00',
        description: 'Profile created',
      },
    ],
  },
  {
    id: 'profile006',
    name: 'Anil Kumar Singh',
    alias: 'Anil Bhai',
    personal: {
      firstName: 'Anil',
      middleName: 'Kumar',
      lastName: 'Singh',
      dateOfBirth: '1983-09-05',
      age: 42,
      gender: 'Male',
      nationality: 'Indian',
    },
    address: {
      current: 'Shop No. 67, Lajpat Nagar Part 2',
      permanent: 'Village Bahadurgarh, Haryana',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110024',
    },
    contact: {
      mobile: '+91 98765 66666',
    },
    status: 'Active',
    createdAt: '2025-12-18T14:00:00',
    createdBy: 'emp002',
    createdByName: 'Priya Sharma',
    lastUpdated: '2025-12-25T11:20:00',
    caseLinked: 'case002',
    changeHistory: [
      {
        id: 'ph009',
        changeType: 'created',
        changedBy: 'emp002',
        changedByName: 'Priya Sharma',
        timestamp: '2025-12-18T14:00:00',
        description: 'Profile created',
      },
      {
        id: 'ph010',
        changeType: 'updated',
        changedBy: 'emp002',
        changedByName: 'Priya Sharma',
        timestamp: '2025-12-25T11:20:00',
        field: 'personal.age',
        oldValue: '41',
        newValue: '42',
        description: 'Updated age',
      },
    ],
  },
  {
    id: 'profile007',
    name: 'Deepak Verma',
    alias: 'Deep',
    personal: {
      firstName: 'Deepak',
      lastName: 'Verma',
      dateOfBirth: '1995-12-30',
      age: 30,
      gender: 'Male',
      nationality: 'Indian',
    },
    address: {
      current: 'Flat 101, Green Park Extension',
      permanent: 'Sector 15, Noida, UP',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110016',
    },
    contact: {
      mobile: '+91 98765 77777',
      email: 'deepak.v@example.com',
    },
    status: 'Active',
    createdAt: '2025-12-19T09:30:00',
    createdBy: 'emp002',
    createdByName: 'Priya Sharma',
    lastUpdated: '2025-12-19T09:30:00',
    caseLinked: 'case002',
    changeHistory: [
      {
        id: 'ph011',
        changeType: 'created',
        changedBy: 'emp002',
        changedByName: 'Priya Sharma',
        timestamp: '2025-12-19T09:30:00',
        description: 'Profile created',
      },
    ],
  },
  {
    id: 'profile008',
    name: 'Sanjay Gupta',
    alias: 'Sanju',
    personal: {
      firstName: 'Sanjay',
      lastName: 'Gupta',
      dateOfBirth: '1989-04-18',
      age: 36,
      gender: 'Male',
      nationality: 'Indian',
    },
    address: {
      current: 'Shop No. 89, Lajpat Nagar Part 4',
      permanent: 'C-23, Janakpuri, Delhi',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110024',
    },
    contact: {
      mobile: '+91 98765 88888',
    },
    status: 'Active',
    createdAt: '2025-12-21T15:45:00',
    createdBy: 'emp002',
    createdByName: 'Priya Sharma',
    lastUpdated: '2025-12-21T15:45:00',
    caseLinked: 'case002',
    changeHistory: [
      {
        id: 'ph012',
        changeType: 'created',
        changedBy: 'emp002',
        changedByName: 'Priya Sharma',
        timestamp: '2025-12-21T15:45:00',
        description: 'Profile created',
      },
    ],
  },

  // Profile 9-10: Case 003 (Apple)
  {
    id: 'profile009',
    name: 'Ashok Kumar',
    alias: 'AK',
    personal: {
      firstName: 'Ashok',
      lastName: 'Kumar',
      dateOfBirth: '1991-08-25',
      age: 34,
      gender: 'Male',
      nationality: 'Indian',
    },
    address: {
      current: 'Warehouse 45, Industrial Area, Mayapuri',
      permanent: 'Village Nangloi, Delhi',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110064',
    },
    contact: {
      mobile: '+91 98765 99999',
      email: 'ashok.k@example.com',
    },
    status: 'Arrested',
    createdAt: '2025-11-12T10:00:00',
    createdBy: 'emp003',
    createdByName: 'Amit Patel',
    lastUpdated: '2025-12-18T16:00:00',
    caseLinked: 'case003',
    changeHistory: [
      {
        id: 'ph013',
        changeType: 'created',
        changedBy: 'emp003',
        changedByName: 'Amit Patel',
        timestamp: '2025-11-12T10:00:00',
        description: 'Profile created',
      },
      {
        id: 'ph014',
        changeType: 'updated',
        changedBy: 'emp003',
        changedByName: 'Amit Patel',
        timestamp: '2025-12-18T16:00:00',
        field: 'status',
        oldValue: 'Under Investigation',
        newValue: 'Arrested',
        description: 'Status updated to Arrested',
      },
    ],
  },
  {
    id: 'profile010',
    name: 'Manish Jain',
    alias: 'Manu',
    personal: {
      firstName: 'Manish',
      lastName: 'Jain',
      dateOfBirth: '1986-01-10',
      age: 39,
      gender: 'Male',
      nationality: 'Indian',
    },
    address: {
      current: 'Office 204, Nehru Place, Delhi',
      permanent: 'B-67, Rajouri Garden, Delhi',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110019',
    },
    contact: {
      mobile: '+91 98766 11111',
      whatsapp: '+91 98766 11111',
    },
    status: 'Arrested',
    createdAt: '2025-11-15T11:30:00',
    createdBy: 'emp003',
    createdByName: 'Amit Patel',
    lastUpdated: '2025-12-18T16:30:00',
    caseLinked: 'case003',
    changeHistory: [
      {
        id: 'ph015',
        changeType: 'created',
        changedBy: 'emp003',
        changedByName: 'Amit Patel',
        timestamp: '2025-11-15T11:30:00',
        description: 'Profile created',
      },
      {
        id: 'ph016',
        changeType: 'updated',
        changedBy: 'emp003',
        changedByName: 'Amit Patel',
        timestamp: '2025-12-18T16:30:00',
        field: 'status',
        oldValue: 'Active',
        newValue: 'Arrested',
        description: 'Arrested by police',
      },
    ],
  },

  // Continue with profiles 11-30 for other cases...
  // Profile 11-14: Case 004 (Cipla Pharma)
  {
    id: 'profile011',
    name: 'Ravi Shankar',
    alias: 'Ravi',
    personal: {
      firstName: 'Ravi',
      lastName: 'Shankar',
      dateOfBirth: '1984-05-12',
      age: 41,
      gender: 'Male',
      nationality: 'Indian',
    },
    address: {
      current: 'Shop No. 23, Gandhi Nagar, East Delhi',
      permanent: 'Village Ghazipur, Delhi',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110092',
    },
    contact: {
      mobile: '+91 98766 22222',
    },
    status: 'Under Investigation',
    createdAt: '2025-12-21T09:00:00',
    createdBy: 'emp003',
    createdByName: 'Amit Patel',
    lastUpdated: '2026-01-04T15:00:00',
    caseLinked: 'case004',
    changeHistory: [
      {
        id: 'ph017',
        changeType: 'created',
        changedBy: 'emp003',
        changedByName: 'Amit Patel',
        timestamp: '2025-12-21T09:00:00',
        description: 'Profile created',
      },
    ],
  },
  {
    id: 'profile012',
    name: 'Prakash Yadav',
    alias: 'PK',
    personal: {
      firstName: 'Prakash',
      lastName: 'Yadav',
      dateOfBirth: '1993-11-08',
      age: 32,
      gender: 'Male',
      nationality: 'Indian',
    },
    address: {
      current: 'Medical Store, Preet Vihar, Delhi',
      permanent: 'Sector 22, Rohini, Delhi',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110092',
    },
    contact: {
      mobile: '+91 98766 33333',
      email: 'prakash.y@example.com',
    },
    status: 'Active',
    createdAt: '2025-12-22T10:30:00',
    createdBy: 'emp003',
    createdByName: 'Amit Patel',
    lastUpdated: '2025-12-22T10:30:00',
    caseLinked: 'case004',
    changeHistory: [
      {
        id: 'ph018',
        changeType: 'created',
        changedBy: 'emp003',
        changedByName: 'Amit Patel',
        timestamp: '2025-12-22T10:30:00',
        description: 'Profile created',
      },
    ],
  },

  // Profiles 13-30 continue similarly for remaining cases
  // Due to space, showing structure for remaining profiles...
  
  {
    id: 'profile013',
    name: 'Dinesh Kumar',
    alias: 'Dinu',
    personal: { firstName: 'Dinesh', lastName: 'Kumar', dateOfBirth: '1990-03-20', age: 35, gender: 'Male', nationality: 'Indian' },
    address: { current: 'Shop 56, Mayur Vihar Phase 1', permanent: 'Ghaziabad, UP', city: 'Delhi', state: 'Delhi', pincode: '110091' },
    contact: { mobile: '+91 98766 44444' },
    status: 'Active',
    createdAt: '2025-12-23T11:00:00',
    createdBy: 'emp003',
    createdByName: 'Amit Patel',
    lastUpdated: '2025-12-23T11:00:00',
    caseLinked: 'case004',
    changeHistory: [{ id: 'ph019', changeType: 'created', changedBy: 'emp003', changedByName: 'Amit Patel', timestamp: '2025-12-23T11:00:00', description: 'Profile created' }],
  },
  {
    id: 'profile014',
    name: 'Satish Choudhary',
    alias: 'Sati',
    personal: { firstName: 'Satish', lastName: 'Choudhary', dateOfBirth: '1988-07-15', age: 37, gender: 'Male', nationality: 'Indian' },
    address: { current: 'Pharmacy, Laxmi Nagar Main Road', permanent: 'Faridabad, Haryana', city: 'Delhi', state: 'Delhi', pincode: '110092' },
    contact: { mobile: '+91 98766 55555', email: 'satish.c@example.com' },
    status: 'Under Investigation',
    createdAt: '2025-12-24T14:30:00',
    createdBy: 'emp003',
    createdByName: 'Amit Patel',
    lastUpdated: '2026-01-03T09:45:00',
    caseLinked: 'case004',
    changeHistory: [
      { id: 'ph020', changeType: 'created', changedBy: 'emp003', changedByName: 'Amit Patel', timestamp: '2025-12-24T14:30:00', description: 'Profile created' },
      { id: 'ph021', changeType: 'updated', changedBy: 'emp003', changedByName: 'Amit Patel', timestamp: '2026-01-03T09:45:00', field: 'status', oldValue: 'Active', newValue: 'Under Investigation', description: 'Under investigation for selling counterfeit medicines' },
    ],
  },

  // Profile 15: Case 005 (Rolex)
  {
    id: 'profile015',
    name: 'Kamal Oberoi',
    alias: 'KO',
    personal: { firstName: 'Kamal', lastName: 'Oberoi', dateOfBirth: '1982-09-12', age: 43, gender: 'Male', nationality: 'Indian' },
    address: { current: 'Premium Watch Store, South Extension', permanent: 'Golf Links, New Delhi', city: 'Delhi', state: 'Delhi', pincode: '110049' },
    contact: { mobile: '+91 98766 66666', email: 'kamal.oberoi@example.com', whatsapp: '+91 98766 66666' },
    status: 'Active',
    createdAt: '2026-01-03T10:00:00',
    createdBy: 'emp003',
    createdByName: 'Amit Patel',
    lastUpdated: '2026-01-03T10:00:00',
    caseLinked: 'case005',
    changeHistory: [{ id: 'ph022', changeType: 'created', changedBy: 'emp003', changedByName: 'Amit Patel', timestamp: '2026-01-03T10:00:00', description: 'Profile created' }],
  },

  // Profiles 16-18: Case 006 (Maruti)
  {
    id: 'profile016',
    name: 'Sunil Tiwari',
    alias: 'Sunny',
    personal: { firstName: 'Sunil', lastName: 'Tiwari', dateOfBirth: '1987-04-28', age: 38, gender: 'Male', nationality: 'Indian' },
    address: { current: 'Auto Parts Shop, Mayapuri', permanent: 'Dwarka Sector 10, Delhi', city: 'Delhi', state: 'Delhi', pincode: '110064' },
    contact: { mobile: '+91 98766 77777' },
    status: 'Active',
    createdAt: '2025-12-11T09:30:00',
    createdBy: 'emp004',
    createdByName: 'Sneha Reddy',
    lastUpdated: '2025-12-11T09:30:00',
    caseLinked: 'case006',
    changeHistory: [{ id: 'ph023', changeType: 'created', changedBy: 'emp004', changedByName: 'Sneha Reddy', timestamp: '2025-12-11T09:30:00', description: 'Profile created' }],
  },
  {
    id: 'profile017',
    name: 'Arvind Kumar',
    alias: 'Arvi',
    personal: { firstName: 'Arvind', lastName: 'Kumar', dateOfBirth: '1991-10-05', age: 34, gender: 'Male', nationality: 'Indian' },
    address: { current: 'Garage No. 12, Kirti Nagar', permanent: 'Uttam Nagar, Delhi', city: 'Delhi', state: 'Delhi', pincode: '110015' },
    contact: { mobile: '+91 98766 88888', whatsapp: '+91 98766 88888' },
    status: 'Under Investigation',
    createdAt: '2025-12-12T11:00:00',
    createdBy: 'emp004',
    createdByName: 'Sneha Reddy',
    lastUpdated: '2025-12-27T14:20:00',
    caseLinked: 'case006',
    changeHistory: [
      { id: 'ph024', changeType: 'created', changedBy: 'emp004', changedByName: 'Sneha Reddy', timestamp: '2025-12-12T11:00:00', description: 'Profile created' },
      { id: 'ph025', changeType: 'updated', changedBy: 'emp004', changedByName: 'Sneha Reddy', timestamp: '2025-12-27T14:20:00', field: 'status', oldValue: 'Active', newValue: 'Under Investigation', description: 'Suspected supplier of fake parts' },
    ],
  },
  {
    id: 'profile018',
    name: 'Bharat Singh',
    alias: 'Bharat Bhai',
    personal: { firstName: 'Bharat', lastName: 'Singh', dateOfBirth: '1985-12-22', age: 40, gender: 'Male', nationality: 'Indian' },
    address: { current: 'Workshop, Industrial Area Phase 2', permanent: 'Rohtak, Haryana', city: 'Delhi', state: 'Delhi', pincode: '110064' },
    contact: { mobile: '+91 98766 99999' },
    status: 'Active',
    createdAt: '2025-12-15T10:15:00',
    createdBy: 'emp004',
    createdByName: 'Sneha Reddy',
    lastUpdated: '2025-12-15T10:15:00',
    caseLinked: 'case006',
    changeHistory: [{ id: 'ph026', changeType: 'created', changedBy: 'emp004', changedByName: 'Sneha Reddy', timestamp: '2025-12-15T10:15:00', description: 'Profile created' }],
  },

  // Profiles 19-20: Case 007 (Zara)
  {
    id: 'profile019',
    name: 'Mukesh Agarwal',
    alias: 'Mukku',
    personal: { firstName: 'Mukesh', lastName: 'Agarwal', dateOfBirth: '1989-02-14', age: 36, gender: 'Male', nationality: 'Indian' },
    address: { current: 'Shop 45, Sarojini Nagar Market', permanent: 'Rajendra Place, Delhi', city: 'Delhi', state: 'Delhi', pincode: '110023' },
    contact: { mobile: '+91 98767 11111', email: 'mukesh.a@example.com' },
    status: 'Active',
    createdAt: '2025-12-19T09:00:00',
    createdBy: 'emp004',
    createdByName: 'Sneha Reddy',
    lastUpdated: '2025-12-19T09:00:00',
    caseLinked: 'case007',
    changeHistory: [{ id: 'ph027', changeType: 'created', changedBy: 'emp004', changedByName: 'Sneha Reddy', timestamp: '2025-12-19T09:00:00', description: 'Profile created' }],
  },
  {
    id: 'profile020',
    name: 'Pankaj Goyal',
    alias: 'PG',
    personal: { firstName: 'Pankaj', lastName: 'Goyal', dateOfBirth: '1994-06-30', age: 31, gender: 'Male', nationality: 'Indian' },
    address: { current: 'Boutique, Karol Bagh', permanent: 'Pitampura, Delhi', city: 'Delhi', state: 'Delhi', pincode: '110005' },
    contact: { mobile: '+91 98767 22222' },
    status: 'Active',
    createdAt: '2025-12-20T14:45:00',
    createdBy: 'emp004',
    createdByName: 'Sneha Reddy',
    lastUpdated: '2025-12-20T14:45:00',
    caseLinked: 'case007',
    changeHistory: [{ id: 'ph028', changeType: 'created', changedBy: 'emp004', changedByName: 'Sneha Reddy', timestamp: '2025-12-20T14:45:00', description: 'Profile created' }],
  },

  // Profiles 21-24: Case 008 (Lakme)
  {
    id: 'profile021',
    name: 'Kiran Bala',
    alias: 'KB',
    personal: { firstName: 'Kiran', lastName: 'Bala', dateOfBirth: '1986-08-18', age: 39, gender: 'Female', nationality: 'Indian' },
    address: { current: 'Beauty Store, Kamla Nagar', permanent: 'Model Town, Delhi', city: 'Delhi', state: 'Delhi', pincode: '110007' },
    contact: { mobile: '+91 98767 33333', whatsapp: '+91 98767 33333' },
    status: 'Under Investigation',
    createdAt: '2025-11-26T10:00:00',
    createdBy: 'emp005',
    createdByName: 'Vikram Singh',
    lastUpdated: '2025-12-28T16:30:00',
    caseLinked: 'case008',
    changeHistory: [
      { id: 'ph029', changeType: 'created', changedBy: 'emp005', changedByName: 'Vikram Singh', timestamp: '2025-11-26T10:00:00', description: 'Profile created' },
      { id: 'ph030', changeType: 'updated', changedBy: 'emp005', changedByName: 'Vikram Singh', timestamp: '2025-12-28T16:30:00', field: 'status', oldValue: 'Active', newValue: 'Under Investigation', description: 'Found selling toxic cosmetics' },
    ],
  },
  {
    id: 'profile022',
    name: 'Neha Kapoor',
    alias: 'NK',
    personal: { firstName: 'Neha', lastName: 'Kapoor', dateOfBirth: '1992-03-25', age: 33, gender: 'Female', nationality: 'Indian' },
    address: { current: 'Cosmetic Store, Lajpat Nagar', permanent: 'Greater Kailash, Delhi', city: 'Delhi', state: 'Delhi', pincode: '110024' },
    contact: { mobile: '+91 98767 44444', email: 'neha.k@example.com' },
    status: 'Active',
    createdAt: '2025-11-28T11:30:00',
    createdBy: 'emp005',
    createdByName: 'Vikram Singh',
    lastUpdated: '2025-11-28T11:30:00',
    caseLinked: 'case008',
    changeHistory: [{ id: 'ph031', changeType: 'created', changedBy: 'emp005', changedByName: 'Vikram Singh', timestamp: '2025-11-28T11:30:00', description: 'Profile created' }],
  },
  {
    id: 'profile023',
    name: 'Pooja Sharma',
    alias: 'PS',
    personal: { firstName: 'Pooja', lastName: 'Sharma', dateOfBirth: '1990-11-12', age: 35, gender: 'Female', nationality: 'Indian' },
    address: { current: 'Beauty Parlour, Rajouri Garden', permanent: 'Janakpuri, Delhi', city: 'Delhi', state: 'Delhi', pincode: '110027' },
    contact: { mobile: '+91 98767 55555' },
    status: 'Active',
    createdAt: '2025-12-05T09:45:00',
    createdBy: 'emp005',
    createdByName: 'Vikram Singh',
    lastUpdated: '2025-12-05T09:45:00',
    caseLinked: 'case008',
    changeHistory: [{ id: 'ph032', changeType: 'created', changedBy: 'emp005', changedByName: 'Vikram Singh', timestamp: '2025-12-05T09:45:00', description: 'Profile created' }],
  },
  {
    id: 'profile024',
    name: 'Meena Gupta',
    alias: 'MG',
    personal: { firstName: 'Meena', lastName: 'Gupta', dateOfBirth: '1987-05-08', age: 38, gender: 'Female', nationality: 'Indian' },
    address: { current: 'Store 78, Karol Bagh Market', permanent: 'Paschim Vihar, Delhi', city: 'Delhi', state: 'Delhi', pincode: '110005' },
    contact: { mobile: '+91 98767 66666', whatsapp: '+91 98767 66666' },
    status: 'Under Investigation',
    createdAt: '2025-12-10T14:00:00',
    createdBy: 'emp005',
    createdByName: 'Vikram Singh',
    lastUpdated: '2025-12-29T11:15:00',
    caseLinked: 'case008',
    changeHistory: [
      { id: 'ph033', changeType: 'created', changedBy: 'emp005', changedByName: 'Vikram Singh', timestamp: '2025-12-10T14:00:00', description: 'Profile created' },
      { id: 'ph034', changeType: 'updated', changedBy: 'emp005', changedByName: 'Vikram Singh', timestamp: '2025-12-29T11:15:00', field: 'status', oldValue: 'Active', newValue: 'Under Investigation', description: 'Lab tests confirmed harmful substances' },
    ],
  },

  // Profile 25: Case 009 (Sony)
  {
    id: 'profile025',
    name: 'Rohit Mehta',
    alias: 'RM',
    personal: { firstName: 'Rohit', lastName: 'Mehta', dateOfBirth: '1993-09-16', age: 32, gender: 'Male', nationality: 'Indian' },
    address: { current: 'Electronics Store, Nehru Place', permanent: 'Noida Sector 62, UP', city: 'Delhi', state: 'Delhi', pincode: '110019' },
    contact: { mobile: '+91 98767 77777', email: 'rohit.m@example.com' },
    status: 'Active',
    createdAt: '2025-12-06T10:30:00',
    createdBy: 'emp005',
    createdByName: 'Vikram Singh',
    lastUpdated: '2025-12-06T10:30:00',
    caseLinked: 'case009',
    changeHistory: [{ id: 'ph035', changeType: 'created', changedBy: 'emp005', changedByName: 'Vikram Singh', timestamp: '2025-12-06T10:30:00', description: 'Profile created' }],
  },

  // Profiles 26-27: Case 010 (Coca Cola)
  {
    id: 'profile026',
    name: 'Ajay Rana',
    alias: 'AJ',
    personal: { firstName: 'Ajay', lastName: 'Rana', dateOfBirth: '1988-07-22', age: 37, gender: 'Male', nationality: 'Indian' },
    address: { current: 'Warehouse 23, Mundka Industrial Area', permanent: 'Nangloi, Delhi', city: 'Delhi', state: 'Delhi', pincode: '110041' },
    contact: { mobile: '+91 98767 88888' },
    status: 'Arrested',
    createdAt: '2025-11-02T09:00:00',
    createdBy: 'emp005',
    createdByName: 'Vikram Singh',
    lastUpdated: '2025-12-14T16:00:00',
    caseLinked: 'case010',
    changeHistory: [
      { id: 'ph036', changeType: 'created', changedBy: 'emp005', changedByName: 'Vikram Singh', timestamp: '2025-11-02T09:00:00', description: 'Profile created' },
      { id: 'ph037', changeType: 'updated', changedBy: 'emp005', changedByName: 'Vikram Singh', timestamp: '2025-12-14T16:00:00', field: 'status', oldValue: 'Under Investigation', newValue: 'Arrested', description: 'Arrested for manufacturing fake beverages' },
    ],
  },
  {
    id: 'profile027',
    name: 'Sandeep Jha',
    alias: 'Sandy',
    personal: { firstName: 'Sandeep', lastName: 'Jha', dateOfBirth: '1990-12-10', age: 35, gender: 'Male', nationality: 'Indian' },
    address: { current: 'Distribution Center, Narela', permanent: 'Bawana, Delhi', city: 'Delhi', state: 'Delhi', pincode: '110040' },
    contact: { mobile: '+91 98767 99999', whatsapp: '+91 98767 99999' },
    status: 'Arrested',
    createdAt: '2025-11-08T11:00:00',
    createdBy: 'emp005',
    createdByName: 'Vikram Singh',
    lastUpdated: '2025-12-14T16:30:00',
    caseLinked: 'case010',
    changeHistory: [
      { id: 'ph038', changeType: 'created', changedBy: 'emp005', changedByName: 'Vikram Singh', timestamp: '2025-11-08T11:00:00', description: 'Profile created' },
      { id: 'ph039', changeType: 'updated', changedBy: 'emp005', changedByName: 'Vikram Singh', timestamp: '2025-12-14T16:30:00', field: 'status', oldValue: 'Active', newValue: 'Arrested', description: 'Arrested along with Ajay Rana' },
    ],
  },

  // Additional 3 general profiles
  {
    id: 'profile028',
    name: 'Vikas Pandey',
    alias: 'VP',
    personal: { firstName: 'Vikas', lastName: 'Pandey', dateOfBirth: '1991-04-15', age: 34, gender: 'Male', nationality: 'Indian' },
    address: { current: 'Shop 90, Chandni Chowk', permanent: 'Seelampur, Delhi', city: 'Delhi', state: 'Delhi', pincode: '110006' },
    contact: { mobile: '+91 98768 11111' },
    status: 'Active',
    createdAt: '2025-12-01T10:00:00',
    createdBy: 'emp002',
    createdByName: 'Priya Sharma',
    lastUpdated: '2025-12-01T10:00:00',
    changeHistory: [{ id: 'ph040', changeType: 'created', changedBy: 'emp002', changedByName: 'Priya Sharma', timestamp: '2025-12-01T10:00:00', description: 'Profile created' }],
  },
  {
    id: 'profile029',
    name: 'Naveen Kumar',
    alias: 'Navi',
    personal: { firstName: 'Naveen', lastName: 'Kumar', dateOfBirth: '1989-10-20', age: 36, gender: 'Male', nationality: 'Indian' },
    address: { current: 'Flat 567, Vasant Kunj', permanent: 'Gurgaon, Haryana', city: 'Delhi', state: 'Delhi', pincode: '110070' },
    contact: { mobile: '+91 98768 22222', email: 'naveen.k@example.com' },
    status: 'Active',
    createdAt: '2025-12-03T11:30:00',
    createdBy: 'emp003',
    createdByName: 'Amit Patel',
    lastUpdated: '2025-12-03T11:30:00',
    changeHistory: [{ id: 'ph041', changeType: 'created', changedBy: 'emp003', changedByName: 'Amit Patel', timestamp: '2025-12-03T11:30:00', description: 'Profile created' }],
  },
  {
    id: 'profile030',
    name: 'Tarun Khanna',
    alias: 'TK',
    personal: { firstName: 'Tarun', lastName: 'Khanna', dateOfBirth: '1992-01-28', age: 33, gender: 'Male', nationality: 'Indian' },
    address: { current: 'Office 45, Connaught Place', permanent: 'Chanakyapuri, Delhi', city: 'Delhi', state: 'Delhi', pincode: '110001' },
    contact: { mobile: '+91 98768 33333', whatsapp: '+91 98768 33333' },
    status: 'Active',
    createdAt: '2025-12-07T09:15:00',
    createdBy: 'emp004',
    createdByName: 'Sneha Reddy',
    lastUpdated: '2025-12-07T09:15:00',
    changeHistory: [{ id: 'ph042', changeType: 'created', changedBy: 'emp004', changedByName: 'Sneha Reddy', timestamp: '2025-12-07T09:15:00', description: 'Profile created' }],
  },
];

export const getProfileById = (id: string) => mockProfiles.find(p => p.id === id);
export const getProfilesByEmployee = (empId: string) => mockProfiles.filter(p => p.createdBy === empId);
export const getProfilesByCase = (caseId: string) => mockProfiles.filter(p => p.caseLinked === caseId);
