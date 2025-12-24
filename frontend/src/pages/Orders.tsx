import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiPackage, FiCalendar, FiDollarSign } from "react-icons/fi";
import { orderService } from "../services/orderService";
import { Order } from "../types";
import "./Orders.css";

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await orderService.getAllOrders();
      setOrders(data.results);
    } catch (error) {
      console.error("Failed to load orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    const statusMap: Record<string, string> = {
      PENDING: "badge-warning",
      PROCESSING: "badge",
      SHIPPED: "badge",
      DELIVERED: "badge-success",
      CANCELLED: "badge-error",
    };
    return statusMap[status] || "badge";
  };

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

  if (orders.length === 0) {
    return (
      <div className="empty-orders container">
        <FiPackage className="empty-icon" />
        <h2>No orders yet</h2>
        <p>Start shopping to see your orders here!</p>
        <Link to="/phones" className="btn btn-primary">
          Browse Phones
        </Link>
      </div>
    );
  }

  return (
    <div className="orders-page container animate-fadeIn">
      <h1>My Orders</h1>

      <div className="orders-list">
        {orders.map((order) => (
          <Link
            key={order.order_id}
            to={`/orders/${order.order_id}`}
            className="order-card card"
          >
            <div className="order-header">
              <div>
                <div className="order-id">Order #{order.order_id}</div>
                <div className="order-date">
                  <FiCalendar />
                  {new Date(order.created_at).toLocaleDateString()}
                </div>
              </div>
              <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                {order.status}
              </span>
            </div>

            <div className="order-details">
              <div className="order-items">
                <FiPackage />
                {order.items.length} item{order.items.length !== 1 ? "s" : ""}
              </div>
              <div className="order-total">
                <FiDollarSign />₹
                {parseFloat(order.total_amount).toLocaleString()}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Orders;
