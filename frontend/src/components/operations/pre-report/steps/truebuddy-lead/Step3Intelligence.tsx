// src/components/operations/pre-report/steps/truebuddy-lead/Step3Intelligence.tsx
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type {
  TrueBuddyLeadStep3Input,
} from '../../../../../schemas/prereport.schemas';
import {trueBuddyLeadStep3Schema} from '../../../../../schemas/prereport.schemas';
import type { TrueBuddyLeadData } from '../../../../../types/prereport.types';
import {
  IntelNature,
  SuspectedActivity,
  ProductCategory,
  SupplyChainStage,
  YesNoUnknown,
} from '../../../../../utils/constants';

interface Step3Props {
  data: TrueBuddyLeadData;
  onNext: (data: Partial<TrueBuddyLeadData>) => Promise<void>;
  onBack: () => void;
}

const TrueBuddyStep3Intelligence: React.FC<Step3Props> = ({ data, onNext, onBack }) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TrueBuddyLeadStep3Input>({
    resolver: zodResolver(trueBuddyLeadStep3Schema),
    defaultValues: {
      intelNature: data.intelNature || IntelNature.MANUFACTURING,
      suspectedActivity: data.suspectedActivity || SuspectedActivity.COUNTERFEITING,
      productSegment: data.productSegment || ProductCategory.CROP_PROTECTION,
      supplyChainStage: data.supplyChainStage || SupplyChainStage.UPSTREAM,
      repeatIntelligence: data.repeatIntelligence || YesNoUnknown.UNKNOWN,
      multiBrandRisk: data.multiBrandRisk || YesNoUnknown.UNKNOWN,
    },
  });

  const onSubmit = async (formData: TrueBuddyLeadStep3Input) => {
    try {
      await onNext(formData);
    } catch (error) {
      console.error('Error submitting Step 3:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Step 3: Intelligence Details
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Intelligence Nature */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Intelligence Nature *
            </label>
            <Controller
              name="intelNature"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.intelNature ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Intelligence Nature</option>
                  {Object.values(IntelNature).map((nature) => (
                    <option key={nature} value={nature}>
                      {nature.replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
              )}
            />
            {errors.intelNature && (
              <p className="mt-1 text-sm text-red-600">{errors.intelNature.message}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              Specify the nature of intelligence received
            </p>
          </div>

          {/* Suspected Activity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Suspected Activity *
            </label>
            <Controller
              name="suspectedActivity"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.suspectedActivity ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Suspected Activity</option>
                  {Object.values(SuspectedActivity).map((activity) => (
                    <option key={activity} value={activity}>
                      {activity.replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
              )}
            />
            {errors.suspectedActivity && (
              <p className="mt-1 text-sm text-red-600">{errors.suspectedActivity.message}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              Type of suspected illegal activity
            </p>
          </div>

          {/* Product Segment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Segment *
            </label>
            <Controller
              name="productSegment"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.productSegment ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Product Segment</option>
                  {Object.values(ProductCategory).map((segment) => (
                    <option key={segment} value={segment}>
                      {segment.replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
              )}
            />
            {errors.productSegment && (
              <p className="mt-1 text-sm text-red-600">{errors.productSegment.message}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              Product category affected by this intelligence
            </p>
          </div>

          {/* Supply Chain Stage */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Supply Chain Stage *
            </label>
            <Controller
              name="supplyChainStage"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.supplyChainStage ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Supply Chain Stage</option>
                  {Object.values(SupplyChainStage).map((stage) => (
                    <option key={stage} value={stage}>
                      {stage.replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
              )}
            />
            {errors.supplyChainStage && (
              <p className="mt-1 text-sm text-red-600">{errors.supplyChainStage.message}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              Stage in supply chain where activity is suspected
            </p>
          </div>

          {/* Repeat Intelligence */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Repeat Intelligence *
            </label>
            <Controller
              name="repeatIntelligence"
              control={control}
              render={({ field }) => (
                <div className="space-y-2">
                  {Object.values(YesNoUnknown).map((option) => (
                    <label key={option} className="flex items-center">
                      <input
                        type="radio"
                        {...field}
                        value={option}
                        checked={field.value === option}
                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {option}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            />
            {errors.repeatIntelligence && (
              <p className="mt-1 text-sm text-red-600">{errors.repeatIntelligence.message}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              Is this a repeat intelligence about the same entity/location?
            </p>
          </div>

          {/* Multi-Brand Risk */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Multi-Brand Risk *
            </label>
            <Controller
              name="multiBrandRisk"
              control={control}
              render={({ field }) => (
                <div className="space-y-2">
                  {Object.values(YesNoUnknown).map((option) => (
                    <label key={option} className="flex items-center">
                      <input
                        type="radio"
                        {...field}
                        value={option}
                        checked={field.value === option}
                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {option}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            />
            {errors.multiBrandRisk && (
              <p className="mt-1 text-sm text-red-600">{errors.multiBrandRisk.message}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              Does this intelligence indicate risk to multiple brands?
            </p>
          </div>

          {/* Form Actions */}
          <div className="flex justify-between pt-6 border-t">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Saving...' : 'Next Step'}
            </button>
          </div>
        </form>
      </div>

      {/* Info Box */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-amber-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-amber-800">Intelligence Assessment</h3>
            <div className="mt-2 text-sm text-amber-700">
              <p>
                Provide accurate intelligence details to ensure proper assessment and resource allocation.
                Repeat intelligence and multi-brand risks may require different investigation strategies.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrueBuddyStep3Intelligence;
