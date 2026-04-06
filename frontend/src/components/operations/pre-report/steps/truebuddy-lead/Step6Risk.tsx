// src/components/operations/pre-report/steps/truebuddy-lead/Step6Risk.tsx
import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import type { TrueBuddyLeadStep6Input } from '../../../../../schemas/prereport.schemas';
import { trueBuddyLeadStep6Schema } from '../../../../../schemas/prereport.schemas';
import type { TrueBuddyLeadData } from '../../../../../types/prereport.types';
import {
  RiskLevel,
  YesNo,              // ← ADD (replaces YesNoUnknown)
  // ❌ REMOVED: YesNoUnknown
} from '../../../../../utils/constants';
import { useAuthStore } from '../../../../../stores/authStore';
import apiClient from '../../../../../services/api/apiClient';
import { toast } from 'sonner';


interface Step6Props {
  data: TrueBuddyLeadData;
  onNext: (data: Partial<TrueBuddyLeadData>) => Promise<void>;
  onBack: () => void;
  onSkip: () => void;
}

interface CustomOption {
  id: number;
  optionName: string;
  optionDescription?: string;
}


const TrueBuddyStep6Risk: React.FC<Step6Props> = ({ data, onNext, onBack, onSkip }) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TrueBuddyLeadStep6Input>({
    resolver: zodResolver(trueBuddyLeadStep6Schema),
    defaultValues: {
      riskSourceReliability:    data.riskSourceReliability    || RiskLevel.LOW,
      riskClientConflict:       data.riskClientConflict       || RiskLevel.LOW,
      riskImmediateAction:      (data.riskImmediateAction as string)      || undefined,
      riskControlledValidation: (data.riskControlledValidation as string) || undefined,
      // ❌ REMOVED: riskPrematureDisclosure
    },
  });

  // ── Custom Risk Fields State ───────────────────────────────────────────────
  const { user } = useAuthStore();
  const canDelete =
    (user?.roleName === 'ADMIN' || user?.roleName === 'SUPER_ADMIN') &&
    user?.departmentName === 'Admin';

  const [customOptions, setCustomOptions] = useState<CustomOption[]>([]);
  const [loadingOpts,   setLoadingOpts]   = useState(true);
  const [showAddForm,   setShowAddForm]   = useState(false);
  const [newOptName,    setNewOptName]    = useState('');
  const [newOptDesc,    setNewOptDesc]    = useState('');
  const [addingOpt,     setAddingOpt]     = useState(false);
  const [deletingId,    setDeletingId]    = useState<number | null>(null);

  const [customRiskData, setCustomRiskData] = useState<Record<number, string>>(() => {
    const map: Record<number, string> = {};
    data?.riskCustomData?.forEach((e: any) => {
      map[e.optionId] = e.value ?? RiskLevel.LOW;
    });
    return map;
  });

  useEffect(() => {
    apiClient
      .get('/operation/prereport/custom-options?stepNumber=6&leadType=TRUEBUDDY_LEAD')
      .then(res => setCustomOptions(res.data.data ?? []))
      .catch(() => toast.error('Failed to load custom options'))
      .finally(() => setLoadingOpts(false));
  }, []);

  const handleAddOption = async () => {
    if (!newOptName.trim()) return;
    setAddingOpt(true);
    try {
      const res = await apiClient.post('/operation/prereport/custom-options', {
        stepNumber:        6,
        leadType:          'TRUEBUDDY_LEAD',
        optionName:        newOptName.trim(),
        optionDescription: newOptDesc.trim() || undefined,
      });
      setCustomOptions(prev => [...prev, res.data.data]);
      setNewOptName('');
      setNewOptDesc('');
      setShowAddForm(false);
      toast.success('Custom risk field added');
    } catch {
      toast.error('Failed to add option');
    } finally {
      setAddingOpt(false);
    }
  };

  const handleDeleteOption = async (id: number) => {
    if (!window.confirm('Delete this custom risk field permanently?')) return;
    setDeletingId(id);
    try {
      await apiClient.delete(`/operation/prereport/custom-options/${id}`);
      setCustomOptions(prev => prev.filter(o => o.id !== id));
      setCustomRiskData(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      toast.success('Risk field deleted');
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeletingId(null);
    }
  };

  const onSubmit = async (formData: TrueBuddyLeadStep6Input) => {
    try {
      await onNext({
        ...formData,
        riskCustomData: Object.entries(customRiskData).map(([id, value]) => ({
          optionId: Number(id),
          value,
        })),
      });
    } catch (error) {
      console.error('Error submitting Step 6:', error);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case RiskLevel.HIGH:   return 'bg-red-100 text-red-800 border-red-300';
      case RiskLevel.MEDIUM: return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case RiskLevel.LOW:    return 'bg-green-100 text-green-800 border-green-300';
      default:               return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  // ← CHANGED: was getYesNoColor using YesNoUnknown keys
  const getYesNoColor = (value: string) => {
    switch (value) {
      case YesNo.YES: return 'bg-green-100 text-green-800 border-green-300';
      case YesNo.NO:  return 'bg-red-100 text-red-800 border-red-300';
      default:        return 'bg-gray-100 text-gray-800 border-gray-300';
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

          {/* ── Source Reliability ───────────────────────────────────────── */}
          <div className="border border-gray-200 rounded-lg p-5">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Source Reliability
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

          {/* ── Client Conflict Risk ─────────────────────────────────────── */}
          <div className="border border-gray-200 rounded-lg p-5">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Client Conflict Risk
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

          {/* ── Immediate Action Required (YesNo) ───────────────────────── */}
          <div className="border border-gray-200 rounded-lg p-5">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Immediate Action Required
            </label>
            <p className="text-sm text-gray-500 mb-4">
              Does this intelligence require immediate action or enforcement?
            </p>
            <Controller
              name="riskImmediateAction"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-2 gap-3">   {/* ← grid-cols-2, only YES/NO */}
                  {Object.values(YesNo).map((option) => (   // ← YesNo replaces YesNoUnknown
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

          {/* ── Controlled Validation Possible (YesNo) ──────────────────── */}
          <div className="border border-gray-200 rounded-lg p-5">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Controlled Validation Possible
            </label>
            <p className="text-sm text-gray-500 mb-4">
              Can the intelligence be validated through controlled investigation without alerting targets?
            </p>
            <Controller
              name="riskControlledValidation"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-2 gap-3">   {/* ← grid-cols-2, only YES/NO */}
                  {Object.values(YesNo).map((option) => (   // ← YesNo replaces YesNoUnknown
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

          {/* ❌ Premature Disclosure Risk — REMOVED ENTIRELY */}

          {/* ── Custom Risk Fields ────────────────────────────────────────── */}
          <div className="border-t border-dashed border-gray-300 pt-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-gray-600">Custom Risk Factors</p>
              <button
                type="button"
                onClick={() => setShowAddForm(s => !s)}
                className="flex items-center gap-1 text-xs px-3 py-1.5 bg-indigo-50
                           text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-100"
              >
                <Plus className="w-3.5 h-3.5" /> Add Custom Factor
              </button>
            </div>

            {showAddForm && (
              <div className="flex flex-col gap-2 mb-4 p-3 border border-indigo-200 bg-indigo-50 rounded-lg">
                <input
                  type="text"
                  value={newOptName}
                  onChange={e => setNewOptName(e.target.value)}
                  placeholder="Risk factor label (required)..."
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg
                             focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <input
                  type="text"
                  value={newOptDesc}
                  onChange={e => setNewOptDesc(e.target.value)}
                  placeholder="Short description (optional)..."
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg
                             focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <div className="flex gap-2">
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
                    onClick={() => { setShowAddForm(false); setNewOptName(''); setNewOptDesc(''); }}
                    className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {loadingOpts && (
              <div className="flex items-center gap-2 text-sm text-gray-400 py-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading custom risk factors...
              </div>
            )}

            {!loadingOpts && customOptions.length === 0 && !showAddForm && (
              <p className="text-xs text-gray-400 italic py-1">
                No custom risk factors yet. Click "Add Custom Factor" to create one.
              </p>
            )}

            {!loadingOpts && customOptions.map(opt => (
              <div key={opt.id} className="border border-indigo-200 rounded-lg p-5 mb-4 bg-indigo-50">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {opt.optionName}
                    </label>
                    {opt.optionDescription && (
                      <p className="text-sm text-gray-500 mt-0.5">{opt.optionDescription}</p>
                    )}
                  </div>
                  {canDelete && (
                    <button
                      type="button"
                      onClick={() => handleDeleteOption(opt.id)}
                      disabled={deletingId === opt.id}
                      className="p-1 text-gray-300 hover:text-red-500 transition-colors ml-2 flex-shrink-0"
                      title="Delete risk factor (Admin only)"
                    >
                      {deletingId === opt.id
                        ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        : <Trash2 className="w-3.5 h-3.5" />
                      }
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {Object.values(RiskLevel).map(level => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setCustomRiskData(prev => ({ ...prev, [opt.id]: level }))}
                      className={`px-4 py-3 border rounded-lg text-sm font-medium transition-colors ${
                        (customRiskData[opt.id] ?? RiskLevel.LOW) === level
                          ? getRiskColor(level)
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

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
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Saving...' : 'Next Step'}
            </button>
          </div>
        </form>
      </div>

      {/* ── Info Box ─────────────────────────────────────────────────────── */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clipRule="evenodd" />
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