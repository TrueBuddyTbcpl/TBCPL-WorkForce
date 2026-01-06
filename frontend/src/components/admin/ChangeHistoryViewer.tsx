import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { History, Briefcase, UserCheck, FileText, Clock, User, ChevronRight } from 'lucide-react';

interface ChangeHistoryViewerProps {
  cases: any[];
  profiles: any[];
  reports: any[];
}

type FilterType = 'all' | 'case' | 'profile' | 'report';

const ChangeHistoryViewer: React.FC<ChangeHistoryViewerProps> = ({
  cases,
  profiles,
  reports,
}) => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<FilterType>('all');

  // Combine all change history
  const allChanges: any[] = [
    ...cases.flatMap(c => c.changeHistory.map((ch: any) => ({
      ...ch,
      module: 'case',
      entityId: c.id,
      entityName: c.title,
      caseNumber: c.caseNumber,
    }))),
    ...profiles.flatMap(p => p.changeHistory.map((ch: any) => ({
      ...ch,
      module: 'profile',
      entityId: p.id,
      entityName: p.name,
    }))),
    ...reports.flatMap(r => r.changeHistory.map((ch: any) => ({
      ...ch,
      module: 'report',
      entityId: r.id,
      entityName: r.reportHeader.reportTitle,
    }))),
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
      case 'case': return 'blue';
      case 'profile': return 'purple';
      case 'report': return 'green';
      default: return 'gray';
    }
  };

  const handleViewEntity = (change: any) => {
    if (change.module === 'case') {
      navigate(`/operations/case/view/${change.entityId}`);
    } else if (change.module === 'profile') {
      navigate(`/operations/profile/view/${change.entityId}`);
    } else if (change.module === 'report') {
      navigate(`/operations/report/view/${change.entityId}`);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <History className="w-5 h-5 text-blue-600" />
          Change History - All Activities
        </h2>
        <span className="text-sm text-gray-600">
          {filteredChanges.length} {filteredChanges.length === 1 ? 'change' : 'changes'}
        </span>
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
          Cases ({cases.flatMap(c => c.changeHistory).length})
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
          Profiles ({profiles.flatMap(p => p.changeHistory).length})
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
          Reports ({reports.flatMap(r => r.changeHistory).length})
        </button>
      </div>

      {/* Change History Timeline */}
      {filteredChanges.length === 0 ? (
        <div className="text-center py-12">
          <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">No change history found</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {filteredChanges.map((change, index) => {
            const color = getModuleColor(change.module);
            
            return (
              <div
                key={`${change.id}-${index}`}
                className={`border-l-4 border-${color}-500 pl-4 py-3 bg-${color}-50 rounded-r-lg hover:shadow-md transition cursor-pointer`}
                onClick={() => handleViewEntity(change)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 bg-${color}-100 text-${color}-800 rounded text-xs font-medium`}>
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
                      <div className="text-xs text-gray-600 bg-white rounded p-2 mb-2">
                        <span className="font-medium">Field changed:</span> {change.field}
                        {change.oldValue && (
                          <div className="mt-1">
                            <span className="text-red-600">- {change.oldValue}</span>
                          </div>
                        )}
                        {change.newValue && (
                          <div>
                            <span className="text-green-600">+ {change.newValue}</span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>{change.changedByName}</span>
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
                  
                  <ChevronRight className="w-5 h-5 text-gray-400" />
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
