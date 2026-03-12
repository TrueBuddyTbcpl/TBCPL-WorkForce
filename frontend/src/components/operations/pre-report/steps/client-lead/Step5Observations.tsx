// ADD these alongside your existing imports:
import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useAuthStore } from '../../../../../stores/authStore';
import apiClient from '../../../../../services/api/apiClient';
import { toast } from 'sonner';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query'; // ✅ ADD THIS
import { useUpdateStep } from '../../../../../hooks/prereport/useUpdateStep';
import { clientLeadStep5Schema } from '../../../../../schemas/prereport.schemas';
import { LeadType } from '../../../../../utils/constants';
import type { ClientLeadStep5Input } from '../../../../../schemas/prereport.schemas';
import type { ClientLeadData } from '../../../../../types/prereport.types';

interface Step5ObservationsProps {
  prereportId: number;
  reportId: string;
  data?: ClientLeadData | null;
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
}

export const Step5Observations = ({
  prereportId,
  reportId,
  data,
  onNext,
  onPrevious,
  onSkip,
}: Step5ObservationsProps) => {
  const updateMutation = useUpdateStep();
  const queryClient = useQueryClient(); // ✅ ADD THIS
  // ── Custom Observations State ──────────────────────────────────────────────
  const { user } = useAuthStore();
  const canDelete =
    (user?.roleName === 'ADMIN' || user?.roleName === 'SUPER_ADMIN') &&
    user?.departmentName === 'Admin';

  interface CustomOption { id: number; optionName: string; }

  const [customOptions, setCustomOptions] = useState<CustomOption[]>([]);
  const [loadingOpts, setLoadingOpts] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newOptName, setNewOptName] = useState('');
  const [addingOpt, setAddingOpt] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Per-option text, keyed by optionId
  const [customObsData, setCustomObsData] = useState<Record<number, string>>(() => {
    const map: Record<number, string> = {};
    data?.observationsCustomData?.forEach((e: any) => {
      map[e.optionId] = e.text ?? '';
    });
    return map;
  });

  useEffect(() => {
    apiClient.get('/operation/prereport/custom-options?stepNumber=5')
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
      toast.error('Failed to delete option');
    } finally {
      setDeletingId(null);
    }
  };


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientLeadStep5Input>({
    resolver: zodResolver(clientLeadStep5Schema),
    defaultValues: {
      obsIdentifiableTarget: data?.obsIdentifiableTarget || '',
      obsTraceability: data?.obsTraceability || '',
      obsProductVisibility: data?.obsProductVisibility || '',
      obsCounterfeitingIndications: data?.obsCounterfeitingIndications || '',
      obsEvidentiary_gaps: data?.obsEvidentiary_gaps || '',
    },
  });

  const onSubmit = async (formData: ClientLeadStep5Input) => {
    try {
      await updateMutation.mutateAsync({
        prereportId,
        stepNumber: 5,
        data: {
          ...formData,
          observationsCustomData: Object.entries(customObsData).map(([id, text]) => ({
            optionId: Number(id),
            text,
          })),
        },
        leadType: LeadType.CLIENT_LEAD,
        reportId,
      });

      // ✅ Invalidate the prereport query so sidebar re-fetches fresh step statuses
      await queryClient.invalidateQueries({ queryKey: ['prereport', prereportId] });

      onNext();
    } catch (error) {
      console.error('Error saving step:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Identifiable Target */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Availability of Identifiable Target <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register('obsIdentifiableTarget')}
          rows={4}
          placeholder="Observations about target identification"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.obsIdentifiableTarget && (
          <p className="text-red-500 text-sm mt-1">{errors.obsIdentifiableTarget.message}</p>
        )}
      </div>

      {/* Traceability */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Traceability of Entity / Contact <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register('obsTraceability')}
          rows={4}
          placeholder="Observations about product traceability"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.obsTraceability && (
          <p className="text-red-500 text-sm mt-1">{errors.obsTraceability.message}</p>
        )}
      </div>

      {/* Product Visibility */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Product Visibility / Market Presence <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register('obsProductVisibility')}
          rows={4}
          placeholder="Observations about product visibility in market"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.obsProductVisibility && (
          <p className="text-red-500 text-sm mt-1">{errors.obsProductVisibility.message}</p>
        )}
      </div>

      {/* Counterfeiting Indications */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Indications of Counterfeiting / Lookalike <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register('obsCounterfeitingIndications')}
          rows={4}
          placeholder="Observations about counterfeiting indicators"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.obsCounterfeitingIndications && (
          <p className="text-red-500 text-sm mt-1">{errors.obsCounterfeitingIndications.message}</p>
        )}
      </div>

      {/* Evidentiary Gaps */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Evidentiary Gaps Identified <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register('obsEvidentiary_gaps')}
          rows={4}
          placeholder="Observations about gaps in evidence"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.obsEvidentiary_gaps && (
          <p className="text-red-500 text-sm mt-1">{errors.obsEvidentiary_gaps.message}</p>
        )}
      </div>

      {/* ── Custom Observation Fields ─────────────────────────────────────── */}
      <div className="border-t border-dashed border-gray-300 pt-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-gray-600">Custom Observations</p>
          <button
            type="button"
            onClick={() => setShowAddForm(s => !s)}
            className="flex items-center gap-1 text-xs px-3 py-1.5 bg-indigo-50
                       text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-100"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Custom Observation
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

        {/* Loading state */}
        {loadingOpts && (
          <div className="flex items-center gap-2 text-sm text-gray-400 py-2">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading custom observations...
          </div>
        )}

        {/* Empty state */}
        {!loadingOpts && customOptions.length === 0 && !showAddForm && (
          <p className="text-xs text-gray-400 italic py-1">
            No custom observations yet. Click "Add Custom Observation" to create one.
          </p>
        )}

        {/* Custom observation textareas — same layout as fixed fields above */}
        {!loadingOpts && customOptions.map(opt => (
          <div key={opt.id} className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700">
                {opt.optionName}
              </label>
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
              placeholder={`Enter observations for ${opt.optionName}`}
              className="w-full px-3 py-2 border border-indigo-200 bg-indigo-50 rounded-lg
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        ))}
      </div>


      {/* Actions */}
      <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onPrevious}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
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
          disabled={updateMutation.isPending}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {updateMutation.isPending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              Save & Continue
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default Step5Observations;
