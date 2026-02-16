import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Loader2 } from 'lucide-react';
import { ReportStatus, STATUS_LABELS, STATUS_COLORS } from '../../utils/constants';

interface StatusDropdownProps {
  currentStatus: ReportStatus;
  reportId: string;
  onStatusChange: (newStatus: ReportStatus) => Promise<void>;
  onRequestChanges: () => void;
}

export const StatusDropdown: React.FC<StatusDropdownProps> = ({
  currentStatus,
  onStatusChange,
  onRequestChanges,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Available status transitions based on current status
  const getAvailableStatuses = (): ReportStatus[] => {
    switch (currentStatus) {
      case ReportStatus.DRAFT:
        return [ReportStatus.IN_PROGRESS];
      
      case ReportStatus.IN_PROGRESS:
        return [ReportStatus.WAITING_FOR_APPROVAL, ReportStatus.DRAFT];
      
      case ReportStatus.WAITING_FOR_APPROVAL:
        return [
          ReportStatus.READY_FOR_CREATE_CASE,
          ReportStatus.REQUESTED_FOR_CHANGES,
          ReportStatus.DISAPPROVED_BY_CLIENT,
        ];
      
      case ReportStatus.REQUESTED_FOR_CHANGES:
        return [ReportStatus.IN_PROGRESS, ReportStatus.WAITING_FOR_APPROVAL];
      
      case ReportStatus.DISAPPROVED_BY_CLIENT:
        return [ReportStatus.IN_PROGRESS];
      
      case ReportStatus.READY_FOR_CREATE_CASE:
        return []; // Final status, no changes allowed
      
      default:
        return [];
    }
  };

  const availableStatuses = getAvailableStatuses();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleStatusClick = async (newStatus: ReportStatus) => {
    if (newStatus === ReportStatus.REQUESTED_FOR_CHANGES) {
      // Open modal for requesting changes
      setIsOpen(false);
      onRequestChanges();
      return;
    }

    try {
      setIsChanging(true);
      await onStatusChange(newStatus);
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to change status:', error);
    } finally {
      setIsChanging(false);
    }
  };

  if (availableStatuses.length === 0) {
    // If no status changes allowed, just show current status
    return (
      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${STATUS_COLORS[currentStatus]}`}>
        {STATUS_LABELS[currentStatus]}
      </span>
    );
  }

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        disabled={isChanging}
        className={`px-3 py-1.5 inline-flex items-center gap-2 text-xs leading-5 font-semibold rounded-full transition-all ${STATUS_COLORS[currentStatus]} ${
          isChanging ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md cursor-pointer'
        }`}
      >
        {isChanging ? (
          <>
            <Loader2 className="w-3 h-3 animate-spin" />
            Updating...
          </>
        ) : (
          <>
            {STATUS_LABELS[currentStatus]}
            <ChevronDown className="w-3 h-3" />
          </>
        )}
      </button>

      {isOpen && !isChanging && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-20 right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
            <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
              <p className="text-xs font-medium text-gray-700">Change Status</p>
            </div>
            <div className="py-1">
              {availableStatuses.map((status) => (
                <button
                  key={status}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStatusClick(status);
                  }}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors flex items-center justify-between ${
                    status === currentStatus ? 'bg-blue-50' : ''
                  }`}
                >
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[status]}`}>
                    {STATUS_LABELS[status]}
                  </span>
                  {status === currentStatus && (
                    <Check className="w-4 h-4 text-blue-600" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
