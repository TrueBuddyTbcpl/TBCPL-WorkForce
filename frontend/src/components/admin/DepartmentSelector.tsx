import React, { useState, useRef, useEffect } from 'react';
import type { Department } from './types/admin.types';
import { ChevronDown, Building2, Users, Calculator } from 'lucide-react';

interface DepartmentSelectorProps {
  selectedDepartment: Department;
  onDepartmentChange: (dept: Department) => void;
}

const DepartmentSelector: React.FC<DepartmentSelectorProps> = ({
  selectedDepartment,
  onDepartmentChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const departments: { value: Department; label: string; icon: any; color: string }[] = [
    { value: 'Operations', label: 'Operations Department', icon: Building2, color: 'blue' },
    { value: 'HR', label: 'HR Department', icon: Users, color: 'green' },
    { value: 'Account', label: 'Account Department', icon: Calculator, color: 'purple' },
  ];

  const selectedDept = departments.find(d => d.value === selectedDepartment);
  const Icon = selectedDept?.icon || Building2;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-6 py-3 bg-white border-2 border-gray-300 rounded-lg hover:border-blue-500 transition min-w-[280px]"
      >
        <Icon className={`w-5 h-5 text-${selectedDept?.color}-600`} />
        <span className="flex-1 text-left font-semibold text-gray-900">
          {selectedDept?.label}
        </span>
        <ChevronDown className={`w-5 h-5 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-50">
          {departments.map((dept) => {
            const DeptIcon = dept.icon;
            const isSelected = dept.value === selectedDepartment;
            
            return (
              <button
                key={dept.value}
                onClick={() => {
                  onDepartmentChange(dept.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-6 py-3 hover:bg-gray-50 transition ${
                  isSelected ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                }`}
              >
                <DeptIcon className={`w-5 h-5 text-${dept.color}-600`} />
                <span className={`font-medium ${isSelected ? 'text-blue-600' : 'text-gray-900'}`}>
                  {dept.label}
                </span>
                {isSelected && (
                  <span className="ml-auto text-blue-600 text-sm">✓</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DepartmentSelector;
