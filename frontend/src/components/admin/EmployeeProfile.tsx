import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Employee } from '../../data/mockData/mockEmployees';
import { getEmployeeById } from '../../data/mockData/mockEmployees';
import { getCasesByEmployee } from '../../data/mockData/mockCases';
import { getProfilesByEmployee } from '../../data/mockData/mockProfiles';
import { getReportsByEmployee } from '../../data/mockData/mockReports';
import ChangeHistoryViewer from './ChangeHistoryViewer';
import { 
  ArrowLeft, Mail, Phone, Calendar, Briefcase, 
  FileText, UserCheck, TrendingUp 
} from 'lucide-react';

const EmployeeProfile: React.FC = () => {
  const { employeeId } = useParams<{ employeeId: string }>();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [cases, setCases] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    if (employeeId) {
      const emp = getEmployeeById(employeeId);
      setEmployee(emp || null);

      if (emp && emp.department === 'Operations') {
        setCases(getCasesByEmployee(employeeId));
        setProfiles(getProfilesByEmployee(employeeId));
        setReports(getReportsByEmployee(employeeId));
      }
    }
  }, [employeeId]);

  if (!employee) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Employee Not Found</h2>
          <button
            onClick={() => navigate('/admin')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Admin Panel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="px-6 py-4">
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Admin Panel
          </button>
          
          <div className="flex items-center gap-4">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-3xl ${
              employee.isManager 
                ? 'bg-gradient-to-br from-purple-500 to-purple-600' 
                : 'bg-gradient-to-br from-blue-500 to-blue-600'
            }`}>
              {employee.name.charAt(0)}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                {employee.name}
                {employee.isManager && (
                  <span className="text-sm px-3 py-1 bg-purple-100 text-purple-800 rounded-full font-medium">
                    Manager
                  </span>
                )}
              </h1>
              <p className="text-gray-600">{employee.role} - {employee.department} Department</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Contact & Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-xs text-gray-600">Email</p>
                <p className="text-sm font-medium text-gray-900 truncate">{employee.email}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-xs text-gray-600">Phone</p>
                <p className="text-sm font-medium text-gray-900">{employee.phone}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-xs text-gray-600">Join Date</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(employee.joinDate).toLocaleDateString('en-IN', { 
                    day: 'numeric',
                    month: 'short', 
                    year: 'numeric' 
                  })}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-xs text-gray-600">Department</p>
                <p className="text-sm font-medium text-gray-900">{employee.department}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics - Operations Only */}
        {employee.department === 'Operations' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Cases Assigned</p>
                  <p className="text-3xl font-bold text-blue-600">{cases.length}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Briefcase className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Profiles Created</p>
                  <p className="text-3xl font-bold text-purple-600">{profiles.length}</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-lg">
                  <UserCheck className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Reports Generated</p>
                  <p className="text-3xl font-bold text-green-600">{reports.length}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <FileText className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Assigned Cases */}
        {employee.department === 'Operations' && cases.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-600" />
              Assigned Cases ({cases.length})
            </h2>
            <div className="space-y-3">
              {cases.map((caseItem) => (
                <div
                  key={caseItem.id}
                  onClick={() => navigate(`/operations/case/${caseItem.id}`)}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-blue-300 transition cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{caseItem.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{caseItem.caseNumber}</p>
                      <div className="flex items-center gap-3 text-xs">
                        <span className={`px-2 py-1 rounded-full font-medium ${
                          caseItem.status === 'open' ? 'bg-green-100 text-green-800' :
                          caseItem.status === 'closed' ? 'bg-gray-100 text-gray-800' :
                          caseItem.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {caseItem.status === 'in-progress' ? 'In Progress' : caseItem.status}
                        </span>
                        <span className={`px-2 py-1 rounded-full font-medium ${
                          caseItem.priority === 'critical' ? 'bg-red-100 text-red-800' :
                          caseItem.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                          caseItem.priority === 'medium' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {caseItem.priority}
                        </span>
                        <span className="text-gray-600">
                          {caseItem.changeHistory?.length || 0} changes
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Change History for Cases - Pass navigate function */}
        {employee.department === 'Operations' && cases.length > 0 && (
          <ChangeHistoryViewer 
            employee={employee}
            cases={cases}
            profiles={profiles}
            reports={reports}
          />
        )}
      </div>
    </div>
  );
};

export default EmployeeProfile;
