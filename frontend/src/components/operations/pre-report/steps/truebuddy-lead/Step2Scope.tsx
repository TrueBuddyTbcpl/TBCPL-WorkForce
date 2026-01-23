// src/components/operations/pre-report/steps/truebuddy-lead/Step2Scope.tsx
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type {
  TrueBuddyLeadStep2Input,
} from '../../../../../schemas/prereport.schemas';
import { trueBuddyLeadStep2Schema } from '../../../../../schemas/prereport.schemas';
import type { TrueBuddyLeadData } from '../../../../../types/prereport.types';

interface Step2Props {
  data: TrueBuddyLeadData;
  onNext: (data: Partial<TrueBuddyLeadData>) => Promise<void>;
  onBack: () => void | Promise<void>;
  onSkip?: () => void | Promise<void>; // ✅ add this line
}


const TrueBuddyStep2Scope: React.FC<Step2Props> = ({
  data,
  onNext,
  onBack,
  onSkip, // ✅ add this
}) => {

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TrueBuddyLeadStep2Input>({
    resolver: zodResolver(trueBuddyLeadStep2Schema),
    defaultValues: {
      scopeIprSupplier: data.scopeIprSupplier || false,
      scopeIprManufacturer: data.scopeIprManufacturer || false,
      scopeIprStockist: data.scopeIprStockist || false,
      scopeMarketVerification: data.scopeMarketVerification || false,
      scopeEtp: data.scopeEtp || false,
      scopeEnforcement: data.scopeEnforcement || false,
    },
  });

  const onSubmit = async (formData: TrueBuddyLeadStep2Input) => {
    try {
      await onNext(formData);
    } catch (error) {
      console.error('Error submitting Step 2:', error);
    }
  };

  const scopeOptions = [
    {
      name: 'scopeIprSupplier' as const,
      label: 'IPR Investigation – Supplier Level',
      description: 'Investigation of supplier-level IP infringement',
    },
    {
      name: 'scopeIprManufacturer' as const,
      label: 'IPR Investigation – Manufacturer / Packager',
      description: 'Investigation of manufacturer-level IP infringement',
    },
    {
      name: 'scopeIprStockist' as const,
      label: 'IPR Investigation – Stockist / Warehouse',
      description: 'Investigation of stockist/distributor-level IP infringement',
    },
    {
      name: 'scopeMarketVerification' as const,
      label: 'Covert Market Verification',
      description: 'Market survey and verification activities',
    },
    {
      name: 'scopeEtp' as const,
      label: 'Evidential Test Purchase (ETP)',
      description: 'Test purchase for evidence collection',
    },
    {
      name: 'scopeEnforcement' as const,
      label: 'Enforcement Facilitation (If Applicable)',
      description: 'Legal enforcement and raid activities',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Step 2: Scope of Investigation
        </h2>

        <p className="text-gray-600 mb-6">
          Select the applicable scope areas for this TrueBuddy lead investigation. Multiple selections are allowed.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-4">
            {scopeOptions.map((option) => (
              <div
                key={option.name}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <Controller
                  name={option.name}
                  control={control}
                  render={({ field }) => (
                    <label className="flex items-start cursor-pointer">
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        className="mt-1 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="ml-3 flex-1">
                        <span className="block text-sm font-medium text-gray-900">
                          {option.label}
                        </span>
                        <span className="block text-sm text-gray-500 mt-1">
                          {option.description}
                        </span>
                      </div>
                    </label>
                  )}
                />
              </div>
            ))}
          </div>

          {Object.keys(errors).length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-600">
                Please correct the errors above before proceeding.
              </p>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-between pt-6 border-t">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Back
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
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Saving...' : 'Next Step'}
            </button>
          </div>
        </form>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-blue-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Scope Selection Tips</h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc list-inside space-y-1">
                <li>Select all applicable scope areas based on intelligence received</li>
                <li>IPR scopes focus on different supply chain levels</li>
                <li>Market verification is for general market intelligence gathering</li>
                <li>ETP is selected when evidence collection through purchase is required</li>
                <li>Enforcement is for cases ready for legal action</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrueBuddyStep2Scope;
