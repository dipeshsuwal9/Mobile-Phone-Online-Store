import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { phoneService, brandService } from "../services/phoneService";
import ProductCard from "../components/ProductCard";
import "./PhoneCatalog.css";

const PhoneCatalog = () => {
  const [phones, setPhones] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    brand: "",
    os: "",
    ram: "",
  });

  useEffect(() => {
    fetchBrands();
    fetchPhones();
  }, []);

  const fetchBrands = async () => {
    try {
      const data = await brandService.getAllBrands();
      setBrands(data.results || data);
    } catch (error) {
      console.error("Failed to fetch brands:", error);
    }
  };

  const fetchPhones = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.brand) params.brand = filters.brand;
      if (filters.os) params.os = filters.os;
      if (filters.ram) params.ram = filters.ram;

      const data = await phoneService.getAllPhones(params);
      setPhones(data.results || data);
    } catch (error) {
      console.error("Failed to fetch phones:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPhones();
  };

  const handleReset = () => {
    setFilters({ search: "", brand: "", os: "", ram: "" });
    setTimeout(() => fetchPhones(), 0);
  };

  return (
    <div className="phone-catalog">
      <div className="container">
        <h1>Mobile Phones</h1>

        <div className="filters-section">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              name="search"
              placeholder="Search phones..."
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
              name="brand"
              value={filters.brand}
              onChange={handleFilterChange}
            >
              <option value="">All Brands</option>
              {brands.map((brand) => (
                <option key={brand.brand_id} value={brand.brand_id}>
                  {brand.brand_name}
                </option>
              ))}
            </select>

            <select name="os" value={filters.os} onChange={handleFilterChange}>
              <option value="">All OS</option>
              <option value="Android">Android</option>
              <option value="iOS">iOS</option>
              <option value="HarmonyOS">HarmonyOS</option>
            </select>

            <select
              name="ram"
              value={filters.ram}
              onChange={handleFilterChange}
            >
              <option value="">All RAM</option>
              <option value="4GB">4GB</option>
              <option value="6GB">6GB</option>
              <option value="8GB">8GB</option>
              <option value="12GB">12GB</option>
            </select>

            <button onClick={fetchPhones} className="btn btn-primary">
              Apply
            </button>
            <button onClick={handleReset} className="btn btn-secondary">
              Reset
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading">Loading phones...</div>
        ) : (
          <div className="products-grid">
            {phones.length > 0 ? (
              phones.map((phone) => (
                <Link
                  key={phone.phone_id}
                  to={`/phones/${phone.phone_id}`}
                  style={{ textDecoration: "none" }}
                >
                  <ProductCard product={phone} type="PHONE" />
                </Link>
              ))
            ) : (
              <p>No phones found</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PhoneCatalog;
