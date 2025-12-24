import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiMapPin, FiPackage } from "react-icons/fi";
import { orderService } from "../services/orderService";
import { Order } from "../types";
import "./OrderDetail.css";

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadOrder(parseInt(id));
    }
  }, [id]);

  const loadOrder = async (orderId: number) => {
    try {
      const data = await orderService.getOrderById(orderId);
      setOrder(data);
    } catch (error) {
      console.error("Failed to load order:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: "3rem 0" }}>
        <div
          className="skeleton"
          style={{ height: "500px", borderRadius: "1.5rem" }}
        />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container text-center" style={{ padding: "3rem 0" }}>
        <h2>Order not found</h2>
      </div>
    );
  }

  return (
    <div className="order-detail container animate-fadeIn">
      <button
        onClick={() => navigate("/orders")}
        className="btn btn-outline back-btn"
      >
        <FiArrowLeft />
        Back to Orders
      </button>

      <div className="order-detail-header card">
        <h1>Order #{order.order_id}</h1>
        <span
          className={`badge ${
            order.status === "DELIVERED" ? "badge-success" : "badge"
          }`}
        >
          {order.status}
        </span>
      </div>

      <div className="order-detail-grid">
        <div className="order-items-section">
          <div className="card">
            <h3>
              <FiPackage />
              Order Items
            </h3>
            <div className="items-list">
              {order.items.map((item) => (
                <div key={item.order_item_id} className="order-item">
                  <div>
                    <div className="item-name">{item.product_name}</div>
                    <div className="item-quantity">
                      Quantity: {item.quantity}
                    </div>
                  </div>
                  <div className="item-price">
                    ₹{parseFloat(item.price_at_purchase).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
            <div className="order-total">
              <span>Total</span>
              <span>₹{parseFloat(order.total_amount).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="order-info-section">
          <div className="card">
            <h3>
              <FiMapPin />
              Shipping Address
            </h3>
            <p className="shipping-address">{order.shipping_address}</p>
          </div>

          <div className="card">
            <h3>Order Details</h3>
            <div className="detail-row">
              <span>Order Date</span>
              <span>{new Date(order.created_at).toLocaleDateString()}</span>
            </div>
            <div className="detail-row">
              <span>Status</span>
              <span>{order.status}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
