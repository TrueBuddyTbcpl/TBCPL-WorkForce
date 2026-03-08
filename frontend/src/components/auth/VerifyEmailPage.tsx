import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle, XCircle, Shield } from 'lucide-react';
import apiClient from '../../services/api/apiClient';

type Status = 'loading' | 'success' | 'error';

const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link. No token found.');
      return;
    }

    const verify = async () => {
      try {
        const response = await apiClient.get(
          `/auth/verify-email?token=${token}`
        );
        setStatus('success');
        setMessage(
          response.data?.message ||
          'Email verified successfully! Please login to access your dashboard.'
        );
        // Redirect to login after 3 seconds
        setTimeout(() => navigate('/auth/login', { replace: true }), 3000);
      } catch (err: any) {
        setStatus('error');
        setMessage(
          err?.response?.data?.message ||
          'Verification failed. The link may be expired or already used.'
        );
      }
    };

    verify();
  }, []);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        background: 'linear-gradient(135deg, #0f1923 0%, #1a2235 50%, #0d1520 100%)',
      }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-10 text-center"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
        }}
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-1 mb-6">
          <div className="w-3 h-3 border-t-2 border-l-2 border-[#4BA3D4]" />
          <p
            className="text-xl font-black tracking-widest"
            style={{ color: 'transparent', WebkitTextStroke: '1.5px #4BA3D4' }}
          >
            TRUE BUDDY
          </p>
          <div className="w-3 h-3 border-t-2 border-r-2 border-[#4BA3D4]" />
        </div>
        <div className="bg-[#4BA3D4] px-4 py-1 rounded-md inline-block mb-8">
          <p className="text-white text-xs font-bold tracking-widest italic">
            Consulting
          </p>
        </div>

        {/* Status Icon */}
        <div className="flex justify-center mb-6">
          {status === 'loading' && (
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{
                background: 'rgba(75,163,212,0.1)',
                border: '1px solid rgba(75,163,212,0.3)',
              }}
            >
              <Loader2 className="w-10 h-10 animate-spin text-[#4BA3D4]" />
            </div>
          )}
          {status === 'success' && (
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{
                background: 'rgba(52,211,153,0.1)',
                border: '1px solid rgba(52,211,153,0.3)',
              }}
            >
              <CheckCircle className="w-10 h-10 text-emerald-400" />
            </div>
          )}
          {status === 'error' && (
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.3)',
              }}
            >
              <XCircle className="w-10 h-10 text-red-400" />
            </div>
          )}
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-white mb-3">
          {status === 'loading' && 'Verifying your email…'}
          {status === 'success' && 'Email Verified!'}
          {status === 'error' && 'Verification Failed'}
        </h2>

        {/* Message */}
        <p
          className="text-sm leading-relaxed mb-6"
          style={{
            color:
              status === 'success'
                ? '#34d399'
                : status === 'error'
                ? '#f87171'
                : '#9ca3af',
          }}
        >
          {status === 'loading'
            ? 'Please wait while we verify your email address.'
            : message}
        </p>

        {/* Redirect notice or action */}
        {status === 'success' && (
          <p className="text-xs text-gray-500">
            Redirecting to login in 3 seconds…
          </p>
        )}

        {status === 'error' && (
          <button
            onClick={() => navigate('/auth/login', { replace: true })}
            className="mt-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
            style={{
              background: 'linear-gradient(135deg, #4BA3D4 0%, #2980b9 100%)',
              boxShadow: '0 4px 20px rgba(75,163,212,0.3)',
            }}
          >
            Back to Login
          </button>
        )}

        {/* Security note */}
        <div
          className="mt-8 px-4 py-3 rounded-xl flex items-start gap-2 text-left"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <Shield className="w-3.5 h-3.5 text-gray-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-gray-500 leading-relaxed">
            Verification links expire after 24 hours and can only be used once.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
