import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Loader2,
  FileText,
  Calendar,
  User,
  AlertCircle,
} from 'lucide-react';
import { usePreReports } from '../../../hooks/prereport/usePreReports';
import apiClient from '../../../services/api/apiClient';


export const EmployeePreReportList: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [size] = useState(15);
  const [employeeNames, setEmployeeNames] = useState<Record<number, string>>({});  // ✅ Changed from string to number


  const { data, isLoading, isError } = usePreReports({ page, size });


  // ✅ Fetch employee names when reports are loaded
  useEffect(() => {
    const fetchEmployeeNames = async () => {
      if (!data?.reports || data.reports.length === 0) return;


      // ✅ Get unique employee IDs (now they are numbers)
      const uniqueEmployeeIds = [...new Set(data.reports.map(r => r.createdBy))];
      
      console.log('🔍 Unique employee IDs to fetch:', uniqueEmployeeIds);


      // Fetch all employee names
      const names: Record<number, string> = {};
      
      await Promise.all(
        uniqueEmployeeIds.map(async (employeeId) => {
          try {
            console.log(`📡 Fetching employee for ID: ${employeeId}`);
            
            // ✅ Use employee ID directly (not empId)
            const response = await apiClient.get(`/auth/employees/id/${employeeId}`);
            
            console.log(`✅ Response for employee ID ${employeeId}:`, response.data);
            
            if (response.data?.success && response.data?.data) {
              names[employeeId] = response.data.data.fullName;
              console.log(`✅ Mapped ID ${employeeId} -> ${response.data.data.fullName}`);
            } else {
              names[employeeId] = `Employee ${employeeId}`;
              console.warn(`⚠️ No data in response for employee ID ${employeeId}`);
            }
          } catch (error) {
            console.error(`❌ Failed to fetch employee name for ID ${employeeId}:`, error);
            names[employeeId] = `Employee ${employeeId}`; // Fallback
          }
        })
      );


      console.log('📋 Final employeeNames mapping:', names);
      setEmployeeNames(names);
    };


    fetchEmployeeNames();
  }, [data?.reports]);


  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-600">Loading reports...</span>
      </div>
    );
  }


  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 text-lg font-semibold mb-2">Error loading reports</p>
          <p className="text-gray-600">Please try again later</p>
        </div>
      </div>
    );
  }


  const reports = data?.reports || [];
  const totalElements = data?.totalElements || 0;
  const totalPages = data?.totalPages || 0;


  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Preliminary Reports</h2>
          <p className="text-sm text-gray-600 mt-1">
            View and manage all pre-investigation reports
          </p>
        </div>
        <div className="bg-blue-50 px-4 py-2 rounded-lg">
          <p className="text-sm text-gray-600">Total Reports</p>
          <p className="text-2xl font-bold text-blue-600">{totalElements}</p>
        </div>
      </div>


      {/* Table */}
      {reports.length > 0 ? (
        <>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Report ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lead Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created By
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reports.map((report) => (
                    <tr
                      key={report.id}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => navigate(`/operations/pre-report/${report.reportId}`)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FileText className="w-5 h-5 text-blue-500 mr-2" />
                          <span className="text-sm font-medium text-gray-900">
                            {report.reportId}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {report.clientName || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            report.leadType === 'CLIENT_LEAD'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}
                        >
                          {report.leadType === 'CLIENT_LEAD'
                            ? 'Client Lead'
                            : 'TrueBuddy Lead'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            report.reportStatus === 'DRAFT'
                              ? 'bg-gray-100 text-gray-800'
                              : report.reportStatus === 'WAITING_FOR_APPROVAL'
                              ? 'bg-yellow-100 text-yellow-800'
                              : report.reportStatus === 'READY_FOR_CREATE_CASE'
                              ? 'bg-green-100 text-green-800'
                              : report.reportStatus === 'REQUESTED_FOR_CHANGES'
                              ? 'bg-orange-100 text-orange-800'
                              : report.reportStatus === 'DISAPPROVED_BY_CLIENT'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {report.reportStatus
                            ? report.reportStatus.replace(/_/g, ' ')
                            : 'Unknown'}
                        </span>
                      </td>
                      {/* ✅ Display employee name using employee ID */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <User className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">
                            {employeeNames[report.createdBy] || `Employee ${report.createdBy}`}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-500">
                            {new Date(report.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/operations/pre-report/${report.reportId}`);
                          }}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>


          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-gray-50 px-6 py-3 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">
                  Showing {page * size + 1} to{' '}
                  {Math.min((page + 1) * size, totalElements)} of{' '}
                  {totalElements} results
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-700">
                  Page {page + 1} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="border border-gray-200 rounded-lg p-12 text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg font-medium">No reports found</p>
          <p className="text-gray-400 text-sm mt-2">
            Pre-investigation reports will appear here
          </p>
        </div>
      )}
    </div>
  );
};


export default EmployeePreReportList;
