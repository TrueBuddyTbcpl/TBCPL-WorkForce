import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Loader2, Shield, Lock, Mail } from 'lucide-react';
import { loginSchema, type LoginFormData } from '../../schemas/auth.schema';
import { useAuth } from '../../hooks/useAuth';
import { useAuthStore } from '../../stores/authStore';
import { storageHelper } from '../../utils/storageHelper';
import { STORAGE_KEYS } from '../../utils/constants';
import apiClient from '../../services/api/apiClient';
import { toast } from 'sonner';


export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, clearAuth } = useAuthStore();

  // FIX 1: Single useAuth() call — destructure everything together
  const {
    login,
    isLoggingIn,
    loginError,
    resetLoginError,
    resendVerification,
    isResending,
  } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [isValidatingToken, setIsValidatingToken] = useState(true);

  const {
    register,
    handleSubmit,
    getValues, // FIX 2: Use getValues instead of document.querySelector
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });


  useEffect(() => {
    const validateToken = async () => {
      if (isAuthenticated && user) {
        const token = storageHelper.get<string>(STORAGE_KEYS.AUTH_TOKEN);
        if (!token) { clearAuth(); setIsValidatingToken(false); return; }
        try {
          await apiClient.get('/auth/validate');
          const isAdmin = user?.roleName === 'SUPER_ADMIN' || user?.roleName === 'HR_MANAGER';
          const defaultRoute = isAdmin ? '/admin' : '/operations/dashboard';
          const from = (location.state as any)?.from?.pathname || defaultRoute;
          navigate(from, { replace: true });
        } catch {
          clearAuth();
        }
      }
      setIsValidatingToken(false);
    };
    validateToken();
  }, []);


  useEffect(() => {
    return () => { resetLoginError(); };
  }, [resetLoginError]);


  const onSubmit = (data: LoginFormData) => { login(data); };

  // FIX 3: Proper handler — reads email via getValues, wraps resendVerification correctly
  const handleResendVerification = () => {
    const emailValue = getValues('email');
    if (!emailValue) {
      toast.error('Please enter your email first.');
      return;
    }
    resendVerification(emailValue);
  };


  // ── Token validation loading ──────────────────────────────────────
  if (isValidatingToken) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #0f1923 0%, #1a2235 50%, #0d1520 100%)' }}
      >
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mx-auto mb-4">
            <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
          </div>
          <p className="text-gray-400 text-sm">Verifying your session…</p>
        </div>
      </div>
    );
  }


  return (
    <div
      className="min-h-screen flex"
      style={{ background: 'linear-gradient(135deg, #0f1923 0%, #1a2235 50%, #0d1520 100%)' }}
    >
      {/* ── LEFT PANEL — Branding ────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12 relative overflow-hidden">

        {/* Background decorative circles */}
        <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, #4BA3D4, transparent)' }} />
        <div className="absolute bottom-[-80px] right-[-80px] w-[300px] h-[300px] rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, #4BA3D4, transparent)' }} />

        {/* Logo + content */}
        <div className="relative z-10 text-center">

          {/* Logo box */}
          <div
            className="inline-flex items-center justify-center mb-8 px-8 py-6 rounded-2xl"
            style={{
              background: 'rgba(75, 163, 212, 0.08)',
              border: '1px solid rgba(75, 163, 212, 0.2)',
              boxShadow: '0 0 60px rgba(75, 163, 212, 0.1)',
            }}
          >
            <div className="text-center">
              <div className="flex items-center gap-1 mb-1">
                <div className="w-4 h-4 border-t-2 border-l-2 border-[#4BA3D4]" />
                <p
                  className="text-4xl font-black tracking-[0.15em] px-2"
                  style={{
                    color: 'transparent',
                    WebkitTextStroke: '2px #4BA3D4',
                    letterSpacing: '0.15em',
                  }}
                >
                  TRUE BUDDY
                </p>
                <div className="w-4 h-4 border-t-2 border-r-2 border-[#4BA3D4]" />
              </div>
              <div className="bg-[#4BA3D4] px-6 py-1.5 rounded-md">
                <p className="text-white text-xl font-bold tracking-widest italic">
                  Consulting
                </p>
              </div>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-white mb-3">
            Universal Management
          </h1>

          <p className="text-gray-400 text-base max-w-sm leading-relaxed mx-auto">
            A unified management platform serving all departments of
            <span className="text-[#4BA3D4] font-medium"> True Buddy Consulting Pvt. Ltd.</span>
          </p>

          <div className="flex flex-wrap gap-3 justify-center mt-8">
            {[
              { label: 'Admin', color: 'rgba(75,163,212,0.15)', border: 'rgba(75,163,212,0.3)', text: '#4BA3D4' },
              { label: 'Operations', color: 'rgba(99,179,237,0.15)', border: 'rgba(99,179,237,0.3)', text: '#63b3ed' },
              { label: 'Human Resource', color: 'rgba(129,140,248,0.15)', border: 'rgba(129,140,248,0.3)', text: '#818cf8' },
              { label: 'Accounts', color: 'rgba(52,211,153,0.15)', border: 'rgba(52,211,153,0.3)', text: '#34d399' },
            ].map(({ label, color, border, text }) => (
              <span
                key={label}
                className="px-4 py-1.5 text-xs font-semibold rounded-full"
                style={{ background: color, border: `1px solid ${border}`, color: text }}
              >
                {label}
              </span>
            ))}
          </div>

          <div
            className="w-24 h-px mx-auto mt-10"
            style={{ background: 'linear-gradient(90deg, transparent, #4BA3D4, transparent)' }}
          />
          <p className="text-gray-600 text-xs mt-4 tracking-widest uppercase">
            Secure · Reliable · Enterprise
          </p>
        </div>
      </div>


      {/* ── RIGHT PANEL — Login Form ─────────────────────────────────── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center gap-1 mb-2">
              <div className="w-3 h-3 border-t-2 border-l-2 border-[#4BA3D4]" />
              <p
                className="text-2xl font-black tracking-widest"
                style={{ color: 'transparent', WebkitTextStroke: '1.5px #4BA3D4' }}
              >
                TRUE BUDDY
              </p>
              <div className="w-3 h-3 border-t-2 border-r-2 border-[#4BA3D4]" />
            </div>
            <div className="bg-[#4BA3D4] px-4 py-1 rounded-md inline-block">
              <p className="text-white text-sm font-bold tracking-widest italic">Consulting</p>
            </div>
            <p className="text-gray-500 text-xs mt-3">Universal Management Platform</p>
          </div>

          {/* Form card */}
          <div
            className="rounded-2xl p-8"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
            }}
          >
            {/* Card header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="p-2 rounded-lg"
                  style={{
                    background: 'rgba(75, 163, 212, 0.15)',
                    border: '1px solid rgba(75, 163, 212, 0.3)',
                  }}
                >
                  <Shield className="w-5 h-5 text-[#4BA3D4]" />
                </div>
                <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
              </div>
              <p className="text-gray-400 text-sm ml-12">
                Sign in to access your workspace
              </p>
            </div>

            {/* Error */}
            {loginError && (
              <div
                className="mb-6 px-4 py-3 rounded-xl text-sm flex items-start gap-2"
                style={{
                  background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.3)',
                }}
              >
                <span className="text-red-400 mt-0.5">⚠</span>
                <span className="text-red-300">{loginError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="email"
                    placeholder="firstname.lastname@tbcpl.com"
                    {...register('email')}
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder-gray-600 outline-none transition-all"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: errors.email
                        ? '1px solid rgba(239,68,68,0.6)'
                        : '1px solid rgba(255,255,255,0.1)',
                    }}
                    onFocus={(e) => {
                      e.target.style.border = '1px solid rgba(75,163,212,0.6)';
                      e.target.style.background = 'rgba(75,163,212,0.05)';
                    }}
                    onBlur={(e) => {
                      e.target.style.border = errors.email
                        ? '1px solid rgba(239,68,68,0.6)'
                        : '1px solid rgba(255,255,255,0.1)';
                      e.target.style.background = 'rgba(255,255,255,0.05)';
                    }}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    {...register('password')}
                    className="w-full pl-10 pr-11 py-3 rounded-xl text-sm text-white placeholder-gray-600 outline-none transition-all"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: errors.password
                        ? '1px solid rgba(239,68,68,0.6)'
                        : '1px solid rgba(255,255,255,0.1)',
                    }}
                    onFocus={(e) => {
                      e.target.style.border = '1px solid rgba(75,163,212,0.6)';
                      e.target.style.background = 'rgba(75,163,212,0.05)';
                    }}
                    onBlur={(e) => {
                      e.target.style.border = errors.password
                        ? '1px solid rgba(239,68,68,0.6)'
                        : '1px solid rgba(255,255,255,0.1)';
                      e.target.style.background = 'rgba(255,255,255,0.05)';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.password.message}</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                style={{
                  background: isLoggingIn
                    ? 'rgba(75,163,212,0.5)'
                    : 'linear-gradient(135deg, #4BA3D4 0%, #2980b9 100%)',
                  boxShadow: isLoggingIn ? 'none' : '0 4px 20px rgba(75,163,212,0.3)',
                }}
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing in…
                  </>
                ) : (
                  'Sign In'
                )}
              </button>

            </form>

            {/* Security note */}
            <div
              className="mt-6 px-4 py-3 rounded-xl flex items-start gap-2"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <Shield className="w-3.5 h-3.5 text-gray-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-gray-500 leading-relaxed">
                For security, only one active session is allowed per account.
                Previous sessions will be terminated upon login.
              </p>
            </div>

            {loginError?.toLowerCase().includes('not verified') && (
              <div className="mt-4 text-center">
                {/* FIX 4: onClick uses named handler — not the mutate fn directly */}
                <button
                  type="button"
                  onClick={handleResendVerification}
                  disabled={isResending}
                  className="text-xs text-blue-400 hover:text-blue-300 underline flex items-center justify-center gap-1 mx-auto transition-colors"
                >
                  {isResending ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Resending...
                    </>
                  ) : (
                    <>
                      <Mail className="w-3 h-3" />
                      Didn't receive verification email? Resend
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-gray-600 mt-6">
            Need access? Contact your system administrator.
          </p>
          <p className="text-center text-xs text-gray-700 mt-2">
            © 2026 True Buddy Consulting Pvt. Ltd. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};


export default Login;
