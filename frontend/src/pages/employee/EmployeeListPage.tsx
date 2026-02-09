import React from 'react';
import { useNavigate } from 'react-router-dom';
import { EmployeeList } from '../../components/employee/EmployeeList';
import type { Employee } from '../../types/employee.types';

export const EmployeeListPage: React.FC = () => {
  const navigate = useNavigate();

  const handleCreateClick = () => {
    navigate('/admin/employees/create');
  };

  const handleEditClick = (employee: Employee) => {
    navigate(`/admin/employees/${employee.empId}/edit`);
  };

  return <EmployeeList onCreateClick={handleCreateClick} onEditClick={handleEditClick} />;
};
