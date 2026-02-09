import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { Badge } from '../common/Badge';
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '../common/Table';
import type { LoginAttempt } from '../../types/loginHistory.types';

interface LoginAttemptsTableProps {
  loginAttempts: LoginAttempt[];
}

export const LoginAttemptsTable: React.FC<LoginAttemptsTableProps> = ({ loginAttempts }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  if (loginAttempts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <p className="text-gray-500">No login attempts found</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableHead>Email</TableHead>
        <TableHead>Attempt Time</TableHead>
        <TableHead>IP Address</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Failure Reason</TableHead>
      </TableHeader>
      <TableBody>
        {loginAttempts.map((attempt) => (
          <TableRow key={attempt.id}>
            <TableCell>
              <span className="text-gray-900">{attempt.email}</span>
            </TableCell>
            <TableCell>
              <span className="text-gray-900">{formatDate(attempt.attemptTime)}</span>
            </TableCell>
            <TableCell>
              <span className="text-gray-600 font-mono text-xs">{attempt.ipAddress}</span>
            </TableCell>
            <TableCell>
              {attempt.isSuccess ? (
                <Badge variant="success">
                  <CheckCircle className="h-3 w-3 mr-1 inline" />
                  Success
                </Badge>
              ) : (
                <Badge variant="error">
                  <XCircle className="h-3 w-3 mr-1 inline" />
                  Failed
                </Badge>
              )}
            </TableCell>
            <TableCell>
              <span className="text-gray-600 text-sm">
                {attempt.failureReason || '-'}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
