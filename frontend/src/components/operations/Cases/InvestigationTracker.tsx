import { useState } from 'react';
import { Plus, Calendar, User, MessageSquare, Paperclip, Clock } from 'lucide-react';
import type { InvestigationUpdate } from './types/case.types';
import { format } from 'date-fns';

interface Props {
  caseId: string;
  currentStatus: string;
  updates: InvestigationUpdate[];
  onAddUpdate: (update: InvestigationUpdate) => void;
}

const InvestigationTracker = ({ currentStatus, updates, onAddUpdate }: Props) => {
  const [isAddingUpdate, setIsAddingUpdate] = useState(false);
  const [newUpdate, setNewUpdate] = useState({
    status: currentStatus,
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newUpdate.description.trim()) {
      alert('Please enter update description');
      return;
    }

    const update: InvestigationUpdate = {
      id: `UPDATE-${Date.now()}`,
      updateDate: new Date().toISOString(),
      updatedBy: 'Current User',
      status: newUpdate.status,
      description: newUpdate.description,
    };

    onAddUpdate(update);
    setNewUpdate({ status: currentStatus, description: '' });
    setIsAddingUpdate(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Under Investigation': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'On Hold': return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'Closed': return 'bg-green-100 text-green-800 border-green-300';
      case 'Pending': return 'bg-orange-100 text-orange-800 border-orange-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Update Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Investigation Timeline</h3>
        {!isAddingUpdate && (
          <button
            onClick={() => setIsAddingUpdate(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
            {/* Status Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Update Status
              </label>
              <select
                value={newUpdate.status}
                onChange={(e) => setNewUpdate({ ...newUpdate, status: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Open">Open</option>
                <option value="Under Investigation">Under Investigation</option>
                <option value="On Hold">On Hold</option>
                <option value="Pending">Pending</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            {/* Description */}
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

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Submit Update
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

      {/* Updates Timeline */}
      {updates.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">No investigation updates yet</p>
          <p className="text-sm text-gray-400 mt-1">Add your first update to track progress</p>
        </div>
      ) : (
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200" />

          {/* Updates List */}
          <div className="space-y-6">
            {updates.map((update, index) => (
              <div key={update.id} className="relative pl-16">
                {/* Timeline Dot */}
                <div className="absolute left-6 top-0 w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow" />

                {/* Update Card */}
                <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(update.status)}`}>
                          {update.status}
                        </span>
                        {index === 0 && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs font-medium rounded">
                            Latest
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
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

                  {/* Description */}
                  <p className="text-sm text-gray-700 whitespace-pre-wrap mb-3">
                    {update.description}
                  </p>

                  {/* Attachments */}
                  {update.attachments && update.attachments.length > 0 && (
                    <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                      <Paperclip className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-600">
                        {update.attachments.length} attachment(s)
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary Stats */}
      {updates.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{updates.length}</div>
              <div className="text-xs text-gray-600 mt-1">Total Updates</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {updates.filter(u => u.status === 'Closed').length}
              </div>
              <div className="text-xs text-gray-600 mt-1">Closed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">
                {updates.filter(u => u.status === 'Under Investigation').length}
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
