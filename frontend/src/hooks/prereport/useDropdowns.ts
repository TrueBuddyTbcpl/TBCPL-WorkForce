// src/hooks/prereport/useClients.ts
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../lib/api-client';

interface Client {
  id: number;
  clientId: string;
  clientName: string;
}

export const useClients = () => {
  return useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data } = await apiClient.get<{ clients: Client[] }>(
        '/operation/prereport/dropdown/clients'
      );
      return data.clients;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
