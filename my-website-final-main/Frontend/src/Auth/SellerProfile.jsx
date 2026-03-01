// src/Auth/SellerProfile.jsx - COMPLETE FIXED VERSION 🔥
// ✅ ADD PRODUCT - Registered user goes directly to VendorRegister
// ✅ USES EMAIL AS UNIQUE IDENTIFIER
// ✅ SAME PROFILE ACROSS ALL DEVICES
// ✅ NO SAMPLE PRODUCTS - ONLY REAL PRODUCTS!
// ✅ FETCHES FROM BACKEND API

import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import apiClient from "../api/apiClient";

function SellerProfile() {
  const [currentUser, setCurrentUser] = useState(null);
  const [sellerProducts, setSellerProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("products");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePictureError, setProfilePictureError] = useState(false);
  
  // Use refs to prevent multiple loads
  const hasLoadedPicture = useRef(false);
  const hasCheckedAuth = useRef(false);
  const hasLoadedProducts = useRef(false);
  
  // Mobile state
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    user: authUser, 
    logout, 
    isVendorRegistered, 
    getUserProfilePicture
  } = useAuth();

  // Check if device is touch device
  useEffect(() => {
    const checkTouchDevice = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    checkTouchDevice();
    window.addEventListener('resize', checkTouchDevice);
    return () => window.removeEventListener('resize', checkTouchDevice);
  }, []);

  // Handle messages from location state
  useEffect(() => {
    if (location.state?.success) {
      setSuccessMessage(location.state.success);
      window.history.replaceState({}, document.title);
    }
    if (location.state?.error) {
      setErrorMessage(location.state.error);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // ✅ Load profile picture
  useEffect(() => {
    if (hasLoadedPicture.current) {
      console.log("🖼️ SellerProfile: Picture already loaded, skipping...");
      return;
    }
    
    const loadProfilePicture = () => {
      if (authUser) {
        console.log("🖼️ SellerProfile: Loading profile picture for:", authUser.email);
        
        // Try to get picture from multiple sources
        const pictureUrl = 
          authUser.picture || 
          authUser.photo || 
          getUserProfilePicture() ||
          null;
        
        if (pictureUrl && pictureUrl.includes('googleusercontent.com')) {
          console.log("✅ Using Google profile picture");
          setProfilePicture(pictureUrl);
          setProfilePictureError(false);
        } else {
          // Use SVG avatar
          const name = authUser.name || authUser.displayName || authUser.email?.split('@')[0] || 'User';
          const initial = name.charAt(0).toUpperCase();
          const svgAvatar = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23dc3545' /%3E%3Ctext x='50' y='50' font-size='50' text-anchor='middle' dy='0.3em' fill='white' font-family='Arial, sans-serif' font-weight='bold'%3E${initial}%3C/text%3E%3C/svg%3E`;
          setProfilePicture(svgAvatar);
        }
        
        hasLoadedPicture.current = true;
      }
    };

    loadProfilePicture();
  }, [authUser, getUserProfilePicture]);

  // ✅ Auth check - uses EMAIL as unique identifier
  useEffect(() => {
    if (hasCheckedAuth.current) {
      return;
    }
    
    console.log("SellerProfile: Auth check - ONCE");
    
    if (!authUser) {
      console.log("❌ No authenticated user, redirecting to login");
      hasCheckedAuth.current = true;
      navigate("/vendor-login", { 
        state: { 
          error: "Please login to access seller profile",
          from: "/seller-profile"
        } 
      });
      return;
    }

    // Token check removed for PUBLIC ACCESS mode
    console.log("✅ User authenticated");
    console.log("✅ User email:", authUser.email); // Email is the unique identifier
    
    // Set current user data
    setCurrentUser({
      id: authUser.id,
      email: authUser.email, // This is the KEY identifier
      displayName: authUser.name || authUser.displayName || authUser.email?.split('@')[0] || "User",
      name: authUser.name || authUser.displayName || authUser.email?.split('@')[0] || "User",
      photoURL: profilePicture || authUser.picture || authUser.photo,
      picture: profilePicture || authUser.picture || authUser.photo,
      providerId: authUser.provider || authUser.providerId || "unknown",
      isEmailVerified: authUser.email_verified || false,
      loginTime: authUser.loginTime || new Date().toISOString()
    });
    
    // Check if user is a registered vendor
    const userEmail = authUser.email; // Using email as identifier
    const isRegistered = isVendorRegistered(userEmail);
    
    console.log("🔍 Vendor registration check:", { email: userEmail, isRegistered });
    
    if (!isRegistered) {
      console.log("⚠️ User is not registered as vendor, redirecting to registration");
      hasCheckedAuth.current = true;
      navigate("/vendor-register", { 
        replace: true,
        state: { 
          user: authUser,
          action: "register-vendor",
          message: "Please complete your vendor registration first",
          from: "/seller-profile"
        } 
      });
      return;
    }
    
    // User is registered, load their products from API using EMAIL
    fetchSellerProductsFromAPI(userEmail);
    
    hasCheckedAuth.current = true;
    setIsLoading(false);
    
    // Listen for storage changes (other tabs)
    const handleStorageChange = (e) => {
      if (e.key === 'allSellersData_backup' || e.key === null) {
        console.log("🔄 Storage changed, reloading seller products...");
        fetchSellerProductsFromAPI(userEmail);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Auto-refresh every 2 minutes (reduced from 30s to prevent overfetching)
    const interval = setInterval(() => {
      fetchSellerProductsFromAPI(userEmail);
    }, 120000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
    
  }, [authUser, profilePicture, navigate, isVendorRegistered]);

  // ✅ FETCH SELLER PRODUCTS - SIMPLIFIED (NO LOCALSTORAGE CACHING)
  const fetchSellerProductsFromAPI = async (userEmail) => {
    if (!userEmail) return;
    
    setIsApiLoading(true);
    
    try {
      console.log(`📦 Fetching products for ${userEmail} from API...`);
      const response = await apiClient.get(`/api/products/seller/${encodeURIComponent(userEmail)}/`);
      
      let products = [];
      if (response.data?.products) {
        products = response.data.products;
      } else if (response.data?.results) {
        products = response.data.results;
      } else if (Array.isArray(response.data)) {
        products = response.data;
      }
      
      // Sort by date
      products.sort((a, b) => {
        const dateA = new Date(a.registrationDate || a.created_at || 0);
        const dateB = new Date(b.registrationDate || b.created_at || 0);
        return dateB - dateA;
      });
      
      console.log(`✅ Found ${products.length} products for ${userEmail}`);
      setSellerProducts(products);
    } catch (error) {
      console.error("❌ Error fetching products:", error);
    } finally {
      setIsApiLoading(false);
    }
  };

  // ✅ Handle logout
  const handleLogout = async () => {
    try {
      logout();
      navigate("/vendor-login", { 
        state: { 
          success: "Successfully logged out" 
        } 
      });
    } catch (error) {
      console.error("Logout error:", error);
      setErrorMessage("Failed to logout. Please try again.");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  // ✅ FIXED: Navigate to add product - CORRECT LOGIC!
  const handleAddProduct = async () => {
    if (!currentUser && !authUser) {
      navigate("/vendor-login", {
        state: {
          error: "Please login to add products",
          from: "/vendor-register"
        }
      });
      return;
    }

    const userToUse = currentUser || authUser;
    const userEmail = userToUse?.email;

    // ✅ DIRECT CHECK: Check if user is registered using the hook
    const isRegistered = isVendorRegistered(userEmail);
    console.log("🔍 Vendor registration check (DIRECT):", { email: userEmail, isRegistered });

    if (!isRegistered) {
      // User is logged in but NOT registered - go to registration
      navigate("/vendor-register", {
        state: {
          user: userToUse,
          action: "register-vendor",
          message: "Please complete vendor registration to add products",
          from: "/seller-profile"
        }
      });
    } else {
      // ✅ USER IS REGISTERED - GO DIRECTLY TO ADD PRODUCT!
      console.log("➡️ User IS registered - Redirecting directly to add product (NO LOGIN)");
      navigate("/vendor-register", {
        state: {
          user: userToUse,
          action: "add-product",
          message: "Add new product to your shop",
          from: "/seller-profile"
        }
      });
    }
  };

  // ✅ Handle product click
  const handleProductClick = (product) => {
    console.log("📦 Navigating to product details:", product.id, product.productName);
    navigate(`/product/${product.id}`);
  };

  // ✅ Handle delete product
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    // Token check removed for PUBLIC ACCESS mode
    setIsApiLoading(true);

    try {
      console.log(`🗑️ Deleting product ${productId} from API...`);
      
      await apiClient.delete(`/api/products/${productId}/`);
      
      console.log("✅ Product deleted from backend");
      
      // Update state
      setSellerProducts(prev => prev.filter(p => p.id !== productId));
      
      setSuccessMessage("✅ Product deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      
    } catch (error) {
      console.error("❌ Error deleting product:", error);
      
      if (error.response?.status === 401) {
        setErrorMessage("Your session has expired. Please login again.");
        setTimeout(() => navigate('/vendor-login'), 2000);
      } else {
        setErrorMessage("Failed to delete product. Please try again.");
      }
    } finally {
      setIsApiLoading(false);
    }
  };

  const formatPrice = (price, currency = "TZS") => {
    if (!price) return "Price not set";
    const numPrice = parseFloat(price);
    if (isNaN(numPrice)) return price;
    
    if (currency === "TZS") {
      return new Intl.NumberFormat('en-TZ', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(numPrice) + " TZS";
    } else {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(numPrice);
    }
  };

  const getStockBadgeColor = (status) => {
    switch (status) {
      case "Available": return "success";
      case "Limited": return "warning";
      case "Out of Stock": return "danger";
      default: return "secondary";
    }
  };

  // Get first name from display name or email
  const getFirstName = () => {
    const user = currentUser || authUser;
    if (!user) return "";
    
    const name = user.displayName || user.name || "";
    const nameParts = name.trim().split(/\s+/);
    return nameParts[0] || user.email?.split('@')[0] || "User";
  };

  // Get user initial
  const getUserInitial = () => {
    const user = currentUser || authUser;
    if (!user) return "U";
    
    const name = user.displayName || user.name || "";
    if (name.length === 0) return "U";
    return name.charAt(0).toUpperCase();
  };

  // Get profile picture URL
  const getProfilePictureUrl = (size = 200) => {
    if (profilePicture && !profilePictureError) {
      return profilePicture;
    }
    
    const name = getFirstName();
    const initial = name.charAt(0).toUpperCase();
    
    const svgAvatar = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23dc3545' /%3E%3Ctext x='50' y='50' font-size='50' text-anchor='middle' dy='0.3em' fill='white' font-family='Arial, sans-serif' font-weight='bold'%3E${initial}%3C/text%3E%3C/svg%3E`;
    
    return svgAvatar;
  };

  // Handle profile picture error
  const handleProfilePictureError = () => {
    console.log("❌ Profile picture failed to load, using SVG");
    setProfilePictureError(true);
  };

  // Bottom Navigation Handlers
  const handleHomeClick = () => navigate("/");
  const handleProductsClick = () => navigate("/products");
  const handleAddNewClick = () => handleAddProduct();
  const handleShopsClick = () => navigate("/shops");
  const handleAccountClick = () => {
    setActiveTab("profile");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle edit product
  const handleEditProduct = (product) => {
    const user = currentUser || authUser;
    navigate("/vendor-register", {
      state: {
        user: user,
        action: "edit-product",
        product: product,
        message: "Edit product details",
        from: "/seller-profile"
      }
    });
  };

  if (isLoading) {
    return (
      <div style={{ 
        height: "100vh", 
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#ffffff"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: "40px",
            height: "40px",
            border: "3px solid rgba(0,0,0,0.1)",
            borderTop: "3px solid #FF6B6B",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
            margin: "0 auto 15px"
          }}></div>
          <p style={{ color: "#5f6368", fontSize: "14px", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif" }}>Loading seller profile...</p>
        </div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!currentUser && !authUser) {
    return (
      <div style={{ 
        height: "100vh", 
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#ffffff"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: "40px",
            height: "40px",
            border: "3px solid rgba(0,0,0,0.1)",
            borderTop: "3px solid #FF6B6B",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
            margin: "0 auto 15px"
          }}></div>
          <p style={{ color: "#5f6368", fontSize: "14px", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif" }}>Redirecting to login...</p>
        </div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const userToDisplay = currentUser || authUser;

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "linear-gradient(135deg, #f8f9fa, #e9ecef)", 
      paddingBottom: isTouchDevice ? "80px" : "50px" 
    }}>
      {/* Success and Error Messages */}
      {successMessage && (
        <div className="alert alert-success alert-dismissible fade show m-2 m-md-3" role="alert">
          <i className="fas fa-check-circle me-2"></i>
          {successMessage}
          <button type="button" className="btn-close" onClick={() => setSuccessMessage("")}></button>
        </div>
      )}
      
      {errorMessage && (
        <div className="alert alert-danger alert-dismissible fade show m-2 m-md-3" role="alert">
          <i className="fas fa-exclamation-circle me-2"></i>
          {errorMessage}
          <button type="button" className="btn-close" onClick={() => setErrorMessage("")}></button>
        </div>
      )}

      {/* Fixed Horizontal Navigation Bar */}
      <div className="fixed-top" style={{ zIndex: 1030 }}>
        <div className="container-fluid px-0">
          <div className="card rounded-0 border-0" style={{ 
            background: "linear-gradient(135deg, #dc3545, #e57373)",
            borderRadius: "0"
          }}>
            <div className="card-body py-2">
              <div className="container">
                <div className="row align-items-center">
                  {/* Logo Section */}
                  <div className="col-12 mb-2">
                    <div className="d-flex justify-content-between align-items-center">
                      <Link 
                        className="navbar-brand fw-bold text-white text-decoration-none" 
                        to="/" 
                        style={{ 
                          fontSize: "18px",
                          display: "flex",
                          alignItems: "center"
                        }}
                      >
                        <i className="fas fa-shopping-cart me-2" style={{ color: "white", fontSize: "20px" }}></i>
                        Availo
                      </Link>
                      
                      <h6 className="mb-0 text-end" style={{ 
                        color: "white", 
                        fontWeight: "bold",
                        fontSize: "14px",
                        textShadow: "1px 1px 2px rgba(0,0,0,0.2)"
                      }}>
                        Welcome, {getFirstName()} ({userToDisplay?.email})
                      </h6>
                    </div>
                  </div>
                  
                  {/* Navigation Tabs */}
                  <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center">
                      <button 
                        className={`btn btn-link text-white text-decoration-none ${activeTab === "products" ? "active-tab" : ""}`}
                        onClick={() => setActiveTab("products")}
                        style={{
                          padding: "8px 12px",
                          fontSize: "14px",
                          fontWeight: activeTab === "products" ? "bold" : "normal",
                          borderBottom: activeTab === "products" ? "3px solid white" : "none",
                          borderRadius: "0",
                          flex: 1,
                          textAlign: "center"
                        }}
                      >
                        Products
                      </button>
                      
                      <button 
                        className={`btn btn-link text-white text-decoration-none ${activeTab === "profile" ? "active-tab" : ""}`}
                        onClick={() => setActiveTab("profile")}
                        style={{
                          padding: "8px 12px",
                          fontSize: "14px",
                          fontWeight: activeTab === "profile" ? "bold" : "normal",
                          borderBottom: activeTab === "profile" ? "3px solid white" : "none",
                          borderRadius: "0",
                          flex: 1,
                          textAlign: "center"
                        }}
                      >
                        Profile
                      </button>
                      
                      <button 
                        className={`btn btn-link text-white text-decoration-none ${activeTab === "stats" ? "active-tab" : ""}`}
                        onClick={() => setActiveTab("stats")}
                        style={{
                          padding: "8px 12px",
                          fontSize: "14px",
                          fontWeight: activeTab === "stats" ? "bold" : "normal",
                          borderBottom: activeTab === "stats" ? "3px solid white" : "none",
                          borderRadius: "0",
                          flex: 1,
                          textAlign: "center"
                        }}
                      >
                        Stats
                      </button>
                      
                      <button 
                        className="btn btn-link text-white text-decoration-none"
                        onClick={handleLogout}
                        style={{
                          padding: "8px 12px",
                          fontSize: "14px",
                          fontWeight: "normal",
                          borderRadius: "0",
                          flex: 1,
                          textAlign: "center"
                        }}
                      >
                        <i className="fas fa-sign-out-alt me-1"></i>
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add padding-top to account for fixed navbar */}
      <div style={{ paddingTop: "80px" }}></div>

      {/* Tab Content */}
      <div className="container mt-4">
        {/* Products Tab */}
        {activeTab === "products" && (
          <div className="tab-content">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="h5 mb-0">My Products</h3>
              <div className="d-flex align-items-center">
                {isApiLoading && (
                  <div className="spinner-border spinner-border-sm text-danger me-2" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                )}
                <span className="badge bg-danger me-2">{sellerProducts.length} items</span>
                <button 
                  className="btn btn-danger btn-sm"
                  onClick={handleAddProduct}
                >
                  <i className="fas fa-plus me-1"></i>
                  Add Product
                </button>
              </div>
            </div>
            
            {sellerProducts.length === 0 ? (
              <div className="text-center py-5">
                <div className="rounded-circle bg-light text-danger d-inline-flex align-items-center justify-content-center mb-3" 
                     style={{ width: "80px", height: "80px" }}>
                  <i className="fas fa-box-open fa-2x"></i>
                </div>
                <h5 className="text-muted mb-3">No Products Listed</h5>
                <p className="text-muted mb-4">Start selling by adding your first product</p>
                <button 
                  className="btn btn-danger"
                  onClick={handleAddProduct}
                >
                  <i className="fas fa-plus me-1"></i>
                  Add First Product
                </button>
              </div>
            ) : (
              <div className="list-view-container">
                {sellerProducts.map((product, index) => (
                  <div key={`${product.id}-${index}`} className="mb-3">
                    <div 
                      className="product-list-item card border-0 shadow-sm"
                      style={{ 
                        borderRadius: "10px",
                        overflow: "hidden",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        background: "#fff"
                      }}
                      onClick={() => handleProductClick(product)}
                    >
                      <div className="row g-0">
                        <div className="col-4">
                          <div style={{ 
                            height: "120px", 
                            overflow: "hidden",
                            backgroundColor: "#f8f9fa",
                            position: "relative",
                            borderRadius: "10px 0 0 10px"
                          }}>
                            <img 
                              src={product.productImages?.[0] || product.product_images?.[0] || "https://images.unsplash.com/photo-1556656793-08538906a9f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
                              className="w-100 h-100"
                              alt={product.productName || product.product_name}
                              style={{ objectFit: "cover" }}
                            />
                            <div className="position-absolute top-0 start-0 m-2">
                              <span className={`badge bg-${getStockBadgeColor(product.stockStatus || product.stock_status)}`} style={{ fontSize: "10px" }}>
                                {product.stockStatus || product.stock_status || "Unknown"}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="col-8">
                          <div className="card-body p-3">
                            <div className="d-flex justify-content-between align-items-start">
                              <div style={{ flex: 1 }}>
                                <h6 className="mb-1" style={{ 
                                  fontSize: "14px",
                                  fontWeight: "600",
                                  color: "#333",
                                  margin: "0 0 5px 0",
                                  lineHeight: "1.3"
                                }}>
                                  {product.productName || product.product_name}
                                </h6>
                                
                                <div className="mb-2">
                                  <span className="text-danger fw-bold" style={{ fontSize: "15px" }}>
                                    {formatPrice(product.price, product.currency)}
                                  </span>
                                </div>

                                <div className="d-flex justify-content-between align-items-center mb-2">
                                  <small className="text-muted" style={{ fontSize: "11px" }}>
                                    <i className="fas fa-tag me-1"></i>
                                    {product.mainCategory || product.main_category || "General"}
                                  </small>
                                  <span className={`badge bg-${(product.condition === "New" || product.condition === "new") ? "success" : "warning"}`} style={{ fontSize: "10px" }}>
                                    {product.condition || "New"}
                                  </span>
                                </div>
                                
                                <div className="mb-2">
                                  <small className="text-muted" style={{ fontSize: "10px" }}>
                                    <i className="fas fa-calendar-alt me-1"></i>
                                    Added: {new Date(product.registrationDate || product.created_at || Date.now()).toLocaleDateString()}
                                  </small>
                                </div>
                              </div>
                              
                              <button 
                                className="btn btn-outline-primary btn-sm rounded-circle ms-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditProduct(product);
                                }}
                                title="Edit Product"
                                style={{ 
                                  width: "28px", 
                                  height: "28px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  padding: 0,
                                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                  flexShrink: 0
                                }}
                              >
                                <i className="fas fa-edit" style={{ fontSize: "11px" }}></i>
                              </button>
                              
                              <button 
                                className="btn btn-danger btn-sm rounded-circle ms-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteProduct(product.id);
                                }}
                                title="Delete Product"
                                style={{ 
                                  width: "28px", 
                                  height: "28px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  padding: 0,
                                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                                  flexShrink: 0
                                }}
                              >
                                <i className="fas fa-trash" style={{ fontSize: "11px" }}></i>
                              </button>
                            </div>
                            
                            <div className="mt-2">
                              {product.brand && (
                                <small className="text-muted d-block mb-1" style={{ fontSize: "10px" }}>
                                  <i className="fas fa-tag me-1"></i>
                                  Brand: {product.brand}
                                </small>
                              )}
                              {(product.specifications || product.description) && (
                                <small className="text-muted d-block" style={{ fontSize: "10px" }}>
                                  <i className="fas fa-info-circle me-1"></i>
                                  {(product.specifications || product.description || "").length > 40 
                                    ? (product.specifications || product.description || "").substring(0, 40) + "..." 
                                    : (product.specifications || product.description || "")}
                                </small>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Profile Details Tab */}
        {activeTab === "profile" && (
          <div className="tab-content">
            <div className="card shadow-sm border-0">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="card-title mb-0">
                    <i className="fas fa-user-circle me-2 text-danger"></i>
                    Profile Information
                  </h4>
                  <span className="badge bg-primary">
                    {userToDisplay?.provider === "google" || userToDisplay?.providerId === "google" 
                      ? "Google Account" 
                      : "Email Account"}
                  </span>
                </div>
                
                {/* Profile Picture */}
                <div className="text-center mb-4">
                  <div className="position-relative d-inline-block">
                    {profilePicture && !profilePictureError ? (
                      <img 
                        src={profilePicture} 
                        alt={userToDisplay?.displayName || userToDisplay?.name || "Profile"} 
                        className="rounded-circle shadow"
                        style={{ 
                          width: "150px", 
                          height: "150px", 
                          objectFit: "cover",
                          border: "4px solid #dc3545"
                        }}
                        onError={handleProfilePictureError}
                        referrerPolicy="no-referrer"
                        crossOrigin="anonymous"
                      />
                    ) : (
                      <div 
                        className="rounded-circle shadow d-flex align-items-center justify-content-center"
                        style={{ 
                          width: "150px", 
                          height: "150px", 
                          backgroundColor: "#dc3545",
                          border: "4px solid #dc3545",
                          color: "white",
                          fontSize: "48px",
                          fontWeight: "bold"
                        }}
                      >
                        {getUserInitial()}
                      </div>
                    )}
                    <div className="position-absolute bottom-0 end-0 bg-success rounded-circle p-1 border border-white">
                      <i className="fas fa-check text-white" style={{ fontSize: "12px" }}></i>
                    </div>
                  </div>
                  <h5 className="mt-3 mb-1">
                    {userToDisplay?.displayName || userToDisplay?.name || userToDisplay?.email?.split('@')[0] || "User"}
                  </h5>
                  <p className="text-muted mb-0">
                    {userToDisplay?.email}
                  </p>
                  <small className="text-muted">
                    <i className="fas fa-shield-alt me-1"></i>
                    User ID: {userToDisplay?.email} {/* Showing email as identifier */}
                  </small>
                </div>
                
                {/* User Details */}
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold text-muted">Account Type</label>
                    <p className="fw-bold">
                      <span className={`badge ${userToDisplay?.provider === "google" || userToDisplay?.providerId === "google" ? "bg-primary" : "bg-success"}`}>
                        {userToDisplay?.provider === "google" || userToDisplay?.providerId === "google" 
                          ? "Google Sign-In" 
                          : "Email/Password"}
                      </span>
                    </p>
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold text-muted">Email Verified</label>
                    <p className="fw-bold">
                      <span className={`badge ${userToDisplay?.isEmailVerified ? "bg-success" : "bg-warning"}`}>
                        {userToDisplay?.isEmailVerified ? "Verified" : "Not Verified"}
                      </span>
                    </p>
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold text-muted">Email Address</label>
                    <p className="fw-bold" style={{ fontSize: "12px", wordBreak: "break-all" }}>
                      {userToDisplay?.email}
                    </p>
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold text-muted">Authentication</label>
                    <p className="fw-bold">
                      {userToDisplay?.provider || userToDisplay?.providerId || "email"}
                    </p>
                  </div>
                  
                  <div className="col-12 mt-4">
                    <div className="alert alert-info">
                      <i className="fas fa-info-circle me-2"></i>
                      <strong>Account Identifier</strong>
                      <p className="mb-0 mt-2">
                        Your account is identified by <strong>{userToDisplay?.email}</strong>. 
                        This email is used across all devices to access your profile and products.
                      </p>
                    </div>
                  </div>
                  
                  {/* Seller Status Info */}
                  <div className="col-12 mt-3">
                    <div className="card border-0" style={{ backgroundColor: "#f8f9fa" }}>
                      <div className="card-body">
                        <h6 className="card-title">
                          <i className="fas fa-store me-2 text-danger"></i>
                          Seller Status
                        </h6>
                        <div className="row">
                          <div className="col-md-6">
                            <p className="mb-1">
                              <strong>Total Products:</strong> {sellerProducts.length}
                            </p>
                            <p className="mb-1">
                              <strong>Registered Vendor:</strong>{" "}
                              <span className="badge bg-success">Yes</span>
                            </p>
                          </div>
                          <div className="col-md-6">
                            <p className="mb-1">
                              <strong>Identifier:</strong> Email Address
                            </p>
                            <p className="mb-1">
                              <strong>Last Activity:</strong>{" "}
                              {sellerProducts.length > 0 
                                ? new Date(sellerProducts[0].registrationDate || sellerProducts[0].created_at || Date.now()).toLocaleDateString()
                                : "Today"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="col-12 mt-4">
                    <div className="d-grid gap-2">
                      <button 
                        className="btn btn-danger"
                        onClick={handleAddProduct}
                      >
                        <i className="fas fa-plus me-2"></i>
                        Add New Product
                      </button>
                      <button 
                        className="btn btn-outline-danger"
                        onClick={handleLogout}
                      >
                        <i className="fas fa-sign-out-alt me-2"></i>
                        Logout from Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Statistics Tab */}
        {activeTab === "stats" && (
          <div className="tab-content">
            <div className="row g-4">
              {/* Stats Cards */}
              <div className="col-md-3 col-sm-6">
                <div className="card shadow-sm border-0 text-center" style={{ borderRadius: "15px" }}>
                  <div className="card-body py-4">
                    <div className="rounded-circle bg-danger text-white d-inline-flex align-items-center justify-content-center mb-3" 
                         style={{ width: "60px", height: "60px" }}>
                      <i className="fas fa-box fa-2x"></i>
                    </div>
                    <h3 className="fw-bold mb-1">{sellerProducts.length}</h3>
                    <p className="text-muted mb-0">Total Products</p>
                  </div>
                </div>
              </div>
              
              <div className="col-md-3 col-sm-6">
                <div className="card shadow-sm border-0 text-center" style={{ borderRadius: "15px" }}>
                  <div className="card-body py-4">
                    <div className="rounded-circle bg-success text-white d-inline-flex align-items-center justify-content-center mb-3" 
                         style={{ width: "60px", height: "60px" }}>
                      <i className="fas fa-check-circle fa-2x"></i>
                    </div>
                    <h3 className="fw-bold mb-1">
                      {sellerProducts.filter(p => (p.stockStatus || p.stock_status) === "Available").length}
                    </h3>
                    <p className="text-muted mb-0">Available</p>
                  </div>
                </div>
              </div>
              
              <div className="col-md-3 col-sm-6">
                <div className="card shadow-sm border-0 text-center" style={{ borderRadius: "15px" }}>
                  <div className="card-body py-4">
                    <div className="rounded-circle bg-warning text-white d-inline-flex align-items-center justify-content-center mb-3" 
                         style={{ width: "60px", height: "60px" }}>
                      <i className="fas fa-exclamation-triangle fa-2x"></i>
                    </div>
                    <h3 className="fw-bold mb-1">
                      {sellerProducts.filter(p => (p.stockStatus || p.stock_status) === "Limited").length}
                    </h3>
                    <p className="text-muted mb-0">Limited Stock</p>
                  </div>
                </div>
              </div>
              
              <div className="col-md-3 col-sm-6">
                <div className="card shadow-sm border-0 text-center" style={{ borderRadius: "15px" }}>
                  <div className="card-body py-4">
                    <div className="rounded-circle bg-secondary text-white d-inline-flex align-items-center justify-content-center mb-3" 
                         style={{ width: "60px", height: "60px" }}>
                      <i className="fas fa-ban fa-2x"></i>
                    </div>
                    <h3 className="fw-bold mb-1">
                      {sellerProducts.filter(p => (p.stockStatus || p.stock_status) === "Out of Stock").length}
                    </h3>
                    <p className="text-muted mb-0">Out of Stock</p>
                  </div>
                </div>
              </div>
              
              {/* Recent Activity */}
              <div className="col-12">
                <div className="card shadow-sm border-0">
                  <div className="card-body">
                    <h5 className="card-title mb-4">
                      <i className="fas fa-chart-line me-2 text-danger"></i>
                      Recent Products
                    </h5>
                    
                    {sellerProducts.length === 0 ? (
                      <div className="text-center py-3">
                        <p className="text-muted">No products added yet.</p>
                        <button 
                          className="btn btn-danger btn-sm"
                          onClick={handleAddProduct}
                        >
                          <i className="fas fa-plus me-1"></i>
                          Add Your First Product
                        </button>
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead>
                            <tr>
                              <th>Product</th>
                              <th>Price</th>
                              <th>Status</th>
                              <th>Category</th>
                              <th>Date</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {sellerProducts.slice(0, 5).map((product, index) => (
                              <tr key={`${product.id}-${index}`} style={{ cursor: "pointer" }} onClick={() => handleProductClick(product)}>
                                <td>
                                  <div className="d-flex align-items-center">
                                    {(product.productImages?.[0] || product.product_images?.[0]) ? (
                                      <img 
                                        src={product.productImages?.[0] || product.product_images?.[0]} 
                                        alt={product.productName || product.product_name}
                                        style={{ 
                                          width: "40px", 
                                          height: "40px", 
                                          objectFit: "cover",
                                          borderRadius: "5px",
                                          marginRight: "10px"
                                        }}
                                        onError={(e) => {
                                          e.target.src = "https://images.unsplash.com/photo-1556656793-08538906a9f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
                                        }}
                                      />
                                    ) : (
                                      <div style={{ 
                                        width: "40px", 
                                        height: "40px", 
                                        borderRadius: "5px",
                                        marginRight: "10px",
                                        background: "#f8f9fa",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center"
                                      }}>
                                        <i className="fas fa-image text-secondary"></i>
                                      </div>
                                    )}
                                    <span className="fw-bold" style={{ fontSize: "14px" }}>
                                      {(product.productName || product.product_name || "").length > 30 
                                        ? (product.productName || product.product_name || "").substring(0, 30) + "..." 
                                        : (product.productName || product.product_name || "")}
                                    </span>
                                  </div>
                                </td>
                                <td className="fw-bold text-danger">{formatPrice(product.price, product.currency)}</td>
                                <td>
                                  <span className={`badge bg-${getStockBadgeColor(product.stockStatus || product.stock_status)}`}>
                                    {product.stockStatus || product.stock_status || "Unknown"}
                                  </span>
                                </td>
                                <td>{product.mainCategory || product.main_category || "General"}</td>
                                <td>
                                  {new Date(product.registrationDate || product.created_at || Date.now()).toLocaleDateString()}
                                </td>
                                <td onClick={(e) => e.stopPropagation()}>
                                  <button 
                                    className="btn btn-sm btn-outline-primary me-1"
                                    onClick={() => handleEditProduct(product)}
                                    title="Edit"
                                  >
                                    <i className="fas fa-edit"></i>
                                  </button>
                                  <button 
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => handleDeleteProduct(product.id)}
                                    title="Delete"
                                  >
                                    <i className="fas fa-trash"></i>
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="col-12">
                <div className="card shadow-sm border-0">
                  <div className="card-body">
                    <h5 className="card-title mb-4">
                      <i className="fas fa-bolt me-2 text-danger"></i>
                      Quick Actions
                    </h5>
                    <div className="row g-3">
                      <div className="col-md-4">
                        <button 
                          className="btn btn-danger w-100 d-flex align-items-center justify-content-center py-3"
                          onClick={handleAddProduct}
                        >
                          <i className="fas fa-plus fa-2x me-3"></i>
                          <div className="text-start">
                            <div className="fw-bold">Add Product</div>
                            <small className="d-block">List new item for sale</small>
                          </div>
                        </button>
                      </div>
                      <div className="col-md-4">
                        <button 
                          className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center py-3"
                          onClick={() => navigate("/")}
                        >
                          <i className="fas fa-store fa-2x me-3"></i>
                          <div className="text-start">
                            <div className="fw-bold">Browse Market</div>
                            <small className="d-block">See what's trending</small>
                          </div>
                        </button>
                      </div>
                      <div className="col-md-4">
                        <button 
                          className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center py-3"
                          onClick={handleLogout}
                        >
                          <i className="fas fa-sign-out-alt fa-2x me-3"></i>
                          <div className="text-start">
                            <div className="fw-bold">Logout</div>
                            <small className="d-block">Exit seller account</small>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      {isTouchDevice && (
        <div className="fixed-bottom bg-white shadow-lg border-top" style={{ 
          height: "60px",
          zIndex: 999,
          padding: "8px 0"
        }}>
          <div className="container">
            <div className="row">
              {/* Home */}
              <div className="col text-center">
                <button 
                  className="btn btn-link text-decoration-none"
                  onClick={handleHomeClick}
                  style={{ 
                    padding: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center"
                  }}
                >
                  <i className="fas fa-home" style={{ fontSize: "18px", color: "#666" }}></i>
                  <small style={{ fontSize: "10px", color: "#666" }}>Home</small>
                </button>
              </div>
              
              {/* Products */}
              <div className="col text-center">
                <button 
                  className="btn btn-link text-decoration-none"
                  onClick={handleProductsClick}
                  style={{ 
                    padding: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center"
                  }}
                >
                  <i 
                    className="fas fa-box" 
                    style={{ 
                      fontSize: "18px", 
                      color: activeTab === "products" ? "#dc3545" : "#666"
                    }}
                  ></i>
                  <small style={{ 
                    fontSize: "10px", 
                    color: activeTab === "products" ? "#dc3545" : "#666"
                  }}>
                    Products
                  </small>
                </button>
              </div>
              
              {/* Add New */}
              <div className="col text-center">
                <button 
                  className="btn btn-link text-decoration-none"
                  onClick={handleAddNewClick}
                  style={{ 
                    padding: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center"
                  }}
                >
                  <div className="rounded-circle bg-danger text-white d-flex align-items-center justify-content-center mx-auto mb-1" 
                       style={{ 
                         width: "36px", 
                         height: "36px", 
                         marginTop: "-10px"
                       }}>
                    <i className="fas fa-plus" style={{ fontSize: "18px" }}></i>
                  </div>
                  <small style={{ 
                    fontSize: "10px", 
                    color: "#FF6B6B",
                    fontWeight: "bold",
                    marginTop: "-5px"
                  }}>
                    Add New
                  </small>
                </button>
              </div>
              
              {/* Shop */}
              <div className="col text-center">
                <button 
                  className="btn btn-link text-decoration-none"
                  onClick={handleShopsClick}
                  style={{ 
                    padding: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center"
                  }}
                >
                  <i className="fas fa-store" style={{ fontSize: "18px", color: "#666" }}></i>
                  <small style={{ fontSize: "10px", color: "#666" }}>Shop</small>
                </button>
              </div>
              
              {/* Account */}
              <div className="col text-center">
                <button 
                  className="btn btn-link text-decoration-none"
                  onClick={handleAccountClick}
                  style={{ 
                    padding: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center"
                  }}
                >
                  <div className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-1 overflow-hidden" 
                       style={{ 
                         width: "24px", 
                         height: "24px",
                         border: activeTab === "profile" ? "2px solid #dc3545" : "2px solid #ddd"
                       }}>
                    {profilePicture && !profilePictureError ? (
                      <img 
                        src={getProfilePictureUrl(40)} 
                        alt="Profile" 
                        style={{ 
                          width: "100%", 
                          height: "100%", 
                          objectFit: "cover"
                        }}
                        onError={handleProfilePictureError}
                        referrerPolicy="no-referrer"
                        crossOrigin="anonymous"
                      />
                    ) : (
                      <div style={{
                        width: "100%",
                        height: "100%",
                        backgroundColor: "#dc3545",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12px",
                        fontWeight: "bold"
                      }}>
                        {getUserInitial()}
                      </div>
                    )}
                  </div>
                  <small style={{ 
                    fontSize: "10px", 
                    color: activeTab === "profile" ? "#dc3545" : "#666"
                  }}>
                    Account
                  </small>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Font Awesome */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
      
      <style>
        {`
          .fixed-top {
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          
          .active-tab {
            background-color: rgba(255, 255, 255, 0.1) !important;
          }
          
          .card {
            transition: transform 0.3s ease;
          }
          
          .card:hover {
            transform: translateY(-3px);
          }
          
          .btn-danger {
            background: linear-gradient(135deg, #dc3545, #e57373);
            border: none;
          }
          
          .btn-danger:hover {
            background: linear-gradient(135deg, #e57373, #dc3545);
            transform: translateY(-2px);
          }
          
          .table-hover tbody tr:hover {
            background-color: rgba(220, 53, 69, 0.05);
            cursor: pointer;
          }
          
          .badge {
            font-size: 12px;
            padding: 5px 10px;
          }
          
          .alert {
            border-radius: 10px;
            border: none;
          }
          
          .alert-success {
            background-color: rgba(78, 205, 196, 0.1);
            color: #4ECDC4;
            border-left: 4px solid #4ECDC4;
          }
          
          .alert-danger {
            background-color: rgba(220, 53, 69, 0.1);
            color: #dc3545;
            border-left: 4px solid #dc3545;
          }
          
          .alert-info {
            background-color: rgba(23, 162, 184, 0.1);
            color: #17a2b8;
            border-left: 4px solid #17a2b8;
          }
          
          .text-danger {
            color: #dc3545 !important;
          }
          
          .tab-content {
            animation: fadeIn 0.5s ease;
          }
          
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          .product-list-item:hover {
            transform: translateY(-3px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
          }
          
          .product-list-item:hover img {
            transform: scale(1.05);
          }
          
          .quick-action-btn {
            transition: all 0.3s ease;
          }
          
          .quick-action-btn:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.1);
          }
          
          @media (max-width: 768px) {
            .container {
              padding-left: 15px;
              padding-right: 15px;
            }
            
            .h3, .h5 {
              font-size: 1.2rem !important;
            }
            
            .btn {
              padding: 8px 16px;
              font-size: 14px;
            }
            
            .table {
              font-size: 12px;
            }
            
            .product-list-item .col-4 {
              width: 100px !important;
            }
            
            .product-list-item .col-8 {
              flex: 1 !important;
            }
            
            .card-body img.rounded-circle {
              width: 120px !important;
              height: 120px !important;
            }
            
            .quick-action-btn .fa-2x {
              font-size: 1.5rem !important;
            }
          }
          
          .action-buttons {
            display: flex;
            gap: 5px;
          }
          
          .action-buttons .btn-sm {
            padding: 0.25rem 0.5rem;
            font-size: 0.75rem;
          }
          
          .rounded-circle {
            border-radius: 50% !important;
          }
          
          .fixed-bottom .btn-link {
            cursor: pointer !important;
          }
          
          .fixed-bottom .btn-link:hover {
            opacity: 0.8;
          }
        `}
      </style>
    </div>
  );
}

export default SellerProfile;