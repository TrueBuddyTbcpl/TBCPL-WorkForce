import React from 'react';
import { CheckCircle, Clock } from 'lucide-react';
import { Badge } from '../common/Badge';
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '../common/Table';
import type { LoginHistory } from '../../types/loginHistory.types';

interface LoginHistoryTableProps {
  loginHistories: LoginHistory[];
}

export const LoginHistoryTable: React.FC<LoginHistoryTableProps> = ({ loginHistories }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calculateDuration = (loginTime: string, logoutTime: string | null) => {
    if (!logoutTime) return 'Active';
    
    const login = new Date(loginTime);
    const logout = new Date(logoutTime);
    const diffMs = logout.getTime() - login.getTime();
    
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  if (loginHistories.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <p className="text-gray-500">No login history found</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableHead>Employee</TableHead>
        <TableHead>Email</TableHead>
        <TableHead>Login Time</TableHead>
        <TableHead>Logout Time</TableHead>
        <TableHead>Duration</TableHead>
        <TableHead>IP Address</TableHead>
        <TableHead>Status</TableHead>
      </TableHeader>
      <TableBody>
        {loginHistories.map((history) => (
          <TableRow key={history.id}>
            <TableCell>
              <div>
                <p className="font-medium text-gray-900">{history.fullName}</p>
                <p className="text-xs text-gray-500">{history.empId}</p>
              </div>
            </TableCell>
            <TableCell>
              <span className="text-gray-600">{history.email}</span>
            </TableCell>
            <TableCell>
              <span className="text-gray-900">{formatDate(history.loginTime)}</span>
            </TableCell>
            <TableCell>
              <span className="text-gray-900">
                {history.logoutTime ? formatDate(history.logoutTime) : '-'}
              </span>
            </TableCell>
            <TableCell>
              <span className="text-gray-900">
                {calculateDuration(history.loginTime, history.logoutTime)}
              </span>
            </TableCell>
            <TableCell>
              <span className="text-gray-600 font-mono text-xs">{history.ipAddress}</span>
            </TableCell>
            <TableCell>
              {history.isActive ? (
                <Badge variant="success">
                  <CheckCircle className="h-3 w-3 mr-1 inline" />
                  Active
                </Badge>
              ) : (
                <Badge variant="gray">
                  <Clock className="h-3 w-3 mr-1 inline" />
                  Ended
                </Badge>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

