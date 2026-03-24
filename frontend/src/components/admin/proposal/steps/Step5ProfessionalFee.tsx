import React, { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { ProposalFeeResponse, ProposalFeeRequest, FeeComponentDto } from '../../../../types/proposal.types';

interface Props {
  data:     ProposalFeeResponse | null;
  onSave:   (data: ProposalFeeRequest) => void;
  isSaving: boolean;
}

const DEFAULT_COMPONENTS: FeeComponentDto[] = [
  { type: 'TEST_PURCHASE_FEE', label: 'Professional Fee per Test Purchase',       amount: 45000, isActuals: false },
  { type: 'SAMPLE_COST',       label: 'Cost of sample: To be borne by the Client at actuals', amount: null,  isActuals: true },
  { type: 'APPLICABLE_TAXES',  label: 'Applicable taxes: To be borne by the Client',           amount: null,  isActuals: true },
  { type: 'SHIPPING',          label: 'Shipping charges of material evidence: At actuals, borne by the Client', amount: null, isActuals: true },
];

const DEFAULT_CONDITIONS = [
  'If product/sample cost is below INR 50,000, True Buddy will purchase the sample directly and reimburse the cost to Client.',
  'If product/sample cost exceeds INR 50,000, True Buddy will raise an advance invoice for the sample cost and initiate the purchase only after receipt of payment.',
];

const Step5ProfessionalFee: React.FC<Props> = ({ data, onSave, isSaving }) => {
  const [ddFee, setDdFee]             = useState<string>('130000');
  const [components, setComponents]   = useState<FeeComponentDto[]>(DEFAULT_COMPONENTS);
  const [conditions, setConditions]   = useState<string[]>(DEFAULT_CONDITIONS);
  const [newCondition, setNewCondition] = useState('');

  useEffect(() => {
    if (data) {
      setDdFee(data.dueDiligenceFeeAmount?.toString() || '');
      if (data.feeComponents?.length)  setComponents(data.feeComponents);
      if (data.specialConditions?.length) setConditions(data.specialConditions);
    }
  }, [data]);

  const updateComponent = (idx: number, field: keyof FeeComponentDto, val: any) =>
    setComponents(prev => prev.map((c, i) => i === idx ? { ...c, [field]: val } : c));

  const removeComponent = (idx: number) =>
    setComponents(prev => prev.filter((_, i) => i !== idx));

  const addCondition = () => {
    if (!newCondition.trim()) return;
    setConditions(prev => [...prev, newCondition.trim()]);
    setNewCondition('');
  };

  return (
    <div className="space-y-6">
      <h3 className="text-base font-semibold text-gray-800">Professional Fee</h3>

      {/* Due Diligence Fee */}
      <div className="border border-gray-200 rounded-lg p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Due Diligence Fee (INR) <span className="text-red-500">*</span>
        </label>
        <div className="relative w-64">
          <span className="absolute left-3 top-2 text-gray-500 text-sm">₹</span>
          <input type="number" value={ddFee} onChange={e => setDdFee(e.target.value)}
            className="w-full pl-7 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      {/* Fee Components */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Additional Fee Components</h4>
        <div className="space-y-3">
          {components.map((comp, idx) => (
            <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <p className="text-sm text-gray-700">{comp.label}</p>
                {!comp.isActuals && (
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-gray-500 text-xs">₹</span>
                    <input type="number" value={comp.amount ?? ''} onChange={e => updateComponent(idx, 'amount', parseFloat(e.target.value))}
                      className="w-32 border border-gray-300 rounded px-2 py-1 text-xs" />
                  </div>
                )}
                {comp.isActuals && <p className="text-xs text-gray-400 mt-0.5">At actuals</p>}
              </div>
              <button type="button" onClick={() => removeComponent(idx)} className="text-red-400 hover:text-red-600">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Special Conditions */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Special Conditions</h4>
        <ul className="space-y-2 mb-3">
          {conditions.map((c, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
              <span className="text-blue-500 mt-0.5">•</span>
              <span className="flex-1">{c}</span>
              <button type="button" onClick={() => setConditions(prev => prev.filter((_, i) => i !== idx))}
                className="text-red-400 hover:text-red-600 flex-shrink-0">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </li>
          ))}
        </ul>
        <div className="flex gap-2">
          <input value={newCondition} onChange={e => setNewCondition(e.target.value)}
            placeholder="Add special condition..."
            className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <button type="button" onClick={addCondition}
            className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded text-sm hover:bg-gray-200">
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={() => onSave({ dueDiligenceFeeAmount: parseFloat(ddFee), feeComponents: components, specialConditions: conditions })}
          disabled={isSaving || !ddFee}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition">
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
};

export default Step5ProfessionalFee;
