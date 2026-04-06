import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText, Eye, Edit, Download, CheckCircle,
  Loader2, AlertCircle, Plus, Send,
} from 'lucide-react';
import { useLoaList } from '../../../hooks/loa/useLoa';
import { loaApi } from '../../../services/api/loaApi';
import { useAuthStore } from '../../../stores/authStore';
import type { LoaResponse } from '../../../types/loa.types';
import { toast } from 'sonner';

const STATUS_STYLES = {
  DRAFT:     'bg-yellow-100 text-yellow-800',
  FINALIZED: 'bg-green-100 text-green-800',
};

const canCreateEdit = (roleName?: string, departmentName?: string) =>
  departmentName?.toUpperCase() === 'ADMIN' &&
  (roleName === 'ADMIN' || roleName === 'SUPER_ADMIN');

const canSendMail = (roleName?: string, departmentName?: string) => {
  const dept = departmentName?.toUpperCase();
  const validDept = dept === 'ADMIN' || dept === 'OPERATION';
  const validRole = ['ASSOCIATE', 'MANAGER', 'ADMIN', 'SUPER_ADMIN'].includes(roleName ?? '');
  return validDept && validRole;
};

const AdminLoaList: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [page, setPage] = useState(0);
  const { loas, totalPages, totalElements, loading, error, refetch } = useLoaList(page, 10);
  const [finalizingId, setFinalizingId] = useState<number | null>(null);
  const [mailingId, setMailingId] = useState<number | null>(null);

  const handleFinalize = async (loa: LoaResponse) => {
    if (!window.confirm(`Finalize LOA ${loa.loaNumber}? This cannot be undone.`)) return;
    setFinalizingId(loa.id);
    try {
      await loaApi.finalizeLoa(loa.id);
      toast.success(`${loa.loaNumber} finalized successfully.`);
      refetch();
    } catch {
      toast.error('Failed to finalize LOA.');
    } finally {
      setFinalizingId(null);
    }
  };

  const handleSendMail = async (loa: LoaResponse) => {
    if (!window.confirm(`Send Authority Letter to ${loa.employeeEmail}?`)) return;
    setMailingId(loa.id);
    try {
      await loaApi.sendMail(loa.id);
      toast.success(`Mail sent to ${loa.employeeEmail}`);
    } catch {
      toast.error('Failed to send email.');
    } finally {
      setMailingId(null);
    }
  };

  const handleDownload = async (loa: LoaResponse) => {
    try {
      await loaApi.downloadPdf(loa.id, loa.loaNumber);
      toast.success('PDF downloaded.');
    } catch {
      toast.error('Failed to download PDF.');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      <span className="ml-3 text-gray-600">Loading LOAs...</span>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-[400px] text-center">
      <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
      <p className="text-red-600 font-semibold">Failed to load LOAs</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Authority Letters (LOA)</h2>
          <p className="text-sm text-gray-600 mt-1">Manage all generated authority letters</p>
        </div>
        <div className="flex items-center gap-4">
          {canCreateEdit(user?.roleName, user?.departmentName) && (
            <button
              onClick={() => navigate('/super-admin/loa/create')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Generate LOA
            </button>
          )}
          <div className="bg-blue-50 px-4 py-2 rounded-lg">
            <p className="text-sm text-gray-600">Total LOAs</p>
            <p className="text-2xl font-bold text-blue-600">{totalElements}</p>
          </div>
        </div>
      </div>

      {/* Table */}
      {loas.length > 0 ? (
        <>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {['LOA Number', 'Employee', 'Email', 'Client', 'Valid Upto', 'Status', 'Actions'].map(h => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loas.map(loa => (
                    <tr key={loa.id} className="hover:bg-gray-50 transition-colors">
                      {/* LOA Number */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-500 flex-shrink-0" />
                          <span className="text-sm font-semibold text-gray-900">{loa.loaNumber}</span>
                        </div>
                      </td>

                      {/* Employee Name */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{loa.employeeName}</span>
                      </td>

                      {/* Employee Email */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-500">{loa.employeeEmail}</span>
                      </td>

                      {/* Client Name */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{loa.clientName}</span>
                      </td>

                      {/* Valid Upto */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-700">
                          {new Date(loa.validUpto).toLocaleDateString('en-IN', {
                            day: '2-digit', month: 'short', year: 'numeric',
                          })}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${STATUS_STYLES[loa.status]}`}>
                          {loa.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 flex-wrap">
                          {/* Preview */}
                          <button
                            title="Preview LOA"
                            onClick={() => navigate(`/super-admin/loa/${loa.id}/preview`)}
                            className="p-1.5 rounded-md text-blue-600 hover:bg-blue-50 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Export PDF */}
                          <button
                            title="Download PDF"
                            onClick={() => handleDownload(loa)}
                            className="p-1.5 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
                          >
                            <Download className="w-4 h-4" />
                          </button>

                          {/* Edit — only DRAFT + admin role */}
                          {loa.status === 'DRAFT' && canCreateEdit(user?.roleName, user?.departmentName) && (
                            <button
                              title="Edit LOA"
                              onClick={() => navigate(`/super-admin/loa/${loa.id}/edit`)}
                              className="p-1.5 rounded-md text-orange-600 hover:bg-orange-50 transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          )}

                          {/* Finalize — only DRAFT + admin role */}
                          {loa.status === 'DRAFT' && canCreateEdit(user?.roleName, user?.departmentName) && (
                            <button
                              title="Finalize LOA"
                              onClick={() => handleFinalize(loa)}
                              disabled={finalizingId === loa.id}
                              className="p-1.5 rounded-md text-green-600 hover:bg-green-50 transition-colors disabled:opacity-50"
                            >
                              {finalizingId === loa.id
                                ? <Loader2 className="w-4 h-4 animate-spin" />
                                : <CheckCircle className="w-4 h-4" />}
                            </button>
                          )}

                          {/* Send Mail — only FINALIZED + eligible */}
                          {loa.status === 'FINALIZED' && canSendMail(user?.roleName, user?.departmentName) && (
                            <button
                              title="Send via Email"
                              onClick={() => handleSendMail(loa)}
                              disabled={mailingId === loa.id}
                              className="flex items-center gap-1 px-2.5 py-1 bg-indigo-600 text-white text-xs font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                            >
                              {mailingId === loa.id
                                ? <Loader2 className="w-3 h-3 animate-spin" />
                                : <Send className="w-3 h-3" />}
                              Send
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white px-6 py-3 border border-gray-200 rounded-lg">
              <span className="text-sm text-gray-700">
                Page {page + 1} of {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg font-medium">No LOAs found</p>
          <p className="text-gray-400 text-sm mt-1">Generated authority letters will appear here</p>
        </div>
      )}
    </div>
  );
};

export default AdminLoaList;
