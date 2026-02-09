import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { EmployeeForm } from '../../components/employee/EmployeeForm';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Toast, ToastContainer, useToast } from '../../components/common/Toast';
import { useEmployee, useUpdateEmployee } from '../../hooks/useEmployees';
import { getErrorMessage } from '../../utils/errorHandler';
import type { UpdateEmployeeFormData } from '../../schemas/employee.schema';

export const EmployeeEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { empId } = useParams<{ empId: string }>();
  const { toasts, success, error, removeToast } = useToast();

  const { data: employeeResponse, isLoading } = useEmployee(empId!);
  const updateEmployeeMutation = useUpdateEmployee();

  const handleSubmit = (data: UpdateEmployeeFormData) => {
    if (!empId) return;

    updateEmployeeMutation.mutate(
      { empId, data },
      {
        onSuccess: () => {
          success('Employee updated successfully!');
          setTimeout(() => {
            navigate('/admin/employees');
          }, 2000);
        },
        onError: (err) => {
          error(getErrorMessage(err));
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" text="Loading employee..." />
      </div>
    );
  }

  if (!employeeResponse?.data) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Employee not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <ToastContainer>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            type={toast.type}
            message={toast.message}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </ToastContainer>

      {/* Back Button */}
      <Button variant="ghost" onClick={() => navigate('/admin/employees')} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Employees
      </Button>

      {/* Form Container */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Edit Employee</h1>
          <p className="text-sm text-gray-600 mt-2">
            Update employee details for {employeeResponse.data.fullName}
          </p>
        </div>

        <EmployeeForm
          mode="edit"
          employee={employeeResponse.data}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/admin/employees')}
          isLoading={updateEmployeeMutation.isPending}
        />
      </div>
    </div>
  );
};
