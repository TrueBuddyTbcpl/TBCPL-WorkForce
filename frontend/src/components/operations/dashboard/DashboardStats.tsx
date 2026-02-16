import React, { useState, useEffect } from 'react';
import { FolderOpen, FolderCheck, Users, FileText, TrendingUp } from 'lucide-react';
import apiClient from '../../../services/api/apiClient';


const DashboardStats: React.FC = () => {
  const [preReportCount, setPreReportCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPreReportCount = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get('/operation/prereport/list', {
          params: { page: 0, size: 1 },
        });
        
        console.log('📊 Raw Response:', response);
        console.log('📊 Response Data:', response.data);
        
        // ✅ The response structure is: response.data = { reports, currentPage, totalPages, totalElements, pageSize }
        const count = response.data?.totalElements || 0;
        
        console.log('✅ Total Pre-Reports Count:', count);
        setPreReportCount(count);
      } catch (error: any) {
        console.error('❌ Failed to load pre-report count:', error);
        setPreReportCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    loadPreReportCount();
  }, []);

  const statCards = [
    {
      icon: FolderOpen,
      label: 'Total Cases',
      value: 0,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: TrendingUp,
      label: 'Active Cases',
      value: 0,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: FolderCheck,
      label: 'Closed Cases',
      value: 0,
      color: 'bg-gray-500',
      textColor: 'text-gray-600',
      bgColor: 'bg-gray-50',
    },
    {
      icon: Users,
      label: 'Profiles Created',
      value: 0,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      icon: FileText,
      label: 'Reports Generated',
      value: 0,
      color: 'bg-orange-500',
      textColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      icon: FileText,
      label: 'Total Pre-Reports',
      value: isLoading ? '...' : preReportCount,
      color: 'bg-indigo-500',
      textColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
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
