import { useQuery } from '@tanstack/react-query';
import { getClients, getProductsByClientId } from '../../services/api/prereport.service';
import { QUERY_KEYS } from '../../utils/constants';

export const useClients = () => {
  return useQuery({
    queryKey: QUERY_KEYS.CLIENTS,
    queryFn: getClients,
  });
};

export const useProducts = (clientId: number | null) => {
  return useQuery({
    queryKey: QUERY_KEYS.PRODUCTS(clientId!),
    queryFn: () => getProductsByClientId(clientId!),
    enabled: !!clientId,
  });
};
