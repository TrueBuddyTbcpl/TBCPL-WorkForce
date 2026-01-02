import type { Case, RecentProfile, Employee, DashboardStats } from '../types/dashboard.types';

const STORAGE_KEYS = {
  CASES: 'tbcpl_cases',
  RECENT_PROFILES: 'tbcpl_recent_profiles',
  CURRENT_EMPLOYEE: 'tbcpl_current_employee',
  DASHBOARD_VIEW: 'tbcpl_dashboard_view',
};

export const dashboardStorage = {
  // Cases Management
  getCases: (): Case[] => {
    const data = localStorage.getItem(STORAGE_KEYS.CASES);
    return data ? JSON.parse(data) : [];
  },

  saveCases: (cases: Case[]): void => {
    localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(cases));
  },

  getCaseById: (id: string): Case | null => {
    const cases = dashboardStorage.getCases();
    return cases.find(c => c.id === id) || null;
  },

  // Recent Profiles
  getRecentProfiles: (): RecentProfile[] => {
    const data = localStorage.getItem(STORAGE_KEYS.RECENT_PROFILES);
    return data ? JSON.parse(data) : [];
  },

  saveRecentProfiles: (profiles: RecentProfile[]): void => {
    localStorage.setItem(STORAGE_KEYS.RECENT_PROFILES, JSON.stringify(profiles));
  },

  addRecentProfile: (profile: RecentProfile): void => {
    const profiles = dashboardStorage.getRecentProfiles();
    const updated = [profile, ...profiles.filter(p => p.id !== profile.id)].slice(0, 10);
    dashboardStorage.saveRecentProfiles(updated);
  },

  // Current Employee
  getCurrentEmployee: (): Employee | null => {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_EMPLOYEE);
    return data ? JSON.parse(data) : null;
  },

  setCurrentEmployee: (employee: Employee): void => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_EMPLOYEE, JSON.stringify(employee));
  },

  // Statistics
  getDashboardStats: (): DashboardStats => {
    const cases = dashboardStorage.getCases();
    const profiles = dashboardStorage.getRecentProfiles();

    return {
      totalCases: cases.length,
      openCases: cases.filter(c => c.status === 'open').length,
      closedCases: cases.filter(c => c.status === 'closed').length,
      activeCases: cases.filter(c => ['open', 'in-progress'].includes(c.status)).length,
      profilesCreated: profiles.length,
      reportsGenerated: cases.reduce((sum, c) => sum + c.reportsGenerated, 0),
    };
  },
};
