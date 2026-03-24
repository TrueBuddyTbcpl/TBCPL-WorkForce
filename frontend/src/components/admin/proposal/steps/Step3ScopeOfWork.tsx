import React, { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { ProposalScopeResponse, ProposalScopeRequest, ScopeItemDto } from '../../../../types/proposal.types';

const DEFAULT_SCOPES: ScopeItemDto[] = [
  { key: 'incorporation',    label: 'Verification of incorporation and statutory registration details', isPredefined: true, selected: true },
  { key: 'business_activity',label: 'Assessment of business activities and nature of operations',       isPredefined: true, selected: true },
  { key: 'operations',       label: 'Evaluation of operational capabilities including manufacturing, warehousing, and distribution', isPredefined: true, selected: true },
  { key: 'product_portfolio',label: 'Identification of product portfolio with focus on Client\'s proprietary products', isPredefined: true, selected: true },
  { key: 'offering_check',   label: 'Verification of whether the suspect entity is offering proprietary chemicals', isPredefined: true, selected: true },
  { key: 'test_purchase',    label: 'Conducting a test purchase, if such products are found to be offered', isPredefined: true, selected: false },
  { key: 'evidence',         label: 'Securing evidence documents, packaging, invoices, communication if applicable', isPredefined: true, selected: false },
  { key: 'report',           label: 'Drafting and submitting a detailed due diligence report', isPredefined: true, selected: true },
];

interface Props {
  data:     ProposalScopeResponse | null;
  onSave:   (data: ProposalScopeRequest) => void;
  isSaving: boolean;
}

const Step3ScopeOfWork: React.FC<Props> = ({ data, onSave, isSaving }) => {
  const [items, setItems]       = useState<ScopeItemDto[]>(DEFAULT_SCOPES);
  const [customLabel, setCustomLabel] = useState('');

  useEffect(() => {
    if (data?.scopeItems?.length) setItems(data.scopeItems);
  }, [data]);

  const toggle = (key: string) =>
    setItems(prev => prev.map(i => i.key === key ? { ...i, selected: !i.selected } : i));

  const addCustom = () => {
    if (!customLabel.trim()) return;
    setItems(prev => [...prev, { key: `custom_${Date.now()}`, label: customLabel.trim(), isPredefined: false, selected: true }]);
    setCustomLabel('');
  };

  const removeItem = (key: string) =>
    setItems(prev => prev.filter(i => i.key !== key));

  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-gray-800">Scope of Work</h3>
      <p className="text-xs text-gray-500">Select the scope items applicable to this proposal. Add custom items if needed.</p>

      <div className="space-y-2">
        {items.map(item => (
          <div key={item.key} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
            <input type="checkbox" checked={item.selected} onChange={() => toggle(item.key)}
              className="mt-0.5 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
            <span className="flex-1 text-sm text-gray-700">{item.label}</span>
            {!item.isPredefined && (
              <button type="button" onClick={() => removeItem(item.key)} className="text-red-400 hover:text-red-600">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input value={customLabel} onChange={e => setCustomLabel(e.target.value)}
          placeholder="Add custom scope item..."
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <button type="button" onClick={addCustom}
          className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition">
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>

      <div className="flex justify-end">
        <button onClick={() => onSave({ scopeItems: items })} disabled={isSaving}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition">
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
};

export default Step3ScopeOfWork;
