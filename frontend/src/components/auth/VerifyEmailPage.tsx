import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle, XCircle, Clock, Shield } from 'lucide-react';

type Status = 'loading' | 'success' | 'already-used' | 'expired' | 'invalid' | 'error';

const STATUS_CONFIG: Record<Exclude<Status, 'loading'>, {
  icon: React.ReactNode;
  title: string;
  message: string;
  color: string;
  borderColor: string;
  textColor: string;
}> = {
  success: {
    icon: <CheckCircle className="w-10 h-10 text-emerald-400" />,
    title: 'Email Verified!',
    message: 'Your email has been verified successfully. Redirecting to login…',
    color: 'rgba(52,211,153,0.1)',
    borderColor: 'rgba(52,211,153,0.3)',
    textColor: '#34d399',
  },
  'already-used': {
    icon: <XCircle className="w-10 h-10 text-yellow-400" />,
    title: 'Already Verified',
    message: 'This verification link has already been used. Please login to your account.',
    color: 'rgba(251,191,36,0.1)',
    borderColor: 'rgba(251,191,36,0.3)',
    textColor: '#fbbf24',
  },
  expired: {
    icon: <Clock className="w-10 h-10 text-orange-400" />,
    title: 'Link Expired',
    message: 'Your verification link has expired. Please request a new one.',
    color: 'rgba(251,146,60,0.1)',
    borderColor: 'rgba(251,146,60,0.3)',
    textColor: '#fb923c',
  },
  invalid: {
    icon: <XCircle className="w-10 h-10 text-red-400" />,
    title: 'Invalid Link',
    message: 'This verification link is invalid or has already been used.',
    color: 'rgba(239,68,68,0.1)',
    borderColor: 'rgba(239,68,68,0.3)',
    textColor: '#f87171',
  },
  error: {
    icon: <XCircle className="w-10 h-10 text-red-400" />,
    title: 'Verification Failed',
    message: 'Something went wrong. Please try again or contact support.',
    color: 'rgba(239,68,68,0.1)',
    borderColor: 'rgba(239,68,68,0.3)',
    textColor: '#f87171',
  },
};

const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status>('loading');

  useEffect(() => {
    const statusParam = searchParams.get('status') as Exclude<Status, 'loading'> | null;

    if (!statusParam) {
      // No status param — invalid direct access
      setStatus('invalid');
      return;
    }

    const validStatuses: Exclude<Status, 'loading'>[] = [
      'success', 'already-used', 'expired', 'invalid', 'error'
    ];

    setStatus(validStatuses.includes(statusParam) ? statusParam : 'error');

    // Auto-redirect to login after 3 seconds on success
    if (statusParam === 'success') {
      setTimeout(() => navigate('/auth/login', { replace: true }), 3000);
    }
  }, []);

  const config = status !== 'loading' ? STATUS_CONFIG[status] : null;

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
          <p className="text-white text-xs font-bold tracking-widest italic">Consulting</p>
        </div>

        {/* Status Icon */}
        <div className="flex justify-center mb-6">
          {status === 'loading' ? (
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{
                background: 'rgba(75,163,212,0.1)',
                border: '1px solid rgba(75,163,212,0.3)',
              }}
            >
              <Loader2 className="w-10 h-10 animate-spin text-[#4BA3D4]" />
            </div>
          ) : (
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{
                background: config!.color,
                border: `1px solid ${config!.borderColor}`,
              }}
            >
              {config!.icon}
            </div>
          )}
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-white mb-3">
          {status === 'loading' ? 'Verifying your email…' : config!.title}
        </h2>

        {/* Message */}
        <p
          className="text-sm leading-relaxed mb-6"
          style={{
            color: status === 'loading' ? '#9ca3af' : config!.textColor,
          }}
        >
          {status === 'loading'
            ? 'Please wait while we process your request.'
            : config!.message}
        </p>

        {/* Success redirect notice */}
        {status === 'success' && (
          <p className="text-xs text-gray-500 mb-4">
            Redirecting to login in 3 seconds…
          </p>
        )}

        {/* Action button for non-success states */}
        {status !== 'loading' && status !== 'success' && (
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
