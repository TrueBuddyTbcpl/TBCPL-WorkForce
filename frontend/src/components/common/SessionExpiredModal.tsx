import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface SessionExpiredModalProps {
  isOpen: boolean;
  onConfirm: () => void;
}

export const SessionExpiredModal: React.FC<SessionExpiredModalProps> = ({
  isOpen,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-6 animate-in fade-in zoom-in duration-200">
        {/* Icon */}
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <AlertTriangle className="h-6 w-6 text-red-600" />
        </div>

        {/* Content */}
        <div className="mt-4 text-center">
          <h3 className="text-lg font-semibold text-gray-900">
            Session Expired
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            Your session has expired. Please login again to continue.
          </p>
        </div>

        {/* Button */}
        <div className="mt-6">
          <button
            onClick={onConfirm}
            className="w-full inline-flex justify-center items-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Okay
          </button>
        </div>
      </div>
    </div>
  );
};
