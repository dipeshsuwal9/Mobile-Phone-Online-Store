import React, { useState, useEffect } from "react";
import { FiSearch, FiRefreshCw } from "react-icons/fi";
import ProductCard from "../components/ProductCard";
import { phoneService } from "../services/phoneService";
import { useCart } from "../context/CartContext";
import { MobilePhone } from "../types";
import "./Catalog.css";

const PhoneCatalog: React.FC = () => {
  const [phones, setPhones] = useState<MobilePhone[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { addToCart } = useCart();

  useEffect(() => {
    loadPhones();

    // Refetch when user returns to tab/window
    const handleFocus = () => {
      loadPhones();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [search]);

  const loadPhones = async () => {
    try {
      setLoading(true);
      const data = await phoneService.getAllPhones({ search });
      setPhones(data.results);
    } catch (error) {
      console.error("Failed to load phones:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (phoneId: number) => {
    try {
      await addToCart("PHONE", phoneId, 1);
      alert("Added to cart!");
    } catch (error) {
      alert("Failed to add to cart");
    }
  };

  return (
    <div className="catalog-page container animate-fadeIn">
      <div className="catalog-header">
        <h1>Mobile Phones</h1>
        <div className="search-bar">
          <FiSearch />
          <input
            type="text"
            placeholder="Search phones..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            onClick={() => loadPhones()}
            className="btn btn-outline"
            style={{ marginLeft: "1rem" }}
            title="Refresh data"
          >
            <FiRefreshCw />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="catalog-grid">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="skeleton"
              style={{ height: "400px", borderRadius: "1rem" }}
            />
          ))}
        </div>
      ) : (
        <div className="catalog-grid">
          {phones.map((phone) => (
            <ProductCard
              key={phone.phone_id}
              product={phone}
              type="phone"
              onAddToCart={() => handleAddToCart(phone.phone_id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PhoneCatalog;
