// src/components/operations/pre-report/steps/truebuddy-lead/Step8Recommendations.tsx
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type {
  TrueBuddyLeadStep8Input,
} from '../../../../../schemas/prereport.schemas';
import {trueBuddyLeadStep8Schema} from '../../../../../schemas/prereport.schemas';
import type { TrueBuddyLeadData } from '../../../../../types/prereport.types';

interface Step8Props {
  data: TrueBuddyLeadData;
  onNext: (data: Partial<TrueBuddyLeadData>) => Promise<void>;
  onBack: () => void;
  onSkip: () => void;
}

const TrueBuddyStep8Recommendations: React.FC<Step8Props> = ({ data, onNext, onBack,onSkip }) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TrueBuddyLeadStep8Input>({
    resolver: zodResolver(trueBuddyLeadStep8Schema),
    defaultValues: {
      recCovertValidation: data.recCovertValidation || false,
      recEtp: data.recEtp || false,
      recMarketReconnaissance: data.recMarketReconnaissance || false,
      recEnforcementDeferred: data.recEnforcementDeferred || false,
      recContinuedMonitoring: data.recContinuedMonitoring || false,
      recClientSegregation: data.recClientSegregation || false,
    },
  });

  const onSubmit = async (formData: TrueBuddyLeadStep8Input) => {
    try {
      await onNext(formData);
    } catch (error) {
      console.error('Error submitting Step 8:', error);
    }
  };

  const allRecommendations = watch();
  const selectedCount = Object.values(allRecommendations).filter(Boolean).length;

  const recommendationOptions = [
    {
      name: 'recCovertValidation' as const,
      label: 'Covert Validation',
      description: 'Conduct discreet investigation to validate intelligence without alerting targets',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      color: 'blue',
    },
    {
      name: 'recEtp' as const,
      label: 'ETP (Evidence Test Purchase)',
      description: 'Conduct test purchase to collect physical evidence for enforcement',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: 'green',
    },
    {
      name: 'recMarketReconnaissance' as const,
      label: 'Market Reconnaissance',
      description: 'Conduct broader market survey to understand the extent and patterns',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
      color: 'purple',
    },
    {
      name: 'recEnforcementDeferred' as const,
      label: 'Enforcement (Deferred)',
      description: 'Recommend enforcement action after controlled validation and evidence collection',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      color: 'red',
    },
    {
      name: 'recContinuedMonitoring' as const,
      label: 'Continued Monitoring',
      description: 'Continue monitoring the target without immediate action',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'yellow',
    },
    {
      name: 'recClientSegregation' as const,
      label: 'Client Segregation',
      description: 'Keep this intelligence segregated from regular client operations due to sensitivity',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
        </svg>
      ),
      color: 'orange',
    },
  ];

  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    green: 'bg-green-50 border-green-200 text-green-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700',
    red: 'bg-red-50 border-red-200 text-red-700',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    orange: 'bg-orange-50 border-orange-200 text-orange-700',
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Step 8: Recommended Way Forward
        </h2>

        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Select recommended actions based on your assessment. Multiple selections are allowed.
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Selected:</span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
              {selectedCount}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendationOptions.map((option) => {
              const isSelected = watch(option.name);
              
              return (
                <Controller
                  key={option.name}
                  name={option.name}
                  control={control}
                  render={({ field }) => (
                    <button
                      type="button"
                      onClick={() => field.onChange(!field.value)}
                      className={`relative text-left p-5 border-2 rounded-lg transition-all ${
                        isSelected
                          ? `${colorClasses[option.color as keyof typeof colorClasses]} border-current shadow-md`
                          : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
                      }`}
                    >
                      {/* Checkbox */}
                      <div className="absolute top-4 right-4">
                        <div
                          className={`h-6 w-6 rounded border-2 flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'bg-current border-current'
                              : 'border-gray-300'
                          }`}
                        >
                          {isSelected && (
                            <svg
                              className="h-4 w-4 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </div>
                      </div>

                      {/* Icon */}
                      <div className={`mb-3 ${isSelected ? 'text-current' : 'text-gray-400'}`}>
                        {option.icon}
                      </div>

                      {/* Content */}
                      <h3 className={`text-lg font-semibold mb-2 pr-8 ${
                        isSelected ? 'text-current' : 'text-gray-900'
                      }`}>
                        {option.label}
                      </h3>
                      <p className={`text-sm ${
                        isSelected ? 'opacity-90' : 'text-gray-600'
                      }`}>
                        {option.description}
                      </p>
                    </button>
                  )}
                />
              );
            })}
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
      <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-teal-400"
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
            <h3 className="text-sm font-medium text-teal-800">Recommendation Guidelines</h3>
            <div className="mt-2 text-sm text-teal-700">
              <ul className="list-disc list-inside space-y-1">
                <li>Select recommendations that align with your overall assessment</li>
                <li>Multiple recommendations can be selected if appropriate</li>
                <li><strong>Covert Validation</strong> and <strong>ETP</strong> are common for ACTIONABLE_AFTER_VALIDATION</li>
                <li><strong>Continued Monitoring</strong> is typical for HOLD assessments</li>
                <li><strong>Client Segregation</strong> is recommended for high-risk or sensitive cases</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrueBuddyStep8Recommendations;
