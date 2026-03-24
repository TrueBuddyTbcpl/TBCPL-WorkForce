import React from 'react';
import { PROPOSAL_STATUS_LABELS, PROPOSAL_STATUS_COLORS } from '../../../../utils/constants';

interface Props { status: string; }

const ProposalStatusBadge: React.FC<Props> = ({ status }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${PROPOSAL_STATUS_COLORS[status] || 'bg-gray-100 text-gray-800'}`}>
    {PROPOSAL_STATUS_LABELS[status] || status}
  </span>
);

export default ProposalStatusBadge;
