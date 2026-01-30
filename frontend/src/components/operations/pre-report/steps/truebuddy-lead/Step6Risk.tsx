// src/components/operations/pre-report/steps/truebuddy-lead/Step6Risk.tsx
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type {
  TrueBuddyLeadStep6Input,
} from '../../../../../schemas/prereport.schemas';
import {trueBuddyLeadStep6Schema} from '../../../../../schemas/prereport.schemas';
import type { TrueBuddyLeadData } from '../../../../../types/prereport.types';
import {
  RiskLevel,
  YesNoUnknown,
} from '../../../../../utils/constants';

interface Step6Props {
  data: TrueBuddyLeadData;
  onNext: (data: Partial<TrueBuddyLeadData>) => Promise<void>;
  onBack: () => void;
  onSkip: () => void;
}

const TrueBuddyStep6Risk: React.FC<Step6Props> = ({ data, onNext, onBack,onSkip }) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TrueBuddyLeadStep6Input>({
    resolver: zodResolver(trueBuddyLeadStep6Schema),
    defaultValues: {
      riskSourceReliability: data.riskSourceReliability || RiskLevel.LOW,
      riskClientConflict: data.riskClientConflict || RiskLevel.LOW,
      riskImmediateAction: data.riskImmediateAction || YesNoUnknown.UNKNOWN,
      riskControlledValidation: data.riskControlledValidation || YesNoUnknown.UNKNOWN,
      riskPrematureDisclosure: data.riskPrematureDisclosure || RiskLevel.LOW,
    },
  });

  const onSubmit = async (formData: TrueBuddyLeadStep6Input) => {
    try {
      await onNext(formData);
    } catch (error) {
      console.error('Error submitting Step 6:', error);
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

  const getYesNoColor = (value: string) => {
    switch (value) {
      case YesNoUnknown.YES:
        return 'bg-green-100 text-green-800 border-green-300';
      case YesNoUnknown.NO:
        return 'bg-red-100 text-red-800 border-red-300';
      case YesNoUnknown.UNKNOWN:
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Step 6: Information Integrity & Risk Assessment
        </h2>

        <p className="text-gray-600 mb-6">
          Assess various risk factors associated with this TrueBuddy lead to determine appropriate handling strategy.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Source Reliability */}
          <div className="border border-gray-200 rounded-lg p-5">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Source Reliability *
            </label>
            <p className="text-sm text-gray-500 mb-4">
              Reliability and credibility of the intelligence source
            </p>
            <Controller
              name="riskSourceReliability"
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
            {errors.riskSourceReliability && (
              <p className="mt-2 text-sm text-red-600">{errors.riskSourceReliability.message}</p>
            )}
            <p className="mt-2 text-xs text-gray-500">
              HIGH = Highly reliable | MEDIUM = Moderately reliable | LOW = Unreliable or unverified
            </p>
          </div>

          {/* Client Conflict */}
          <div className="border border-gray-200 rounded-lg p-5">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Client Conflict Risk *
            </label>
            <p className="text-sm text-gray-500 mb-4">
              Risk of conflict of interest with client relationships or business
            </p>
            <Controller
              name="riskClientConflict"
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
            {errors.riskClientConflict && (
              <p className="mt-2 text-sm text-red-600">{errors.riskClientConflict.message}</p>
            )}
            <p className="mt-2 text-xs text-gray-500">
              Consider potential conflicts with existing client relationships
            </p>
          </div>

          {/* Immediate Action Required */}
          <div className="border border-gray-200 rounded-lg p-5">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Immediate Action Required *
            </label>
            <p className="text-sm text-gray-500 mb-4">
              Does this intelligence require immediate action or enforcement?
            </p>
            <Controller
              name="riskImmediateAction"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-3 gap-3">
                  {Object.values(YesNoUnknown).map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => field.onChange(option)}
                      className={`px-4 py-3 border rounded-lg text-sm font-medium transition-colors ${
                        field.value === option
                          ? getYesNoColor(option)
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            />
            {errors.riskImmediateAction && (
              <p className="mt-2 text-sm text-red-600">{errors.riskImmediateAction.message}</p>
            )}
            <p className="mt-2 text-xs text-gray-500">
              Consider urgency, scale, and potential harm
            </p>
          </div>

          {/* Controlled Validation Possible */}
          <div className="border border-gray-200 rounded-lg p-5">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Controlled Validation Possible *
            </label>
            <p className="text-sm text-gray-500 mb-4">
              Can the intelligence be validated through controlled investigation without alerting targets?
            </p>
            <Controller
              name="riskControlledValidation"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-3 gap-3">
                  {Object.values(YesNoUnknown).map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => field.onChange(option)}
                      className={`px-4 py-3 border rounded-lg text-sm font-medium transition-colors ${
                        field.value === option
                          ? getYesNoColor(option)
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            />
            {errors.riskControlledValidation && (
              <p className="mt-2 text-sm text-red-600">{errors.riskControlledValidation.message}</p>
            )}
            <p className="mt-2 text-xs text-gray-500">
              Assessment of feasibility for covert validation activities
            </p>
          </div>

          {/* Premature Disclosure Risk */}
          <div className="border border-gray-200 rounded-lg p-5">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Premature Disclosure Risk *
            </label>
            <p className="text-sm text-gray-500 mb-4">
              Risk of investigation being compromised by premature disclosure or leakage
            </p>
            <Controller
              name="riskPrematureDisclosure"
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
            {errors.riskPrematureDisclosure && (
              <p className="mt-2 text-sm text-red-600">{errors.riskPrematureDisclosure.message}</p>
            )}
            <p className="mt-2 text-xs text-gray-500">
              Consider source reliability, communication channels, and stakeholder awareness
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
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Risk Assessment Importance</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>
                Proper risk assessment is critical for TrueBuddy leads. HIGH risk in any category requires 
                senior management approval before proceeding. Consider all factors carefully before making 
                recommendations in the next steps.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrueBuddyStep6Risk;
