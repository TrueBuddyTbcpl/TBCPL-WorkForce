import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ChangePasswordForm } from '../../components/auth/ChangePasswordForm';
import { Button } from '../../components/common/Button';
import { useAuthStore } from '../../stores/authStore';

export const ChangePasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Change Password</h1>
            <p className="text-sm text-gray-600 mt-2">
              Update your password for <span className="font-medium">{user?.email}</span>
            </p>
          </div>

          {/* Form */}
          <ChangePasswordForm />
        </div>

        {/* Security Tips */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">Security Tips:</h3>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Use a unique password that you don't use for other accounts</li>
            <li>Avoid using personal information in your password</li>
            <li>Change your password regularly (every 90 days recommended)</li>
            <li>Never share your password with anyone</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
