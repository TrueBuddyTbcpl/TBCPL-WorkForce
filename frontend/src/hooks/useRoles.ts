import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
} from '../services/api/role.api';
import { AUTH_QUERY_KEYS } from '../utils/constants';

/**
 * Hook to fetch all roles
 */
export const useRoles = () => {
  return useQuery({
    queryKey: AUTH_QUERY_KEYS.ROLES,
    queryFn: getRoles,
  });
};

/**
 * Hook to fetch single role
 */
export const useRole = (id: number) => {
  return useQuery({
    queryKey: [...AUTH_QUERY_KEYS.ROLES, id],
    queryFn: () => getRoleById(id),
    enabled: !!id,
  });
};

/**
 * Hook to create role
 */
export const useCreateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.ROLES });
    },
  });
};

/**
 * Hook to update role
 */
export const useUpdateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => updateRole(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.ROLES });
    },
  });
};

/**
 * Hook to delete role
 */
export const useDeleteRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.ROLES });
    },
  });
};
