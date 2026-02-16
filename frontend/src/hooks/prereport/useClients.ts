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

      console.log('Clients API Response:', response.data);  // ✅ Debug log

      // ✅ Backend returns direct array (no wrapper)
      if (Array.isArray(response.data)) {
        return response.data;
      }

      // ✅ Fallback checks for other formats
      if (response.data?.data && Array.isArray(response.data.data)) {
        return response.data.data;
      }

      if (response.data?.clients && Array.isArray(response.data.clients)) {
        return response.data.clients;
      }

      console.error('Unexpected response format:', response.data);
      return [];
    },
    staleTime: 5 * 60 * 1000,
    // ✅ Add these for better debugging
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
