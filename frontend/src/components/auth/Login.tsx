import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Briefcase, 
  Calculator, 
  Users, 
  Lock,
  ArrowRight,
  Building2
} from 'lucide-react';

interface RoleCard {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  route: string;
  enabled: boolean;
  color: string;
  bgColor: string;
  borderColor: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [hoveredRole, setHoveredRole] = useState<string | null>(null);

  const roles: RoleCard[] = [
    {
      id: 'admin',
      title: 'Administrator',
      description: 'Full system access and management',
      icon: Shield,
      route: '/admin',
      enabled: true,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
    },
    {
      id: 'operations',
      title: 'Operations',
      description: 'Case and investigation management',
      icon: Briefcase,
      route: '/operations/dashboard',
      enabled: true,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      id: 'accounts',
      title: 'Accounts',
      description: 'Financial and billing management',
      icon: Calculator,
      route: '/account/dashboard',
      enabled: false,
      color: 'text-gray-400',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
    },
    {
      id: 'hr',
      title: 'Human Resource',
      description: 'Employee and recruitment management',
      icon: Users,
      route: '/hr/dashboard',
      enabled: false,
      color: 'text-gray-400',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
    },
  ];

  const handleRoleClick = (role: RoleCard) => {
    if (role.enabled) {
      navigate(role.route);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Building2 className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            TBCPL Workforce
          </h1>
          <p className="text-lg text-gray-600">
            Select your department to access the system
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {roles.map((role) => {
            const Icon = role.icon;
            const isHovered = hoveredRole === role.id;
            
            return (
              <button
                key={role.id}
                onClick={() => handleRoleClick(role)}
                onMouseEnter={() => role.enabled && setHoveredRole(role.id)}
                onMouseLeave={() => setHoveredRole(null)}
                disabled={!role.enabled}
                className={`relative p-6 rounded-2xl border-2 transition-all duration-300 ${
                  role.enabled
                    ? `${role.bgColor} ${role.borderColor} hover:shadow-2xl hover:scale-105 cursor-pointer ${
                        isHovered ? 'shadow-2xl scale-105' : 'shadow-md'
                      }`
                    : 'bg-gray-50 border-gray-200 cursor-not-allowed opacity-60'
                }`}
                aria-label={`${role.title} login ${!role.enabled ? '(Currently unavailable)' : ''}`}
                aria-disabled={!role.enabled}
              >
                {/* Disabled Badge */}
                {!role.enabled && (
                  <div className="absolute top-3 right-3">
                    <div className="flex items-center gap-1 px-2 py-1 bg-gray-200 text-gray-600 rounded-full text-xs font-medium">
                      <Lock className="w-3 h-3" />
                      <span>Disabled</span>
                    </div>
                  </div>
                )}

                {/* Icon */}
                <div
                  className={`w-16 h-16 rounded-xl flex items-center justify-center mb-4 ${
                    role.enabled
                      ? `${role.bgColor} ${role.color} ${isHovered ? 'scale-110' : ''}`
                      : 'bg-gray-100 text-gray-400'
                  } transition-transform duration-300`}
                >
                  <Icon className="w-8 h-8" />
                </div>

                {/* Title and Description */}
                <div className="text-left mb-4">
                  <h3
                    className={`text-xl font-bold mb-2 ${
                      role.enabled ? 'text-gray-900' : 'text-gray-500'
                    }`}
                  >
                    {role.title}
                  </h3>
                  <p
                    className={`text-sm ${
                      role.enabled ? 'text-gray-600' : 'text-gray-400'
                    }`}
                  >
                    {role.description}
                  </p>
                </div>

                {/* Action Button/Message */}
                {role.enabled ? (
                  <div className="flex items-center justify-between text-sm font-medium">
                    <span className={role.color}>Access Dashboard</span>
                    <ArrowRight className={`w-5 h-5 ${role.color} ${isHovered ? 'translate-x-1' : ''} transition-transform`} />
                  </div>
                ) : (
                  <div className="text-xs text-gray-500 bg-gray-100 px-3 py-2 rounded-lg">
                    This module is currently unavailable
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Help Text */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Access Information</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span><strong>Administrator</strong> - Full access to all system features and employee management</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span><strong>Operations</strong> - Access to cases, profiles, and investigation reports</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-0.5">✗</span>
                  <span className="text-gray-500"><strong>Accounts & HR</strong> - These modules are currently under development</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-600">
            Need help accessing your account?{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
              Contact Support
            </a>
          </p>
          <p className="text-xs text-gray-500 mt-4">
            © 2026 TBCPL Workforce. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
