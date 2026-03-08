// src/components/common/ChangePasswordModal.tsx
import React, { useState } from 'react';
import { X, Lock, Eye, EyeOff, Mail, KeyRound } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { changePassword, requestPasswordReset } from '../../services/api/password.api';
import PasswordRequirements, { isPasswordValid } from '../common/PasswordRequirements';

type Mode = 'select' | 'change' | 'reset-sent';

interface Props {
  onClose: () => void;
}

const ChangePasswordModal: React.FC<Props> = ({ onClose }) => {
  const [mode, setMode] = useState<Mode>('select');
  const [show, setShow] = useState({ current: false, new: false, confirm: false });
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const changeMutation = useMutation({
    mutationFn: () =>
      changePassword(form.currentPassword, form.newPassword, form.confirmPassword),
    onSuccess: () => {
      toast.success('Password changed successfully!');
      onClose();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to change password');
    },
  });

  const resetRequestMutation = useMutation({
    mutationFn: requestPasswordReset,
    onSuccess: () => setMode('reset-sent'),
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to send reset link');
    },
  });

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.currentPassword) e.currentPassword = 'Current password is required';
    if (!form.newPassword) e.newPassword = 'New password is required';
    else if (!isPasswordValid(form.newPassword)) e.newPassword = 'Password does not meet requirements';
    if (!form.confirmPassword) e.confirmPassword = 'Please confirm your password';
    else if (form.newPassword !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    if (form.currentPassword && form.currentPassword === form.newPassword)
      e.newPassword = 'New password must differ from current password';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) changeMutation.mutate();
  };

  const toggle = (field: keyof typeof show) =>
    setShow(s => ({ ...s, [field]: !s[field] }));

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <Lock className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Change Password</h2>
              <p className="text-xs text-gray-500">Keep your account secure</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* ── STEP 1: Select method ── */}
        {mode === 'select' && (
          <div className="p-6 space-y-3">
            <p className="text-sm text-gray-600 mb-4">How would you like to change your password?</p>

            <button
              onClick={() => setMode('change')}
              className="w-full flex items-start gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition group text-left"
            >
              <div className="bg-purple-100 p-2.5 rounded-lg group-hover:bg-purple-200 transition flex-shrink-0">
                <KeyRound className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">
                  I know my current password
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Enter your current password, then set a new one.
                </p>
              </div>
            </button>

            <button
              onClick={() => resetRequestMutation.mutate()}
              disabled={resetRequestMutation.isPending}
              className="w-full flex items-start gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition group text-left disabled:opacity-60"
            >
              <div className="bg-blue-100 p-2.5 rounded-lg group-hover:bg-blue-200 transition flex-shrink-0">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">
                  {resetRequestMutation.isPending ? 'Sending...' : 'Send reset link to my email'}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  We'll send a secure link to your registered email.
                </p>
              </div>
            </button>
          </div>
        )}

        {/* ── STEP 2: Change with current password ── */}
        {mode === 'change' && (
          <form onSubmit={handleChangeSubmit} className="p-6 space-y-4">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Current Password *
              </label>
              <div className="relative">
                <input
                  type={show.current ? 'text' : 'password'}
                  value={form.currentPassword}
                  onChange={e => setForm(f => ({ ...f, currentPassword: e.target.value }))}
                  className={`w-full px-3 py-2.5 pr-10 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                    errors.currentPassword ? 'border-red-500' : 'border-gray-200'}`}
                  placeholder="Enter current password"
                />
                <button type="button" onClick={() => toggle('current')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {show.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.currentPassword}</p>
              )}
            </div>

            {/* New Password */}
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
                <button type="button" onClick={() => toggle('new')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {show.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <PasswordRequirements password={form.newPassword} />
              {errors.newPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>
              )}
            </div>

            {/* Confirm Password */}
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
                <button type="button" onClick={() => toggle('confirm')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {show.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setMode('select')}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm">
                Back
              </button>
              <button type="submit" disabled={changeMutation.isPending}
                className="flex-1 px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 font-medium text-sm flex items-center justify-center gap-2">
                {changeMutation.isPending ? (
                  <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />Saving...</>
                ) : (
                  <><Lock className="w-4 h-4" />Update Password</>
                )}
              </button>
            </div>
          </form>
        )}

        {/* ── STEP 3: Reset link sent confirmation ── */}
        {mode === 'reset-sent' && (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Reset Link Sent!</h3>
            <p className="text-sm text-gray-600 mb-1">
              A password reset link has been sent to your registered email.
            </p>
            <p className="text-xs text-gray-400 mb-6">
              The link expires in <strong>1 hour</strong>. Check your spam folder if you don't see it.
            </p>
            <button onClick={onClose}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm">
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChangePasswordModal;
