import React, { Component, ErrorInfo, ReactNode } from "react";
import { logError } from "../utils/errorHandler";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    logError(error, `Error Boundary: ${errorInfo.componentStack}`);
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          className="error-boundary"
          style={{
            padding: "2rem",
            textAlign: "center",
            minHeight: "60vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h2 style={{ color: "#f44336", marginBottom: "1rem" }}>
            Oops! Something went wrong
          </h2>
          <p style={{ color: "#666", marginBottom: "1.5rem" }}>
            We're sorry for the inconvenience. The error has been logged and
            we'll look into it.
          </p>
          {import.meta.env.DEV && this.state.error && (
            <details
              style={{
                marginBottom: "1.5rem",
                padding: "1rem",
                background: "#f5f5f5",
                borderRadius: "4px",
                maxWidth: "600px",
                textAlign: "left",
              }}
            >
              <summary style={{ cursor: "pointer", fontWeight: "bold" }}>
                Error Details (Development Only)
              </summary>
              <pre
                style={{
                  marginTop: "1rem",
                  fontSize: "0.875rem",
                  overflow: "auto",
                }}
              >
                {this.state.error.toString()}
              </pre>
            </details>
          )}
          <div style={{ display: "flex", gap: "1rem" }}>
            <button
              onClick={this.handleReset}
              style={{
                padding: "0.75rem 1.5rem",
                background: "#2196F3",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "1rem",
              }}
            >
              Try Again
            </button>
            <button
              onClick={() => (window.location.href = "/")}
              style={{
                padding: "0.75rem 1.5rem",
                background: "#666",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "1rem",
              }}
            >
              Go Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
