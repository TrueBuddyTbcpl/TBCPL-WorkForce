import React, { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { ProposalMethodologyResponse, ProposalMethodologyRequest } from '../../../../types/proposal.types';

type Section = { key: keyof ProposalMethodologyRequest; label: string; defaults: string[] };

const SECTIONS: Section[] = [
  {
    key: 'desktopDueDiligencePoints', label: 'Desktop & Documentary Due Diligence',
    defaults: [
      'Collect incorporation records (CIN, GST, PAN, ISO certifications)',
      'Review entity structure and promoter/proprietor details',
      'Analyse financial standing and operational presence where publicly available',
      'Assess online presence, marketplace listings, distributor connections',
    ],
  },
  {
    key: 'marketGroundIntelligencePoints', label: 'Market Ground Intelligence',
    defaults: [
      'Identify key persons associated with the suspect entity',
      'Establish discreet contact with relevant sales/operational personnel',
      'Collect intelligence on manufacturing capabilities, product range, and distribution footprint',
      'Conduct discreet enquiries through industry sources and nearby stakeholders',
    ],
  },
  {
    key: 'productVerificationPoints', label: 'Product Verification',
    defaults: [
      "Engage with the entity as prospective buyers",
      "Inquire about availability of Client's proprietary chemicals or similar formulations",
      'Identify any unauthorised offerings or suspicious product variants',
    ],
  },
  {
    key: 'testPurchasePoints', label: 'Test Purchase Procedure (If Applicable)',
    defaults: [
      'Establish a covert entity for test purchase where required',
      'Place the order in the capacity of a retailer/industrial buyer',
      'Receive the samples, ensuring chain-of-custody compliance',
      'Secure evidentiary material including invoices, packaging, transport documents',
    ],
  },
];

interface Props {
  data:     ProposalMethodologyResponse | null;
  onSave:   (data: ProposalMethodologyRequest) => void;
  isSaving: boolean;
}

const Step4Methodology: React.FC<Props> = ({ data, onSave, isSaving }) => {
  const [state, setState] = useState<ProposalMethodologyRequest>({
    desktopDueDiligencePoints:      SECTIONS[0].defaults,
    marketGroundIntelligencePoints: SECTIONS[1].defaults,
    productVerificationPoints:      SECTIONS[2].defaults,
    testPurchasePoints:             SECTIONS[3].defaults,
  });

  const [newItems, setNewItems] = useState<Record<string, string>>({});

  useEffect(() => {
    if (data) {
      setState({
        desktopDueDiligencePoints:      data.desktopDueDiligencePoints?.length      ? data.desktopDueDiligencePoints      : SECTIONS[0].defaults,
        marketGroundIntelligencePoints: data.marketGroundIntelligencePoints?.length  ? data.marketGroundIntelligencePoints  : SECTIONS[1].defaults,
        productVerificationPoints:      data.productVerificationPoints?.length       ? data.productVerificationPoints       : SECTIONS[2].defaults,
        testPurchasePoints:             data.testPurchasePoints?.length              ? data.testPurchasePoints              : SECTIONS[3].defaults,
      });
    }
  }, [data]);

  const addItem  = (key: keyof ProposalMethodologyRequest) => {
    const val = newItems[key]?.trim();
    if (!val) return;
    setState(prev => ({ ...prev, [key]: [...(prev[key] || []), val] }));
    setNewItems(prev => ({ ...prev, [key]: '' }));
  };

  const removeItem = (key: keyof ProposalMethodologyRequest, idx: number) =>
    setState(prev => ({ ...prev, [key]: prev[key].filter((_, i) => i !== idx) }));

  return (
    <div className="space-y-6">
      <h3 className="text-base font-semibold text-gray-800">Approach & Methodology</h3>

      {SECTIONS.map(section => (
        <div key={section.key} className="border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">{section.label}</h4>
          <ul className="space-y-2 mb-3">
            {(state[section.key] || []).map((point, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="text-blue-500 mt-0.5">•</span>
                <span className="flex-1">{point}</span>
                <button type="button" onClick={() => removeItem(section.key, idx)}
                  className="text-red-400 hover:text-red-600 flex-shrink-0">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </li>
            ))}
          </ul>
          <div className="flex gap-2">
            <input value={newItems[section.key] || ''}
              onChange={e => setNewItems(prev => ({ ...prev, [section.key]: e.target.value }))}
              placeholder="Add point..."
              className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <button type="button" onClick={() => addItem(section.key)}
              className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200">
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>
        </div>
      ))}

      <div className="flex justify-end">
        <button onClick={() => onSave(state)} disabled={isSaving}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition">
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
};

export default Step4Methodology;
