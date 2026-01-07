import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import { FileText, Calendar,  Building2, Package } from 'lucide-react';
import { basicInfoSchema, type BasicInfoFormData } from '../utils/caseValidation';
import { clientsData } from '../data/clientOptions';

interface Props {
  initialData?: BasicInfoFormData | null;
  onComplete: (data: BasicInfoFormData) => void;
  onBack: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

const BasicInfo = ({ initialData, onComplete }: Props) => {
  const [selectedClient, setSelectedClient] = useState<string>(initialData?.clientName || '');
  const [availableProducts, setAvailableProducts] = useState<Array<{id: string; name: string}>>([]);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<BasicInfoFormData>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: initialData || {
      caseNumber: `CASE-${Date.now()}`,
      caseTitle: '',
      clientName: '',
      clientProduct: '',
      priority: 'medium',
      status: 'open',
      description: '',
      dateOpened: new Date().toISOString().split('T')[0],
    },
  });

  const clientName = watch('clientName');

  useEffect(() => {
    if (clientName) {
      const client = clientsData.find(c => c.name === clientName);
      if (client) {
        setAvailableProducts(client.products);
        setSelectedClient(clientName);
        // Reset product selection when client changes
        setValue('clientProduct', '');
      }
    } else {
      setAvailableProducts([]);
      setSelectedClient('');
    }
  }, [clientName, setValue]);

  const generateCaseNumber = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    const newCaseNumber = `CASE-${timestamp}-${random}`;
    setValue('caseNumber', newCaseNumber);
  };

  

  const getStatusLabel = (status: 'open' | 'in-progress' | 'on-hold' | 'closed') => {
    switch (status) {
      case 'in-progress': return 'In Progress';
      case 'on-hold': return 'On Hold';
      case 'open': return 'Open';
      case 'closed': return 'Closed';
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <FileText className="w-7 h-7 text-blue-600" />
          Basic Case Information
        </h2>
        <p className="text-sm text-gray-600 mt-1">Enter case details and client information</p>
      </div>

      <form onSubmit={handleSubmit(onComplete)} className="space-y-6">
        {/* Case Number and Title */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Case Number <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <input
                {...register('caseNumber')}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                placeholder="Auto-generated case number"
                readOnly
              />
              <button
                type="button"
                onClick={generateCaseNumber}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
              >
                Generate
              </button>
            </div>
            {errors.caseNumber && (
              <p className="text-red-600 text-xs mt-1">{errors.caseNumber.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Case Title <span className="text-red-500">*</span>
            </label>
            <input
              {...register('caseTitle')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter case title"
            />
            {errors.caseTitle && (
              <p className="text-red-600 text-xs mt-1">{errors.caseTitle.message}</p>
            )}
          </div>
        </div>

        {/* Client Details Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            Client Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Client Name Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client Name <span className="text-red-500">*</span>
              </label>
              <select
                {...register('clientName')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Client</option>
                {clientsData.map((client) => (
                  <option key={client.id} value={client.name}>
                    {client.name}
                  </option>
                ))}
              </select>
              {errors.clientName && (
                <p className="text-red-600 text-xs mt-1">{errors.clientName.message}</p>
              )}
            </div>

            {/* Client Product Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Package className="w-4 h-4 text-blue-600" />
                Client Product <span className="text-red-500">*</span>
              </label>
              <select
                {...register('clientProduct')}
                disabled={!selectedClient || availableProducts.length === 0}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  !selectedClient || availableProducts.length === 0 ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
              >
                <option value="">
                  {!selectedClient ? 'Select client first' : 'Select Product'}
                </option>
                {availableProducts.map((product) => (
                  <option key={product.id} value={product.name}>
                    {product.name}
                  </option>
                ))}
              </select>
              {errors.clientProduct && (
                <p className="text-red-600 text-xs mt-1">{errors.clientProduct.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Date Opened (Disabled) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="inline w-4 h-4 mr-1" />
            Date Opened <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            {...register('dateOpened')}
            disabled
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
          />
          <p className="text-xs text-gray-500 mt-1">Auto-set to today's date</p>
        </div>

        {/* Priority and Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              {...register('status')}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
            >
              {(['open', 'in-progress', 'on-hold', 'closed'] as const).map((status) => (
                <option key={status} value={status}>
                  {getStatusLabel(status)}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Default status is 'Open'</p>
          </div>
        </div>

        {/* Description (Optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Case Description (Optional)
          </label>
          <textarea
            {...register('description')}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Provide additional details about the case (optional)..."
          />
          {errors.description && (
            <p className="text-red-600 text-xs mt-1">{errors.description.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-md hover:shadow-lg"
          >
            Continue to Location Details
          </button>
        </div>
      </form>
    </div>
  );
};

export default BasicInfo;
