import { cn } from '../../../utils/cn';
import { STATUS_COLORS, STATUS_LABELS } from '../../../utils/constants';
import type { ReportStatus } from '../../../utils/constants';

interface PreReportStatusBadgeProps {
  status: ReportStatus;
  className?: string;
}

export const PreReportStatusBadge = ({ status, className }: PreReportStatusBadgeProps) => {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        STATUS_COLORS[status],
        className
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
};
