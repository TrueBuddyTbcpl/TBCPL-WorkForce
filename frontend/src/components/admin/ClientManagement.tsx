import React, { useState } from 'react';
import ClientCard from './ClientCard';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Building2,
  Plus,
  Search,
  Package,
} from 'lucide-react';
import { toast } from 'sonner';
import { ADMIN_QUERY_KEYS } from '../../utils/constants';
import {
  getClients,
  deleteClient,
} from '../../services/api/client.api';
import AddClientModal from './AddClientModal';
import AddProductModal from './AddProductModal';

const ClientManagement: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [expandedClientId, setExpandedClientId] = useState<number | null>(null);

  // Fetch all clients
  const { data: clientsResponse, isLoading } = useQuery({
    queryKey: [ADMIN_QUERY_KEYS.CLIENTS],
    queryFn: getClients,
  });

  const clients = clientsResponse?.data || [];

  // Delete client mutation
  const deleteMutation = useMutation({
    mutationFn: deleteClient,
    onSuccess: () => {
      toast.success('Client deleted successfully!');
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEYS.CLIENTS] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to delete client');
    },
  });

  // Filter clients by search
  // Filter clients by search
  const filteredClients = clients.filter((client) =>
    client.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    // ✅ Fixed: Add optional chaining
    (client.clientCode?.toLowerCase().includes(searchTerm.toLowerCase()))
  );


  const handleDeleteClient = (clientId: number, name: string) => {
    if (window.confirm(`Are you sure you want to delete client "${name}"?`)) {
      deleteMutation.mutate(clientId);
    }
  };


  const toggleClientExpand = (clientId: number) => {
    setExpandedClientId(expandedClientId === clientId ? null : clientId);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 p-3 rounded-lg">
              <Building2 className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Client Management</h1>
              <p className="text-sm text-gray-600">Manage clients and their products</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto">
            <button
              onClick={() => setShowAddClientModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              <Plus className="w-4 h-4" />
              Add Client
            </button>
            <button
              onClick={() => setShowAddProductModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
            >
              <Package className="w-4 h-4" />
              Add Product
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mt-4">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search clients by name or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading clients...</p>
        </div>
      ) : filteredClients.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">No clients found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredClients.map((client) => (
            <ClientCard
              key={client.clientId}  // ✅ Changed from client.id
              client={client}
              isExpanded={expandedClientId === client.clientId}  // ✅ Changed
              onToggleExpand={() => toggleClientExpand(client.clientId)}  // ✅ Changed
              onDelete={() => handleDeleteClient(client.clientId, client.clientName)}  // ✅ Changed
            />

          ))}
        </div>
      )}

      {/* Modals */}
      {showAddClientModal && (
        <AddClientModal onClose={() => setShowAddClientModal(false)} />
      )}

      {showAddProductModal && (
        <AddProductModal
          clients={clients}
          onClose={() => setShowAddProductModal(false)}
        />
      )}
    </div>
  );
};

export default ClientManagement;
