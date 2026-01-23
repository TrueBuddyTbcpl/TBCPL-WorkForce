// src/components/operations/pre-report/steps/truebuddy-lead/Step7Assessment.tsx
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type {
  TrueBuddyLeadStep7Input,
} from '../../../../../schemas/prereport.schemas';
import {trueBuddyLeadStep7Schema} from '../../../../../schemas/prereport.schemas';
import type { TrueBuddyLeadData } from '../../../../../types/prereport.types';
import { AssessmentType } from '../../../../../utils/constants';

interface Step7Props {
  data: TrueBuddyLeadData;
  onNext: (data: Partial<TrueBuddyLeadData>) => Promise<void>;
  onBack: () => void;
  onSkip: () => void;
}

const TrueBuddyStep7Assessment: React.FC<Step7Props> = ({ data, onNext, onBack,onSkip }) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TrueBuddyLeadStep7Input>({
    resolver: zodResolver(trueBuddyLeadStep7Schema),
    defaultValues: {
      assessmentOverall: data.assessmentOverall || AssessmentType.HOLD,
      assessmentRationale: data.assessmentRationale || '',
    },
  });

  const onSubmit = async (formData: TrueBuddyLeadStep7Input) => {
    try {
      await onNext(formData);
    } catch (error) {
      console.error('Error submitting Step 7:', error);
    }
  };

  const assessmentOverall = watch('assessmentOverall');

  const getAssessmentColor = (type: string) => {
    switch (type) {
      case AssessmentType.ACTIONABLE:
        return 'bg-green-100 text-green-800 border-green-300';
      case AssessmentType.ACTIONABLE_AFTER_VALIDATION:
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case AssessmentType.NOT_ACTIONABLE:
        return 'bg-red-100 text-red-800 border-red-300';
      case AssessmentType.HOLD:
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const assessmentDescriptions = {
    [AssessmentType.ACTIONABLE]: 
      'Intelligence is credible, verified, and sufficient for immediate action or enforcement.',
    [AssessmentType.ACTIONABLE_AFTER_VALIDATION]: 
      'Intelligence is promising but requires controlled validation before proceeding to action.',
    [AssessmentType.NOT_ACTIONABLE]: 
      'Intelligence is insufficient, unreliable, or does not warrant further investigation.',
    [AssessmentType.HOLD]: 
      'Intelligence requires further monitoring or evaluation before making a decision.',
  };

  const rationaleCharCount = watch('assessmentRationale')?.length || 0;

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Step 7: Overall Assessment
        </h2>

        <p className="text-gray-600 mb-6">
          Based on all previous steps, provide your overall assessment of this TrueBuddy lead and detailed rationale.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Overall Assessment */}
          <div className="border border-gray-200 rounded-lg p-5">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Overall Assessment *
            </label>
            <p className="text-sm text-gray-500 mb-4">
              Select the most appropriate assessment based on intelligence quality, verification, observations, and risk factors.
            </p>
            <Controller
              name="assessmentOverall"
              control={control}
              render={({ field }) => (
                <div className="space-y-3">
                  {Object.values(AssessmentType).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => field.onChange(type)}
                      className={`w-full text-left px-4 py-4 border rounded-lg transition-colors ${
                        field.value === type
                          ? getAssessmentColor(type)
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-1">
                          <div
                            className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                              field.value === type
                                ? 'border-current'
                                : 'border-gray-300'
                            }`}
                          >
                            {field.value === type && (
                              <div className="h-3 w-3 rounded-full bg-current" />
                            )}
                          </div>
                        </div>
                        <div className="ml-3 flex-1">
                          <p className="text-sm font-medium">
                            {type.replace(/_/g, ' ')}
                          </p>
                          <p className="text-xs mt-1 opacity-90">
                            {assessmentDescriptions[type]}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            />
            {errors.assessmentOverall && (
              <p className="mt-2 text-sm text-red-600">{errors.assessmentOverall.message}</p>
            )}
          </div>

          {/* Assessment Rationale */}
          <div className="border border-gray-200 rounded-lg p-5">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Assessment Rationale *
            </label>
            <p className="text-sm text-gray-500 mb-4">
              Provide detailed justification for your assessment. Include references to verification findings, 
              observations, risk factors, and any other relevant considerations.
            </p>
            <Controller
              name="assessmentRationale"
              control={control}
              render={({ field }) => (
                <div>
                  <textarea
                    {...field}
                    rows={8}
                    placeholder="Provide comprehensive rationale for your assessment...

Consider including:
• Summary of intelligence quality and credibility
• Key verification findings
• Critical observations and risk factors
• Justification for the chosen assessment category
• Any relevant context or background information"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                      errors.assessmentRationale ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <div>
                      {errors.assessmentRationale && (
                        <p className="text-sm text-red-600">{errors.assessmentRationale.message}</p>
                      )}
                    </div>
                    <p className={`text-xs ${
                      rationaleCharCount < 20 
                        ? 'text-red-600' 
                        : rationaleCharCount < 100 
                        ? 'text-yellow-600' 
                        : 'text-green-600'
                    }`}>
                      {rationaleCharCount} characters (minimum 20 required)
                    </p>
                  </div>
                </div>
              )}
            />
          </div>

          {/* Assessment Summary */}
          {assessmentOverall && (
            <div className={`border-2 rounded-lg p-4 ${getAssessmentColor(assessmentOverall).replace('border-', 'border-')}`}>
              <h4 className="font-semibold text-sm mb-2">Assessment Summary</h4>
              <p className="text-sm">
                <strong>Classification:</strong> {assessmentOverall.replace(/_/g, ' ')}
              </p>
              <p className="text-sm mt-1">
                {assessmentDescriptions[assessmentOverall as keyof typeof assessmentDescriptions]}
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
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-indigo-400"
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
            <h3 className="text-sm font-medium text-indigo-800">Assessment Guidelines</h3>
            <div className="mt-2 text-sm text-indigo-700">
              <ul className="list-disc list-inside space-y-1">
                <li><strong>ACTIONABLE:</strong> Ready for immediate investigation or enforcement</li>
                <li><strong>ACTIONABLE AFTER VALIDATION:</strong> Requires controlled verification first</li>
                <li><strong>NOT ACTIONABLE:</strong> Insufficient or unreliable intelligence</li>
                <li><strong>HOLD:</strong> Requires monitoring or additional information</li>
              </ul>
              <p className="mt-3">
                Your assessment will guide recommendations and resource allocation decisions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrueBuddyStep7Assessment;
