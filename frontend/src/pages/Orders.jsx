import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { orderService } from "../services/orderService";
import "./Orders.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getMyOrders();
      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
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

  if (loading) return <div className="loading">Loading orders...</div>;

  return (
    <div className="orders-page">
      <div className="container">
        <h1>My Orders</h1>

        {orders.length === 0 ? (
          <div className="no-orders">
            <p>You haven't placed any orders yet</p>
            <Link to="/phones" className="btn btn-primary">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <Link
                key={order.order_id}
                to={`/orders/${order.order_id}`}
                className="order-card-link"
              >
                <div className="order-card">
                  <div className="order-header">
                    <div>
                      <h3>Order #{order.order_id}</h3>
                      <p className="order-date">
                        {new Date(order.order_date).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>
                    <span
                      className={`order-status ${getStatusClass(order.status)}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="order-details">
                    <div className="order-info">
                      <p>
                        <strong>Total Items:</strong> {order.total_items}
                      </p>
                      <p>
                        <strong>Total Amount:</strong> ₹
                        {parseFloat(order.total_amount).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="order-footer">
                    <span className="view-details">View Details →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
