import React, { useState, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X, Save, Building2, Upload, ImageIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { createClient, uploadClientLogo, type CreateClientRequest } from '../../services/api/client.api';
import { ADMIN_QUERY_KEYS } from '../../utils/constants';

interface AddClientModalProps {
  onClose: () => void;
}

const AddClientModal: React.FC<AddClientModalProps> = ({ onClose }) => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<CreateClientRequest>({ clientName: '' });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Step 1 — Create client
  const createMutation = useMutation({
    mutationFn: createClient,
    onSuccess: async (createdClient) => {
      // Step 2 — If logo selected, upload it right after creation
      if (selectedFile) {
        await uploadMutation.mutateAsync({
          clientId: createdClient.data.clientId,
          file: selectedFile,
        });
      } else {
        toast.success('Client created successfully!');
        queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEYS.CLIENTS] });
        onClose();
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to create client');
    },
  });

  // Step 2 — Upload logo to Cloudinary via backend
  const uploadMutation = useMutation({
    mutationFn: ({ clientId, file }: { clientId: number; file: File }) =>
      uploadClientLogo(clientId, file),
    onSuccess: () => {
      toast.success('Client created with logo successfully!');
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEYS.CLIENTS] });
      onClose();
    },
    onError: () => {
      // Client was created but logo failed — still close and refresh
      toast.warning('Client created, but logo upload failed. You can re-upload from edit.');
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEYS.CLIENTS] });
      onClose();
    },
  });

  const isLoading = createMutation.isPending || uploadMutation.isPending;

  const getLoadingText = () => {
    if (uploadMutation.isPending) return 'Uploading Logo...';
    if (createMutation.isPending) return 'Creating...';
    return null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are allowed (JPG, PNG, etc.)');
      return;
    }

    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be under 5MB');
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

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
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
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
              disabled={isLoading}
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {/* Client Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Client Name <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="text"
              value={formData.clientName}
              onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
              placeholder="Enter client name"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
              disabled={isLoading}
            />
          </div>

          {/* Logo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Client Logo <span className="text-gray-400 font-normal">(optional)</span>
            </label>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={isLoading}
            />

            {!selectedFile ? (
              /* Upload trigger */
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="w-full flex flex-col items-center justify-center gap-2 px-4 py-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all group disabled:cursor-not-allowed disabled:opacity-50"
              >
                <div className="w-10 h-10 bg-gray-100 group-hover:bg-blue-100 rounded-full flex items-center justify-center transition-colors">
                  <Upload className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600 group-hover:text-blue-600 transition-colors">
                    Click to upload logo
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">PNG, JPG, WEBP up to 5MB</p>
                </div>
              </button>
            ) : (
              /* Preview */
              <div className="border-2 border-blue-200 bg-blue-50 rounded-xl p-4">
                <div className="flex items-center gap-4">
                  {/* Image preview */}
                  <div className="w-16 h-16 rounded-lg border border-gray-200 bg-white overflow-hidden flex-shrink-0 flex items-center justify-center">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Logo preview"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-gray-300" />
                    )}
                  </div>

                  {/* File info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{selectedFile.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {(selectedFile.size / 1024).toFixed(1)} KB · {selectedFile.type.split('/')[1].toUpperCase()}
                    </p>
                    <p className="text-xs text-blue-600 font-medium mt-1">
                      ✓ Will upload to Cloudinary
                    </p>
                  </div>

                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    disabled={isLoading}
                    className="p-1.5 hover:bg-red-100 rounded-lg transition text-gray-400 hover:text-red-500 flex-shrink-0"
                    title="Remove logo"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Re-upload option */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                  className="mt-3 w-full text-xs text-blue-600 hover:text-blue-700 font-medium py-1 hover:bg-blue-100 rounded-lg transition"
                >
                  Choose a different file
                </button>
              </div>
            )}
          </div>

          {/* Upload progress indicator */}
          {uploadMutation.isPending && (
            <div className="flex items-center gap-3 px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg">
              <Loader2 className="w-4 h-4 text-blue-500 animate-spin flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-800">Uploading to Cloudinary...</p>
                <p className="text-xs text-blue-600 mt-0.5">This may take a few seconds</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !formData.clientName.trim()}
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium transition flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {getLoadingText()}
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
