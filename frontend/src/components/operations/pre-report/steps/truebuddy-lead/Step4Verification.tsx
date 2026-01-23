// src/components/operations/pre-report/steps/truebuddy-lead/Step4Verification.tsx
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type {
  TrueBuddyLeadStep4Input,
} from '../../../../../schemas/prereport.schemas';
import {trueBuddyLeadStep4Schema} from '../../../../../schemas/prereport.schemas';
import type { TrueBuddyLeadData } from '../../../../../types/prereport.types';
import { VerificationStatus } from '../../../../../utils/constants';

interface Step4Props {
  data: TrueBuddyLeadData;
  onNext: (data: Partial<TrueBuddyLeadData>) => Promise<void>;
  onBack: () => void;
  onSkip: () => void;
}

const TrueBuddyStep4Verification: React.FC<Step4Props> = ({ data, onNext, onBack,onSkip }) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TrueBuddyLeadStep4Input>({
    resolver: zodResolver(trueBuddyLeadStep4Schema),
    defaultValues: {
      verificationIntelCorroboration: data.verificationIntelCorroboration || VerificationStatus.NOT_DONE,
      verificationIntelCorroborationNotes: data.verificationIntelCorroborationNotes || '',
      verificationOsint: data.verificationOsint || VerificationStatus.NOT_DONE,
      verificationOsintNotes: data.verificationOsintNotes || '',
      verificationPatternMapping: data.verificationPatternMapping || VerificationStatus.NOT_DONE,
      verificationPatternMappingNotes: data.verificationPatternMappingNotes || '',
      verificationJurisdiction: data.verificationJurisdiction || VerificationStatus.NOT_DONE,
      verificationJurisdictionNotes: data.verificationJurisdictionNotes || '',
      verificationRiskAssessment: data.verificationRiskAssessment || VerificationStatus.NOT_DONE,
      verificationRiskAssessmentNotes: data.verificationRiskAssessmentNotes || '',
    },
  });

  const onSubmit = async (formData: TrueBuddyLeadStep4Input) => {
    try {
      await onNext(formData);
    } catch (error) {
      console.error('Error submitting Step 4:', error);
    }
  };

  const verificationFields = [
    {
      statusField: 'verificationIntelCorroboration' as const,
      notesField: 'verificationIntelCorroborationNotes' as const,
      label: 'Internal Intelligence Corroboration',
      description: 'Cross-verification of intelligence from multiple sources',
    },
    {
      statusField: 'verificationOsint' as const,
      notesField: 'verificationOsintNotes' as const,
      label: 'OSINT / Market Footprint Review',
      description: 'Verification through publicly available information',
    },
    {
      statusField: 'verificationPatternMapping' as const,
      notesField: 'verificationPatternMappingNotes' as const,
      label: 'Pattern Mapping (Similar Past Cases)',
      description: 'Mapping against known patterns and historical data',
    },
    {
      statusField: 'verificationJurisdiction' as const,
      notesField: 'verificationJurisdictionNotes' as const,
      label: 'Jurisdiction Feasibility Review',
      description: 'Verification of legal jurisdiction and enforcement viability',
    },
    {
      statusField: 'verificationRiskAssessment' as const,
      notesField: 'verificationRiskAssessmentNotes' as const,
      label: 'Risk & Sensitivity Assessment',
      description: 'Assessment of operational and legal risks',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case VerificationStatus.DONE:
        return 'bg-green-100 text-green-800 border-green-300';
      case VerificationStatus.IN_PROGRESS:
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case VerificationStatus.NOT_DONE:
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Step 4: Verification Activities
        </h2>

        <p className="text-gray-600 mb-6">
          Document all verification activities conducted on the intelligence received.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {verificationFields.map((field) => {
            const statusValue = watch(field.statusField);
            
            return (
              <div
                key={field.statusField}
                className="border border-gray-200 rounded-lg p-6 space-y-4"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {field.label}
                  </h3>
                  <p className="text-sm text-gray-500">{field.description}</p>
                </div>

                {/* Status Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status *
                  </label>
                  <Controller
                    name={field.statusField}
                    control={control}
                    render={({ field: controllerField }) => (
                      <div className="flex gap-3">
                        {Object.values(VerificationStatus).map((status) => (
                          <button
                            key={status}
                            type="button"
                            onClick={() => controllerField.onChange(status)}
                            className={`flex-1 px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                              controllerField.value === status
                                ? getStatusColor(status)
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {status.replace(/_/g, ' ')}
                          </button>
                        ))}
                      </div>
                    )}
                  />
                  {errors[field.statusField] && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors[field.statusField]?.message}
                    </p>
                  )}
                </div>

                {/* Notes (Optional) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes {statusValue !== VerificationStatus.NOT_DONE && '(Recommended)'}
                  </label>
                  <Controller
                    name={field.notesField}
                    control={control}
                    render={({ field: controllerField }) => (
                      <textarea
                        {...controllerField}
                        rows={3}
                        placeholder={
                          statusValue === VerificationStatus.NOT_DONE
                            ? 'Optional notes'
                            : 'Provide details about the verification conducted...'
                        }
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                          errors[field.notesField] ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                    )}
                  />
                  {errors[field.notesField] && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors[field.notesField]?.message}
                    </p>
                  )}
                </div>
              </div>
            );
          })}

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
            <h3 className="text-sm font-medium text-blue-800">Verification Guidelines</h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc list-inside space-y-1">
                <li><strong>DONE:</strong> Verification completed with conclusive findings</li>
                <li><strong>IN_PROGRESS:</strong> Verification activities are ongoing</li>
                <li><strong>NOT_DONE:</strong> Verification not yet initiated or not applicable</li>
                <li>Provide detailed notes for DONE and IN_PROGRESS statuses</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrueBuddyStep4Verification;
