import React from 'react';
import { Calendar, User, Users, AlertCircle } from 'lucide-react';
import type { Case } from './types/dashboard.types';

interface CaseCardProps {
  case: Case;
  onClick: () => void;
}

const CaseCard: React.FC<CaseCardProps> = ({ case: caseItem, onClick }) => {
  const statusColors = {
    open: 'bg-green-100 text-green-800',
    closed: 'bg-gray-100 text-gray-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    'on-hold': 'bg-yellow-100 text-yellow-800',
  };

  const priorityColors = {
    low: 'bg-gray-100 text-gray-700',
    medium: 'bg-blue-100 text-blue-700',
    high: 'bg-orange-100 text-orange-700',
    critical: 'bg-red-100 text-red-700',
  };

  return (
    <div
      onClick={onClick}
      className="border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-blue-300 transition cursor-pointer bg-white"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-sm font-mono text-gray-600">{caseItem.caseNumber}</span>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[caseItem.status]}`}>
              {caseItem.status}
            </span>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${priorityColors[caseItem.priority]}`}>
              {caseItem.priority}
            </span>
          </div>
          
          <h3 className="text-base font-semibold text-gray-900 mb-2">{caseItem.title}</h3>
          
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{caseItem.description}</p>

          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div className="flex items-center gap-2 text-gray-700">
              <User className="w-4 h-4 text-gray-500" />
              <span className="truncate">{caseItem.client.name}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <AlertCircle className="w-4 h-4 text-gray-500" />
              <span className="truncate">{caseItem.client.productName}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Users className="w-4 h-4 text-gray-500" />
              <span className="truncate">{caseItem.assignedTo.name}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span>{new Date(caseItem.createdDate).toLocaleDateString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="ml-4 flex flex-col gap-2 text-right">
          <div className="bg-blue-50 px-3 py-1 rounded">
            <p className="text-xs text-gray-600">Profiles</p>
            <p className="text-lg font-bold text-blue-600">{caseItem.profilesLinked}</p>
          </div>
          <div className="bg-purple-50 px-3 py-1 rounded">
            <p className="text-xs text-gray-600">Reports</p>
            <p className="text-lg font-bold text-purple-600">{caseItem.reportsGenerated}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseCard;
