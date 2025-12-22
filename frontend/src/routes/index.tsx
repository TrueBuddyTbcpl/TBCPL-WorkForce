// src/routes/index.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import ReportCreate from '../components/operations/report-create';
import ProfileIndex from '../components/operations/profile/profile-index';
import CaseIndex from '../components/operations/Cases/case-index';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/operations/case" replace />} />
      
      {/* Operations Module */}
      <Route path="/operations/report-create" element={<ReportCreate />} />
      <Route path="/operations/profile" element={<ProfileIndex />} />
      <Route path="/operations/case" element={<CaseIndex />} />
      {/* 404 Not Found */}
      <Route path="*" element={<div className="flex items-center justify-center h-screen"><h1 className="text-2xl font-bold text-gray-700">404 - Page Not Found</h1></div>} />
    </Routes>
  );
};

export default AppRoutes;
