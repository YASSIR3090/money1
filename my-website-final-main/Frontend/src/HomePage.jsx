import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f8f9fa, #e9ecef)" }}>
      {/* Navigation */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm py-3">
        <div className="container">
          <Link className="navbar-brand fw-bold text-danger fs-4" to="/">
            <i className="fas fa-shopping-cart me-2"></i>
            Availo
          </Link>
          <div className="d-flex">
            <button 
              className="btn btn-outline-danger me-2"
              onClick={() => navigate('/public-sellers')}
            >
              Browse Marketplace
            </button>
            <button 
              className="btn btn-danger"
              onClick={() => navigate('/vendor-login')}
            >
              Seller Login
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container py-5">
        <div className="row align-items-center">
          <div className="col-lg-6 mb-5 mb-lg-0">
            <h1 className="display-4 fw-bold mb-4">
              Find Products <span className="text-danger">Without</span> Wasting Time
            </h1>
            <p className="lead mb-4">
              Tired of going shop to shop only to find out products are out of stock? 
              Availo connects you directly with sellers who actually HAVE what you need.
            </p>
            <div className="d-flex flex-wrap gap-3">
              <button 
                className="btn btn-danger btn-lg px-4"
                onClick={() => navigate('/public-sellers')}
              >
                <i className="fas fa-search me-2"></i>
                Search Products
              </button>
              <button 
                className="btn btn-outline-danger btn-lg px-4"
                onClick={() => navigate('/vendor-register')}
              >
                <i className="fas fa-store me-2"></i>
                Sell Your Products
              </button>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
              <div className="card-body p-4">
                <h4 className="mb-3">How Availo Solves Your Problem:</h4>
                <div className="d-flex mb-3">
                  <div className="bg-danger text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', flexShrink: 0 }}>
                    <i className="fas fa-search"></i>
                  </div>
                  <div className="ms-3">
                    <h5>Search from Home</h5>
                    <p className="text-muted mb-0">Find exactly what you need using smartphone or computer.</p>
                  </div>
                </div>
                <div className="d-flex mb-3">
                  <div className="bg-danger text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', flexShrink: 0 }}>
                    <i className="fas fa-check-circle"></i>
                  </div>
                  <div className="ms-3">
                    <h5>See Real Stock</h5>
                    <p className="text-muted mb-0">Know if products are available BEFORE you go shopping.</p>
                  </div>
                </div>
                <div className="d-flex">
                  <div className="bg-danger text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', flexShrink: 0 }}>
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <div className="ms-3">
                    <h5>Find Nearest Seller</h5>
                    <p className="text-muted mb-0">Locate sellers in your area with the products you need.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Problem Section */}
      <div className="bg-light py-5">
        <div className="container">
          <h2 className="text-center mb-5">The Problem We Solve</h2>
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="bg-danger bg-opacity-10 text-danger rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                    <i className="fas fa-walking fa-2x"></i>
                  </div>
                  <h5 className="mb-3">Wasted Time & Energy</h5>
                  <p className="text-muted">Customers visit multiple shops only to find products are out of stock.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="bg-danger bg-opacity-10 text-danger rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                    <i className="fas fa-money-bill-wave fa-2x"></i>
                  </div>
                  <h5 className="mb-3">Lost Business</h5>
                  <p className="text-muted">Sellers lose customers who can't find what they're looking for.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="bg-danger bg-opacity-10 text-danger rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                    <i className="fas fa-frustrated fa-2x"></i>
                  </div>
                  <h5 className="mb-3">Customer Frustration</h5>
                  <p className="text-muted">The exhausting "zunguka na kuzunguka" shopping experience.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="container py-5">
        <h2 className="text-center mb-5">How Availo Works</h2>
        <div className="row">
          <div className="col-md-3 mb-4">
            <div className="text-center">
              <div className="bg-danger text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                <span className="display-6 fw-bold">1</span>
              </div>
              <h5>Sellers List Products</h5>
              <p className="text-muted">Shop owners register and list their available products with real stock information.</p>
            </div>
          </div>
          <div className="col-md-3 mb-4">
            <div className="text-center">
              <div className="bg-danger text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                <span className="display-6 fw-bold">2</span>
              </div>
              <h5>Buyers Search</h5>
              <p className="text-muted">Customers search for products they need from home or mobile.</p>
            </div>
          </div>
          <div className="col-md-3 mb-4">
            <div className="text-center">
              <div className="bg-danger text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                <span className="display-6 fw-bold">3</span>
              </div>
              <h5>See Real Availability</h5>
              <p className="text-muted">View which sellers actually have the product in stock right now.</p>
            </div>
          </div>
          <div className="col-md-3 mb-4">
            <div className="text-center">
              <div className="bg-danger text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                <span className="display-6 fw-bold">4</span>
              </div>
              <h5>Contact & Buy</h5>
              <p className="text-muted">Contact seller directly or visit knowing they have what you need.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Categories */}
      <div className="bg-light py-5">
        <div className="container">
          <h2 className="text-center mb-5">Popular Product Categories</h2>
          <div className="row">
            {['Electronics', 'Computers & Laptops', 'Mobile Phones', 'Home Appliances', 'Furniture', 'Fashion', 'Vehicles', 'Beauty Products'].map((category, index) => (
              <div className="col-md-3 col-6 mb-3" key={index}>
                <div className="card border-0 shadow-sm h-100 hover-lift">
                  <div className="card-body text-center p-3">
                    <div className="bg-danger bg-opacity-10 text-danger rounded-circle d-inline-flex align-items-center justify-content-center mb-2" style={{ width: '50px', height: '50px' }}>
                      <i className={`fas fa-${getCategoryIcon(category)}`}></i>
                    </div>
                    <h6 className="mb-0">{category}</h6>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="container py-5">
        <div className="card bg-danger text-white border-0 shadow-lg">
          <div className="card-body p-5 text-center">
            <h2 className="mb-3">Ready to Stop Wasting Time Shopping?</h2>
            <p className="mb-4">Join thousands of buyers and sellers using Availo today.</p>
            <div className="d-flex flex-wrap justify-content-center gap-3">
              <button 
                className="btn btn-light btn-lg px-4"
                onClick={() => navigate('/public-sellers')}
              >
                <i className="fas fa-search me-2"></i>
                Start Shopping
              </button>
              <button 
                className="btn btn-outline-light btn-lg px-4"
                onClick={() => navigate('/vendor-register')}
              >
                <i className="fas fa-store me-2"></i>
                Start Selling
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-dark text-white py-4">
        <div className="container">
          <div className="row">
            <div className="col-md-4 mb-3">
              <h5 className="mb-3">
                <i className="fas fa-shopping-cart me-2"></i>
                Availo Marketplace
              </h5>
              <p className="text-light small">
                Connecting buyers with sellers who actually have the products they need.
              </p>
            </div>
            <div className="col-md-4 mb-3">
              <h5 className="mb-3">Quick Links</h5>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <button className="btn btn-link text-light text-decoration-none p-0" onClick={() => navigate('/public-sellers')}>
                    <i className="fas fa-store me-1"></i> Marketplace
                  </button>
                </li>
                <li className="mb-2">
                  <button className="btn btn-link text-light text-decoration-none p-0" onClick={() => navigate('/vendor-login')}>
                    <i className="fas fa-sign-in-alt me-1"></i> Seller Login
                  </button>
                </li>
                <li className="mb-2">
                  <button className="btn btn-link text-light text-decoration-none p-0" onClick={() => navigate('/vendor-register')}>
                    <i className="fas fa-user-plus me-1"></i> Seller Registration
                  </button>
                </li>
              </ul>
            </div>
            <div className="col-md-4 mb-3">
              <h5 className="mb-3">Contact Us</h5>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <i className="fas fa-phone me-2"></i>
                  +255 754 AVAILO
                </li>
                <li className="mb-2">
                  <i className="fas fa-envelope me-2"></i>
                  support@availo.co.tz
                </li>
                <li>
                  <i className="fas fa-map-marker-alt me-2"></i>
                  Dar es Salaam, Tanzania
                </li>
              </ul>
            </div>
          </div>
          <hr className="bg-light my-4" />
          <div className="text-center">
            <small>
              © {new Date().getFullYear()} Availo Marketplace. All rights reserved.
            </small>
          </div>
        </div>
      </footer>

      <style>
        {`
          .hover-lift {
            transition: transform 0.2s ease;
          }
          .hover-lift:hover {
            transform: translateY(-5px);
          }
        `}
      </style>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
    </div>
  );
}

// Helper function for category icons
function getCategoryIcon(category) {
  const icons = {
    'Electronics': 'tv',
    'Computers & Laptops': 'laptop',
    'Mobile Phones': 'mobile-alt',
    'Home Appliances': 'home',
    'Furniture': 'couch',
    'Fashion': 'tshirt',
    'Vehicles': 'car',
    'Beauty Products': 'spa'
  };
  return icons[category] || 'tag';
}

export default HomePage;