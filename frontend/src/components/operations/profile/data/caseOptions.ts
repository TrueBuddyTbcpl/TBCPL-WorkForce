export interface CaseOption {
  value: string;
  label: string;
  caseType: string;
  status: 'Open' | 'Under Investigation' | 'Closed' | 'Pending';
  dateReported: string;
}

// Sample case data - In production, this would come from your API
export const availableCases: CaseOption[] = [
  {
    value: 'CASE-2024-001',
    label: 'CASE-2024-001 - Theft Incident',
    caseType: 'Theft',
    status: 'Under Investigation',
    dateReported: '2024-12-01',
  },
  {
    value: 'CASE-2024-002',
    label: 'CASE-2024-002 - Vandalism',
    caseType: 'Property Damage',
    status: 'Open',
    dateReported: '2024-12-05',
  },
  {
    value: 'CASE-2024-003',
    label: 'CASE-2024-003 - Assault Case',
    caseType: 'Violence',
    status: 'Closed',
    dateReported: '2024-11-20',
  },
  {
    value: 'CASE-2024-004',
    label: 'CASE-2024-004 - Fraud Investigation',
    caseType: 'Fraud',
    status: 'Under Investigation',
    dateReported: '2024-12-10',
  },
  {
    value: 'CASE-2024-005',
    label: 'CASE-2024-005 - Trespassing',
    caseType: 'Trespassing',
    status: 'Open',
    dateReported: '2024-12-12',
  },
  {
    value: 'CASE-2024-006',
    label: 'CASE-2024-006 - Burglary Attempt',
    caseType: 'Theft',
    status: 'Pending',
    dateReported: '2024-12-08',
  },
];

export const caseTypes = [
  'Theft',
  'Violence',
  'Fraud',
  'Property Damage',
  'Trespassing',
  'Harassment',
  'Cybercrime',
  'Other',
];
