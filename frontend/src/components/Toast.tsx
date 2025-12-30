import React, { createContext, useContext, useState, useCallback } from "react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    (message: string, type: ToastType = "info", duration: number = 3000) => {
      const id = `toast-${Date.now()}-${Math.random()}`;
      const toast: Toast = { id, message, type, duration };

      setToasts((prev) => [...prev, toast]);

      if (duration > 0) {
        setTimeout(() => {
          hideToast(id);
        }, duration);
      }
    },
    []
  );

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, hideToast }}>
      {children}
      <ToastContainer toasts={toasts} onClose={hideToast} />
    </ToastContext.Provider>
  );
};

const ToastContainer: React.FC<{
  toasts: Toast[];
  onClose: (id: string) => void;
}> = ({ toasts, onClose }) => {
  return (
    <div
      style={{
        position: "fixed",
        top: "1rem",
        right: "1rem",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        maxWidth: "400px",
      }}
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{
  toast: Toast;
  onClose: (id: string) => void;
}> = ({ toast, onClose }) => {
  const getBackgroundColor = (): string => {
    switch (toast.type) {
      case "success":
        return "#4CAF50";
      case "error":
        return "#f44336";
      case "warning":
        return "#FF9800";
      case "info":
      default:
        return "#2196F3";
    }
  };

  return (
    <div
      style={{
        background: getBackgroundColor(),
        color: "white",
        padding: "1rem 1.5rem",
        borderRadius: "4px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
        animation: "slideInRight 0.3s ease-out",
      }}
    >
      <span>{toast.message}</span>
      <button
        onClick={() => onClose(toast.id)}
        style={{
          background: "transparent",
          border: "none",
          color: "white",
          fontSize: "1.25rem",
          cursor: "pointer",
          padding: "0",
          lineHeight: 1,
        }}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
};
