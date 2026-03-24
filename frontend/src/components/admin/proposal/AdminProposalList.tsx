import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye, Trash2, FileText } from 'lucide-react';
import { useProposals, useDeleteProposal } from '../../../hooks/useProposal';
import ProposalStatusBadge from './shared/ProposalStatusBadge';

const AdminProposalList: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const { data, isLoading } = useProposals(page, 10);
  const deleteMutation = useDeleteProposal();
  const proposals = data?.data?.content || [];
  const totalPages = data?.data?.totalPages || 0;

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this proposal?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Proposals</h2>
          <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">
            {data?.data?.totalElements || 0} total
          </span>
        </div>
        <button onClick={() => navigate('/admin/proposals/create')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">
          <Plus className="w-4 h-4" /> New Proposal
        </button>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center h-48 text-gray-500 text-sm">Loading proposals...</div>
      ) : proposals.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 text-gray-400">
          <FileText className="w-10 h-10 mb-2 opacity-30" />
          <p className="text-sm">No proposals found</p>
          <button onClick={() => navigate('/admin/proposals/create')}
            className="mt-3 text-blue-600 text-sm hover:underline">Create your first proposal</button>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Code', 'Client', 'Suspect Entity', 'Service Type', 'Date', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {proposals.map(p => (
                  <tr key={p.proposalId} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 font-mono text-xs text-blue-600 font-semibold">{p.proposalCode}</td>
                    <td className="px-4 py-3 text-gray-800">{p.clientName}</td>
                    <td className="px-4 py-3 text-gray-600">{p.suspectEntityName || '—'}</td>
                    <td className="px-4 py-3 text-gray-600 max-w-[160px] truncate">{p.serviceTypeDisplayName}</td>
                    <td className="px-4 py-3 text-gray-500">{p.proposalDate}</td>
                    <td className="px-4 py-3"><ProposalStatusBadge status={p.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => navigate(`/admin/proposals/${p.proposalId}/preview`)}
                          className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition" title="Preview">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => navigate(`/admin/proposals/${p.proposalId}/edit`)}
                          className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded transition" title="Edit">
                          <FileText className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(p.proposalId)}
                          className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-gray-200">
              <p className="text-xs text-gray-500">Page {page + 1} of {totalPages}</p>
              <div className="flex gap-2">
                <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
                  className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50">Previous</button>
                <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
                  className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50">Next</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminProposalList;
