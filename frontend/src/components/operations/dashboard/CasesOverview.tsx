import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, X } from 'lucide-react';
import CaseCard from './CaseCard';
import type { Case, DashboardFilters } from './types/dashboard.types';

interface CasesOverviewProps {
  cases: Case[];
  filters: DashboardFilters;
  onFilterChange: (filters: Partial<DashboardFilters>) => void;
}

const CasesOverview: React.FC<CasesOverviewProps> = ({ cases, filters, onFilterChange }) => {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);

  // Extract unique values for filter dropdowns
  const uniqueClients = Array.from(new Set(cases.map(c => c.client.name)));
  const uniqueProducts = Array.from(new Set(cases.map(c => c.client.productName)));
  const statuses = ['open', 'closed', 'in-progress', 'on-hold'];
  const priorities = ['low', 'medium', 'high', 'critical'];

  const handleCaseClick = (caseId: string) => {
    navigate(`/operations/case-index/${caseId}`);
  };

  const activeFiltersCount = 
    filters.clientName.length +
    filters.productName.length +
    filters.status.length +
    filters.priority.length;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">All Cases</h2>
            <p className="text-sm text-gray-600 mt-1">
              {cases.length} {cases.length === 1 ? 'case' : 'cases'} found
            </p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
          >
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filters</span>
            {activeFiltersCount > 0 && (
              <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by case number, title, or client name..."
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-3">
            <div className="grid grid-cols-2 gap-4">
              {/* Client Name Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Client Name
                </label>
                <select
                  multiple
                  value={filters.clientName}
                  onChange={(e) =>
                    onFilterChange({
                      clientName: Array.from(e.target.selectedOptions, option => option.value),
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                  size={3}
                >
                  {uniqueClients.map(client => (
                    <option key={client} value={client}>{client}</option>
                  ))}
                </select>
              </div>

              {/* Product Name Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name
                </label>
                <select
                  multiple
                  value={filters.productName}
                  onChange={(e) =>
                    onFilterChange({
                      productName: Array.from(e.target.selectedOptions, option => option.value),
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                  size={3}
                >
                  {uniqueProducts.map(product => (
                    <option key={product} value={product}>{product}</option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <div className="space-y-2">
                  {statuses.map(status => (
                    <label key={status} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={filters.status.includes(status)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            onFilterChange({ status: [...filters.status, status] });
                          } else {
                            onFilterChange({ status: filters.status.filter(s => s !== status) });
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm capitalize">{status}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Priority Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <div className="space-y-2">
                  {priorities.map(priority => (
                    <label key={priority} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={filters.priority.includes(priority)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            onFilterChange({ priority: [...filters.priority, priority] });
                          } else {
                            onFilterChange({ priority: filters.priority.filter(p => p !== priority) });
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm capitalize">{priority}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Clear Filters */}
            {activeFiltersCount > 0 && (
              <button
                onClick={() =>
                  onFilterChange({
                    clientName: [],
                    productName: [],
                    status: [],
                    priority: [],
                  })
                }
                className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700"
              >
                <X className="w-4 h-4" />
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Cases List */}
      <div className="p-4">
        {cases.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No cases found matching your criteria.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {cases.map(caseItem => (
              <CaseCard
                key={caseItem.id}
                case={caseItem}
                onClick={() => handleCaseClick(caseItem.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CasesOverview;
