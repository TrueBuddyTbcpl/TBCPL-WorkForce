// src/hooks/prereport/useCustomScope.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../lib/api-client';

interface CustomScope {
  id: number;
  prereportId: number;
  scopeTitle: string;
  scopeDescription: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateCustomScopeRequest {
  prereportId: string;
  scopeTitle: string;
  scopeDescription: string;
}

interface UpdateCustomScopeRequest {
  id: number;
  scopeTitle: string;
  scopeDescription: string;
}

// Get custom scopes
export const useCustomScopes = (prereportId: string) => {
  return useQuery({
    queryKey: ['customScopes', prereportId],
    queryFn: async () => {
      const { data } = await apiClient.get<{ scopes: CustomScope[] }>(
        `/operation/prereport/${prereportId}/custom-scope`
      );
      return data.scopes;
    },
    enabled: !!prereportId,
  });
};

// Create custom scope
export const useCreateCustomScope = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: CreateCustomScopeRequest) => {
      const { data } = await apiClient.post(
        `/operation/prereport/${request.prereportId}/custom-scope`,
        {
          scopeTitle: request.scopeTitle,
          scopeDescription: request.scopeDescription,
        }
      );
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['customScopes', variables.prereportId] 
      });
    },
  });
};

// Update custom scope
export const useUpdateCustomScope = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateCustomScopeRequest) => {
      const response = await apiClient.put(
        `/operation/prereport/custom-scope/${id}`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customScopes'] });
    },
  });
};

// Delete custom scope
export const useDeleteCustomScope = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await apiClient.delete(
        `/operation/prereport/custom-scope/${id}`
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customScopes'] });
    },
  });
};
