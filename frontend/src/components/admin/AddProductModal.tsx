import React, { useState, useMemo } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X, Save, Package, Search } from 'lucide-react';
import { toast } from 'sonner';
import {
  createClientProduct,
  type CreateClientProductRequest,
} from '../../services/api/clientProduct.api';
import type { Client } from '../../services/api/client.api';
import { ADMIN_QUERY_KEYS } from '../../utils/constants';

interface AddProductModalProps {
  clients: Client[];
  onClose: () => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ clients, onClose }) => {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<CreateClientProductRequest>({
    productName: '',
    clientId: 0,
  });

  const [clientSearchTerm, setClientSearchTerm] = useState('');
  const [showClientDropdown, setShowClientDropdown] = useState(false);

  const filteredClients = useMemo(() => {
    if (!clientSearchTerm) return clients;
    return clients.filter(
      (client) =>
        client.clientName.toLowerCase().includes(clientSearchTerm.toLowerCase()) ||
        // ✅ Fixed: Add optional chaining
        (client.clientCode?.toLowerCase().includes(clientSearchTerm.toLowerCase()))
    );
  }, [clients, clientSearchTerm]);

  // ✅ Fixed: Use clientId instead of id
  const selectedClient = clients.find((c) => c.clientId === formData.clientId);

  const createMutation = useMutation({
    mutationFn: createClientProduct,
    onSuccess: () => {
      toast.success('Product created successfully!');
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEYS.CLIENT_PRODUCTS] });
      queryClient.invalidateQueries({
        queryKey: [ADMIN_QUERY_KEYS.CLIENT_PRODUCTS_BY_CLIENT(formData.clientId)],
      });
      onClose();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to create product');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.productName.trim()) {
      toast.error('Product name is required');
      return;
    }

    if (!formData.clientId) {
      toast.error('Please select a client');
      return;
    }

    createMutation.mutate(formData);
  };

  const handleSelectClient = (client: Client) => {
    // ✅ Fixed: Use clientId instead of id
    setFormData({ ...formData, clientId: client.clientId });
    setClientSearchTerm(client.clientName);
    setShowClientDropdown(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-green-50 p-2 rounded-lg">
                <Package className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Add New Product</h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
              disabled={createMutation.isPending}
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Client Selection */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Select Client *
            </label>
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                required
                type="text"
                value={clientSearchTerm}
                onChange={(e) => {
                  setClientSearchTerm(e.target.value);
                  setShowClientDropdown(true);
                }}
                onFocus={() => setShowClientDropdown(true)}
                placeholder="Search and select client..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {selectedClient && !showClientDropdown && (
              <div className="mt-2 p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm font-medium text-green-900">{selectedClient.clientName}</p>
                {/* ✅ Fixed: Add optional chaining */}
                {selectedClient.clientCode && (
                  <p className="text-xs text-green-700">Code: {selectedClient.clientCode}</p>
                )}
              </div>
            )}

            {showClientDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredClients.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">No clients found</div>
                ) : (
                  filteredClients.map((client) => (
                    <button
                      key={client.clientId} // ✅ Fixed: Use clientId
                      type="button"
                      onClick={() => handleSelectClient(client)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 transition border-b border-gray-100 last:border-0"
                    >
                      <p className="font-medium text-gray-900">{client.clientName}</p>
                      {/* ✅ Fixed: Add optional chaining */}
                      {client.clientCode && (
                        <p className="text-xs text-gray-600">Code: {client.clientCode}</p>
                      )}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Product Name *
            </label>
            <input
              required
              type="text"
              value={formData.productName}
              onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
              placeholder="Enter product name"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition"
              disabled={createMutation.isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending || !formData.clientId}
              className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium transition flex items-center justify-center gap-2"
            >
              {createMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Create Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
