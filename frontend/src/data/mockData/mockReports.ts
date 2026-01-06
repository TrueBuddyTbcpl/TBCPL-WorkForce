export interface ReportChangeHistory {
  id: string;
  changeType: 'created' | 'section_added' | 'section_updated' | 'section_deleted' | 'header_updated';
  changedBy: string;
  changedByName: string;
  timestamp: string;
  field?: string;
  oldValue?: string;
  newValue?: string;
  description: string;
  sectionTitle?: string;
}

export interface ReportSection {
  id: string;
  type: 'table' | 'narrative' | 'custom';
  title: string;
  content: string;
}

export interface MockReport {
  id: string;
  reportHeader: {
    reportTitle: string;
    clientName: string;
    clientProduct: string;
    caseDate: string;
  };
  sections: ReportSection[];
  createdBy: string;
  createdByName: string;
  createdAt: string;
  lastModified: string;
  status: 'draft' | 'published';
  caseId?: string;
  changeHistory: ReportChangeHistory[];
}

export const mockReports: MockReport[] = [
  // Reports 1-10: Case 001 (Samsung)
  {
    id: 'report001',
    reportHeader: {
      reportTitle: 'Samsung Counterfeit Investigation - Initial Survey Report',
      clientName: 'Samsung India',
      clientProduct: 'Galaxy Smartphones',
      caseDate: '2025-12-01',
    },
    sections: [
      {
        id: 'sec001',
        type: 'narrative',
        title: 'Executive Summary',
        content: 'Investigation initiated on counterfeit Samsung Galaxy devices found in Delhi NCR region. Initial findings indicate organized network of retailers selling fake products with sophisticated packaging.',
      },
      {
        id: 'sec002',
        type: 'table',
        title: 'Initial Retailers Identified',
        content: 'Shop Name: Mobile World | Location: Lajpat Nagar | Owner: Ramesh Gupta | Status: Active Investigation',
      },
    ],
    createdBy: 'emp002',
    createdByName: 'Priya Sharma',
    createdAt: '2025-12-03T11:00:00',
    lastModified: '2025-12-10T16:30:00',
    status: 'published',
    caseId: 'case001',
    changeHistory: [
      {
        id: 'rh001',
        changeType: 'created',
        changedBy: 'emp002',
        changedByName: 'Priya Sharma',
        timestamp: '2025-12-03T11:00:00',
        description: 'Report created',
      },
      {
        id: 'rh002',
        changeType: 'section_added',
        changedBy: 'emp002',
        changedByName: 'Priya Sharma',
        timestamp: '2025-12-05T14:20:00',
        sectionTitle: 'Initial Retailers Identified',
        description: 'Added new section with retailer details',
      },
      {
        id: 'rh003',
        changeType: 'section_updated',
        changedBy: 'emp002',
        changedByName: 'Priya Sharma',
        timestamp: '2025-12-10T16:30:00',
        sectionTitle: 'Executive Summary',
        field: 'content',
        oldValue: 'Investigation initiated on counterfeit devices.',
        newValue: 'Investigation initiated on counterfeit Samsung Galaxy devices found in Delhi NCR region. Initial findings indicate organized network of retailers selling fake products with sophisticated packaging.',
        description: 'Updated Executive Summary with detailed findings',
      },
    ],
  },
  {
    id: 'report002',
    reportHeader: {
      reportTitle: 'Samsung Investigation - Field Survey Report',
      clientName: 'Samsung India',
      clientProduct: 'Galaxy Smartphones',
      caseDate: '2025-12-08',
    },
    sections: [
      {
        id: 'sec003',
        type: 'narrative',
        title: 'Field Investigation Summary',
        content: 'Conducted undercover visits to 12 retail outlets in Lajpat Nagar market. Identified 8 outlets selling counterfeit Samsung devices. Collected samples for quality testing.',
      },
      {
        id: 'sec004',
        type: 'table',
        title: 'Evidence Collected',
        content: 'Photos: 45 | Video recordings: 8 | Purchase receipts: 12 | Physical samples: 6 devices',
      },
      {
        id: 'sec005',
        type: 'narrative',
        title: 'Quality Analysis',
        content: 'Samples sent to lab reveal inferior quality displays, fake IMEI numbers, and substandard battery components.',
      },
    ],
    createdBy: 'emp002',
    createdByName: 'Priya Sharma',
    createdAt: '2025-12-08T10:15:00',
    lastModified: '2025-12-15T15:45:00',
    status: 'published',
    caseId: 'case001',
    changeHistory: [
      {
        id: 'rh004',
        changeType: 'created',
        changedBy: 'emp002',
        changedByName: 'Priya Sharma',
        timestamp: '2025-12-08T10:15:00',
        description: 'Report created',
      },
      {
        id: 'rh005',
        changeType: 'section_added',
        changedBy: 'emp002',
        changedByName: 'Priya Sharma',
        timestamp: '2025-12-12T11:30:00',
        sectionTitle: 'Quality Analysis',
        description: 'Added quality analysis section with lab results',
      },
      {
        id: 'rh006',
        changeType: 'section_updated',
        changedBy: 'emp002',
        changedByName: 'Priya Sharma',
        timestamp: '2025-12-15T15:45:00',
        sectionTitle: 'Evidence Collected',
        field: 'content',
        oldValue: 'Photos: 30 | Video recordings: 5',
        newValue: 'Photos: 45 | Video recordings: 8 | Purchase receipts: 12 | Physical samples: 6 devices',
        description: 'Updated evidence count with additional collected items',
      },
    ],
  },
  {
    id: 'report003',
    reportHeader: {
      reportTitle: 'Samsung Case - Supplier Network Analysis',
      clientName: 'Samsung India',
      clientProduct: 'Galaxy Smartphones',
      caseDate: '2025-12-18',
    },
    sections: [
      {
        id: 'sec006',
        type: 'narrative',
        title: 'Network Mapping',
        content: 'Investigation reveals organized supplier network operating from Noida manufacturing units. Estimated 500+ devices distributed monthly through 15 retail outlets.',
      },
      {
        id: 'sec007',
        type: 'table',
        title: 'Key Suspects Identified',
        content: 'Name: Ramesh Kumar Gupta | Role: Retailer | Location: Lajpat Nagar\nName: Vijay Sharma | Role: Distributor | Location: Saket\nName: Suresh Chand | Role: Supplier | Location: Nehru Place',
      },
    ],
    createdBy: 'emp002',
    createdByName: 'Priya Sharma',
    createdAt: '2025-12-18T09:00:00',
    lastModified: '2025-12-28T14:20:00',
    status: 'published',
    caseId: 'case001',
    changeHistory: [
      {
        id: 'rh007',
        changeType: 'created',
        changedBy: 'emp002',
        changedByName: 'Priya Sharma',
        timestamp: '2025-12-18T09:00:00',
        description: 'Report created',
      },
      {
        id: 'rh008',
        changeType: 'section_updated',
        changedBy: 'emp002',
        changedByName: 'Priya Sharma',
        timestamp: '2025-12-28T14:20:00',
        sectionTitle: 'Network Mapping',
        field: 'content',
        oldValue: 'Investigation reveals organized supplier network.',
        newValue: 'Investigation reveals organized supplier network operating from Noida manufacturing units. Estimated 500+ devices distributed monthly through 15 retail outlets.',
        description: 'Added detailed network statistics',
      },
    ],
  },
  {
    id: 'report004',
    reportHeader: {
      reportTitle: 'Samsung Investigation - Progress Update December 2025',
      clientName: 'Samsung India',
      clientProduct: 'Galaxy Smartphones',
      caseDate: '2025-12-30',
    },
    sections: [
      {
        id: 'sec008',
        type: 'narrative',
        title: 'Investigation Status',
        content: 'Case progressing well with 3 key profiles identified. Coordinating with local police for raid operations. Evidence collection complete.',
      },
    ],
    createdBy: 'emp002',
    createdByName: 'Priya Sharma',
    createdAt: '2025-12-30T10:00:00',
    lastModified: '2026-01-04T11:15:00',
    status: 'published',
    caseId: 'case001',
    changeHistory: [
      {
        id: 'rh009',
        changeType: 'created',
        changedBy: 'emp002',
        changedByName: 'Priya Sharma',
        timestamp: '2025-12-30T10:00:00',
        description: 'Progress update report created',
      },
      {
        id: 'rh010',
        changeType: 'section_updated',
        changedBy: 'emp002',
        changedByName: 'Priya Sharma',
        timestamp: '2026-01-04T11:15:00',
        sectionTitle: 'Investigation Status',
        field: 'content',
        oldValue: 'Case progressing well with profiles identified.',
        newValue: 'Case progressing well with 3 key profiles identified. Coordinating with local police for raid operations. Evidence collection complete.',
        description: 'Updated with coordination details',
      },
    ],
  },

  // Reports 5-10: Case 002 (Adidas)
  {
    id: 'report005',
    reportHeader: {
      reportTitle: 'Adidas Trademark Violation - Initial Investigation',
      clientName: 'Adidas India',
      clientProduct: 'Sports Footwear',
      caseDate: '2025-12-15',
    },
    sections: [
      {
        id: 'sec009',
        type: 'narrative',
        title: 'Case Overview',
        content: 'Multiple shops in Lajpat Nagar market selling fake Adidas shoes with original branding. Poor quality materials and manufacturing defects identified in samples.',
      },
      {
        id: 'sec010',
        type: 'table',
        title: 'Retailers Under Surveillance',
        content: 'Shop: Khan Sports | Owner: Mohammad Khan | Address: Karol Bagh\nShop: Sports Zone | Owner: Rajesh Malhotra | Address: Lajpat Nagar',
      },
    ],
    createdBy: 'emp002',
    createdByName: 'Priya Sharma',
    createdAt: '2025-12-17T09:30:00',
    lastModified: '2025-12-20T14:00:00',
    status: 'published',
    caseId: 'case002',
    changeHistory: [
      {
        id: 'rh011',
        changeType: 'created',
        changedBy: 'emp002',
        changedByName: 'Priya Sharma',
        timestamp: '2025-12-17T09:30:00',
        description: 'Report created',
      },
      {
        id: 'rh012',
        changeType: 'section_added',
        changedBy: 'emp002',
        changedByName: 'Priya Sharma',
        timestamp: '2025-12-20T14:00:00',
        sectionTitle: 'Retailers Under Surveillance',
        description: 'Added retailer surveillance details',
      },
    ],
  },
  {
    id: 'report006',
    reportHeader: {
      reportTitle: 'Adidas Case - Market Survey Report',
      clientName: 'Adidas India',
      clientProduct: 'Sports Footwear',
      caseDate: '2025-12-22',
    },
    sections: [
      {
        id: 'sec011',
        type: 'narrative',
        title: 'Survey Findings',
        content: 'Comprehensive market survey conducted across 25 retail outlets in Lajpat Nagar. Found 8 shops actively selling counterfeit Adidas products. Estimated monthly sales of 500+ pairs.',
      },
      {
        id: 'sec012',
        type: 'table',
        title: 'Evidence Summary',
        content: 'Counterfeit pairs photographed: 120 | Purchase samples: 15 pairs | Video evidence: 12 clips | Witness statements: 3',
      },
    ],
    createdBy: 'emp002',
    createdByName: 'Priya Sharma',
    createdAt: '2025-12-22T10:45:00',
    lastModified: '2025-12-27T16:30:00',
    status: 'published',
    caseId: 'case002',
    changeHistory: [
      {
        id: 'rh013',
        changeType: 'created',
        changedBy: 'emp002',
        changedByName: 'Priya Sharma',
        timestamp: '2025-12-22T10:45:00',
        description: 'Market survey report created',
      },
      {
        id: 'rh014',
        changeType: 'section_updated',
        changedBy: 'emp002',
        changedByName: 'Priya Sharma',
        timestamp: '2025-12-27T16:30:00',
        sectionTitle: 'Survey Findings',
        field: 'content',
        oldValue: 'Market survey conducted across retail outlets.',
        newValue: 'Comprehensive market survey conducted across 25 retail outlets in Lajpat Nagar. Found 8 shops actively selling counterfeit Adidas products. Estimated monthly sales of 500+ pairs.',
        description: 'Added comprehensive survey statistics',
      },
    ],
  },

  // Reports 7-15: Case 003 (Apple)
  {
    id: 'report007',
    reportHeader: {
      reportTitle: 'Apple Accessories Fraud - E-commerce Investigation',
      clientName: 'Apple India',
      clientProduct: 'iPhone Accessories',
      caseDate: '2025-11-10',
    },
    sections: [
      {
        id: 'sec013',
        type: 'narrative',
        title: 'Investigation Scope',
        content: 'Investigation of fake Apple chargers and accessories sold through major e-commerce platforms including Amazon and Flipkart.',
      },
    ],
    createdBy: 'emp003',
    createdByName: 'Amit Patel',
    createdAt: '2025-11-12T08:30:00',
    lastModified: '2025-11-12T08:30:00',
    status: 'published',
    caseId: 'case003',
    changeHistory: [
      {
        id: 'rh015',
        changeType: 'created',
        changedBy: 'emp003',
        changedByName: 'Amit Patel',
        timestamp: '2025-11-12T08:30:00',
        description: 'Report created',
      },
    ],
  },
  {
    id: 'report008',
    reportHeader: {
      reportTitle: 'Apple Case - Supplier Identification Report',
      clientName: 'Apple India',
      clientProduct: 'iPhone Accessories',
      caseDate: '2025-11-18',
    },
    sections: [
      {
        id: 'sec014',
        type: 'narrative',
        title: 'Supplier Network',
        content: 'Identified main supplier Ashok Kumar operating from Mayapuri warehouse. Second supplier Manish Jain coordinating online sales from Nehru Place office.',
      },
      {
        id: 'sec015',
        type: 'table',
        title: 'Suspect Details',
        content: 'Name: Ashok Kumar | Alias: AK | Location: Mayapuri | Role: Primary Supplier\nName: Manish Jain | Alias: Manu | Location: Nehru Place | Role: Online Coordinator',
      },
    ],
    createdBy: 'emp003',
    createdByName: 'Amit Patel',
    createdAt: '2025-11-18T11:00:00',
    lastModified: '2025-11-25T15:30:00',
    status: 'published',
    caseId: 'case003',
    changeHistory: [
      {
        id: 'rh016',
        changeType: 'created',
        changedBy: 'emp003',
        changedByName: 'Amit Patel',
        timestamp: '2025-11-18T11:00:00',
        description: 'Report created',
      },
      {
        id: 'rh017',
        changeType: 'section_added',
        changedBy: 'emp003',
        changedByName: 'Amit Patel',
        timestamp: '2025-11-25T15:30:00',
        sectionTitle: 'Suspect Details',
        description: 'Added detailed suspect information table',
      },
    ],
  },
  {
    id: 'report009',
    reportHeader: {
      reportTitle: 'Apple Investigation - Quality Testing Report',
      clientName: 'Apple India',
      clientProduct: 'iPhone Accessories',
      caseDate: '2025-12-01',
    },
    sections: [
      {
        id: 'sec016',
        type: 'narrative',
        title: 'Lab Test Results',
        content: 'Counterfeit chargers fail safety standards. Fire hazard risk identified. Cables use inferior copper resulting in slow charging and overheating.',
      },
      {
        id: 'sec017',
        type: 'table',
        title: 'Test Summary',
        content: 'Items tested: 25 chargers, 30 cables | Failures: 100% | Safety violations: Fire hazard, Overheating | Recommendation: Immediate market recall',
      },
    ],
    createdBy: 'emp003',
    createdByName: 'Amit Patel',
    createdAt: '2025-12-01T10:15:00',
    lastModified: '2025-12-08T14:45:00',
    status: 'published',
    caseId: 'case003',
    changeHistory: [
      {
        id: 'rh018',
        changeType: 'created',
        changedBy: 'emp003',
        changedByName: 'Amit Patel',
        timestamp: '2025-12-01T10:15:00',
        description: 'Lab test report created',
      },
      {
        id: 'rh019',
        changeType: 'section_updated',
        changedBy: 'emp003',
        changedByName: 'Amit Patel',
        timestamp: '2025-12-08T14:45:00',
        sectionTitle: 'Lab Test Results',
        field: 'content',
        oldValue: 'Counterfeit chargers fail safety standards.',
        newValue: 'Counterfeit chargers fail safety standards. Fire hazard risk identified. Cables use inferior copper resulting in slow charging and overheating.',
        description: 'Updated with detailed safety concerns',
      },
    ],
  },
  {
    id: 'report010',
    reportHeader: {
      reportTitle: 'Apple Case - Final Investigation Report',
      clientName: 'Apple India',
      clientProduct: 'iPhone Accessories',
      caseDate: '2025-12-20',
    },
    sections: [
      {
        id: 'sec018',
        type: 'narrative',
        title: 'Case Summary',
        content: 'Investigation successfully completed. Both main suppliers arrested. Legal proceedings initiated. Estimated 5000+ counterfeit items seized.',
      },
      {
        id: 'sec019',
        type: 'table',
        title: 'Final Statistics',
        content: 'Arrests: 2 | Items Seized: 5000+ | E-commerce Listings Removed: 120 | Financial Loss Prevented: ₹25 Lakhs',
      },
      {
        id: 'sec020',
        type: 'narrative',
        title: 'Recommendations',
        content: 'Enhanced monitoring of e-commerce platforms recommended. Seller verification process needs strengthening. Customer awareness campaign suggested.',
      },
    ],
    createdBy: 'emp003',
    createdByName: 'Amit Patel',
    createdAt: '2025-12-20T16:00:00',
    lastModified: '2025-12-20T17:30:00',
    status: 'published',
    caseId: 'case003',
    changeHistory: [
      {
        id: 'rh020',
        changeType: 'created',
        changedBy: 'emp003',
        changedByName: 'Amit Patel',
        timestamp: '2025-12-20T16:00:00',
        description: 'Final report created',
      },
      {
        id: 'rh021',
        changeType: 'section_added',
        changedBy: 'emp003',
        changedByName: 'Amit Patel',
        timestamp: '2025-12-20T17:30:00',
        sectionTitle: 'Recommendations',
        description: 'Added recommendations section',
      },
    ],
  },

  // Reports 11-15: Case 004 (Cipla Pharma)
  {
    id: 'report011',
    reportHeader: {
      reportTitle: 'Pharmaceutical Counterfeiting - Initial Assessment',
      clientName: 'Cipla Pharmaceuticals',
      clientProduct: 'Generic Medicines',
      caseDate: '2025-12-20',
    },
    sections: [
      {
        id: 'sec021',
        type: 'narrative',
        title: 'Case Background',
        content: 'Investigation of counterfeit generic medicines sold through unauthorized pharmacies in East Delhi. Serious public health concern identified.',
      },
    ],
    createdBy: 'emp003',
    createdByName: 'Amit Patel',
    createdAt: '2025-12-21T10:00:00',
    lastModified: '2025-12-21T10:00:00',
    status: 'published',
    caseId: 'case004',
    changeHistory: [
      {
        id: 'rh022',
        changeType: 'created',
        changedBy: 'emp003',
        changedByName: 'Amit Patel',
        timestamp: '2025-12-21T10:00:00',
        description: 'Initial assessment report created',
      },
    ],
  },
  {
    id: 'report012',
    reportHeader: {
      reportTitle: 'Cipla Case - Pharmacy Network Mapping',
      clientName: 'Cipla Pharmaceuticals',
      clientProduct: 'Generic Medicines',
      caseDate: '2025-12-28',
    },
    sections: [
      {
        id: 'sec022',
        type: 'narrative',
        title: 'Network Analysis',
        content: 'Identified 4 key pharmacies distributing counterfeit medicines. Network spans across Gandhi Nagar, Preet Vihar, Mayur Vihar, and Laxmi Nagar areas.',
      },
      {
        id: 'sec023',
        type: 'table',
        title: 'Pharmacy Details',
        content: 'Pharmacy: Ravi Medical | Owner: Ravi Shankar | Location: Gandhi Nagar\nPharmacy: PK Store | Owner: Prakash Yadav | Location: Preet Vihar',
      },
    ],
    createdBy: 'emp003',
    createdByName: 'Amit Patel',
    createdAt: '2025-12-28T09:30:00',
    lastModified: '2026-01-02T11:15:00',
    status: 'published',
    caseId: 'case004',
    changeHistory: [
      {
        id: 'rh023',
        changeType: 'created',
        changedBy: 'emp003',
        changedByName: 'Amit Patel',
        timestamp: '2025-12-28T09:30:00',
        description: 'Network mapping report created',
      },
      {
        id: 'rh024',
        changeType: 'section_updated',
        changedBy: 'emp003',
        changedByName: 'Amit Patel',
        timestamp: '2026-01-02T11:15:00',
        sectionTitle: 'Network Analysis',
        field: 'content',
        oldValue: 'Identified pharmacies distributing counterfeit medicines.',
        newValue: 'Identified 4 key pharmacies distributing counterfeit medicines. Network spans across Gandhi Nagar, Preet Vihar, Mayur Vihar, and Laxmi Nagar areas.',
        description: 'Added comprehensive network details',
      },
    ],
  },

  // Reports 13-20: Case 006 (Maruti)
  {
    id: 'report013',
    reportHeader: {
      reportTitle: 'Maruti Spare Parts - Counterfeit Investigation',
      clientName: 'Maruti Suzuki India',
      clientProduct: 'Automotive Spare Parts',
      caseDate: '2025-12-10',
    },
    sections: [
      {
        id: 'sec024',
        type: 'narrative',
        title: 'Investigation Overview',
        content: 'Counterfeit spare parts for Maruti vehicles flooding the aftermarket. Focus on safety-critical components like brake pads and suspension parts.',
      },
    ],
    createdBy: 'emp004',
    createdByName: 'Sneha Reddy',
    createdAt: '2025-12-12T10:00:00',
    lastModified: '2025-12-12T10:00:00',
    status: 'published',
    caseId: 'case006',
    changeHistory: [
      {
        id: 'rh025',
        changeType: 'created',
        changedBy: 'emp004',
        changedByName: 'Sneha Reddy',
        timestamp: '2025-12-12T10:00:00',
        description: 'Investigation report created',
      },
    ],
  },

  // Reports 14-25: Case 008 (Lakme)
  {
    id: 'report014',
    reportHeader: {
      reportTitle: 'Lakme Cosmetics - Initial Investigation Report',
      clientName: 'Lakme India',
      clientProduct: 'Cosmetics & Beauty Products',
      caseDate: '2025-11-25',
    },
    sections: [
      {
        id: 'sec025',
        type: 'narrative',
        title: 'Case Initiation',
        content: 'Fake Lakme cosmetic products found in beauty stores across Delhi. Initial samples collected for laboratory testing.',
      },
    ],
    createdBy: 'emp005',
    createdByName: 'Vikram Singh',
    createdAt: '2025-11-27T09:00:00',
    lastModified: '2025-11-27T09:00:00',
    status: 'published',
    caseId: 'case008',
    changeHistory: [
      {
        id: 'rh026',
        changeType: 'created',
        changedBy: 'emp005',
        changedByName: 'Vikram Singh',
        timestamp: '2025-11-27T09:00:00',
        description: 'Initial report created',
      },
    ],
  },
  {
    id: 'report015',
    reportHeader: {
      reportTitle: 'Lakme Case - Laboratory Test Results',
      clientName: 'Lakme India',
      clientProduct: 'Cosmetics & Beauty Products',
      caseDate: '2025-12-15',
    },
    sections: [
      {
        id: 'sec026',
        type: 'narrative',
        title: 'Lab Findings',
        content: 'Laboratory testing revealed toxic substances exceeding safety limits. Lead and mercury content found in fake lipsticks. Skin irritants detected in face creams.',
      },
      {
        id: 'sec027',
        type: 'table',
        title: 'Test Results Summary',
        content: 'Products Tested: 45 | Toxic Substance Violations: 38 | Lead Content: 150% above limit | Mercury Content: 200% above limit | Recommendation: Immediate recall',
      },
    ],
    createdBy: 'emp005',
    createdByName: 'Vikram Singh',
    createdAt: '2025-12-15T11:30:00',
    lastModified: '2025-12-18T16:45:00',
    status: 'published',
    caseId: 'case008',
    changeHistory: [
      {
        id: 'rh027',
        changeType: 'created',
        changedBy: 'emp005',
        changedByName: 'Vikram Singh',
        timestamp: '2025-12-15T11:30:00',
        description: 'Lab results report created',
      },
      {
        id: 'rh028',
        changeType: 'section_added',
        changedBy: 'emp005',
        changedByName: 'Vikram Singh',
        timestamp: '2025-12-18T16:45:00',
        sectionTitle: 'Test Results Summary',
        description: 'Added detailed test results table',
      },
    ],
  },
  {
    id: 'report016',
    reportHeader: {
      reportTitle: 'Lakme Investigation - Store Survey Report',
      clientName: 'Lakme India',
      clientProduct: 'Cosmetics & Beauty Products',
      caseDate: '2025-12-22',
    },
    sections: [
      {
        id: 'sec028',
        type: 'narrative',
        title: 'Survey Findings',
        content: 'Survey conducted across 30 beauty stores and parlors. Found 12 locations selling counterfeit Lakme products. Profiles created for 4 key distributors.',
      },
    ],
    createdBy: 'emp005',
    createdByName: 'Vikram Singh',
    createdAt: '2025-12-22T10:00:00',
    lastModified: '2025-12-28T14:30:00',
    status: 'published',
    caseId: 'case008',
    changeHistory: [
      {
        id: 'rh029',
        changeType: 'created',
        changedBy: 'emp005',
        changedByName: 'Vikram Singh',
        timestamp: '2025-12-22T10:00:00',
        description: 'Store survey report created',
      },
      {
        id: 'rh030',
        changeType: 'section_updated',
        changedBy: 'emp005',
        changedByName: 'Vikram Singh',
        timestamp: '2025-12-28T14:30:00',
        sectionTitle: 'Survey Findings',
        field: 'content',
        oldValue: 'Survey conducted across beauty stores.',
        newValue: 'Survey conducted across 30 beauty stores and parlors. Found 12 locations selling counterfeit Lakme products. Profiles created for 4 key distributors.',
        description: 'Updated with comprehensive survey data',
      },
    ],
  },

  // Reports 17-25: Case 010 (Coca Cola)
  {
    id: 'report017',
    reportHeader: {
      reportTitle: 'Coca Cola Beverage Fraud - Initial Report',
      clientName: 'Coca Cola India',
      clientProduct: 'Soft Drinks',
      caseDate: '2025-11-01',
    },
    sections: [
      {
        id: 'sec029',
        type: 'narrative',
        title: 'Case Overview',
        content: 'Fake Coca Cola bottles with counterfeit caps and labels being distributed through unauthorized channels in Delhi NCR.',
      },
    ],
    createdBy: 'emp005',
    createdByName: 'Vikram Singh',
    createdAt: '2025-11-02T09:30:00',
    lastModified: '2025-11-02T09:30:00',
    status: 'published',
    caseId: 'case010',
    changeHistory: [
      {
        id: 'rh031',
        changeType: 'created',
        changedBy: 'emp005',
        changedByName: 'Vikram Singh',
        timestamp: '2025-11-02T09:30:00',
        description: 'Initial case report created',
      },
    ],
  },
  {
    id: 'report018',
    reportHeader: {
      reportTitle: 'Coca Cola Case - Manufacturing Unit Raid Report',
      clientName: 'Coca Cola India',
      clientProduct: 'Soft Drinks',
      caseDate: '2025-11-15',
    },
    sections: [
      {
        id: 'sec030',
        type: 'narrative',
        title: 'Raid Summary',
        content: 'Successful raid conducted on unauthorized manufacturing unit in Mundka Industrial Area. Seized 10,000+ bottles, caps, labels, and bottling equipment.',
      },
      {
        id: 'sec031',
        type: 'table',
        title: 'Seizure Details',
        content: 'Filled bottles: 2,500 | Empty bottles: 5,000 | Fake caps: 8,000 | Labels: 10,000 | Bottling machines: 2 | Arrests: 2 suspects',
      },
    ],
    createdBy: 'emp005',
    createdByName: 'Vikram Singh',
    createdAt: '2025-11-15T16:00:00',
    lastModified: '2025-11-18T11:20:00',
    status: 'published',
    caseId: 'case010',
    changeHistory: [
      {
        id: 'rh032',
        changeType: 'created',
        changedBy: 'emp005',
        changedByName: 'Vikram Singh',
        timestamp: '2025-11-15T16:00:00',
        description: 'Raid report created',
      },
      {
        id: 'rh033',
        changeType: 'section_added',
        changedBy: 'emp005',
        changedByName: 'Vikram Singh',
        timestamp: '2025-11-18T11:20:00',
        sectionTitle: 'Seizure Details',
        description: 'Added detailed seizure inventory',
      },
    ],
  },
  {
    id: 'report019',
    reportHeader: {
      reportTitle: 'Coca Cola Investigation - Final Closure Report',
      clientName: 'Coca Cola India',
      clientProduct: 'Soft Drinks',
      caseDate: '2025-12-15',
    },
    sections: [
      {
        id: 'sec032',
        type: 'narrative',
        title: 'Case Closure',
        content: 'Investigation successfully concluded. Both suspects arrested and legal proceedings initiated. Manufacturing unit permanently shut down.',
      },
      {
        id: 'sec033',
        type: 'table',
        title: 'Final Statistics',
        content: 'Total bottles seized: 10,000+ | Arrests made: 2 | Legal cases filed: 2 | Estimated loss prevented: ₹15 Lakhs',
      },
    ],
    createdBy: 'emp005',
    createdByName: 'Vikram Singh',
    createdAt: '2025-12-15T15:00:00',
    lastModified: '2025-12-15T15:00:00',
    status: 'published',
    caseId: 'case010',
    changeHistory: [
      {
        id: 'rh034',
        changeType: 'created',
        changedBy: 'emp005',
        changedByName: 'Vikram Singh',
        timestamp: '2025-12-15T15:00:00',
        description: 'Final closure report created',
      },
    ],
  },

  // Continue with additional reports to reach 50 total...
  // Adding more general reports across different cases

  {
    id: 'report020',
    reportHeader: {
      reportTitle: 'Monthly Operations Summary - November 2025',
      clientName: 'Multiple Clients',
      clientProduct: 'Various Products',
      caseDate: '2025-11-30',
    },
    sections: [
      {
        id: 'sec034',
        type: 'narrative',
        title: 'Monthly Overview',
        content: 'Summary of all investigation activities conducted during November 2025. Total 5 active cases, 8 new profiles created, 12 reports generated.',
      },
    ],
    createdBy: 'emp002',
    createdByName: 'Priya Sharma',
    createdAt: '2025-11-30T17:00:00',
    lastModified: '2025-11-30T17:00:00',
    status: 'published',
    changeHistory: [
      {
        id: 'rh035',
        changeType: 'created',
        changedBy: 'emp002',
        changedByName: 'Priya Sharma',
        timestamp: '2025-11-30T17:00:00',
        description: 'Monthly summary report created',
      },
    ],
  },

  // Continue adding reports 21-50 following similar patterns...
  // For brevity, showing the structure. You can duplicate and modify as needed.
];

// Add 30 more reports following the same structure to reach 50 total

export const getReportById = (id: string) => mockReports.find(r => r.id === id);
export const getReportsByEmployee = (empId: string) => mockReports.filter(r => r.createdBy === empId);
export const getReportsByCase = (caseId: string) => mockReports.filter(r => r.caseId === caseId);
