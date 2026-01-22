import { useNavigate } from 'react-router-dom';
import { Eye, Edit, Trash2, FileText } from 'lucide-react';
import { PreReportStatusBadge } from './PreReportStatusBadge';
import { formatDate, formatLeadType } from '../../../utils/formatters';
import type { PreReport } from '../../../types/prereport.types';

interface PreReportCardProps {
  report: PreReport;
  onDelete: (reportId: string) => void;
}

export const PreReportCard = ({ report, onDelete }: PreReportCardProps) => {
  const navigate = useNavigate();

  const handleView = () => {
    navigate(`/operations/pre-report/${report.reportId}`);
  };

  const handleEdit = () => {
    navigate(`/operations/pre-report/${report.reportId}/edit`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this report?')) {
      onDelete(report.reportId);
    }
  };

  return (
    <div
      className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6 border border-gray-200 cursor-pointer"
      onClick={handleView}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-gray-900">{report.reportId}</h3>
            <p className="text-sm text-gray-500">{report.clientName}</p>
          </div>
        </div>
        <PreReportStatusBadge status={report.reportStatus} />
      </div>

      {/* Products */}
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 mb-1">Products:</p>
        <div className="flex flex-wrap gap-1">
          {report.productNames.slice(0, 2).map((product, idx) => (
            <span
              key={idx}
              className="inline-flex items-center px-2 py-1 rounded bg-gray-100 text-xs text-gray-700"
            >
              {product}
            </span>
          ))}
          {report.productNames.length > 2 && (
            <span className="inline-flex items-center px-2 py-1 rounded bg-gray-100 text-xs text-gray-700">
              +{report.productNames.length - 2} more
            </span>
          )}
        </div>
      </div>

      {/* Meta Info */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <p className="text-gray-500">Lead Type</p>
          <p className="font-medium text-gray-900">{formatLeadType(report.leadType)}</p>
        </div>
        <div>
          <p className="text-gray-500">Current Step</p>
          <p className="font-medium text-gray-900">
            Step {report.currentStep} of {report.leadType === 'CLIENT_LEAD' ? 10 : 11}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          Created: {formatDate(report.createdAt)}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleView();
            }}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="View"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEdit();
            }}
            className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
