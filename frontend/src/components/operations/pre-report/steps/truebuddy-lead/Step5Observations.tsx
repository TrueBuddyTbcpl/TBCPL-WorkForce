// src/components/operations/pre-report/steps/truebuddy-lead/Step5Observations.tsx
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type {
  TrueBuddyLeadStep5Input,
} from '../../../../../schemas/prereport.schemas';
import {trueBuddyLeadStep5Schema} from '../../../../../schemas/prereport.schemas';
import type { TrueBuddyLeadData } from '../../../../../types/prereport.types';
import {
  OperationScale,
  RiskLevel,
  BrandExposure,
} from '../../../../../utils/constants';

interface Step5Props {
  data: TrueBuddyLeadData;
  onNext: (data: Partial<TrueBuddyLeadData>) => Promise<void>;
  onBack: () => void;
  onSkip: () => void;
}

const TrueBuddyStep5Observations: React.FC<Step5Props> = ({ data, onNext, onBack,onSkip }) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TrueBuddyLeadStep5Input>({
    resolver: zodResolver(trueBuddyLeadStep5Schema),
    defaultValues: {
      obsOperationScale: data.obsOperationScale || OperationScale.SMALL,
      obsCounterfeitLikelihood: data.obsCounterfeitLikelihood || RiskLevel.LOW,
      obsBrandExposure: data.obsBrandExposure || BrandExposure.SINGLE_BRAND,
      obsEnforcementSensitivity: data.obsEnforcementSensitivity || RiskLevel.LOW,
      obsLeakageRisk: data.obsLeakageRisk || RiskLevel.LOW,
    },
  });

  const onSubmit = async (formData: TrueBuddyLeadStep5Input) => {
    try {
      await onNext(formData);
    } catch (error) {
      console.error('Error submitting Step 5:', error);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case RiskLevel.HIGH:
        return 'bg-red-100 text-red-800 border-red-300';
      case RiskLevel.MEDIUM:
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case RiskLevel.LOW:
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Step 5: Key Observations (Client-Safe)
        </h2>

        <p className="text-gray-600 mb-6">
          Document key observations based on intelligence received and verification activities.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Operation Scale */}
          <div className="border border-gray-200 rounded-lg p-5">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Operation Scale *
            </label>
            <p className="text-sm text-gray-500 mb-4">
              Estimated scale of the suspected operation
            </p>
            <Controller
              name="obsOperationScale"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-3 gap-3">
                  {Object.values(OperationScale).map((scale) => (
                    <button
                      key={scale}
                      type="button"
                      onClick={() => field.onChange(scale)}
                      className={`px-4 py-3 border rounded-lg text-sm font-medium transition-colors ${
                        field.value === scale
                          ? 'bg-blue-100 text-blue-800 border-blue-300'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {scale}
                    </button>
                  ))}
                </div>
              )}
            />
            {errors.obsOperationScale && (
              <p className="mt-2 text-sm text-red-600">{errors.obsOperationScale.message}</p>
            )}
          </div>

          {/* Counterfeit Likelihood */}
          <div className="border border-gray-200 rounded-lg p-5">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Counterfeit Likelihood *
            </label>
            <p className="text-sm text-gray-500 mb-4">
              Likelihood that products are counterfeit based on available intelligence
            </p>
            <Controller
              name="obsCounterfeitLikelihood"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-3 gap-3">
                  {Object.values(RiskLevel).map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => field.onChange(level)}
                      className={`px-4 py-3 border rounded-lg text-sm font-medium transition-colors ${
                        field.value === level
                          ? getRiskColor(level)
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              )}
            />
            {errors.obsCounterfeitLikelihood && (
              <p className="mt-2 text-sm text-red-600">{errors.obsCounterfeitLikelihood.message}</p>
            )}
          </div>

          {/* Brand Exposure */}
          <div className="border border-gray-200 rounded-lg p-5">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Brand Exposure *
            </label>
            <p className="text-sm text-gray-500 mb-4">
              Number of brands potentially affected
            </p>
            <Controller
              name="obsBrandExposure"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-2 gap-3">
                  {Object.values(BrandExposure).map((exposure) => (
                    <button
                      key={exposure}
                      type="button"
                      onClick={() => field.onChange(exposure)}
                      className={`px-4 py-3 border rounded-lg text-sm font-medium transition-colors ${
                        field.value === exposure
                          ? 'bg-blue-100 text-blue-800 border-blue-300'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {exposure.replace(/_/g, ' ')}
                    </button>
                  ))}
                </div>
              )}
            />
            {errors.obsBrandExposure && (
              <p className="mt-2 text-sm text-red-600">{errors.obsBrandExposure.message}</p>
            )}
          </div>

          {/* Enforcement Sensitivity */}
          <div className="border border-gray-200 rounded-lg p-5">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Enforcement Sensitivity *
            </label>
            <p className="text-sm text-gray-500 mb-4">
              Sensitivity level for enforcement actions (political, social, legal factors)
            </p>
            <Controller
              name="obsEnforcementSensitivity"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-3 gap-3">
                  {Object.values(RiskLevel).map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => field.onChange(level)}
                      className={`px-4 py-3 border rounded-lg text-sm font-medium transition-colors ${
                        field.value === level
                          ? getRiskColor(level)
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              )}
            />
            {errors.obsEnforcementSensitivity && (
              <p className="mt-2 text-sm text-red-600">{errors.obsEnforcementSensitivity.message}</p>
            )}
          </div>

          {/* Leakage Risk */}
          <div className="border border-gray-200 rounded-lg p-5">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Leakage Risk *
            </label>
            <p className="text-sm text-gray-500 mb-4">
              Risk of information leakage compromising the investigation
            </p>
            <Controller
              name="obsLeakageRisk"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-3 gap-3">
                  {Object.values(RiskLevel).map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => field.onChange(level)}
                      className={`px-4 py-3 border rounded-lg text-sm font-medium transition-colors ${
                        field.value === level
                          ? getRiskColor(level)
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              )}
            />
            {errors.obsLeakageRisk && (
              <p className="mt-2 text-sm text-red-600">{errors.obsLeakageRisk.message}</p>
            )}
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
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-purple-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path
                fillRule="evenodd"
                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-purple-800">Observation Guidelines</h3>
            <div className="mt-2 text-sm text-purple-700">
              <p>
                These observations help determine investigation strategy and resource allocation. 
                Consider all available intelligence and verification findings when making assessments.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrueBuddyStep5Observations;
