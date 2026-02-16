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
import NotFound from './NotFound';
import ClientManagement from '../components/admin/ClientManagement';

// ✅ Import Pre-Report Components
import { EmployeePreReportList } from '../components/operations/dashboard/EmployeePreReportList';
import { CreatePreReport } from '../components/operations/pre-report/CreatePreReport';
import { EditPreReport } from '../components/operations/pre-report/EditPreReport';
import { PreReportDetails } from '../components/operations/pre-report/PreReportDetails';
import PreReportPreviewPage from '../components/operations/pre-report/PreReportPreviewPage';

// ✅ Import Auth Pages & Route Guards
import { LoginPage } from '../components/auth/LoginPage';
import { ChangePasswordPage } from '../components/auth/ChangePasswordPage';
import { ProtectedRoute } from './ProtectedRoute';
import { RoleBasedRoute } from './RoleBasedRoute';
import { LoginHistoryPage } from '../components/loginHistory/LoginHistoryPage';
import { LoginAttemptsPage } from '../components/loginHistory/LoginAttemptsPage';
import { useAuthStore } from '../stores/authStore';

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
  const { user } = useAuthStore();

  const getDefaultRoute = () => {
    if (!user) return '/auth/login';

    // Redirect admins to admin dashboard
    if (user.roleName === 'SUPER_ADMIN' || user.roleName === 'HR_MANAGER') {
      return '/admin';
    }

    // Redirect regular users to operations dashboard
    return '/operations/dashboard';
  };
  return (
    <Routes>
      {/* ==================== PUBLIC ROUTES ==================== */}
      {/* Login Routes - Two paths for backward compatibility */}
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/admin/login" element={<Login />} />

      {/* Default redirect */}
      <Route
        path="/"
        element={<Navigate to={getDefaultRoute()} replace />}
      />

      {/* ==================== PROTECTED ROUTES ==================== */}
      {/* Operations Module - Protected but accessible to all authenticated users */}
      <Route
        path="/operations/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/operations/report-create"
        element={
          <ProtectedRoute>
            <ReportCreate />
          </ProtectedRoute>
        }
      />

      <Route
        path="/operations/profile"
        element={
          <ProtectedRoute>
            <ProfileIndex />
          </ProtectedRoute>
        }
      />

      <Route
        path="/operations/pre-report/:reportId/preview"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['SUPER_ADMIN', 'HR_MANAGER']}>
              <PreReportPreviewPage /> {/* ✅ Use page component */}
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/operations/profile/create"
        element={
          <ProtectedRoute>
            <ProfileForm />
          </ProtectedRoute>
        }
      />

      <Route
        path="/operations/profile-form"
        element={
          <ProtectedRoute>
            <ProfileFormWrapper />
          </ProtectedRoute>
        }
      />

      <Route
        path="/operations/case"
        element={
          <ProtectedRoute>
            <CaseIndex />
          </ProtectedRoute>
        }
      />

      <Route
        path="/operations/case-index/:caseId"
        element={
          <ProtectedRoute>
            <CaseDetailView />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/clients"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['SUPER_ADMIN', 'HR_MANAGER']}>
              <ClientManagement />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />

      // Make sure this route exists and is accessible
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['SUPER_ADMIN', 'HR_MANAGER']}>
              <AdminDashboard />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/login-history"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['SUPER_ADMIN', 'HR_MANAGER']}>
              <LoginHistoryPage />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/login-attempts"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['SUPER_ADMIN']}>
              <LoginAttemptsPage />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/operations/reports"
        element={
          <ProtectedRoute>
            <ReportDashboard />
          </ProtectedRoute>
        }
      />

      {/* ✅ Pre-Report Routes - Protected */}
      <Route
        path="/operations/pre-reports"
        element={
          <ProtectedRoute>
            <EmployeePreReportList />
          </ProtectedRoute>
        }
      />

      <Route
        path="/operations/pre-report/create"
        element={
          <ProtectedRoute>
            <CreatePreReport />
          </ProtectedRoute>
        }
      />


      <Route
        path="/operations/pre-report/:reportId"
        element={
          <ProtectedRoute>
            <PreReportDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/operations/pre-report/:reportId/edit"
        element={
          <ProtectedRoute>
            <EditPreReport />
          </ProtectedRoute>
        }
      />

      {/* ✅ Change Password - Protected (All authenticated users) */}
      <Route
        path="/auth/change-password"
        element={
          <ProtectedRoute>
            <ChangePasswordPage />
          </ProtectedRoute>
        }
      />

      {/* Employee Profile - Protected */}
      <Route
        path="/operations/employee/profile"
        element={
          <ProtectedRoute>
            <EmployeeProfile />
          </ProtectedRoute>
        }
      />

      {/* ==================== ADMIN ROUTES ==================== */}
      {/* Admin Module - Protected and Role-Based (SUPER_ADMIN, HR_MANAGER only) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['SUPER_ADMIN', 'HR_MANAGER']}>
              <AdminDashboard />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/employee/:employeeId"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['SUPER_ADMIN']}>
              <EmployeeProfile />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/employee-change-report"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['SUPER_ADMIN', 'HR_MANAGER']}>
              <EmployeeChangeHistoryReport />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />

      {/* 404 Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
