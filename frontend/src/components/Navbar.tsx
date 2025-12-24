import React from "react";
import { Link } from "react-router-dom";
import {
  FiShoppingCart,
  FiUser,
  FiLogOut,
  FiPackage,
  FiSmartphone,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import "./Navbar.css";

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { totalItems } = useCart();

  return (
    <nav className="navbar glass">
      <div className="container navbar-container">
        <Link to="/" className="navbar-brand">
          <FiSmartphone className="navbar-logo" />
          <span className="gradient-text">MobileStore</span>
        </Link>

        <div className="navbar-links">
          <Link to="/phones" className="nav-link">
            Phones
          </Link>
          <Link to="/accessories" className="nav-link">
            Accessories
          </Link>
        </div>

        <div className="navbar-actions">
          {isAuthenticated ? (
            <>
              <Link to="/cart" className="nav-link cart-link">
                <FiShoppingCart />
                {totalItems > 0 && (
                  <span className="cart-badge">{totalItems}</span>
                )}
              </Link>
              <Link to="/orders" className="nav-link">
                <FiPackage />
              </Link>
              <div className="user-menu">
                <div className="user-avatar">
                  <FiUser />
                </div>
                <div className="dropdown">
                  <div className="user-info">
                    <div className="user-name">{user?.name}</div>
                    <div className="user-email">{user?.email}</div>
                  </div>
                  <button
                    onClick={logout}
                    className="btn btn-outline btn-sm logout-btn"
                  >
                    <FiLogOut />
                    Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
