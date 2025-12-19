import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, Package } from 'lucide-react';
import { clientDetailsSchema } from '../utils/caseValidation';
import { leadTypes } from '../data/caseOptions';
import type { ClientDetails } from '../types/case.types';

interface Props {
  initialData?: ClientDetails | null;
  onComplete: (data: ClientDetails) => void;
  onBack: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

const ClientDetailsStep = ({ initialData, onComplete }: Props) => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<ClientDetails>({
    resolver: zodResolver(clientDetailsSchema),
    defaultValues: initialData || {
      leadType: 'Client Lead',
    },
  });

  const leadType = watch('leadType');

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Building2 className="w-7 h-7 text-blue-600" />
          Client Details
        </h2>
        <p className="text-sm text-gray-600 mt-1">Information about the client and their product/service</p>
      </div>

      <form onSubmit={handleSubmit(onComplete)} className="space-y-6">
        {/* Lead Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Lead Type <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {leadTypes.map((type) => (
              <label
                key={type}
                className={`relative flex items-center justify-center p-6 border-2 rounded-lg cursor-pointer transition-all ${
                  leadType === type
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <input
                  type="radio"
                  value={type}
                  {...register('leadType')}
                  className="sr-only"
                />
                <div className="text-center">
                  <div className={`text-3xl mb-2 ${leadType === type ? 'text-blue-600' : 'text-gray-400'}`}>
                    {type === 'Client Lead' ? '🏢' : '🔍'}
                  </div>
                  <span className={`text-sm font-semibold ${leadType === type ? 'text-blue-700' : 'text-gray-700'}`}>
                    {type}
                  </span>
                </div>
              </label>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Select whether this case originated from a client or Trubuddy's investigation
          </p>
        </div>

        {/* Client Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Client Name <span className="text-red-500">*</span>
          </label>
          <input
            {...register('clientName')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter client/company name"
          />
          {errors.clientName && (
            <p className="text-red-600 text-xs mt-1">{errors.clientName.message}</p>
          )}
        </div>

        {/* Product/Service */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Package className="w-4 h-4 text-blue-600" />
            Client's Product/Service Under Investigation <span className="text-red-500">*</span>
          </label>
          <textarea
            {...register('productService')}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Describe the specific product or service where the investigation is being conducted..."
          />
          {errors.productService && (
            <p className="text-red-600 text-xs mt-1">{errors.productService.message}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Example: "E-commerce platform - Payment processing module" or "Retail store - Inventory management"
          </p>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Client Contact Number
            </label>
            <input
              type="tel"
              {...register('clientContact')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="10-digit contact number"
              maxLength={10}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Client Email
            </label>
            <input
              type="email"
              {...register('clientEmail')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="client@example.com"
            />
            {errors.clientEmail && (
              <p className="text-red-600 text-xs mt-1">{errors.clientEmail.message}</p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-md hover:shadow-lg"
          >
            Continue to Team Assignment
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClientDetailsStep;
