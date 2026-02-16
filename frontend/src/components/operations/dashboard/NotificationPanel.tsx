import React, { useState } from 'react';
import { Bell, ChevronLeft, ChevronRight, AlertCircle, FileText, MessageSquare, CheckCircle, XCircle } from 'lucide-react';


interface Notification {
  id: string;
  type: 'change_request' | 'approval' | 'rejection' | 'comment';
  reportId: string;
  message: string;
  details?: string;
  timestamp: string;
  isRead: boolean;
}


const NotificationPanel: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'change_request',
      reportId: 'PRE-2026-0009',
      message: 'Changes Requested',
      details: 'Please update the suspect identification section with more detailed physical descriptions and add witness statements.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      isRead: false,
    },
    {
      id: '2',
      type: 'change_request',
      reportId: 'PRE-2026-0008',
      message: 'Changes Requested',
      details: 'The incident timeline needs clarification. Please provide exact dates and times for each event mentioned.',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      isRead: false,
    },
    {
      id: '3',
      type: 'approval',
      reportId: 'PRE-2026-0007',
      message: 'Report Approved',
      details: 'Your preliminary report has been approved and is ready for case creation.',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      isRead: true,
    },
    {
      id: '4',
      type: 'comment',
      reportId: 'PRE-2026-0006',
      message: 'New Comment Added',
      details: 'Admin commented: "Good work on the initial investigation. Please follow up with the local authorities."',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      isRead: true,
    },
    {
      id: '5',
      type: 'rejection',
      reportId: 'PRE-2026-0005',
      message: 'Report Disapproved',
      details: 'The report does not meet the minimum requirements. Please review the guidelines and resubmit.',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      isRead: true,
    },
  ]);


  const unreadCount = notifications.filter(n => !n.isRead).length;


  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'change_request':
        return <AlertCircle className="w-5 h-5 text-orange-600" />;
      case 'approval':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'rejection':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'comment':
        return <MessageSquare className="w-5 h-5 text-blue-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };


  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'change_request':
        return 'bg-orange-50 border-orange-200';
      case 'approval':
        return 'bg-green-50 border-green-200';
      case 'rejection':
        return 'bg-red-50 border-red-200';
      case 'comment':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };


  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);


    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };


  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
  };


  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };


  // ✅ MINIMIZED SIDE TAB
  if (!isExpanded) {
    return (
      <>
        <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40">
          <button
            onClick={() => setIsExpanded(true)}
            className="bg-white border-l border-t border-b border-gray-200 rounded-l-lg shadow-lg p-3 hover:bg-gray-50 transition-colors group"
            title="Show Notifications"
          >
            <div className="flex flex-col items-center gap-2">
              {/* ✅ ChevronLeft when minimized (pointing left to expand) */}
              <ChevronLeft className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
              <div className="flex flex-col items-center">
                <div className="relative">
                  <Bell className="w-5 h-5 text-blue-600 mb-1" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </div>
                <div className="writing-mode-vertical text-xs font-medium text-gray-700 mt-1">
                  Notifications
                </div>
              </div>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>
          </button>
        </div>
        
        <style>{`
          .writing-mode-vertical {
            writing-mode: vertical-rl;
            text-orientation: mixed;
          }
        `}</style>
      </>
    );
  }


  // ✅ EXPANDED FULL PANEL
  return (
    <div className="fixed right-0 top-0 h-screen w-96 bg-white border-l border-gray-200 shadow-lg z-40 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Bell className="w-5 h-5 text-blue-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
              <p className="text-xs text-gray-500">
                {unreadCount} unread
              </p>
            </div>
          </div>
          {/* ✅ ChevronRight when expanded (pointing right to minimize) */}
          <button
            onClick={() => setIsExpanded(false)}
            className="p-1.5 hover:bg-white rounded-md transition-colors"
            title="Minimize to side"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>


      {/* Mark all as read button */}
      {unreadCount > 0 && (
        <div className="px-4 pt-3">
          <button
            onClick={markAllAsRead}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            Mark all as read
          </button>
        </div>
      )}


      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto p-4">
        {notifications.length === 0 ? (
          <div className="text-center py-8">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No notifications</p>
            <p className="text-xs text-gray-400 mt-1">
              You're all caught up!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => !notification.isRead && markAsRead(notification.id)}
                className={`p-3 border rounded-lg transition-all cursor-pointer ${
                  getNotificationColor(notification.type)
                } ${
                  !notification.isRead 
                    ? 'border-l-4 shadow-sm' 
                    : 'opacity-75 hover:opacity-100'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-gray-500" />
                        <span className="text-xs font-mono text-gray-700 font-medium">
                          {notification.reportId}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {formatTimestamp(notification.timestamp)}
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">
                      {notification.message}
                    </h4>
                    {notification.details && (
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {notification.details}
                      </p>
                    )}
                    {!notification.isRead && (
                      <div className="mt-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          New
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>


      {/* Footer */}
      <div className="p-3 border-t border-gray-200 bg-gray-50">
        <button className="w-full text-xs text-gray-600 hover:text-gray-900 font-medium py-2">
          View All Notifications
        </button>
      </div>


      <style>{`
        .writing-mode-vertical {
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }
      `}</style>
    </div>
  );
};


export default NotificationPanel;
