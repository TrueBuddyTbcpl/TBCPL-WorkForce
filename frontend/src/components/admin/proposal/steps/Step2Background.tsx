import React, { useEffect, useState } from 'react';
import DefaultCustomToggle from '../shared/DefaultCustomToggle';
import { TextMode } from '../../../../types/proposal.types';
import type { ProposalBackgroundResponse, ProposalBackgroundRequest } from '../../../../types/proposal.types';

const DEFAULT_TEXT = `The Client Company has raised concerns regarding the possibility of unauthorized entities manufacturing, distributing, or supplying its proprietary products. In light of these concerns, the Client intends to verify the legitimacy and business practices of the suspect entity. To address this requirement, the Client has engaged True Buddy Consulting Private Limited to conduct an independent and discreet due diligence investigation. This proposal outlines the scope, methodology, and commercial terms for conducting the above due diligence exercise.`;

interface Props {
  data:     ProposalBackgroundResponse | null;
  onSave:   (data: ProposalBackgroundRequest) => void;
  isSaving: boolean;
}

const Step2Background: React.FC<Props> = ({ data, onSave, isSaving }) => {
  const [mode, setMode]   = useState<TextMode>(TextMode.DEFAULT);
  const [text, setText]   = useState(DEFAULT_TEXT);

  useEffect(() => {
    if (data) {
      setMode(data.mode || TextMode.DEFAULT);
      setText(data.backgroundText || DEFAULT_TEXT);
    }
  }, [data]);

  const handleModeChange = (m: TextMode) => {
    setMode(m);
    if (m === TextMode.DEFAULT) setText(DEFAULT_TEXT);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-gray-800">Background</h3>
      <DefaultCustomToggle mode={mode} onChange={handleModeChange} />
      <textarea
        value={text}
        readOnly={mode === TextMode.DEFAULT}
        onChange={(e) => setText(e.target.value)}
        rows={8}
        className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none
          ${mode === TextMode.DEFAULT ? 'bg-gray-50 text-gray-600 cursor-not-allowed border-gray-200' : 'border-gray-300'}`}
      />
      <div className="flex justify-end">
        <button onClick={() => onSave({ mode, backgroundText: text })} disabled={isSaving}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition">
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
};

export default Step2Background;
