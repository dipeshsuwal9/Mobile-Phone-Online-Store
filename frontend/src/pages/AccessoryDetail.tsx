import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiShoppingCart, FiArrowLeft, FiPackage } from "react-icons/fi";
import { accessoryService } from "../services/accessoryService";
import { useCart } from "../context/CartContext";
import { useToast } from "../components/Toast";
import { Accessory } from "../types";
import "./ProductDetail.css";

const AccessoryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [accessory, setAccessory] = useState<Accessory | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    if (id) {
      loadAccessory(parseInt(id));
    }
  }, [id]);

  const loadAccessory = async (accessoryId: number) => {
    try {
      const data = await accessoryService.getAccessoryById(accessoryId);
      setAccessory(data);
    } catch (error) {
      console.error("Failed to load accessory:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (accessory) {
      try {
        await addToCart("ACCESSORY", accessory.accessory_id, 1);
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

  if (!accessory) {
    return (
      <div className="container text-center" style={{ padding: "3rem 0" }}>
        <h2>Accessory not found</h2>
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
          {accessory.image_display || accessory.image_url ? (
            <img
              src={accessory.image_display || accessory.image_url}
              alt={accessory.name}
              className="detail-image"
            />
          ) : (
            <div className="detail-image-placeholder">
              <FiPackage />
            </div>
          )}
        </div>

        <div className="detail-info">
          <h1>{accessory.name}</h1>
          <div className="detail-price">
            ₹{parseFloat(accessory.price).toLocaleString()}
          </div>

          <div className="detail-specs">
            <h3>Details</h3>
            <div className="specs-grid">
              <div className="spec-item">
                <span className="spec-label">Category</span>
                <span className="spec-value">{accessory.category}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Stock</span>
                <span className="spec-value">
                  {accessory.stock_quantity} units
                </span>
              </div>
            </div>

            {accessory.description && (
              <div className="description-section">
                <h4>Description</h4>
                <p>{accessory.description}</p>
              </div>
            )}
          </div>

          <div className="detail-stock">
            {accessory.stock_quantity > 0 ? (
              <span className="badge badge-success">
                In Stock ({accessory.stock_quantity})
              </span>
            ) : (
              <span className="badge badge-error">Out of Stock</span>
            )}
          </div>

          {accessory.stock_quantity > 0 && (
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

export default AccessoryDetail;
