import React, { useState, useEffect } from 'react';
import { FolderOpen, FolderCheck, Users, FileText, TrendingUp, AlertCircle } from 'lucide-react';
import { dashboardStorage } from './utils/dashboardStorage';
import type { DashboardStats as StatsType } from './types/dashboard.types';

const DashboardStats: React.FC = () => {
  const [stats, setStats] = useState<StatsType>({
    totalCases: 0,
    openCases: 0,
    closedCases: 0,
    profilesCreated: 0,
    reportsGenerated: 0,
    activeCases: 0,
  });

  useEffect(() => {
    const loadedStats = dashboardStorage.getDashboardStats();
    setStats(loadedStats);
  }, []);

  const statCards = [
    {
      icon: FolderOpen,
      label: 'Total Cases',
      value: stats.totalCases,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: TrendingUp,
      label: 'Active Cases',
      value: stats.activeCases,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: FolderCheck,
      label: 'Closed Cases',
      value: stats.closedCases,
      color: 'bg-gray-500',
      textColor: 'text-gray-600',
      bgColor: 'bg-gray-50',
    },
    {
      icon: Users,
      label: 'Profiles Created',
      value: stats.profilesCreated,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      icon: FileText,
      label: 'Reports Generated',
      value: stats.reportsGenerated,
      color: 'bg-orange-500',
      textColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      icon: AlertCircle,
      label: 'Open Cases',
      value: stats.openCases,
      color: 'bg-red-500',
      textColor: 'text-red-600',
      bgColor: 'bg-red-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {statCards.map((card, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div className={`${card.bgColor} p-3 rounded-lg`}>
              <card.icon className={`w-6 h-6 ${card.textColor}`} />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            <p className="text-sm text-gray-600 mt-1">{card.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
