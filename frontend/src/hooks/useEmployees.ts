import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from '../services/api/employee.api';
import { AUTH_QUERY_KEYS } from '../utils/constants';
import type { EmployeeFilters } from '../types/employee.types';

/**
 * Hook to fetch all employees
 */
export const useEmployees = (filters?: EmployeeFilters) => {
  return useQuery({
    queryKey: [...AUTH_QUERY_KEYS.EMPLOYEES, filters],
    queryFn: () => getEmployees(filters),
  });
};

/**
 * Hook to fetch single employee
 */
export const useEmployee = (empId: string) => {
  return useQuery({
    queryKey: AUTH_QUERY_KEYS.EMPLOYEE_DETAIL(empId),
    queryFn: () => getEmployeeById(empId),
    enabled: !!empId,
  });
};

/**
 * Hook to create employee
 */
export const useCreateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.EMPLOYEES });
    },
  });
};

/**
 * Hook to update employee
 */
export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ empId, data }: { empId: string; data: any }) =>
      updateEmployee(empId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.EMPLOYEES });
      queryClient.invalidateQueries({
        queryKey: AUTH_QUERY_KEYS.EMPLOYEE_DETAIL(variables.empId),
      });
    },
  });
};

/**
 * Hook to delete employee
 */
export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.EMPLOYEES });
    },
  });
};
