import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useAuthStore } from '../../../../../stores/authStore';
import apiClient from '../../../../../services/api/apiClient';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import { useUpdateStep } from '../../../../../hooks/prereport/useUpdateStep';
import { clientLeadStep4Schema } from '../../../../../schemas/prereport.schemas';
import { LeadType, VerificationStatus } from '../../../../../utils/constants';
import type { ClientLeadStep4Input } from '../../../../../schemas/prereport.schemas';
import type { ClientLeadData } from '../../../../../types/prereport.types';

interface Step4VerificationProps {
  prereportId: number;
  reportId: string;
  data?: ClientLeadData | null;
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
}

interface CustomOption { id: number; optionName: string; }
interface CustomVerifEntry { status: string; notes: string; }

export const Step4Verification = ({
  prereportId,
  reportId,
  data,
  onNext,
  onPrevious,
  onSkip,
}: Step4VerificationProps) => {
  const updateMutation = useUpdateStep();
  const { user } = useAuthStore();

  const canDelete =
    (user?.roleName === 'ADMIN' || user?.roleName === 'SUPER_ADMIN') &&
    user?.departmentName === 'Admin';

  // ── Custom Options State ───────────────────────────────────────────────────
  const [customOptions, setCustomOptions] = useState<CustomOption[]>([]);
  const [loadingOpts, setLoadingOpts] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [addingOpt, setAddingOpt] = useState(false);

  // ── Add-form fields ────────────────────────────────────────────────────────
  const [newOptName, setNewOptName] = useState('');
  const [newOptStatus, setNewOptStatus] = useState<string>(VerificationStatus.NOT_DONE);
  const [newOptNotes, setNewOptNotes] = useState('');   // ← ADDED

  // ── Per-option status + notes, keyed by optionId ──────────────────────────
  const [customVerifData, setCustomVerifData] = useState<Record<number, CustomVerifEntry>>(() => {
    const map: Record<number, CustomVerifEntry> = {};
    data?.verificationCustomData?.forEach((e: any) => {
      map[e.optionId] = { status: e.status, notes: e.notes ?? '' };
    });
    return map;
  });

  // ── Load custom options on mount ───────────────────────────────────────────
  useEffect(() => {
    apiClient.get('/operation/prereport/custom-options?stepNumber=4&leadType=CLIENT_LEAD')
      .then(res => {
        const opts: CustomOption[] = res.data.data ?? [];
        setCustomOptions(opts);
        setCustomVerifData(prev => {
          const next = { ...prev };
          opts.forEach(opt => {
            if (!next[opt.id]) {
              next[opt.id] = { status: VerificationStatus.NOT_DONE, notes: '' };
            }
          });
          return next;
        });
      })
      .catch(() => toast.error('Failed to load custom options'))
      .finally(() => setLoadingOpts(false));
  }, []);

  useEffect(() => {
    if (!data?.verificationCustomData?.length) return;

    setCustomVerifData(prev => {
      const next = { ...prev };
      data.verificationCustomData!.forEach((e: any) => {
        next[e.optionId] = { status: e.status, notes: e.notes ?? '' };
      });
      return next;
    });
  }, [data?.verificationCustomData]);
  // ── Reset add form ─────────────────────────────────────────────────────────
  const resetAddForm = () => {
    setNewOptName('');
    setNewOptStatus(VerificationStatus.NOT_DONE);
    setNewOptNotes('');   // ← ADDED
    setShowAddForm(false);
  };

  // ── Add new custom option ──────────────────────────────────────────────────
  const handleAddOption = async () => {
    if (!newOptName.trim()) return;
    setAddingOpt(true);
    try {
      const res = await apiClient.post('/operation/prereport/custom-options', {
        stepNumber: 4,
        optionName: newOptName.trim(),
        leadType: LeadType.CLIENT_LEAD,
      });
      const newOpt: CustomOption = res.data.data;
      setCustomOptions(prev => [...prev, newOpt]);

      setCustomVerifData(prev => ({
        ...prev,
        [newOpt.id]: { status: newOptStatus, notes: newOptNotes },  // ← ADDED newOptNotes
      }));

      resetAddForm();
      toast.success('Custom verification item added');
    } catch {
      toast.error('Failed to add option');
    } finally {
      setAddingOpt(false);
    }
  };

  // ── Delete custom option ───────────────────────────────────────────────────
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
      toast.error('Failed to delete item');
    } finally {
      setDeletingId(null);
    }
  };

  // ── React Hook Form ────────────────────────────────────────────────────────
  const { register, handleSubmit } = useForm<ClientLeadStep4Input>({
    resolver: zodResolver(clientLeadStep4Schema),
    defaultValues: {
      verificationClientDiscussion: data?.verificationClientDiscussion || VerificationStatus.NOT_DONE,
      verificationClientDiscussionNotes: data?.verificationClientDiscussionNotes || '',
      verificationOsint: data?.verificationOsint || VerificationStatus.NOT_DONE,
      verificationOsintNotes: data?.verificationOsintNotes || '',
      verificationMarketplace: data?.verificationMarketplace || VerificationStatus.NOT_DONE,
      verificationMarketplaceNotes: data?.verificationMarketplaceNotes || '',
      verificationPretextCalling: data?.verificationPretextCalling || VerificationStatus.NOT_DONE,
      verificationPretextCallingNotes: data?.verificationPretextCallingNotes || '',
      verificationProductReview: data?.verificationProductReview || VerificationStatus.NOT_DONE,
      verificationProductReviewNotes: data?.verificationProductReviewNotes || '',
    },
  });

  const onSubmit = async (formData: ClientLeadStep4Input) => {
    try {
      await updateMutation.mutateAsync({
        prereportId,
        stepNumber: 4,
        data: {
          ...formData,
          verificationCustomData: Object.entries(customVerifData).map(([id, val]) => ({
            optionId: Number(id),
            status: val.status,
            notes: val.notes,
          })),
        },
        leadType: LeadType.CLIENT_LEAD,
        reportId,
      });
      onNext();
    } catch (error) {
      console.error('Error saving step:', error);
    }
  };

  const verificationItems = [
    { name: 'Case Discussion with Client Team', statusField: 'verificationClientDiscussion', notesField: 'verificationClientDiscussionNotes' },
    { name: 'Internet / OSINT Search', statusField: 'verificationOsint', notesField: 'verificationOsintNotes' },
    { name: 'Marketplace Verification (IndiaMART / Social Media)', statusField: 'verificationMarketplace', notesField: 'verificationMarketplaceNotes' },
    { name: 'Pretext Calling (if applicable)', statusField: 'verificationPretextCalling', notesField: 'verificationPretextCallingNotes' },
    { name: 'Preliminary Product Image Review', statusField: 'verificationProductReview', notesField: 'verificationProductReviewNotes' },
  ] as const;

  const formatStatus = (s: string) =>
    s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

      {/* ── Fixed Verification Items ─────────────────────────────────────── */}
      {verificationItems.map((item) => (
        <div key={item.statusField} className="p-4 border border-gray-300 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-3">{item.name}</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                {...register(item.statusField as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {Object.values(VerificationStatus).map((s) => (
                  <option key={s} value={s}>{formatStatus(s)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                {...register(item.notesField as any)}
                rows={3}
                placeholder="Enter verification notes"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      ))}

      {/* ── Custom Verification Items ─────────────────────────────────────── */}
      <div className="border-t border-dashed border-gray-300 pt-5">

        {/* Section header */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-gray-600">Custom Verification Items</p>
          <button
            type="button"
            onClick={() => setShowAddForm(s => !s)}
            className="flex items-center gap-1 text-xs px-3 py-1.5 bg-indigo-50
                       text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-100"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Custom Item
          </button>
        </div>

        {/* ── Inline Add Form ─────────────────────────────────────────────── */}
        {showAddForm && (
          <div className="mb-4 p-4 border border-indigo-200 bg-indigo-50 rounded-lg space-y-3">
            <p className="text-xs font-semibold text-indigo-700 uppercase tracking-wide">
              New Custom Verification Item
            </p>

            {/* Verification Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Verification Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newOptName}
                onChange={e => setNewOptName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddOption())}
                placeholder="e.g. Physical Market Visit"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg
                           focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={newOptStatus}
                onChange={e => setNewOptStatus(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg
                           focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                {Object.values(VerificationStatus).map(s => (
                  <option key={s} value={s}>{formatStatus(s)}</option>
                ))}
              </select>
            </div>

            {/* Notes ← ADDED */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                value={newOptNotes}
                onChange={e => setNewOptNotes(e.target.value)}
                rows={3}
                placeholder="Enter verification notes"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg
                           focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleAddOption}
                disabled={addingOpt || !newOptName.trim()}
                className="px-4 py-1.5 bg-indigo-600 text-white text-sm rounded-lg
                           hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed
                           flex items-center gap-1.5"
              >
                {addingOpt ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {addingOpt ? 'Saving...' : 'Save Item'}
              </button>
              <button
                type="button"
                onClick={resetAddForm}
                className="px-4 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Loading state */}
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

        {/* ── Saved Custom Option Cards ──────────────────────────────────── */}
        {!loadingOpts && customOptions.map(opt => (
          <div
            key={opt.id}
            className="p-4 border border-indigo-200 bg-indigo-50 rounded-lg mb-3"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900">{opt.optionName}</h3>
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

            <div className="space-y-3">
              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={customVerifData[opt.id]?.status ?? VerificationStatus.NOT_DONE}
                  onChange={e =>
                    setCustomVerifData(prev => ({
                      ...prev,
                      [opt.id]: { ...prev[opt.id], status: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg
                             focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {Object.values(VerificationStatus).map(s => (
                    <option key={s} value={s}>{formatStatus(s)}</option>
                  ))}
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={customVerifData[opt.id]?.notes ?? ''}
                  onChange={e =>
                    setCustomVerifData(prev => ({
                      ...prev,
                      [opt.id]: { ...prev[opt.id], notes: e.target.value },
                    }))
                  }
                  rows={3}
                  placeholder="Enter verification notes"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg
                             focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Actions ────────────────────────────────────────────────────────── */}
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
            <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</>
          ) : (
            <>Save & Continue <ArrowRight className="w-4 h-4" /></>
          )}
        </button>
      </div>
    </form>
  );
};

export default Step4Verification;