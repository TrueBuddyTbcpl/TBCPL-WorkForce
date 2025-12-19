import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Users, Calendar, AlertCircle } from 'lucide-react';
import { investigationSchema } from '../utils/caseValidation';
import { availableEmployees, availableCulprits } from '../data/caseOptions';
import type { InvestigationDetails } from '../types/case.types';
import MultiSelectDropdown from '../../../common/MultiSelectDropdown';

interface Props {
  initialData?: InvestigationDetails | null;
  onComplete: (data: InvestigationDetails) => void;
  onBack: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

const TeamAssignment = ({ initialData, onComplete }: Props) => {
  const [assignedEmployees, setAssignedEmployees] = useState<string[]>(
    initialData?.assignedEmployees || []
  );
  const [linkedCulprits, setLinkedCulprits] = useState<string[]>(
    initialData?.linkedCulprits || []
  );

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<InvestigationDetails>({
    resolver: zodResolver(investigationSchema),
    defaultValues: initialData || {
      assignedEmployees: [],
      linkedCulprits: [],  // ✅ Now required, not optional
    },
  });

  const handleEmployeeChange = (employees: string[]) => {
    setAssignedEmployees(employees);
    setValue('assignedEmployees', employees, { shouldValidate: true });
  };

  const handleCulpritChange = (culprits: string[]) => {
    setLinkedCulprits(culprits);
    setValue('linkedCulprits', culprits);
  };

  const onSubmit = (data: InvestigationDetails) => {
    onComplete({
      ...data,
      assignedEmployees,
      linkedCulprits,
    });
  };

  const employeeOptions = availableEmployees.map(emp => ({
    value: emp.id,
    label: `${emp.name} - ${emp.role}`,
    ...emp,
  }));

  const culpritOptions = availableCulprits.map(culprit => ({
    value: culprit.id,
    label: `${culprit.id} - ${culprit.name}`,
    ...culprit,
  }));

  const getSelectedEmployees = () => {
    return assignedEmployees.map(empId =>
      availableEmployees.find(e => e.id === empId)
    ).filter(Boolean);
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Users className="w-7 h-7 text-blue-600" />
          Team Assignment & Investigation Setup
        </h2>
        <p className="text-sm text-gray-600 mt-1">Assign team members and link culprit profiles</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Assigned Employees */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Assign Team Members <span className="text-red-500">*</span>
          </label>
          
          {errors.assignedEmployees && (
            <div className="mb-3 flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{errors.assignedEmployees.message}</p>
            </div>
          )}

          <MultiSelectDropdown
            options={employeeOptions}
            selectedValues={assignedEmployees}
            onChange={handleEmployeeChange}
            placeholder="Select employees to work on this case..."
            label=""
          />
          <p className="text-xs text-gray-500 mt-1">
            <strong>Required:</strong> Select one or more employees who will be investigating this case
          </p>

          {/* Selected Employees Display */}
          {assignedEmployees.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium text-gray-700">
                Assigned Team ({assignedEmployees.length}):
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {getSelectedEmployees().map((employee) => (
                  <div
                    key={employee?.id}
                    className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg"
                  >
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {employee?.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{employee?.name}</p>
                      <p className="text-xs text-gray-600">{employee?.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Linked Culprit Profiles */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Link Culprit Profiles (Optional)
          </label>
          <MultiSelectDropdown
            options={culpritOptions}
            selectedValues={linkedCulprits}
            onChange={handleCulpritChange}
            placeholder="Select culprit profiles to link to this case..."
            label=""
          />
          <p className="text-xs text-gray-500 mt-1">
            Link existing culprit profiles to this case. You can add more profiles later from the case dashboard.
          </p>
        </div>

        {/* Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="inline w-4 h-4 mr-1" />
              Estimated Completion Date
            </label>
            <input
              type="date"
              {...register('estimatedCompletionDate')}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Actual Completion Date
            </label>
            <input
              type="date"
              {...register('actualCompletionDate')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
              disabled
            />
            <p className="text-xs text-gray-500 mt-1">Will be set when case is closed</p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            disabled={assignedEmployees.length === 0}
          >
            Create Case
          </button>
          {assignedEmployees.length === 0 && (
            <p className="text-xs text-red-600 text-center mt-2">
              Please assign at least one team member to continue
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default TeamAssignment;
