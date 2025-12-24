import React from "react";
import { Link } from "react-router-dom";
import { FiShoppingCart, FiStar } from "react-icons/fi";
import { MobilePhone, Accessory } from "../types";
import "./ProductCard.css";

interface ProductCardProps {
  product: MobilePhone | Accessory;
  type: "phone" | "accessory";
  onAddToCart?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  type,
  onAddToCart,
}) => {
  const isPhone = type === "phone";
  const id = isPhone
    ? (product as MobilePhone).phone_id
    : (product as Accessory).accessory_id;
  const name = isPhone
    ? (product as MobilePhone).model_name
    : (product as Accessory).accessory_name;

  return (
    <div className="product-card card animate-scaleIn">
      <div className="product-image-wrapper">
        {product.image_display || product.image_url ? (
          <img
            src={product.image_display || product.image_url}
            alt={name}
            className="product-image"
          />
        ) : (
          <div className="product-image-placeholder">
            <FiShoppingCart />
          </div>
        )}
        {product.stock_quantity < 10 && product.stock_quantity > 0 && (
          <span className="badge badge-warning product-badge">Low Stock</span>
        )}
        {product.stock_quantity === 0 && (
          <span className="badge badge-error product-badge">Out of Stock</span>
        )}
      </div>

      <div className="product-details">
        <h3 className="product-name">{name}</h3>

        {isPhone && (
          <div className="product-specs">
            <span className="spec-badge">
              {(product as MobilePhone).ram} RAM
            </span>
            <span className="spec-badge">
              {(product as MobilePhone).storage}
            </span>
          </div>
        )}

        {!isPhone && (
          <p className="product-type">
            {(product as Accessory).accessory_type}
          </p>
        )}

        <div className="product-footer">
          <div className="product-price-section">
            <span className="product-price">
              ₹{parseFloat(product.price).toLocaleString()}
            </span>
            <div className="rating">
              {[...Array(5)].map((_, i) => (
                <FiStar
                  key={i}
                  className={i < 4 ? "star-filled" : "star-empty"}
                />
              ))}
            </div>
          </div>

          <div className="product-actions">
            <Link
              to={`/${type === "phone" ? "phones" : "accessories"}/${id}`}
              className="btn btn-outline btn-sm"
            >
              View Details
            </Link>
            {onAddToCart && product.stock_quantity > 0 && (
              <button onClick={onAddToCart} className="btn btn-primary btn-sm">
                <FiShoppingCart />
                Add to Cart
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
