// src/hooks/prereport/useProducts.ts
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../lib/api-client';

interface Product {
  id: number;
  productId: string;
  productName: string;
  description?: string;
}

interface RawProduct {
  id?: number;
  productId?: string | number;
  productName?: string;
  description?: string;
  clientId?: number;
}

// src/hooks/prereport/useProducts.ts
// src/hooks/prereport/useProducts.ts
export const useProducts = (clientId: number | null) => {
  return useQuery<Product[]>({
    queryKey: ['products', clientId],
    queryFn: async () => {
      const { data } = await apiClient.get(
        `/operation/prereport/dropdown/products/client/${clientId}`
      );

      const rawProducts = Array.isArray(data) ? data : data?.products ?? [];

      // ✅ FIX: Map productId to id if missing
      return rawProducts.map((product: RawProduct) => ({
        id: product.id || Number(product.productId),
        productId: product.productId?.toString() || String(product.id),
        productName: product.productName || 'Unknown Product',
        description: product.description
      }));
    },
    enabled: typeof clientId === 'number' && clientId > 0,
    staleTime: 5 * 60 * 1000,
  });
};



