import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X, Save, Building2, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { createClient, type CreateClientRequest } from '../../services/api/client.api';
import { ADMIN_QUERY_KEYS } from '../../utils/constants';

interface AddClientModalProps {
  onClose: () => void;
}

const AddClientModal: React.FC<AddClientModalProps> = ({ onClose }) => {
  const queryClient = useQueryClient();

  // ✅ Only clientName - matches your backend entity
  const [formData, setFormData] = useState<CreateClientRequest>({
    clientName: '',
  });

  const createMutation = useMutation({
    mutationFn: createClient,
    onSuccess: () => {
      toast.success('Client created successfully!');
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEYS.CLIENTS] });
      onClose();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to create client');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.clientName.trim()) {
      toast.error('Client name is required');
      return;
    }

    createMutation.mutate(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 p-2 rounded-lg">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Add New Client</h3>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Client Name - Only Required Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Client Name *
            </label>
            <input
              required
              type="text"
              value={formData.clientName}
              onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
              placeholder="Enter client name"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
          </div>

          {/* Logo Upload - Disabled (Coming Soon) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Client Logo
            </label>
            <div className="relative">
              <button
                type="button"
                disabled
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed"
              >
                <Upload className="w-5 h-5" />
                <span className="text-sm">Logo Upload - Coming Soon</span>
              </button>
              <p className="text-xs text-gray-500 mt-2">
                Logo upload feature will be available in the next update
              </p>
            </div>
          </div>

          {/* Info Message */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Additional client details (code, industry, contact info) can be added later through the edit option.
            </p>
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
              disabled={createMutation.isPending || !formData.clientName.trim()}
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium transition flex items-center justify-center gap-2"
            >
              {createMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Create Client
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddClientModal;
