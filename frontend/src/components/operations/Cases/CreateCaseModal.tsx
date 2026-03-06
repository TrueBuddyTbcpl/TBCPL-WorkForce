import { useState } from 'react';
import {
  X,
  Users,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Search,
  Briefcase,
} from 'lucide-react';
import { useOperationsEmployees } from '../../../hooks/cases/useOperationsEmployees';
import type { OperationsEmployee } from '../../../hooks/cases/useOperationsEmployees';

interface Props {
  prereportId: number;
  reportId: string;
  clientName: string;
  onConfirm: (prereportId: number, assignedEmployeeEmpIds: string[]) => void;
  onClose: () => void;
  isCreating: boolean;
}

const CreateCaseModal = ({
  prereportId,
  reportId,
  clientName,
  onConfirm,
  onClose,
  isCreating,
}: Props) => {
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [search, setSearch] = useState('');

  const { data: employees = [], isLoading, isError } = useOperationsEmployees();

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.fullName.toLowerCase().includes(search.toLowerCase()) ||
      emp.empId.toLowerCase().includes(search.toLowerCase()) ||
      emp.roleName.toLowerCase().includes(search.toLowerCase())
  );

  const toggleEmployee = (empId: string) => {
    setSelectedEmployees((prev) =>
      prev.includes(empId)
        ? prev.filter((id) => id !== empId)
        : [...prev, empId]
    );
  };

  const getSelectedDetails = (): OperationsEmployee[] =>
    employees.filter((e) => selectedEmployees.includes(e.empId));

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">

        {/* ── Header ─────────────────────────────────────────────── */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Create New Case</h2>
              <p className="text-sm text-gray-500">Assign Operations team members</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isCreating}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* ── Pre-Report Info ─────────────────────────────────────── */}
        <div className="px-6 py-3 bg-blue-50 border-b border-blue-100">
          <div className="flex items-center justify-between text-sm">
            <div>
              <span className="text-gray-500">Pre-Report:</span>
              <span className="ml-2 font-semibold text-blue-700 font-mono">{reportId}</span>
            </div>
            <div>
              <span className="text-gray-500">Client:</span>
              <span className="ml-2 font-semibold text-gray-900">{clientName}</span>
            </div>
          </div>
        </div>

        {/* ── Body ───────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
              <Users className="w-4 h-4 text-blue-600" />
              Assign Employees
              <span className="text-red-500">*</span>
              <span className="ml-auto text-xs text-gray-400 font-normal">
                Operations dept only
              </span>
            </label>

            {/* Search */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, ID or role..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Employee List */}
            {isLoading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                <span className="ml-2 text-sm text-gray-600">
                  Loading Operations employees...
                </span>
              </div>
            ) : isError ? (
              <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <span className="text-sm text-red-600">
                  Failed to load employees. Please try again.
                </span>
              </div>
            ) : filteredEmployees.length === 0 ? (
              <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <Users className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                <p className="text-sm text-gray-500">
                  {search ? 'No employees match your search' : 'No Operations employees found'}
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {filteredEmployees.map((emp) => {
                  const isSelected = selectedEmployees.includes(emp.empId);
                  return (
                    <div
                      key={emp.empId}
                      onClick={() => toggleEmployee(emp.empId)}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all select-none ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50 shadow-sm'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                      }`}
                    >
                      {/* Avatar */}
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${
                          isSelected ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        {emp.fullName.charAt(0).toUpperCase()}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {emp.fullName}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-gray-500 font-mono">{emp.empId}</span>
                          <span className="text-gray-300">•</span>
                          <span className="text-xs text-gray-500">{emp.roleName}</span>
                        </div>
                      </div>

                      {/* Checkmark */}
                      {isSelected && (
                        <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Selected summary chips */}
          {selectedEmployees.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-xs font-semibold text-green-800 mb-2">
                Selected ({selectedEmployees.length}):
              </p>
              <div className="flex flex-wrap gap-2">
                {getSelectedDetails().map((emp) => (
                  <span
                    key={emp.empId}
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-green-300 text-green-800 text-xs rounded-full font-medium"
                  >
                    {emp.fullName}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleEmployee(emp.empId);
                      }}
                      className="text-green-500 hover:text-red-500 transition-colors ml-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Footer ─────────────────────────────────────────────── */}
        <div className="p-6 border-t border-gray-200 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isCreating}
            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(prereportId, selectedEmployees)}
            disabled={selectedEmployees.length === 0 || isCreating}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
          >
            {isCreating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating Case...
              </>
            ) : (
              <>
                <Briefcase className="w-4 h-4" />
                Create Case
                {selectedEmployees.length > 0 && (
                  <span className="bg-white text-green-700 text-xs font-bold px-1.5 py-0.5 rounded-full ml-1">
                    {selectedEmployees.length}
                  </span>
                )}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateCaseModal;
