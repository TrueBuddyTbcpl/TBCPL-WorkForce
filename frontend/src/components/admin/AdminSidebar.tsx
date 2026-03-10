import React from 'react';
import type { Department } from './types/admin.types';
import {
  Building2,
  Users,
  Calculator,
  Briefcase,
  ChevronDown,
  Home,
  FileText,
  UserCheck,
  ClipboardCheck,
} from 'lucide-react';



export type ViewMode = 'employees' | 'cases' | 'profiles' | 'prereports' | 'clients' | 'finalreports';



interface Filters {
  role: string;
  status: string;
}



interface AdminSidebarProps {
  selectedDepartment: Department;
  onDepartmentChange: (dept: Department) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}


const AdminSidebar: React.FC<AdminSidebarProps> = ({
  selectedDepartment,
  viewMode,
  onViewModeChange,
}) => {
  const departments: { value: Department; label: string; icon: any; color: string }[] = [
    { value: 'Operations', label: 'Operations', icon: Building2, color: 'blue' },
    { value: 'HR', label: 'Human Resources', icon: Users, color: 'green' },
    { value: 'Account', label: 'Accounts', icon: Calculator, color: 'purple' },
  ];



  const selectedDept = departments.find(d => d.value === selectedDepartment);







  return (
    <>
      {/* Background color: light sky blue */}
      <div className="fixed left-0 top-0 h-screen w-64 bg-sky-100 border-r border-gray-200 shadow-lg z-40 flex flex-col">
        {/* Logo/Brand */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <Home className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">TBCPL</h1>
              <p className="text-xs text-gray-600">Admin Panel</p>
            </div>
          </div>
        </div>



        {/* Navigation - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Disabled Department Selector */}
          <div className="mb-4">
            {/* ✅ FIX 1: abel → <label */}
            <label className="block text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">
              Select Department
            </label>
            <button
              disabled
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-200 border border-gray-300 rounded-lg cursor-not-allowed opacity-60"
            >
              <div className="flex items-center gap-2">
                {selectedDept && <selectedDept.icon className={`w-5 h-5 text-${selectedDept.color}-600`} />}
                <span className="font-medium text-gray-900">{selectedDept?.label}</span>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-600" />
            </button>
          </div>



          {/* View Mode Selector */}
          <div className="mb-4">
            {/* ✅ FIX 2: abel → <label */}
            <label className="block text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">
              View Mode
            </label>
            <div className="space-y-2">
              <button
                onClick={() => onViewModeChange('employees')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${viewMode === 'employees'
                  ? 'bg-blue-50 text-blue-600 border-2 border-blue-600 font-semibold'
                  : 'bg-gray-50 text-gray-700 border border-gray-300 hover:bg-gray-100'
                  }`}
              >
                <Users className="w-5 h-5" />
                <span>Employees</span>
              </button>



              {/* Cases button enabled */}
              <button
                onClick={() => onViewModeChange('cases')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${viewMode === 'cases'
                    ? 'bg-blue-50 text-blue-600 border-2 border-blue-600 font-semibold'
                    : 'bg-gray-50 text-gray-700 border border-gray-300 hover:bg-gray-100'
                  }`}
              >
                <Briefcase className="w-5 h-5" />
                <span>Cases</span>
              </button>



              {/* Culprit Profiles button disabled */}
              <button
                disabled
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-200 text-gray-400 border border-gray-300 cursor-not-allowed opacity-60"
              >
                <UserCheck className="w-5 h-5" />
                <span>Culprit Profiles</span>
              </button>
            </div>
          </div>



          {/* Action Buttons */}
          <div className="space-y-2">
            {/* Preliminary Reports */}
            <button
              onClick={() => onViewModeChange('prereports')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition font-medium ${viewMode === 'prereports'
                ? 'bg-blue-50 text-blue-600 border-2 border-blue-600'
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
            >
              <FileText className="w-5 h-5" />
              Preliminary Reports
            </button>



            {/* Client Management */}
            <button
              onClick={() => onViewModeChange('clients')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition font-medium ${viewMode === 'clients'
                ? 'bg-blue-50 text-blue-600 border-2 border-blue-600'
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
            >
              <Building2 className="w-5 h-5" />
              Client Management
            </button>



            {/* ✅ NEW: Final Reports */}
            <button
              onClick={() => {
                onViewModeChange('finalreports');
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition font-medium ${viewMode === 'finalreports'
                ? 'bg-blue-50 text-blue-600 border-2 border-blue-600'
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
            >
              <ClipboardCheck className="w-5 h-5" />
              Final Reports
            </button>
          </div>
        </div>




      </div>
    </>
  );
};



export default AdminSidebar;
