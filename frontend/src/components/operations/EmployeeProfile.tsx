import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  MapPin,
  User,
  Settings,
  Shield,
  FileText,
  FolderOpen,
  TrendingUp,
  Award,
  Clock,
  Edit,
} from 'lucide-react';

interface EmployeeData {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  joinDate: string;
  location?: string;
  reportingManager?: {
    id: string;
    name: string;
    role: string;
  };
  stats: {
    totalCases: number;
    activeCases: number;
    closedCases: number;
    profilesCreated: number;
    reportsGenerated: number;
  };
  recentActivity: Array<{
    id: string;
    type: 'case' | 'profile' | 'report';
    title: string;
    date: string;
    status: string;
  }>;
}

const EmployeeProfile: React.FC = () => {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<EmployeeData | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'settings'>('overview');

  useEffect(() => {
    // Load employee data from localStorage or API
    loadEmployeeData();
  }, []);

  const loadEmployeeData = () => {
    // Get logged-in user data from localStorage
    const userData = localStorage.getItem('user_data');
    
    if (userData) {
      const parsedData = JSON.parse(userData);
      
      // Mock employee data - replace with actual data from your backend
      const employeeData: EmployeeData = {
        id: parsedData.id || 'emp001',
        name: parsedData.name || 'Rajesh Kumar',
        email: parsedData.email || 'rajesh.kumar@tbcpl.com',
        phone: parsedData.phone || '+91 98765 43210',
        role: parsedData.role || 'Senior Investigator',
        department: parsedData.department || 'Operations',
        joinDate: parsedData.joinDate || '2023-01-15',
        location: 'Delhi NCR',
        reportingManager: {
          id: 'emp002',
          name: 'Amit Sharma',
          role: 'Operations Manager',
        },
        stats: {
          totalCases: 15,
          activeCases: 8,
          closedCases: 7,
          profilesCreated: 23,
          reportsGenerated: 42,
        },
        recentActivity: [
          {
            id: '1',
            type: 'case',
            title: 'Counterfeit Electronics Investigation',
            date: '2026-01-08',
            status: 'in-progress',
          },
          {
            id: '2',
            type: 'report',
            title: 'Samsung Galaxy Investigation Report',
            date: '2026-01-07',
            status: 'completed',
          },
          {
            id: '3',
            type: 'profile',
            title: 'Created profile for suspect',
            date: '2026-01-06',
            status: 'active',
          },
        ],
      };

      setEmployee(employeeData);
    }
  };

  const handleEditProfile = () => {
    navigate('/operations/profile/edit');
  };

  const handleBackToDashboard = () => {
    navigate('/operations/dashboard');
  };

  if (!employee) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button
            onClick={handleBackToDashboard}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-3xl shadow-lg">
                {employee.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{employee.name}</h1>
                <p className="text-gray-600">{employee.role} • {employee.department}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    Active
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleEditProfile}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-2 font-medium border-b-2 transition ${
                activeTab === 'overview'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`py-4 px-2 font-medium border-b-2 transition ${
                activeTab === 'activity'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Recent Activity
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-4 px-2 font-medium border-b-2 transition ${
                activeTab === 'settings'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Settings
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Email</p>
                    <p className="text-sm font-medium text-gray-900">{employee.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-green-50 p-3 rounded-lg">
                    <Phone className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Phone</p>
                    <p className="text-sm font-medium text-gray-900">{employee.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <MapPin className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Location</p>
                    <p className="text-sm font-medium text-gray-900">{employee.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <Calendar className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Join Date</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(employee.joinDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-indigo-50 p-3 rounded-lg">
                    <Briefcase className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Department</p>
                    <p className="text-sm font-medium text-gray-900">{employee.department}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-pink-50 p-3 rounded-lg">
                    <Award className="w-5 h-5 text-pink-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Role</p>
                    <p className="text-sm font-medium text-gray-900">{employee.role}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Reporting Manager */}
            {employee.reportingManager && (
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-200 p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                    {employee.reportingManager.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Shield className="w-4 h-4 text-indigo-600" />
                      <p className="text-sm font-medium text-indigo-600 uppercase tracking-wide">
                        Reports To
                      </p>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {employee.reportingManager.name}
                    </h3>
                    <p className="text-sm text-gray-600">{employee.reportingManager.role}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Performance Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-2">
                  <FolderOpen className="w-8 h-8 text-blue-600" />
                </div>
                <p className="text-sm text-gray-600">Total Cases</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{employee.stats.totalCases}</p>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-sm text-gray-600">Active Cases</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{employee.stats.activeCases}</p>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-2">
                  <FileText className="w-8 h-8 text-gray-600" />
                </div>
                <p className="text-sm text-gray-600">Closed Cases</p>
                <p className="text-3xl font-bold text-gray-600 mt-2">{employee.stats.closedCases}</p>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-2">
                  <User className="w-8 h-8 text-purple-600" />
                </div>
                <p className="text-sm text-gray-600">Profiles Created</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">{employee.stats.profilesCreated}</p>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-2">
                  <FileText className="w-8 h-8 text-orange-600" />
                </div>
                <p className="text-sm text-gray-600">Reports Generated</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">{employee.stats.reportsGenerated}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {employee.recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition"
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      activity.type === 'case'
                        ? 'bg-blue-100'
                        : activity.type === 'profile'
                        ? 'bg-purple-100'
                        : 'bg-green-100'
                    }`}
                  >
                    {activity.type === 'case' && <FolderOpen className="w-5 h-5 text-blue-600" />}
                    {activity.type === 'profile' && <User className="w-5 h-5 text-purple-600" />}
                    {activity.type === 'report' && <FileText className="w-5 h-5 text-green-600" />}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{activity.title}</h3>
                    <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                      <Clock className="w-4 h-4" />
                      {new Date(activity.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      activity.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : activity.status === 'in-progress'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {activity.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h2>
            <div className="space-y-4">
              <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5 text-gray-600" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Change Password</p>
                    <p className="text-sm text-gray-600">Update your password</p>
                  </div>
                </div>
              </button>

              <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-600" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Email Notifications</p>
                    <p className="text-sm text-gray-600">Manage email preferences</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeProfile;
