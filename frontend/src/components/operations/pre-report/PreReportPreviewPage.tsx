// src/components/operations/pre-report/PreReportPreviewPage.tsx
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { usePreReportDetail } from '../../../hooks/prereport/usePreReportDetail';
import { openPreReportInNewTab, type PreReportPDFData } from '../../../utils/preReportPdfExport';
import { toast } from 'sonner';
import { useAuthStore } from '../../../stores/authStore';
import { useDashboardPath } from '../../../hooks/useDashboardPath';
import { useCustomScopes } from '../../../hooks/prereport/useCustomScope';


const PreReportPreviewPage: React.FC = () => {
  const { reportId } = useParams<{ reportId: string }>();
  const navigate     = useNavigate();

  const { user }        = useAuthStore();
  const dashboardPath   = useDashboardPath();

  const canPreview =
    user?.roleName === 'SUPER_ADMIN' ||
    user?.roleName === 'ADMIN'       ||
    user?.roleName === 'ASSOCIATE';

  // ── Step 1: Load report ──────────────────────────────────────────────────
  const { data, isLoading: isReportLoading, isError } = usePreReportDetail(reportId!);

  // ── Step 2: Derive leadType once report is loaded ────────────────────────
  const leadType = data?.preReport?.leadType;  // undefined until report loads

  // ── Step 3: Fetch custom options for ALL steps, correct leadType ─────────
  // Each query is disabled until leadType is known (enabled: !!leadType)
  const { data: step2Options = [], isLoading: isStep2Loading } = useCustomScopes(leadType, 2);
  const { data: step4Options = [], isLoading: isStep4Loading } = useCustomScopes(leadType, 4);
  const { data: step5Options = [], isLoading: isStep5Loading } = useCustomScopes(leadType, 5);
  const { data: step8Options = [], isLoading: isStep8Loading } = useCustomScopes(leadType, 8);

  // ── Merged options from all steps ────────────────────────────────────────
  const allCustomOptions = [
    ...step2Options,
    ...step4Options,
    ...step5Options,
    ...step8Options,
  ];

  // ── True loading: report + all option queries must finish ─────────────────
  const isLoading =
    isReportLoading ||
    isStep2Loading  ||
    isStep4Loading  ||
    isStep5Loading  ||
    isStep8Loading;


  // ── Intercept browser back button ────────────────────────────────────────
  useEffect(() => {
    window.history.pushState({ preReportPreview: true }, '');
    const handlePopState = () => navigate(dashboardPath, { replace: true });
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [navigate, dashboardPath]);


  // ── Access guard ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!canPreview) {
      toast.error('Access denied. You do not have permission to preview.');
      navigate(dashboardPath, { replace: true });
    }
  }, [canPreview, navigate, dashboardPath]);


  // ── Trigger PDF only when ALL data is ready ───────────────────────────────
  useEffect(() => {
    if (data && !isLoading && canPreview) {
      openPreview();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isLoading]);


  // ── Error guard ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (isError) {
      toast.error('Failed to load report data.');
      navigate(dashboardPath, { replace: true });
    }
  }, [isError, navigate, dashboardPath]);


  // ── PDF data builder ──────────────────────────────────────────────────────
  const preparePDFData = (): PreReportPDFData | null => {
    if (!data) return null;

    const { preReport, clientLeadData, trueBuddyLeadData } = data;

    const pdfLeadType: PreReportPDFData['leadType'] =
      preReport.leadType === 'TRUEBUDDY_LEAD' ? 'TRUE_BUDDY_LEAD' : 'CLIENT_LEAD';

    const pdfData: PreReportPDFData = {
      reportId:   preReport.reportId,
      clientName: preReport.clientName,
      leadType:   pdfLeadType,
      createdAt:  preReport.createdAt,
      updatedAt:  preReport.updatedAt,
      products: preReport.productNames?.map((name: string) => ({
        name, category: 'N/A', status: 'ACTIVE',
      })),
      // ✅ FIX: all steps, correct leadType, field name already matches
      customOptions: allCustomOptions,
    };

    if (preReport.leadType === 'CLIENT_LEAD' && clientLeadData) {
      pdfData.clientLeadData = clientLeadData;
    } else if (preReport.leadType === 'TRUEBUDDY_LEAD' && trueBuddyLeadData) {
      pdfData.trueBuddyLeadData = trueBuddyLeadData;
    }

    return pdfData;
  };


  // ── Open PDF then redirect ────────────────────────────────────────────────
  const openPreview = async () => {
    try {
      const pdfData = preparePDFData();

      if (!pdfData) {
        toast.error('Failed to prepare report data.');
        navigate(dashboardPath, { replace: true });
        return;
      }

      openPreReportInNewTab(pdfData);
      toast.success('PDF preview opened in new tab.');

      setTimeout(() => {
        navigate(dashboardPath, { replace: true });
      }, 500);

    } catch (error) {
      console.error('Preview error:', error);
      toast.error('Failed to open preview.');
      navigate(dashboardPath, { replace: true });
    }
  };


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