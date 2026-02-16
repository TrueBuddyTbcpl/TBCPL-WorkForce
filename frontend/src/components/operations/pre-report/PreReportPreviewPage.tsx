import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { usePreReportDetail } from '../../../hooks/prereport/usePreReportDetail';
import { openPreReportInNewTab, type PreReportPDFData } from '../../../utils/preReportPdfExport';
import { toast } from 'sonner';
import { useAuthStore } from '../../../stores/authStore';

const PreReportPreviewPage: React.FC = () => {
  const { reportId } = useParams<{ reportId: string }>();
  const navigate = useNavigate();

  const { user } = useAuthStore();
  const isAdmin = user?.roleName === 'SUPER_ADMIN' || user?.roleName === 'HR_MANAGER';

  const { data, isLoading, isError } = usePreReportDetail(reportId!);

  useEffect(() => {
    if (!isAdmin) {
      toast.error('Access denied. Admin only.');
      navigate(`/operations/pre-report/${reportId}`);
      return;
    }

    if (data && !isLoading) {
      openPreview();
    }
  }, [data, isLoading, isAdmin]);

  const preparePDFData = (): PreReportPDFData | null => {
    if (!data) return null;

    const { preReport, clientLeadData, trueBuddyLeadData } = data;

    const pdfLeadType =
      preReport.leadType === 'TRUEBUDDY_LEAD'
        ? 'TRUE_BUDDY_LEAD'
        : 'CLIENT_LEAD';

    const pdfData: PreReportPDFData = {
      reportId: preReport.reportId,
      clientName: preReport.clientName,
      leadType: pdfLeadType,
      status: preReport.reportStatus,
      createdAt: preReport.createdAt,
      updatedAt: preReport.updatedAt,
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

  const openPreview = async () => {
    try {
      const pdfData = preparePDFData();
      if (!pdfData) {
        toast.error('Failed to prepare report data');
        navigate(`/operations/pre-report/${reportId}`);
        return;
      }

      // ✅ Open PDF in new browser tab
      openPreReportInNewTab(pdfData);
      toast.success('PDF preview opened in new tab');
      
      // ✅ Redirect back to report page
      setTimeout(() => {
        navigate(`/operations/pre-report/${reportId}`);
      }, 500);
      
    } catch (error) {
      console.error('Preview error:', error);
      toast.error('Failed to open preview.');
      navigate(`/operations/pre-report/${reportId}`);
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

  if (isError) {
    toast.error('Failed to load report data');
    navigate(`/operations/pre-report/${reportId}`);
    return null;
  }

  return null;
};

export default PreReportPreviewPage;
