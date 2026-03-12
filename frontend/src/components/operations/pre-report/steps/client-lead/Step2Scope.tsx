import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useAuthStore } from '../../../../../stores/authStore';
import apiClient from '../../../../../services/api/apiClient';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import { useUpdateStep } from '../../../../../hooks/prereport/useUpdateStep';
import { clientLeadStep2Schema } from '../../../../../schemas/prereport.schemas';
import { LeadType } from '../../../../../utils/constants';
import type { ClientLeadStep2Input } from '../../../../../schemas/prereport.schemas';
import type { ClientLeadData } from '../../../../../types/prereport.types';

interface Step2ScopeProps {
  prereportId: number;
  reportId: string;
  data: ClientLeadData | null | undefined;
  onNext: (stepData?: any) => Promise<void>;
  onPrevious: () => Promise<void>;
  onSkip?: () => Promise<void> | void; // ✅ add this line
}


export const Step2Scope = ({
  prereportId,
  reportId,
  data,
  onNext,
  onPrevious,
  onSkip,
}: Step2ScopeProps) => {
  const updateMutation = useUpdateStep();
  // ── Custom Options State ───────────────────────────────────────────────────
const { user } = useAuthStore();
const canDelete =
  (user?.roleName === 'ADMIN' || user?.roleName === 'SUPER_ADMIN') &&
  user?.departmentName === 'Admin';

const [customOptions,   setCustomOptions]   = useState<{ id: number; optionName: string }[]>([]);
const [loadingOpts,     setLoadingOpts]     = useState(true);
const [showAddForm,     setShowAddForm]     = useState(false);
const [newOptName,      setNewOptName]      = useState('');
const [addingOpt,       setAddingOpt]       = useState(false);
const [deletingId,      setDeletingId]      = useState<number | null>(null);
const [checkedCustomIds, setCheckedCustomIds] = useState<number[]>(
  data?.scopeCustomIds ?? []
);

useEffect(() => {
  apiClient.get('/operation/prereport/custom-options?stepNumber=2&leadType=CLIENT_LEAD')
    .then(res => setCustomOptions(res.data.data ?? []))
    .catch(() => toast.error('Failed to load custom options'))
    .finally(() => setLoadingOpts(false));
}, []);

const handleAddOption = async () => {
  if (!newOptName.trim()) return;
  setAddingOpt(true);
  try {
    const res = await apiClient.post('/operation/prereport/custom-options', {
      stepNumber: 2,
      optionName: newOptName.trim(),
      leadType: LeadType.CLIENT_LEAD
    });
    setCustomOptions(prev => [...prev, res.data.data]);
    setNewOptName('');
    setShowAddForm(false);
    toast.success('Custom option added');
  } catch {
    toast.error('Failed to add option');
  } finally {
    setAddingOpt(false);
  }
};

const handleDeleteOption = async (id: number) => {
  if (!window.confirm('Delete this custom option permanently?')) return;
  setDeletingId(id);
  try {
    await apiClient.delete(`/operation/prereport/custom-options/${id}`);
    setCustomOptions(prev => prev.filter(o => o.id !== id));
    setCheckedCustomIds(prev => prev.filter(x => x !== id));
    toast.success('Option deleted');
  } catch {
    toast.error('Failed to delete option');
  } finally {
    setDeletingId(null);
  }
};


  const {
    register,
    handleSubmit,
  } = useForm<ClientLeadStep2Input>({
    resolver: zodResolver(clientLeadStep2Schema),
    defaultValues: {
      scopeDueDiligence: data?.scopeDueDiligence || false,
      scopeIprRetailer: data?.scopeIprRetailer || false,
      scopeIprSupplier: data?.scopeIprSupplier || false,
      scopeIprManufacturer: data?.scopeIprManufacturer || false,
      scopeOnlinePurchase: data?.scopeOnlinePurchase || false,
      scopeOfflinePurchase: data?.scopeOfflinePurchase || false,
      scopeCustomIds: data?.scopeCustomIds || [],
    },
  });

  const onSubmit = async (formData: ClientLeadStep2Input) => {
    try {
      await updateMutation.mutateAsync({
        prereportId,
        stepNumber: 2,
        data: { ...formData, scopeCustomIds: checkedCustomIds },
        leadType: LeadType.CLIENT_LEAD,
        reportId,
      });
      onNext();
    } catch (error) {
      console.error('Error saving step:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-3">
        <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
          <input
            type="checkbox"
            {...register('scopeDueDiligence')}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-gray-700">Due Diligence</span>
        </label>

        <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
          <input
            type="checkbox"
            {...register('scopeIprRetailer')}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-gray-700">IPR - Retailer/ Wholesaler</span>
        </label>

        <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
          <input
            type="checkbox"
            {...register('scopeIprSupplier')}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-gray-700">IPR - Supplier</span>
        </label>

        <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
          <input
            type="checkbox"
            {...register('scopeIprManufacturer')}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-gray-700">IPR - Manufacturer / Packager / Warehouse</span>
        </label>

        <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
          <input
            type="checkbox"
            {...register('scopeOnlinePurchase')}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-gray-700">Online Sample Purchase</span>
        </label>

        <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
          <input
            type="checkbox"
            {...register('scopeOfflinePurchase')}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-gray-700">Offline Sample Purchase</span>
        </label>
      </div>

            {/* ── Custom Options Section ────────────────────────────────────────── */}
      <div className="border-t border-dashed border-gray-300 pt-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-gray-600">Custom Scope Options</p>
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

        {/* Inline add form */}
        {showAddForm && (
          <div className="flex items-center gap-2 mb-3">
            <input
              type="text"
              value={newOptName}
              onChange={e => setNewOptName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddOption())}
              placeholder="Enter option name..."
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

        {/* Custom option list */}
        {loadingOpts ? (
          <div className="flex items-center gap-2 text-sm text-gray-400 py-2">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading...
          </div>
        ) : customOptions.length === 0 && !showAddForm ? (
          <p className="text-xs text-gray-400 italic py-1">
            No custom options yet. Click "Add Custom Option" to create one.
          </p>
        ) : (
          <div className="space-y-2">
            {customOptions.map(opt => (
              <div
                key={opt.id}
                className="flex items-center justify-between p-3 border border-indigo-100
                           bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
              >
                <label className="flex items-center gap-3 cursor-pointer flex-1">
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
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-800">{opt.optionName}</span>
                </label>

                {/* Delete — Admin dept + Admin/SuperAdmin role only */}
                {canDelete && (
                  <button
                    type="button"
                    onClick={() => handleDeleteOption(opt.id)}
                    disabled={deletingId === opt.id}
                    className="ml-2 p-1 text-gray-300 hover:text-red-500 transition-colors flex-shrink-0"
                    title="Delete option (Admin only)"
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

export default Step2Scope;