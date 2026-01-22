// src/hooks/prereport/useProducts.ts
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../lib/api-client';

interface Product {
  id: number;
  productId: string;
  productName: string;
  description?: string;
}

export const useProducts = (clientId: string | null) => {
  return useQuery({
    queryKey: ['products', clientId],
    queryFn: async () => {
      if (!clientId) return [];
      
      const { data } = await apiClient.get<{ products: Product[] }>(
        `/operation/prereport/dropdown/products/client/${clientId}`
      );
      return data.products;
    },
    enabled: !!clientId,
    staleTime: 5 * 60 * 1000,
  });
};
