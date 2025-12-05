import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { FaTrash } from "react-icons/fa";
import "./Cart.css";

const Cart = () => {
  const navigate = useNavigate();
  const { cart, loading, updateCartItem, removeFromCart } = useCart();

  const handleQuantityChange = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await updateCartItem(cartItemId, newQuantity);
    } catch (error) {
      alert("Failed to update quantity");
    }
  };

  const handleRemove = async (cartItemId) => {
    if (window.confirm("Remove this item from cart?")) {
      try {
        await removeFromCart(cartItemId);
      } catch (error) {
        alert("Failed to remove item");
      }
    }
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (loading) return <div className="loading">Loading cart...</div>;

  return (
    <div className="cart-page">
      <div className="container">
        <h1>Shopping Cart</h1>

        {!cart || cart.items?.length === 0 ? (
          <div className="empty-cart">
            <p>Your cart is empty</p>
            <button
              onClick={() => navigate("/phones")}
              className="btn btn-primary"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items">
              {cart.items.map((item) => (
                <div key={item.cart_item_id} className="cart-item">
                  <div className="item-info">
                    <h3>{item.product_name}</h3>
                    <p className="item-type">{item.product_type}</p>
                  </div>

                  <div className="item-price">
                    <p>₹{parseFloat(item.unit_price).toFixed(2)}</p>
                  </div>

                  <div className="item-quantity">
                    <button
                      onClick={() =>
                        handleQuantityChange(
                          item.cart_item_id,
                          item.quantity - 1
                        )
                      }
                      className="qty-btn"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() =>
                        handleQuantityChange(
                          item.cart_item_id,
                          item.quantity + 1
                        )
                      }
                      className="qty-btn"
                    >
                      +
                    </button>
                  </div>

                  <div className="item-subtotal">
                    <p>₹{parseFloat(item.subtotal).toFixed(2)}</p>
                  </div>

                  <button
                    onClick={() => handleRemove(item.cart_item_id)}
                    className="remove-btn"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h2>Order Summary</h2>
              <div className="summary-row">
                <span>Total Items:</span>
                <span>{cart.total_items}</span>
              </div>
              <div className="summary-row total">
                <span>Total Amount:</span>
                <span>₹{parseFloat(cart.total_amount).toFixed(2)}</span>
              </div>
              <button
                onClick={handleCheckout}
                className="btn btn-primary btn-block"
              >
                Proceed to Checkout
              </button>
              <button
                onClick={() => navigate("/phones")}
                className="btn btn-secondary btn-block"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
