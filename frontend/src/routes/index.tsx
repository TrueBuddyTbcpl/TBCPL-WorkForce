import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import ReportCreate from '../components/operations/report-create';
import ProfileIndex from '../components/operations/profile/profile-index';
import CaseIndex from '../components/operations/Cases/case-index';
import CaseDetailView from '../components/operations/Cases/CaseDetailView';
import Dashboard from '../components/operations/dashboard/dashboard-index';
import ProfileForm from '../components/operations/profile/ProfileForm';
import ReportDashboard from '../components/operations/report-create/report-dashboard';
import AdminDashboard from '../components/admin/admin-dashboard';
import EmployeeProfile from '../components/admin/EmployeeProfile';
import Login from '../components/auth/Login';
import EmployeeChangeHistoryReport from '../components/admin/EmployeeChangeHistoryReport';

// Wrapper component for ProfileForm
const ProfileFormWrapper = () => {
  const navigate = useNavigate();

  const handleSubmit = (data: any) => {
    console.log('Profile submitted:', data);

    const existingProfiles = JSON.parse(localStorage.getItem('culprit_profiles') || '[]');
    existingProfiles.push({
      ...data,
      id: `profile_${Date.now()}`,
      createdDate: new Date().toISOString(),
    });
    localStorage.setItem('culprit_profiles', JSON.stringify(existingProfiles));

    localStorage.removeItem('profile_draft');
    localStorage.removeItem('profile_form_step');
    localStorage.removeItem('profile_timestamp');

    alert('Profile created successfully!');
    navigate('/operations/profile');
  };

  const handleCancel = () => {
    const confirmCancel = window.confirm(
      'Are you sure you want to cancel? Any unsaved changes will be lost.'
    );

    if (confirmCancel) {
      navigate('/operations/dashboard');
    }
  };

  return (
    <ProfileForm
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Operations Module */}
      <Route path="/operations/dashboard" element={<Dashboard />} />
      <Route path="/operations/report-create" element={<ReportCreate />} />
      <Route path="/operations/profile" element={<ProfileIndex />} />
      <Route path="/operations/profile/create" element={<ProfileForm />} />
      <Route path="/operations/profile-form" element={<ProfileFormWrapper />} />
      <Route path="/operations/case" element={<CaseIndex />} />
      <Route path="/operations/case-index/:caseId" element={<CaseDetailView />} />
      <Route path="/operations/reports" element={<ReportDashboard />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin/employee/:employeeId" element={<EmployeeProfile />} />
      <Route path="/admin/employee-change-report" element={<EmployeeChangeHistoryReport />}/>

      {/* 404 Not Found */}
      <Route
        path="*"
        element={
          <div className="flex items-center justify-center h-screen">
            <h1 className="text-2xl font-bold text-gray-700">404 - Page Not Found</h1>
          </div>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
