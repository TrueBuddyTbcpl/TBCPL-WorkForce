// src/components/operations/pre-report/steps/truebuddy-lead/Step5Observations.tsx
import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import type { TrueBuddyLeadStep5Input } from '../../../../../schemas/prereport.schemas';
import { trueBuddyLeadStep5Schema } from '../../../../../schemas/prereport.schemas';
import type { TrueBuddyLeadData } from '../../../../../types/prereport.types';
import {
  OperationScale,
  RiskLevel,
  BrandExposure,
} from '../../../../../utils/constants';
import { useAuthStore } from '../../../../../stores/authStore';
import apiClient from '../../../../../services/api/apiClient';
import { toast } from 'sonner';



interface Step5Props {
  data: TrueBuddyLeadData;
  onNext: (data: Partial<TrueBuddyLeadData>) => Promise<void>;
  onBack: () => void;
  onSkip: () => void;
}


interface CustomOption {
  id: number;
  optionName: string;
}



const TrueBuddyStep5Observations: React.FC<Step5Props> = ({ data, onNext, onBack, onSkip }) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TrueBuddyLeadStep5Input>({
    resolver: zodResolver(trueBuddyLeadStep5Schema),
    defaultValues: {
      obsOperationScale:          data.obsOperationScale          || OperationScale.SMALL,
      obsCounterfeitLikelihood:   data.obsCounterfeitLikelihood   || RiskLevel.LOW,
      obsBrandExposure:           data.obsBrandExposure           || BrandExposure.SINGLE_BRAND,
      obsBrandExposureCustomText: data.obsBrandExposureCustomText || '',    // ← CHANGED
      obsEnforcementSensitivity:  data.obsEnforcementSensitivity  || RiskLevel.LOW,
    },
  });


  const watchBrandExposure = watch('obsBrandExposure');


  // ── Custom Observations State ──────────────────────────────────────────────
  const { user } = useAuthStore();
  const canDelete =
    (user?.roleName === 'ADMIN' || user?.roleName === 'SUPER_ADMIN') &&
    user?.departmentName === 'Admin';


  const [customOptions, setCustomOptions] = useState<CustomOption[]>([]);
  const [loadingOpts,   setLoadingOpts]   = useState(true);
  const [showAddForm,   setShowAddForm]   = useState(false);
  const [newOptName,    setNewOptName]    = useState('');
  const [addingOpt,     setAddingOpt]     = useState(false);
  const [deletingId,    setDeletingId]    = useState<number | null>(null);


  const [customObsData, setCustomObsData] = useState<Record<number, string>>(() => {
    const map: Record<number, string> = {};
    data?.observationsCustomData?.forEach((e: any) => {
      map[e.optionId] = e.text ?? '';
    });
    return map;
  });


  useEffect(() => {
    apiClient
      .get('/operation/prereport/custom-options?stepNumber=5&leadType=TRUEBUDDY_LEAD')
      .then(res => setCustomOptions(res.data.data ?? []))
      .catch(() => toast.error('Failed to load custom options'))
      .finally(() => setLoadingOpts(false));
  }, []);


  const handleAddOption = async () => {
    if (!newOptName.trim()) return;
    setAddingOpt(true);
    try {
      const res = await apiClient.post('/operation/prereport/custom-options', {
        stepNumber: 5,
        leadType:   'TRUEBUDDY_LEAD',
        optionName: newOptName.trim(),
      });
      setCustomOptions(prev => [...prev, res.data.data]);
      setNewOptName('');
      setShowAddForm(false);
      toast.success('Custom observation added');
    } catch {
      toast.error('Failed to add option');
    } finally {
      setAddingOpt(false);
    }
  };


  const handleDeleteOption = async (id: number) => {
    if (!window.confirm('Delete this custom observation permanently?')) return;
    setDeletingId(id);
    try {
      await apiClient.delete(`/operation/prereport/custom-options/${id}`);
      setCustomOptions(prev => prev.filter(o => o.id !== id));
      setCustomObsData(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      toast.success('Observation deleted');
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeletingId(null);
    }
  };


  const onSubmit = async (formData: TrueBuddyLeadStep5Input) => {
    try {
      await onNext({
        ...formData,
        observationsCustomData: Object.entries(customObsData).map(([id, text]) => ({
          optionId: Number(id),
          text,
        })),
      });
    } catch (error) {
      console.error('Error submitting Step 5:', error);
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


  const inputClass = (hasError: boolean) =>
    `w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
      hasError ? 'border-red-500' : 'border-gray-300'
    }`;


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


          {/* ── Operation Scale ──────────────────────────────────────────── */}
          <div className="border border-gray-200 rounded-lg p-5">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Operation Scale
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


          {/* ── Counterfeit Likelihood ───────────────────────────────────── */}
          <div className="border border-gray-200 rounded-lg p-5">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Counterfeit Likelihood
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


          {/* ── Brand Exposure ───────────────────────────────────────────── */}
          <div className="border border-gray-200 rounded-lg p-5">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Brand Exposure
            </label>
            <p className="text-sm text-gray-500 mb-4">
              Number of brands potentially affected
            </p>
            <Controller
              name="obsBrandExposure"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-3 gap-3">
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
            {/* Custom Text — only when CUSTOM selected */}
            {watchBrandExposure === BrandExposure.CUSTOM && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Brand Exposure (Custom)                                  {/* ← CHANGED */}
                </label>
                <Controller
                  name="obsBrandExposureCustomText"                        
                  control={control}
                  render={({ field }) => (
                    <input
                      type="text"                                           
                      {...field}
                      placeholder="Describe custom brand exposure"         
                      className={inputClass(!!errors.obsBrandExposureCustomText)}
                    />
                  )}
                />
                {errors.obsBrandExposureCustomText && (
                  <p className="mt-1 text-sm text-red-600">{errors.obsBrandExposureCustomText.message}</p>
                )}
              </div>
            )}
          </div>


          {/* ── Enforcement Sensitivity ──────────────────────────────────── */}
          <div className="border border-gray-200 rounded-lg p-5">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Enforcement Sensitivity
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


          {/* ❌ Leakage Risk — REMOVED ENTIRELY */}


          {/* ── Custom Observation Fields ────────────────────────────────── */}
          <div className="border-t border-dashed border-gray-300 pt-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-gray-600">Custom Observations</p>
              <button
                type="button"
                onClick={() => setShowAddForm(s => !s)}
                className="flex items-center gap-1 text-xs px-3 py-1.5 bg-indigo-50
                           text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-100"
              >
                <Plus className="w-3.5 h-3.5" /> Add Custom Observation
              </button>
            </div>


            {showAddForm && (
              <div className="flex items-center gap-2 mb-4">
                <input
                  type="text"
                  value={newOptName}
                  onChange={e => setNewOptName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddOption())}
                  placeholder="Observation field name..."
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


            {loadingOpts && (
              <div className="flex items-center gap-2 text-sm text-gray-400 py-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading custom observations...
              </div>
            )}


            {!loadingOpts && customOptions.length === 0 && !showAddForm && (
              <p className="text-xs text-gray-400 italic py-1">
                No custom observations yet. Click "Add Custom Observation" to create one.
              </p>
            )}


            {!loadingOpts && customOptions.map(opt => (
              <div
                key={opt.id}
                className="border border-indigo-200 rounded-lg p-5 mb-4 bg-indigo-50"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {opt.optionName}
                    </label>
                    <p className="text-xs text-gray-500 mt-0.5">Custom observation field</p>
                  </div>
                  {canDelete && (
                    <button
                      type="button"
                      onClick={() => handleDeleteOption(opt.id)}
                      disabled={deletingId === opt.id}
                      className="p-1 text-gray-300 hover:text-red-500 transition-colors"
                      title="Delete observation (Admin only)"
                    >
                      {deletingId === opt.id
                        ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        : <Trash2 className="w-3.5 h-3.5" />
                      }
                    </button>
                  )}
                </div>
                <textarea
                  value={customObsData[opt.id] ?? ''}
                  onChange={e =>
                    setCustomObsData(prev => ({ ...prev, [opt.id]: e.target.value }))
                  }
                  rows={4}
                  placeholder={`Enter observation for ${opt.optionName}...`}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
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
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-purple-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
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