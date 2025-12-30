import React from "react";

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Empty State Component
 * Shows when no data is available
 */
const EmptyState: React.FC<EmptyStateProps> = ({
  icon = "📭",
  title,
  description,
  action,
}) => {
  return (
    <div className="empty-state" role="status" aria-live="polite">
      <div className="empty-state-icon" aria-hidden="true">
        {icon}
      </div>
      <h3 className="empty-state-title">{title}</h3>
      {description && <p className="empty-state-description">{description}</p>}
      {action && (
        <button
          onClick={action.onClick}
          className="btn btn-primary"
          style={{
            padding: "0.75rem 1.5rem",
            backgroundColor: "#2196F3",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "1rem",
          }}
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
