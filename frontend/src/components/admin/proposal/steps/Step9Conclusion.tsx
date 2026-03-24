import React, { useEffect, useState } from 'react';
import DefaultCustomToggle from '../shared/DefaultCustomToggle';
import { TextMode } from '../../../../types/proposal.types';
import type { ProposalConclusionResponse, ProposalConclusionRequest } from '../../../../types/proposal.types';

interface Props {
  data:       ProposalConclusionResponse | null;
  clientName: string;
  onSave:     (data: ProposalConclusionRequest) => void;
  isSaving:   boolean;
}

const Step9Conclusion: React.FC<Props> = ({ data, clientName, onSave, isSaving }) => {
  const defaultText = `TBCPL thanks ${clientName || 'the Client'} for reposing trust and assure you of our management's whole-hearted commitment to the project. We request you to indicate your concurrence with scope of work and terms and conditions of service delivery indicated in this proposal.`;

  const [mode, setMode] = useState<TextMode>(TextMode.DEFAULT);
  const [text, setText] = useState(defaultText);

  useEffect(() => {
    if (data) {
      setMode(data.paragraphMode || TextMode.DEFAULT);
      setText(data.paragraphText || defaultText);
    }
  }, [data, clientName]);

  const handleModeChange = (m: TextMode) => {
    setMode(m);
    if (m === TextMode.DEFAULT) setText(defaultText);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-gray-800">Conclusion</h3>
      <DefaultCustomToggle mode={mode} onChange={handleModeChange} />
      <textarea value={text} readOnly={mode === TextMode.DEFAULT} onChange={e => setText(e.target.value)} rows={5}
        className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none
          ${mode === TextMode.DEFAULT ? 'bg-gray-50 text-gray-600 cursor-not-allowed border-gray-200' : 'border-gray-300'}`} />
      <div className="flex justify-end">
        <button onClick={() => onSave({ paragraphMode: mode, paragraphText: text })} disabled={isSaving}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition">
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
};

export default Step9Conclusion;
