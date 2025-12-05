import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { orderService } from "../services/orderService";
import { paymentService } from "../services/paymentService";
import "./Checkout.css";

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    shipping_address: user?.address || "",
    notes: "",
    payment_method: "CREDIT_CARD",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create order
      const order = await orderService.createOrderFromCart(
        formData.shipping_address,
        formData.notes
      );

      // Create payment
      await paymentService.createPayment(
        order.order_id,
        formData.payment_method
      );

      alert("Order placed successfully!");
      navigate(`/orders/${order.order_id}`);
    } catch (error) {
      alert(
        error.response?.data?.error ||
          "Failed to place order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!cart || cart.items?.length === 0) {
    return (
      <div className="container">
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <button
            onClick={() => navigate("/phones")}
            className="btn btn-primary"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <h1>Checkout</h1>

        <div className="checkout-content">
          <div className="checkout-form">
            <form onSubmit={handleSubmit}>
              <div className="form-section">
                <h2>Shipping Information</h2>
                <div className="form-group">
                  <label htmlFor="shipping_address">Shipping Address *</label>
                  <textarea
                    id="shipping_address"
                    name="shipping_address"
                    value={formData.shipping_address}
                    onChange={handleChange}
                    rows="4"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="notes">Order Notes (Optional)</label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="3"
                  />
                </div>
              </div>

              <div className="form-section">
                <h2>Payment Method</h2>
                <div className="form-group">
                  <select
                    name="payment_method"
                    value={formData.payment_method}
                    onChange={handleChange}
                    required
                  >
                    <option value="CREDIT_CARD">Credit Card</option>
                    <option value="DEBIT_CARD">Debit Card</option>
                    <option value="UPI">UPI</option>
                    <option value="NET_BANKING">Net Banking</option>
                    <option value="CASH_ON_DELIVERY">Cash on Delivery</option>
                    <option value="WALLET">Wallet</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={loading}
              >
                {loading ? "Placing Order..." : "Place Order"}
              </button>
            </form>
          </div>

          <div className="order-summary">
            <h2>Order Summary</h2>

            <div className="summary-items">
              {cart.items.map((item) => (
                <div key={item.cart_item_id} className="summary-item">
                  <div>
                    <p className="item-name">{item.product_name}</p>
                    <p className="item-qty">Qty: {item.quantity}</p>
                  </div>
                  <p className="item-price">
                    ₹{parseFloat(item.subtotal).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="summary-total">
              <div className="total-row">
                <span>Total Items:</span>
                <span>{cart.total_items}</span>
              </div>
              <div className="total-row grand-total">
                <span>Total Amount:</span>
                <span>₹{parseFloat(cart.total_amount).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
