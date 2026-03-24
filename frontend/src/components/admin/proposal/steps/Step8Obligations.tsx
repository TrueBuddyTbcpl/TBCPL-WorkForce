import React, { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { ProposalObligationsResponse, ProposalObligationsRequest } from '../../../../types/proposal.types';

const DEFAULT_OBLIGATIONS = [
  'Appoint a single point of contact (POC) for interacting with the Team Lead of TBCPL.',
  'Commit appropriate resources, including the involvement of the concerned department functions during the engagement.',
  'Provide inputs/approvals within the requested timeframe.',
];

interface Props {
  data:       ProposalObligationsResponse | null;
  clientName: string;
  onSave:     (data: ProposalObligationsRequest) => void;
  isSaving:   boolean;
}

const Step8Obligations: React.FC<Props> = ({ data, clientName, onSave, isSaving }) => {
  const [points, setPoints] = useState<string[]>(DEFAULT_OBLIGATIONS);
  const [newPoint, setNewPoint] = useState('');

  useEffect(() => {
    if (data?.obligationPoints?.length) setPoints(data.obligationPoints);
  }, [data]);

  const addPoint = () => {
    if (!newPoint.trim()) return;
    setPoints(prev => [...prev, newPoint.trim()]);
    setNewPoint('');
  };

  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-gray-800">
        Special Obligations of {clientName || 'Client'}
      </h3>
      <p className="text-xs text-gray-500">Define the obligations the client must fulfil during the engagement.</p>

      <div className="space-y-2">
        {points.map((p, idx) => (
          <div key={idx} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg">
            <span className="text-blue-500 text-sm mt-0.5">•</span>
            <span className="flex-1 text-sm text-gray-700">{p}</span>
            <button type="button" onClick={() => setPoints(prev => prev.filter((_, i) => i !== idx))}
              className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input value={newPoint} onChange={e => setNewPoint(e.target.value)} placeholder="Add obligation point..."
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <button type="button" onClick={addPoint}
          className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200">
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>

      <div className="flex justify-end">
        <button onClick={() => onSave({ obligationPoints: points })} disabled={isSaving || points.length === 0}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition">
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
};

export default Step8Obligations;
