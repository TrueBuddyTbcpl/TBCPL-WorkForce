import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FileText, Calendar, Building2 } from 'lucide-react';
import { basicInfoSchema } from '../utils/caseValidation';
import { clientNames, clientProducts, priorityLevels, caseStatuses } from '../data/caseOptions';
import type { CaseBasicInfo } from '../types/case.types';
import { useState } from 'react';

interface Props {
  initialData?: CaseBasicInfo | null;
  onComplete: (data: CaseBasicInfo) => void;
  onBack: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

const BasicInfo = ({ initialData, onComplete }: Props) => {
  const [selectedClient, setSelectedClient] = useState<string>(initialData?.clientName || '');
  const [availableProducts, setAvailableProducts] = useState<string[]>(
    initialData?.clientName ? clientProducts[initialData.clientName] || [] : []
  );

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<CaseBasicInfo>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: initialData || {
      caseNumber: `CASE-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
      clientName: '',
      clientProduct: '',
      priority: 'Medium',
      status: 'Open',
      reportedDate: new Date().toISOString().split('T')[0],
    },
  });

  const priority = watch('priority');
  // ✅ Removed unused: const clientName = watch('clientName');

  // Handle client change
  const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const client = e.target.value;
    setSelectedClient(client);
    setValue('clientName', client);
    
    // Update available products
    if (client && clientProducts[client]) {
      setAvailableProducts(clientProducts[client]);
      setValue('clientProduct', ''); // Reset product selection
    } else {
      setAvailableProducts([]);
    }
  };

  const getPriorityColor = (level: string) => {
    switch (level) {
      case 'Low': return 'border-green-500 bg-green-50 text-green-700';
      case 'Medium': return 'border-yellow-500 bg-yellow-50 text-yellow-700';
      case 'High': return 'border-orange-500 bg-orange-50 text-orange-700';
      case 'Critical': return 'border-red-500 bg-red-50 text-red-700';
      default: return 'border-gray-300';
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <FileText className="w-7 h-7 text-blue-600" />
          Basic Case Information
        </h2>
        <p className="text-sm text-gray-600 mt-1">Enter the fundamental details of the case</p>
      </div>

      <form onSubmit={handleSubmit(onComplete)} className="space-y-6">
        {/* Case Number & Reported Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Case Number <span className="text-red-500">*</span>
            </label>
            <input
              {...register('caseNumber')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
              placeholder="CASE-2025-001"
              readOnly
            />
            <p className="text-xs text-gray-500 mt-1">Auto-generated case number</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reported Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                {...register('reportedDate')}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            {errors.reportedDate && (
              <p className="text-red-600 text-xs mt-1">{errors.reportedDate.message}</p>
            )}
          </div>
        </div>

        {/* Client Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-600" />
            Client Name <span className="text-red-500">*</span>
          </label>
          <select
            {...register('clientName')}
            onChange={handleClientChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select client name</option>
            {clientNames.map(client => (
              <option key={client} value={client}>{client}</option>
            ))}
          </select>
          {errors.clientName && (
            <p className="text-red-600 text-xs mt-1">{errors.clientName.message}</p>
          )}
        </div>

        {/* Client Product (Dependent on Client Name) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Client Product <span className="text-red-500">*</span>
          </label>
          <select
            {...register('clientProduct')}
            disabled={!selectedClient || availableProducts.length === 0}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">
              {!selectedClient 
                ? 'First select a client name' 
                : availableProducts.length === 0 
                ? 'No products available for this client'
                : 'Select client product'}
            </option>
            {availableProducts.map(product => (
              <option key={product} value={product}>{product}</option>
            ))}
          </select>
          {errors.clientProduct && (
            <p className="text-red-600 text-xs mt-1">{errors.clientProduct.message}</p>
          )}
          {selectedClient && availableProducts.length > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              Showing products for {selectedClient}
            </p>
          )}
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status <span className="text-red-500">*</span>
          </label>
          <select
            {...register('status')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {caseStatuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        {/* Priority Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Priority Level <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {priorityLevels.map((level) => (
              <label
                key={level}
                className={`relative flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  priority === level ? getPriorityColor(level) : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <input
                  type="radio"
                  value={level}
                  {...register('priority')}
                  className="sr-only"
                />
                <span className="text-sm font-semibold">{level}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Case Description <span className="text-red-500">*</span>
          </label>
          <textarea
            {...register('description')}
            rows={5}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Provide detailed description of the case, incident, and circumstances..."
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
            Continue to Client Details
          </button>
        </div>
      </form>
    </div>
  );
};

export default BasicInfo;
