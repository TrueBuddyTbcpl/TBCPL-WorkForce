import React from 'react';
import { TextMode } from '../../../../types/proposal.types';

interface Props {
  mode:     TextMode;
  onChange: (mode: TextMode) => void;
  disabled?: boolean;
}

const DefaultCustomToggle: React.FC<Props> = ({ mode, onChange, disabled }) => (
  <div className="flex gap-2 mb-3">
    {(['DEFAULT', 'CUSTOM'] as TextMode[]).map((m) => (
      <button
        key={m}
        type="button"
        disabled={disabled}
        onClick={() => onChange(m)}
        className={`px-4 py-1.5 rounded-full text-sm font-medium border transition
          ${mode === m
            ? 'bg-blue-600 text-white border-blue-600'
            : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        {m === 'DEFAULT' ? 'Default' : 'Custom'}
      </button>
    ))}
  </div>
);

export default DefaultCustomToggle;
