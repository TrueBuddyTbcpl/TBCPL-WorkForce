import { ReportStatus, LeadType } from '../../../utils/constants';
import { enumToDisplay } from '../../../utils/formatters';

interface PreReportListFiltersProps {
  selectedStatus: string;
  selectedLeadType: string;
  onStatusChange: (status: string) => void;
  onLeadTypeChange: (leadType: string) => void;
  onReset: () => void;
}

export const PreReportListFilters = ({
  selectedStatus,
  selectedLeadType,
  onStatusChange,
  onLeadTypeChange,
  onReset,
}: PreReportListFiltersProps) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex flex-wrap items-end gap-4">
        {/* Status Filter */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Statuses</option>
            {Object.values(ReportStatus).map((status) => (
              <option key={status} value={status}>
                {enumToDisplay(status)}
              </option>
            ))}
          </select>
        </div>

        {/* Lead Type Filter */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Lead Type
          </label>
          <select
            value={selectedLeadType}
            onChange={(e) => onLeadTypeChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Types</option>
            {Object.values(LeadType).map((type) => (
              <option key={type} value={type}>
                {enumToDisplay(type)}
              </option>
            ))}
          </select>
        </div>

        {/* Reset Button */}
        <div>
          <button
            onClick={onReset}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
};
