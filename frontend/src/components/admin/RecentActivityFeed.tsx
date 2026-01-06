import React, { useState, useEffect } from 'react';
import { History, User, Clock, Briefcase, UserCheck, FileText } from 'lucide-react';
import { mockCases } from '../../data/mockData/mockCases';
import { mockProfiles } from '../../data/mockData/mockProfiles';
import { mockReports } from '../../data/mockData/mockReports';

const RecentActivityFeed: React.FC = () => {
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    loadRecentActivities();
  }, []);

  const loadRecentActivities = () => {
    // Combine all change history from cases, profiles, and reports
    const allActivities: any[] = [
      ...mockCases.flatMap(c => c.changeHistory.map((ch: any) => ({
        ...ch,
        module: 'case',
        entityName: c.title,
        caseNumber: c.caseNumber,
      }))),
      ...mockProfiles.flatMap(p => p.changeHistory.map((ch: any) => ({
        ...ch,
        module: 'profile',
        entityName: p.name,
      }))),
      ...mockReports.flatMap(r => r.changeHistory.map((ch: any) => ({
        ...ch,
        module: 'report',
        entityName: r.reportHeader.reportTitle,
      }))),
    ];

    // Sort by timestamp (most recent first) and take top 20
    const sorted = allActivities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 20);

    setActivities(sorted);
  };

  const getModuleIcon = (module: string) => {
    switch (module) {
      case 'case': return <Briefcase className="w-4 h-4 text-blue-600" />;
      case 'profile': return <UserCheck className="w-4 h-4 text-purple-600" />;
      case 'report': return <FileText className="w-4 h-4 text-green-600" />;
      default: return <History className="w-4 h-4 text-gray-600" />;
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

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = Math.floor((now.getTime() - time.getTime()) / 1000); // seconds

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="fixed right-0 top-0 h-screen w-80 bg-white border-l border-gray-200 shadow-lg z-40 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <History className="w-5 h-5 text-blue-600" />
          Recent Changes
        </h2>
        <p className="text-xs text-gray-600 mt-1">By Administrator</p>
      </div>

      {/* Activity Feed */}
      <div className="flex-1 overflow-y-auto p-4">
        {activities.length === 0 ? (
          <div className="text-center py-12">
            <History className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-600">No recent activities</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activities.map((activity, index) => {
              const color = getModuleColor(activity.module);
              
              return (
                <div
                  key={`${activity.id}-${index}`}
                  className={`p-3 rounded-lg bg-${color}-50 border-l-4 border-${color}-500 hover:shadow-md transition cursor-pointer`}
                >
                  <div className="flex items-start gap-2 mb-2">
                    <div className={`p-1 bg-${color}-100 rounded`}>
                      {getModuleIcon(activity.module)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-900 truncate">
                        {activity.entityName}
                      </p>
                      {activity.caseNumber && (
                        <p className="text-xs text-gray-600">{activity.caseNumber}</p>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-gray-700 mb-2 line-clamp-2">
                    {activity.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span>{activity.changedByName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{getTimeAgo(activity.timestamp)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium">
          View All Activities
        </button>
      </div>
    </div>
  );
};

export default RecentActivityFeed;
