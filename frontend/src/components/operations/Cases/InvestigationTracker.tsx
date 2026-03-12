import { useState } from 'react';
import { Plus, Calendar, User, MessageSquare, Clock, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import apiClient from '../../../services/api/apiClient';
import type { CaseUpdate, AddCaseUpdateRequest } from './types/case.types';
import { useAuthStore } from '../../../stores/authStore';

interface Props {
  caseId: number;
  currentStatus: string;
  updates: CaseUpdate[];
  onUpdateAdded: () => void;
}

const InvestigationTracker = ({ caseId, currentStatus, updates, onUpdateAdded }: Props) => {
  const { user } = useAuthStore();
  const [isAddingUpdate, setIsAddingUpdate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newUpdate, setNewUpdate] = useState<AddCaseUpdateRequest>({
    status: currentStatus,
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newUpdate.description.trim()) {
      toast.error('Please enter update description');
      return;
    }

    try {
      setIsSubmitting(true);
      await apiClient.post(
        `/operation/cases/${caseId}/updates`,
        newUpdate,
        {
          headers: {
            'X-Username': user?.empId || user?.fullName || 'unknown',
          },
        }
      );
      toast.success('Update added successfully');
      setNewUpdate({ status: currentStatus, description: '' });
      setIsAddingUpdate(false);
      onUpdateAdded();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add update');
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Investigation Timeline</h3>
        {!isAddingUpdate && (
          <button
            onClick={() => setIsAddingUpdate(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Update
          </button>
        )}
      </div>

      {/* Add Update Form */}
      {isAddingUpdate && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Add Investigation Update</h4>
          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Update Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={newUpdate.description}
                onChange={(e) => setNewUpdate({ ...newUpdate, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe the progress, findings, or actions taken..."
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isSubmitting ? 'Submitting...' : 'Submit Update'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAddingUpdate(false);
                  setNewUpdate({ status: currentStatus, description: '' });
                }}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Timeline */}
      {updates.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">No investigation updates yet</p>
          <p className="text-sm text-gray-400 mt-1">Add your first update to track progress</p>
        </div>
      ) : (
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200" />
          <div className="space-y-6">
            {updates.map((update, index) => (
              <div key={update.id} className="relative pl-16">
                <div className="absolute left-6 top-0 w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow" />
                <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {index === 0 && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs font-medium rounded">
                            Latest
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{update.updatedBy}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{format(new Date(update.updateDate), 'dd MMM yyyy')}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{format(new Date(update.updateDate), 'hh:mm a')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{update.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary */}
      {updates.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{updates.length}</div>
              <div className="text-xs text-gray-600 mt-1">Total Updates</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {updates.filter((u) => u.status?.toLowerCase() === 'closed').length}
              </div>
              <div className="text-xs text-gray-600 mt-1">Closed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">
                {updates.filter((u) => u.status?.toLowerCase() === 'in-progress').length}
              </div>
              <div className="text-xs text-gray-600 mt-1">In Progress</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvestigationTracker;
