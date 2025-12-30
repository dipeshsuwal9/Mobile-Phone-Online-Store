import React, { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiMail,
  FiLock,
  FiUser,
  FiPhone,
  FiMapPin,
  FiAlertCircle,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
    address: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
      navigate("/");
    } catch (err: any) {
      let errorMessage = "Registration failed";

      // Handle different error response formats
      if (err.response?.data) {
        const data = err.response.data;

        // Check for field-specific errors
        if (data.email && Array.isArray(data.email)) {
          errorMessage = data.email[0];
        } else if (data.password && Array.isArray(data.password)) {
          errorMessage = data.password[0];
        } else if (data.detail) {
          errorMessage = data.detail;
        } else if (data.message) {
          errorMessage = data.message;
        } else if (typeof data === "string") {
          errorMessage = data;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container animate-scaleIn">
        <div className="auth-card glass">
          <div className="auth-header">
            <h1>Create Account</h1>
            <p>Join MobileStore today</p>
          </div>

          {error && (
            <div className="alert alert-error">
              <FiAlertCircle />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="name">
                <FiUser />
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="John Doe"
                required
              />
            </div>

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

            <div className="form-row">
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

              <div className="form-group">
                <label htmlFor="confirmPassword">
                  <FiLock />
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="phone">
                <FiPhone />
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="+1 (555) 000-0000"
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">
                <FiMapPin />
                Address (Optional)
              </label>
              <textarea
                id="address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                placeholder="123 Main St, City, State, ZIP"
                rows={3}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account?{" "}
              <Link to="/login" className="auth-link">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
