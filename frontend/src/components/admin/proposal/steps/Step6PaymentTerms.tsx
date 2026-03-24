import React, { useEffect, useState } from 'react';
import type { ProposalPaymentTermsResponse, ProposalPaymentTermsRequest } from '../../../../types/proposal.types';

const DEFAULT_TERMS = '100% payment within 45 days of submission of investigation report and TBCPL raising the Invoice.';

interface Props {
  data:     ProposalPaymentTermsResponse | null;
  onSave:   (data: ProposalPaymentTermsRequest) => void;
  isSaving: boolean;
}

const Step6PaymentTerms: React.FC<Props> = ({ data, onSave, isSaving }) => {
  const [text, setText] = useState(DEFAULT_TERMS);

  useEffect(() => {
    if (data?.paymentTermsText) setText(data.paymentTermsText);
  }, [data]);

  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-gray-800">Payment Terms</h3>
      <textarea value={text} onChange={e => setText(e.target.value)} rows={4}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
      <div className="flex justify-end">
        <button onClick={() => onSave({ paymentTermsText: text })} disabled={isSaving || !text.trim()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition">
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
};

export default Step6PaymentTerms;
