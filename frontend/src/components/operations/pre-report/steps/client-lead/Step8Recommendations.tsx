// ADD these alongside your existing imports:
import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useAuthStore } from '../../../../../stores/authStore';
import apiClient from '../../../../../services/api/apiClient';
import { toast } from 'sonner';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import { useUpdateStep } from '../../../../../hooks/prereport/useUpdateStep';
import { clientLeadStep8Schema } from '../../../../../schemas/prereport.schemas';
import { LeadType } from '../../../../../utils/constants';
import type { ClientLeadStep8Input } from '../../../../../schemas/prereport.schemas';
import type { ClientLeadData } from '../../../../../types/prereport.types';

interface Step8RecommendationsProps {
  prereportId: number;
  reportId: string;
  data?: ClientLeadData | null;
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
}

export const Step8Recommendations = ({
  prereportId,
  reportId,
  data,
  onNext,
  onPrevious,
  onSkip,
}: Step8RecommendationsProps) => {
  const updateMutation = useUpdateStep();

  // ── Custom Recommendations State ───────────────────────────────────────────
  const { user } = useAuthStore();
  const canDelete =
    (user?.roleName === 'ADMIN' || user?.roleName === 'SUPER_ADMIN') &&
    user?.departmentName === 'Admin';

  interface CustomOption { id: number; optionName: string; optionDescription?: string; }

  const [customOptions, setCustomOptions] = useState<CustomOption[]>([]);
  const [loadingOpts, setLoadingOpts] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newOptName, setNewOptName] = useState('');
  const [newOptDesc, setNewOptDesc] = useState('');
  const [addingOpt, setAddingOpt] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Track which custom option IDs are checked
  const [checkedCustomIds, setCheckedCustomIds] = useState<number[]>(
    data?.recCustomIds ?? []
  );

  useEffect(() => {
    apiClient.get('/operation/prereport/custom-options?stepNumber=8')
      .then(res => setCustomOptions(res.data.data ?? []))
      .catch(() => toast.error('Failed to load custom options'))
      .finally(() => setLoadingOpts(false));
  }, []);

  const handleAddOption = async () => {
    if (!newOptName.trim()) return;
    setAddingOpt(true);
    try {
      const res = await apiClient.post('/operation/prereport/custom-options', {
        stepNumber: 8,
        optionName: newOptName.trim(),
        optionDescription: newOptDesc.trim() || undefined,
      });
      setCustomOptions(prev => [...prev, res.data.data]);
      setNewOptName('');
      setNewOptDesc('');
      setShowAddForm(false);
      toast.success('Custom recommendation added');
    } catch {
      toast.error('Failed to add option');
    } finally {
      setAddingOpt(false);
    }
  };

  const handleDeleteOption = async (id: number) => {
    if (!window.confirm('Delete this custom recommendation permanently?')) return;
    setDeletingId(id);
    try {
      await apiClient.delete(`/operation/prereport/custom-options/${id}`);
      setCustomOptions(prev => prev.filter(o => o.id !== id));
      setCheckedCustomIds(prev => prev.filter(x => x !== id));
      toast.success('Recommendation deleted');
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
  } = useForm<ClientLeadStep8Input>({
    resolver: zodResolver(clientLeadStep8Schema),
    defaultValues: {
      recMarketSurvey: data?.recMarketSurvey || false,
      recCovertInvestigation: data?.recCovertInvestigation || false,
      recTestPurchase: data?.recTestPurchase || false,
      recEnforcementAction: data?.recEnforcementAction || false,
      recAdditionalInfo: data?.recAdditionalInfo || false,
      recClosureHold: data?.recClosureHold || false,
    },
  });

  const onSubmit = async (formData: ClientLeadStep8Input) => {
    try {
      await updateMutation.mutateAsync({
        prereportId,
        stepNumber: 8,
        data: { ...formData, recCustomIds: checkedCustomIds },  // ← updated
        leadType: LeadType.CLIENT_LEAD,
        reportId,
      });
      onNext();
    } catch (error) {
      console.error('Error saving step:', error);
    }
  };

  const recommendations = [
    {
      field: 'recMarketSurvey',
      label: 'Market Survey',
      description: 'Conduct comprehensive market survey to assess product distribution',
    },
    {
      field: 'recCovertInvestigation',
      label: 'Covert Investigation',
      description: 'Initiate undercover investigation to gather additional intelligence',
    },
    {
      field: 'recTestPurchase',
      label: 'Test Purchase',
      description: 'Execute controlled test purchase for evidence collection',
    },
    {
      field: 'recEnforcementAction',
      label: 'Enforcement Action',
      description: 'Proceed with immediate enforcement action (raid/seizure)',
    },
    {
      field: 'recAdditionalInfo',
      label: 'Additional Information Required',
      description: 'Request additional information from client before proceeding',
    },
    {
      field: 'recClosureHold',
      label: 'Closure/Hold',
      description: 'Close the lead or place on hold pending further developments',
    },
  ] as const;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Select all recommended actions based on the assessment. Multiple selections are allowed.
        </p>
      </div>

      <div className="space-y-3">
        {recommendations.map((rec) => (
          <label
            key={rec.field}
            className="flex items-start gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <input
              type="checkbox"
              {...register(rec.field as keyof ClientLeadStep8Input)}
              className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div className="flex-1">
              <p className="font-medium text-gray-900">{rec.label}</p>
              <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
            </div>
          </label>
        ))}
      </div>

      {errors.root && (
        <p className="text-red-500 text-sm">{errors.root.message}</p>
      )}

            {/* ── Custom Recommendations ────────────────────────────────────────── */}
      <div className="border-t border-dashed border-gray-300 pt-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-gray-600">Custom Recommendations</p>
          <button
            type="button"
            onClick={() => setShowAddForm(s => !s)}
            className="flex items-center gap-1 text-xs px-3 py-1.5 bg-indigo-50
                       text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-100"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Custom Option
          </button>
        </div>

        {/* Inline add form — includes optional description field (unique to Step 8) */}
        {showAddForm && (
          <div className="flex flex-col gap-2 mb-4 p-3 border border-indigo-200
                          bg-indigo-50 rounded-lg">
            <input
              type="text"
              value={newOptName}
              onChange={e => setNewOptName(e.target.value)}
              placeholder="Recommendation label (required)..."
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

        {/* Loading state */}
        {loadingOpts && (
          <div className="flex items-center gap-2 text-sm text-gray-400 py-2">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading custom recommendations...
          </div>
        )}

        {/* Empty state */}
        {!loadingOpts && customOptions.length === 0 && !showAddForm && (
          <p className="text-xs text-gray-400 italic py-1">
            No custom recommendations yet. Click "Add Custom Option" to create one.
          </p>
        )}

        {/* Custom recommendation checkboxes — same layout as fixed items above */}
        {!loadingOpts && (
          <div className="space-y-3">
            {customOptions.map(opt => (
              <div
                key={opt.id}
                className="flex items-start gap-3 p-4 border border-indigo-200
                           bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={checkedCustomIds.includes(opt.id)}
                  onChange={() =>
                    setCheckedCustomIds(prev =>
                      prev.includes(opt.id)
                        ? prev.filter(x => x !== opt.id)
                        : [...prev, opt.id]
                    )
                  }
                  className="mt-1 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{opt.optionName}</p>
                  {opt.optionDescription && (
                    <p className="text-sm text-gray-600 mt-1">{opt.optionDescription}</p>
                  )}
                </div>
                {canDelete && (
                  <button
                    type="button"
                    onClick={() => handleDeleteOption(opt.id)}
                    disabled={deletingId === opt.id}
                    className="p-1 text-gray-300 hover:text-red-500 transition-colors flex-shrink-0"
                    title="Delete recommendation (Admin only)"
                  >
                    {deletingId === opt.id
                      ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      : <Trash2 className="w-3.5 h-3.5" />
                    }
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
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

export default Step8Recommendations;