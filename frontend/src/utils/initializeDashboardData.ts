import { dashboardStorage } from '../components/operations/dashboard/utils/dashboardStorage';
import type { Case, Employee, RecentProfile } from '../components/operations/dashboard/types/dashboard.types';

export const initializeDashboardData = () => {
  // Set current employee
  const employee: Employee = {
    id: 'emp001',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@tbcpl.com',
    role: 'Senior Investigator',
    department: 'Operations',
    phone: '+91 98765 43210',
    joinDate: '2023-01-15',
  };
  dashboardStorage.setCurrentEmployee(employee);

  // ... rest of the file remains the same


  // Create sample cases
  const cases: Case[] = [
    {
      id: 'case001',
      caseNumber: 'TBCPL-2025-001',
      title: 'Counterfeit Electronics Investigation',
      client: {
        id: 'client001',
        name: 'Samsung India',
        productName: 'Galaxy Smartphones',
      },
      assignedTo: employee,
      status: 'in-progress',
      priority: 'high',
      createdDate: '2025-12-01',
      lastUpdated: '2025-12-30',
      description: 'Investigation of counterfeit Samsung Galaxy smartphones sold through unauthorized channels in Delhi NCR region.',
      profilesLinked: 3,
      reportsGenerated: 2,
    },
    {
      id: 'case002',
      caseNumber: 'TBCPL-2025-002',
      title: 'Trademark Violation - Apparel',
      client: {
        id: 'client002',
        name: 'Adidas India',
        productName: 'Sports Footwear',
      },
      assignedTo: employee,
      status: 'open',
      priority: 'critical',
      createdDate: '2025-12-15',
      lastUpdated: '2025-12-29',
      description: 'Multiple shops in Lajpat Nagar selling fake Adidas shoes with original branding.',
      profilesLinked: 5,
      reportsGenerated: 1,
    },
    {
      id: 'case003',
      caseNumber: 'TBCPL-2025-003',
      title: 'Online Marketplace Fraud',
      client: {
        id: 'client003',
        name: 'Apple India',
        productName: 'iPhone & Accessories',
      },
      assignedTo: employee,
      status: 'closed',
      priority: 'medium',
      createdDate: '2025-11-10',
      lastUpdated: '2025-12-20',
      description: 'Investigation completed for fake Apple chargers sold on e-commerce platforms.',
      profilesLinked: 2,
      reportsGenerated: 4,
    },
  ];
  dashboardStorage.saveCases(cases);

  // Create sample profiles
  const profiles: RecentProfile[] = [
    {
      id: 'profile001',
      name: 'Ramesh Gupta',
      alias: 'Ramu',
      createdBy: 'Rajesh Kumar',
      createdDate: '2025-12-29',
      caseLinked: 'TBCPL-2025-001',
    },
    {
      id: 'profile002',
      name: 'Mohammad Khan',
      alias: 'Bunty',
      createdBy: 'Rajesh Kumar',
      createdDate: '2025-12-28',
      caseLinked: 'TBCPL-2025-002',
    },
    {
      id: 'profile003',
      name: 'Vijay Sharma',
      alias: 'VJ',
      createdBy: 'Rajesh Kumar',
      createdDate: '2025-12-27',
      caseLinked: 'TBCPL-2025-001',
    },
  ];
  profiles.forEach(profile => dashboardStorage.addRecentProfile(profile));
};

// Call this once in your App.tsx or main component
// initializeDashboardData();
