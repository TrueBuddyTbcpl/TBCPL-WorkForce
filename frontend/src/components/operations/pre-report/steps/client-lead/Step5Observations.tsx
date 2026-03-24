// ADD these alongside your existing imports:
import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useAuthStore } from '../../../../../stores/authStore';
import apiClient from '../../../../../services/api/apiClient';
import { toast } from 'sonner';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useUpdateStep } from '../../../../../hooks/prereport/useUpdateStep';
import { clientLeadStep5Schema } from '../../../../../schemas/prereport.schemas';
import { LeadType } from '../../../../../utils/constants';
import type { ClientLeadStep5Input } from '../../../../../schemas/prereport.schemas';
import type { ClientLeadData } from '../../../../../types/prereport.types';


// ── Reusable Yes/No Toggle ─────────────────────────────────────────────────
interface YesNoToggleProps {
  value: string | null | undefined;
  onChange: (val: string) => void;
  error?: string;
}

const YesNoToggle = ({ value, onChange, error }: YesNoToggleProps) => (
  <div className="space-y-1">
    <div className="flex gap-3">
      <button
        type="button"
        onClick={() => onChange('YES')}
        className={`flex-1 py-2.5 rounded-lg border-2 text-sm font-semibold transition-all ${
          value === 'YES'
            ? 'bg-green-600 border-green-600 text-white shadow-sm'
            : 'bg-white border-gray-300 text-gray-600 hover:border-green-400 hover:text-green-600'
        }`}
      >
        ✓ Yes
      </button>
      <button
        type="button"
        onClick={() => onChange('NO')}
        className={`flex-1 py-2.5 rounded-lg border-2 text-sm font-semibold transition-all ${
          value === 'NO'
            ? 'bg-red-500 border-red-500 text-white shadow-sm'
            : 'bg-white border-gray-300 text-gray-600 hover:border-red-400 hover:text-red-500'
        }`}
      >
        ✗ No
      </button>
    </div>
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);


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
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const canDelete =
    (user?.roleName === 'ADMIN' || user?.roleName === 'SUPER_ADMIN') &&
    user?.departmentName === 'Admin';

  interface CustomOption { id: number; optionName: string; }

  const [customOptions, setCustomOptions]   = useState<CustomOption[]>([]);
  const [loadingOpts, setLoadingOpts]       = useState(true);
  const [showAddForm, setShowAddForm]       = useState(false);
  const [newOptName, setNewOptName]         = useState('');
  const [addingOpt, setAddingOpt]           = useState(false);
  const [deletingId, setDeletingId]         = useState<number | null>(null);

  // Custom observations — store YES / NO per optionId
  const [customObsData, setCustomObsData] = useState<Record<number, string>>(() => {
    const map: Record<number, string> = {};
    data?.observationsCustomData?.forEach((e: any) => {
      map[e.optionId] = e.text ?? '';
    });
    return map;
  });

  useEffect(() => {
    apiClient
      .get('/operation/prereport/custom-options?stepNumber=5&leadType=CLIENT_LEAD')
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
        leadType: 'CLIENT_LEAD',
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
      setCustomObsData(prev => { const n = { ...prev }; delete n[id]; return n; });
      toast.success('Observation deleted');
    } catch {
      toast.error('Failed to delete option');
    } finally {
      setDeletingId(null);
    }
  };

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ClientLeadStep5Input>({
    resolver: zodResolver(clientLeadStep5Schema),
    defaultValues: {
      obsIdentifiableTarget:      data?.obsIdentifiableTarget      || '',
      obsTraceability:            data?.obsTraceability            || '',
      obsProductVisibility:       data?.obsProductVisibility       || '',
      obsCounterfeitingIndications: data?.obsCounterfeitingIndications || '',
      obsEvidentiary_gaps:        data?.obsEvidentiary_gaps        || '',
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
      await queryClient.invalidateQueries({ queryKey: ['prereport', prereportId] });
      onNext();
    } catch (error) {
      console.error('Error saving step:', error);
    }
  };

  // Fixed observation fields config
  const fixedObservations = [
    {
      name: 'obsIdentifiableTarget' as const,
      label: 'Availability of Identifiable Target',
    },
    {
      name: 'obsTraceability' as const,
      label: 'Traceability of Entity / Contact',
    },
    {
      name: 'obsProductVisibility' as const,
      label: 'Product Visibility / Market Presence',
    },
    {
      name: 'obsCounterfeitingIndications' as const,
      label: 'Indications of Counterfeiting / Lookalike',
    },
    {
      name: 'obsEvidentiary_gaps' as const,
      label: 'Evidentiary Gaps Identified',
    },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-0">

      {/* ── Fixed Observation Fields as Yes/No Table ───────────────────── */}
      <div className="rounded-xl border border-gray-200 overflow-hidden mb-6">
        {/* Table Header */}
        <div className="grid grid-cols-[1fr_180px] bg-gray-50 border-b border-gray-200">
          <div className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Observation
          </div>
          <div className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide text-center">
            Response
          </div>
        </div>

        {/* Fixed Rows */}
        {fixedObservations.map((obs, idx) => (
          <div
            key={obs.name}
            className={`grid grid-cols-[1fr_180px] items-center border-b border-gray-100 last:border-b-0 ${
              idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
            }`}
          >
            {/* Label */}
            <div className="px-4 py-4">
              <span className="text-sm font-medium text-gray-700">{obs.label}</span>
            </div>

            {/* Yes/No Toggle */}
            <div className="px-4 py-3">
              <Controller
                name={obs.name}
                control={control}
                render={({ field }) => (
                  <YesNoToggle
                    value={field.value}
                    onChange={field.onChange}
                    error={errors[obs.name]?.message}
                  />
                )}
              />
            </div>
          </div>
        ))}
      </div>

      {/* ── Custom Observation Fields ──────────────────────────────────────── */}
      <div className="rounded-xl border border-dashed border-indigo-200 overflow-hidden mb-6">
        {/* Custom Section Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-indigo-50 border-b border-indigo-100">
          <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">
            Custom Observations
          </span>
          <button
            type="button"
            onClick={() => setShowAddForm(s => !s)}
            className="flex items-center gap-1 text-xs px-3 py-1.5 bg-white
                       text-indigo-600 border border-indigo-300 rounded-lg hover:bg-indigo-100 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Observation
          </button>
        </div>

        {/* Inline Add Form */}
        {showAddForm && (
          <div className="flex items-center gap-2 px-4 py-3 bg-white border-b border-indigo-100">
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

        {/* Loading */}
        {loadingOpts && (
          <div className="flex items-center gap-2 text-sm text-gray-400 px-4 py-4">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading custom observations...
          </div>
        )}

        {/* Empty State */}
        {!loadingOpts && customOptions.length === 0 && !showAddForm && (
          <p className="text-xs text-gray-400 italic px-4 py-4">
            No custom observations yet. Click "Add Observation" to create one.
          </p>
        )}

        {/* Custom Rows — same Yes/No table layout */}
        {!loadingOpts && customOptions.length > 0 && (
          <>
            {/* Sub-header */}
            <div className="grid grid-cols-[1fr_180px] bg-indigo-50/60 border-b border-indigo-100">
              <div className="px-4 py-2 text-xs font-semibold text-indigo-400 uppercase tracking-wide">
                Custom Field
              </div>
              <div className="px-4 py-2 text-xs font-semibold text-indigo-400 uppercase tracking-wide text-center">
                Response
              </div>
            </div>

            {customOptions.map((opt, idx) => (
              <div
                key={opt.id}
                className={`grid grid-cols-[1fr_180px] items-center border-b border-indigo-50 last:border-b-0 ${
                  idx % 2 === 0 ? 'bg-white' : 'bg-indigo-50/20'
                }`}
              >
                {/* Label + Delete */}
                <div className="px-4 py-4 flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-gray-700">{opt.optionName}</span>
                  {canDelete && (
                    <button
                      type="button"
                      onClick={() => handleDeleteOption(opt.id)}
                      disabled={deletingId === opt.id}
                      className="p-1 text-gray-300 hover:text-red-500 transition-colors flex-shrink-0"
                      title="Delete (Admin only)"
                    >
                      {deletingId === opt.id
                        ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        : <Trash2 className="w-3.5 h-3.5" />
                      }
                    </button>
                  )}
                </div>

                {/* Yes/No Toggle */}
                <div className="px-4 py-3">
                  <YesNoToggle
                    value={customObsData[opt.id] ?? ''}
                    onChange={val =>
                      setCustomObsData(prev => ({ ...prev, [opt.id]: val }))
                    }
                  />
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* ── Actions ───────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onPrevious}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </button>
        <button
          type="button"
          onClick={onSkip}
          className="px-6 py-2 border-2 border-yellow-400 text-yellow-700 font-medium rounded-lg hover:bg-yellow-50 transition-colors"
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
