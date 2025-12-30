import React from "react";

interface LoadingSkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  className?: string;
}

/**
 * Loading Skeleton Component
 * Shows a placeholder while content is loading
 */
export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  width = "100%",
  height = "1rem",
  borderRadius = "4px",
  className = "",
}) => {
  return (
    <div
      className={`skeleton ${className}`}
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: "#e0e0e0",
        animation: "pulse 1.5s ease-in-out infinite",
      }}
    />
  );
};

/**
 * Product Card Skeleton
 */
export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="card" style={{ padding: "1rem" }}>
      <LoadingSkeleton height="200px" borderRadius="8px" />
      <div style={{ marginTop: "1rem" }}>
        <LoadingSkeleton height="1.5rem" width="80%" />
        <LoadingSkeleton
          height="1rem"
          width="60%"
          style={{ marginTop: "0.5rem" }}
        />
        <LoadingSkeleton
          height="1.25rem"
          width="40%"
          style={{ marginTop: "0.75rem" }}
        />
      </div>
    </div>
  );
};

/**
 * List Item Skeleton
 */
export const ListItemSkeleton: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        gap: "1rem",
        padding: "1rem",
        borderBottom: "1px solid #e0e0e0",
      }}
    >
      <LoadingSkeleton width="80px" height="80px" borderRadius="8px" />
      <div style={{ flex: 1 }}>
        <LoadingSkeleton height="1.25rem" width="70%" />
        <LoadingSkeleton
          height="1rem"
          width="50%"
          style={{ marginTop: "0.5rem" }}
        />
        <LoadingSkeleton
          height="1rem"
          width="30%"
          style={{ marginTop: "0.5rem" }}
        />
      </div>
    </div>
  );
};

/**
 * Grid Skeleton
 */
export const GridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
        gap: "1.5rem",
      }}
    >
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
};

/**
 * Table Skeleton
 */
export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({
  rows = 5,
  columns = 4,
}) => {
  return (
    <div style={{ width: "100%" }}>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gap: "1rem",
            padding: "1rem",
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <LoadingSkeleton key={colIndex} height="1rem" />
          ))}
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
