import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Eye, Download, Loader2} from 'lucide-react';
import { useFieldAssociateLoaList } from '../../../hooks/loa/useLoa';
import { loaApi } from '../../../services/api/loaApi';
import { useAuthStore } from '../../../stores/authStore';
import { toast } from 'sonner';

const STATUS_STYLES = {
  DRAFT:     'bg-yellow-100 text-yellow-800',
  FINALIZED: 'bg-green-100 text-green-800',
};

const FieldAssociateLoaList: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [page, setPage] = useState(0);

  // user.id holds the numeric DB id — adjust field name if your UserInfo differs
  const employeeId = (user as any)?.id ?? 0;

  const { loas, totalPages, loading } = useFieldAssociateLoaList(employeeId, page, 10);

  const handleDownload = async (id: number, loaNumber: string) => {
    try {
      await loaApi.downloadPdf(id, loaNumber);
      toast.success('PDF downloaded.');
    } catch {
      toast.error('Download failed.');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[300px]">
      <Loader2 className="w-7 h-7 animate-spin text-blue-400" />
      <span className="ml-3 text-gray-400">Loading your authority letters...</span>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">My Authority Letters</h2>
          <p className="text-sm text-gray-400 mt-0.5">LOAs assigned to you</p>
        </div>
        <div className="bg-blue-500/20 border border-blue-500/30 px-4 py-2 rounded-lg">
          <p className="text-xs text-blue-300">Total</p>
          <p className="text-xl font-bold text-white">{loas.length}</p>
        </div>
      </div>

      {loas.length > 0 ? (
        <>
          <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-white/10">
                  <tr>
                    {['LOA Number', 'Client', 'Valid Upto', 'Status', 'Actions'].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loas.map(loa => (
                    <tr key={loa.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-400 flex-shrink-0" />
                          <span className="text-sm font-semibold text-white">{loa.loaNumber}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-300">{loa.clientName}</span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-300">
                          {new Date(loa.validUpto).toLocaleDateString('en-IN', {
                            day: '2-digit', month: 'short', year: 'numeric',
                          })}
                        </span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${STATUS_STYLES[loa.status]}`}>
                          {loa.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            title="Preview"
                            onClick={() => navigate(`/field-associate/loa/${loa.id}/preview`)}
                            className="p-1.5 rounded-md text-blue-400 hover:bg-blue-500/20 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            title="Download PDF"
                            onClick={() => handleDownload(loa.id, loa.loaNumber)}
                            className="p-1.5 rounded-md text-gray-400 hover:bg-white/10 transition-colors"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-2">
              <span className="text-sm text-gray-400">Page {page + 1} of {totalPages}</span>
              <div className="flex gap-2">
                <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
                  className="px-3 py-1.5 border border-white/20 rounded-lg text-sm text-gray-300 bg-white/5 hover:bg-white/10 disabled:opacity-40">
                  Previous
                </button>
                <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
                  className="px-3 py-1.5 border border-white/20 rounded-lg text-sm text-gray-300 bg-white/5 hover:bg-white/10 disabled:opacity-40">
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-lg p-12 text-center">
          <FileText className="w-14 h-14 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-base font-medium">No authority letters assigned yet</p>
          <p className="text-gray-600 text-sm mt-1">Your LOAs will appear here once generated</p>
        </div>
      )}
    </div>
  );
};

export default FieldAssociateLoaList;
