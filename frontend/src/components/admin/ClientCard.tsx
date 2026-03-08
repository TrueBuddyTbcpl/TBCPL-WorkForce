import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Building2, Package, Edit, Trash2, ImageIcon, X } from 'lucide-react';
import { ADMIN_QUERY_KEYS } from '../../utils/constants';
import { getProductsByClientId } from '../../services/api/clientProduct.api';
import type { Client } from '../../services/api/client.api';

interface ClientCardProps {
  client: Client;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onDelete: () => void;
}

const ClientCard: React.FC<ClientCardProps> = ({ client, onDelete }) => {
  const [showProductsModal, setShowProductsModal] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [imgError, setImgError] = useState(false);

  const { data: productsResponse, isLoading: productsLoading, error } = useQuery({
    queryKey: [ADMIN_QUERY_KEYS.CLIENT_PRODUCTS_BY_CLIENT(client.clientId)],
    queryFn: () => getProductsByClientId(client.clientId),
    enabled: !!client.clientId,
    retry: 1,
    staleTime: 30000,
  });

  const products = productsResponse?.data || [];
  const productCount = products.length;

  const handleCloseModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowProductsModal(false);
      setIsClosing(false);
    }, 200);
  };

  return (
    <>
      {/* ── Card ── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col hover:shadow-md hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer">

        {/* ── Logo Area ── */}
        <div
          className="relative bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center"
          style={{ height: '160px' }}
        >
          {client.logoUrl && !imgError ? (
            <img
              src={client.logoUrl}
              alt={`${client.clientName} logo`}
              className="w-full h-full object-contain p-6"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                <Building2 className="w-8 h-8 text-blue-500" />
              </div>
              <span className="text-xs text-gray-400 font-medium">No Logo</span>
            </div>
          )}

          {/* Logo badge */}
          {client.logoUrl && !imgError && (
            <span className="absolute top-3 right-3 inline-flex items-center gap-1 text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-medium border border-green-200">
              <ImageIcon className="w-3 h-3" />
              Logo
            </span>
          )}
        </div>

        {/* ── Client Info ── */}
        <div className="p-4 flex-1 flex flex-col gap-1">
          <h3 className="text-base font-bold text-gray-900 truncate" title={client.clientName}>
            {client.clientName}
          </h3>
          {client.clientCode && (
            <p className="text-xs text-gray-500">
              Code: <span className="font-medium text-gray-700">{client.clientCode}</span>
            </p>
          )}
          {client.industry && (
            <p className="text-xs text-gray-500 truncate">Industry: {client.industry}</p>
          )}
          {client.createdAt && (
            <p className="text-xs text-gray-400 mt-auto pt-1">
              Added: {new Date(client.createdAt).toLocaleDateString('en-IN', {
                day: '2-digit', month: 'short', year: 'numeric',
              })}
            </p>
          )}
        </div>

        {/* ── Bottom Actions ── */}
        <div className="border-t border-gray-100 px-4 py-3 flex items-center justify-between bg-gray-50">
          <button
            onClick={() => setShowProductsModal(true)}
            className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium transition"
          >
            <Package className="w-4 h-4" />
            <span>{productsLoading ? '...' : productCount} Products</span>
          </button>

          <div className="flex items-center gap-1">
            <button className="p-1.5 text-gray-500 hover:bg-gray-200 hover:text-gray-700 rounded-lg transition">
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={onDelete}
              className="p-1.5 text-red-500 hover:bg-red-100 hover:text-red-700 rounded-lg transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Products Modal ── */}
      {showProductsModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={(e) => { if (e.target === e.currentTarget) handleCloseModal(); }}
        >
          <div className={`bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col ${
            isClosing ? 'animate-modal-zoom-out' : 'animate-modal-zoom'
          }`}>

            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg border border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center flex-shrink-0">
                  {client.logoUrl && !imgError ? (
                    <img
                      src={client.logoUrl}
                      alt={client.clientName}
                      className="w-full h-full object-contain p-1"
                      onError={() => setImgError(true)}
                    />
                  ) : (
                    <Building2 className="w-5 h-5 text-blue-500" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{client.clientName}</h3>
                  <p className="text-xs text-gray-500">
                    {productsLoading ? 'Loading...' : `${productCount} product${productCount !== 1 ? 's' : ''}`}
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-5">
              {productsLoading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                  <p className="text-sm text-gray-500">Loading products...</p>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-red-500 font-medium">Error loading products</p>
                  <p className="text-xs text-gray-400 mt-1">{(error as any)?.message}</p>
                </div>
              ) : products.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center">
                    <Package className="w-7 h-7 text-gray-300" />
                  </div>
                  <p className="text-gray-400 text-sm font-medium">No products added yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="bg-gray-50 rounded-xl border border-gray-200 p-4 flex items-center gap-3 hover:shadow-sm hover:border-blue-200 transition"
                    >
                      <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Package className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">
                          {product.productName}
                        </p>
                        <p className="text-xs text-gray-400">ID: {product.id}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-100 px-5 py-3 bg-gray-50 rounded-b-2xl">
              <button
                onClick={handleCloseModal}
                className="w-full py-2 text-sm text-gray-600 hover:text-gray-800 font-medium transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ClientCard;
