import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, ArrowLeft, ArrowRight, Plus, Trash2 } from 'lucide-react';
import { useUpdateStep } from '../../../../../hooks/prereport/useUpdateStep';
import { clientLeadStep3Schema } from '../../../../../schemas/prereport.schemas';
import { LeadType, YesNoUnknown } from '../../../../../utils/constants';
import type { ClientLeadStep3Input } from '../../../../../schemas/prereport.schemas';
import type { ClientLeadData } from '../../../../../types/prereport.types';

interface Step3TargetDetailsProps {
  prereportId: number;
  reportId: string;
  data?: ClientLeadData | null;
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
}

export const Step3TargetDetails = ({
  prereportId,
  reportId,
  data,
  onNext,
  onPrevious,
  onSkip,
}: Step3TargetDetailsProps) => {
  const updateMutation = useUpdateStep();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ClientLeadStep3Input>({
    resolver: zodResolver(clientLeadStep3Schema),
    defaultValues: {
      entityName: data?.entityName || '',
      suspectName: data?.suspectName || '',
      contactNumbers: data?.contactNumbers || '',
      addressLine1: data?.addressLine1 || '',
      addressLine2: data?.addressLine2 || '',
      city: data?.city || '',
      state: data?.state || '',
      pincode: data?.pincode || '',
      onlinePresences: data?.onlinePresences || [],
      productDetails: data?.productDetails || '',
      photosProvided: data?.photosProvided || YesNoUnknown.NO,
      videoProvided: data?.videoProvided || YesNoUnknown.NO,
      invoiceAvailable: data?.invoiceAvailable || YesNoUnknown.NO,
      sourceNarrative: data?.sourceNarrative || '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'onlinePresences',
  });

  const onSubmit = async (formData: ClientLeadStep3Input) => {
    try {
      await updateMutation.mutateAsync({
        prereportId,
        stepNumber: 3,
        data: formData,
        leadType: LeadType.CLIENT_LEAD,
        reportId,
      });
      onNext();
    } catch (error) {
      console.error('Error saving step:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Entity Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Entity Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...register('entityName')}
          placeholder="Enter entity/company name"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.entityName && (
          <p className="text-red-500 text-sm mt-1">{errors.entityName.message}</p>
        )}
      </div>

      {/* Suspect Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Suspect Name (if different)<span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...register('suspectName')}
          placeholder="Enter suspect's name"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.suspectName && (
          <p className="text-red-500 text-sm mt-1">{errors.suspectName.message}</p>
        )}
      </div>

      {/* Contact Numbers */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Contact Numbers <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...register('contactNumbers')}
          placeholder="+91-XXXXXXXXXX"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.contactNumbers && (
          <p className="text-red-500 text-sm mt-1">{errors.contactNumbers.message}</p>
        )}
      </div>

      {/* Address Line 1 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Address Line 1 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...register('addressLine1')}
          placeholder="Street address"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.addressLine1 && (
          <p className="text-red-500 text-sm mt-1">{errors.addressLine1.message}</p>
        )}
      </div>

      {/* Address Line 2 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Address Line 2
        </label>
        <input
          type="text"
          {...register('addressLine2')}
          placeholder="Apartment, suite, etc. (optional)"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* City, State, Pincode Grid */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register('city')}
            placeholder="City"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.city && (
            <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register('state')}
            placeholder="State"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.state && (
            <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pincode <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register('pincode')}
            placeholder="000000"
            maxLength={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.pincode && (
            <p className="text-red-500 text-sm mt-1">{errors.pincode.message}</p>
          )}
        </div>
      </div>

      {/* Online Presences */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Online Presences
          </label>
          <button
            type="button"
            onClick={() => append({ platformName: '', link: '' })}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
          >
            <Plus className="w-4 h-4" />
            Add Platform
          </button>
        </div>
        <div className="space-y-3">
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <input
                type="text"
                {...register(`onlinePresences.${index}.platformName`)}
                placeholder="Platform name (e.g., IndiaMART)"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="url"
                {...register(`onlinePresences.${index}.link`)}
                placeholder="https://example.com"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => remove(index)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Product Details */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Product Details <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register('productDetails')}
          rows={4}
          placeholder="Describe the suspected products in detail"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.productDetails && (
          <p className="text-red-500 text-sm mt-1">{errors.productDetails.message}</p>
        )}
      </div>

      {/* Evidence Grid */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Photos Provided <span className="text-red-500">*</span>
          </label>
          <select
            {...register('photosProvided')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {Object.values(YesNoUnknown).map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Video Provided <span className="text-red-500">*</span>
          </label>
          <select
            {...register('videoProvided')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {Object.values(YesNoUnknown).map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Invoice Available <span className="text-red-500">*</span>
          </label>
          <select
            {...register('invoiceAvailable')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {Object.values(YesNoUnknown).map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Source Narrative */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Source Narrative <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register('sourceNarrative')}
          rows={4}
          placeholder="Describe how the lead was discovered and obtained"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.sourceNarrative && (
          <p className="text-red-500 text-sm mt-1">{errors.sourceNarrative.message}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onPrevious}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </button>
        {/* Skip Button */}
        <button
          type="button"
          onClick={onSkip}
          className="px-6 py-3 border-2 border-yellow-400 text-yellow-700 font-medium rounded-lg hover:bg-yellow-50 transition-colors"
        >
          Skip Step
        </button>
        <button
          type="submit"
          disabled={updateMutation.isPending}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {updateMutation.isPending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              Save & Continue
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default Step3TargetDetails;