import React, { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import DefaultCustomToggle from '../shared/DefaultCustomToggle';
import { TextMode } from '../../../../types/proposal.types';
import type { ProposalConfidentialityResponse, ProposalConfidentialityRequest } from '../../../../types/proposal.types';

const DEFAULT_TEXT = `We require strict adherence by our management and staff to ethical rules of our profession and company. TBCPL and its people maintain complete independence of interest in relationships with clients. In all aspects of our practice, our management and staff maintain a strict standard of confidentiality towards information obtained during carrying out our professional duties and will not disclose it without prior consent of the company. The above paragraph does not apply to any information: (a) At the time of being obtained by TBCPL is already within the public domain; (b) Which subsequently comes within the public domain other than by breach by TBCPL; (c) Is acquired by TBCPL from a third party who, to the best of TBCPL's knowledge, is rightfully in possession of it and free to disclose it.`;

interface Props {
  data:     ProposalConfidentialityResponse | null;
  onSave:   (data: ProposalConfidentialityRequest) => void;
  isSaving: boolean;
}

const Step7Confidentiality: React.FC<Props> = ({ data, onSave, isSaving }) => {
  const [mode, setMode]           = useState<TextMode>(TextMode.DEFAULT);
  const [text, setText]           = useState(DEFAULT_TEXT);
  const [customPoints, setCustomPoints] = useState<string[]>([]);
  const [newPoint, setNewPoint]   = useState('');

  useEffect(() => {
    if (data) {
      setMode(data.paragraphMode || TextMode.DEFAULT);
      setText(data.paragraphText || DEFAULT_TEXT);
      setCustomPoints(data.customPoints || []);
    }
  }, [data]);

  const handleModeChange = (m: TextMode) => {
    setMode(m);
    if (m === TextMode.DEFAULT) setText(DEFAULT_TEXT);
  };

  const addPoint = () => {
    if (!newPoint.trim()) return;
    setCustomPoints(prev => [...prev, newPoint.trim()]);
    setNewPoint('');
  };

  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-gray-800">Confidentiality</h3>
      <DefaultCustomToggle mode={mode} onChange={handleModeChange} />
      <textarea value={text} readOnly={mode === TextMode.DEFAULT} onChange={e => setText(e.target.value)} rows={7}
        className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none
          ${mode === TextMode.DEFAULT ? 'bg-gray-50 text-gray-600 cursor-not-allowed border-gray-200' : 'border-gray-300'}`} />

      {/* Custom Points */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Additional Custom Points</h4>
        <ul className="space-y-2 mb-3">
          {customPoints.map((p, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
              <span className="text-blue-500 mt-0.5">•</span>
              <span className="flex-1">{p}</span>
              <button type="button" onClick={() => setCustomPoints(prev => prev.filter((_, i) => i !== idx))}
                className="text-red-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
            </li>
          ))}
        </ul>
        <div className="flex gap-2">
          <input value={newPoint} onChange={e => setNewPoint(e.target.value)} placeholder="Add custom point..."
            className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <button type="button" onClick={addPoint}
            className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded text-sm hover:bg-gray-200">
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={() => onSave({ paragraphMode: mode, paragraphText: text, customPoints })} disabled={isSaving}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition">
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
};

export default Step7Confidentiality;
