import { useQuery } from '@tanstack/react-query';
import {
  getLoginHistory,
  getLoginAttempts,
  getLoginAttemptsByEmployee,
} from '../services/api/loginHistory.api';
import type { LoginHistoryFilters, LoginAttemptsFilters } from '../types/loginHistory.types';

const QUERY_KEYS = {
  LOGIN_HISTORY: ['loginHistory'],
  LOGIN_ATTEMPTS: ['loginAttempts'],
  LOGIN_ATTEMPTS_BY_EMP: (empId: string) => ['loginAttempts', empId],
};

/**
 * Hook to fetch login history
 */
export const useLoginHistory = (filters?: LoginHistoryFilters) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.LOGIN_HISTORY, filters],
    queryFn: () => getLoginHistory(filters),
  });
};

/**
 * Hook to fetch login attempts
 */
export const useLoginAttempts = (filters?: LoginAttemptsFilters) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.LOGIN_ATTEMPTS, filters],
    queryFn: () => getLoginAttempts(filters),
  });
};

/**
 * Hook to fetch login attempts by employee
 */
export const useLoginAttemptsByEmployee = (empId: string, filters?: LoginAttemptsFilters) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.LOGIN_ATTEMPTS_BY_EMP(empId), filters],
    queryFn: () => getLoginAttemptsByEmployee(empId, filters),
    enabled: !!empId,
  });
};
