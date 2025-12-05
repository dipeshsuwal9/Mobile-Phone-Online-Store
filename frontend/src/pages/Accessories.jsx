import { useState, useEffect } from "react";
import { accessoryService } from "../services/accessoryService";
import ProductCard from "../components/ProductCard";
import "./Accessories.css";

const Accessories = () => {
  const [accessories, setAccessories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
  });

  useEffect(() => {
    fetchAccessories();
  }, []);

  const fetchAccessories = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.category) params.category = filters.category;

      const data = await accessoryService.getAllAccessories(params);
      setAccessories(data.results || data);
    } catch (error) {
      console.error("Failed to fetch accessories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchAccessories();
  };

  const handleReset = () => {
    setFilters({ search: "", category: "" });
    setTimeout(() => fetchAccessories(), 0);
  };

  return (
    <div className="accessories-page">
      <div className="container">
        <h1>Mobile Accessories</h1>

        <div className="filters-section">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              name="search"
              placeholder="Search accessories..."
              value={filters.search}
              onChange={handleFilterChange}
              className="search-input"
            />
            <button type="submit" className="btn btn-primary">
              Search
            </button>
          </form>

          <div className="filters">
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
            >
              <option value="">All Categories</option>
              <option value="Case">Phone Case</option>
              <option value="Charger">Charger</option>
              <option value="Earphones">Earphones</option>
              <option value="Screen Protector">Screen Protector</option>
              <option value="Power Bank">Power Bank</option>
              <option value="Cable">Cable</option>
              <option value="Other">Other</option>
            </select>

            <button onClick={fetchAccessories} className="btn btn-primary">
              Apply
            </button>
            <button onClick={handleReset} className="btn btn-secondary">
              Reset
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading">Loading accessories...</div>
        ) : (
          <div className="products-grid">
            {accessories.length > 0 ? (
              accessories.map((accessory) => (
                <ProductCard
                  key={accessory.accessory_id}
                  product={accessory}
                  type="ACCESSORY"
                />
              ))
            ) : (
              <p>No accessories found</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Accessories;
