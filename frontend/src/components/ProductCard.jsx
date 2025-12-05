import { useCart } from "../context/CartContext";
import "./ProductCard.css";

const ProductCard = ({ product, type }) => {
  const { addToCart } = useCart();

  const handleAddToCart = async () => {
    try {
      await addToCart(
        type,
        product[type === "PHONE" ? "phone_id" : "accessory_id"]
      );
      alert("Added to cart successfully!");
    } catch (error) {
      alert("Failed to add to cart. Please login first.");
    }
  };

  const getProductName = () => {
    if (type === "PHONE") {
      return `${product.brand_name} ${product.model_name}`;
    }
    return product.name;
  };

  const getProductId = () => {
    return type === "PHONE" ? product.phone_id : product.accessory_id;
  };

  return (
    <div className="product-card">
      {product.image_url && (
        <img
          src={product.image_url}
          alt={getProductName()}
          className="product-image"
        />
      )}
      <div className="product-info">
        <h3 className="product-name">{getProductName()}</h3>

        {type === "PHONE" && (
          <div className="product-specs">
            <p>RAM: {product.ram}</p>
            <p>Storage: {product.storage}</p>
            <p>Battery: {product.battery_capacity}</p>
          </div>
        )}

        {type === "ACCESSORY" && (
          <p className="product-category">{product.category}</p>
        )}

        <div className="product-footer">
          <p className="product-price">
            ₹{parseFloat(product.price).toFixed(2)}
          </p>
          <p
            className={`product-stock ${
              product.stock_quantity > 0 ? "in-stock" : "out-of-stock"
            }`}
          >
            {product.stock_quantity > 0
              ? `In Stock (${product.stock_quantity})`
              : "Out of Stock"}
          </p>
        </div>

        <div className="product-actions">
          <button
            onClick={handleAddToCart}
            className="btn btn-primary"
            disabled={product.stock_quantity === 0}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
