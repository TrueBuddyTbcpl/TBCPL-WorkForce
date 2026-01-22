import { format, parseISO } from 'date-fns';
import { STATUS_LABELS, LEAD_TYPE_LABELS } from './constants';
import type { ReportStatus, LeadType } from './constants';

// Format date string
export const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return 'N/A';
  try {
    return format(parseISO(dateString), 'dd MMM yyyy');
  } catch {
    return dateString;
  }
};

// Format datetime string
export const formatDateTime = (dateString: string | undefined): string => {
  if (!dateString) return 'N/A';
  try {
    return format(parseISO(dateString), 'dd MMM yyyy, hh:mm a');
  } catch {
    return dateString;
  }
};

// Format status to readable label
export const formatStatus = (status: ReportStatus): string => {
  return STATUS_LABELS[status] || status;
};

// Format lead type to readable label
export const formatLeadType = (leadType: LeadType): string => {
  return LEAD_TYPE_LABELS[leadType] || leadType;
};

// Format phone number
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`;
  }
  return phone;
};

// Format report ID
export const formatReportId = (reportId: string): string => {
  return reportId.toUpperCase();
};

// Capitalize first letter
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Convert enum value to display text
export const enumToDisplay = (value: string): string => {
  return value
    .split('_')
    .map(word => capitalize(word))
    .join(' ');
};

// Truncate text
export const truncate = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

// Format array to comma-separated string
export const formatArrayToString = (arr: string[]): string => {
  if (!arr || arr.length === 0) return 'N/A';
  return arr.join(', ');
};
