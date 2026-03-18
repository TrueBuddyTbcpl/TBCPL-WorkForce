import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, Download, Loader2, AlertCircle,
  Send, Stamp,
} from 'lucide-react';
import { loaApi } from '../../../services/api/loaApi';
import { useAuthStore } from '../../../stores/authStore';
import type { LoaResponse } from '../../../types/loa.types';
import { toast } from 'sonner';
import LoaStampsModal from './LoaStampsModal';

const canSendMail = (roleName?: string, departmentName?: string) => {
  const dept = departmentName?.toUpperCase();
  const validDept = dept === 'ADMIN' || dept === 'OPERATION';
  const validRole = ['ASSOCIATE', 'MANAGER', 'ADMIN', 'SUPER_ADMIN'].includes(roleName ?? '');
  return validDept && validRole;
};

const canManageAssets = (roleName?: string) =>
  roleName === 'ADMIN' || roleName === 'SUPER_ADMIN';

const LoaPreviewPage: React.FC = () => {
  const { id }       = useParams<{ id: string }>();
  const navigate     = useNavigate();
  const { user }     = useAuthStore();

  const [loa, setLoa]               = useState<LoaResponse | null>(null);
  const [pdfUrl, setPdfUrl]         = useState<string | null>(null);
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [mailing, setMailing]       = useState(false);
  const [error, setError]           = useState(false);
  const [stampsOpen, setStampsOpen] = useState(false);

  // ── Load LOA metadata ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!id) return;
    loaApi.getLoaById(Number(id))
      .then(l => setLoa(l))
      .catch(() => setError(true));
  }, [id]);

  // ── Load PDF (blob URL) ────────────────────────────────────────────────────
  const loadPdf = useCallback(() => {
    if (!id) return;

    // Revoke previous blob URL to prevent memory leak
    setPdfUrl(prev => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });

    setLoadingPdf(true);
    loaApi.getPreviewBlobUrl(Number(id))
      .then(url => setPdfUrl(url))
      .catch(() => toast.error('Failed to load PDF preview.'))
      .finally(() => setLoadingPdf(false));
  }, [id]);

  useEffect(() => {
    loadPdf();
    return () => {
      // Cleanup blob URL on unmount
      setPdfUrl(prev => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
    };
  }, [loadPdf]);

  // ── Download PDF ──────────────────────────────────────────────────────────
  const handleDownload = async () => {
    if (!loa) return;
    try {
      await loaApi.downloadPdf(loa.id, loa.loaNumber);
      toast.success('PDF downloaded.');
    } catch {
      toast.error('Download failed.');
    }
  };

  // ── Send Mail ─────────────────────────────────────────────────────────────
  const handleSendMail = async () => {
    if (!loa) return;
    if (!window.confirm(`Send Authority Letter to ${loa.employeeEmail}?`)) return;
    setMailing(true);
    try {
      await loaApi.sendMail(loa.id);
      toast.success(`Mail sent to ${loa.employeeEmail}`);
    } catch {
      toast.error('Failed to send email.');
    } finally {
      setMailing(false);
    }
  };

  // ── Error state ───────────────────────────────────────────────────────────
  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-[500px] gap-4">
      <AlertCircle className="w-12 h-12 text-red-500" />
      <p className="text-red-600 font-semibold">LOA not found or access denied.</p>
      <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline text-sm">
        Go Back
      </button>
    </div>
  );

  return (
    <>
      <div className="space-y-4">

        {/* ── Top Bar ──────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-4">

          {/* Left: Back + Title */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/loa')}
              className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {loa ? loa.loaNumber : 'Authority Letter Preview'}
              </h2>
              {loa && (
                <p className="text-sm text-gray-500 mt-0.5">
                  {loa.employeeName} &middot; {loa.clientName} &middot; Valid until{' '}
                  {new Date(loa.validUpto).toLocaleDateString('en-IN', {
                    day: '2-digit', month: 'short', year: 'numeric',
                  })}
                </p>
              )}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3 flex-wrap justify-end">

            {/* Status badge */}
            {loa && (
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                loa.status === 'FINALIZED'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {loa.status}
              </span>
            )}

            {/* ── Stamps & Signature button (Admin / SuperAdmin only) ── */}
            {canManageAssets(user?.roleName) && (
              <button
                onClick={() => setStampsOpen(true)}
                className="flex items-center gap-2 px-4 py-2 border border-blue-300 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
              >
                <Stamp className="w-4 h-4" />
                Stamps &amp; Signature
              </button>
            )}

            {/* Export PDF */}
            <button
              onClick={handleDownload}
              disabled={!loa}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              Export PDF
            </button>

            {/* Send Mail — Finalized only + eligible role */}
            {loa?.status === 'FINALIZED' && canSendMail(user?.roleName, user?.departmentName) && (
              <button
                onClick={handleSendMail}
                disabled={mailing}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors text-sm font-medium"
              >
                {mailing
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : <Send className="w-4 h-4" />}
                Send Mail
              </button>
            )}
          </div>
        </div>

        {/* ── PDF Viewer ───────────────────────────────────────────────── */}
        <div
          className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
          style={{ height: 'calc(100vh - 210px)' }}
        >
          {loadingPdf ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-3 text-gray-500">Loading PDF...</span>
            </div>
          ) : pdfUrl ? (
            <iframe
              src={pdfUrl}
              title="Authority Letter Preview"
              className="w-full h-full border-0"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p>Preview not available</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Stamps & Signature Modal ─────────────────────────────────── */}
      <LoaStampsModal
        isOpen={stampsOpen}
        onClose={() => setStampsOpen(false)}
        onAssetsChanged={() => {
          // Reload PDF after any asset change so preview updates immediately
          loadPdf();
        }}
      />
    </>
  );
};

export default LoaPreviewPage;
