import { useQuery } from '@tanstack/react-query';
import apiClient from '../../services/api/apiClient';

export interface OperationsEmployee {
  id: number;
  empId: string;
  fullName: string;
  email: string;
  roleName: string;
  departmentName: string;
}

export const useOperationsEmployees = () => {
  return useQuery({
    queryKey: ['operations-employees'],
    queryFn: async (): Promise<OperationsEmployee[]> => {
      const res = await apiClient.get('/operation/cases/operations-employees');
      return res.data?.data || [];
    },
    staleTime: 5 * 60 * 1000, // cache for 5 minutes
  });
};
