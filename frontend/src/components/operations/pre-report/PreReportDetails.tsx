import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Download, Loader2 } from 'lucide-react';
import { usePreReportDetail } from '../../../hooks/prereport/usePreReportDetail';
import { PreReportStatusBadge } from './PreReportStatusBadge';
import { formatDate, formatLeadType } from '../../../utils/formatters';
import { getStepTitle } from '../../../utils/helpers';
import { getCompletionPercentage } from '../../../utils/stepValidation';

export const PreReportDetails = () => {
  const { reportId } = useParams<{ reportId: string }>();
  const navigate = useNavigate();

  const { data, isLoading, isError } = usePreReportDetail(reportId!);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 text-lg font-semibold mb-2">Error loading report</p>
          <button
            onClick={() => navigate('/operations/pre-report')}
            className="text-blue-600 hover:underline"
          >
            Back to Reports
          </button>
        </div>
      </div>
    );
  }

  const { preReport, clientLeadData, trueBuddyLeadData } = data;
  const completionPercentage = getCompletionPercentage(
    preReport.leadType,
    clientLeadData,
    trueBuddyLeadData
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/operations/pre-report')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Reports
        </button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{preReport.reportId}</h1>
            <p className="text-gray-600 mt-1">{preReport.clientName}</p>
          </div>
          <div className="flex items-center gap-3">
            <PreReportStatusBadge status={preReport.reportStatus} />
            <button
              onClick={() => navigate(`/operations/pre-report/${reportId}/edit`)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={() => navigate(`/operations/pre-report/${reportId}/pdf`)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export PDF
            </button>
          </div>
        </div>
      </div>

      {/* Overview Card */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Report Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-gray-500">Lead Type</p>
            <p className="font-medium text-gray-900">{formatLeadType(preReport.leadType)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Created Date</p>
            <p className="font-medium text-gray-900">{formatDate(preReport.createdAt)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Last Updated</p>
            <p className="font-medium text-gray-900">{formatDate(preReport.updatedAt)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Completion</p>
            <p className="font-medium text-gray-900">{completionPercentage}%</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Overall Progress</span>
            <span className="text-sm text-gray-600">{completionPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Products */}
        <div className="mt-6">
          <p className="text-sm font-medium text-gray-700 mb-2">Products:</p>
          <div className="flex flex-wrap gap-2">
            {preReport.productNames.map((product, idx) => (
              <span
                key={idx}
                className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-sm text-blue-700"
              >
                {product}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Step Details */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Step Details</h2>
        <div className="space-y-4">
          {Array.from(
            { length: preReport.leadType === 'CLIENT_LEAD' ? 10 : 11 },
            (_, i) => i + 1
          ).map((stepNum) => (
            <div
              key={stepNum}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold">
                  {stepNum}
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {getStepTitle(preReport.leadType, stepNum)}
                  </p>
                </div>
              </div>
              <span
                className={`text-sm font-medium ${
                  preReport.currentStep >= stepNum ? 'text-green-600' : 'text-gray-400'
                }`}
              >
                {preReport.currentStep >= stepNum ? 'Completed' : 'Pending'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PreReportDetails;
