import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Settings, Bell, Key, AlertTriangle } from 'lucide-react';
import { useAuthStore } from '../../../stores/authStore';
import apiClient from '../../../services/api/apiClient';

interface EmployeeDetails {
  empId: string;
  fullName: string;
  email: string;
  roleName: string;
  departmentName: string;
  joinDate?: string;
  phone?: string;
  passwordExpiryDate?: string;
  lastPasswordChangedDate?: string;
  isActive: boolean;
}

const EmployeeProfileSection: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [employee, setEmployee] = useState<EmployeeDetails | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [daysUntilPasswordExpiry, setDaysUntilPasswordExpiry] = useState<number | null>(null);

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      if (!user?.empId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        // Use /auth/profile instead of /auth/employees/{empId} to avoid 403
        const response = await apiClient.get('/auth/profile');
        
        console.log('🔍 Employee Profile Response:', response.data);
        
        if (response.data?.success && response.data?.data) {
          const empData = response.data.data;
          setEmployee(empData);

          console.log('📅 Password Expiry Date:', empData.passwordExpiryDate);
          console.log('📅 Last Password Changed:', empData.lastPasswordChangedDate);

          // Calculate days until password expiry
          let expiryDate: Date | null = null;

          if (empData.passwordExpiryDate) {
            expiryDate = new Date(empData.passwordExpiryDate);
          } else if (empData.lastPasswordChangedDate) {
            // If no expiry date but has last changed date, calculate 60 days from then
            const lastChanged = new Date(empData.lastPasswordChangedDate);
            expiryDate = new Date(lastChanged);
            expiryDate.setDate(expiryDate.getDate() + 60); // Add 60 days (2 months)
          } else if (empData.joinDate) {
            // Fallback: Use join date + 60 days
            const joinDate = new Date(empData.joinDate);
            expiryDate = new Date(joinDate);
            expiryDate.setDate(expiryDate.getDate() + 60);
          }

          if (expiryDate) {
            const today = new Date();
            const diffTime = expiryDate.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            console.log('⏰ Days Until Password Expiry:', diffDays);
            setDaysUntilPasswordExpiry(diffDays);
          } else {
            console.warn('⚠️ No password expiry date available, using default');
            // Set a default for testing (e.g., 45 days)
            setDaysUntilPasswordExpiry(45);
          }
        }
      } catch (error) {
        console.error('❌ Failed to fetch employee details:', error);
        // Fallback to user data from auth store
        if (user) {
          setEmployee({
            empId: user.empId,
            fullName: user.fullName || 'Unknown User',
            email: user.email || '',
            roleName: user.roleName || 'Employee',
            departmentName: user.departmentName || 'N/A',
            isActive: true,
          });
          // Set default expiry for testing
          setDaysUntilPasswordExpiry(45);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployeeDetails();
  }, [user]);

  const handleViewProfile = () => {
    setIsDropdownOpen(false);
    navigate('/operations/employee/profile');
  };

  const handleSettings = () => {
    setIsDropdownOpen(false);
    navigate('/operations/settings');
  };

  const handleChangePassword = () => {
    setIsDropdownOpen(false);
    navigate('/auth/change-password');
  };

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    setIsLoggingOut(true);

    try {
      // Call backend logout endpoint
      console.log('🚪 Logging out...');
      await apiClient.post('/auth/logout');
      console.log('✅ Backend logout successful');
    } catch (error) {
      console.error('❌ Backend logout failed:', error);
      // Continue with frontend logout even if backend fails
    } finally {
      // Clear frontend state and storage
      logout();
      setIsLoggingOut(false);
      
      // Redirect to login
      navigate('/auth/login', { replace: true });
    }
  };

  const getPasswordExpiryBadge = () => {
    console.log('🎨 Rendering badge for days:', daysUntilPasswordExpiry);
    
    if (daysUntilPasswordExpiry === null) {
      console.log('❌ No days data, returning null');
      return null;
    }

    if (daysUntilPasswordExpiry <= 0) {
      return (
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 border border-red-300 rounded-full">
          <AlertTriangle className="w-4 h-4 text-red-700" />
          <span className="text-xs font-semibold text-red-700">Password Expired</span>
        </div>
      );
    }

    if (daysUntilPasswordExpiry <= 7) {
      return (
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 border border-red-300 rounded-full">
          <Key className="w-4 h-4 text-red-700" />
          <span className="text-xs font-semibold text-red-700">
            {daysUntilPasswordExpiry} day{daysUntilPasswordExpiry > 1 ? 's' : ''} left
          </span>
        </div>
      );
    }

    if (daysUntilPasswordExpiry <= 15) {
      return (
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-100 border border-yellow-300 rounded-full">
          <Key className="w-4 h-4 text-yellow-700" />
          <span className="text-xs font-semibold text-yellow-700">
            {daysUntilPasswordExpiry} days left
          </span>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 border border-green-300 rounded-full">
        <Key className="w-4 h-4 text-green-700" />
        <span className="text-xs font-semibold text-green-700">
          {daysUntilPasswordExpiry} days left
        </span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-3">
        <button className="p-2 hover:bg-gray-100 rounded-lg">
          <Bell className="w-5 h-5 text-gray-600" />
        </button>
        <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse" />
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="flex items-center gap-3">
        <button className="p-2 hover:bg-gray-100 rounded-lg">
          <Bell className="w-5 h-5 text-gray-600" />
        </button>
        <div className="w-10 h-10 bg-gray-300 rounded-full" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      {/* Notifications */}
      <button className="relative p-2 hover:bg-gray-100 rounded-lg transition">
        <Bell className="w-5 h-5 text-gray-600" />
        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
      </button>

      {/* Employee Profile Dropdown */}
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-3 hover:bg-gray-100 px-3 py-2 rounded-lg transition"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm">
            <span className="text-white font-semibold text-sm">
              {employee.fullName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="text-left hidden md:block">
            <p className="text-sm font-semibold text-gray-900">{employee.fullName}</p>
            <p className="text-xs text-gray-600">{employee.roleName}</p>
          </div>
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsDropdownOpen(false)}
            />
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
              {/* Profile Info */}
              <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
                    <span className="text-white font-bold text-lg">
                      {employee.fullName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{employee.fullName}</p>
                    <p className="text-xs text-gray-600 truncate">{employee.email}</p>
                    <p className="text-xs text-gray-500 font-mono">{employee.empId}</p>
                  </div>
                </div>

                {/* Password Expiry Badge */}
                {daysUntilPasswordExpiry !== null && (
                  <div className="mb-3">
                    {getPasswordExpiryBadge()}
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white rounded-lg p-2">
                    <p className="text-gray-600">Department</p>
                    <p className="font-semibold text-gray-900 truncate">{employee.departmentName}</p>
                  </div>
                  <div className="bg-white rounded-lg p-2">
                    <p className="text-gray-600">Role</p>
                    <p className="font-semibold text-gray-900 truncate">{employee.roleName}</p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-2">
                <button 
                  onClick={handleViewProfile}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition text-sm group"
                >
                  <User className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
                  <span className="text-gray-700 group-hover:text-blue-600 font-medium">
                    View Full Profile
                  </span>
                </button>

                <button 
                  onClick={handleChangePassword}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition text-sm group"
                >
                  <Key className="w-4 h-4 text-gray-600 group-hover:text-purple-600" />
                  <span className="text-gray-700 group-hover:text-purple-600 font-medium">
                    Change Password
                  </span>
                </button>
                
                <button 
                  onClick={handleSettings}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-100 rounded-lg transition text-sm group"
                >
                  <Settings className="w-4 h-4 text-gray-600 group-hover:text-gray-900" />
                  <span className="text-gray-700 group-hover:text-gray-900 font-medium">
                    Settings
                  </span>
                </button>
              </div>

              {/* Logout */}
              <div className="p-2 border-t border-gray-200">
                <button 
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-red-50 rounded-lg transition text-sm group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <LogOut className="w-4 h-4 text-red-500 group-hover:text-red-600" />
                  <span className="text-red-600 group-hover:text-red-700 font-medium">
                    {isLoggingOut ? 'Logging out...' : 'Logout'}
                  </span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EmployeeProfileSection;
