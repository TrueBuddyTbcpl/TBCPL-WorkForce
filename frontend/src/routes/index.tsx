import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import ReportCreate from '../components/operations/report-create';
import ProfileIndex from '../components/operations/profile/profile-index';
import CaseIndex from '../components/operations/Cases/case-index';
import Dashboard from '../components/operations/dashboard/dashboard-index';
import ProfileForm from '../components/operations/profile/ProfileForm';
import ReportDashboard from '../components/operations/report-create/report-dashboard';
import AdminDashboard from '../components/admin/admin-dashboard';
import EmployeeProfile from '../components/admin/EmployeeProfile';
import Login from '../components/auth/Login';
import EmployeeChangeHistoryReport from '../components/admin/EmployeeChangeHistoryReport';
import NotFound from './NotFound';
import ResetPasswordPage from '../pages/ResetPasswordPage';

// ✅ Import Pre-Report Components
import { EmployeePreReportList } from '../components/operations/dashboard/EmployeePreReportList';
import { CreatePreReport } from '../components/operations/pre-report/CreatePreReport';
import { EditPreReport } from '../components/operations/pre-report/EditPreReport';
import  PreReportDetails from '../components/operations/pre-report/PreReportDetails';
import PreReportPreviewPage from '../components/operations/pre-report/PreReportPreviewPage';

// ADD these 3 imports alongside existing imports
import CreateReportPage from '../components/operations/report-create/CreateReportPage';
import EditReportPage from '../components/operations/report-create/EditReportPage';
import PreviewReportPage from '../components/operations/report-create/PreviewReportPage';
import CreateProposalPage    from '../components/admin/proposal/CreateProposalPage';
import ProposalPreviewPage   from '../components/admin/proposal/ProposalPreviewPage';


// ✅ Import Auth Pages & Route Guards
import { LoginPage } from '../components/auth/LoginPage';
import { ChangePasswordPage } from '../components/auth/ChangePasswordPage';
import { ProtectedRoute } from './ProtectedRoute';
import { RoleBasedRoute } from './RoleBasedRoute';
import { LoginHistoryPage } from '../components/loginHistory/LoginHistoryPage';
import { LoginAttemptsPage } from '../components/loginHistory/LoginAttemptsPage';
import { useAuthStore } from '../stores/authStore';
import CaseDashboard from '../components/operations/Cases/CaseDashboard';
import FinalReportList from '../components/operations/dashboard/FinalReportList';
// ADD this import at the top alongside existing imports
import DashboardLayout from '../components/operations/dashboard/DashboardLayout';
import VerifyEmailPage from '../components/auth/VerifyEmailPage';

import LoaPreviewPage from '../components/admin/loa/LoaPreviewPage';
import FieldAssociateDashboard from '../components/operations/grnd_operation/FieldAssociateDashboard';




// ✅ CORRECT — all logic lives INSIDE the wrapper, not in AppRoutes
const ProfileFormWrapper = () => {
  const navigate = useNavigate();           // ← hooks called HERE
  const location = useLocation();           // ← hooks called HERE

  const fromCaseId: number | null = location.state?.fromCaseId ?? null;

  return (
    <ProfileForm
      onSaved={(profile) => {
        if (fromCaseId) {
          navigate(`/operations/cases/${fromCaseId}`, {
            state: { autoLinkProfileId: profile.id },
            replace: true,
          });
        } else {
          navigate('/operations/profile');
        }
      }}
      onCancel={() => {
        if (fromCaseId) {
          navigate(`/operations/cases/${fromCaseId}`, { replace: true });
        } else {
          navigate('/operations/profile');
        }
      }}
    />
  );
};

// ✅ Admin version — navigates to admin routes on save/cancel
const AdminProfileFormWrapper = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const fromCaseId: number | null = location.state?.fromCaseId ?? null;

  return (
    <ProfileForm
      onSaved={(profile) => {
        if (fromCaseId) {
          navigate(`/admin/cases/${fromCaseId}`, {
            state: { autoLinkProfileId: profile.id },
            replace: true,
          });
        } else {
          navigate('/admin');
        }
      }}
      onCancel={() => {
        if (fromCaseId) {
          navigate(`/admin/cases/${fromCaseId}`, { replace: true });
        } else {
          navigate('/admin');
        }
      }}
    />
  );
};




const AppRoutes = () => {
  const { user } = useAuthStore();

const getDefaultRoute = () => {
  if (!user) return '/auth/login';

  if (user.roleName === 'FIELD_ASSOCIATE') return '/field-associate/dashboard';

  if (
    user.roleName === 'SUPER_ADMIN' ||
    user.roleName === 'ADMIN' ||        // ← ADD
    user.roleName === 'HR_MANAGER'
  ) return '/admin';

  if (user.roleName === 'ASSOCIATE') return '/operations/dashboard';

  return '/auth/login';
};

  return (
    <Routes>
      {/* ==================== PUBLIC ROUTES ==================== */}
      {/* Login Routes - Two paths for backward compatibility */}
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/admin/login" element={<Login />} />
      <Route path="/auth/verify-email" element={<VerifyEmailPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

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
            <DashboardLayout>
              <ProfileIndex />
            </DashboardLayout>
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
            <ProfileFormWrapper />
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
        path="/admin/clients"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['SUPER_ADMIN','ADMIN']}>
              <AdminDashboard />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />

      // Make sure this route exists and is accessible
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
              <AdminDashboard />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/login-history"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
              <LoginHistoryPage />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/login-attempts"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
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

      <Route
        path="/operations/pre-reports"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <EmployeePreReportList />
              </div>
            </DashboardLayout>
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

      {/* ── Field Associate Dashboard ──────────────────────────────── */}
      <Route
        path="/field-associate/dashboard"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['FIELD_ASSOCIATE']}>
              <FieldAssociateDashboard />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/field-associate/loa"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['FIELD_ASSOCIATE']}>
              <FieldAssociateDashboard />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/field-associate/loa/:id/preview"
        element={
          <ProtectedRoute>
            <LoaPreviewPage />
          </ProtectedRoute>
        }
      />

      {/* ── Admin LOA Routes ────────────────────────────────────────── */}
      <Route
        path="/admin/loa"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['SUPER_ADMIN','ADMIN']}>
              <AdminDashboard />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/loa/create"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['SUPER_ADMIN','ADMIN']}>
              <AdminDashboard />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/loa/:id/edit"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
              <AdminDashboard />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/loa/:id/preview"
        element={
          <ProtectedRoute>
            <LoaPreviewPage />
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

      <Route
        path="/admin/finalreports"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
              <AdminDashboard />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />

<Route
  path="/admin/proposals"
  element={
    <ProtectedRoute>
      <RoleBasedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
        <AdminDashboard />
      </RoleBasedRoute>
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/proposals/create"
  element={
    <ProtectedRoute>
      <RoleBasedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
        <CreateProposalPage />
      </RoleBasedRoute>
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/proposals/:id/edit"
  element={
    <ProtectedRoute>
      <RoleBasedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
        <CreateProposalPage />
      </RoleBasedRoute>
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/proposals/:id/preview"
  element={
    <ProtectedRoute>
      <RoleBasedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
        <ProposalPreviewPage />
      </RoleBasedRoute>
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
            <RoleBasedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
              <AdminDashboard />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/employee/:employeeId"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
              <EmployeeProfile />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/employee-change-report"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
              <EmployeeChangeHistoryReport />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />



      {/* ── Final Report Routes ──────────────────────────────────── */}
      <Route
        path="/operations/finalreport/create"
        element={
          <ProtectedRoute>
            <CreateReportPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/operations/finalreport/:reportId/edit"
        element={
          <ProtectedRoute>
            <EditReportPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/operations/finalreport/:reportId/preview"
        element={
          <ProtectedRoute>
            <PreviewReportPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/operations/final-reports"
        element={
          <ProtectedRoute>
            <FinalReportList />
          </ProtectedRoute>
        }
      />



      // ── Operations Case Routes ─────────────────────────────────────────────
      <Route
        path="/operations/cases"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <CaseIndex />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/operations/cases/:caseId"
        element={
          <ProtectedRoute>
            <CaseDashboard />
          </ProtectedRoute>
        }
      />

// ── Admin Case Routes ──────────────────────────────────────────────────
      <Route
        path="/admin/cases"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
              <AdminDashboard />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/profiles"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
              <AdminDashboard />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/pre-reports"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
              <AdminDashboard />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/cases/:caseId"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
              <CaseDashboard isAdminView />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />

      {/* ── Admin Pre-Report Routes ─────────────────────────────────────────── */}
      <Route
        path="/admin/pre-report/create"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
              <CreatePreReport />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />

      {/* ── Admin Final Report Routes ────────────────────────────────────────── */}
      <Route
        path="/admin/finalreport/create"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
              <CreateReportPage />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/finalreport/:reportId/edit"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
              <EditReportPage />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/finalreport/:reportId/preview"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
              <PreviewReportPage />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />

      {/* ── Admin Profile Form Routes ────────────────────────────────────────── */}
      <Route
        path="/admin/profile/create"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
              <AdminProfileFormWrapper />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/profile-form"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
              <AdminProfileFormWrapper />
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
