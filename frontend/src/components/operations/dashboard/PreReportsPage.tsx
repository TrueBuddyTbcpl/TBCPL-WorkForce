// src/components/operations/pre-reports/PreReportsPage.tsx
import DashboardLayout from '../dashboard/DashboardLayout';
import { EmployeePreReportList } from '../dashboard/EmployeePreReportList';

const PreReportsPage = () => {
  return (
    <DashboardLayout>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <EmployeePreReportList />
      </div>
    </DashboardLayout>
  );
};

export default PreReportsPage;
