// src/components/operations/Cases/CasesPage.tsx
import DashboardLayout from '../dashboard/DashboardLayout';
import CaseIndex from './case-index';

const CasesPage = () => {
  return (
    <DashboardLayout>
      {/* CaseIndex has its own bg-gray-50 wrapper which matches the layout bg */}
      <CaseIndex />
    </DashboardLayout>
  );
};

export default CasesPage;
