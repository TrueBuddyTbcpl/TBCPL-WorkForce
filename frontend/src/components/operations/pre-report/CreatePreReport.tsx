import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useClients } from '../../../hooks/prereport/useClients';
import { useProducts } from '../../../hooks/prereport/useProducts';
import { useCreatePreReport } from '../../../hooks/prereport/useCreatePreReport';
import { initializeReportSchema } from '../../../schemas/prereport.schemas';
import { LeadType } from '../../../utils/constants';
import type { InitializeReportInput } from '../../../schemas/prereport.schemas';

export const CreatePreReport = () => {
  const navigate = useNavigate();

  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);

  const { data: products, isLoading: productsLoading } =
    useProducts(selectedClientId);

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
      clientId: 0,
      productIds: [],
      leadType: LeadType.CLIENT_LEAD as any,
    },
  });

  const watchClientId = watch('clientId');

  /**
   * 🔒 SAFE clientId handling
   * - NO valueAsNumber
   * - NO NaN
   * - Only valid numeric IDs (>0)
   */
  useEffect(() => {
    const numericClientId = Number(watchClientId);

    if (!Number.isFinite(numericClientId) || numericClientId <= 0) return;

    if (numericClientId !== selectedClientId) {
      setSelectedClientId(numericClientId);
      setSelectedProductIds([]);
      setValue('productIds', []);
    }
  }, [watchClientId, selectedClientId, setValue]);

  // Debug (can be removed later)
  const { data: clients, isLoading: clientsLoading } = useClients();

  // 🔍 ADD THIS DEBUG BLOCK
  useEffect(() => {
    console.log('=== CLIENT DATA DEBUG ===');
    console.log('clientsLoading:', clientsLoading);
    console.log('clients:', clients);
    console.log('clients type:', typeof clients);
    console.log('Is Array?', Array.isArray(clients));
    console.log('Length:', clients?.length);
    if (clients && clients.length > 0) {
      console.log('First client:', clients[0]);
    }
  }, [clients, clientsLoading]);


  const onSubmit = async (data: InitializeReportInput) => {
    try {
      const payload = {
        leadType: data.leadType as 'CLIENT_LEAD' | 'TRUEBUDDY_LEAD',
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
        <p className="text-gray-600 mt-1">
          Initialize a new pre-investigation report
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* ================= CLIENT SELECTION ================= */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Client <span className="text-red-500">*</span>
            </label>

            <select
              {...register('clientId', { valueAsNumber: true })} // ✅ ADDED: valueAsNumber
              disabled={clientsLoading}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value={0}>
                {clientsLoading ? 'Loading clients...' : 'Select a client'}
              </option>

              {!clientsLoading && Array.isArray(clients) && clients.length > 0 ? (
                clients.map((client) => {
                  const clientValue = typeof client.id === 'number'
                    ? client.id
                    : Number(client.clientId);

                  return (
                    <option
                      key={`client-${clientValue}`}
                      value={clientValue}
                    >
                      {client.clientName}
                    </option>
                  );
                })
              ) : (
                !clientsLoading && (
                  <option disabled>No clients available</option>
                )
              )}
            </select>

            {errors.clientId && (
              <p className="text-red-500 text-sm mt-1">
                {String(errors.clientId.message)}
              </p>
            )}
          </div>



          {/* ================= PRODUCT SELECTION ================= */}
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
            ) : !Array.isArray(products) || products.length === 0 ? (
              <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                <p className="text-gray-500 text-sm text-center">
                  No products available for this client
                </p>
              </div>
            ) : (
              <div className="border border-gray-300 rounded-lg p-3 max-h-60 overflow-y-auto bg-white">
                {products.map((product) => {
                  // ✅ Handle both id and productId from backend
                  const productIdentifier = product.id || product.productId;

                  if (!productIdentifier) {
                    console.warn('Product missing identifier:', product);
                    return null;
                  }

                  const numericId = typeof productIdentifier === 'number'
                    ? productIdentifier
                    : Number(productIdentifier);

                  const isSelected = selectedProductIds.includes(numericId);

                  return (
                    <label
                      key={`product-${numericId}`}
                      className="flex items-center gap-3 p-2 hover:bg-blue-50 rounded cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          e.stopPropagation();

                          const newSelection = e.target.checked
                            ? [...selectedProductIds, numericId]
                            : selectedProductIds.filter((id) => id !== numericId);

                          setSelectedProductIds(newSelection);
                          setValue('productIds', newSelection, { shouldValidate: true });
                        }}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 select-none">
                        {product.productName}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}

            {errors.productIds && (
              <p className="text-red-500 text-sm mt-1">
                {String(errors.productIds.message)}
              </p>
            )}

            {selectedProductIds.length > 0 && (
              <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded">
                <p className="text-sm font-medium text-blue-700">
                  {selectedProductIds.length} product(s) selected
                </p>
              </div>
            )}

          </div>







          {/* Lead Type */}
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
                <div>
                  <p className="font-semibold text-gray-900">Client Lead</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Information provided directly by the client
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
                <div>
                  <p className="font-semibold text-gray-900">TrueBuddy Lead</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Internal intelligence generated by TrueBuddy
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center gap-3 pt-4 border-t">
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50"
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
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePreReport;
