import { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((notification) => {
    const id = Date.now() + Math.random();
    const defaultDuration = 5000;

    setNotifications((prev) => [
      ...prev,
      {
        id,
        type: 'info',
        duration: defaultDuration,
        ...notification,
      },
    ]);

    if (notification.duration !== 0) {
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, notification.duration || defaultDuration);
    }

    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const showSuccess = useCallback(
    (message, title = 'Success') => {
      return addNotification({ type: 'success', title, message });
    },
    [addNotification]
  );

  const showError = useCallback(
    (message, title = 'Error') => {
      return addNotification({ type: 'error', title, message, duration: 7000 });
    },
    [addNotification]
  );

  const showWarning = useCallback(
    (message, title = 'Warning') => {
      return addNotification({ type: 'warning', title, message });
    },
    [addNotification]
  );

  const showInfo = useCallback(
    (message, title = 'Info') => {
      return addNotification({ type: 'info', title, message });
    },
    [addNotification]
  );

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        clearAll,
        showSuccess,
        showError,
        showWarning,
        showInfo,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};
