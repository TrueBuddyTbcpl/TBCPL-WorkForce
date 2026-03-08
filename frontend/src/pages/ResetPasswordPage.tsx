// src/pages/ResetPasswordPage.tsx
import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { confirmPasswordReset } from '../services/api/password.api';
import PasswordRequirements, { isPasswordValid } from '../components/common/PasswordRequirements';

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') ?? '';

  const [form, setForm] = useState({ newPassword: '', confirmPassword: '' });
  const [show, setShow] = useState({ new: false, confirm: false });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const mutation = useMutation({
    mutationFn: () =>
      confirmPasswordReset(token, form.newPassword, form.confirmPassword),
    onSuccess: () => {
      toast.success('Password reset successfully! Please log in.');
      navigate('/auth/login');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Reset link is invalid or expired.');
    },
  });

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.newPassword) e.newPassword = 'New password is required';
    else if (!isPasswordValid(form.newPassword)) e.newPassword = 'Password does not meet all requirements';
    if (!form.confirmPassword) e.confirmPassword = 'Please confirm your password';
    else if (form.newPassword !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) { toast.error('Invalid reset link'); return; }
    if (validate()) mutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden">
        <div className="bg-gradient-to-br from-[#0f1923] to-[#1a2235] p-8 text-center">
          <p className="text-[#4BA3D4] text-2xl font-black tracking-widest">TRUE BUDDY</p>
          <span className="bg-[#4BA3D4] text-white text-xs font-bold italic tracking-widest px-4 py-1 rounded mt-1 inline-block">
            Consulting
          </span>
        </div>

        <div className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-purple-100 p-3 rounded-xl">
              <Lock className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Set New Password</h1>
              <p className="text-sm text-gray-500">Enter your new password below</p>
            </div>
          </div>

          {!token ? (
            <div className="text-center py-6">
              <p className="text-red-600 font-medium">Invalid or missing reset token.</p>
              <button onClick={() => navigate('/login')}
                className="mt-4 text-blue-600 hover:underline text-sm">
                Back to Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  New Password *
                </label>
                <div className="relative">
                  <input
                    type={show.new ? 'text' : 'password'}
                    value={form.newPassword}
                    onChange={e => setForm(f => ({ ...f, newPassword: e.target.value }))}
                    className={`w-full px-3 py-2.5 pr-10 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                      errors.newPassword ? 'border-red-500' : 'border-gray-200'}`}
                    placeholder="Enter new password"
                  />
                  <button type="button"
                    onClick={() => setShow(s => ({ ...s, new: !s.new }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {show.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <PasswordRequirements password={form.newPassword} />
                {errors.newPassword && (
                  <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Confirm New Password *
                </label>
                <div className="relative">
                  <input
                    type={show.confirm ? 'text' : 'password'}
                    value={form.confirmPassword}
                    onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                    className={`w-full px-3 py-2.5 pr-10 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-200'}`}
                    placeholder="Confirm new password"
                  />
                  <button type="button"
                    onClick={() => setShow(s => ({ ...s, confirm: !s.confirm }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {show.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              <button type="submit" disabled={mutation.isPending}
                className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 font-medium flex items-center justify-center gap-2">
                {mutation.isPending ? (
                  <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />Resetting...</>
                ) : (
                  <><Lock className="w-4 h-4" />Reset Password</>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
