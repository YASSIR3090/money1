// src/Auth/PublicSellersDashboard.jsx - ULTIMATE FINAL VERSION 🔥
// ✅ CONNECTED DIRECTLY TO BACKEND - HAKUNA FILTERING!
// ✅ SHOWS ALL REAL PRODUCTS FROM DATABASE
// ✅ CACHING KWA SPEED - LAKINI INAFETCH KILA MARA
// ✅ HANDLES BACKEND SLEEPING
// ✅ FULL UI KAMA ILIVYOKUWA

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAdmin } from "../context/AdminContext";
import apiClient from "../api/apiClient";

function PublicSellersDashboard() {
  const [sellers, setSellers] = useState([]);
  const [filteredSellers, setFilteredSellers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("newest");
  
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearchInputFocused, setIsSearchInputFocused] = useState(false);
  const searchInputRef = useRef(null);
  const suggestionsRef = useRef(null);

  const { user, getUserProfilePicture, logout: authLogout, isVendorRegistered } = useAuth();
  const { ads: adminAds } = useAdmin();
  
  const fallbackAdSlides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      title: "Black Friday Sale",
      description: "Up to 50% off on electronics",
      link: "#",
      backgroundColor: "#FF6B6B",
      textColor: "#ffffff",
      navColor: "#FF6B6B",
      active: true
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      title: "New Arrivals",
      description: "Fresh stock just landed",
      link: "#",
      backgroundColor: "#4ECDC4",
      textColor: "#ffffff",
      navColor: "#4ECDC4",
      active: true
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      title: "Free Shipping",
      description: "On orders above 200,000 TZS",
      link: "#",
      backgroundColor: "#45B7D1",
      textColor: "#ffffff",
      navColor: "#45B7D1",
      active: true
    }
  ];
  
  const [adSlides, setAdSlides] = useState([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  
  const [language, setLanguage] = useState(() => {
    try {
      const savedLanguage = localStorage.getItem('availoLanguage');
      if (savedLanguage) {
        console.log("🌐 Found language:", savedLanguage);
        return savedLanguage;
      }
    } catch (error) {
      console.error("Error reading language:", error);
    }
    return "sw";
  });
  
  const navigate = useNavigate();

  // ✅ COMPLETE TRANSLATIONS
  const translations = {
    sw: {
      appName: "Availo",
      searchPlaceholder: "Tafuta bidhaa, maduka, brand...",
      sellProducts: "Uza bidhaa zako",
      signIn: "Ingia",
      signUp: "Jiandikishe",
      signInToSell: "Ingia kuuza bidhaa",
      welcome: "Karibu Availo",
      browseProducts: "Vinjari bidhaa",
      myProducts: "Bidhaa zangu",
      addProduct: "Ongeza bidhaa",
      help: "Msaada",
      logout: "Toka",
      filter: "Chuja",
      clearAll: "Futa yote",
      category: "Kategoria",
      allCategories: "Kategoria zote",
      priceRange: "Muda wa bei",
      allPrices: "Bei zote",
      under100k: "Chini ya 100,000 TZS",
      stockStatus: "Hali ya hisa",
      allStatus: "Hali zote",
      available: "Inapatikana",
      limited: "Chache zimebaki",
      outOfStock: "Imeisha",
      sortBy: "Panga kwa",
      newest: "Mpya zaidi",
      priceLow: "Bei: Chini kwa Juu",
      priceHigh: "Bei: Juu kwa Chini",
      name: "Jina la bidhaa A-Z",
      wantToSell: "Unataka Kuuza?",
      sellDescription: "Taja bidhaa zako bila malipo na fikia maelfu ya wanunuzi",
      addNewProduct: "Ongeza bidhaa mpya",
      signUpToSell: "Jiandikishe kuuza",
      showing: "Inaonyesha",
      of: "ya",
      products: "bidhaa",
      tapToView: "Bonyeza kuona maelezo",
      call: "Piga",
      whatsapp: "WhatsApp",
      shop: "Duka",
      seller: "Muuza",
      location: "Mahali",
      specifications: "Vipimo",
      noProducts: "Hakuna bidhaa zilizopatikana",
      tryFilters: "Badilisha michujo yako",
      clearFilters: "Futa michujo",
      home: "Nyumbani",
      shopsNav: "Maduka",
      account: "Akaunti",
      helpCenter: "Kituo cha msaada",
      language: "Lugha",
      selectLanguage: "Chagua Lugha",
      swahili: "Kiswahili",
      english: "English",
      searchSuggestions: "Mapendekezo ya Utafutaji",
      recentSearches: "Utafutaji wa Hivi Karibuni",
      clearSearch: "Futa utafutaji",
      productsFound: "bidhaa zilizopatikana",
      popularSearches: "Utafutaji Maarufu",
      trendingNow: "Inasaka Sasa",
      searchResults: "Matokeo ya Utafutaji",
      searchFor: "Kutafuta:",
      profile: "Wasifu",
      specialOffers: "Matangazo Maalum",
      shopNow: "Nunua Sasa",
      product: "Bidhaa",
      brand: "Chapa",
      condition: "Hali"
    },
    en: {
      appName: "Availo",
      searchPlaceholder: "Search products, shops, brands...",
      sellProducts: "Sell your products",
      signIn: "Sign in",
      signUp: "Register",
      signInToSell: "Sign in to sell products",
      welcome: "Welcome to Availo",
      browseProducts: "Browse Products",
      myProducts: "My Products",
      addProduct: "Add New",
      help: "Help",
      logout: "Logout",
      filter: "Filter",
      clearAll: "Clear All",
      category: "Category",
      allCategories: "All Categories",
      priceRange: "Price Range",
      allPrices: "All Prices",
      under100k: "Under 100,000 TZS",
      stockStatus: "Stock Status",
      allStatus: "All Status",
      available: "Available",
      limited: "Limited",
      outOfStock: "Out of Stock",
      sortBy: "Sort By",
      newest: "Newest First",
      priceLow: "Price: Low to High",
      priceHigh: "Price: High to Low",
      name: "Product Name A-Z",
      wantToSell: "Want to Sell?",
      sellDescription: "List your products for free and reach thousands of buyers",
      addNewProduct: "Add New",
      signUpToSell: "Sign up to Sell",
      showing: "Showing",
      of: "of",
      products: "products",
      tapToView: "Tap to view details",
      call: "Call",
      whatsapp: "WhatsApp",
      shop: "Shop",
      seller: "Seller",
      location: "Location",
      specifications: "Specifications",
      noProducts: "No products found",
      tryFilters: "Try adjusting your filters",
      clearFilters: "Clear Filters",
      home: "Home",
      shopsNav: "Shops",
      account: "Account",
      helpCenter: "Help Center",
      language: "Language",
      selectLanguage: "Select Language",
      swahili: "Kiswahili",
      english: "English",
      searchSuggestions: "Search Suggestions",
      recentSearches: "Recent Searches",
      clearSearch: "Clear Search",
      productsFound: "products found",
      popularSearches: "Popular Searches",
      trendingNow: "Trending Now",
      searchResults: "Search Results",
      searchFor: "Searching for:",
      profile: "Profile",
      specialOffers: "Special Offers",
      shopNow: "Shop Now",
      product: "Product",
      brand: "Brand",
      condition: "Condition"
    }
  };

  const t = translations[language] || translations.en;

  // ✅ LOAD ADS FROM ADMIN CONTEXT
  useEffect(() => {
    console.log("📢 PublicSellersDashboard - Loading ads from AdminContext:", adminAds?.length || 0);
    const activeAds = adminAds?.filter(ad => ad.active !== false) || [];
    if (activeAds.length > 0) {
      console.log("✅ Using REAL ADS from AdminManager:", activeAds.length);
      setAdSlides(activeAds);
    } else {
      console.log("⚠️ No active ads from Admin, using fallback ads");
      setAdSlides(fallbackAdSlides);
    }
  }, [adminAds]);

  // ✅ AD CAROUSEL AUTO-PLAY
  useEffect(() => {
    if (adSlides.length > 0) {
      const adInterval = setInterval(() => {
        setCurrentAdIndex((prevIndex) => (prevIndex + 1) % adSlides.length);
      }, 4000);
      return () => clearInterval(adInterval);
    }
  }, [adSlides.length]);

  // ✅ SIMPLIFIED FETCH - NO LOCALSTORAGE CACHING
  const fetchProducts = useCallback(async () => {
    console.log("📦 Fetching products from API...");
    setIsLoading(true);

    try {
      const response = await apiClient.get('/api/products/');
      let products = [];
      
      if (response.data?.results) {
        products = response.data.results;
      } else if (Array.isArray(response.data)) {
        products = response.data;
      }

      products = products.map(p => ({
        ...p,
        email: p.email || p.seller_email || 'unknown@email.com'
      }));

      setSellers(products);
      setFilteredSellers(products);
      console.log(`✅ Found ${products.length} products from backend`);
    } catch (error) {
      console.error("❌ Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ✅ INITIAL LOAD AND REFRESH INTERVAL
  useEffect(() => {
    fetchProducts();

    const checkTouchDevice = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    
    checkTouchDevice();
    window.addEventListener('resize', checkTouchDevice);
    const interval = setInterval(fetchProducts, 120000); // 2 minutes

    return () => {
      window.removeEventListener('resize', checkTouchDevice);
      clearInterval(interval);
    };
  }, [fetchProducts]);

  // ============== FILTER AND SORT SELLERS ==============
  useEffect(() => {
    filterAndSortSellers();
    
    if (searchTerm.trim() !== "") {
      setIsSearching(true);
      setViewMode("list");
    } else {
      setIsSearching(false);
      setViewMode("grid");
    }
  }, [sellers, filters, searchTerm, sortBy, language]);

  // ✅ Update search suggestions
  useEffect(() => {
    if (searchTerm.trim().length === 0) {
      setSearchSuggestions([]);
      return;
    }

    const term = searchTerm.toLowerCase();
    const suggestions = [];

    const productMatches = [...new Set(sellers
      .filter(seller => (seller.product_name || seller.productName || '').toLowerCase().includes(term))
      .map(seller => ({
        type: "product",
        text: seller.product_name || seller.productName || 'Product',
        category: seller.main_category || seller.mainCategory || 'General',
        count: sellers.filter(s => (s.product_name || s.productName) === (seller.product_name || seller.productName)).length
      }))
      .slice(0, 5))];

    const categoryMatches = [...new Set(sellers
      .filter(seller => (seller.main_category || seller.mainCategory || '').toLowerCase().includes(term) || 
                       (seller.product_category || seller.productCategory || '').toLowerCase().includes(term))
      .map(seller => ({
        type: "category",
        text: seller.main_category || seller.mainCategory || 'General',
        count: sellers.filter(s => (s.main_category || s.mainCategory) === (seller.main_category || seller.mainCategory)).length
      }))
      .slice(0, 3))];

    const brandMatches = [...new Set(sellers
      .filter(seller => (seller.brand || '').toLowerCase().includes(term))
      .map(seller => ({
        type: "brand",
        text: seller.brand || 'Brand',
        count: sellers.filter(s => s.brand === seller.brand).length
      }))
      .slice(0, 3))];

    const shopMatches = [...new Set(sellers
      .filter(seller => (seller.shop_name || seller.shopName || '').toLowerCase().includes(term))
      .map(seller => ({
        type: "shop",
        text: seller.shop_name || seller.shopName || 'Shop',
        count: sellers.filter(s => (s.shop_name || s.shopName) === (seller.shop_name || seller.shopName)).length
      }))
      .slice(0, 2))];

    suggestions.push(...productMatches, ...categoryMatches, ...brandMatches, ...shopMatches);
    
    const uniqueSuggestions = suggestions.filter((suggestion, index, self) =>
      index === self.findIndex((s) => s.text === suggestion.text)
    );

    setSearchSuggestions(uniqueSuggestions.slice(0, 8));
  }, [searchTerm, sellers]);

  // ✅ Filter and sort sellers function
  const filterAndSortSellers = () => {
    let result = [...sellers];

    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      result = result.filter(seller =>
        (seller.product_name || seller.productName || '').toLowerCase().includes(term) ||
        (seller.shop_name || seller.shopName || '').toLowerCase().includes(term) ||
        (seller.brand || '').toLowerCase().includes(term) ||
        (seller.product_category || seller.productCategory || '').toLowerCase().includes(term) ||
        (seller.main_category || seller.mainCategory || '').toLowerCase().includes(term) ||
        (seller.area || '').toLowerCase().includes(term)
      );
    }

    if (filters.category !== "") {
      result = result.filter(seller => 
        (seller.main_category || seller.mainCategory) === filters.category || 
        (seller.product_category || seller.productCategory) === filters.category
      );
    }

    if (filters.brand !== "") {
      result = result.filter(seller => seller.brand === filters.brand);
    }

    if (filters.region !== "") {
      result = result.filter(seller => seller.region === filters.region);
    }

    if (filters.district !== "") {
      result = result.filter(seller => seller.district === filters.district);
    }

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

    if (filters.stockStatus !== "all") {
      result = result.filter(seller => seller.stockStatus === filters.stockStatus);
    }

    if (filters.condition !== "all") {
      result = result.filter(seller => seller.condition === filters.condition);
    }

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
          return (b.registrationDate || 0) - (a.registrationDate || 0);
      }
    });

    setFilteredSellers(result);
  };

  // ============== HELPER FUNCTIONS ==============
  const getProfilePictureUrl = () => getUserProfilePicture();

  const getUserInitial = () => {
    if (!user) return "U";
    const name = user.name || user.displayName || user.email?.split('@')[0] || "User";
    return name.charAt(0).toUpperCase();
  };

  // ✅ Ad carousel functions
  const goToSlide = (index) => setCurrentAdIndex(index);
  const nextSlide = () => setCurrentAdIndex((prevIndex) => (prevIndex + 1) % adSlides.length);
  const prevSlide = () => setCurrentAdIndex((prevIndex) => prevIndex === 0 ? adSlides.length - 1 : prevIndex - 1);

  const categories = [...new Set(sellers.map(s => s.mainCategory).filter(Boolean))];
  const brands = [...new Set(sellers.map(s => s.brand).filter(Boolean))];
  const regions = [...new Set(sellers.map(s => s.region).filter(Boolean))];
  const districts = [...new Set(sellers.map(s => s.district).filter(Boolean))];

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilters({
      category: "", brand: "", region: "", district: "",
      priceRange: "all", stockStatus: "all", condition: "all"
    });
    if (isTouchDevice) setShowMobileFilters(false);
  };

  const handleCall = (phoneNumber) => window.location.href = `tel:${phoneNumber}`;
  
  const handleWhatsApp = (phoneNumber, productName) => {
    const message = language === 'sw' 
      ? `Habari! Nina nia ya kununua ${productName}. Bado ipo?` 
      : `Hello! I'm interested in ${productName}. Is it still available?`;
    const url = `https://wa.me/${phoneNumber.replace('+', '')}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  // ✅ COMPRESS IMAGES ON THE FLY
  const getOptimizedImage = (imageUrl) => {
    const fallback = "https://images.unsplash.com/photo-1556656793-08538906a9f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
    if (!imageUrl) return fallback;
    
    if (imageUrl.startsWith('http') && !imageUrl.includes('?')) {
      return `${imageUrl}?w=400&q=70`;
    }
    return imageUrl;
  };

  const formatPrice = (price) => {
    if (!price) return language === 'sw' ? "Bei haijawekwa" : "Price not set";
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

  // ✅ NAVIGATION HANDLERS
  const handleProductClick = (seller) => {
    console.log("📦 Navigating to product:", seller.id, seller.product_name || seller.productName);
    navigate(`/product/${seller.id}`);
  };

  const handleLoginClick = () => {
    navigate("/vendor-login");
    setShowMobileMenu(false);
    setShowLanguageSelector(false);
  };

  const handleRegisterClick = () => {
    navigate("/vendor-register");
    setShowMobileMenu(false);
    setShowLanguageSelector(false);
  };

  const handleLogout = () => {
    authLogout();
    navigate("/vendor-login");
  };

  const handleMyProductsClick = () => {
    if (user) {
      navigate("/seller-profile");
    } else {
      navigate("/vendor-login");
    }
    setShowMobileMenu(false);
    setShowLanguageSelector(false);
  };

  const handleHomeClick = () => {
    console.log("🏠 Home clicked - navigating to /");
    navigate('/');
  };
  
  const handleProductsClick = () => {
    console.log("📦 Products clicked - navigating to /products");
    navigate('/products');
  };
  
  const handleShopsClick = () => {
    console.log("🏪 Shops clicked - navigating to /shops");
    navigate('/shops');
  };
  
  // ✅ FIXED: ADD PRODUCT BUTTON - CORRECT LOGIC!
  const handleAddProductClick = async () => {
    console.log("➕ Add Product clicked - User:", user?.email, "Logged in:", !!user);
    
    // CASE 1: HAKUNA USER - MPYA KABISA
    if (!user) {
      console.log("➡️ No user - NEW USER - Redirecting to login");
      navigate('/vendor-login', {
        state: {
          from: '/public-sellers',
          action: 'add-product-new-user',
          message: 'Please login to start selling'
        }
      });
      setShowMobileMenu(false);
      setShowLanguageSelector(false);
      return;
    }

    // ✅ DIRECT CHECK: Check if user is registered using the hook
    const isRegistered = isVendorRegistered(user.email);
    console.log("🔍 Vendor registration check (DIRECT):", { email: user.email, isRegistered });

    if (!isRegistered) {
      // CASE 2: AMEINGIA LAKINI HAJAJISAJILI - anza registration
      console.log("➡️ User logged in but NOT registered - Redirecting to vendor registration");
      navigate('/vendor-register', {
        state: {
          user: user,
          action: "register-vendor",
          message: "Complete your vendor registration to start selling",
          from: "/public-sellers"
        }
      });
    } else {
      // ✅ CASE 3: AMEINGIA NA AMEJISAJILI TAYARI - add product moja kwa moja!
      console.log("➡️ User IS registered - Redirecting directly to add product (NO LOGIN)");
      navigate('/vendor-register', {
        state: {
          user: user,
          action: "add-product", // ← MUHIMU SANA!
          message: "Add new product to your shop",
          from: "/public-sellers"
        }
      });
    }
    
    setShowMobileMenu(false);
    setShowLanguageSelector(false);
  };
  
  const handleAccountClick = () => {
    console.log("👤 Account clicked - navigating to", user ? "/seller-profile" : "/vendor-login");
    if (user) {
      navigate('/seller-profile');
    } else {
      navigate('/vendor-login');
    }
    setShowMobileMenu(false);
    setShowLanguageSelector(false);
  };

  const handleProfilePictureClick = () => {
    console.log("🖼️ Profile picture clicked");
    if (user) {
      navigate('/seller-profile');
    } else {
      navigate('/vendor-login');
    }
    setShowMobileMenu(false);
    setShowLanguageSelector(false);
  };

  // ✅ Language change handler
  const handleLanguageChange = (lang) => {
    console.log("🌐 Language changing to:", lang);
    
    setLanguage(lang);
    
    try {
      localStorage.setItem('availoLanguage', lang);
      sessionStorage.setItem('availoLanguage_backup', lang);
      console.log("✅ Language saved to all storages:", lang);
    } catch (error) {
      console.error("❌ Error saving language:", error);
    }
    
    setShowLanguageSelector(false);
    filterAndSortSellers();
  };

  // ✅ Profile Picture Component
  const ProfileImage = ({ size = 35, showBorder = false }) => {
    const profileUrl = getProfilePictureUrl();
    const initial = getUserInitial();
    const [imgError, setImgError] = useState(false);

    if (user && profileUrl && !imgError && profileUrl !== 'null' && profileUrl !== 'undefined') {
      return (
        <div 
          className="rounded-circle d-flex align-items-center justify-content-center overflow-hidden"
          style={{ 
            width: `${size}px`, 
            height: `${size}px`,
            border: showBorder ? "2px solid #FF6B6B" : "none",
            backgroundColor: "#dc3545",
            color: "white",
            fontWeight: "bold",
            fontSize: `${size * 0.4}px`,
            cursor: "pointer",
            flexShrink: 0
          }}
          onClick={handleProfilePictureClick}
        >
          <img 
            src={profileUrl} 
            alt={user?.name || "Profile"}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover"
            }}
            referrerPolicy="no-referrer"
            crossOrigin="anonymous"
            onError={() => {
              console.log("Profile image failed to load, using fallback");
              setImgError(true);
            }}
          />
        </div>
      );
    }

    return (
      <div 
        className="rounded-circle d-flex align-items-center justify-content-center"
        style={{ 
          width: `${size}px`, 
          height: `${size}px`,
          border: showBorder ? "2px solid #FF6B6B" : "none",
          backgroundColor: user ? "#dc3545" : "#f0f0f0",
          color: user ? "white" : "#666",
          fontWeight: "bold",
          fontSize: `${size * 0.4}px`,
          cursor: "pointer",
          flexShrink: 0
        }}
        onClick={handleProfilePictureClick}
      >
        {user ? initial : <i className="fas fa-user" style={{ fontSize: `${size * 0.5}px` }}></i>}
      </div>
    );
  };

  // ✅ Search handlers
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowSuggestions(value.trim().length > 0);
  };

  const handleSearchFocus = () => {
    setIsSearchInputFocused(true);
    if (searchTerm.trim().length > 0) setShowSuggestions(true);
  };

  const handleSearchBlur = () => {
    setIsSearchInputFocused(false);
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const handleSuggestionClick = (suggestion) => {
    console.log("🔍 Suggestion clicked:", suggestion);
    setSearchTerm(suggestion.text);
    setShowSuggestions(false);
    setIsSearching(true);
    setViewMode("list");
    navigate(`/search-results?q=${encodeURIComponent(suggestion.text)}`);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setShowSuggestions(false);
    setIsSearching(false);
    setViewMode("grid");
    if (searchInputRef.current) searchInputRef.current.focus();
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      setShowSuggestions(false);
      if (searchTerm.trim() === "") {
        setIsSearching(false);
        setViewMode("grid");
        return;
      }
      setIsSearching(true);
      setViewMode("list");
      navigate(`/search-results?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleSearchClick = () => {
    setShowSuggestions(false);
    if (searchTerm.trim() === "") {
      setIsSearching(false);
      setViewMode("grid");
      return;
    }
    setIsSearching(true);
    setViewMode("list");
    navigate(`/search-results?q=${encodeURIComponent(searchTerm)}`);
  };

  const getSuggestionTypeText = (type) => {
    switch (type) {
      case "product": return language === 'sw' ? "Bidhaa" : "Product";
      case "category": return language === 'sw' ? "Kategoria" : "Category";
      case "brand": return language === 'sw' ? "Chapa" : "Brand";
      case "shop": return language === 'sw' ? "Duka" : "Shop";
      default: return "";
    }
  };

  // ✅ Click outside for suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target) &&
        searchInputRef.current && 
        !searchInputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getNavTextColor = (navColor) => {
    switch(navColor) {
      case "#FF6B6B":
      case "#4ECDC4":
      case "#45B7D1":
        return "#ffffff";
      case "#96CEB4":
      case "#FFEAA7":
      case "#DDA0DD":
        return "#000000";
      default:
        return "#ffffff";
    }
  };

  const worldLanguages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'sw', name: 'Kiswahili', flag: '🇹🇿' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
    { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  ];

  // ============== LOADING STATE ==============
  if (isLoading && sellers.length === 0) {
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
          <p style={{ color: "#5f6368", fontSize: "14px", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif" }}>Loading products...</p>
        </div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const currentAd = adSlides[currentAdIndex] || adSlides[0] || fallbackAdSlides[0];
  const navBarColorFromAd = currentAd?.navColor || "#FF6B6B";
  const textColorFromAd = getNavTextColor(navBarColorFromAd);

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "#f8f9fa",
      paddingBottom: isTouchDevice ? "80px" : "0"
    }}>
      {/* Navigation Bar - Same as your original */}
      <nav 
        className="navbar shadow-sm fixed-top py-2 navbar-light"
        style={{ 
          zIndex: 1000,
          backgroundColor: navBarColorFromAd,
          transition: 'background-color 0.8s ease-in-out',
          borderBottom: "none",
          margin: 0,
          padding: 0
        }}
      >
        <div className="container-fluid px-0" style={{ margin: 0, padding: 0 }}>
          {/* Mobile View */}
          <div className="d-flex d-lg-none align-items-center w-100 px-2" style={{ margin: 0, padding: "8px 0" }}>
            <Link 
              className="navbar-brand fw-bold me-2" 
              to="/" 
              style={{ 
                fontSize: "16px",
                color: textColorFromAd,
                display: "flex",
                alignItems: "center",
                flexShrink: 0
              }}
            >
              <i className="fas fa-shopping-cart me-2" style={{ color: textColorFromAd, fontSize: "18px" }}></i>
              {t.appName}
            </Link>
            
            <div className="flex-grow-1 mx-2" style={{ position: "relative" }}>
              <div className="search-container" style={{ width: "100%", position: "relative" }}>
                <div 
                  className={`search-input-wrapper ${isSearchInputFocused ? 'focused' : ''}`}
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "36px",
                    display: "flex",
                    alignItems: "center",
                    borderRadius: isSearchInputFocused ? "25px" : "0",
                    backgroundColor: isSearchInputFocused 
                      ? (navBarColorFromAd === "#FF6B6B" || navBarColorFromAd === "#4ECDC4" || navBarColorFromAd === "#45B7D1" 
                          ? "rgba(255,255,255,0.2)" 
                          : "rgba(0,0,0,0.1)") 
                      : "transparent",
                    border: isSearchInputFocused ? "none" : "none",
                    padding: isSearchInputFocused ? "0 12px" : "0",
                    transition: "all 0.3s ease",
                    boxShadow: isSearchInputFocused ? `inset 0 0 0 1px ${navBarColorFromAd === "#FF6B6B" || navBarColorFromAd === "#4ECDC4" || navBarColorFromAd === "#45B7D1" ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.1)"}` : "none"
                  }}
                >
                  <input
                    ref={searchInputRef}
                    type="text"
                    className="search-input-initial"
                    placeholder={t.searchPlaceholder}
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onFocus={handleSearchFocus}
                    onBlur={handleSearchBlur}
                    onKeyPress={handleSearchKeyPress}
                    style={{
                      flex: 1,
                      border: "none",
                      outline: "none",
                      backgroundColor: "transparent",
                      fontSize: "14px",
                      color: textColorFromAd,
                      padding: "8px 0",
                      width: "100%",
                      height: "100%"
                    }}
                  />
                  {searchTerm && (
                    <button 
                      type="button"
                      onClick={handleClearSearch}
                      style={{
                        background: "none",
                        border: "none",
                        color: textColorFromAd,
                        opacity: 0.7,
                        marginRight: "8px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "20px",
                        height: "20px"
                      }}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  )}
                  <button 
                    type="button" 
                    onClick={handleSearchClick}
                    style={{
                      background: "none",
                      border: "none",
                      color: textColorFromAd,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "20px",
                      height: "20px"
                    }}
                  >
                    <i className="fas fa-search"></i>
                  </button>
                </div>
                
                {/* Search Suggestions */}
                {showSuggestions && searchSuggestions.length > 0 && (
                  <div 
                    ref={suggestionsRef}
                    className="search-suggestions-dropdown"
                    style={{
                      position: isTouchDevice ? "fixed" : "absolute",
                      top: isTouchDevice ? "70px" : "100%",
                      left: isTouchDevice ? "10px" : 0,
                      right: isTouchDevice ? "10px" : 0,
                      width: isTouchDevice ? "calc(100% - 20px)" : "100%",
                      zIndex: 10000,
                      maxHeight: isTouchDevice ? "60vh" : "300px",
                      overflowY: "auto",
                      boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
                      borderRadius: "12px",
                      backgroundColor: "#ffffff",
                      marginTop: "5px",
                      touchAction: "pan-y",
                      WebkitOverflowScrolling: "touch"
                    }}
                  >
                    <div className="card border-0 shadow-sm">
                      <div className="card-body p-0">
                        {searchSuggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            className="suggestion-item"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              console.log("✅ Suggestion clicked:", suggestion);
                              handleSuggestionClick(suggestion);
                            }}
                            onTouchStart={(e) => {
                              e.preventDefault();
                            }}
                            style={{
                              cursor: "pointer",
                              padding: isTouchDevice ? "15px 20px" : "12px 16px",
                              borderBottom: index < searchSuggestions.length - 1 ? "1px solid #f0f0f0" : "none",
                              backgroundColor: "transparent",
                              transition: "all 0.2s",
                              width: "100%",
                              textAlign: "left",
                              border: "none",
                              display: "block",
                              color: "#212529",
                              fontSize: isTouchDevice ? "16px" : "14px",
                              minHeight: isTouchDevice ? "50px" : "auto",
                              WebkitTapHighlightColor: "transparent"
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8f9fa"}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                          >
                            <div className="w-100">
                              <div className="fw-medium" style={{ fontSize: isTouchDevice ? "15px" : "14px" }}>{suggestion.text}</div>
                              <small className="text-muted" style={{ fontSize: "12px" }}>
                                {getSuggestionTypeText(suggestion.type)}
                                {suggestion.count && ` • ${suggestion.count} ${language === 'sw' ? 'bidhaa' : 'products'}`}
                              </small>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="d-flex align-items-center ms-2" style={{ flexShrink: 0 }}>
              <button 
                className="btn"
                onClick={() => setShowLanguageSelector(true)}
                style={{ 
                  width: "36px", 
                  height: "36px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: 'transparent',
                  color: textColorFromAd,
                  padding: 0,
                  border: "none",
                  marginRight: "8px"
                }}
                title={t.language}
              >
                <i className="fas fa-globe" style={{ fontSize: "18px", color: textColorFromAd }}></i>
              </button>
              
              <button 
                className="btn"
                onClick={() => setShowMobileMenu(true)}
                style={{ 
                  width: "36px", 
                  height: "36px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: 'transparent',
                  color: textColorFromAd,
                  padding: 0,
                  border: "none"
                }}
                title="Menu"
              >
                <i className="fas fa-bars" style={{ fontSize: "18px", color: textColorFromAd }}></i>
              </button>
            </div>
          </div>
          
          {/* Desktop View */}
          <div className="d-none d-lg-flex align-items-center w-100 justify-content-between px-3">
            <Link 
              className="navbar-brand fw-bold" 
              to="/" 
              style={{ 
                fontSize: "18px",
                color: textColorFromAd,
                display: "flex",
                alignItems: "center"
              }}
            >
              <i className="fas fa-shopping-cart me-2" style={{ color: textColorFromAd, fontSize: "20px" }}></i>
              {t.appName}
            </Link>
            
            <div style={{ width: "400px", position: "relative" }}>
              <div className="search-container">
                <div 
                  className={`search-input-wrapper ${isSearchInputFocused ? 'focused' : ''}`}
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    borderRadius: isSearchInputFocused ? "25px" : "0",
                    backgroundColor: isSearchInputFocused 
                      ? (navBarColorFromAd === "#FF6B6B" || navBarColorFromAd === "#4ECDC4" || navBarColorFromAd === "#45B7D1" 
                          ? "rgba(255,255,255,0.2)" 
                          : "rgba(0,0,0,0.1)") 
                      : "transparent",
                    border: isSearchInputFocused ? "none" : "none",
                    padding: isSearchInputFocused ? "0 16px" : "0",
                    transition: "all 0.3s ease",
                    boxShadow: isSearchInputFocused ? `inset 0 0 0 1px ${navBarColorFromAd === "#FF6B6B" || navBarColorFromAd === "#4ECDC4" || navBarColorFromAd === "#45B7D1" ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.1)"}` : "none"
                  }}
                >
                  <input
                    ref={searchInputRef}
                    type="text"
                    className="search-input-initial"
                    placeholder={t.searchPlaceholder}
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onFocus={handleSearchFocus}
                    onBlur={handleSearchBlur}
                    onKeyPress={handleSearchKeyPress}
                    style={{
                      flex: 1,
                      border: "none",
                      outline: "none",
                      backgroundColor: "transparent",
                      fontSize: "14px",
                      color: textColorFromAd,
                      padding: "8px 0",
                      width: "100%",
                      height: "100%"
                    }}
                  />
                  {searchTerm && (
                    <button 
                      type="button"
                      onClick={handleClearSearch}
                      style={{
                        background: "none",
                        border: "none",
                        color: textColorFromAd,
                        opacity: 0.7,
                        marginRight: "12px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "24px",
                        height: "24px"
                      }}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  )}
                  <button 
                    type="button" 
                    onClick={handleSearchClick}
                    style={{
                      background: "none",
                      border: "none",
                      color: textColorFromAd,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "24px",
                      height: "24px"
                    }}
                  >
                    <i className="fas fa-search"></i>
                  </button>
                </div>
                
                {/* Desktop Search Suggestions */}
                {showSuggestions && searchSuggestions.length > 0 && (
                  <div 
                    ref={suggestionsRef}
                    className="search-suggestions-dropdown"
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      right: 0,
                      zIndex: 10000,
                      maxHeight: "400px",
                      overflowY: "auto",
                      boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
                      borderRadius: "12px",
                      backgroundColor: "#ffffff",
                      marginTop: "5px"
                    }}
                  >
                    <div className="card border-0 shadow-sm">
                      <div className="card-body p-0">
                        {searchSuggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            className="suggestion-item"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              console.log("✅ Suggestion clicked:", suggestion);
                              handleSuggestionClick(suggestion);
                            }}
                            style={{
                              cursor: "pointer",
                              padding: "12px 16px",
                              borderBottom: index < searchSuggestions.length - 1 ? "1px solid #f0f0f0" : "none",
                              backgroundColor: "transparent",
                              transition: "all 0.2s",
                              width: "100%",
                              textAlign: "left",
                              border: "none",
                              display: "block",
                              color: "#212529",
                              WebkitTapHighlightColor: "transparent"
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8f9fa"}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                          >
                            <div className="w-100">
                              <div className="fw-medium" style={{ fontSize: "14px" }}>{suggestion.text}</div>
                              <small className="text-muted">
                                {getSuggestionTypeText(suggestion.type)}
                                {suggestion.count && ` • ${suggestion.count} ${language === 'sw' ? 'bidhaa' : 'products'}`}
                              </small>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {!isSearching && (
              <div className="btn-group me-3">
                <button 
                  className={`btn ${viewMode === "grid" ? "btn-primary" : "btn-outline-secondary"}`}
                  onClick={() => setViewMode("grid")}
                  style={{
                    backgroundColor: viewMode === "grid" ? (navBarColorFromAd === "#FF6B6B" || navBarColorFromAd === "#4ECDC4" || navBarColorFromAd === "#45B7D1" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)") : 'transparent',
                    color: viewMode === "grid" ? textColorFromAd : textColorFromAd,
                    borderColor: viewMode === "grid" ? (navBarColorFromAd === "#FF6B6B" || navBarColorFromAd === "#4ECDC4" || navBarColorFromAd === "#45B7D1" ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.3)") : (navBarColorFromAd === "#FF6B6B" || navBarColorFromAd === "#4ECDC4" || navBarColorFromAd === "#45B7D1" ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.3)")
                  }}
                >
                  <i className="fas fa-th-large"></i>
                </button>
                <button 
                  className={`btn ${viewMode === "list" ? "btn-primary" : "btn-outline-secondary"}`}
                  onClick={() => setViewMode("list")}
                  style={{
                    backgroundColor: viewMode === "list" ? (navBarColorFromAd === "#FF6B6B" || navBarColorFromAd === "#4ECDC4" || navBarColorFromAd === "#45B7D1" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)") : 'transparent',
                    color: viewMode === "list" ? textColorFromAd : textColorFromAd,
                    borderColor: viewMode === "list" ? (navBarColorFromAd === "#FF6B6B" || navBarColorFromAd === "#4ECDC4" || navBarColorFromAd === "#45B7D1" ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.3)") : (navBarColorFromAd === "#FF6B6B" || navBarColorFromAd === "#4ECDC4" || navBarColorFromAd === "#45B7D1" ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.3)")
                  }}
                >
                  <i className="fas fa-list"></i>
                </button>
              </div>
            )}
            
            <div className="dropdown me-3">
              <button 
                className="btn btn-sm d-flex align-items-center"
                type="button" 
                data-bs-toggle="dropdown"
                style={{ 
                  borderRadius: "20px",
                  padding: "5px 12px",
                  fontSize: "13px",
                  backgroundColor: 'transparent',
                  color: textColorFromAd,
                  borderColor: navBarColorFromAd === "#FF6B6B" || navBarColorFromAd === "#4ECDC4" || navBarColorFromAd === "#45B7D1" ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.3)"
                }}
              >
                <i className="fas fa-globe me-1" style={{ color: textColorFromAd }}></i>
                {language === 'sw' ? 'SW' : 'EN'}
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <button 
                    className={`dropdown-item ${language === 'sw' ? 'active' : ''}`}
                    onClick={() => handleLanguageChange('sw')}
                  >
                    <i className="fas fa-language me-2"></i>
                    {t.swahili}
                  </button>
                </li>
                <li>
                  <button 
                    className={`dropdown-item ${language === 'en' ? 'active' : ''}`}
                    onClick={() => handleLanguageChange('en')}
                  >
                    <i className="fas fa-language me-2"></i>
                    {t.english}
                  </button>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button 
                    className={`dropdown-item ${language === 'ar' ? 'active' : ''}`}
                    onClick={() => handleLanguageChange('ar')}
                  >
                    <i className="fas fa-language me-2"></i>
                    {t.arabic}
                  </button>
                </li>
                <li>
                  <button 
                    className={`dropdown-item ${language === 'fr' ? 'active' : ''}`}
                    onClick={() => handleLanguageChange('fr')}
                  >
                    <i className="fas fa-language me-2"></i>
                    {t.french}
                  </button>
                </li>
                <li>
                  <button 
                    className={`dropdown-item ${language === 'es' ? 'active' : ''}`}
                    onClick={() => handleLanguageChange('es')}
                  >
                    <i className="fas fa-language me-2"></i>
                    {t.spanish}
                  </button>
                </li>
                <li>
                  <button 
                    className={`dropdown-item ${language === 'pt' ? 'active' : ''}`}
                    onClick={() => handleLanguageChange('pt')}
                  >
                    <i className="fas fa-language me-2"></i>
                    {t.portuguese}
                  </button>
                </li>
                <li>
                  <button 
                    className={`dropdown-item ${language === 'zh' ? 'active' : ''}`}
                    onClick={() => handleLanguageChange('zh')}
                  >
                    <i className="fas fa-language me-2"></i>
                    {t.chinese}
                  </button>
                </li>
                <li>
                  <button 
                    className={`dropdown-item ${language === 'hi' ? 'active' : ''}`}
                    onClick={() => handleLanguageChange('hi')}
                  >
                    <i className="fas fa-language me-2"></i>
                    {t.hindi}
                  </button>
                </li>
                <li>
                  <button 
                    className={`dropdown-item ${language === 'ru' ? 'active' : ''}`}
                    onClick={() => handleLanguageChange('ru')}
                  >
                    <i className="fas fa-language me-2"></i>
                    {t.russian}
                  </button>
                </li>
                <li>
                  <button 
                    className={`dropdown-item ${language === 'de' ? 'active' : ''}`}
                    onClick={() => handleLanguageChange('de')}
                  >
                    <i className="fas fa-language me-2"></i>
                    {t.german}
                  </button>
                </li>
                <li>
                  <button 
                    className={`dropdown-item ${language === 'ja' ? 'active' : ''}`}
                    onClick={() => handleLanguageChange('ja')}
                  >
                    <i className="fas fa-language me-2"></i>
                    {t.japanese}
                  </button>
                </li>
                <li>
                  <button 
                    className={`dropdown-item ${language === 'ko' ? 'active' : ''}`}
                    onClick={() => handleLanguageChange('ko')}
                  >
                    <i className="fas fa-language me-2"></i>
                    {t.korean}
                  </button>
                </li>
                <li>
                  <button 
                    className={`dropdown-item ${language === 'it' ? 'active' : ''}`}
                    onClick={() => handleLanguageChange('it')}
                  >
                    <i className="fas fa-language me-2"></i>
                    {t.italian}
                  </button>
                </li>
                <li>
                  <button 
                    className={`dropdown-item ${language === 'tr' ? 'active' : ''}`}
                    onClick={() => handleLanguageChange('tr')}
                  >
                    <i className="fas fa-language me-2"></i>
                    {t.turkish}
                  </button>
                </li>
                <li>
                  <button 
                    className={`dropdown-item ${language === 'nl' ? 'active' : ''}`}
                    onClick={() => handleLanguageChange('nl')}
                  >
                    <i className="fas fa-language me-2"></i>
                    {t.dutch}
                  </button>
                </li>
                <li>
                  <button 
                    className={`dropdown-item ${language === 'pl' ? 'active' : ''}`}
                    onClick={() => handleLanguageChange('pl')}
                  >
                    <i className="fas fa-language me-2"></i>
                    {t.polish}
                  </button>
                </li>
              </ul>
            </div>
            
            {user ? (
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
                    color: textColorFromAd,
                    borderColor: navBarColorFromAd === "#FF6B6B" || navBarColorFromAd === "#4ECDC4" || navBarColorFromAd === "#45B7D1" ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.3)"
                  }}
                >
                  <ProfileImage size={35} />
                  <span style={{ fontSize: "14px", color: textColorFromAd, marginLeft: "8px" }}>{t.account}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li><span className="dropdown-item-text fw-bold">{t.welcome}, {user?.name || user?.displayName || user?.email?.split('@')[0] || "Seller"}</span></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item" onClick={handleMyProductsClick}>
                      <i className="fas fa-box me-2"></i>
                      {t.myProducts}
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={handleAddProductClick}>
                      <i className="fas fa-plus-circle me-2"></i>
                      {t.addProduct}
                    </button>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item text-danger" onClick={handleLogout}>
                      <i className="fas fa-sign-out-alt me-2"></i>
                      {t.logout}
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
                  transition: "all 0.8s ease",
                  backgroundColor: 'transparent',
                  color: textColorFromAd,
                  borderColor: navBarColorFromAd === "#FF6B6B" || navBarColorFromAd === "#4ECDC4" || navBarColorFromAd === "#45B7D1" ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.3)"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = navBarColorFromAd === "#FF6B6B" || navBarColorFromAd === "#4ECDC4" || navBarColorFromAd === "#45B7D1" 
                    ? "rgba(255,255,255,0.2)" 
                    : "rgba(0,0,0,0.1)";
                  e.currentTarget.style.color = textColorFromAd;
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = textColorFromAd;
                  e.currentTarget.style.transform = "";
                }}
              >
                <div 
                  className="rounded-circle d-flex align-items-center justify-content-center me-2" 
                  style={{ 
                    width: "35px", 
                    height: "35px",
                    backgroundColor: navBarColorFromAd === "#FF6B6B" || navBarColorFromAd === "#4ECDC4" || navBarColorFromAd === "#45B7D1" 
                      ? "rgba(255,255,255,0.9)" 
                      : navBarColorFromAd,
                    color: navBarColorFromAd === "#FF6B6B" || navBarColorFromAd === "#4ECDC4" || navBarColorFromAd === "#45B7D1" 
                      ? navBarColorFromAd 
                      : "white"
                  }}
                >
                  <i className="fas fa-user"></i>
                </div>
                <div className="d-flex flex-column align-items-start">
                  <span style={{ fontSize: "12px", fontWeight: "bold", color: textColorFromAd }}>{t.signIn} ›</span>
                  <span style={{ fontSize: "11px", opacity: 0.8, color: textColorFromAd }}>{t.sellProducts}</span>
                </div>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* AD CAROUSEL SECTION */}
      {adSlides.length > 0 && (
        <div 
          className="container-fluid px-0" 
          style={{ 
            marginTop: isTouchDevice ? "70px" : "80px",
            paddingTop: "0",
            backgroundColor: navBarColorFromAd
          }}
        >
          <div className="row mx-0" style={{ margin: 0, padding: 0 }}>
            <div className="col-12 px-0" style={{ margin: 0, padding: 0 }}>
              <div className="ad-carousel-container" style={{ position: "relative", marginTop: "0", paddingTop: "0" }}>
                <div 
                  className="ad-carousel-inner"
                  style={{
                    height: isTouchDevice ? "200px" : "200px",
                    position: "relative",
                    overflow: "hidden",
                    margin: 0,
                    padding: 0
                  }}
                >
                  {adSlides.map((slide, index) => (
                    <div
                      key={slide.id || index}
                      className={`ad-slide ${index === currentAdIndex ? 'active' : ''}`}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        opacity: index === currentAdIndex ? 1 : 0,
                        transition: 'opacity 0.8s ease-in-out',
                        backgroundImage: `url(${slide.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center',
                        color: slide.textColor || '#ffffff',
                        padding: '15px',
                        cursor: slide.link && slide.link !== '#' ? 'pointer' : 'default',
                        margin: 0,
                        paddingTop: "0"
                      }}
                      onClick={() => slide.link && slide.link !== '#' && window.open(slide.link, '_blank')}
                    >
                      <div className="ad-content" style={{ 
                        maxWidth: '600px',
                        backgroundColor: 'rgba(0,0,0,0.3)',
                        padding: '20px',
                        borderRadius: '10px'
                      }}>
                        <h2 
                          className="fw-bold mb-2"
                          style={{ 
                            fontSize: isTouchDevice ? '20px' : '28px',
                            textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                          }}
                        >
                          {slide.title || 'Special Offer'}
                        </h2>
                        {slide.description && (
                          <p 
                            className="mb-3"
                            style={{ 
                              fontSize: isTouchDevice ? '14px' : '16px',
                              textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                            }}
                          >
                            {slide.description}
                          </p>
                        )}
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
                            if (slide.link && slide.link !== '#') {
                              window.open(slide.link, '_blank');
                            }
                          }}
                        >
                          {t.shopNow} <i className="fas fa-arrow-right ms-1"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Navigation Arrows */}
                {!isTouchDevice && adSlides.length > 1 && (
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
                {adSlides.length > 1 && (
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
                          cursor: 'pointer',
                          padding: 0
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <div className="container-fluid mb-5 px-2 px-lg-3" style={{ 
        paddingTop: isTouchDevice ? "10px" : "20px",
        paddingBottom: isTouchDevice ? "100px" : "20px"
      }}>
        <div className="row">
          {/* DESKTOP FILTERS */}
          <div className="col-lg-3 col-xl-2 d-none d-lg-block">
            <div className="card shadow-sm mb-3 sticky-top" style={{ top: "20px" }}>
              <div className="card-header bg-white">
                <h6 className="mb-0">
                  <i className="fas fa-filter me-2"></i>
                  {t.filter}
                  {Object.values(filters).some(f => f !== "" && f !== "all") && (
                    <button 
                      className="btn btn-sm btn-outline-danger float-end"
                      onClick={clearFilters}
                    >
                      {t.clearAll}
                    </button>
                  )}
                </h6>
              </div>
              <div className="card-body" style={{ maxHeight: "calc(100vh - 150px)", overflowY: "auto" }}>
                
                <div className="mb-3">
                  <label className="form-label fw-bold">{t.category}</label>
                  <select 
                    className="form-select form-select-sm"
                    value={filters.category}
                    onChange={(e) => handleFilterChange("category", e.target.value)}
                  >
                    <option value="">{t.allCategories}</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">{t.priceRange}</label>
                  <select 
                    className="form-select form-select-sm"
                    value={filters.priceRange}
                    onChange={(e) => handleFilterChange("priceRange", e.target.value)}
                  >
                    <option value="all">{t.allPrices}</option>
                    <option value="under_100k">{t.under100k}</option>
                    <option value="100k_500k">100,000 - 500,000 TZS</option>
                    <option value="500k_1m">500,000 - 1,000,000 TZS</option>
                    <option value="1m_5m">1M - 5M TZS</option>
                    <option value="over_5m">Over 5M TZS</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">{t.stockStatus}</label>
                  <select 
                    className="form-select form-select-sm"
                    value={filters.stockStatus}
                    onChange={(e) => handleFilterChange("stockStatus", e.target.value)}
                  >
                    <option value="all">{t.allStatus}</option>
                    <option value="Available">{t.available}</option>
                    <option value="Limited">{t.limited}</option>
                    <option value="Out of Stock">{t.outOfStock}</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">{t.sortBy}</label>
                  <select 
                    className="form-select form-select-sm"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="newest">{t.newest}</option>
                    <option value="price_low">{t.priceLow}</option>
                    <option value="price_high">{t.priceHigh}</option>
                    <option value="name">{t.name}</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">{t.language}</label>
                  <div className="btn-group w-100">
                    <button 
                      className={`btn btn-sm ${language === 'sw' ? 'btn-danger' : 'btn-outline-secondary'}`}
                      onClick={() => handleLanguageChange('sw')}
                    >
                      {t.swahili}
                    </button>
                    <button 
                      className={`btn btn-sm ${language === 'en' ? 'btn-danger' : 'btn-outline-secondary'}`}
                      onClick={() => handleLanguageChange('en')}
                    >
                      {t.english}
                    </button>
                  </div>
                </div>

                <div className="alert alert-light border">
                  <small>
                    <i className="fas fa-info-circle me-1"></i>
                    {t.showing} {filteredSellers.length} {t.of} {sellers.length} {t.products}
                  </small>
                </div>
              </div>
            </div>
          </div>

          {/* PRODUCTS GRID */}
          <div className="col-lg-9 col-xl-10 px-0 px-md-3" style={{ marginTop: isTouchDevice ? "10px" : "20px" }}>
            {!isSearching && (
              <div className="d-lg-none mb-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <h5 className="mb-0" style={{ fontSize: "16px" }}>
                      {t.products} ({filteredSellers.length})
                    </h5>
                    <small className="text-muted">{t.tapToView}</small>
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
            )}

            {isSearching && (
              <div className="d-flex justify-content-between align-items-center mb-3 px-2">
                <div>
                  <h5 className="mb-0" style={{ fontSize: "16px" }}>
                    {t.searchResults} ({filteredSellers.length})
                  </h5>
                  <small className="text-muted">
                    {t.searchFor} "<strong>{searchTerm}</strong>"
                  </small>
                </div>
                <button 
                  className="btn btn-sm btn-outline-danger"
                  onClick={handleClearSearch}
                  style={{ fontSize: "12px" }}
                >
                  <i className="fas fa-times me-1"></i>
                  {language === 'sw' ? 'Futa Utafutaji' : 'Clear Search'}
                </button>
              </div>
            )}

            {/* PRODUCTS LIST */}
            {filteredSellers.length === 0 ? (
              <div className="text-center py-5">
                {isSearching ? (
                  <>
                    <i className="fas fa-search fa-3x text-muted mb-3"></i>
                    <h5 className="text-muted">
                      {language === 'sw' ? 'Hakuna matokeo kwa "' : 'No results for "'}{searchTerm}"
                    </h5>
                    <p className="text-muted mb-4">
                      {language === 'sw' ? 'Badilisha maneno ya utafutaji' : 'Try different search terms'}
                    </p>
                  </>
                ) : (
                  <>
                    <i className="fas fa-search fa-3x text-muted mb-3"></i>
                    <h5 className="text-muted">{t.noProducts}</h5>
                    <p className="text-muted mb-4">
                      {language === 'sw' 
                        ? 'Hakuna bidhaa zilizopatikana. Kuwa wa kwanza kutangaza!' 
                        : 'No products found. Be the first to list!'}
                    </p>
                  </>
                )}
                <button 
                  className="btn btn-danger"
                  onClick={clearFilters}
                >
                  {t.clearFilters}
                </button>
              </div>
            ) : (
              <div className="row g-2 g-lg-3 mx-0">
                {filteredSellers.map((seller, index) => {
                  // DESKTOP VIEW - 3 COLUMNS
                  if (window.innerWidth >= 992) {
                    return (
                      <div key={seller.id || index} className="col-lg-4 col-md-6 px-2 mb-3">
                        <div 
                          className="card h-100 border-0 shadow-sm product-card"
                          style={{ 
                            borderRadius: "15px",
                            overflow: "hidden",
                            touchAction: "manipulation",
                            border: "1px solid #e0e0e0",
                            background: "#fff",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            height: "420px"
                          }}
                          onClick={() => handleProductClick(seller)}
                        >
                          <div style={{ 
                            height: "200px",
                            overflow: "hidden",
                            backgroundColor: "#f8f9fa",
                            position: "relative"
                          }}>
                            <img 
                              src={getOptimizedImage((seller.product_images || seller.productImages)?.[0])} 
                              className="w-100 h-100"
                              loading="lazy"
                              alt={seller.product_name || seller.productName || 'Product'}
                              style={{ objectFit: "cover" }}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://images.unsplash.com/photo-1556656793-08538906a9f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
                              }}
                            />
                            <div className="position-absolute top-0 start-0 m-2">
                              <span className={`badge bg-${getStockBadgeColor(seller.stockStatus)}`}>
                                {seller.stockStatus === "Limited" ? t.limited : seller.stockStatus === "Available" ? t.available : seller.stockStatus}
                              </span>
                            </div>
                          </div>

                          <div className="card-body p-3 d-flex flex-column">
                            <h6 className="card-title mb-2" style={{ 
                              fontSize: "15px",
                              fontWeight: "600",
                              height: "44px",
                              overflow: "hidden",
                              display: "-webkit-box",
                              WebkitLineClamp: "2",
                              WebkitBoxOrient: "vertical",
                              lineHeight: "1.4"
                            }}>
                              {seller.product_name || seller.productName || 'Product'}
                            </h6>
                            
                            <div className="mb-2">
                              <span className="text-danger fw-bold" style={{ fontSize: "18px" }}>
                                {formatPrice(seller.price)}
                              </span>
                            </div>

                            <div className="d-flex align-items-center mb-2">
                              <small className="text-truncate" style={{ fontSize: "13px", color: "#666" }}>
                                <i className="fas fa-store me-1"></i>
                                {(seller.shop_name || seller.shopName)?.substring(0, 25) || t.shop}
                              </small>
                            </div>

                            <div className="mt-auto">
                              <div className="d-flex gap-2">
                                <button 
                                  className="btn btn-sm btn-outline-danger flex-fill"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleProductClick(seller);
                                  }}
                                  style={{ fontSize: "13px", padding: "6px 8px" }}
                                >
                                  {language === 'sw' ? 'Angalia' : 'View'}
                                </button>
                                <button 
                                  className="btn btn-sm btn-success"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleWhatsApp(seller.phone_number || seller.phoneNumber, seller.product_name || seller.productName);
                                  }}
                                  style={{ padding: "6px 10px" }}
                                  title="WhatsApp"
                                >
                                  <i className="fab fa-whatsapp"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  } else {
                    // MOBILE VIEW - 2 COLUMNS
                    return (
                      <div key={seller.id || index} className="col-6 col-sm-6 px-1 mb-2">
                        <div 
                          className="card h-100 border-0 shadow-sm product-card"
                          style={{ 
                            borderRadius: "12px",
                            overflow: "hidden",
                            touchAction: "manipulation",
                            border: "1px solid rgba(0,0,0,0.08)",
                            background: "#fff",
                            boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
                            cursor: "pointer"
                          }}
                          onClick={() => handleProductClick(seller)}
                        >
                          <div style={{ 
                            height: "140px", 
                            overflow: "hidden",
                            backgroundColor: "#f8f9fa",
                            position: "relative"
                          }}>
                            <img 
                              src={getOptimizedImage((seller.product_images || seller.productImages)?.[0])} 
                              className="w-100 h-100"
                              loading="lazy"
                              alt={seller.product_name || seller.productName || 'Product'}
                              style={{ objectFit: "cover" }}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://images.unsplash.com/photo-1556656793-08538906a9f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
                              }}
                            />
                            <div className="position-absolute top-0 start-0 m-1">
                              <span className={`badge bg-${getStockBadgeColor(seller.stockStatus)}`} style={{ fontSize: "10px" }}>
                                {seller.stockStatus === "Limited" ? t.limited : seller.stockStatus === "Available" ? t.available : seller.stockStatus}
                              </span>
                            </div>
                          </div>

                          <div className="card-body p-2">
                            <h6 className="card-title mb-1" style={{ 
                              fontSize: "12px",
                              fontWeight: "600",
                              height: "32px",
                              overflow: "hidden",
                              display: "-webkit-box",
                              WebkitLineClamp: "2",
                              WebkitBoxOrient: "vertical",
                              lineHeight: "1.3"
                            }}>
                              {seller.product_name || seller.productName || 'Product'}
                            </h6>
                            
                            <div className="mb-1">
                              <span className="text-danger fw-bold" style={{ fontSize: "13px" }}>
                                {formatPrice(seller.price)}
                              </span>
                            </div>

                            <div className="d-flex align-items-center mt-1">
                              <small className="text-truncate" style={{ fontSize: "10px", color: "#666" }}>
                                <i className="fas fa-store me-1"></i>
                                {seller.shopName?.substring(0, 12) || t.shop}
                              </small>
                            </div>
                            
                            <div className="mt-2">
                              <button 
                                className="btn btn-sm btn-outline-danger w-100"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleProductClick(seller);
                                }}
                                style={{ fontSize: "11px", padding: "4px 6px" }}
                              >
                                <i className="fas fa-eye me-1"></i>
                                {language === 'sw' ? 'Angalia' : 'View'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE BOTTOM NAVIGATION */}
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
                    alignItems: "center",
                    cursor: "pointer"
                  }}
                >
                  <i className="fas fa-home" style={{ fontSize: "18px", color: "#666" }}></i>
                  <small style={{ fontSize: "10px", color: "#666" }}>{t.home}</small>
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
                    alignItems: "center",
                    cursor: "pointer"
                  }}
                >
                  <i className="fas fa-box" style={{ fontSize: "18px", color: "#666" }}></i>
                  <small style={{ fontSize: "10px", color: "#666" }}>{t.products}</small>
                </button>
              </div>
              
              {/* Add New - FIXED BUTTON */}
              <div className="col text-center">
                <button 
                  className="btn btn-link text-decoration-none"
                  onClick={handleAddProductClick}
                  style={{ 
                    padding: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    cursor: "pointer"
                  }}
                >
                  <div className="rounded-circle bg-danger text-white d-flex align-items-center justify-content-center mx-auto mb-1" 
                       style={{ width: "36px", height: "36px", marginTop: "-10px" }}>
                    <i className="fas fa-plus" style={{ fontSize: "18px" }}></i>
                  </div>
                  <small style={{ fontSize: "10px", color: "#FF6B6B", fontWeight: "bold", marginTop: "-5px" }}>
                    {t.addProduct}
                  </small>
                </button>
              </div>
              
              {/* Shops */}
              <div className="col text-center">
                <button 
                  className="btn btn-link text-decoration-none"
                  onClick={handleShopsClick}
                  style={{ 
                    padding: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    cursor: "pointer"
                  }}
                >
                  <i className="fas fa-store" style={{ fontSize: "18px", color: "#666" }}></i>
                  <small style={{ fontSize: "10px", color: "#666" }}>{t.shopsNav}</small>
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
                    alignItems: "center",
                    cursor: "pointer"
                  }}
                >
                  <div className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-1 overflow-hidden" 
                       style={{ width: "30px", height: "30px", border: user ? "2px solid #FF6B6B" : "2px solid #ddd" }}>
                    {user && getProfilePictureUrl() ? (
                      <img src={getProfilePictureUrl()} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} referrerPolicy="no-referrer" crossOrigin="anonymous" />
                    ) : user ? (
                      <span style={{ width: "100%", height: "100%", backgroundColor: "#dc3545", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "12px" }}>
                        {getUserInitial()}
                      </span>
                    ) : (
                      <i className="fas fa-user" style={{ fontSize: "12px", color: "#666" }}></i>
                    )}
                  </div>
                  <small style={{ fontSize: "10px", color: user ? "#FF6B6B" : "#666", fontWeight: user ? "bold" : "normal" }}>
                    {t.account}
                  </small>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DESKTOP FOOTER */}
      {!isTouchDevice && (
        <footer className="bg-dark text-white py-4 mt-5">
          <div className="container">
            <div className="row">
              <div className="col-md-4 mb-3">
                <h5 className="mb-3" style={{ fontSize: "16px" }}>
                  <i className="fas fa-shopping-cart me-2"></i>
                  {t.appName} Marketplace
                </h5>
                <p className="text-light small" style={{ fontSize: "13px" }}>
                  {language === 'sw' 
                    ? "Pata kila unachohitaji kutoka kwa wauzaji wa kujiamini kote Tanzania." 
                    : "Find everything you need from trusted local sellers across Tanzania."}
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
                © {new Date().getFullYear()} {t.appName} Marketplace. All rights reserved.
              </small>
            </div>
          </div>
        </footer>
      )}

      {/* MOBILE MENU OVERLAY */}
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
              <div className="text-center mb-4">
                <div 
                  className="rounded-circle bg-danger text-white d-inline-flex align-items-center justify-content-center overflow-hidden mb-3" 
                  style={{ width: "80px", height: "80px", cursor: "pointer" }}
                  onClick={handleProfilePictureClick}
                >
                  {user ? (
                    <>
                      {getProfilePictureUrl() ? (
                        <img 
                          src={getProfilePictureUrl()} 
                          alt={user?.name || "Profile"}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover"
                          }}
                          referrerPolicy="no-referrer"
                          crossOrigin="anonymous"
                          onError={(e) => {
                            const initial = getUserInitial();
                            e.target.onerror = null;
                            e.target.style.display = 'none';
                            e.target.parentElement.style.backgroundColor = "#dc3545";
                            e.target.parentElement.innerHTML = `<span style="font-size: 32px; font-weight: bold;">${initial}</span>`;
                          }}
                        />
                      ) : (
                        <span style={{ fontSize: "32px", fontWeight: "bold" }}>
                          {getUserInitial()}
                        </span>
                      )}
                    </>
                  ) : (
                    <i className="fas fa-user fa-2x"></i>
                  )}
                </div>
                {user ? (
                  <>
                    <h6 className="fw-bold mb-1">{user?.name || user?.displayName || user?.email?.split('@')[0] || "Seller"}</h6>
                    <p className="text-muted small mb-3">{user?.email || "My Shop"}</p>
                  </>
                ) : (
                  <>
                    <h6 className="fw-bold mb-1">{t.welcome}</h6>
                    <p className="text-muted small mb-3">{t.signInToSell}</p>
                  </>
                )}
              </div>
              
              <div className="list-group list-group-flush">
                {user ? (
                  <>
                    <button 
                      className="list-group-item list-group-item-action border-0 py-3"
                      onClick={handleMyProductsClick}
                    >
                      <i className="fas fa-box me-3 text-danger"></i>
                      {t.myProducts}
                    </button>
                    <button 
                      className="list-group-item list-group-item-action border-0 py-3"
                      onClick={handleAddProductClick}
                    >
                      <i className="fas fa-plus-circle me-3 text-danger"></i>
                      {t.addProduct}
                    </button>
                    <button 
                      className="list-group-item list-group-item-action border-0 py-3"
                      onClick={handleProductsClick}
                    >
                      <i className="fas fa-store me-3 text-danger"></i>
                      {t.browseProducts}
                    </button>
                    <button 
                      className="list-group-item list-group-item-action border-0 py-3"
                      onClick={handleShopsClick}
                    >
                      <i className="fas fa-store-alt me-3 text-danger"></i>
                      {t.shopsNav}
                    </button>
                    <button 
                      className="list-group-item list-group-item-action border-0 py-3 text-danger"
                      onClick={handleLogout}
                    >
                      <i className="fas fa-sign-out-alt me-3"></i>
                      {t.logout}
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      className="list-group-item list-group-item-action border-0 py-3"
                      onClick={handleLoginClick}
                    >
                      <i className="fas fa-sign-in-alt me-3 text-danger"></i>
                      {t.signIn}
                    </button>
                    <button 
                      className="list-group-item list-group-item-action border-0 py-3"
                      onClick={handleRegisterClick}
                    >
                      <i className="fas fa-user-plus me-3 text-danger"></i>
                      {t.signUp}
                    </button>
                    <button 
                      className="list-group-item list-group-item-action border-0 py-3"
                      onClick={handleProductsClick}
                    >
                      <i className="fas fa-store me-3 text-danger"></i>
                      {t.browseProducts}
                    </button>
                    <button 
                      className="list-group-item list-group-item-action border-0 py-3"
                      onClick={handleShopsClick}
                    >
                      <i className="fas fa-store-alt me-3 text-danger"></i>
                      {t.shopsNav}
                    </button>
                  </>
                )}
              </div>
              
              <div className="mt-4 pt-3 border-top">
                <small className="text-muted d-block mb-2">{t.help}</small>
                <button className="btn btn-outline-secondary btn-sm w-100">
                  <i className="fas fa-question-circle me-2"></i>
                  {t.helpCenter}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* MOBILE LANGUAGE SELECTOR */}
      {showLanguageSelector && (
        <>
          <div 
            className="mobile-backdrop show"
            onClick={() => setShowLanguageSelector(false)}
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
            className="mobile-language-selector"
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
            <div className="p-3 border-bottom bg-primary text-white">
              <div className="d-flex justify-content-between align-items-center">
                <h6 className="mb-0 fw-bold">
                  <i className="fas fa-globe me-2"></i>
                  {t.selectLanguage}
                </h6>
                <button 
                  className="btn btn-sm btn-light"
                  onClick={() => setShowLanguageSelector(false)}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
            
            <div className="p-3">
              <div className="list-group list-group-flush">
                {worldLanguages.map((lang) => (
                  <button 
                    key={lang.code}
                    className={`list-group-item list-group-item-action border-0 py-3 ${language === lang.code ? 'active' : ''}`}
                    onClick={() => {
                      console.log("🌐 Mobile language selector - changing to:", lang.code);
                      handleLanguageChange(lang.code);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      backgroundColor: language === lang.code ? "#f8f9fa" : "transparent",
                      borderLeft: language === lang.code ? "4px solid #FF6B6B" : "none"
                    }}
                  >
                    <div className="d-flex align-items-center">
                      <span className="me-3" style={{ fontSize: "20px" }}>{lang.flag}</span>
                      <div className="text-start">
                        <div className="fw-medium">{lang.name}</div>
                        <small className="text-muted">{lang.code.toUpperCase()}</small>
                      </div>
                    </div>
                    {language === lang.code && (
                      <i className="fas fa-check text-danger"></i>
                    )}
                  </button>
                ))}
              </div>
              
              <div className="mt-4 pt-3 border-top">
                <div className="alert alert-info">
                  <small>
                    <i className="fas fa-info-circle me-1"></i>
                    {language === 'sw' 
                      ? 'Lugha itatumika kwa maonyesho yote ya mtandao' 
                      : 'Language will be used for all website displays'}
                  </small>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* MOBILE FILTERS OVERLAY */}
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
                  {t.filter}
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
                <label className="form-label fw-bold">{t.category}</label>
                <select 
                  className="form-select"
                  value={filters.category}
                  onChange={(e) => handleFilterChange("category", e.target.value)}
                >
                  <option value="">{t.allCategories}</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <div className="mb-3">
                <label className="form-label fw-bold">{t.priceRange}</label>
                <select 
                  className="form-select"
                  value={filters.priceRange}
                  onChange={(e) => handleFilterChange("priceRange", e.target.value)}
                >
                  <option value="all">{t.allPrices}</option>
                  <option value="under_100k">{t.under100k}</option>
                  <option value="100k_500k">100k - 500k TZS</option>
                  <option value="500k_1m">500k - 1M TZS</option>
                  <option value="1m_5m">1M - 5M TZS</option>
                  <option value="over_5m">Over 5M TZS</option>
                </select>
              </div>
              
              <div className="mb-3">
                <label className="form-label fw-bold">{t.stockStatus}</label>
                <select 
                  className="form-select"
                  value={filters.stockStatus}
                  onChange={(e) => handleFilterChange("stockStatus", e.target.value)}
                >
                  <option value="all">{t.allStatus}</option>
                  <option value="Available">{t.available}</option>
                  <option value="Limited">{t.limited}</option>
                  <option value="Out of Stock">{t.outOfStock}</option>
                </select>
              </div>
              
              <div className="mb-3">
                <label className="form-label fw-bold">{t.sortBy}</label>
                <select 
                  className="form-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">{t.newest}</option>
                  <option value="price_low">{t.priceLow}</option>
                  <option value="price_high">{t.priceHigh}</option>
                  <option value="name">{t.name}</option>
                </select>
              </div>
              
              <div className="mt-4 pt-3 border-top">
                <div className="d-grid gap-2">
                  <button 
                    className="btn btn-danger"
                    onClick={() => setShowMobileFilters(false)}
                  >
                    {language === 'sw' ? 'Tumia Michujo' : 'Apply Filters'}
                  </button>
                  <button 
                    className="btn btn-outline-danger"
                    onClick={clearFilters}
                  >
                    {t.clearAll}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @keyframes pulse {
            0% { opacity: 0.6; }
            50% { opacity: 1; }
            100% { opacity: 0.6; }
          }
          
          .search-input-wrapper {
            position: relative;
            width: 100%;
            height: 40px;
            display: flex;
            align-items: center;
            border-radius: 0;
            background-color: transparent;
            border: none;
            padding: 0;
            transition: all 0.3s ease;
          }
          .search-input-wrapper.focused {
            border-radius: 25px !important;
            background-color: rgba(0,0,0,0.1) !important;
            padding: 0 16px !important;
            box-shadow: inset 0 0 0 1px rgba(0,0,0,0.1) !important;
          }
          .search-input-initial {
            flex: 1;
            border: none;
            outline: none;
            background-color: transparent;
            font-size: 14px;
            color: inherit;
            padding: 8px 0;
            width: 100%;
            height: 100%;
          }
          .search-input-wrapper input::placeholder {
            color: inherit;
            opacity: 0.7;
          }
          .search-container {
            position: relative;
            width: 100%;
          }
          .search-suggestions-dropdown {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            z-index: 1001;
            max-height: 400px;
            overflow-y: auto;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            border-radius: 8px;
            background-color: #ffffff;
            margin-top: 5px;
          }
          .suggestion-item {
            cursor: pointer;
            transition: all 0.2s;
          }
          .suggestion-item:hover {
            background-color: #f8f9fa;
          }
          .btn-mobile {
            min-height: 44px;
            min-width: 44px;
            padding: 12px 16px;
          }
          .card {
            cursor: pointer;
            user-select: none;
            -webkit-tap-highlight-color: transparent;
          }
          @keyframes slideInLeft {
            from { transform: translateX(-100%); }
            to { transform: translateX(0); }
          }
          @keyframes fadeIn {
            from { opacity: 0.4; }
            to { opacity: 1; }
          }
          .ad-slide.active {
            animation: fadeIn 0.8s ease-in-out;
          }
          @media (max-width: 768px) {
            .ad-carousel-inner {
              height: 200px !important;
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
            .search-input-wrapper {
              height: 36px !important;
            }
            .search-input-wrapper.focused {
              padding: 0 12px !important;
            }
            .navbar-brand {
              font-size: 15px !important;
            }
            .fixed-bottom .row .col {
              padding-left: 0 !important;
              padding-right: 0 !important;
            }
            .fixed-bottom .btn {
              width: 100%;
            }
          }
          @media (min-width: 992px) {
            .ad-carousel-inner {
              height: 200px !important;
            }
            .ad-carousel-container {
              margin: 0;
              border-radius: 0;
              overflow: hidden;
              box-shadow: none;
            }
          }
          .navbar {
            transition: background-color 0.8s ease-in-out, color 0.8s ease-in-out;
          }
          .mobile-language-selector {
            position: fixed;
            top: 0;
            left: 0;
            width: 280px;
            height: 100%;
            background: white;
            z-index: 1000;
            box-shadow: 2px 0 10px rgba(0,0,0,0.1);
            overflow-y: auto;
            animation: slideInLeft 0.3s ease;
          }
          .mobile-language-selector .list-group-item.active {
            background-color: rgba(255, 107, 107, 0.1);
            border-left: 4px solid #FF6B6B;
          }
          .mobile-language-selector .list-group-item:hover {
            background-color: #f8f9fa;
          }
          @media (max-width: 991px) {
            .search-suggestions-dropdown {
              position: fixed !important;
              top: 120px !important;
              left: 15px !important;
              right: 15px !important;
              width: auto !important;
              max-height: 60vh;
            }
          }
          @media (min-width: 992px) {
            .search-suggestions-dropdown {
              position: absolute !important;
              top: 100% !important;
              left: 0 !important;
              right: 0 !important;
              width: 100% !important;
            }
          }
          .fixed-bottom .btn-link {
            cursor: pointer !important;
          }
          .fixed-bottom .btn-link:hover {
            opacity: 0.8;
          }
          .btn-danger {
            background: linear-gradient(135deg, #FF6B6B, #FF8E53);
            border: none;
          }
          .btn-danger:hover {
            background: linear-gradient(135deg, #FF8E53, #FF6B6B);
          }
          html, body {
            max-width: 100%;
            overflow-x: hidden;
          }
          input, select, textarea {
            font-size: 16px !important;
          }
          
          /* 🔥 MOBILE SUGGESTIONS FIXES */
          @media (max-width: 991px) {
            .search-suggestions-dropdown {
              position: fixed !important;
              top: 70px !important;
              left: 10px !important;
              right: 10px !important;
              width: auto !important;
              max-height: 60vh !important;
              z-index: 10000 !important;
              box-shadow: 0 10px 30px rgba(0,0,0,0.2) !important;
              border-radius: 16px !important;
            }
            
            .suggestion-item {
              min-height: 60px !important;
              padding: 15px 20px !important;
              font-size: 16px !important;
              -webkit-tap-highlight-color: transparent !important;
            }
            
            .suggestion-item:active {
              background-color: #f0f0f0 !important;
            }
          }

          /* 🔥 PREVENT TEXT SELECTION ON TAP */
          .suggestion-item {
            user-select: none;
            -webkit-user-select: none;
            -webkit-touch-callout: none;
          }
        `}
      </style>
    </div>
  );
}

export default PublicSellersDashboard;