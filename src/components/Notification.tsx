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
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 animate-fade-up">
      <div
        className={`flex items-center p-4 rounded-lg shadow-xl ${
          type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
        } min-w-[300px] max-w-md`}
      >
        <div className="mr-3">
          {type === 'success' ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
        </div>
        <div className="mr-4 font-medium">{message}</div>
        <button
          onClick={onClose}
          className="ml-auto text-slate-500 hover:text-slate-700 transition-colors"
        >
          <X className="h-4 w-4" />
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