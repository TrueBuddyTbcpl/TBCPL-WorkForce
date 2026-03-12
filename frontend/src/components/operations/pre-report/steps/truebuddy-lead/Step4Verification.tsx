// src/components/operations/pre-report/steps/truebuddy-lead/Step4Verification.tsx
import { useState, useEffect } from 'react';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../../../../stores/authStore';
import apiClient from '../../../../../services/api/apiClient';
import { toast } from 'sonner';

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

  const [customVerifData, setCustomVerifData] = useState<
  Record<number, { status: string; notes: string }>
>(() => {
  const map: Record<number, { status: string; notes: string }> = {};
  data?.verificationCustomData?.forEach((e: any) => {
    map[e.optionId] = { status: e.status, notes: e.notes ?? '' };
  });
  return map;
});

// ── Add these right after customVerifData state ────────────────────────────
const { user } = useAuthStore();
const canDelete =
  (user?.roleName === 'ADMIN' || user?.roleName === 'SUPER_ADMIN') &&
  user?.departmentName === 'Admin';

interface CustomOption { id: number; optionName: string; }

const [customOptions, setCustomOptions] = useState<CustomOption[]>([]);
const [loadingOpts,   setLoadingOpts]   = useState(true);
const [showAddForm,   setShowAddForm]   = useState(false);
const [newOptName,    setNewOptName]    = useState('');
const [addingOpt,     setAddingOpt]     = useState(false);
const [deletingId,    setDeletingId]    = useState<number | null>(null);

useEffect(() => {
  apiClient.get('/operation/prereport/custom-options?stepNumber=4&leadType=TRUEBUDDY_LEAD')
    .then(res => setCustomOptions(res.data.data ?? []))
    .catch(() => toast.error('Failed to load custom options'))
    .finally(() => setLoadingOpts(false));
}, []);

const handleAddOption = async () => {
  if (!newOptName.trim()) return;
  setAddingOpt(true);
  try {
    const res = await apiClient.post('/operation/prereport/custom-options', {
      stepNumber: 4,
      leadType:   'TRUEBUDDY_LEAD',
      optionName: newOptName.trim(),
    });
    setCustomOptions(prev => [...prev, res.data.data]);
    setNewOptName('');
    setShowAddForm(false);
    toast.success('Custom verification item added');
  } catch {
    toast.error('Failed to add option');
  } finally {
    setAddingOpt(false);
  }
};

const handleDeleteOption = async (id: number) => {
  if (!window.confirm('Delete this custom verification item permanently?')) return;
  setDeletingId(id);
  try {
    await apiClient.delete(`/operation/prereport/custom-options/${id}`);
    setCustomOptions(prev => prev.filter(o => o.id !== id));
    setCustomVerifData(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    toast.success('Item deleted');
  } catch {
    toast.error('Failed to delete');
  } finally {
    setDeletingId(null);
  }
};

  

  const onSubmit = async (formData: TrueBuddyLeadStep4Input) => {
    try {
      await onNext({
      ...formData,
      verificationCustomData: Object.entries(customVerifData).map(([id, val]) => ({
        optionId: Number(id),
        status:   val.status,
        notes:    val.notes,
      })),
    })
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
          Step 4: Preliminary Verification Conducted by True Buddy
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

                    {/* ── Custom Verification Items ─────────────────────────────────── */}
          <div className="border-t border-dashed border-gray-300 pt-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-gray-600">Custom Verification Items</p>
              <button
                type="button"
                onClick={() => setShowAddForm(s => !s)}
                className="flex items-center gap-1 text-xs px-3 py-1.5 bg-indigo-50
                           text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-100"
              >
                <Plus className="w-3.5 h-3.5" /> Add Custom Item
              </button>
            </div>

            {/* Inline add form */}
            {showAddForm && (
              <div className="flex items-center gap-2 mb-4">
                <input
                  type="text"
                  value={newOptName}
                  onChange={e => setNewOptName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddOption())}
                  placeholder="Verification item name..."
                  className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg
                             focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddOption}
                  disabled={addingOpt || !newOptName.trim()}
                  className="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg
                             hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {addingOpt ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowAddForm(false); setNewOptName(''); }}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            )}

            {/* Loading */}
            {loadingOpts && (
              <div className="flex items-center gap-2 text-sm text-gray-400 py-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading custom items...
              </div>
            )}

            {/* Empty state */}
            {!loadingOpts && customOptions.length === 0 && !showAddForm && (
              <p className="text-xs text-gray-400 italic py-1">
                No custom items yet. Click "Add Custom Item" to create one.
              </p>
            )}

            {/* Custom cards — styled to match existing fixed item cards above */}
            {!loadingOpts && customOptions.map(opt => (
              <div
                key={opt.id}
                className="border border-indigo-200 rounded-lg p-6 space-y-4 mb-4 bg-indigo-50"
              >
                {/* Card header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {opt.optionName}
                    </h3>
                    <p className="text-sm text-gray-500">Custom verification item</p>
                  </div>
                  {canDelete && (
                    <button
                      type="button"
                      onClick={() => handleDeleteOption(opt.id)}
                      disabled={deletingId === opt.id}
                      className="p-1 text-gray-300 hover:text-red-500 transition-colors"
                      title="Delete item (Admin only)"
                    >
                      {deletingId === opt.id
                        ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        : <Trash2 className="w-3.5 h-3.5" />
                      }
                    </button>
                  )}
                </div>

                {/* Status — button-toggle style matching existing fixed items */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <div className="flex gap-3">
                    {Object.values(VerificationStatus).map(status => (
                      <button
                        key={status}
                        type="button"
                        onClick={() =>
                          setCustomVerifData(prev => ({
                            ...prev,
                            [opt.id]: { ...prev[opt.id], status },
                          }))
                        }
                        className={`flex-1 px-4 py-2 border rounded-lg text-sm font-medium
                                    transition-colors ${
                          (customVerifData[opt.id]?.status ?? VerificationStatus.NOT_DONE) === status
                            ? getStatusColor(status)
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {status.replace(/_/g, ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes{' '}
                    {(customVerifData[opt.id]?.status ?? VerificationStatus.NOT_DONE)
                      !== VerificationStatus.NOT_DONE && '(Recommended)'}
                  </label>
                  <textarea
                    value={customVerifData[opt.id]?.notes ?? ''}
                    onChange={e =>
                      setCustomVerifData(prev => ({
                        ...prev,
                        [opt.id]: { ...prev[opt.id], notes: e.target.value },
                      }))
                    }
                    rows={3}
                    placeholder={
                      (customVerifData[opt.id]?.status ?? VerificationStatus.NOT_DONE)
                        === VerificationStatus.NOT_DONE
                        ? 'Optional notes'
                        : 'Provide details about the verification conducted...'
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg
                               focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>
            ))}
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
