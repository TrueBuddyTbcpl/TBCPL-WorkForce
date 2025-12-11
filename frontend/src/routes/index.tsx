// src/routes/index.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import ReportCreate from '../components/operations/report-create';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/operations/report-create" replace />} />
      
      {/* Operations Module */}
      <Route path="/operations/report-create" element={<ReportCreate />} />
      
      {/* Future routes - uncomment as you build them */}
      {/* <Route path="/operations/dashboard" element={<OperationsDashboard />} /> */}
      {/* <Route path="/hr/dashboard" element={<HRDashboard />} /> */}
      {/* <Route path="/admin/dashboard" element={<AdminDashboard />} /> */}
      {/* <Route path="/accounts/dashboard" element={<AccountsDashboard />} /> */}
      {/* <Route path="/technical/dashboard" element={<TechnicalDashboard />} /> */}
      
      {/* 404 Not Found */}
      <Route path="*" element={<div className="flex items-center justify-center h-screen"><h1 className="text-2xl font-bold text-gray-700">404 - Page Not Found</h1></div>} />
    </Routes>
  );
};

export default AppRoutes;
