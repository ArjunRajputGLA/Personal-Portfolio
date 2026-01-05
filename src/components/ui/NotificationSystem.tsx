'use client';

import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Info, CheckCircle, AlertTriangle, AlertCircle, Bell } from 'lucide-react';

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  duration?: number;
}

interface NotificationSystemProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}

// Context for notifications
interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  dismissNotification: (id: string) => void;
  dismissAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Hook to use notifications from context
export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}

// Provider component
export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newNotification: Notification = {
      ...notification,
      id,
      duration: notification.duration ?? 5000,
    };
    setNotifications(prev => [...prev, newNotification]);

    // Auto-dismiss after duration
    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, newNotification.duration);
    }
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, dismissNotification, dismissAll }}>
      {children}
      <NotificationSystem notifications={notifications} onDismiss={dismissNotification} />
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newNotification: Notification = {
      ...notification,
      id,
      duration: notification.duration ?? 5000,
    };
    setNotifications(prev => [...prev, newNotification]);

    // Auto-dismiss after duration
    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        dismissNotification(id);
      }, newNotification.duration);
    }
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    notifications,
    addNotification,
    dismissNotification,
    dismissAll,
  };
}

export default function NotificationSystem({ notifications, onDismiss }: NotificationSystemProps) {
  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'info': return <Info size={18} className="text-blue-400" />;
      case 'success': return <CheckCircle size={18} className="text-green-400" />;
      case 'warning': return <AlertTriangle size={18} className="text-yellow-400" />;
      case 'error': return <AlertCircle size={18} className="text-red-400" />;
    }
  };

  const getBorderColor = (type: Notification['type']) => {
    switch (type) {
      case 'info': return 'border-l-blue-400';
      case 'success': return 'border-l-green-400';
      case 'warning': return 'border-l-yellow-400';
      case 'error': return 'border-l-red-400';
    }
  };

  return (
    <div className="fixed bottom-[30px] right-4 z-[9997] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <AnimatePresence mode="popLayout">
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className={`
              pointer-events-auto
              bg-[var(--vscode-sidebar)] 
              border border-[var(--vscode-border)] 
              border-l-4 ${getBorderColor(notification.type)}
              rounded-lg shadow-xl
              overflow-hidden
            `}
          >
            <div className="flex items-start gap-3 p-4">
              {getIcon(notification.type)}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[var(--vscode-text)]">{notification.message}</p>
                {notification.action && (
                  <button
                    onClick={notification.action.onClick}
                    className="mt-2 text-xs text-[var(--vscode-accent)] hover:underline"
                  >
                    {notification.action.label}
                  </button>
                )}
              </div>
              <button
                onClick={() => onDismiss(notification.id)}
                className="p-1 hover:bg-[var(--vscode-line-highlight)] rounded text-[var(--vscode-text-muted)] hover:text-[var(--vscode-text)]"
              >
                <X size={14} />
              </button>
            </div>
            
            {/* Progress bar for auto-dismiss */}
            {notification.duration && notification.duration > 0 && (
              <motion.div
                className={`h-0.5 ${
                  notification.type === 'info' ? 'bg-blue-400' :
                  notification.type === 'success' ? 'bg-green-400' :
                  notification.type === 'warning' ? 'bg-yellow-400' : 'bg-red-400'
                }`}
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: notification.duration / 1000, ease: 'linear' }}
              />
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// Notification Center (Bell icon with list)
export function NotificationCenter({ 
  notifications, 
  onDismiss, 
  onDismissAll 
}: NotificationSystemProps & { onDismissAll: () => void }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-1.5 hover:bg-[var(--vscode-line-highlight)] rounded"
        title="Notifications"
      >
        <Bell size={16} />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--vscode-accent)] rounded-full text-[10px] flex items-center justify-center text-white">
            {notifications.length > 9 ? '9+' : notifications.length}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              className="absolute top-full right-0 mt-2 w-80 bg-[var(--vscode-sidebar)] border border-[var(--vscode-border)] rounded-lg shadow-xl z-50"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--vscode-sidebar-border)]">
                <span className="text-sm font-medium">Notifications</span>
                {notifications.length > 0 && (
                  <button
                    onClick={onDismissAll}
                    className="text-xs text-[var(--vscode-accent)] hover:underline"
                  >
                    Clear all
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-auto">
                {notifications.length > 0 ? (
                  notifications.map(notification => (
                    <div
                      key={notification.id}
                      className="flex items-start gap-3 px-4 py-3 hover:bg-[var(--vscode-line-highlight)] border-b border-[var(--vscode-sidebar-border)] last:border-0"
                    >
                      {getIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-[var(--vscode-text)]">{notification.message}</p>
                      </div>
                      <button
                        onClick={() => onDismiss(notification.id)}
                        className="p-1 hover:bg-[var(--vscode-bg)] rounded"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-8 text-center text-[var(--vscode-text-muted)] text-sm">
                    No notifications
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );

  function getIcon(type: Notification['type']) {
    switch (type) {
      case 'info': return <Info size={16} className="text-blue-400 flex-shrink-0" />;
      case 'success': return <CheckCircle size={16} className="text-green-400 flex-shrink-0" />;
      case 'warning': return <AlertTriangle size={16} className="text-yellow-400 flex-shrink-0" />;
      case 'error': return <AlertCircle size={16} className="text-red-400 flex-shrink-0" />;
    }
  }
}
