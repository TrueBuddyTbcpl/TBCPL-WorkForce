import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from '../services/api/department.api';
import { AUTH_QUERY_KEYS } from '../utils/constants';// Add this import

export const useDepartments = () => {
  return useQuery<{ data: any[] }>({
    queryKey: [AUTH_QUERY_KEYS.DEPARTMENTS],
    queryFn: getDepartments,
  });
};


export const useDepartment = (id: number) => {
  return useQuery({
    queryKey: [AUTH_QUERY_KEYS.DEPARTMENTS, id],
    queryFn: () => getDepartmentById(id),
    enabled: !!id,
  });
};

export const useCreateDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [AUTH_QUERY_KEYS.DEPARTMENTS] });
    },
  });
};

export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => updateDepartment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [AUTH_QUERY_KEYS.DEPARTMENTS] });
    },
  });
};

export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [AUTH_QUERY_KEYS.DEPARTMENTS] });
    },
  });
};
