import React, { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiAlertCircle } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { handleApiError } from "../utils/errorHandler";
import "./Auth.css";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!formData.email.trim()) {
      setError("Email is required");
      return;
    }

    if (!formData.password) {
      setError("Password is required");
      return;
    }

    setLoading(true);

    try {
      await login(formData);
      navigate("/");
    } catch (err: any) {
      if (import.meta.env.DEV) {
        console.error("Login error:", {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
        });
      }

      let errorMessage = "Login failed. Please try again.";

      // Handle "No active account found with the given credentials" error
      if (err.response?.data?.detail) {
        const detail = err.response.data.detail;
        if (detail.includes("No active account")) {
          errorMessage =
            "Invalid email or password. Please check your credentials and try again.";
        } else {
          errorMessage = detail;
        }
      } else if (err.response?.data?.error?.message) {
        errorMessage = err.response.data.error.message;
      } else if (err.response?.status === 401) {
        errorMessage = "Invalid email or password. Please try again.";
      } else if (err.message) {
        errorMessage = handleApiError(err);
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container animate-scaleIn">
        <div className="auth-card glass">
          <div className="auth-header">
            <h1>Welcome Back</h1>
            <p>Sign in to continue shopping</p>
          </div>

          {error && (
            <div className="alert alert-error">
              <FiAlertCircle />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">
                <FiMail />
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="ram@example.com"
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">
                <FiLock />
                Password
              </label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Don't have an account?{" "}
              <Link to="/register" className="auth-link">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
