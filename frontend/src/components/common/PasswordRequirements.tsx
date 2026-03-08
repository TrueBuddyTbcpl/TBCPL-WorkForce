// src/components/common/PasswordRequirements.tsx
import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface PasswordRequirementsProps {
  password: string;
}

const rules = [
  { label: '8+ characters',       test: (p: string) => p.length >= 8 },
  { label: 'Uppercase letter',     test: (p: string) => /[A-Z]/.test(p) },
  { label: 'Lowercase letter',     test: (p: string) => /[a-z]/.test(p) },
  { label: 'Number',               test: (p: string) => /\d/.test(p) },
  { label: 'Special char (@#$%^&+=!)', test: (p: string) => /[@#$%^&+=!]/.test(p) },
];

export const validatePasswordStrength = (password: string): number =>
  rules.filter(r => r.test(password)).length;

export const isPasswordValid = (password: string): boolean =>
  rules.every(r => r.test(password));

const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({ password }) => {
  if (!password) return null;

  const strength = validatePasswordStrength(password);
  const strengthLabel = ['', 'Weak', 'Weak', 'Medium', 'Strong', 'Very Strong'][strength];
  const strengthColor = ['', 'bg-red-500', 'bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'][strength];
  const strengthText  = ['', 'text-red-600', 'text-red-600', 'text-yellow-600', 'text-blue-600', 'text-green-600'][strength];

  return (
    <div className="mt-2 space-y-2">
      {/* Strength bar */}
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-gray-500">Strength:</span>
        <span className={`text-xs font-semibold ${strengthText}`}>{strengthLabel}</span>
      </div>
      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${strengthColor}`}
          style={{ width: `${(strength / 5) * 100}%` }}
        />
      </div>

      {/* Rules checklist */}
      <div className="grid grid-cols-2 gap-1 pt-1">
        {rules.map((rule) => {
          const passed = rule.test(password);
          return (
            <span
              key={rule.label}
              className={`flex items-center gap-1 text-xs ${passed ? 'text-green-600' : 'text-gray-400'}`}
            >
              {passed
                ? <CheckCircle className="w-3 h-3 flex-shrink-0" />
                : <XCircle    className="w-3 h-3 flex-shrink-0" />}
              {rule.label}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default PasswordRequirements;
