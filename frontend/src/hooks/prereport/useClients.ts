// src/hooks/prereport/useClients.ts
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../lib/api-client';

interface Client {
  id: number;
  clientId: string;
  clientName: string;
}

export const useClients = () => {
  return useQuery<Client[]>({
    queryKey: ['clients'],
    queryFn: async () => {
      const response = await apiClient.get('/operation/prereport/dropdown/clients');

      // ✔️ Handles ALL backend shapes safely
      if (Array.isArray(response.data)) {
        return response.data;
      }

      if (Array.isArray(response.data?.clients)) {
        return response.data.clients;
      }

      if (Array.isArray(response.data?.data)) {
        return response.data.data;
      }

      return [];
    },
    staleTime: 5 * 60 * 1000,
  });
};
