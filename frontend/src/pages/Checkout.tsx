import React, { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { FiMapPin, FiCreditCard } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { orderService } from "../services/orderService";
import { paymentService } from "../services/paymentService";
import "./Checkout.css";

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const [formData, setFormData] = useState({
    shipping_address: "",
    payment_method: "CREDIT_CARD" as const,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const order = await orderService.createOrderFromCart({
        shipping_address: formData.shipping_address,
      });

      await paymentService.createPayment({
        order: order.order_id,
        amount: order.total_amount,
        payment_method: formData.payment_method,
      });

      await clearCart();
      navigate(`/orders/${order.order_id}`);
    } catch (error: any) {
      console.error("Checkout error:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Checkout failed. Please try again.";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!cart || cart.items.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="checkout-page container animate-fadeIn">
      <h1>Checkout</h1>

      <div className="checkout-grid">
        <form onSubmit={handleSubmit} className="checkout-form">
          <div className="form-section card">
            <h3>
              <FiMapPin />
              Shipping Address
            </h3>
            <textarea
              value={formData.shipping_address}
              onChange={(e) =>
                setFormData({ ...formData, shipping_address: e.target.value })
              }
              placeholder="Enter your complete shipping address..."
              rows={4}
              required
            />
          </div>

          <div className="form-section card">
            <h3>
              <FiCreditCard />
              Payment Method
            </h3>
            <select
              value={formData.payment_method}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  payment_method: e.target.value as any,
                })
              }
            >
              <option value="CASH_ON_DELIVERY">Cash on Delivery</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block btn-large"
            disabled={loading}
          >
            {loading ? "Processing..." : "Place Order"}
          </button>
        </form>

        <div className="order-summary card">
          <h3>Order Summary</h3>
          <div className="summary-items">
            {cart.items.map((item) => (
              <div key={item.cart_item_id} className="summary-item">
                <span>
                  {item.product_name} × {item.quantity}
                </span>
                <span>
                  ₹{parseFloat(item.subtotal || "0").toLocaleString()}
                </span>
              </div>
            ))}
          </div>
          <div className="summary-total">
            <span>Total</span>
            <span>
              ₹{parseFloat(cart.total_amount || "0").toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
