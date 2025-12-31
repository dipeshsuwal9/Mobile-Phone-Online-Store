import React, { useState, useEffect } from "react";
import { FiSearch, FiRefreshCw } from "react-icons/fi";
import ProductCard from "../components/ProductCard";
import { accessoryService } from "../services/accessoryService";
import { useCart } from "../context/CartContext";
import { useToast } from "../components/Toast";
import { Accessory } from "../types";
import "./Catalog.css";

const Accessories: React.FC = () => {
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { addToCart } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    loadAccessories();

    // Refetch when user returns to tab/window
    const handleFocus = () => {
      loadAccessories();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [search]);

  const loadAccessories = async () => {
    try {
      setLoading(true);
      const data = await accessoryService.getAllAccessories({ search });
      setAccessories(data.results);
    } catch (error) {
      console.error("Failed to load accessories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (accessoryId: number) => {
    try {
      await addToCart("ACCESSORY", accessoryId, 1);
      showToast("✓ Added to cart successfully!", "success");
    } catch (error) {
      showToast("Failed to add to cart. Please try again.", "error");
    }
  };

  return (
    <div className="catalog-page container animate-fadeIn">
      <div className="catalog-header">
        <h1>Accessories</h1>
        <div className="search-bar">
          <FiSearch />
          <input
            type="text"
            placeholder="Search accessories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            onClick={() => loadAccessories()}
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
          {accessories.map((accessory) => (
            <ProductCard
              key={accessory.accessory_id}
              product={accessory}
              type="accessory"
              onAddToCart={() => handleAddToCart(accessory.accessory_id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Accessories;
