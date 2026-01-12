import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Settings, Bell } from 'lucide-react';
import { dashboardStorage } from './utils/dashboardStorage';
import type { Employee } from './types/dashboard.types';

const EmployeeProfileSection: React.FC = () => {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const emp = dashboardStorage.getCurrentEmployee();
    setEmployee(emp);
  }, []);

  // ✅ Handle View Profile
  const handleViewProfile = () => {
    setIsDropdownOpen(false);
    navigate('/operations/employee/profile');
  };

  // ✅ Handle Settings
  const handleSettings = () => {
    setIsDropdownOpen(false);
    navigate('/operations/settings');
  };

  // ✅ Handle Logout
  const handleLogout = () => {
   setIsDropdownOpen(false);
    // Navigate to admin login
    navigate('/admin/login');
  };

  if (!employee) {
    return (
      <div className="flex items-center gap-3">
        <button className="p-2 hover:bg-gray-100 rounded-lg">
          <Bell className="w-5 h-5 text-gray-600" />
        </button>
        <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      {/* Notifications */}
      <button className="relative p-2 hover:bg-gray-100 rounded-lg transition">
        <Bell className="w-5 h-5 text-gray-600" />
        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
      </button>

      {/* Employee Profile Dropdown */}
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-3 hover:bg-gray-100 px-3 py-2 rounded-lg transition"
        >
          {employee.avatar ? (
            <img 
              src={employee.avatar} 
              alt={employee.name} 
              className="w-10 h-10 rounded-full object-cover border-2 border-gray-200" 
            />
          ) : (
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm">
              <span className="text-white font-semibold text-sm">
                {employee.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div className="text-left hidden md:block">
            <p className="text-sm font-semibold text-gray-900">{employee.name}</p>
            <p className="text-xs text-gray-600">{employee.role}</p>
          </div>
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsDropdownOpen(false)}
            />
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
              {/* Profile Info */}
              <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center gap-3 mb-3">
                  {employee.avatar ? (
                    <img 
                      src={employee.avatar} 
                      alt={employee.name} 
                      className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" 
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm">
                      <span className="text-white font-bold text-lg">
                        {employee.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-bold text-gray-900">{employee.name}</p>
                    <p className="text-xs text-gray-600">{employee.email}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white rounded-lg p-2">
                    <p className="text-gray-600">Department</p>
                    <p className="font-semibold text-gray-900 truncate">{employee.department}</p>
                  </div>
                  <div className="bg-white rounded-lg p-2">
                    <p className="text-gray-600">Role</p>
                    <p className="font-semibold text-gray-900 truncate">{employee.role}</p>
                  </div>
                  <div className="bg-white rounded-lg p-2">
                    <p className="text-gray-600">Phone</p>
                    <p className="font-semibold text-gray-900 truncate">{employee.phone}</p>
                  </div>
                  <div className="bg-white rounded-lg p-2">
                    <p className="text-gray-600">Since</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(employee.joinDate).toLocaleDateString('en-IN', { 
                        month: 'short', 
                        year: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-2">
                <button 
                  onClick={handleViewProfile}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition text-sm group"
                >
                  <User className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
                  <span className="text-gray-700 group-hover:text-blue-600 font-medium">
                    View Full Profile
                  </span>
                </button>
                
                <button 
                  onClick={handleSettings}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-100 rounded-lg transition text-sm group"
                >
                  <Settings className="w-4 h-4 text-gray-600 group-hover:text-gray-900" />
                  <span className="text-gray-700 group-hover:text-gray-900 font-medium">
                    Settings
                  </span>
                </button>
              </div>

              {/* Logout */}
              <div className="p-2 border-t border-gray-200">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-red-50 rounded-lg transition text-sm group"
                >
                  <LogOut className="w-4 h-4 text-red-500 group-hover:text-red-600" />
                  <span className="text-red-600 group-hover:text-red-700 font-medium">
                    Logout
                  </span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EmployeeProfileSection;
