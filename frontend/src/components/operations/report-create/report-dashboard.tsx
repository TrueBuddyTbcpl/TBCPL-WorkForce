import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, Calendar, Search, Filter, X, Eye, Download, 
  Trash2, Clock, User, Building, Package, ChevronDown,
  Plus, RefreshCw
} from 'lucide-react';

interface Report {
  id: string;
  title: string;
  clientName: string;
  clientProduct: string;
  createdBy: string;
  createdAt: string;
  lastModified: string;
  sectionsCount: number;
  status: 'draft' | 'published';
}

interface ReportFilters {
  searchQuery: string;
  clientName: string[];
  productName: string[];
  dateFrom: string;
  dateTo: string;
  createdBy: string[];
  status: string[];
}

const ReportDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [recentReports, setRecentReports] = useState<Report[]>([]);
  const [filters, setFilters] = useState<ReportFilters>({
    searchQuery: '',
    clientName: [],
    productName: [],
    dateFrom: '',
    dateTo: '',
    createdBy: [],
    status: [],
  });
  const [showFilters, setShowFilters] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, reports]);

  const loadReports = () => {
    // Load reports from localStorage
    const storedReports = localStorage.getItem('report_data');
    
    if (storedReports) {
      try {
        const parsedData = JSON.parse(storedReports);
        let reportsArray: Report[] = [];

        if (Array.isArray(parsedData)) {
          reportsArray = parsedData.map(transformReport);
        } else if (parsedData && typeof parsedData === 'object') {
          reportsArray = [transformReport(parsedData)];
        }

        setReports(reportsArray);
        
        // Get recent reports (last 5)
        const sorted = [...reportsArray].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setRecentReports(sorted.slice(0, 5));
      } catch (error) {
        console.error('Error loading reports:', error);
        setReports([]);
      }
    }
  };

  const transformReport = (data: any): Report => {
    return {
      id: data.id || `report-${Date.now()}`,
      title: data.reportHeader?.reportTitle || data.title || 'Untitled Report',
      clientName: data.reportHeader?.clientName || data.clientName || 'Unknown Client',
      clientProduct: data.reportHeader?.clientProduct || data.clientProduct || 'N/A',
      createdBy: data.createdBy || 'Unknown',
      createdAt: data.createdAt || new Date().toISOString(),
      lastModified: data.lastModified || data.createdAt || new Date().toISOString(),
      sectionsCount: data.sections?.length || 0,
      status: data.status || 'draft',
    };
  };

  const applyFilters = () => {
    let result = [...reports];

    // Search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(r =>
        r.title.toLowerCase().includes(query) ||
        r.clientName.toLowerCase().includes(query) ||
        r.clientProduct.toLowerCase().includes(query)
      );
    }

    // Client name filter
    if (filters.clientName.length > 0) {
      result = result.filter(r => filters.clientName.includes(r.clientName));
    }

    // Product name filter
    if (filters.productName.length > 0) {
      result = result.filter(r => filters.productName.includes(r.clientProduct));
    }

    // Date range filter
    if (filters.dateFrom) {
      result = result.filter(r => new Date(r.createdAt) >= new Date(filters.dateFrom));
    }
    if (filters.dateTo) {
      result = result.filter(r => new Date(r.createdAt) <= new Date(filters.dateTo));
    }

    // Created by filter
    if (filters.createdBy.length > 0) {
      result = result.filter(r => filters.createdBy.includes(r.createdBy));
    }

    // Status filter
    if (filters.status.length > 0) {
      result = result.filter(r => filters.status.includes(r.status));
    }

    setFilteredReports(result);
  };

  const clearFilters = () => {
    setFilters({
      searchQuery: '',
      clientName: [],
      productName: [],
      dateFrom: '',
      dateTo: '',
      createdBy: [],
      status: [],
    });
  };

  const handleDeleteReport = (reportId: string) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      const updatedReports = reports.filter(r => r.id !== reportId);
      
      if (updatedReports.length > 0) {
        localStorage.setItem('report_data', JSON.stringify(updatedReports));
      } else {
        localStorage.removeItem('report_data');
      }
      
      loadReports();
      alert('Report deleted successfully!');
    }
  };

  // Get unique values for filters
  const uniqueClients = Array.from(new Set(reports.map(r => r.clientName)));
  const uniqueProducts = Array.from(new Set(reports.map(r => r.clientProduct)));
  const uniqueCreators = Array.from(new Set(reports.map(r => r.createdBy)));

  const activeFiltersCount = 
    filters.clientName.length +
    filters.productName.length +
    filters.createdBy.length +
    filters.status.length +
    (filters.dateFrom ? 1 : 0) +
    (filters.dateTo ? 1 : 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Report Management</h1>
              <p className="text-sm text-gray-600 mt-1">
                View, manage, and filter all investigation reports
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={loadReports}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <button
                onClick={() => navigate('/operations/report-create')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                Create New Report
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex">
        {/* Left Sidebar - Filters */}
        <aside className={`${showFilters ? 'w-80' : 'w-0'} transition-all duration-300 overflow-hidden bg-white border-r border-gray-200 h-[calc(100vh-89px)] sticky top-[89px]`}>
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filters
              </h2>
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  Clear ({activeFiltersCount})
                </button>
              )}
            </div>

            <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-200px)]">
              {/* Client Name Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Client Name
                </label>
                <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-2">
                  {uniqueClients.map(client => (
                    <label key={client} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={filters.clientName.includes(client)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters(prev => ({
                              ...prev,
                              clientName: [...prev.clientName, client]
                            }));
                          } else {
                            setFilters(prev => ({
                              ...prev,
                              clientName: prev.clientName.filter(c => c !== client)
                            }));
                          }
                        }}
                        className="rounded"
                      />
                      <span className="truncate">{client}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Product Name Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name
                </label>
                <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-2">
                  {uniqueProducts.map(product => (
                    <label key={product} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={filters.productName.includes(product)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters(prev => ({
                              ...prev,
                              productName: [...prev.productName, product]
                            }));
                          } else {
                            setFilters(prev => ({
                              ...prev,
                              productName: prev.productName.filter(p => p !== product)
                            }));
                          }
                        }}
                        className="rounded"
                      />
                      <span className="truncate">{product}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Date Range Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Range
                </label>
                <div className="space-y-2">
                  <div>
                    <label className="text-xs text-gray-600">From</label>
                    <input
                      type="date"
                      value={filters.dateFrom}
                      onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600">To</label>
                    <input
                      type="date"
                      value={filters.dateTo}
                      onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Created By Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Created By
                </label>
                <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-2">
                  {uniqueCreators.map(creator => (
                    <label key={creator} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={filters.createdBy.includes(creator)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters(prev => ({
                              ...prev,
                              createdBy: [...prev.createdBy, creator]
                            }));
                          } else {
                            setFilters(prev => ({
                              ...prev,
                              createdBy: prev.createdBy.filter(c => c !== creator)
                            }));
                          }
                        }}
                        className="rounded"
                      />
                      <span className="truncate">{creator}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <div className="space-y-2">
                  {['draft', 'published'].map(status => (
                    <label key={status} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={filters.status.includes(status)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters(prev => ({
                              ...prev,
                              status: [...prev.status, status]
                            }));
                          } else {
                            setFilters(prev => ({
                              ...prev,
                              status: prev.status.filter(s => s !== status)
                            }));
                          }
                        }}
                        className="rounded"
                      />
                      <span className="capitalize">{status}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Toggle Filter Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="fixed left-0 top-1/2 -translate-y-1/2 bg-white border border-gray-300 rounded-r-lg p-2 shadow-lg z-20 hover:bg-gray-50"
          style={{ left: showFilters ? '320px' : '0' }}
        >
          <ChevronDown className={`w-4 h-4 transform ${showFilters ? 'rotate-90' : '-rotate-90'}`} />
        </button>

        {/* Main Content - Reports List */}
        <main className="flex-1 p-6">
          {/* Search Bar */}
          <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by report title, client name, or product..."
                value={filters.searchQuery}
                onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="mt-2 text-sm text-gray-600">
              {filteredReports.length} report{filteredReports.length !== 1 ? 's' : ''} found
            </div>
          </div>

          {/* Reports Grid */}
          {filteredReports.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reports Found</h3>
              <p className="text-gray-600 mb-4">
                {reports.length === 0 
                  ? 'Get started by creating your first report.'
                  : 'Try adjusting your filters to see more results.'}
              </p>
              <button
                onClick={() => navigate('/operations/report-create')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create New Report
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredReports.map(report => (
                <ReportCard 
                  key={report.id} 
                  report={report} 
                  onDelete={handleDeleteReport}
                  navigate={navigate}
                />
              ))}
            </div>
          )}
        </main>

        {/* Right Sidebar - Recent Reports */}
        <aside className="w-80 bg-white border-l border-gray-200 h-[calc(100vh-89px)] sticky top-[89px] overflow-y-auto">
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Recent Reports
            </h2>
            <div className="space-y-3">
              {recentReports.length === 0 ? (
                <p className="text-sm text-gray-600 text-center py-8">No reports created yet</p>
              ) : (
                recentReports.map(report => (
                  <div
                    key={report.id}
                    onClick={() => navigate(`/operations/report-view/${report.id}`)}
                    className="border border-gray-200 rounded-lg p-3 hover:shadow-md hover:border-blue-300 transition cursor-pointer"
                  >
                    <h4 className="text-sm font-semibold text-gray-900 truncate mb-1">
                      {report.title}
                    </h4>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Building className="w-3 h-3" />
                        <span className="truncate">{report.clientName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Package className="w-3 h-3" />
                        <span className="truncate">{report.clientProduct}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(report.createdAt).toLocaleDateString('en-IN')}</span>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        report.status === 'published' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {report.status}
                      </span>
                      <span className="text-xs text-gray-500">
                        {report.sectionsCount} sections
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

// Report Card Component
interface ReportCardProps {
  report: Report;
  onDelete: (id: string) => void;
  navigate: any;
}

const ReportCard: React.FC<ReportCardProps> = ({ report, onDelete, navigate }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-5 hover:shadow-md transition">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
              report.status === 'published' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {report.status}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4 text-sm mb-3">
            <div className="flex items-center gap-2 text-gray-700">
              <Building className="w-4 h-4 text-gray-500" />
              <span className="truncate">{report.clientName}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Package className="w-4 h-4 text-gray-500" />
              <span className="truncate">{report.clientProduct}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <FileText className="w-4 h-4 text-gray-500" />
              <span>{report.sectionsCount} sections</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" />
              <span>{report.createdBy}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>Created: {new Date(report.createdAt).toLocaleDateString('en-IN')}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Modified: {new Date(report.lastModified).toLocaleDateString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 ml-4">
          <button
            onClick={() => navigate(`/operations/report-view/${report.id}`)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
            title="View Report"
          >
            <Eye className="w-5 h-5" />
          </button>
          <button
            onClick={() => {/* Download functionality */}}
            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
            title="Download Report"
          >
            <Download className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDelete(report.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
            title="Delete Report"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportDashboard;
