import React from "react";

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  color?: string;
  message?: string;
}

/**
 * Loading Spinner Component
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "medium",
  color = "#2196F3",
  message,
}) => {
  const sizeMap = {
    small: "24px",
    medium: "40px",
    large: "60px",
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1rem",
      }}
      role="status"
      aria-live="polite"
      aria-label={message || "Loading"}
    >
      <div
        style={{
          width: sizeMap[size],
          height: sizeMap[size],
          border: `4px solid #f3f3f3`,
          borderTop: `4px solid ${color}`,
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      />
      {message && <p style={{ color: "#666", margin: 0 }}>{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
