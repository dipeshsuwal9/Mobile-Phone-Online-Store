import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Mobile Phone Store</h1>
          <p>Find the best smartphones and accessories at great prices</p>
          <div className="hero-actions">
            <Link to="/phones" className="btn btn-primary btn-large">
              Browse Phones
            </Link>
            <Link to="/accessories" className="btn btn-secondary btn-large">
              Shop Accessories
            </Link>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2>Why Choose Us?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>📱 Latest Models</h3>
              <p>We offer the newest smartphone models from top brands</p>
            </div>
            <div className="feature-card">
              <h3>💰 Best Prices</h3>
              <p>Competitive pricing and great deals on all products</p>
            </div>
            <div className="feature-card">
              <h3>🚚 Fast Delivery</h3>
              <p>Quick and reliable delivery to your doorstep</p>
            </div>
            <div className="feature-card">
              <h3>🔒 Secure Payment</h3>
              <p>Safe and secure payment options</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
