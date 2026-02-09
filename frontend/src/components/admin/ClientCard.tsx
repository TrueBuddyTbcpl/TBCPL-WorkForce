import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Building2, Package, ChevronDown, ChevronUp, Edit, Trash2 } from 'lucide-react';
import { ADMIN_QUERY_KEYS } from '../../utils/constants';
import { getProductsByClientId } from '../../services/api/clientProduct.api';
import type { Client } from '../../services/api/client.api';

interface ClientCardProps {
  client: Client;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onDelete: () => void;
}

const ClientCard: React.FC<ClientCardProps> = ({
  client,
  isExpanded,
  onToggleExpand,
  onDelete,
}) => {
  // ✅ ALWAYS fetch products (not just when expanded) to get count
  const { data: productsResponse, isLoading: productsLoading, error } = useQuery({
    queryKey: [ADMIN_QUERY_KEYS.CLIENT_PRODUCTS_BY_CLIENT(client.clientId)],
    queryFn: () => getProductsByClientId(client.clientId),
    enabled: !!client.clientId, // ✅ Changed: Always fetch, not just when expanded
    retry: 1,
    staleTime: 30000, // Cache for 30 seconds
  });

  const products = productsResponse?.data || [];
  const productCount = products.length;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Client Header */}
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            <div className="bg-blue-50 p-3 rounded-lg">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">{client.clientName}</h3>
              {client.clientCode && (
                <p className="text-sm text-gray-600">Code: {client.clientCode}</p>
              )}
              {client.industry && (
                <p className="text-sm text-gray-500 mt-1">Industry: {client.industry}</p>
              )}
              {client.contactPerson && (
                <p className="text-sm text-gray-500">Contact: {client.contactPerson}</p>
              )}
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                  client.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {client.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onToggleExpand}
              className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition"
            >
              <Package className="w-4 h-4" />
              {/* ✅ Show loading state for count */}
              Products ({productsLoading ? '...' : productCount})
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Products List (Expanded) */}
      {isExpanded && (
        <div className="border-t border-gray-200 bg-gray-50 p-6">
          {productsLoading ? (
            <p className="text-center text-gray-600">Loading products...</p>
          ) : error ? (
            <div className="text-center">
              <p className="text-red-600 mb-2">Error loading products</p>
              <p className="text-xs text-gray-500">{(error as any)?.message}</p>
            </div>
          ) : products.length === 0 ? (
            <p className="text-center text-gray-500">No products added yet</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between mb-2">
                    <Package className="w-5 h-5 text-green-600" />
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>
                  <h4 className="font-semibold text-gray-900">{product.productName}</h4>
                  <p className="text-xs text-gray-500 mt-1">ID: {product.id}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ClientCard;
