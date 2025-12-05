import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { phoneService } from "../services/phoneService";
import { useCart } from "../context/CartContext";
import "./PhoneDetail.css";

const PhoneDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [phone, setPhone] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchPhone();
  }, [id]);

  const fetchPhone = async () => {
    try {
      setLoading(true);
      const data = await phoneService.getPhoneById(id);
      setPhone(data);
    } catch (error) {
      console.error("Failed to fetch phone:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      await addToCart("PHONE", phone.phone_id, quantity);
      alert("Added to cart successfully!");
    } catch (error) {
      alert("Failed to add to cart. Please login first.");
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!phone) return <div className="container">Phone not found</div>;

  return (
    <div className="phone-detail">
      <div className="container">
        <button onClick={() => navigate(-1)} className="btn btn-secondary">
          ← Back
        </button>

        <div className="detail-content">
          <div className="detail-image">
            {phone.image_url ? (
              <img
                src={phone.image_url}
                alt={`${phone.brand_name} ${phone.model_name}`}
              />
            ) : (
              <div className="no-image">No Image Available</div>
            )}
          </div>

          <div className="detail-info">
            <h1>
              {phone.brand_name} {phone.model_name}
            </h1>
            <p className="price">₹{parseFloat(phone.price).toFixed(2)}</p>
            <p
              className={`stock ${
                phone.stock_quantity > 0 ? "in-stock" : "out-of-stock"
              }`}
            >
              {phone.stock_quantity > 0
                ? `In Stock (${phone.stock_quantity} available)`
                : "Out of Stock"}
            </p>

            <div className="specifications">
              <h2>Specifications</h2>
              <table>
                <tbody>
                  <tr>
                    <td>Brand:</td>
                    <td>{phone.brand_name}</td>
                  </tr>
                  <tr>
                    <td>Model:</td>
                    <td>{phone.model_name}</td>
                  </tr>
                  <tr>
                    <td>RAM:</td>
                    <td>{phone.ram}</td>
                  </tr>
                  <tr>
                    <td>Storage:</td>
                    <td>{phone.storage}</td>
                  </tr>
                  <tr>
                    <td>Battery:</td>
                    <td>{phone.battery_capacity}</td>
                  </tr>
                  <tr>
                    <td>Processor:</td>
                    <td>{phone.processor}</td>
                  </tr>
                  <tr>
                    <td>Operating System:</td>
                    <td>{phone.os}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {phone.description && (
              <div className="description">
                <h2>Description</h2>
                <p>{phone.description}</p>
              </div>
            )}

            <div className="purchase-section">
              <div className="quantity-selector">
                <label>Quantity:</label>
                <input
                  type="number"
                  min="1"
                  max={phone.stock_quantity}
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                />
              </div>
              <button
                onClick={handleAddToCart}
                className="btn btn-primary btn-large"
                disabled={phone.stock_quantity === 0}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhoneDetail;
