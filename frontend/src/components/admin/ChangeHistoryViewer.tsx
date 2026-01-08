import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { History, Briefcase, UserCheck, FileText, Clock, User, ChevronRight, Download } from 'lucide-react';

interface ChangeHistoryViewerProps {
  employee: any;  // ✅ Added employee prop
  cases: any[];
  profiles: any[];
  reports: any[];
}

type FilterType = 'all' | 'case' | 'profile' | 'report';

const ChangeHistoryViewer: React.FC<ChangeHistoryViewerProps> = ({
  employee,
  cases,
  profiles,
  reports,
}) => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<FilterType>('all');

  // Combine all change history
  const allChanges: any[] = [
    ...cases.flatMap(c => c.changeHistory?.map((ch: any) => ({
      ...ch,
      module: 'case',
      entityId: c.id,
      entityName: c.title,
      caseNumber: c.caseNumber,
    })) || []),
    ...profiles.flatMap(p => p.changeHistory?.map((ch: any) => ({
      ...ch,
      module: 'profile',
      entityId: p.id,
      entityName: p.name,
    })) || []),
    ...reports.flatMap(r => r.changeHistory?.map((ch: any) => ({
      ...ch,
      module: 'report',
      entityId: r.id,
      entityName: r.reportHeader?.reportTitle || r.title,
    })) || []),
  ];

  // Filter and sort
  const filteredChanges = allChanges
    .filter(ch => filter === 'all' || ch.module === filter)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const getModuleIcon = (module: string) => {
    switch (module) {
      case 'case': return <Briefcase className="w-4 h-4" />;
      case 'profile': return <UserCheck className="w-4 h-4" />;
      case 'report': return <FileText className="w-4 h-4" />;
      default: return <History className="w-4 h-4" />;
    }
  };

  const getModuleColor = (module: string) => {
    switch (module) {
      case 'case': return {
        border: 'border-blue-500',
        bg: 'bg-blue-50',
        badge: 'bg-blue-100 text-blue-800',
      };
      case 'profile': return {
        border: 'border-purple-500',
        bg: 'bg-purple-50',
        badge: 'bg-purple-100 text-purple-800',
      };
      case 'report': return {
        border: 'border-green-500',
        bg: 'bg-green-50',
        badge: 'bg-green-100 text-green-800',
      };
      default: return {
        border: 'border-gray-500',
        bg: 'bg-gray-50',
        badge: 'bg-gray-100 text-gray-800',
      };
    }
  };

  const handleViewEntity = (change: any) => {
    if (change.module === 'case') {
      navigate(`/operations/case/${change.entityId}`);
    } else if (change.module === 'profile') {
      navigate(`/operations/profile/${change.entityId}`);
    } else if (change.module === 'report') {
      navigate(`/operations/report/${change.entityId}`);
    }
  };

  // ✅ Handler for "Report Changes" button
  const handleReportChanges = () => {
    navigate('/admin/employee-change-report', {
      state: {
        employee: {
          id: employee.id,
          name: employee.name,
          role: employee.role,
          department: employee.department,
          email: employee.email,
        },
        changes: filteredChanges,  // Use filtered changes based on current filter
        generatedAt: new Date().toISOString(),
        filterType: filter,
      }
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <History className="w-5 h-5 text-blue-600" />
            Change History - All Activities
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {filteredChanges.length} {filteredChanges.length === 1 ? 'change' : 'changes'}
            {filter !== 'all' && ` in ${filter}s`}
          </p>
        </div>
        
        {/* ✅ Report Changes Button */}
        {allChanges.length > 0 && (
          <button
            onClick={handleReportChanges}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            Report Changes
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 font-medium transition ${
            filter === 'all'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          All ({allChanges.length})
        </button>
        <button
          onClick={() => setFilter('case')}
          className={`px-4 py-2 font-medium transition flex items-center gap-2 ${
            filter === 'case'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          Cases ({cases.flatMap(c => c.changeHistory || []).length})
        </button>
        <button
          onClick={() => setFilter('profile')}
          className={`px-4 py-2 font-medium transition flex items-center gap-2 ${
            filter === 'profile'
              ? 'text-purple-600 border-b-2 border-purple-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          Profiles ({profiles.flatMap(p => p.changeHistory || []).length})
        </button>
        <button
          onClick={() => setFilter('report')}
          className={`px-4 py-2 font-medium transition flex items-center gap-2 ${
            filter === 'report'
              ? 'text-green-600 border-b-2 border-green-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          Reports ({reports.flatMap(r => r.changeHistory || []).length})
        </button>
      </div>

      {/* Change History Timeline */}
      {filteredChanges.length === 0 ? (
        <div className="text-center py-12">
          <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 font-medium mb-2">No change history found</p>
          <p className="text-sm text-gray-500">
            {filter !== 'all' 
              ? `No changes found for ${filter}s. Try selecting a different filter.`
              : 'This employee has no recorded changes yet.'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
          {filteredChanges.map((change, index) => {
            const colors = getModuleColor(change.module);
            
            return (
              <div
                key={`${change.id || index}-${change.timestamp}`}
                className={`border-l-4 ${colors.border} pl-4 py-3 ${colors.bg} rounded-r-lg hover:shadow-md transition cursor-pointer`}
                onClick={() => handleViewEntity(change)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 ${colors.badge} rounded text-xs font-medium`}>
                        {getModuleIcon(change.module)}
                        {change.module.toUpperCase()}
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        {change.entityName}
                      </span>
                      {change.caseNumber && (
                        <span className="text-xs text-gray-600">({change.caseNumber})</span>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-2">{change.description}</p>
                    
                    {change.field && (
                      <div className="text-xs text-gray-600 bg-white rounded p-2 mb-2 border border-gray-200">
                        <span className="font-medium">Field changed:</span> {change.field}
                        {change.oldValue && (
                          <div className="mt-1">
                            <span className="text-red-600 font-medium">- {change.oldValue}</span>
                          </div>
                        )}
                        {change.newValue && (
                          <div>
                            <span className="text-green-600 font-medium">+ {change.newValue}</span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>{change.changedByName || 'System'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>
                          {new Date(change.timestamp).toLocaleString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ChangeHistoryViewer;
