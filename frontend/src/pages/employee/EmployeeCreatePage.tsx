import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { EmployeeForm } from '../../components/employee/EmployeeForm';
import { Button } from '../../components/common/Button';
import { Toast, ToastContainer, useToast } from '../../components/common/Toast';
import { useCreateEmployee } from '../../hooks/useEmployees';
import { getErrorMessage } from '../../utils/errorHandler';
import type { CreateEmployeeFormData } from '../../schemas/employee.schema';

export const EmployeeCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { toasts, success, error, removeToast } = useToast();
  const createEmployeeMutation = useCreateEmployee();

  const handleSubmit = (data: CreateEmployeeFormData) => {
    createEmployeeMutation.mutate(data, {
      onSuccess: (response) => {
        success(`Employee created successfully! Employee ID: ${response.data.empId}`);
        setTimeout(() => {
          navigate('/admin/employees');
        }, 2000);
      },
      onError: (err) => {
        error(getErrorMessage(err));
      },
    });
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Create New Employee</h1>
          <p className="text-sm text-gray-600 mt-2">
            Fill in the details below to create a new employee account
          </p>
        </div>

        <EmployeeForm
          mode="create"
          onSubmit={handleSubmit}
          onCancel={() => navigate('/admin/employees')}
          isLoading={createEmployeeMutation.isPending}
        />
      </div>
    </div>
  );
};
