import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useClients } from '../../../hooks/prereport/useDropdowns';
import { useProducts } from '../../../hooks/prereport/useProducts';
import { useCreatePreReport } from '../../../hooks/prereport/useCreatePreReport';
import { initializeReportSchema } from '../../../schemas/prereport.schemas';
import { LeadType } from '../../../utils/constants';
import type { InitializeReportInput } from '../../../schemas/prereport.schemas';

export const CreatePreReport = () => {
  const navigate = useNavigate();
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);

  const { data: clients, isLoading: clientsLoading } = useClients();
  const { data: products, isLoading: productsLoading } = useProducts(
    selectedClientId ? String(selectedClientId) : null
  );
  const createMutation = useCreatePreReport();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<InitializeReportInput>({
    resolver: zodResolver(initializeReportSchema),
    defaultValues: {
      clientId: undefined,
      productIds: [],
      leadType: LeadType.CLIENT_LEAD as any,
    },
  });

  const watchClientId = watch('clientId');

  // Update selected client when form value changes
  useEffect(() => {
    if (watchClientId && watchClientId !== selectedClientId) {
      setSelectedClientId(watchClientId);
      setSelectedProductIds([]);
      setValue('productIds', []); // Reset products when client changes
    }
  }, [watchClientId, selectedClientId, setValue]);



  const onSubmit = async (data: InitializeReportInput) => {
    try {
      console.log('Submitting data:', data); // ✅ Debug log

      const payload = {
        leadType: data.leadType as 'CLIENT_LEAD' | 'TRUEBUDDY_LEAD',  // ✅ cast
        clientId: String(data.clientId),
        productIds: data.productIds.map(String),
      };

      const result = await createMutation.mutateAsync(payload);
      navigate(`/operations/pre-report/${result.reportId}/edit`);
    } catch (error) {
      console.error('Error creating report:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/operations/pre-report')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Reports
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Create New Pre-Report</h1>
        <p className="text-gray-600 mt-1">Initialize a new pre-investigation report</p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Client Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Client <span className="text-red-500">*</span>
            </label>
            <select
              {...register('clientId', { valueAsNumber: true })}
              disabled={clientsLoading}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.clientId ? 'border-red-500' : 'border-gray-300'
                } ${clientsLoading ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}`}
            >
              <option value="">
                {clientsLoading ? 'Loading clients...' : 'Select a client'}
              </option>
              {clients?.map((client) => (
                <option key={client.id} value={String(client.clientId)}>
                  {client.clientName}
                </option>
              ))}
            </select>
            {errors.clientId && (
              <p className="text-red-500 text-sm mt-1">{String(errors.clientId.message)}</p>
            )}
          </div>

          {/* Product Selection - ✅ FIXED */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Products <span className="text-red-500">*</span>
            </label>
            {!selectedClientId ? (
              <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                <p className="text-gray-500 text-sm text-center">
                  Please select a client first to view available products
                </p>
              </div>
            ) : productsLoading ? (
              <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-center gap-2 text-gray-500">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Loading products...</span>
                </div>
              </div>
            ) : (
              <div className={`border rounded-lg p-3 max-h-64 overflow-y-auto ${errors.productIds ? 'border-red-500' : 'border-gray-300'
                }`}>
                {products && products.length > 0 ? (
                  <div className="space-y-2">
                    {products?.map((product) => (
                      <option key={product.id} value={String(product.id)}>
                        {product.productName}
                      </option>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm text-center py-2">
                    No products available for this client
                  </p>
                )}
              </div>
            )}
            {errors.productIds && (
              <p className="text-red-500 text-sm mt-1">{String(errors.productIds.message)}</p>
            )}
            {/* ✅ Show selected count */}
            {selectedProductIds.length > 0 && (
              <p className="text-sm text-blue-600 mt-2">
                {selectedProductIds.length} product(s) selected
              </p>
            )}
          </div>

          {/* Lead Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Lead Type <span className="text-red-500">*</span>
            </label>
            <div className="space-y-3">
              <label className="flex items-start gap-3 p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all">
                <input
                  type="radio"
                  value={LeadType.CLIENT_LEAD}
                  {...register('leadType')}
                  className="mt-0.5 w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Client Lead</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Information provided directly by the client for investigation
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-purple-50 hover:border-purple-300 transition-all">
                <input
                  type="radio"
                  value={LeadType.TRUEBUDDY_LEAD}
                  {...register('leadType')}
                  className="mt-0.5 w-4 h-4 text-purple-600 focus:ring-2 focus:ring-purple-500"
                />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">TrueBuddy Lead</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Internal intelligence generated through TrueBuddy network
                  </p>
                </div>
              </label>
            </div>
            {errors.leadType && (
              <p className="text-red-500 text-sm mt-1">{String(errors.leadType.message)}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex items-center gap-3 pt-4 border-t">
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Report...
                </>
              ) : (
                'Initialize Report'
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/operations/pre-report')}
              disabled={createMutation.isPending}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* Info Box */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <svg
              className="w-5 h-5 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-blue-900 mb-1">
              What happens next?
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• A new pre-report will be created with the selected details</li>
              <li>• You'll be redirected to the step-by-step form editor</li>
              <li>• Complete all required steps to finalize the report</li>
              <li>• You can save progress and return later</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePreReport;
