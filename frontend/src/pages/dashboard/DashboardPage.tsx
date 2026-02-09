import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Button } from '../../components/common/Button';
import {
  FileText,
  Users,
  Briefcase,
  FolderOpen,
  TrendingUp,
  Clock,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const quickActions = [
    {
      title: 'Create Pre-Report',
      description: 'Start a new pre-investigation report',
      icon: FileText,
      path: '/operations/pre-report/create',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'View Pre-Reports',
      description: 'Access all pre-investigation reports',
      icon: FolderOpen,
      path: '/operations/pre-report',
      color: 'bg-green-50 text-green-600',
    },
    {
      title: 'Manage Profiles',
      description: 'View and manage culprit profiles',
      icon: Users,
      path: '/operations/profile',
      color: 'bg-purple-50 text-purple-600',
    },
    {
      title: 'View Cases',
      description: 'Access case management',
      icon: Briefcase,
      path: '/operations/case',
      color: 'bg-orange-50 text-orange-600',
    },
  ];

  const stats = [
    {
      label: 'Total Pre-Reports',
      value: '0',
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Active Cases',
      value: '0',
      icon: Briefcase,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Profiles',
      value: '0',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      label: 'Pending Reviews',
      value: '0',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user?.fullName?.split(' ')[0]}! 👋
            </h1>
            <p className="text-gray-600 mt-1">
              {user?.departmentName} • {user?.roleName}
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span>{new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <button
              key={action.path}
              onClick={() => navigate(action.path)}
              className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all text-left"
            >
              <div className={`${action.color} p-3 rounded-lg inline-flex mb-4`}>
                <action.icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
              <p className="text-sm text-gray-600">{action.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity (Placeholder) */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          <TrendingUp className="h-5 w-5 text-gray-400" />
        </div>
        <div className="text-center py-8">
          <p className="text-gray-500">No recent activity to display</p>
          <p className="text-sm text-gray-400 mt-2">
            Your recent actions will appear here
          </p>
        </div>
      </div>

      {/* Admin Quick Links (if admin) */}
      {(user?.roleName === 'SUPER_ADMIN' || user?.roleName === 'HR_MANAGER') && (
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-sm p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold mb-2">Administration</h2>
              <p className="text-blue-100 text-sm">
                Manage employees, departments, and system settings
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={() => navigate('/admin')}
            >
              Go to Admin Panel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
