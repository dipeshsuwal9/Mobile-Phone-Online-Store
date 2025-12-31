import React, { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiMail,
  FiLock,
  FiUser,
  FiPhone,
  FiMapPin,
  FiAlertCircle,
  FiCheckCircle,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { extractFieldErrors } from "../utils/errorHandler";
import "./Auth.css";

interface FormErrors {
  [key: string]: string;
}

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
  const [errors, setErrors] = useState<FormErrors>({});
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Handle redirect after success
  React.useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate("/");
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  // Client-side validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one lowercase letter";
    } else if (!/(?=.*[A-Z])/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one uppercase letter";
    } else if (!/(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must contain at least one number";
    } else if (!/(?=.*[@$!%*?&])/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one special character (@$!%*?&)";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Optional phone validation
    if (formData.phone && formData.phone.trim()) {
      const cleanedPhone = formData.phone.replace(/\D/g, "");
      if (cleanedPhone.length < 10 || cleanedPhone.length > 15) {
        newErrors.phone = "Please enter a valid phone number (10-15 digits)";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setGeneralError("");

    // Client-side validation
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;

      // Create clean data object without empty optional fields
      const cleanedData: any = { ...registerData };
      if (!registerData.phone?.trim()) {
        delete cleanedData.phone;
      }
      if (!registerData.address?.trim()) {
        delete cleanedData.address;
      }

      await register(cleanedData);

      // Show success message
      setLoading(false);
      setSuccess(true);
      // useEffect will handle the redirect
    } catch (err: any) {
      if (import.meta.env.DEV) {
        console.error("Registration error:", {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
        });
      }

      // Extract field-specific errors from backend response
      const fieldErrors = extractFieldErrors(err);

      if (Object.keys(fieldErrors).length > 0) {
        setErrors(fieldErrors);
      } else {
        // Set general error if no field-specific errors
        let errorMessage = "Registration failed. Please try again.";

        if (err.response?.data?.error?.message) {
          errorMessage = err.response.data.error.message;
        } else if (err.response?.data?.detail) {
          errorMessage = err.response.data.detail;
        } else if (err.message) {
          errorMessage = err.message;
        }

        setGeneralError(errorMessage);
      }
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container animate-scaleIn">
        <div className="auth-card glass">
          {success ? (
            <div className="success-container">
              <div className="success-icon">
                <FiCheckCircle />
              </div>
              <h1>Account Created Successfully!</h1>
              <p className="success-message">
                Welcome to PhoneZone, {formData.name}!
              </p>
              <p className="success-submessage">
                Your account has been created and you've been logged in.
                Redirecting you to the home page...
              </p>
              <div className="loading-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          ) : (
            <>
              <div className="auth-header">
                <h1>Create Account</h1>
                <p>Join PhoneZone Nepal today</p>
              </div>

              {generalError && (
                <div className="alert alert-error">
                  <FiAlertCircle />
                  <span>{generalError}</span>
                </div>
              )}

              <div className="password-requirements">
                <h4>Password Requirements:</h4>
                <ul>
                  <li className={formData.password.length >= 8 ? "valid" : ""}>
                    <FiCheckCircle /> At least 8 characters
                  </li>
                  <li
                    className={
                      /(?=.*[a-z])/.test(formData.password) ? "valid" : ""
                    }
                  >
                    <FiCheckCircle /> One lowercase letter
                  </li>
                  <li
                    className={
                      /(?=.*[A-Z])/.test(formData.password) ? "valid" : ""
                    }
                  >
                    <FiCheckCircle /> One uppercase letter
                  </li>
                  <li
                    className={
                      /(?=.*\d)/.test(formData.password) ? "valid" : ""
                    }
                  >
                    <FiCheckCircle /> One number
                  </li>
                  <li
                    className={
                      /(?=.*[@$!%*?&])/.test(formData.password) ? "valid" : ""
                    }
                  >
                    <FiCheckCircle /> One special character (@$!%*?&)
                  </li>
                </ul>
              </div>

              <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                  <label htmlFor="name">
                    <FiUser />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (errors.name) {
                        setErrors({ ...errors, name: "" });
                      }
                    }}
                    placeholder="Ram Shrestha"
                    className={errors.name ? "error" : ""}
                  />
                  {errors.name && (
                    <span className="error-message">{errors.name}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="email">
                    <FiMail />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (errors.email) {
                        setErrors({ ...errors, email: "" });
                      }
                    }}
                    placeholder="ram@example.com"
                    className={errors.email ? "error" : ""}
                  />
                  {errors.email && (
                    <span className="error-message">{errors.email}</span>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="password">
                      <FiLock />
                      Password *
                    </label>
                    <input
                      type="password"
                      id="password"
                      value={formData.password}
                      onChange={(e) => {
                        setFormData({ ...formData, password: e.target.value });
                        if (errors.password) {
                          setErrors({ ...errors, password: "" });
                        }
                      }}
                      placeholder="••••••••"
                      className={errors.password ? "error" : ""}
                    />
                    {errors.password && (
                      <span className="error-message">{errors.password}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmPassword">
                      <FiLock />
                      Confirm Password *
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        });
                        if (errors.confirmPassword) {
                          setErrors({ ...errors, confirmPassword: "" });
                        }
                      }}
                      placeholder="••••••••"
                      className={errors.confirmPassword ? "error" : ""}
                    />
                    {errors.confirmPassword && (
                      <span className="error-message">
                        {errors.confirmPassword}
                      </span>
                    )}
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
                    onChange={(e) => {
                      setFormData({ ...formData, phone: e.target.value });
                      if (errors.phone) {
                        setErrors({ ...errors, phone: "" });
                      }
                    }}
                    placeholder="+977-9800000000"
                    className={errors.phone ? "error" : ""}
                  />
                  {errors.phone && (
                    <span className="error-message">{errors.phone}</span>
                  )}
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
                    placeholder="Kathmandu, Nepal"
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
