import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { FaShoppingCart, FaUser, FaSignOutAlt } from "react-icons/fa";
import "./Navbar.css";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          📱 Mobile Store
        </Link>

        <ul className="navbar-menu">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/phones">Phones</Link>
          </li>
          <li>
            <Link to="/accessories">Accessories</Link>
          </li>
          {isAuthenticated && (
            <li>
              <Link to="/orders">My Orders</Link>
            </li>
          )}
        </ul>

        <div className="navbar-actions">
          {isAuthenticated ? (
            <>
              <Link to="/cart" className="cart-link">
                <FaShoppingCart />
                {itemCount > 0 && (
                  <span className="cart-badge">{itemCount}</span>
                )}
              </Link>
              <span className="user-name">
                <FaUser /> {user?.name}
              </span>
              <button onClick={logout} className="btn btn-secondary">
                <FaSignOutAlt /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-primary">
                Login
              </Link>
              <Link to="/register" className="btn btn-secondary">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
