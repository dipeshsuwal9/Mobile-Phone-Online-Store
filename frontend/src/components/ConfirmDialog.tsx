import React, { useState } from "react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: "danger" | "warning" | "info";
}

/**
 * Confirmation Dialog Component
 * Used for destructive actions that need user confirmation
 */
const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  type = "warning",
}) => {
  if (!isOpen) return null;

  const getColor = (): string => {
    switch (type) {
      case "danger":
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
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1050,
      }}
      onClick={onCancel}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "2rem",
          maxWidth: "500px",
          width: "90%",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3
          style={{
            margin: 0,
            marginBottom: "1rem",
            color: getColor(),
            fontSize: "1.5rem",
          }}
        >
          {title}
        </h3>
        <p style={{ margin: 0, marginBottom: "1.5rem", color: "#666" }}>
          {message}
        </p>
        <div
          style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}
        >
          <button
            onClick={onCancel}
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: "#e0e0e0",
              color: "#333",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: getColor(),
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;

/**
 * Hook for using confirm dialog
 */
export const useConfirmDialog = () => {
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
    type: "warning" as "danger" | "warning" | "info",
  });

  const showConfirm = (
    title: string,
    message: string,
    onConfirm: () => void,
    type: "danger" | "warning" | "info" = "warning"
  ) => {
    setDialogState({
      isOpen: true,
      title,
      message,
      onConfirm,
      type,
    });
  };

  const hideConfirm = () => {
    setDialogState((prev) => ({ ...prev, isOpen: false }));
  };

  const handleConfirm = () => {
    dialogState.onConfirm();
    hideConfirm();
  };

  return {
    showConfirm,
    ConfirmDialog: (
      <ConfirmDialog
        {...dialogState}
        onCancel={hideConfirm}
        onConfirm={handleConfirm}
      />
    ),
  };
};
