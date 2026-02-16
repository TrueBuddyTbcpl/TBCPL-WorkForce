import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Loader2 } from 'lucide-react';
import { usePreReports, useDeleteReport } from '../../../hooks/prereport/usePreReports';
import { PreReportCard } from './PreReportCard';
import { PreReportListFilters } from './PreReportListFilters';
import type { PreReport } from '../../../types/prereport.types';

export const PreReportList = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedLeadType, setSelectedLeadType] = useState('');

  const { data, isLoading, isError } = usePreReports({ page, size: 10 });
  const deleteReportMutation = useDeleteReport();

  const handleDelete = (reportId: string) => {
    deleteReportMutation.mutate(reportId);
  };

  const handleReset = () => {
    setSelectedStatus('');
    setSelectedLeadType('');
    setPage(0);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 text-lg font-semibold mb-2">Error loading reports</p>
          <p className="text-gray-600">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pre-Reports</h1>
          <p className="text-gray-600 mt-1">Manage all pre-investigation reports</p>
        </div>
        <button
          onClick={() => navigate('/operations/pre-report/create')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Report
        </button>
      </div>

      {/* Filters */}
      <PreReportListFilters
        selectedStatus={selectedStatus}
        selectedLeadType={selectedLeadType}
        onStatusChange={setSelectedStatus}
        onLeadTypeChange={setSelectedLeadType}
        onReset={handleReset}
      />

      {/* Reports Grid */}
      {data && data.reports.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.reports.map((report) => (
              // ✅ FIXED: Add missing props for PreReportCard
              <PreReportCard
                key={report.id}
                report={{
                  ...report,
                  currentStep: 1,
                  updatedAt: report.createdAt || '',
                  clientId: report.clientId ? Number(report.clientId) : 0,
                  productIds: report.productIds ? report.productIds.map(id => Number(id)) : [],
                  productNames: report.productNames || [],
                  leadType: (report.leadType as 'CLIENT_LEAD' | 'TRUEBUDDY_LEAD'),
                  reportStatus: report.reportStatus as any,
                  createdBy: String(report.createdBy), // ✅ convert number → string
                } as PreReport}
                onDelete={handleDelete}
              />





            ))}
          </div>

          {/* Pagination */}
          {data.pagination?.totalPages! > 1 && (  // ✅ FIXED: data.pagination?.totalPages
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="text-gray-700">
                Page {page + 1} of {data.pagination?.totalPages || 1}  // ✅ FIXED
              </span>
              <button
                onClick={() => setPage((p) => Math.min((data.pagination?.totalPages || 1) - 1, p + 1))}  // ✅ FIXED
                disabled={page >= (data.pagination?.totalPages || 1) - 1}  // ✅ FIXED
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No reports found</p>
          <button
            onClick={() => navigate('/operations/pre-report/create')}
            className="mt-4 text-blue-600 hover:underline"
          >
            Create your first report
          </button>
        </div>
      )}
    </div>
  );
};
