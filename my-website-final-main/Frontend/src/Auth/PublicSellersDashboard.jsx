
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate } from "react-router-dom";

function PublicSellersDashboard() {
  const [sellers, setSellers] = useState([
    {
      id: 1,
      productName: "Samsung TV 55 inch",
      shopName: "Electronics Shop 6",
      brand: "Samsung",
      mainCategory: "Electronics",
      productCategory: "TV & Home Theater",
      area: "Mbezi",
      district: "Kinondoni",
      region: "Dar es Salaam",
      price: "850000",
      stockStatus: "Available",
      condition: "New",
      sellerName: "John Doe",
      phoneNumber: "+255784123456",
      productImages: ["https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
      specifications: "4K UHD, Smart TV, HDR"
    },
    {
      id: 2,
      productName: "Gucci Handbag",
      shopName: "Fashion Store",
      brand: "Gucci",
      mainCategory: "Fashion",
      productCategory: "Bags & Accessories",
      area: "Mikocheni",
      district: "Kinondoni",
      region: "Dar es Salaam",
      price: "1200000",
      stockStatus: "Available",
      condition: "New",
      sellerName: "Jane Smith",
      phoneNumber: "+255765432198",
      productImages: ["https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
      specifications: "Genuine Leather, Original"
    },
    {
      id: 3,
      productName: "Refrigerator Double Door",
      shopName: "Home Appliances",
      brand: "LG",
      mainCategory: "Home Appliances",
      productCategory: "Refrigerators",
      area: "Kariakoo",
      district: "Ilala",
      region: "Dar es Salaam",
      price: "1500000",
      stockStatus: "Available",
      condition: "New",
      sellerName: "Robert Kim",
      phoneNumber: "+255713456789",
      productImages: ["https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
      specifications: "520L, Inverter, Energy Saving"
    },
    {
      id: 4,
      productName: "iPhone 14 Pro Max",
      shopName: "Mobile Zone",
      brand: "Apple",
      mainCategory: "Electronics",
      productCategory: "Mobile Phones",
      area: "Masaki",
      district: "Kinondoni",
      region: "Dar es Salaam",
      price: "3500000",
      stockStatus: "Available",
      condition: "New",
      sellerName: "Ali Hassan",
      phoneNumber: "+255787654321",
      productImages: ["https://images.unsplash.com/photo-1675864183878-5962d8f8c5e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
      specifications: "256GB, Deep Purple, Face ID"
    },
    {
      id: 5,
      productName: "Office Chair",
      shopName: "Furniture World",
      brand: "IKEA",
      mainCategory: "Furniture",
      productCategory: "Office Furniture",
      area: "Tabata",
      district: "Ilala",
      region: "Dar es Salaam",
      price: "280000",
      stockStatus: "Available",
      condition: "New",
      sellerName: "David Wilson",
      phoneNumber: "+255754987654",
      productImages: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
      specifications: "Ergonomic, Adjustable Height"
    },
    {
      id: 6,
      productName: "Kitchen Blender",
      shopName: "Home Essentials",
      brand: "Philips",
      mainCategory: "Home Appliances",
      productCategory: "Kitchen Appliances",
      area: "Sinza",
      district: "Kinondoni",
      region: "Dar es Salaam",
      price: "95000",
      stockStatus: "Available",
      condition: "New",
      sellerName: "Mary Johnson",
      phoneNumber: "+255712345678",
      productImages: ["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
      specifications: "1500W, 2L Capacity"
    },
    {
      id: 7,
      productName: "Running Shoes",
      shopName: "Sports Gear",
      brand: "Nike",
      mainCategory: "Sports",
      productCategory: "Footwear",
      area: "Mwananyamala",
      district: "Kinondoni",
      region: "Dar es Salaam",
      price: "185000",
      stockStatus: "Available",
      condition: "New",
      sellerName: "Peter Anderson",
      phoneNumber: "+255789123456",
      productImages: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
      specifications: "Size 42, Air Cushion"
    },
    {
      id: 8,
      productName: "Wrist Watch",
      shopName: "Time Masters",
      brand: "Rolex",
      mainCategory: "Fashion",
      productCategory: "Watches",
      area: "Oysterbay",
      district: "Kinondoni",
      region: "Dar es Salaam",
      price: "8500000",
      stockStatus: "Available",
      condition: "Used - Like New",
      sellerName: "Michael Brown",
      phoneNumber: "+255755432198",
      productImages: ["https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
      specifications: "Automatic, Stainless Steel"
    },
    {
      id: 9,
      productName: "Laptop Dell XPS 15",
      shopName: "Tech Solutions",
      brand: "Dell",
      mainCategory: "Electronics",
      productCategory: "Laptops",
      area: "Ubungo",
      district: "Kinondoni",
      region: "Dar es Salaam",
      price: "4200000",
      stockStatus: "Available",
      condition: "Refurbished",
      sellerName: "Sarah Williams",
      phoneNumber: "+255764987321",
      productImages: ["https://images.unsplash.com/photo-1593640408182-31c70c8268f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
      specifications: "16GB RAM, 1TB SSD, i7"
    },
    {
      id: 10,
      productName: "Gas Cooker",
      shopName: "Home Appliances",
      brand: "Samsung",
      mainCategory: "Home Appliances",
      productCategory: "Kitchen Appliances",
      area: "Buguruni",
      district: "Ilala",
      region: "Dar es Salaam",
      price: "320000",
      stockStatus: "Available",
      condition: "New",
      sellerName: "James Miller",
      phoneNumber: "+255718765432",
      productImages: ["https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
      specifications: "4 Burners, Auto Ignition"
    },
    {
      id: 11,
      productName: "Wireless Headphones",
      shopName: "Audio Shop",
      brand: "Sony",
      mainCategory: "Electronics",
      productCategory: "Audio",
      area: "Mlimani City",
      district: "Kinondoni",
      region: "Dar es Salaam",
      price: "250000",
      stockStatus: "Available",
      condition: "New",
      sellerName: "Emma Wilson",
      phoneNumber: "+255755123456",
      productImages: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
      specifications: "Noise Cancelling, 30hr battery"
    },
    {
      id: 12,
      productName: "Digital Camera",
      shopName: "Camera World",
      brand: "Canon",
      mainCategory: "Electronics",
      productCategory: "Cameras",
      area: "Posta",
      district: "Ilala",
      region: "Dar es Salaam",
      price: "1800000",
      stockStatus: "Available",
      condition: "New",
      sellerName: "Thomas Brown",
      phoneNumber: "+255712987654",
      productImages: ["https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
      specifications: "24MP, 4K Video"
    }
  ]);
  
  const [filteredSellers, setFilteredSellers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    brand: "",
    region: "",
    district: "",
    priceRange: "all",
    stockStatus: "all",
    condition: "all"
  });
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
  // Mobile state
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Nav bar background color state
  const [navBarColor, setNavBarColor] = useState("#ffffff");
  const [navTextColor, setNavTextColor] = useState("#000000");

  // Matangazo Carousel
  const adSlides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      title: "Black Friday Sale",
      description: "Up to 50% off on electronics",
      link: "#",
      backgroundColor: "#FF6B6B",
      textColor: "#ffffff",
      navColor: "#FF6B6B"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      title: "New Arrivals",
      description: "Fresh stock just landed",
      link: "#",
      backgroundColor: "#4ECDC4",
      textColor: "#ffffff",
      navColor: "#4ECDC4"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      title: "Free Shipping",
      description: "On orders above 200,000 TZS",
      link: "#",
      backgroundColor: "#45B7D1",
      textColor: "#ffffff",
      navColor: "#45B7D1"
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      title: "Weekend Special",
      description: "Best deals on home appliances",
      link: "#",
      backgroundColor: "#96CEB4",
      textColor: "#000000",
      navColor: "#96CEB4"
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1591348278863-a8fb3887e2ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      title: "Fashion Collection",
      description: "Latest trends 2024",
      link: "#",
      backgroundColor: "#FFEAA7",
      textColor: "#000000",
      navColor: "#FFEAA7"
    },
    {
      id: 6,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      title: "Tech Gadgets",
      description: "Smart devices at amazing prices",
      link: "#",
      backgroundColor: "#DDA0DD",
      textColor: "#000000",
      navColor: "#DDA0DD"
    }
  ];
  
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  useEffect(() => {
    // Start auto-rotation for ad carousel
    const interval = setInterval(() => {
      setCurrentAdIndex((prevIndex) => (prevIndex + 1) % adSlides.length);
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, [adSlides.length]);

  // Update nav bar color when ad changes
  useEffect(() => {
    const currentAd = adSlides[currentAdIndex];
    if (currentAd) {
      setNavBarColor(currentAd.navColor);
      // Determine text color based on background brightness
      const brightness = getColorBrightness(currentAd.navColor);
      setNavTextColor(brightness > 128 ? "#000000" : "#ffffff");
    }
  }, [currentAdIndex, adSlides]);

  // Helper function to calculate color brightness
  const getColorBrightness = (hexColor) => {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return (r * 299 + g * 587 + b * 114) / 1000;
  };

  // Handle manual navigation
  const goToSlide = (index) => {
    setCurrentAdIndex(index);
  };

  const nextSlide = () => {
    setCurrentAdIndex((prevIndex) => (prevIndex + 1) % adSlides.length);
  };

  const prevSlide = () => {
    setCurrentAdIndex((prevIndex) => 
      prevIndex === 0 ? adSlides.length - 1 : prevIndex - 1
    );
  };

  const navigate = useNavigate();

  // Check if device is touch (smartphone)
  useEffect(() => {
    const checkTouchDevice = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    checkTouchDevice();
    window.addEventListener('resize', checkTouchDevice);
    return () => window.removeEventListener('resize', checkTouchDevice);
  }, []);

  // Extract unique values for filters
  const categories = [...new Set(sellers.map(s => s.mainCategory).filter(Boolean))];
  const brands = [...new Set(sellers.map(s => s.brand).filter(Boolean))];
  const regions = [...new Set(sellers.map(s => s.region).filter(Boolean))];
  const districts = [...new Set(sellers.map(s => s.district).filter(Boolean))];

  useEffect(() => {
    loadSellers();
    checkLoginStatus();
  }, []);

  useEffect(() => {
    filterAndSortSellers();
  }, [sellers, filters, searchTerm, sortBy]);

  const checkLoginStatus = () => {
    const isSellerAuthenticated = localStorage.getItem('isSellerAuthenticated') === 'true';
    const sellerData = JSON.parse(localStorage.getItem('currentSeller') || 'null');
    
    setIsLoggedIn(isSellerAuthenticated);
    setCurrentUser(sellerData);
  };

  const loadSellers = () => {
    setIsLoading(false);
    setFilteredSellers(sellers);
  };

  const filterAndSortSellers = () => {
    let result = [...sellers];

    // Apply search term filter
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      result = result.filter(seller =>
        seller.productName?.toLowerCase().includes(term) ||
        seller.shopName?.toLowerCase().includes(term) ||
        seller.brand?.toLowerCase().includes(term) ||
        seller.productCategory?.toLowerCase().includes(term) ||
        seller.mainCategory?.toLowerCase().includes(term) ||
        seller.area?.toLowerCase().includes(term)
      );
    }

    // Apply category filter
    if (filters.category !== "") {
      result = result.filter(seller => 
        seller.mainCategory === filters.category || 
        seller.productCategory === filters.category
      );
    }

    // Apply brand filter
    if (filters.brand !== "") {
      result = result.filter(seller => seller.brand === filters.brand);
    }

    // Apply region filter
    if (filters.region !== "") {
      result = result.filter(seller => seller.region === filters.region);
    }

    // Apply district filter
    if (filters.district !== "") {
      result = result.filter(seller => seller.district === filters.district);
    }

    // Apply price range filter
    if (filters.priceRange !== "all") {
      result = result.filter(seller => {
        const price = parseFloat(seller.price) || 0;
        switch (filters.priceRange) {
          case "under_100k": return price < 100000;
          case "100k_500k": return price >= 100000 && price < 500000;
          case "500k_1m": return price >= 500000 && price < 1000000;
          case "1m_5m": return price >= 1000000 && price < 5000000;
          case "over_5m": return price >= 5000000;
          default: return true;
        }
      });
    }

    // Apply stock status filter
    if (filters.stockStatus !== "all") {
      result = result.filter(seller => seller.stockStatus === filters.stockStatus);
    }

    // Apply condition filter
    if (filters.condition !== "all") {
      result = result.filter(seller => seller.condition === filters.condition);
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "price_low":
          return (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0);
        case "price_high":
          return (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0);
        case "name":
          return (a.productName || "").localeCompare(b.productName || "");
        case "newest":
        default:
          return 0;
      }
    });

    setFilteredSellers(result);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilters({
      category: "",
      brand: "",
      region: "",
      district: "",
      priceRange: "all",
      stockStatus: "all",
      condition: "all"
    });
    if (isTouchDevice) {
      setShowMobileFilters(false);
    }
  };

  const handleCall = (phoneNumber) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  const handleWhatsApp = (phoneNumber, productName) => {
    const message = `Hello! I'm interested in ${productName}. Is it still available?`;
    const url = `https://wa.me/${phoneNumber.replace('+', '')}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const formatPrice = (price) => {
    if (!price) return "Price not set";
    const numPrice = parseFloat(price);
    if (isNaN(numPrice)) return price;
    return new Intl.NumberFormat('en-TZ', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(numPrice) + " TZS";
  };

  const getStockBadgeColor = (status) => {
    switch (status) {
      case "Available": return "success";
      case "Limited": return "warning";
      case "Out of Stock": return "danger";
      default: return "secondary";
    }
  };

  const getConditionBadgeColor = (condition) => {
    switch (condition) {
      case "New": return "success";
      case "Refurbished": return "info";
      case "Used - Like New": return "primary";
      case "Used - Good": return "warning";
      case "Used - Fair": return "dark";
      default: return "secondary";
    }
  };

  const renderStockBadge = (status) => {
    if (!status) return null;
    const color = getStockBadgeColor(status);
    return <span className={`badge bg-${color} me-1`}>{status}</span>;
  };

  const openSellerDetail = (seller) => {
    setSelectedSeller(seller);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeSellerDetail = () => {
    setSelectedSeller(null);
  };

  const handleLoginClick = () => {
    navigate("/vendor-login");
    setShowMobileMenu(false);
  };

  const handleRegisterClick = () => {
    navigate("/vendor-register");
    setShowMobileMenu(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("isSellerAuthenticated");
    localStorage.removeItem("currentSeller");
    localStorage.removeItem("sellerToken");
    localStorage.removeItem("sellerId");
    setIsLoggedIn(false);
    setCurrentUser(null);
    window.location.reload();
  };

  const handleMyProductsClick = () => {
    if (isLoggedIn && currentUser) {
      navigate("/seller-profile");
      setShowMobileMenu(false);
    }
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "#f8f9fa",
      paddingBottom: isTouchDevice ? "80px" : "0"
    }}>
      {/* Top Navigation Bar */}
      <nav 
        className={`navbar shadow-sm fixed-top py-2 ${navTextColor === '#ffffff' ? 'navbar-dark' : 'navbar-light'}`}
        style={{ 
          zIndex: 1000,
          backgroundColor: navBarColor,
          transition: 'background-color 0.8s ease-in-out, color 0.8s ease-in-out'
        }}
      >
        <div className="container-fluid px-2">
          {/* Logo */}
          <Link 
            className="navbar-brand fw-bold" 
            to="/" 
            style={{ 
              fontSize: "18px",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              transition: "color 0.3s ease"
            }}
          >
            <i className="fas fa-shopping-cart me-2" style={{ color: "#ffffff", transition: "color 0.3s ease", fontSize: "20px" }}></i>
            Availo
          </Link>
          
          {/* Desktop View - User Button */}
          <div className="d-none d-lg-flex align-items-center">
            <div className="input-group me-3" style={{ width: "300px" }}>
              <input
                type="text"
                className="form-control"
                placeholder="Search products, shops, brands..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  backgroundColor: navTextColor === '#ffffff' ? 'rgba(255, 255, 255, 0.2)' : '#ffffff',
                  color: navTextColor === '#ffffff' ? '#ffffff' : '#000000',
                  borderColor: navTextColor === '#ffffff' ? 'rgba(255, 255, 255, 0.3)' : '#cccccc'
                }}
              />
              <button 
                className="btn btn-outline-secondary" 
                type="button"
                style={{
                  backgroundColor: 'transparent',
                  color: navTextColor === '#ffffff' ? '#ffffff' : '#000000',
                  borderColor: navTextColor === '#ffffff' ? 'rgba(255, 255, 255, 0.3)' : '#cccccc'
                }}
              >
                <i className="fas fa-search" style={{ color: navTextColor === '#ffffff' ? '#ffffff' : '#000000' }}></i>
              </button>
            </div>
            
            <div className="btn-group me-3">
              <button 
                className={`btn ${viewMode === "grid" ? "" : "btn-outline-secondary"}`}
                onClick={() => setViewMode("grid")}
                style={{
                  backgroundColor: viewMode === "grid" ? navTextColor : 'transparent',
                  color: viewMode === "grid" ? navBarColor : navTextColor,
                  borderColor: navTextColor
                }}
              >
                <i className="fas fa-th-large"></i>
              </button>
              <button 
                className={`btn ${viewMode === "list" ? "" : "btn-outline-secondary"}`}
                onClick={() => setViewMode("list")}
                style={{
                  backgroundColor: viewMode === "list" ? navTextColor : 'transparent',
                  color: viewMode === "list" ? navBarColor : navTextColor,
                  borderColor: navTextColor
                }}
              >
                <i className="fas fa-list"></i>
              </button>
            </div>
            
            {/* User Button for Desktop */}
            {isLoggedIn ? (
              <div className="dropdown">
                <button 
                  className="btn d-flex align-items-center"
                  type="button" 
                  data-bs-toggle="dropdown"
                  style={{ 
                    borderRadius: "20px",
                    padding: "6px 15px",
                    fontSize: "14px",
                    backgroundColor: 'transparent',
                    color: navTextColor,
                    borderColor: navTextColor
                  }}
                >
                  <div 
                    className="rounded-circle d-flex align-items-center justify-content-center me-2" 
                    style={{ 
                      width: "30px", 
                      height: "30px",
                      backgroundColor: navTextColor,
                      color: navBarColor
                    }}
                  >
                    <i className="fas fa-user"></i>
                  </div>
                  <span style={{ fontSize: "14px" }}>Account</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li><span className="dropdown-item-text fw-bold">Hello, {currentUser?.sellerName || "Seller"}</span></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item" onClick={handleMyProductsClick}>
                      <i className="fas fa-box me-2"></i>
                      My Products
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={() => navigate('/vendor-register')}>
                      <i className="fas fa-plus-circle me-2"></i>
                      Add New Product
                    </button>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item text-danger" onClick={handleLogout}>
                      <i className="fas fa-sign-out-alt me-2"></i>
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <button 
                className="btn d-flex align-items-center"
                onClick={handleLoginClick}
                style={{ 
                  borderRadius: "20px",
                  padding: "6px 15px",
                  fontSize: "14px",
                  transition: "all 0.3s ease",
                  backgroundColor: 'transparent',
                  color: navTextColor,
                  borderColor: navTextColor
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "linear-gradient(135deg, #FF6B6B, #FF8E53)";
                  e.currentTarget.style.color = "white";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = navTextColor;
                  e.currentTarget.style.transform = "";
                }}
              >
                <div 
                  className="rounded-circle d-flex align-items-center justify-content-center me-2" 
                  style={{ 
                    width: "30px", 
                    height: "30px",
                    backgroundColor: navTextColor,
                    color: navBarColor
                  }}
                >
                  <i className="fas fa-user"></i>
                </div>
                <div className="d-flex flex-column align-items-start">
                  <span style={{ fontSize: "12px", fontWeight: "bold" }}>Sign in ›</span>
                  <span style={{ fontSize: "11px", opacity: 0.8 }}>Sell your products</span>
                </div>
              </button>
            )}
          </div>
          
          {/* Mobile View - Search & Menu */}
          <div className="d-flex d-lg-none align-items-center gap-3">
            <button 
              className="btn"
              onClick={() => setShowMobileFilters(true)}
              style={{ 
                width: "40px", 
                height: "40px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: 'transparent',
                color: "#ffffff",
                padding: 0,
                border: "none",
                transition: "color 0.3s ease"
              }}
              title="Filter"
            >
              <i className="fas fa-filter" style={{ fontSize: "18px", color: "#ffffff" }}></i>
            </button>
            
            <button 
              className="btn"
              onClick={() => setShowMobileMenu(true)}
              style={{ 
                width: "40px", 
                height: "40px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: 'transparent',
                color: "#ffffff",
                padding: 0,
                border: "none",
                transition: "color 0.3s ease"
              }}
              title="Menu"
            >
              <i className="fas fa-bars" style={{ fontSize: "18px", color: "#ffffff" }}></i>
            </button>
          </div>
        </div>
        
        {/* Mobile Search Bar (Below Nav) */}
        <div className="container-fluid px-2 d-lg-none py-2">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search products, shops, brands..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ 
                fontSize: "14px",
                height: "40px",
                borderRadius: "6px",
                backgroundColor: navTextColor === '#ffffff' ? 'rgba(255, 255, 255, 0.2)' : '#ffffff',
                color: navTextColor === '#ffffff' ? '#ffffff' : '#000000',
                borderColor: navTextColor === '#ffffff' ? 'rgba(255, 255, 255, 0.3)' : '#cccccc'
              }}
            />
            <button 
              className="btn btn-outline-secondary" 
              type="button"
              style={{
                backgroundColor: 'transparent',
                color: navTextColor === '#ffffff' ? '#ffffff' : '#000000',
                borderColor: navTextColor === '#ffffff' ? 'rgba(255, 255, 255, 0.3)' : '#cccccc'
              }}
              title="Search"
            >
              <i className="fas fa-search" style={{ color: navTextColor === '#ffffff' ? '#ffffff' : '#000000' }}></i>
            </button>
          </div>
        </div>
      </nav>

      {/* Ad Carousel Section - DIRECTLY BELOW NAV BAR */}
      <div 
        className="container-fluid px-0" 
        style={{ 
          marginTop: "60px",
          paddingTop: "0px"
        }}
      >
        <div className="row mx-0">
          <div className="col-12 px-0">
            <div className="ad-carousel-container" style={{ position: "relative" }}>
              {/* Carousel */}
              <div 
                className="ad-carousel-inner"
                style={{
                  height: isTouchDevice ? "150px" : "200px",
                  position: "relative",
                  overflow: "hidden"
                }}
              >
                {adSlides.map((slide, index) => (
                  <div
                    key={slide.id}
                    className={`ad-slide ${index === currentAdIndex ? 'active' : ''}`}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      opacity: index === currentAdIndex ? 1 : 0,
                      transition: 'opacity 0.8s ease-in-out',
                      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${slide.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      textAlign: 'center',
                      color: 'white',
                      padding: '15px',
                      cursor: 'pointer'
                    }}
                    onClick={() => window.open(slide.link, '_blank')}
                  >
                    <div className="ad-content" style={{ maxWidth: '600px' }}>
                      <h2 
                        className="fw-bold mb-2"
                        style={{ 
                          fontSize: isTouchDevice ? '20px' : '28px',
                          textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                        }}
                      >
                        {slide.title}
                      </h2>
                      <p 
                        className="mb-3"
                        style={{ 
                          fontSize: isTouchDevice ? '14px' : '16px',
                          textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                        }}
                      >
                        {slide.description}
                      </p>
                      <button 
                        className="btn btn-light fw-bold"
                        style={{
                          padding: isTouchDevice ? '6px 15px' : '8px 20px',
                          borderRadius: '20px',
                          fontSize: isTouchDevice ? '12px' : '14px',
                          boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(slide.link, '_blank');
                        }}
                      >
                        Shop Now <i className="fas fa-arrow-right ms-1"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation Buttons (Desktop Only) */}
              {!isTouchDevice && (
                <>
                  <button
                    className="btn btn-light position-absolute top-50 start-0 translate-middle-y"
                    onClick={prevSlide}
                    style={{
                      marginLeft: '10px',
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                      zIndex: 10
                    }}
                  >
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  <button
                    className="btn btn-light position-absolute top-50 end-0 translate-middle-y"
                    onClick={nextSlide}
                    style={{
                      marginRight: '10px',
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                      zIndex: 10
                    }}
                  >
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </>
              )}

              {/* Dots Indicator */}
              <div className="position-absolute bottom-0 start-50 translate-middle-x mb-2 d-flex">
                {adSlides.map((_, index) => (
                  <button
                    key={index}
                    className={`btn p-0 mx-1 ${index === currentAdIndex ? 'active' : ''}`}
                    onClick={() => goToSlide(index)}
                    style={{
                      width: index === currentAdIndex ? '20px' : '10px',
                      height: '10px',
                      borderRadius: '5px',
                      backgroundColor: index === currentAdIndex ? 'white' : 'rgba(255,255,255,0.5)',
                      border: 'none',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-fluid mb-5 px-2 px-lg-3" style={{ 
        paddingTop: isTouchDevice ? "10px" : "20px",
        paddingBottom: isTouchDevice ? "100px" : "20px"
      }}>
        <div className="row">
          {/* Desktop Filters Sidebar */}
          <div className="col-lg-3 col-xl-2 d-none d-lg-block">
            <div className="card shadow-sm mb-3 sticky-top" style={{ top: "20px" }}>
              <div className="card-header bg-white">
                <h6 className="mb-0">
                  <i className="fas fa-filter me-2"></i>
                  Filters
                  {Object.values(filters).some(f => f !== "" && f !== "all") && (
                    <button 
                      className="btn btn-sm btn-outline-danger float-end"
                      onClick={clearFilters}
                    >
                      Clear All
                    </button>
                  )}
                </h6>
              </div>
              <div className="card-body" style={{ maxHeight: "calc(100vh - 150px)", overflowY: "auto" }}>
                
                <div className="mb-3">
                  <label className="form-label fw-bold">Category</label>
                  <select 
                    className="form-select form-select-sm"
                    value={filters.category}
                    onChange={(e) => handleFilterChange("category", e.target.value)}
                  >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Price Range</label>
                  <select 
                    className="form-select form-select-sm"
                    value={filters.priceRange}
                    onChange={(e) => handleFilterChange("priceRange", e.target.value)}
                  >
                    <option value="all">All Prices</option>
                    <option value="under_100k">Under 100,000 TZS</option>
                    <option value="100k_500k">100,000 - 500,000 TZS</option>
                    <option value="500k_1m">500,000 - 1,000,000 TZS</option>
                    <option value="1m_5m">1M - 5M TZS</option>
                    <option value="over_5m">Over 5M TZS</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Stock Status</label>
                  <select 
                    className="form-select form-select-sm"
                    value={filters.stockStatus}
                    onChange={(e) => handleFilterChange("stockStatus", e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="Available">Available</option>
                    <option value="Limited">Limited</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Sort By</label>
                  <select 
                    className="form-select form-select-sm"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="newest">Newest First</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                    <option value="name">Product Name A-Z</option>
                  </select>
                </div>

                {/* Sell Product Card */}
                <div className="card border-danger mb-3">
                  <div className="card-body text-center">
                    <i className="fas fa-store fa-2x text-danger mb-3"></i>
                    <h6 className="card-title">Want to Sell?</h6>
                    <p className="card-text small text-muted mb-3">
                      List your products for free and reach thousands of buyers
                    </p>
                    {isLoggedIn ? (
                      <button 
                        className="btn btn-sm btn-danger w-100"
                        onClick={() => navigate('/vendor-register')}
                      >
                        <i className="fas fa-plus me-1"></i>
                        Add New Product
                      </button>
                    ) : (
                      <button 
                        className="btn btn-sm btn-danger w-100"
                        onClick={handleRegisterClick}
                      >
                        <i className="fas fa-user-plus me-1"></i>
                        Sign up to Sell
                      </button>
                    )}
                  </div>
                </div>

                <div className="alert alert-light border">
                  <small>
                    <i className="fas fa-info-circle me-1"></i>
                    Showing {filteredSellers.length} of {sellers.length} products
                  </small>
                </div>
              </div>
            </div>
          </div>

          {/* Products Display Area */}
          <div className="col-lg-9 col-xl-10 px-0 px-md-3" style={{ marginTop: isTouchDevice ? "10px" : "20px" }}>
            {/* Mobile Controls Bar */}
            <div className="d-lg-none mb-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h5 className="mb-0" style={{ fontSize: "16px" }}>
                    Products ({filteredSellers.length})
                  </h5>
                  <small className="text-muted">Tap to view details</small>
                </div>
                <div className="d-flex gap-2">
                  <button 
                    className={`btn btn-sm ${viewMode === "grid" ? "btn-danger" : "btn-outline-danger"}`}
                    onClick={() => setViewMode("grid")}
                    style={{ 
                      width: "40px", 
                      height: "40px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <i className="fas fa-th-large"></i>
                  </button>
                  <button 
                    className={`btn btn-sm ${viewMode === "list" ? "btn-danger" : "btn-outline-danger"}`}
                    onClick={() => setViewMode("list")}
                    style={{ 
                      width: "40px", 
                      height: "40px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <i className="fas fa-list"></i>
                  </button>
                </div>
              </div>
            </div>

            {/* Sign in Banner for Mobile */}
            {!isLoggedIn && isTouchDevice && (
              <div className="card bg-danger text-white mb-3 mx-2" style={{ borderRadius: "15px" }}>
                <div className="card-body p-3">
                  <div className="d-flex align-items-center">
                    <div className="rounded-circle bg-white text-danger d-flex align-items-center justify-content-center me-3" 
                         style={{ width: "40px", height: "40px", flexShrink: 0 }}>
                      <i className="fas fa-store"></i>
                    </div>
                    <div>
                      <h6 className="mb-1" style={{ fontSize: "14px" }}>Sell Your Products</h6>
                      <p className="mb-0 opacity-75" style={{ fontSize: "12px" }}>Reach thousands of buyers</p>
                    </div>
                    <button 
                      className="btn btn-light btn-sm ms-auto"
                      onClick={handleRegisterClick}
                      style={{ 
                        fontSize: "12px",
                        padding: "5px 10px",
                        borderRadius: "20px"
                      }}
                    >
                      Sign up
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Menu Overlay */}
            {showMobileMenu && (
              <>
                <div 
                  className="mobile-backdrop show"
                  onClick={() => setShowMobileMenu(false)}
                  style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background: "rgba(0,0,0,0.5)",
                    zIndex: 999
                  }}
                ></div>
                
                <div 
                  className="mobile-menu"
                  style={{
                    position: "fixed",
                    top: 0,
                    right: 0,
                    width: "280px",
                    height: "100%",
                    background: "white",
                    zIndex: 1000,
                    boxShadow: "-2px 0 10px rgba(0,0,0,0.1)",
                    overflowY: "auto",
                    animation: "slideInRight 0.3s ease"
                  }}
                >
                  <div className="p-3 border-bottom">
                    <div className="d-flex justify-content-between align-items-center">
                      <h6 className="mb-0 fw-bold">Menu</h6>
                      <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => setShowMobileMenu(false)}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-3">
                    {/* User Section */}
                    <div className="text-center mb-4">
                      <div className="rounded-circle bg-danger text-white d-inline-flex align-items-center justify-content-center mb-3" 
                           style={{ width: "80px", height: "80px" }}>
                        <i className="fas fa-user fa-2x"></i>
                      </div>
                      {isLoggedIn ? (
                        <>
                          <h6 className="fw-bold mb-1">{currentUser?.sellerName || "Seller"}</h6>
                          <p className="text-muted small mb-3">{currentUser?.shopName || "My Shop"}</p>
                        </>
                      ) : (
                        <>
                          <h6 className="fw-bold mb-1">Welcome to Availo</h6>
                          <p className="text-muted small mb-3">Sign in to sell your products</p>
                        </>
                      )}
                    </div>
                    
                    {/* Menu Items */}
                    <div className="list-group list-group-flush">
                      {isLoggedIn ? (
                        <>
                          <button 
                            className="list-group-item list-group-item-action border-0 py-3"
                            onClick={handleMyProductsClick}
                          >
                            <i className="fas fa-box me-3 text-danger"></i>
                            My Products
                          </button>
                          <button 
                            className="list-group-item list-group-item-action border-0 py-3"
                            onClick={() => navigate('/vendor-register')}
                          >
                            <i className="fas fa-plus-circle me-3 text-danger"></i>
                            Add New Product
                          </button>
                          <button 
                            className="list-group-item list-group-item-action border-0 py-3"
                            onClick={() => navigate('/public-sellers')}
                          >
                            <i className="fas fa-store me-3 text-danger"></i>
                            Browse Marketplace
                          </button>
                          <button 
                            className="list-group-item list-group-item-action border-0 py-3 text-danger"
                            onClick={handleLogout}
                          >
                            <i className="fas fa-sign-out-alt me-3"></i>
                            Logout
                          </button>
                        </>
                      ) : (
                        <>
                          <button 
                            className="list-group-item list-group-item-action border-0 py-3"
                            onClick={handleLoginClick}
                          >
                            <i className="fas fa-sign-in-alt me-3 text-danger"></i>
                            Sign in
                          </button>
                          <button 
                            className="list-group-item list-group-item-action border-0 py-3"
                            onClick={handleRegisterClick}
                          >
                            <i className="fas fa-user-plus me-3 text-danger"></i>
                            Register
                          </button>
                          <button 
                            className="list-group-item list-group-item-action border-0 py-3"
                            onClick={() => navigate('/public-sellers')}
                          >
                            <i className="fas fa-store me-3 text-danger"></i>
                            Browse Products
                          </button>
                        </>
                      )}
                    </div>
                    
                    <div className="mt-4 pt-3 border-top">
                      <small className="text-muted d-block mb-2">Need help?</small>
                      <button className="btn btn-outline-secondary btn-sm w-100">
                        <i className="fas fa-question-circle me-2"></i>
                        Help Center
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Mobile Filters Overlay */}
            {showMobileFilters && (
              <>
                <div 
                  className="mobile-backdrop show"
                  onClick={() => setShowMobileFilters(false)}
                  style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background: "rgba(0,0,0,0.5)",
                    zIndex: 999
                  }}
                ></div>
                
                <div 
                  className="mobile-menu"
                  style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "280px",
                    height: "100%",
                    background: "white",
                    zIndex: 1000,
                    boxShadow: "2px 0 10px rgba(0,0,0,0.1)",
                    overflowY: "auto",
                    animation: "slideInLeft 0.3s ease"
                  }}
                >
                  <div className="p-3 border-bottom bg-light">
                    <div className="d-flex justify-content-between align-items-center">
                      <h6 className="mb-0 fw-bold">
                        <i className="fas fa-filter me-2"></i>
                        Filters
                      </h6>
                      <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => setShowMobileFilters(false)}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-3" style={{ paddingBottom: "100px" }}>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Category</label>
                      <select 
                        className="form-select"
                        value={filters.category}
                        onChange={(e) => handleFilterChange("category", e.target.value)}
                      >
                        <option value="">All Categories</option>
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label fw-bold">Price Range</label>
                      <select 
                        className="form-select"
                        value={filters.priceRange}
                        onChange={(e) => handleFilterChange("priceRange", e.target.value)}
                      >
                        <option value="all">All Prices</option>
                        <option value="under_100k">Under 100,000 TZS</option>
                        <option value="100k_500k">100k - 500k TZS</option>
                        <option value="500k_1m">500k - 1M TZS</option>
                        <option value="1m_5m">1M - 5M TZS</option>
                        <option value="over_5m">Over 5M TZS</option>
                      </select>
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label fw-bold">Stock Status</label>
                      <select 
                        className="form-select"
                        value={filters.stockStatus}
                        onChange={(e) => handleFilterChange("stockStatus", e.target.value)}
                      >
                        <option value="all">All Status</option>
                        <option value="Available">Available</option>
                        <option value="Limited">Limited</option>
                        <option value="Out of Stock">Out of Stock</option>
                      </select>
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label fw-bold">Sort By</label>
                      <select 
                        className="form-select"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                      >
                        <option value="newest">Newest First</option>
                        <option value="price_low">Price: Low to High</option>
                        <option value="price_high">Price: High to Low</option>
                        <option value="name">Product Name A-Z</option>
                      </select>
                    </div>
                    
                    <div className="mt-4 pt-3 border-top">
                      <div className="d-grid gap-2">
                        <button 
                          className="btn btn-danger"
                          onClick={() => setShowMobileFilters(false)}
                        >
                          Apply Filters
                        </button>
                        <button 
                          className="btn btn-outline-danger"
                          onClick={clearFilters}
                        >
                          Clear All Filters
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Selected Product Detail View (Mobile) */}
            {selectedSeller && isTouchDevice && (
              <div className="modal-backdrop" style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "rgba(0,0,0,0.5)",
                zIndex: 1001,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px"
              }}>
                <div className="card" style={{
                  width: "100%",
                  maxWidth: "500px",
                  maxHeight: "90vh",
                  overflow: "auto",
                  borderRadius: "15px"
                }}>
                  <div className="card-header bg-white d-flex justify-content-between align-items-center sticky-top">
                    <h6 className="mb-0">Product Details</h6>
                    <button 
                      className="btn btn-sm btn-outline-danger"
                      onClick={closeSellerDetail}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                  <div className="card-body">
                    <img 
                      src={selectedSeller.productImages?.[0] || "https://images.unsplash.com/photo-1556656793-08538906a9f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
                      alt={selectedSeller.productName}
                      className="img-fluid rounded mb-3"
                      style={{ width: "100%", height: "200px", objectFit: "cover" }}
                    />
                    
                    <h5 className="mb-2">{selectedSeller.productName}</h5>
                    
                    <div className="d-flex align-items-center mb-3">
                      {renderStockBadge(selectedSeller.stockStatus)}
                      <span className={`badge bg-${getConditionBadgeColor(selectedSeller.condition)} ms-2`}>
                        {selectedSeller.condition}
                      </span>
                    </div>

                    <h4 className="text-danger mb-3">{formatPrice(selectedSeller.price)}</h4>

                    <div className="row mb-3">
                      <div className="col-6">
                        <small className="text-muted">Category</small>
                        <p className="mb-0 fw-bold">{selectedSeller.mainCategory}</p>
                      </div>
                      <div className="col-6">
                        <small className="text-muted">Brand</small>
                        <p className="mb-0 fw-bold">{selectedSeller.brand || "Not specified"}</p>
                      </div>
                    </div>

                    {selectedSeller.specifications && (
                      <div className="mb-3">
                        <small className="text-muted">Specifications</small>
                        <p className="mb-0">{selectedSeller.specifications}</p>
                      </div>
                    )}

                    <div className="card bg-light mb-3">
                      <div className="card-body p-3">
                        <h6 className="mb-3">Shop Information</h6>
                        <div className="row">
                          <div className="col-6 mb-2">
                            <small className="text-muted">Shop</small>
                            <p className="mb-0 fw-bold">{selectedSeller.shopName}</p>
                          </div>
                          <div className="col-6 mb-2">
                            <small className="text-muted">Seller</small>
                            <p className="mb-0 fw-bold">{selectedSeller.sellerName}</p>
                          </div>
                          <div className="col-12 mb-2">
                            <small className="text-muted">Location</small>
                            <p className="mb-0 small">
                              {selectedSeller.area}, {selectedSeller.district}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="d-flex gap-2">
                      <button 
                        className="btn btn-danger flex-fill"
                        onClick={() => handleCall(selectedSeller.phoneNumber)}
                      >
                        <i className="fas fa-phone me-1"></i>
                        Call
                      </button>
                      <button 
                        className="btn btn-success flex-fill"
                        onClick={() => handleWhatsApp(selectedSeller.phoneNumber, selectedSeller.productName)}
                      >
                        <i className="fab fa-whatsapp me-1"></i>
                        WhatsApp
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Products Grid/List - Optimized for Smartphone */}
            {filteredSellers.length === 0 ? (
              <div className="text-center py-5">
                <i className="fas fa-search fa-3x text-muted mb-3"></i>
                <h5 className="text-muted">No products found</h5>
                <p className="text-muted mb-4">Try adjusting your filters</p>
                <button 
                  className="btn btn-danger"
                  onClick={clearFilters}
                >
                  Clear Filters
                </button>
              </div>
            ) : viewMode === "grid" ? (
              // Grid View - Optimized for Smartphone (Mobile: 2 per row, Desktop: 3 per row)
              <div className="row g-2 mx-0">
                {filteredSellers.map((seller) => (
                  <div key={seller.id} className="col-6 col-md-4 px-1">
                    <div 
                      className="card h-100 border-0 shadow-sm"
                      style={{ 
                        borderRadius: "10px",
                        overflow: "hidden",
                        touchAction: "manipulation",
                        // ADDED: Borders for ALL devices (smartphone & desktop)
                        border: "1px solid rgba(0,0,0,0.07) !important",
                        background: "#fff",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.04)"
                      }}
                      onClick={() => isTouchDevice ? openSellerDetail(seller) : null}
                    >
                      {/* Product Image */}
                      <div style={{ 
                        height: "140px", 
                        overflow: "hidden",
                        backgroundColor: "#f8f9fa",
                        position: "relative"
                      }}>
                        <img 
                          src={seller.productImages?.[0] || "https://images.unsplash.com/photo-1556656793-08538906a9f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
                          className="w-100 h-100"
                          alt={seller.productName}
                          style={{ objectFit: "cover" }}
                        />
                        <div className="position-absolute top-0 start-0 m-2">
                          <span className={`badge bg-${getStockBadgeColor(seller.stockStatus)}`}>
                            {seller.stockStatus === "Limited" ? "Few left" : seller.stockStatus}
                          </span>
                        </div>
                      </div>

                      <div className="card-body p-2">
                        {/* Product Name */}
                        <h6 className="card-title mb-1" style={{ 
                          fontSize: "12px",
                          fontWeight: "600",
                          height: "32px",
                          overflow: "hidden",
                          display: "-webkit-box",
                          WebkitLineClamp: "2",
                          WebkitBoxOrient: "vertical"
                        }}>
                          {seller.productName}
                        </h6>
                        
                        {/* Price */}
                        <div className="mb-1">
                          <span className="text-danger fw-bold" style={{ fontSize: "14px" }}>
                            {formatPrice(seller.price)}
                          </span>
                        </div>

                        {/* Shop Info */}
                        <div className="d-flex align-items-center mt-2">
                          <small className="text-truncate" style={{ fontSize: "10px", color: "#666" }}>
                            <i className="fas fa-store me-1"></i>
                            {seller.shopName?.substring(0, 15) || "Shop"}
                          </small>
                        </div>
                      </div>

                      {/* Action Buttons for Desktop */}
                      {!isTouchDevice && (
                        <div className="card-footer p-2 bg-white border-0">
                          <div className="d-flex gap-1">
                            <button 
                              className="btn btn-sm btn-outline-danger flex-fill"
                              onClick={() => openSellerDetail(seller)}
                              style={{ fontSize: "11px", padding: "4px 6px" }}
                            >
                              View
                            </button>
                            <button 
                              className="btn btn-sm btn-success"
                              onClick={() => handleWhatsApp(seller.phoneNumber, seller.productName)}
                              style={{ padding: "4px 8px" }}
                              title="WhatsApp"
                            >
                              <i className="fab fa-whatsapp"></i>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // List View - Optimized for Smartphone
              <div className="mx-0">
                {filteredSellers.map((seller) => (
                  <div 
                    key={seller.id} 
                    className="card mb-2 border-0 shadow-sm"
                    style={{ 
                      borderRadius: "10px",
                      touchAction: "manipulation",
                      // ADDED: Borders for ALL devices (smartphone & desktop)
                      border: "1px solid rgba(0,0,0,0.07) !important",
                      background: "#fff",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.04)"
                    }}
                    onClick={() => isTouchDevice ? openSellerDetail(seller) : null}
                  >
                    <div className="row g-0">
                      <div className="col-4">
                        <div style={{ height: "100px", overflow: "hidden" }}>
                          <img 
                            src={seller.productImages?.[0] || "https://images.unsplash.com/photo-1556656793-08538906a9f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
                            className="w-100 h-100"
                            alt={seller.productName}
                            style={{ objectFit: "cover" }}
                          />
                        </div>
                      </div>

                      <div className="col-8">
                        <div className="card-body p-2">
                          <h6 className="card-title mb-1" style={{ fontSize: "13px", fontWeight: "600" }}>
                            {seller.productName}
                          </h6>
                          
                          <div className="d-flex align-items-center mb-1">
                            <span className={`badge bg-${getStockBadgeColor(seller.stockStatus)} me-1`} style={{ fontSize: "9px" }}>
                              {seller.stockStatus === "Limited" ? "Few left" : seller.stockStatus}
                            </span>
                            <small className="text-muted" style={{ fontSize: "10px" }}>
                              {seller.mainCategory}
                            </small>
                          </div>

                          <div className="mb-1">
                            <span className="text-danger fw-bold" style={{ fontSize: "14px" }}>
                              {formatPrice(seller.price)}
                            </span>
                          </div>

                          <div className="d-flex align-items-center">
                            <small className="fw-bold text-truncate" style={{ fontSize: "11px" }}>
                              <i className="fas fa-store me-1"></i>
                              {seller.shopName?.substring(0, 20) || "Shop"}
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      {isTouchDevice && (
        <div className="fixed-bottom bg-white shadow-lg border-top" style={{ 
          height: "60px",
          zIndex: 999,
          padding: "8px 0"
        }}>
          <div className="container">
            <div className="row">
              <div className="col-3 text-center">
                <button 
                  className="btn btn-link text-decoration-none"
                  onClick={() => navigate('/')}
                  style={{ 
                    padding: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center"
                  }}
                >
                  <i className="fas fa-home" style={{ fontSize: "18px", color: "#FF6B6B" }}></i>
                  <small style={{ fontSize: "10px", color: "#666" }}>Home</small>
                </button>
              </div>
              
              <div className="col-3 text-center">
                <button 
                  className="btn btn-link text-decoration-none"
                  onClick={() => setShowMobileFilters(true)}
                  style={{ 
                    padding: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center"
                  }}
                >
                  <i className="fas fa-filter" style={{ fontSize: "18px", color: "#666" }}></i>
                  <small style={{ fontSize: "10px", color: "#666" }}>Filter</small>
                </button>
              </div>
              
              <div className="col-3 text-center">
                <button 
                  className="btn btn-link text-decoration-none"
                  onClick={() => navigate('/public-sellers')}
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
              
              <div className="col-3 text-center">
                <button 
                  className="btn btn-link text-decoration-none"
                  onClick={isLoggedIn ? handleMyProductsClick : handleLoginClick}
                  style={{ 
                    padding: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center"
                  }}
                >
                  {isLoggedIn ? (
                    <>
                      <div className="rounded-circle bg-danger text-white d-flex align-items-center justify-content-center mx-auto mb-1" 
                           style={{ width: "24px", height: "24px" }}>
                        <i className="fas fa-user" style={{ fontSize: "12px" }}></i>
                      </div>
                      <small style={{ fontSize: "10px", color: "#666" }}>Account</small>
                    </>
                  ) : (
                    <>
                      <div className="rounded-circle bg-danger text-white d-flex align-items-center justify-content-center mx-auto mb-1" 
                           style={{ width: "24px", height: "24px" }}>
                        <i className="fas fa-user-plus" style={{ fontSize: "12px" }}></i>
                      </div>
                      <small style={{ fontSize: "10px", color: "#FF6B6B", fontWeight: "bold" }}>Sign in</small>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Footer */}
      {!isTouchDevice && (
        <footer className="bg-dark text-white py-4 mt-5">
          <div className="container">
            <div className="row">
              <div className="col-md-4 mb-3">
                <h5 className="mb-3" style={{ fontSize: "16px" }}>
                  <i className="fas fa-shopping-cart me-2"></i>
                  Availo Marketplace
                </h5>
                <p className="text-light small" style={{ fontSize: "13px" }}>
                  Find everything you need from trusted local sellers across Tanzania.
                </p>
              </div>
              <div className="col-md-4 mb-3">
                <h5 className="mb-3" style={{ fontSize: "16px" }}>Quick Links</h5>
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <button 
                      className="btn btn-link text-light text-decoration-none p-0"
                      onClick={handleRegisterClick}
                      style={{ fontSize: "13px" }}
                    >
                      <i className="fas fa-store me-1"></i> Become a Seller
                    </button>
                  </li>
                  <li className="mb-2">
                    <button 
                      className="btn btn-link text-light text-decoration-none p-0"
                      onClick={handleLoginClick}
                      style={{ fontSize: "13px" }}
                    >
                      <i className="fas fa-sign-in-alt me-1"></i> Seller Login
                    </button>
                  </li>
                </ul>
              </div>
              <div className="col-md-4 mb-3">
                <h5 className="mb-3" style={{ fontSize: "16px" }}>Contact Us</h5>
                <ul className="list-unstyled">
                  <li className="mb-2" style={{ fontSize: "13px" }}>
                    <i className="fas fa-phone me-2"></i>
                    +255 754 AVAILO
                  </li>
                  <li className="mb-2" style={{ fontSize: "13px" }}>
                    <i className="fas fa-envelope me-2"></i>
                    support@availo.co.tz
                  </li>
                </ul>
              </div>
            </div>
            <hr className="bg-light my-4" />
            <div className="text-center">
              <small className="text-light" style={{ fontSize: "12px" }}>
                © {new Date().getFullYear()} Availo Marketplace. All rights reserved.
              </small>
            </div>
          </div>
        </footer>
      )}

      {/* Font Awesome */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />

      <style>
        {`
          /* Touch-friendly button sizes */
          .btn-mobile {
            min-height: 44px;
            min-width: 44px;
            padding: 12px 16px;
          }
          
          /* Improved touch targets */
          .card {
            cursor: pointer;
            user-select: none;
            -webkit-tap-highlight-color: transparent;
          }
          
          /* Smooth animations */
          @keyframes slideInRight {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
          
          @keyframes slideInLeft {
            from { transform: translateX(-100%); }
            to { transform: translateX(0); }
          }
          
          /* Optimize for mobile performance */
          .product-image {
            will-change: transform;
            backface-visibility: hidden;
          }
          
          /* Prevent text selection on mobile */
          .no-select {
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            -khtml-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
          }
          
          /* Improve scrolling on mobile */
          .mobile-scroll {
            -webkit-overflow-scrolling: touch;
          }
          
          /* Fixed navbar spacing */
          body {
            padding-top: 60px;
          }
          
          @media (min-width: 992px) {
            body {
              padding-top: 0;
            }
          }
          
          /* Product card hover effects (desktop only) */
          @media (hover: hover) and (pointer: fine) {
            .card:hover {
              transform: translateY(-3px);
              box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
            }
          }
          
          .btn-danger {
            background: linear-gradient(135deg, #FF6B6B, #FF8E53);
            border: none;
          }
          
          .btn-danger:hover {
            background: linear-gradient(135deg, #FF8E53, #FF6B6B);
          }
          
          /* Mobile bottom nav active state */
          .fixed-bottom .btn-link.active i,
          .fixed-bottom .btn-link.active small {
            color: #FF6B6B !important;
          }
          
          /* Prevent horizontal scroll */
          html, body {
            max-width: 100%;
            overflow-x: hidden;
          }
          
          /* Better touch feedback */
          .card:active {
            opacity: 0.8;
            transform: scale(0.98);
          }
          
          /* Optimize images */
          img {
            max-width: 100%;
            height: auto;
          }
          
          /* Improve form inputs on mobile */
          input, select, textarea {
            font-size: 16px !important; /* Prevents zoom on iOS */
          }
          
          /* Ad Carousel Styles */
          .ad-carousel-container {
            position: relative;
            overflow: hidden;
          }
          
          .ad-carousel-inner {
            transition: transform 0.8s ease-in-out;
          }
          
          .ad-slide {
            transition: opacity 0.8s ease-in-out;
          }
          
          .ad-slide.active {
            opacity: 1;
            z-index: 1;
          }
          
          /* Ad slide fade animation */
          @keyframes fadeIn {
            from { opacity: 0.4; }
            to { opacity: 1; }
          }
          
          .ad-slide.active {
            animation: fadeIn 0.8s ease-in-out;
          }
          
          /* Mobile ad carousel height adjustments */
          @media (max-width: 768px) {
            .ad-carousel-inner {
              height: 150px !important;
            }
            
            .ad-content h2 {
              font-size: 18px !important;
            }
            
            .ad-content p {
              font-size: 12px !important;
            }
            
            .ad-content .btn {
              padding: 5px 12px !important;
              font-size: 11px !important;
            }
          }
          
          /* Desktop ad carousel improvements */
          @media (min-width: 992px) {
            .ad-carousel-container {
              margin: 0;
              border-radius: 0;
              overflow: hidden;
              box-shadow: none;
            }
          }

          /* Custom nav bar transition */
          .navbar {
            transition: background-color 0.8s ease-in-out, color 0.8s ease-in-out;
          }

          /* Products grid for desktop - 3 columns */
          @media (min-width: 768px) {
            .col-md-4 {
              flex: 0 0 33.333333%;
              max-width: 33.333333%;
            }
          }
          
          /* Products grid for mobile - 2 columns */
          @media (max-width: 767px) {
            .col-6 {
              flex: 0 0 50%;
              max-width: 50%;
            }
          }

          /* PRODUCT CARD BORDERS FOR ALL DEVICES */
          /* This ensures borders are visible on both smartphone and desktop */
          .product-card, 
          .card.shadow-sm,
          .card.border-0.shadow-sm {
            border: 1px solid rgba(0,0,0,0.07) !important;
            background: #fff;
            box-shadow: 0 1px 4px rgba(0,0,0,0.04) !important;
          }

          /* Make borders more visible on mobile for better visual separation */
          @media (max-width: 767px) {
            .card.shadow-sm,
            .card.border-0.shadow-sm {
              border: 1px solid rgba(0,0,0,0.1) !important;
              box-shadow: 0 2px 6px rgba(0,0,0,0.05) !important;
            }
          }

          /* Desktop borders - slightly lighter */
          @media (min-width: 768px) {
            .card.shadow-sm,
            .card.border-0.shadow-sm {
              border: 1px solid rgba(0,0,0,0.05) !important;
              box-shadow: 0 1px 3px rgba(0,0,0,0.03) !important;
            }
          }
        `}
      </style>
    </div>
  );
}

export default PublicSellersDashboard;