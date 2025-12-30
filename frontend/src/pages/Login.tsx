import React, { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiAlertCircle } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
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
    setLoading(true);

    try {
      await login(formData);
      navigate("/");
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        err.message ||
        "Invalid credentials";
      setError(errorMessage);
      console.error("Login error:", err);
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
                placeholder="you@example.com"
                required
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
                required
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
