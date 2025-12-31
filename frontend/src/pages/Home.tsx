import React from "react";
import { Link } from "react-router-dom";
import {
  FiSmartphone,
  FiPackage,
  FiTruck,
  FiShield,
  FiZap,
  FiAward,
} from "react-icons/fi";
import "./Home.css";

const Home: React.FC = () => {
  return (
    <div className="home animate-fadeIn">
      <section className="hero">
        <div className="hero-background"></div>
        <div className="container hero-content">
          <h1 className="hero-title">
            Discover Your Perfect
            <span className="gradient-text"> Smartphone</span>
          </h1>
          <p className="hero-subtitle">
            Premium mobile phones and accessories at unbeatable prices
          </p>
          <div className="hero-actions">
            <Link to="/phones" className="btn btn-primary btn-large">
              <FiSmartphone />
              Browse Phones
            </Link>
            <Link to="/accessories" className="btn btn-secondary btn-large">
              <FiPackage />
              Shop Accessories
            </Link>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2 className="section-title text-center">
            Why Choose PhoneZone Nepal?
          </h2>
          <div className="features-grid">
            <div className="feature-card card">
              <div className="feature-icon primary">
                <FiSmartphone />
              </div>
              <h3>Latest Models</h3>
              <p>Discover the newest smartphones from top global brands</p>
            </div>

            <div className="feature-card card">
              <div className="feature-icon secondary">
                <FiZap />
              </div>
              <h3>Best Prices</h3>
              <p>Competitive pricing with exclusive deals and offers</p>
            </div>

            <div className="feature-card card">
              <div className="feature-icon success">
                <FiTruck />
              </div>
              <h3>Fast Delivery</h3>
              <p>Quick and reliable shipping right to your doorstep</p>
            </div>

            <div className="feature-card card">
              <div className="feature-icon accent">
                <FiShield />
              </div>
              <h3>Secure Payment</h3>
              <p>100% safe and secure payment methods</p>
            </div>

            <div className="feature-card card">
              <div className="feature-icon warning">
                <FiAward />
              </div>
              <h3>Quality Assured</h3>
              <p>All products come with manufacturer warranty</p>
            </div>

            <div className="feature-card card">
              <div className="feature-icon info">
                <FiPackage />
              </div>
              <h3>Wide Selection</h3>
              <p>Huge variety of phones and accessories to choose from</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-card glass">
            <h2>Ready to Find Your Next Phone?</h2>
            <p>Join thousands of happy customers who trust PhoneZone Nepal</p>
            <Link to="/phones" className="btn btn-primary btn-large">
              Start Shopping Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
