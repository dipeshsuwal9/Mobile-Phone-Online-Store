import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { orderService } from "../services/orderService";
import "./OrderDetail.css";

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const data = await orderService.getOrderById(id);
      setOrder(data);
    } catch (error) {
      console.error("Failed to fetch order:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {
        await orderService.cancelOrder(order.order_id);
        alert("Order cancelled successfully");
        fetchOrder();
      } catch (error) {
        alert(error.response?.data?.error || "Failed to cancel order");
      }
    }
  };

  const getStatusClass = (status) => {
    const statusClasses = {
      PENDING: "status-pending",
      CONFIRMED: "status-confirmed",
      PROCESSING: "status-processing",
      SHIPPED: "status-shipped",
      DELIVERED: "status-delivered",
      CANCELLED: "status-cancelled",
    };
    return statusClasses[status] || "";
  };

  const canCancelOrder = () => {
    return (
      order && !["SHIPPED", "DELIVERED", "CANCELLED"].includes(order.status)
    );
  };

  if (loading) return <div className="loading">Loading order details...</div>;
  if (!order) return <div className="container">Order not found</div>;

  return (
    <div className="order-detail-page">
      <div className="container">
        <button
          onClick={() => navigate("/orders")}
          className="btn btn-secondary"
        >
          ← Back to Orders
        </button>

        <div className="order-detail-header">
          <div>
            <h1>Order #{order.order_id}</h1>
            <p className="order-date">
              Placed on{" "}
              {new Date(order.order_date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <span className={`order-status ${getStatusClass(order.status)}`}>
            {order.status}
          </span>
        </div>

        <div className="order-detail-content">
          <div className="order-items-section">
            <h2>Order Items</h2>
            <div className="items-list">
              {order.items.map((item) => (
                <div key={item.order_item_id} className="order-item">
                  <div className="item-details">
                    <h3>{item.product_name}</h3>
                    <p className="item-type">{item.product_type}</p>
                    <p className="item-quantity">Quantity: {item.quantity}</p>
                  </div>
                  <div className="item-pricing">
                    <p className="item-price">
                      ₹{parseFloat(item.price_at_purchase).toFixed(2)}
                    </p>
                    <p className="item-subtotal">
                      Subtotal: ₹{parseFloat(item.subtotal).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="order-info-section">
            <div className="info-card">
              <h2>Order Summary</h2>
              <div className="info-row">
                <span>Total Items:</span>
                <span>{order.total_items}</span>
              </div>
              <div className="info-row total">
                <span>Total Amount:</span>
                <span>₹{parseFloat(order.total_amount).toFixed(2)}</span>
              </div>
            </div>

            <div className="info-card">
              <h2>Shipping Address</h2>
              <p>{order.shipping_address}</p>
            </div>

            {order.notes && (
              <div className="info-card">
                <h2>Order Notes</h2>
                <p>{order.notes}</p>
              </div>
            )}

            {canCancelOrder() && (
              <button
                onClick={handleCancelOrder}
                className="btn btn-danger btn-block"
              >
                Cancel Order
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
