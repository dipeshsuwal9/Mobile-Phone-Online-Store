import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiShoppingCart, FiArrowLeft } from "react-icons/fi";
import { phoneService } from "../services/phoneService";
import { useCart } from "../context/CartContext";
import { useToast } from "../components/Toast";
import { MobilePhone } from "../types";
import "./ProductDetail.css";

const PhoneDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [phone, setPhone] = useState<MobilePhone | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    if (id) {
      loadPhone(parseInt(id));
    }
  }, [id]);

  const loadPhone = async (phoneId: number) => {
    try {
      const data = await phoneService.getPhoneById(phoneId);
      setPhone(data);
    } catch (error) {
      console.error("Failed to load phone:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (phone) {
      try {
        await addToCart("PHONE", phone.phone_id, 1);
        showToast("✓ Added to cart successfully!", "success");
      } catch (error) {
        showToast("Failed to add to cart. Please try again.", "error");
      }
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

  if (!phone) {
    return (
      <div className="container text-center" style={{ padding: "3rem 0" }}>
        <h2>Phone not found</h2>
      </div>
    );
  }

  return (
    <div className="product-detail container animate-fadeIn">
      <button onClick={() => navigate(-1)} className="btn btn-outline back-btn">
        <FiArrowLeft />
        Back
      </button>

      <div className="detail-grid">
        <div className="detail-image-section">
          {phone.image_display || phone.image_url ? (
            <img
              src={phone.image_display || phone.image_url}
              alt={phone.model_name}
              className="detail-image"
            />
          ) : (
            <div className="detail-image-placeholder">
              <FiShoppingCart />
            </div>
          )}
        </div>

        <div className="detail-info">
          <h1>{phone.model_name}</h1>
          <div className="detail-price">
            ₹{parseFloat(phone.price).toLocaleString()}
          </div>

          <div className="detail-specs">
            <h3>Specifications</h3>
            <div className="specs-grid">
              <div className="spec-item">
                <span className="spec-label">RAM</span>
                <span className="spec-value">{phone.ram}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Storage</span>
                <span className="spec-value">{phone.storage}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Battery</span>
                <span className="spec-value">{phone.battery_capacity}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Processor</span>
                <span className="spec-value">{phone.processor}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">OS</span>
                <span className="spec-value">{phone.operating_system}</span>
              </div>
              {phone.screen_size && (
                <div className="spec-item">
                  <span className="spec-label">Screen</span>
                  <span className="spec-value">{phone.screen_size}</span>
                </div>
              )}
            </div>
          </div>

          <div className="detail-stock">
            {phone.stock_quantity > 0 ? (
              <span className="badge badge-success">
                In Stock ({phone.stock_quantity})
              </span>
            ) : (
              <span className="badge badge-error">Out of Stock</span>
            )}
          </div>

          {phone.stock_quantity > 0 && (
            <button
              onClick={handleAddToCart}
              className="btn btn-primary btn-large btn-block"
            >
              <FiShoppingCart />
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhoneDetail;
