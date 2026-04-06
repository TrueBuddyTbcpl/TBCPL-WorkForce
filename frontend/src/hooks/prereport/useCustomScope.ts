// src/hooks/prereport/useCustomScope.ts
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../lib/api-client';

export interface CustomScopeItem {
  id: number;
  stepNumber: number;
  optionName: string;
  optionDescription?: string;
  leadType: string;
  fieldKey?: string;
  createdBy?: string;
  createdAt?: string;
}

// ✅ Now accepts leadType + optional stepNumber dynamically
export const useCustomScopes = (leadType?: string, stepNumber?: number) => {
  return useQuery({
    queryKey: ['customScopes', leadType ?? '', stepNumber ?? 'all'],
    queryFn: async () => {
      const params: Record<string, unknown> = {};
      if (leadType)              params.leadType   = leadType;
      if (stepNumber !== undefined) params.stepNumber = stepNumber;

      const { data } = await apiClient.get(
        `/operation/prereport/custom-options`,
        { params }
      );
      return (data?.data ?? []) as CustomScopeItem[];
    },
    enabled: !!leadType, // ← only runs once leadType is known
  });
};