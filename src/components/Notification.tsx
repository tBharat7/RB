import React, { useState, useEffect } from 'react';
import { CheckCircle, X, AlertCircle } from 'lucide-react';

interface NotificationProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
  duration?: number;
}

export const Notification: React.FC<NotificationProps> = ({
  message,
  type,
  onClose,
  duration = 3000
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [duration, onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
      <div
        className={`flex items-center py-2 px-4 rounded-lg shadow-md ${
          type === 'success' ? 'bg-white border-l-4 border-l-green-500' : 'bg-white border-l-4 border-l-red-500'
        } max-w-sm`}
      >
        <div className="mr-3">
          {type === 'success' ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-500" />
          )}
        </div>
        <div className="mr-4 text-sm text-slate-700">{message}</div>
        <button
          onClick={onClose}
          className="ml-auto text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
};

export const useNotification = () => {
  const [notification, setNotification] = useState<{
    visible: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    visible: false,
    message: '',
    type: 'success'
  });

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({
      visible: true,
      message,
      type
    });
  };

  const hideNotification = () => {
    setNotification({
      ...notification,
      visible: false
    });
  };

  return {
    notification,
    showNotification,
    hideNotification,
    NotificationComponent: notification.visible ? (
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={hideNotification}
      />
    ) : null
  };
}; 