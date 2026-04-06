// src/components/operations/pre-report/steps/truebuddy-lead/Step10Disclaimer.tsx
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { TrueBuddyLeadStep10Input } from '../../../../../schemas/prereport.schemas';
import { trueBuddyLeadStep10Schema } from '../../../../../schemas/prereport.schemas';
import type { TrueBuddyLeadData } from '../../../../../types/prereport.types';



// ── Default Disclaimer Text ───────────────────────────────────────────────────
const DEFAULT_DISCLAIMER =
  'This preliminary assessment is based on internally generated intelligence and limited ' +
  'non-intrusive verification. Specific source details, identities, and methods have been ' +
  'deliberately withheld to preserve confidentiality and prevent information contamination. ' +
  'This document does not constitute a final investigative report or confirmation of ' +
  'infringement. Any further action will be undertaken only upon written client approval ' +
  'and under a client-specific scope of work. Additional costs for validation, mobilisation, ' +
  'or enforcement shall be applicable as per the agreed proposal.';

type DisclaimerMode = 'default' | 'custom';



interface Step10Props {
  data: TrueBuddyLeadData;
  onNext: (data: Partial<TrueBuddyLeadData>) => Promise<void>;
  onBack: () => void;
  onSkip: () => void;
}



const TrueBuddyStep10Disclaimer: React.FC<Step10Props> = ({ data, onNext, onBack, onSkip }) => {

  // ── Determine initial mode from existing data ─────────────────────────────
  const initialMode: DisclaimerMode =
    !data.customDisclaimer || data.customDisclaimer === DEFAULT_DISCLAIMER
      ? 'default'
      : 'custom';

  const [mode, setMode] = useState<DisclaimerMode>(initialMode);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TrueBuddyLeadStep10Input>({
    resolver: zodResolver(trueBuddyLeadStep10Schema),
    defaultValues: {
      customDisclaimer: data.customDisclaimer || DEFAULT_DISCLAIMER,
    },
  });

  const customDisclaimer = watch('customDisclaimer');
  const charCount = customDisclaimer?.trim().length || 0;
  const wordCount  = customDisclaimer?.trim().split(/\s+/).filter(Boolean).length || 0;


  // ── Mode switch handlers ──────────────────────────────────────────────────
  const handleSwitchToDefault = () => {
    setMode('default');
    setValue('customDisclaimer', DEFAULT_DISCLAIMER, { shouldValidate: true });
  };

  const handleSwitchToCustom = () => {
    setMode('custom');
    // Clear if currently holding the default text so user starts fresh
    if (customDisclaimer === DEFAULT_DISCLAIMER) {
      setValue('customDisclaimer', '', { shouldValidate: false });
    }
  };


  const onSubmit = async (formData: TrueBuddyLeadStep10Input) => {
    try {
      await onNext(formData);
    } catch (error) {
      console.error('Error submitting Step 10:', error);
    }
  };


  const disclaimerSuggestions = [
    {
      category: 'Scope Limitations',
      examples: [
        'This report is based on available intelligence at the time of writing',
        'Findings are preliminary and subject to change',
        'Assessment limited to publicly available and provided information',
      ],
    },
    {
      category: 'Confidentiality',
      examples: [
        'Intended solely for authorized recipients',
        'Not to be shared without prior written consent',
        'Distribution restricted to named parties only',
      ],
    },
    {
      category: 'Liability',
      examples: [
        'TrueBuddy Consulting accepts no liability for actions taken on this intelligence',
        'Recommendations are advisory in nature only',
        'Independent legal advice should be sought before enforcement',
      ],
    },
    {
      category: 'Data & Accuracy',
      examples: [
        'Information accuracy depends on source reliability at time of collection',
        'Factual errors discovered post-submission must be reported immediately',
        'This document does not constitute legal evidence',
      ],
    },
  ];


  return (
    <div className="space-y-6">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Step 10: Custom Disclaimer
        </h2>
        <p className="text-gray-600 mb-6">
          Choose a disclaimer type for this TrueBuddy lead report. This will appear as the
          final section of the generated document.
        </p>


        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">


          {/* ── Mode Toggle Buttons ───────────────────────────────────────── */}
          <div className="grid grid-cols-2 gap-4">

            {/* Default Disclaimer Button */}
            <button
              type="button"
              onClick={handleSwitchToDefault}
              className={`relative flex flex-col items-start p-4 border-2 rounded-xl transition-all ${
                mode === 'default'
                  ? 'border-blue-500 bg-blue-50 shadow-sm'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              {mode === 'default' && (
                <span className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center
                                 rounded-full bg-blue-500">
                  <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              )}
              <div className={`mb-2 flex h-9 w-9 items-center justify-center rounded-lg ${
                mode === 'default' ? 'bg-blue-100' : 'bg-gray-100'
              }`}>
                <svg className={`h-5 w-5 ${mode === 'default' ? 'text-blue-600' : 'text-gray-500'}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955
                       0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622
                       5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <p className={`text-sm font-semibold ${
                mode === 'default' ? 'text-blue-800' : 'text-gray-700'
              }`}>
                Default Disclaimer
              </p>
              <p className="mt-1 text-xs text-gray-500 text-left">
                Use TrueBuddy's standard legal disclaimer
              </p>
            </button>

            {/* Custom Disclaimer Button */}
            <button
              type="button"
              onClick={handleSwitchToCustom}
              className={`relative flex flex-col items-start p-4 border-2 rounded-xl transition-all ${
                mode === 'custom'
                  ? 'border-purple-500 bg-purple-50 shadow-sm'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              {mode === 'custom' && (
                <span className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center
                                 rounded-full bg-purple-500">
                  <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              )}
              <div className={`mb-2 flex h-9 w-9 items-center justify-center rounded-lg ${
                mode === 'custom' ? 'bg-purple-100' : 'bg-gray-100'
              }`}>
                <svg className={`h-5 w-5 ${mode === 'custom' ? 'text-purple-600' : 'text-gray-500'}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5
                       m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <p className={`text-sm font-semibold ${
                mode === 'custom' ? 'text-purple-800' : 'text-gray-700'
              }`}>
                Custom Disclaimer
              </p>
              <p className="mt-1 text-xs text-gray-500 text-left">
                Write your own disclaimer text
              </p>
            </button>

          </div>


          {/* ── Default Mode: Preview Card ────────────────────────────────── */}
          {mode === 'default' && (
            <div className="border border-blue-200 rounded-lg bg-blue-50 p-5">
              <div className="flex items-center gap-2 mb-3">
                <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M2.458 12C3.732 5.943 7.523 3 12 3c4.478 0 8.268 2.943 9.542 7
                       -1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span className="text-sm font-semibold text-blue-800">Default Disclaimer Preview</span>
              </div>
              <p className="text-sm text-blue-900 leading-relaxed italic">
                "{DEFAULT_DISCLAIMER}"
              </p>
              <p className="mt-3 text-xs text-blue-600">
                ✓ This exact text will be saved and included in your report.
              </p>
              {/* Hidden controller keeps form value in sync */}
              <Controller
                name="customDisclaimer"
                control={control}
                render={({ field }) => <input type="hidden" {...field} />}
              />
            </div>
          )}


          {/* ── Custom Mode: Suggestions + Textarea ──────────────────────── */}
          {mode === 'custom' && (
            <>
              {/* Suggestions */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-5">
                <h3 className="text-sm font-semibold text-purple-900 mb-4 flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3
                         m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547
                         A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754
                         -.988-2.386l-.548-.547z" />
                  </svg>
                  What to Include in a Custom Disclaimer
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {disclaimerSuggestions.map((section, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">{section.category}</h4>
                      <ul className="space-y-1">
                        {section.examples.map((example, idx) => (
                          <li key={idx} className="text-xs text-gray-600 flex items-start">
                            <span className="text-purple-500 mr-2">•</span>
                            <span>{example}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Textarea */}
              <div className="border border-gray-200 rounded-lg p-5">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Write Custom Disclaimer
                </label>
                <p className="text-sm text-gray-500 mb-4">
                  This text will appear as a disclaimer at the end of the generated pre-report.
                </p>
                <Controller
                  name="customDisclaimer"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <textarea
                        {...field}
                        rows={12}
                        placeholder={`Enter your custom disclaimer here...\n\nExample:\nThis report has been prepared by TrueBuddy Consulting Pvt. Ltd. based on intelligence\navailable at the time of preparation. The contents are strictly confidential and intended\nsolely for the authorized recipient...`}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500
                                    focus:border-transparent resize-none text-sm ${
                          errors.customDisclaimer ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      <div className="flex justify-between items-center mt-2">
                        <div>
                          {errors.customDisclaimer && (
                            <p className="text-sm text-red-600">{errors.customDisclaimer.message}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-xs">
                          <span className={`font-medium ${
                            charCount === 0
                              ? 'text-gray-400'
                              : charCount < 50
                                ? 'text-yellow-600'
                                : 'text-green-600'
                          }`}>
                            {charCount} characters
                          </span>
                          <span className="text-gray-500">{wordCount} words</span>
                        </div>
                      </div>
                    </div>
                  )}
                />
              </div>

              {/* Progress Indicator */}
              {charCount > 0 && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Content Progress</span>
                    <span className={`text-sm font-semibold ${
                      charCount >= 100 ? 'text-green-600' :
                      charCount >= 50  ? 'text-yellow-600' :
                      'text-gray-500'
                    }`}>
                      {charCount >= 100 ? 'Well detailed' : charCount >= 50 ? 'Good' : 'Brief'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        charCount >= 100 ? 'bg-green-500' :
                        charCount >= 50  ? 'bg-yellow-500' :
                        'bg-purple-500'
                      }`}
                      style={{ width: `${Math.min((charCount / 200) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    50+ characters recommended for a meaningful disclaimer
                  </p>
                </div>
              )}
            </>
          )}


          {/* ── Form Actions ─────────────────────────────────────────────── */}
          <div className="flex justify-between pt-6 border-t">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
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
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700
                         disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>


      {/* ── Final Step Banner ────────────────────────────────────────────── */}
      <div className="bg-green-600 text-white rounded-lg p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0
                   3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946
                   3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138
                   3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806
                   3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438
                   3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-semibold">Final Step</h3>
            <p className="text-sm mt-1 text-green-100">
              This is the last step. Once submitted, your TrueBuddy Lead pre-report will be
              sent for review and approval.
            </p>
          </div>
        </div>
      </div>


      {/* ── Info Box ─────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-purple-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0
                1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-purple-800">Disclaimer Guidelines</h3>
            <div className="mt-2 text-sm text-purple-700">
              <ul className="list-disc list-inside space-y-1">
                <li>Keep language clear, precise, and professional</li>
                <li>Cover scope limitations and intended use of this report</li>
                <li>Include confidentiality and distribution restrictions</li>
                <li>State liability limitations where applicable</li>
                <li>Use <strong>Default</strong> if unsure — it covers all standard cases</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default TrueBuddyStep10Disclaimer;