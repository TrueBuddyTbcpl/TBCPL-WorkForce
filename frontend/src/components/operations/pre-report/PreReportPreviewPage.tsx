import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { usePreReportDetail } from '../../../hooks/prereport/usePreReportDetail';
import { openPreReportInNewTab, type PreReportPDFData } from '../../../utils/preReportPdfExport';
import { toast } from 'sonner';
import { useAuthStore } from '../../../stores/authStore';

const DASHBOARD_PATH = '/dashboard';

const PreReportPreviewPage: React.FC = () => {
  const { reportId } = useParams<{ reportId: string }>();
  const navigate = useNavigate();

  const { user } = useAuthStore();
  const isAdmin =
    user?.roleName === 'SUPER_ADMIN' || user?.roleName === 'HR_MANAGER';

  const { data, isLoading, isError } = usePreReportDetail(reportId!);

  // ── Intercept browser/hardware back button ─────────────────────────────────
  // Pushes a dummy state so there is something to pop, then on popstate
  // (back button pressed) we replace the entire stack entry with dashboard.
  useEffect(() => {
    // Push a state so back button has something to trigger against
    window.history.pushState({ preReportPreview: true }, '');

    const handlePopState = () => {
      // User pressed back — send them to dashboard, remove this page from stack
      navigate(DASHBOARD_PATH, { replace: true });
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate]);

  // ── Access guard ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isAdmin) {
      toast.error('Access denied. Admin only.');
      // replace: true → preview page is NOT kept in history
      navigate(DASHBOARD_PATH, { replace: true });
    }
  }, [isAdmin, navigate]);

  // ── Trigger PDF once data is ready ────────────────────────────────────────
  useEffect(() => {
    if (data && !isLoading && isAdmin) {
      openPreview();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isLoading]);

  // ── Error guard ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (isError) {
      toast.error('Failed to load report data.');
      navigate(DASHBOARD_PATH, { replace: true });
    }
  }, [isError, navigate]);

  // ── PDF data builder ───────────────────────────────────────────────────────
  const preparePDFData = (): PreReportPDFData | null => {
    if (!data) return null;

    const { preReport, clientLeadData, trueBuddyLeadData } = data;

    const pdfLeadType: PreReportPDFData['leadType'] =
      preReport.leadType === 'TRUEBUDDY_LEAD' ? 'TRUE_BUDDY_LEAD' : 'CLIENT_LEAD';

    const pdfData: PreReportPDFData = {
      reportId:   preReport.reportId,
      clientName: preReport.clientName,
      leadType:   pdfLeadType,
      status:     preReport.reportStatus,
      createdAt:  preReport.createdAt,
      updatedAt:  preReport.updatedAt,
      products: preReport.productNames?.map((name: string) => ({
        name,
        category: 'N/A',
        status: 'ACTIVE',
      })),
    };

    if (preReport.leadType === 'CLIENT_LEAD' && clientLeadData) {
      pdfData.clientLeadData = clientLeadData;
    } else if (preReport.leadType === 'TRUEBUDDY_LEAD' && trueBuddyLeadData) {
      pdfData.trueBuddyLeadData = trueBuddyLeadData;
    }

    return pdfData;
  };

  // ── Open PDF then redirect ─────────────────────────────────────────────────
  const openPreview = async () => {
    try {
      const pdfData = preparePDFData();

      if (!pdfData) {
        toast.error('Failed to prepare report data.');
        navigate(DASHBOARD_PATH, { replace: true });
        return;
      }

      openPreReportInNewTab(pdfData);
      toast.success('PDF preview opened in new tab.');

      // replace: true removes this preview page from history entirely.
      // Pressing back from the detail page will now land on dashboard,
      // NOT loop back to this preview page.
      setTimeout(() => {
        navigate(DASHBOARD_PATH, { replace: true });
      }, 500);

    } catch (error) {
      console.error('Preview error:', error);
      toast.error('Failed to open preview.');
      navigate(DASHBOARD_PATH, { replace: true });
    }
  };

  // ── Loading UI ─────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Opening PDF preview...</p>
          <p className="text-sm text-gray-500 mt-2">Please wait a moment</p>
        </div>
      </div>
    );
  }

  return null;
};

export default PreReportPreviewPage;
