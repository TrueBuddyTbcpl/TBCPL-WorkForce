import React from 'react';
import type { ViewMode } from './types/superAdmin.types';
import {
  Users, Briefcase, UserCheck, FileText, Building2,
  ClipboardCheck, FileSignature, ScrollText,
  Star, Clock, ChevronDown, Shield,
} from 'lucide-react';

interface Props {
  viewMode: ViewMode;
  collapsed: boolean;
  onViewChange: (mode: ViewMode, path: string) => void;
}

interface NavItem {
  mode: ViewMode;
  label: string;
  icon: React.ElementType;
  path: string;
}

const NAV_ITEMS: NavItem[] = [
  { mode: 'employees',    label: 'Employees',         icon: Users,          path: '/super-admin'              },
  { mode: 'cases',        label: 'Cases',             icon: Briefcase,      path: '/super-admin/cases'        },
  { mode: 'profiles',     label: 'Offender Profiles', icon: UserCheck,      path: '/super-admin/profiles'     },
  { mode: 'prereports',   label: 'Pre-Reports',       icon: FileText,       path: '/super-admin/pre-reports'  },
  { mode: 'clients',      label: 'Clients',           icon: Building2,      path: '/super-admin/clients'      },
  { mode: 'finalreports', label: 'Final Reports',     icon: ClipboardCheck, path: '/super-admin/finalreports' },
  { mode: 'loa',          label: 'Auth Letters',      icon: FileSignature,  path: '/super-admin/loa'          },
  { mode: 'proposals',    label: 'Proposals',         icon: ScrollText,     path: '/super-admin/proposals'    },
];

const SuperAdminSidebar: React.FC<Props> = ({ viewMode, collapsed, onViewChange }) => (
  <aside className={`
    flex-shrink-0 flex flex-col pt-2 pb-6
    transition-all duration-300
    ${collapsed ? 'w-16' : 'w-60'}
    bg-white/10 backdrop-blur-xl border-r border-white/20
  `}>

    {/* ── Nav Items ── */}
    <div className="flex-1 px-2 space-y-0.5 mt-2">
      {NAV_ITEMS.map(({ mode, label, icon: Icon, path }) => {
        const isActive = viewMode === mode;
        return (
          <button
            key={mode}
            onClick={() => onViewChange(mode, path)}
            title={collapsed ? label : undefined}
            className={`
              w-full flex items-center gap-3 py-2.5 rounded-r-full
              transition-all duration-150 text-sm font-medium text-left
              [text-shadow:0_1px_4px_rgba(0,0,0,0.5)]
              ${collapsed ? 'justify-center px-3' : 'pl-5 pr-4'}
              ${isActive
                ? 'bg-white/20 text-white border-r-2 border-white shadow-sm'
                : 'text-white/70 hover:bg-white/15 hover:text-white'
              }
            `}
          >
            <Icon className={`w-5 h-5 flex-shrink-0
              drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]
              ${isActive ? 'text-white' : 'text-white/60'}`}
            />
            {!collapsed && (
              <>
                <span className="flex-1 truncate">{label}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white
                    shadow-sm shadow-white/50 flex-shrink-0" />
                )}
              </>
            )}
          </button>
        );
      })}
    </div>

    {/* ── Divider ── */}
    {!collapsed && <div className="mx-4 my-3 h-px bg-white/20" />}

    {/* ── Utility Items ── */}
    {!collapsed && (
      <div className="px-2 space-y-0.5">
        {[
          { icon: Star,        label: 'Starred' },
          { icon: Clock,       label: 'Recent'  },
          { icon: ChevronDown, label: 'More'    },
        ].map(({ icon: Icon, label }) => (
          <button key={label}
            className="w-full flex items-center gap-3 pl-5 pr-4 py-2.5
              rounded-r-full text-sm text-white/50
              hover:bg-white/15 hover:text-white transition
              [text-shadow:0_1px_4px_rgba(0,0,0,0.4)]">
            <Icon className="w-5 h-5 text-white/40
              drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)]" />
            <span>{label}</span>
          </button>
        ))}
      </div>
    )}

    {/* ── Footer ── */}
    {!collapsed && (
      <div className="px-5 pt-4 mt-2 border-t border-white/20">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-5 h-5 rounded flex items-center justify-center
            bg-white/20 backdrop-blur-sm">
            <Shield className="w-3 h-3 text-white
              drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]" />
          </div>
          <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest
            [text-shadow:0_1px_3px_rgba(0,0,0,0.5)]">
            True Buddy Consulting
          </p>
        </div>
        <p className="text-[10px] text-white/40 pl-7
          [text-shadow:0_1px_3px_rgba(0,0,0,0.4)]">
          Super Admin Panel v1.0
        </p>
      </div>
    )}
  </aside>
);

export default SuperAdminSidebar;
