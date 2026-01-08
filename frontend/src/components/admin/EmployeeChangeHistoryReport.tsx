import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Printer, Calendar, User, Edit2 } from 'lucide-react';
import { format } from 'date-fns';

const EmployeeChangeHistoryReport = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { employee, changes, generatedAt } = location.state || {};

  if (!employee || !changes || changes.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Changes Found</h2>
          <p className="text-gray-600 mb-4">No change history data available for this employee.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const reportContent = `
Employee Change History Report
Generated: ${new Date(generatedAt).toLocaleString('en-IN')}

Employee: ${employee.name}
Employee ID: ${employee.id}

Changes:
${changes.map((change: any, index: number) => `
${index + 1}. ${change.field}
   Changed on: ${new Date(change.timestamp).toLocaleString('en-IN')}
   Previous Value: ${change.oldValue}
   New Value: ${change.newValue}
   Changed By: ${change.changedBy || 'System'}
`).join('\n')}
    `.trim();
    
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `employee-changes-${employee.id}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Action Bar */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6 flex justify-between items-center print:hidden">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Employee Profile
          </button>
          
          <div className="flex gap-2">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Printer className="w-4 h-4" />
              Print Report
            </button>
          </div>
        </div>

        {/* Report Content - A4 Page Style */}
        <div className="bg-white shadow-lg border border-gray-200" style={{
          width: '210mm',
          minHeight: '297mm',
          margin: '0 auto',
          padding: '40px',
        }}>
          {/* Header */}
          <div className="border-b-2 border-blue-600 pb-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Employee Change History Report
                </h1>
                <p className="text-gray-600">Detailed record of profile modifications</p>
              </div>
              <div className="bg-blue-600 p-4 rounded-lg">
                <User className="w-8 h-8 text-white" />
              </div>
            </div>
            
            {/* Report Info Grid */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <User className="w-4 h-4 text-blue-600" />
                  <p className="text-xs font-semibold text-blue-900 uppercase">Employee</p>
                </div>
                <p className="text-sm font-bold text-gray-900">{employee.name}</p>
                <p className="text-xs text-gray-600">ID: {employee.id}</p>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Edit2 className="w-4 h-4 text-green-600" />
                  <p className="text-xs font-semibold text-green-900 uppercase">Total Changes</p>
                </div>
                <p className="text-2xl font-bold text-gray-900">{changes.length}</p>
              </div>
              
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-4 h-4 text-purple-600" />
                  <p className="text-xs font-semibold text-purple-900 uppercase">Generated</p>
                </div>
                <p className="text-sm font-bold text-gray-900">
                  {format(new Date(generatedAt), 'dd MMM yyyy')}
                </p>
                <p className="text-xs text-gray-600">
                  {format(new Date(generatedAt), 'HH:mm:ss')}
                </p>
              </div>
            </div>
          </div>

          {/* Changes Timeline */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Change Timeline</h2>
            
            <div className="space-y-4">
              {changes.map((change: any, index: number) => (
                <div 
                  key={index}
                  className="border-l-4 border-blue-500 bg-blue-50 pl-6 pr-4 py-4 rounded-r-lg hover:shadow-md transition-shadow"
                >
                  {/* Change Header */}
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                        <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                          #{index + 1}
                        </span>
                        {change.field}
                      </h3>
                      <p className="text-xs text-gray-600 mt-1">
                        {format(new Date(change.timestamp), 'dd MMM yyyy, HH:mm:ss')}
                      </p>
                    </div>
                  </div>
                  
                  {/* Value Comparison */}
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-xs font-semibold text-gray-600 mb-1">Previous Value:</p>
                      <div className="bg-red-50 border border-red-200 rounded px-3 py-2">
                        <p className="text-sm text-red-800 font-medium break-words">
                          {change.oldValue || 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-600 mb-1">New Value:</p>
                      <div className="bg-green-50 border border-green-200 rounded px-3 py-2">
                        <p className="text-sm text-green-800 font-medium break-words">
                          {change.newValue || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Change Metadata */}
                  {change.changedBy && (
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <User className="w-3 h-3" />
                      <span>Changed by: <span className="font-semibold">{change.changedBy}</span></span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-6 border-t border-gray-300 text-center text-sm text-gray-500">
            <p className="font-semibold">TBCPL Workforce Management System</p>
            <p className="mt-1">Employee Change History Report</p>
            <p className="mt-1">This is a system-generated report</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeChangeHistoryReport;
