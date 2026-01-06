import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Department } from './types/admin.types';
import type { Employee } from '../../data/mockData/mockEmployees';
import { getEmployeesByDepartment } from '../../data/mockData/mockEmployees'; // ✅ Regular import (not type)
import { getCasesByEmployee } from '../../data/mockData/mockCases';
import { getProfilesByEmployee } from '../../data/mockData/mockProfiles';
import { getReportsByEmployee } from '../../data/mockData/mockReports';
import { Users, Briefcase, FileText, UserCheck, Eye, Mail, Phone, Calendar } from 'lucide-react';

interface EmployeeManagementProps {
  department: Department;
  employees?: Employee[]; // Make it optional
}

const EmployeeManagement: React.FC<EmployeeManagementProps> = ({ department, employees: propEmployees }) => {
    
    
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    loadEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [department, propEmployees]);

  const loadEmployees = () => {
    // Use prop employees if provided, otherwise fetch by department
    const deptEmployees = propEmployees || getEmployeesByDepartment(department);
    setEmployees(deptEmployees);
  };

  const getEmployeeStats = (empId: string) => {
    if (department === 'Operations') {
      const cases = getCasesByEmployee(empId);
      const profiles = getProfilesByEmployee(empId);
      const reports = getReportsByEmployee(empId);
      return { cases: cases.length, profiles: profiles.length, reports: reports.length };
    }
    return { cases: 0, profiles: 0, reports: 0 };
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Users className="w-6 h-6 text-blue-600" />
          Employee Management - {department} Department
        </h2>
        <span className="text-sm text-gray-600">
          Total: {employees.length} {employees.length === 1 ? 'Employee' : 'Employees'}
        </span>
      </div>

      {employees.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">No employees found in this department</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {employees.map((employee) => {
            const stats = getEmployeeStats(employee.id);
            
            return (
              <div
                key={employee.id}
                className="border border-gray-200 rounded-lg p-5 hover:shadow-md hover:border-blue-300 transition"
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0 ${
                    employee.isManager 
                      ? 'bg-gradient-to-br from-purple-500 to-purple-600' 
                      : 'bg-gradient-to-br from-blue-500 to-blue-600'
                  }`}>
                    {employee.name.charAt(0)}
                  </div>

                  {/* Employee Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                          {employee.name}
                          {employee.isManager && (
                            <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full font-medium">
                              Manager
                            </span>
                          )}
                        </h3>
                        <p className="text-sm text-gray-600">{employee.role}</p>
                      </div>
                      <button
                        onClick={() => navigate(`/admin/employee/${employee.id}`)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                      >
                        <Eye className="w-4 h-4" />
                        View Profile
                      </button>
                    </div>

                    {/* Contact Info */}
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4" />
                        <span className="truncate">{employee.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span>{employee.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>Joined: {new Date(employee.joinDate).toLocaleDateString('en-IN', { 
                          month: 'short', 
                          year: 'numeric' 
                        })}</span>
                      </div>
                    </div>

                    {/* Statistics - Only for Operations */}
                    {department === 'Operations' && (
                      <div className="flex items-center gap-6 pt-3 border-t border-gray-200">
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-gray-700">
                            <span className="font-semibold text-gray-900">{stats.cases}</span> Cases
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <UserCheck className="w-4 h-4 text-purple-600" />
                          <span className="text-sm text-gray-700">
                            <span className="font-semibold text-gray-900">{stats.profiles}</span> Profiles
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-gray-700">
                            <span className="font-semibold text-gray-900">{stats.reports}</span> Reports
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EmployeeManagement;
