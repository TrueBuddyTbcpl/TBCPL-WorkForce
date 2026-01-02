import React, { useState, useEffect } from 'react';
import { User, LogOut, Settings, Bell } from 'lucide-react';
import { dashboardStorage } from './utils/dashboardStorage';
import type { Employee } from './types/dashboard.types';

const EmployeeProfileSection: React.FC = () => {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const emp = dashboardStorage.getCurrentEmployee();
    setEmployee(emp);
  }, []);

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
            <img src={employee.avatar} alt={employee.name} className="w-10 h-10 rounded-full" />
          ) : (
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">
                {employee.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div className="text-left">
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
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              {/* Profile Info */}
              <div className="p-4 border-b border-gray-200">
                <p className="text-sm font-semibold text-gray-900">{employee.name}</p>
                <p className="text-xs text-gray-600 mt-1">{employee.email}</p>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-gray-600">Department</p>
                    <p className="font-semibold text-gray-900">{employee.department}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Role</p>
                    <p className="font-semibold text-gray-900">{employee.role}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Phone</p>
                    <p className="font-semibold text-gray-900">{employee.phone}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Since</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(employee.joinDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-2">
                <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-lg transition text-sm">
                  <User className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-700">View Full Profile</span>
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-lg transition text-sm">
                  <Settings className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-700">Settings</span>
                </button>
              </div>

              {/* Logout */}
              <div className="p-2 border-t border-gray-200">
                <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-red-50 rounded-lg transition text-sm text-red-600">
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
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
