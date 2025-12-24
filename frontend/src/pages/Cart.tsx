import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiTrash2, FiShoppingCart, FiArrowRight } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import "./Cart.css";

const Cart: React.FC = () => {
  const { cart, loading, updateQuantity, removeItem } = useCart();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="container" style={{ padding: "3rem 0" }}>
        <div
          className="skeleton"
          style={{ height: "400px", borderRadius: "1.5rem" }}
        />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="empty-cart container">
        <FiShoppingCart className="empty-icon" />
        <h2>Your cart is empty</h2>
        <p>Add some products to get started!</p>
        <Link to="/phones" className="btn btn-primary">
          Browse Phones
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page container animate-fadeIn">
      <h1>Shopping Cart</h1>

      <div className="cart-grid">
        <div className="cart-items">
          {cart.items.map((item) => (
            <div key={item.cart_item_id} className="cart-item card">
              <div className="item-info">
                <h3>{item.product_name}</h3>
                <p className="item-price">
                  ₹{parseFloat(item.unit_price || "0").toLocaleString()}
                </p>
              </div>

              <div className="item-controls">
                <div className="quantity-control">
                  <button
                    onClick={() =>
                      updateQuantity(
                        item.cart_item_id,
                        Math.max(1, item.quantity - 1)
                      )
                    }
                    className="btn btn-outline btn-sm"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateQuantity(item.cart_item_id, item.quantity + 1)
                    }
                    className="btn btn-outline btn-sm"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => removeItem(item.cart_item_id)}
                  className="btn btn-danger btn-sm"
                >
                  <FiTrash2 />
                </button>
              </div>

              <div className="item-subtotal">
                ₹{parseFloat(item.subtotal || "0").toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary card">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Items ({cart.total_items || cart.items.length})</span>
            <span>
              ₹{parseFloat(cart.total_amount || "0").toLocaleString()}
            </span>
          </div>
          <div className="summary-total">
            <span>Total</span>
            <span>
              ₹{parseFloat(cart.total_amount || "0").toLocaleString()}
            </span>
          </div>
          <button
            onClick={() => navigate("/checkout")}
            className="btn btn-primary btn-block btn-large"
          >
            Proceed to Checkout
            <FiArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
