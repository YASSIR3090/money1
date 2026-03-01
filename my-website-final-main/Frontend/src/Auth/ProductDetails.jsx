// src/Auth/ProductDetails.jsx - COMPLETE FIXED VERSION 🔥
// ✅ ADD PRODUCT - Registered user goes directly to VendorRegister
// ✅ NEW USER - Goes to VendorLogin first
// ✅ WhatsApp: Opens directly with seller's number, ready to type message
// ✅ Email: Opens default email app (mailto:) - works on mobile & desktop

import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import apiClient from "../api/apiClient";

function ProductDetails() {
  const { productId } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [zoom, setZoom] = useState(false);
  
  // ✅ STATES FROM PublicSellersDashboard - EXACT SAME
  const [sellers, setSellers] = useState([]);
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
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("newest");
  
  // ✅ MOBILE STATES - EXACT SAME
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  
  // ✅ SEARCH STATES - EXACT SAME
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchInputFocused, setIsSearchInputFocused] = useState(false);
  
  // ✅ LANGUAGE STATE - with fallback and cross-domain support
  const [language, setLanguage] = useState(() => {
    try {
      // Try multiple storage locations
      const locations = [
        () => localStorage.getItem('availoLanguage'),
        () => sessionStorage.getItem('availoLanguage_backup'),
        () => {
          const urlParams = new URLSearchParams(window.location.search);
          return urlParams.get('lang');
        }
      ];
      
      for (const getter of locations) {
        const value = getter();
        if (value) {
          console.log("🌐 Found language:", value);
          return value;
        }
      }
    } catch (error) {
      console.error("Error reading language:", error);
    }
    return "sw";
  });
  
  // ✅ AUTH STATES
  const { user, getUserProfilePicture, logout: authLogout, isVendorRegistered } = useAuth();
  
  // ✅ NAV COLOR STATE - Default color
  const [navBarColor, setNavBarColor] = useState("#FF6B6B");
  const [textColor, setTextColor] = useState("#ffffff");

  // ✅ TRANSLATIONS - EXACT SAME AS PublicSellersDashboard
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
      productDetails: "Maelezo ya Bidhaa",
      brand: "Chapa",
      condition: "Hali",
      warranty: "Dhamana",
      shipping: "Usafirishaji",
      features: "Vipengele",
      sellerInfo: "Maelezo ya Muuza",
      relatedProducts: "Bidhaa Zinazohusiana",
      viewAll: "Angalia Zote",
      share: "Shiriki",
      report: "Ripoti",
      save: "Hifadhi",
      contact: "Wasiliana",
      description: "Maelezo",
      phone: "Simu",
      email: "Barua Pepe",
      shopImage: "Picha ya Duka",
      productImages: "Picha za Bidhaa",
      inStock: "Ipo",
      limitedStock: "Chache Zimebaki",
      negotiable: "Inajadilika",
      fixed: "Bei Maalum",
      emailSubject: "Swali kuhusu bidhaa yako",
      emailBody: "Habari,\n\nNina nia ya kununua bidhaa yako.\n\nJina la Bidhaa: {productName}\nBei: {price}\n\nTafadhali niambie kama bado ipo na taarifa zaidi.\n\nAsante,\n{userName}\n{userEmail}"
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
      productDetails: "Product Details",
      brand: "Brand",
      condition: "Condition",
      warranty: "Warranty",
      shipping: "Shipping",
      features: "Features",
      sellerInfo: "Seller Information",
      relatedProducts: "Related Products",
      viewAll: "View All",
      share: "Share",
      report: "Report",
      save: "Save",
      contact: "Contact",
      description: "Description",
      phone: "Phone",
      email: "Email",
      shopImage: "Shop Image",
      productImages: "Product Images",
      inStock: "In Stock",
      limitedStock: "Limited Stock",
      negotiable: "Negotiable",
      fixed: "Fixed Price",
      emailSubject: "Question about your product",
      emailBody: "Hello,\n\nI am interested in purchasing your product.\n\nProduct Name: {productName}\nPrice: {price}\n\nPlease let me know if it's still available and any additional information.\n\nThank you,\n{userName}\n{userEmail}"
    }
  };

  // ✅ FIXED: SAFE translation access with fallback
  const t = translations[language] || translations.sw;

  // ✅ PROFILE PICTURE COMPONENT (Reusable - NO CORS ERRORS)
  const ProfileImage = ({ size = 35, showBorder = false }) => {
    const profileUrl = getUserProfilePicture();
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

    // Default: Show initial or icon
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

  // ✅ GET NAV TEXT COLOR - EXACT SAME AS PublicSellersDashboard
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

  // ✅ FIXED: Mobile detection - ALWAYS SHOWS BOTTOM NAV ON SMALL SCREENS
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth <= 991 || 
                            'ontouchstart' in window || 
                            navigator.maxTouchPoints > 0;
      setIsMobile(isMobileDevice);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    window.addEventListener('orientationchange', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('orientationchange', checkMobile);
    };
  }, []);

  // ✅ ✅ ✅ CRITICAL FIX: Load sellers from ALL storage locations
  const loadAllSellers = () => {
    try {
      let allSellers = [];
      
      // 1️⃣ Try localStorage first (current domain)
      const localData = localStorage.getItem('allSellersData');
      if (localData) {
        try {
          allSellers = JSON.parse(localData);
          console.log(`✅ Loaded ${allSellers.length} sellers from localStorage`);
        } catch(e) {
          console.error("Error parsing localStorage data:", e);
        }
      }
      
      // 2️⃣ Try sessionStorage backup
      if (allSellers.length === 0) {
        const sessionData = sessionStorage.getItem('allSellersData_backup');
        if (sessionData) {
          try {
            allSellers = JSON.parse(sessionData);
            console.log(`✅ Loaded ${allSellers.length} sellers from sessionStorage backup`);
            // Save to localStorage for next time
            localStorage.setItem('allSellersData', sessionData);
          } catch(e) {}
        }
      }
      
      // 3️⃣ Try production backup (for availo.co.tz)
      if (allSellers.length === 0) {
        const prodData = sessionStorage.getItem('prod_allSellersData');
        if (prodData) {
          try {
            allSellers = JSON.parse(prodData);
            console.log(`✅ Loaded ${allSellers.length} sellers from production backup`);
            localStorage.setItem('allSellersData', prodData);
          } catch(e) {}
        }
      }
      
      // 4️⃣ Check for broadcast data
      const broadcastData = sessionStorage.getItem('broadcast_products');
      if (broadcastData && allSellers.length === 0) {
        try {
          allSellers = JSON.parse(broadcastData);
          console.log(`✅ Loaded ${allSellers.length} sellers from broadcast`);
        } catch(e) {}
      }
      
      console.log("📦 ProductDetails: Loaded sellers:", allSellers.length);
      setSellers(allSellers);
      setFilteredSellers(allSellers);
      
    } catch (error) {
      console.error("❌ Error loading sellers:", error);
      setSellers([]);
      setFilteredSellers([]);
    }
  };

  // ✅ LOAD SELLERS: API first, localStorage fallback
  useEffect(() => {
    // Fetch from API on mount
    apiClient.get('/api/products/')
      .then(response => {
        let apiProducts = [];
        if (response.data?.results && Array.isArray(response.data.results)) {
          apiProducts = response.data.results;
        } else if (Array.isArray(response.data)) {
          apiProducts = response.data;
        }
        if (apiProducts.length > 0) {
          console.log(`✅ ProductDetails: Loaded ${apiProducts.length} products from API`);
          setSellers(apiProducts);
          setFilteredSellers(apiProducts);
          // Cache for offline
          localStorage.setItem('allSellersData', JSON.stringify(apiProducts));
        } else {
          loadAllSellers(); // fallback
        }
      })
      .catch(() => {
        console.warn("⚠️ API unavailable, falling back to localStorage");
        loadAllSellers();
      });
    loadAllSellers();
    
    // Listen for storage changes (other tabs)
    const handleStorageChange = (e) => {
      if (e.key === 'allSellersData' || e.key === null) {
        console.log("🔄 Storage changed, reloading sellers...");
        loadAllSellers();
        // Reload product details if we're on a product page
        if (productId) {
          loadProductDetails();
        }
      }
    };
    
    // Listen for broadcast messages
    const handleBroadcast = (e) => {
      if (e.data?.type === 'PRODUCTS_UPDATE' || e.data?.type === 'LOGIN') {
        console.log("📢 Broadcast received, reloading sellers...");
        loadAllSellers();
        if (productId) {
          loadProductDetails();
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    let channel;
    try {
      channel = new BroadcastChannel('availo_sync');
      channel.addEventListener('message', handleBroadcast);
    } catch(e) {}
    
    // Auto-refresh every 30 seconds for cross-domain sync
    const interval = setInterval(() => {
      loadAllSellers();
      if (productId) {
        loadProductDetails();
      }
    }, 30000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      if (channel) {
        channel.removeEventListener('message', handleBroadcast);
        channel.close();
      }
      clearInterval(interval);
    };
  }, []);

  // ✅ LOAD PRODUCT DETAILS
  useEffect(() => {
    loadProductDetails();
    
    const savedLanguage = localStorage.getItem('availoLanguage') || 'sw';
    setLanguage(savedLanguage);
    
    setNavBarColor("#FF6B6B");
    setTextColor(getNavTextColor("#FF6B6B"));
    
  }, [productId, sellers]);

  // ✅ SEARCH FUNCTIONS - EXACT SAME AS PublicSellersDashboard
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
      .filter(seller => seller.brand?.toLowerCase().includes(term))
      .map(seller => ({
        type: "brand",
        text: seller.brand,
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

  const getSuggestionTypeText = (type) => {
    switch (type) {
      case "product": return language === 'sw' ? "Bidhaa" : "Product";
      case "category": return language === 'sw' ? "Kategoria" : "Category";
      case "brand": return language === 'sw' ? "Chapa" : "Brand";
      case "shop": return language === 'sw' ? "Duka" : "Shop";
      default: return "";
    }
  };

  // ✅ AUTH FUNCTIONS
  const getUserInitial = () => {
    if (!user) return "U";
    const name = user.name || user.displayName || user.email?.split('@')[0] || "User";
    if (name && name.length > 0) return name.charAt(0).toUpperCase();
    return "U";
  };

  const getProfilePictureUrl = () => {
    return getUserProfilePicture();
  };

  // ✅ NAVIGATION HANDLERS - EXACT SAME AS PublicSellersDashboard
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

  // ✅ FIXED: BOTTOM NAVIGATION HANDLERS - ALL WORKING
  const handleHomeClick = () => navigate('/');
  const handleProductsClick = () => navigate('/products');
  const handleShopsClick = () => navigate('/shops');
  
  // ✅ FIXED: Add Product button - CORRECT LOGIC!
  const handleAddProductClick = async () => {
    console.log("➕ Add Product clicked - User:", user?.email, "Logged in:", !!user);
    
    // CASE 1: HAKUNA USER - MPYA KABISA
    if (!user) {
      console.log("➡️ No user - NEW USER - Redirecting to login");
      navigate('/vendor-login', {
        state: {
          from: '/product/' + productId,
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
          message: "Please complete your vendor registration first",
          from: "/product/" + productId
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
          from: "/product/" + productId
        }
      });
    }
    
    setShowMobileMenu(false);
    setShowLanguageSelector(false);
  };
  
  const handleAccountClick = () => {
    if (user) {
      navigate('/seller-profile');
    } else {
      navigate('/vendor-login');
    }
    setShowMobileMenu(false);
    setShowLanguageSelector(false);
  };

  const handleProfilePictureClick = () => {
    if (user) {
      navigate('/seller-profile');
    } else {
      navigate('/vendor-login');
    }
    setShowMobileMenu(false);
    setShowLanguageSelector(false);
  };

  // ✅ FIXED: Language change handler - saves to multiple storages
  const handleLanguageChange = (lang) => {
    console.log("🌐 Language changing to:", lang);
    
    setLanguage(lang);
    
    // Save to ALL storage locations
    try {
      localStorage.setItem('availoLanguage', lang);
      sessionStorage.setItem('availoLanguage_backup', lang);
      console.log("✅ Language saved to all storages:", lang);
    } catch (error) {
      console.error("❌ Error saving language:", error);
    }
    
    setShowLanguageSelector(false);
  };

  // ✅ WORLD LANGUAGES - EXACT SAME
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

  // ✅ PRODUCT FUNCTIONS
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const [expandedSections, setExpandedSections] = useState({
    description: true,
    specifications: false,
    features: false,
    shipping: false,
    seller: false,
    related: true
  });

  // ✅ FIXED: Call function - Opens phone dialer
  const handleCall = () => {
    const phone = product?.phone_number || product?.phoneNumber;
    if (product && phone) {
      const phoneNumber = phone.startsWith('+') 
        ? phone 
        : `+${phone}`;
      window.location.href = `tel:${phoneNumber}`;
    } else {
      alert(language === 'sw' 
        ? 'Namba ya simu haipatikani' 
        : 'Phone number not available');
    }
  };

  // ✅ FIXED: WhatsApp function - Opens DIRECTLY with seller's WhatsApp number
  const handleWhatsApp = () => {
    if (product && (product.whatsappNumber || product.whatsapp_number)) {
      // Get WhatsApp number from either field
      let phoneNumber = product.whatsappNumber || product.whatsapp_number || '';
      
      // Clean phone number - remove all spaces
      phoneNumber = phoneNumber.replace(/\s+/g, '');
      
      // Ensure it has country code
      if (!phoneNumber.startsWith('+')) {
        if (phoneNumber.startsWith('0')) {
          phoneNumber = '255' + phoneNumber.substring(1);
        }
        phoneNumber = '+' + phoneNumber;
      }
      
      // Remove any non-digit characters for WhatsApp (except +)
      const whatsappNumber = phoneNumber.replace(/\D/g, '');
      
      // Create message based on language
      const message = language === 'sw'
        ? `Habari! Nina nia ya kununua *${product.product_name || product.productName || 'bidhaa'}*. Bei yako ni ${formatPrice(product.price)}. Bado ipo?`
        : `Hello! I'm interested in buying *${product.product_name || product.productName || 'product'}*. Your price is ${formatPrice(product.price)}. Is it still available?`;
      
      console.log("📱 Opening WhatsApp with number:", whatsappNumber);
      console.log("📱 Message:", message);
      
      // Open WhatsApp with the number and pre-filled message
      const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
    } else {
      alert(language === 'sw' 
        ? 'Namba ya WhatsApp haipatikani' 
        : 'WhatsApp number not available');
    }
  };

  // ✅ FIXED: Email function - Opens default email app (mailto:)
  const handleEmail = () => {
    if (product && product.email) {
      // This is the SELLER'S email
      const sellerEmail = product.email;
      
      console.log("📧 Seller email:", sellerEmail);
      console.log("📧 Viewer email:", user?.email);
      
      // Get viewer's name for the message body
      const viewerName = user?.name || user?.displayName || "Customer";
      const viewerEmail = user?.email || "";
      
      // Format the price
      const formattedPrice = formatPrice(product.price);
      
      // Get product name
      const productName = product.product_name || product.productName || 'product';
      
      // Create email subject
      const subject = language === 'sw'
        ? `Swali kuhusu ${productName}`
        : `Question about ${productName}`;
      
      // Create email body with pre-filled information
      const body = language === 'sw'
        ? `Habari,\n\nNina nia ya kununua bidhaa yako.\n\nJina la Bidhaa: ${productName}\nBei: ${formattedPrice}\n\nTafadhali niambie kama bado ipo na taarifa zaidi.\n\nAsante,\n${viewerName}\n${viewerEmail}`
        : `Hello,\n\nI am interested in purchasing your product.\n\nProduct Name: ${productName}\nPrice: ${formattedPrice}\n\nPlease let me know if it's still available and any additional information.\n\nThank you,\n${viewerName}\n${viewerEmail}`;
      
      // ✅ FIXED: Use mailto: protocol - works on ALL devices!
      // This opens the default email app (Gmail, Outlook, Mail app, etc.)
      const mailtoUrl = `mailto:${encodeURIComponent(sellerEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      
      console.log("📧 Opening email app with mailto:", mailtoUrl);
      
      // Open default email app
      window.location.href = mailtoUrl;
    } else {
      alert(language === 'sw' 
        ? 'Barua pepe ya muuzaji haipatikani' 
        : 'Seller email not available');
    }
  };

  // ✅ Share function
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.product_name || product.productName,
        text: product.description || `Angalia bidhaa hii: ${product.product_name || product.productName}`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert(language === 'sw' ? 'Link imenakiliwa!' : 'Link copied!');
    }
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

  const getStockText = (status) => {
    switch (status) {
      case "Available": return language === 'sw' ? 'Ipo' : 'In Stock';
      case "Limited": return language === 'sw' ? 'Chache Zimebaki' : 'Limited Stock';
      case "Out of Stock": return language === 'sw' ? 'Imeisha' : 'Out of Stock';
      default: return status;
    }
  };

  // ✅ LOAD PRODUCT FROM ALL STORAGES + API FALLBACK
  const loadProductDetails = async () => {
    setLoading(true);
    
    let foundProduct = null;
    
    if (sellers && sellers.length > 0) {
      foundProduct = sellers.find(item => item.id == productId);
    }
    
    if (!foundProduct) {
      try {
        const allSellers = JSON.parse(localStorage.getItem('allSellersData') || '[]');
        foundProduct = allSellers.find(item => item.id == productId);
      } catch (error) {
        console.error("Error loading from localStorage:", error);
      }
    }
    
    if (!foundProduct) {
      try {
        const sessionSellers = sessionStorage.getItem('allSellersData_backup');
        if (sessionSellers) {
          const allSellers = JSON.parse(sessionSellers);
          foundProduct = allSellers.find(item => item.id == productId);
        }
      } catch (error) {
        console.error("Error loading from sessionStorage:", error);
      }
    }
    
    if (!foundProduct) {
      try {
        const prodSellers = sessionStorage.getItem('prod_allSellersData');
        if (prodSellers) {
          const allSellers = JSON.parse(prodSellers);
          foundProduct = allSellers.find(item => item.id == productId);
        }
      } catch (error) {
        console.error("Error loading from production backup:", error);
      }
    }

    // 🔥 NEW: Try to fetch from API if not found in local storage
    if (!foundProduct) {
      try {
        console.log("📡 Product not in cache, fetching from API with ID:", productId);
        
        // Try to fetch single product endpoint first
        try {
          const response = await apiClient.get(`/api/products/${productId}/`);
          if (response.data) {
            foundProduct = response.data;
            console.log("✅ Product fetched from API (single endpoint):", foundProduct.product_name || foundProduct.productName);
          }
        } catch (singleError) {
          // If single endpoint doesn't work, fetch all products and filter
          console.log("📡 Single endpoint failed, fetching all products and filtering...");
          const response = await apiClient.get('/api/products/');
          
          if (response.data && response.data.results && Array.isArray(response.data.results)) {
            foundProduct = response.data.results.find(item => item.id == productId);
            if (foundProduct) {
              console.log("✅ Product found by filtering all products:", foundProduct.product_name || foundProduct.productName);
            }
          } else if (response.data && Array.isArray(response.data)) {
            foundProduct = response.data.find(item => item.id == productId);
            if (foundProduct) {
              console.log("✅ Product found from array response:", foundProduct.product_name || foundProduct.productName);
            }
          }
        }
      } catch (error) {
        console.error("❌ Error fetching product from API:", error.message);
      }
    }

    if (foundProduct) {
      console.log("✅ Product found:", foundProduct.product_name || foundProduct.productName);
      console.log("📧 Seller email from product:", foundProduct.email);
      console.log("📱 Seller WhatsApp from product:", foundProduct.whatsapp_number || foundProduct.whatsappNumber);
      setProduct(foundProduct);
      if ((foundProduct.product_images || foundProduct.productImages) && (foundProduct.product_images || foundProduct.productImages).length > 0) {
        setSelectedImage(0);
      }
    } else {
      console.log("❌ Product not found with ID:", productId);
    }
    
    setLoading(false);
  };

  // Demo product generator removed to ensure only real API products are used.

  // ✅ RELATED PRODUCTS
  const [relatedProducts, setRelatedProducts] = useState([]);
  
  useEffect(() => {
    if (product && sellers.length > 0) {
      const productCategory = product.main_category || product.mainCategory;
      const related = sellers
        .filter(s => (s.main_category || s.mainCategory) === productCategory && s.id !== product.id)
        .slice(0, 4);
      setRelatedProducts(related);
    }
  }, [product, sellers]);

  if (loading) {
    return (
      <div style={{ 
        height: "100vh", 
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f8f9fa"
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
          <p style={{ color: "#5f6368", fontSize: "14px", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif" }}>Loading...</p>
        </div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh", background: "#f8f9fa" }}>
        <div className="text-center">
          <i className="fas fa-exclamation-triangle fa-3x text-danger mb-3"></i>
          <h4>{language === 'sw' ? 'Bidhaa Haipatikani' : 'Product Not Found'}</h4>
          <p className="text-muted mb-4">
            {language === 'sw' ? 'Bidhaa unayaitafuta haipo au imeondolewa.' : 'The product you are looking for does not exist or has been removed.'}
          </p>
          <button 
            className="btn btn-danger"
            onClick={() => navigate('/public-sellers')}
          >
            <i className="fas fa-arrow-left me-2"></i>
            {language === 'sw' ? 'Rudi Kwenye Duka' : 'Back to Shop'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "#f8f9fa",
      paddingBottom: isMobile ? "80px" : "20px"
    }}>
      {/* ==================== EXACT SAME NAVIGATION AS PublicSellersDashboard.jsx ==================== */}
      <nav 
        className="navbar shadow-sm fixed-top py-2 navbar-light"
        style={{ 
          zIndex: 1000,
          backgroundColor: navBarColor,
          transition: 'background-color 0.8s ease-in-out',
          borderBottom: "none",
          margin: 0,
          padding: 0
        }}
      >
        <div className="container-fluid px-0" style={{ margin: 0, padding: 0 }}>
          {/* Mobile View - EXACT SAME */}
          <div className="d-flex d-lg-none align-items-center w-100 px-2" style={{ margin: 0, padding: "8px 0" }}>
            <Link 
              className="navbar-brand fw-bold me-2" 
              to="/" 
              style={{ 
                fontSize: "16px",
                color: textColor,
                display: "flex",
                alignItems: "center",
                flexShrink: 0
              }}
            >
              <i className="fas fa-shopping-cart me-2" style={{ color: textColor, fontSize: "18px" }}></i>
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
                      ? (navBarColor === "#FF6B6B" || navBarColor === "#4ECDC4" || navBarColor === "#45B7D1" 
                          ? "rgba(255,255,255,0.2)" 
                          : "rgba(0,0,0,0.1)") 
                      : "transparent",
                    border: isSearchInputFocused ? "none" : "none",
                    padding: isSearchInputFocused ? "0 12px" : "0",
                    transition: "all 0.3s ease",
                    boxShadow: isSearchInputFocused ? `inset 0 0 0 1px ${navBarColor === "#FF6B6B" || navBarColor === "#4ECDC4" || navBarColor === "#45B7D1" ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.1)"}` : "none"
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
                      color: textColor,
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
                        color: textColor,
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
                      color: textColor,
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
                
                {/* SEARCH SUGGESTIONS */}
                {showSuggestions && searchSuggestions.length > 0 && (
                  <div 
                    ref={suggestionsRef}
                    className="search-suggestions-dropdown"
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      right: 0,
                      zIndex: 1001,
                      maxHeight: "300px",
                      overflowY: "auto",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      borderRadius: "8px",
                      backgroundColor: "#ffffff",
                      marginTop: "5px"
                    }}
                  >
                    <div className="card border-0 shadow-sm">
                      <div className="card-body p-0">
                        {searchSuggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            className="dropdown-item d-flex align-items-center justify-content-between py-3 px-3 border-bottom"
                            style={{
                              cursor: "pointer",
                              transition: "all 0.2s",
                              backgroundColor: "transparent",
                              border: "none",
                              width: "100%",
                              textAlign: "left",
                              textDecoration: "none",
                              color: "#212529"
                            }}
                            onClick={() => handleSuggestionClick(suggestion)}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8f9fa"}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                          >
                            <div className="d-flex align-items-center w-100">
                              <i className={`fas fa-${
                                suggestion.type === 'product' ? 'box' : 
                                suggestion.type === 'category' ? 'tag' : 
                                suggestion.type === 'brand' ? 'copyright' : 'store'
                              } me-3 text-danger`}></i>
                              <div className="d-flex flex-column w-100">
                                <div className="fw-medium">{suggestion.text}</div>
                                <small className="text-muted">
                                  {getSuggestionTypeText(suggestion.type)}
                                </small>
                              </div>
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
                  color: textColor,
                  padding: 0,
                  border: "none",
                  marginRight: "8px"
                }}
                title={t.language}
              >
                <i className="fas fa-globe" style={{ fontSize: "18px", color: textColor }}></i>
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
                  color: textColor,
                  padding: 0,
                  border: "none"
                }}
                title="Menu"
              >
                <i className="fas fa-bars" style={{ fontSize: "18px", color: textColor }}></i>
              </button>
            </div>
          </div>
          
          {/* Desktop View - EXACT SAME */}
          <div className="d-none d-lg-flex align-items-center w-100 justify-content-between px-3">
            <Link 
              className="navbar-brand fw-bold" 
              to="/" 
              style={{ 
                fontSize: "18px",
                color: textColor,
                display: "flex",
                alignItems: "center"
              }}
            >
              <i className="fas fa-shopping-cart me-2" style={{ color: textColor, fontSize: "20px" }}></i>
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
                      ? (navBarColor === "#FF6B6B" || navBarColor === "#4ECDC4" || navBarColor === "#45B7D1" 
                          ? "rgba(255,255,255,0.2)" 
                          : "rgba(0,0,0,0.1)") 
                      : "transparent",
                    border: isSearchInputFocused ? "none" : "none",
                    padding: isSearchInputFocused ? "0 16px" : "0",
                    transition: "all 0.3s ease",
                    boxShadow: isSearchInputFocused ? `inset 0 0 0 1px ${navBarColor === "#FF6B6B" || navBarColor === "#4ECDC4" || navBarColor === "#45B7D1" ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.1)"}` : "none"
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
                      color: textColor,
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
                        color: textColor,
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
                      color: textColor,
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
                
                {/* SEARCH SUGGESTIONS - DESKTOP */}
                {showSuggestions && searchSuggestions.length > 0 && (
                  <div 
                    ref={suggestionsRef}
                    className="search-suggestions-dropdown"
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      right: 0,
                      zIndex: 1001,
                      maxHeight: "400px",
                      overflowY: "auto",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      borderRadius: "8px",
                      backgroundColor: "#ffffff",
                      marginTop: "5px"
                    }}
                  >
                    <div className="card border-0 shadow-sm">
                      <div className="card-body p-0">
                        {searchSuggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            className="dropdown-item d-flex align-items-center justify-content-between py-3 px-3 border-bottom"
                            style={{
                              cursor: "pointer",
                              transition: "all 0.2s",
                              backgroundColor: "transparent",
                              border: "none",
                              width: "100%",
                              textAlign: "left",
                              textDecoration: "none",
                              color: "#212529"
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8f9fa"}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            <div className="d-flex align-items-center w-100">
                              <i className={`fas fa-${
                                suggestion.type === 'product' ? 'box' : 
                                suggestion.type === 'category' ? 'tag' : 
                                suggestion.type === 'brand' ? 'copyright' : 'store'
                              } me-3 text-danger`}></i>
                              <div className="d-flex flex-column w-100">
                                <div className="fw-medium">{suggestion.text}</div>
                                <small className="text-muted">
                                  {getSuggestionTypeText(suggestion.type)}
                                </small>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
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
                  color: textColor,
                  borderColor: navBarColor === "#FF6B6B" || navBarColor === "#4ECDC4" || navBarColor === "#45B7D1" ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.3)"
                }}
              >
                <i className="fas fa-globe me-1" style={{ color: textColor }}></i>
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
                    color: textColor,
                    borderColor: navBarColor === "#FF6B6B" || navBarColor === "#4ECDC4" || navBarColor === "#45B7D1" ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.3)"
                  }}
                >
                  <ProfileImage size={35} />
                  <span style={{ fontSize: "14px", color: textColor, marginLeft: "8px" }}>{t.account}</span>
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
                  color: textColor,
                  borderColor: navBarColor === "#FF6B6B" || navBarColor === "#4ECDC4" || navBarColor === "#45B7D1" ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.3)"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = navBarColor === "#FF6B6B" || navBarColor === "#4ECDC4" || navBarColor === "#45B7D1" 
                    ? "rgba(255,255,255,0.2)" 
                    : "rgba(0,0,0,0.1)";
                  e.currentTarget.style.color = textColor;
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = textColor;
                  e.currentTarget.style.transform = "";
                }}
              >
                <div 
                  className="rounded-circle d-flex align-items-center justify-content-center me-2" 
                  style={{ 
                    width: "35px", 
                    height: "35px",
                    backgroundColor: navBarColor === "#FF6B6B" || navBarColor === "#4ECDC4" || navBarColor === "#45B7D1" 
                      ? "rgba(255,255,255,0.9)" 
                      : navBarColor,
                    color: navBarColor === "#FF6B6B" || navBarColor === "#4ECDC4" || navBarColor === "#45B7D1" 
                      ? navBarColor 
                      : "white"
                  }}
                >
                  <i className="fas fa-user"></i>
                </div>
                <div className="d-flex flex-column align-items-start">
                  <span style={{ fontSize: "12px", fontWeight: "bold", color: textColor }}>{t.signIn} ›</span>
                  <span style={{ fontSize: "11px", opacity: 0.8, color: textColor }}>{t.sellProducts}</span>
                </div>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* ==================== NO ADS SECTION - REMOVED COMPLETELY ==================== */}
      <div style={{ 
        marginTop: isMobile ? "70px" : "80px",
        height: "1px",
        background: "transparent"
      }}></div>

      {/* ==================== MAIN CONTENT - PRODUCT DETAILS ==================== */}
      <div className="container-fluid mb-5 px-2 px-lg-3" style={{ 
        paddingTop: "10px",
        paddingBottom: isMobile ? "100px" : "20px"
      }}>
        <div className="row">
          {/* Back Button */}
          <div className="col-12 mb-3">
            <button 
              className="btn btn-link text-decoration-none"
              onClick={() => navigate(-1)}
              style={{ color: navBarColor, fontSize: "14px", padding: 0 }}
            >
              <i className="fas fa-arrow-left me-1"></i>
              {language === 'sw' ? 'Rudi Nyuma' : 'Go Back'}
            </button>
          </div>
          
          {/* Product Images - Left Column */}
          <div className="col-12 col-lg-6 mb-4">
            <div className="position-relative">
              {/* Main Image */}
              <div 
                className="rounded-3 overflow-hidden mx-auto"
                style={{ 
                  width: "100%",
                  height: isMobile ? "300px" : "450px",
                  backgroundColor: "#f8f9fa",
                  border: "1px solid rgba(0,0,0,0.05)",
                  boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
                  cursor: "pointer",
                  transition: "all 0.3s ease"
                }}
                onClick={() => setZoom(!zoom)}
              >
                <img
                  src={(product.product_images || product.productImages)?.[selectedImage] || (product.product_images || product.productImages)?.[0] || "https://images.unsplash.com/photo-1556656793-08538906a9f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                  alt={product.product_name || product.productName || 'Product'}
                  className="w-100 h-100"
                  style={{ 
                    objectFit: "cover",
                    transform: zoom ? "scale(1.1)" : "scale(1)",
                    transition: "transform 0.5s ease"
                  }}
                />
              </div>
              
              {/* Image Counter */}
              <div className="position-absolute top-0 end-0 m-3">
                <span className="badge bg-dark" style={{ 
                  padding: "8px 16px", 
                  borderRadius: "50px", 
                  fontSize: "12px",
                  opacity: 0.8
                }}>
                  <i className="fas fa-camera me-1"></i>
                  {selectedImage + 1} / {(product.product_images || product.productImages)?.length || 1}
                </span>
              </div>
              
              {/* Stock Badge */}
              <div className="position-absolute top-0 start-0 m-3">
                <span className={`badge bg-${getStockBadgeColor((product.stock_status || product.stockStatus))}`} style={{ 
                  padding: "8px 16px", 
                  borderRadius: "50px", 
                  fontSize: "12px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                }}>
                  <i className={`fas fa-${
                    (product.stock_status || product.stockStatus) === "Available" ? "check-circle" : 
                    (product.stock_status || product.stockStatus) === "Limited" ? "exclamation-circle" : 
                    "times-circle"
                  } me-1`}></i>
                  {getStockText((product.stock_status || product.stockStatus))}
                </span>
              </div>
            </div>
            
            {/* Thumbnail Images */}
            {(product.product_images || product.productImages) && (product.product_images || product.productImages).length > 1 && (
              <div className="d-flex justify-content-start mt-3 gap-2 overflow-auto pb-2">
                {(product.product_images || product.productImages).map((img, index) => (
                  <button
                    key={index}
                    className={`btn p-0 flex-shrink-0 ${selectedImage === index ? 'border border-2 border-danger' : ''}`}
                    onClick={() => setSelectedImage(index)}
                    style={{ 
                      width: "70px",
                      height: "70px",
                      borderRadius: "12px",
                      overflow: "hidden",
                      transition: "all 0.3s ease",
                      opacity: selectedImage === index ? 1 : 0.7,
                      border: selectedImage === index ? '2px solid #FF6B6B' : '1px solid rgba(0,0,0,0.1)'
                    }}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-100 h-100"
                      style={{ objectFit: "cover" }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Product Info - Right Column */}
          <div className="col-12 col-lg-6">
            <h2 className="fw-bold mb-3" style={{ fontSize: isMobile ? "20px" : "28px", color: "#333" }}>
              {product.product_name || product.productName || 'Product'}
            </h2>
            
            {/* Price */}
            <div className="d-flex align-items-center mb-4">
              <h3 className="text-danger fw-bold mb-0" style={{ fontSize: isMobile ? "28px" : "36px" }}>
                {formatPrice(product.price)}
              </h3>
              {(product.price_type || product.priceType) === "Negotiable" && (
                <span className="badge bg-warning text-dark ms-3 px-3 py-2" style={{ borderRadius: "50px", fontSize: "12px" }}>
                  <i className="fas fa-hand-holding-usd me-1"></i>
                  {t.negotiable}
                </span>
              )}
            </div>
            
            {/* Quick Info Cards */}
            <div className="row g-2 mb-4">
              <div className="col-6 col-md-3">
                <div className="p-3 bg-light rounded-3">
                  <small className="text-muted d-block">{t.shop}</small>
                  <span className="fw-bold text-truncate d-block" style={{ fontSize: "14px" }}>
                    {(product.shop_name || product.shopName)?.substring(0, 15)}
                  </span>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="p-3 bg-light rounded-3">
                  <small className="text-muted d-block">{t.category}</small>
                  <span className="fw-bold text-truncate d-block" style={{ fontSize: "14px" }}>
                    {(product.main_category || product.mainCategory)?.substring(0, 15)}
                  </span>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="p-3 bg-light rounded-3">
                  <small className="text-muted d-block">{t.brand}</small>
                  <span className="fw-bold text-truncate d-block" style={{ fontSize: "14px" }}>
                    {product.brand || 'N/A'}
                  </span>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="p-3 bg-light rounded-3">
                  <small className="text-muted d-block">{t.condition}</small>
                  <span className="fw-bold text-truncate d-block" style={{ fontSize: "14px" }}>
                    {product.condition || 'New'}
                  </span>
                </div>
              </div>
            </div>
            
            {/* ✅ FIXED: Action Buttons - WhatsApp and Email now work directly */}
            <div className="d-grid gap-3 mb-4">
              {/* ✅ WhatsApp Button - Opens WhatsApp directly with seller's number */}
              <button 
                className="btn btn-success d-flex align-items-center justify-content-center"
                onClick={handleWhatsApp}
                style={{ 
                  borderRadius: "50px",
                  padding: "14px",
                  fontSize: "16px",
                  fontWeight: "600",
                  background: "linear-gradient(135deg, #25D366, #128C7E)",
                  border: "none",
                  boxShadow: "0 5px 15px rgba(37,211,102,0.3)",
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-3px)";
                  e.target.style.boxShadow = "0 10px 25px rgba(37,211,102,0.4)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 5px 15px rgba(37,211,102,0.3)";
                }}
              >
                <i className="fab fa-whatsapp me-2 fa-lg"></i>
                {language === 'sw' ? 'Wasiliana kwa WhatsApp' : 'Contact via WhatsApp'}
              </button>
              
              <div className="d-flex gap-2">
                <button 
                  className="btn btn-outline-danger flex-fill d-flex align-items-center justify-content-center"
                  onClick={handleCall}
                  style={{ 
                    borderRadius: "50px",
                    padding: "12px",
                    fontSize: "15px",
                    borderWidth: "2px",
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "linear-gradient(135deg, #FF6B6B, #FF8E53)";
                    e.target.style.color = "white";
                    e.target.style.borderColor = "transparent";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "transparent";
                    e.target.style.color = "#FF6B6B";
                    e.target.style.borderColor = "#FF6B6B";
                  }}
                >
                  <i className="fas fa-phone-alt me-2"></i>
                  {t.call}
                </button>
                
                {/* ✅ Email Button - Opens default email app (mailto:) */}
                <button 
                  className="btn btn-outline-primary flex-fill d-flex align-items-center justify-content-center"
                  onClick={handleEmail}
                  style={{ 
                    borderRadius: "50px",
                    padding: "12px",
                    fontSize: "15px",
                    borderWidth: "2px",
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "#0d6efd";
                    e.target.style.color = "white";
                    e.target.style.borderColor = "#0d6efd";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "transparent";
                    e.target.style.color = "#0d6efd";
                    e.target.style.borderColor = "#0d6efd";
                  }}
                >
                  <i className="fas fa-envelope me-2"></i>
                  {t.email}
                </button>
                
                <button 
                  className="btn btn-outline-secondary"
                  onClick={handleShare}
                  style={{ 
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    padding: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: "2px",
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "#6c757d";
                    e.target.style.color = "white";
                    e.target.style.borderColor = "#6c757d";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "transparent";
                    e.target.style.color = "#6c757d";
                    e.target.style.borderColor = "#6c757d";
                  }}
                >
                  <i className="fas fa-share-alt"></i>
                </button>
              </div>
            </div>
            
            {/* Description */}
            <div className="card border-0 mb-4" style={{ borderRadius: "16px", boxShadow: "0 5px 15px rgba(0,0,0,0.05)" }}>
              <div 
                className="card-header bg-white p-3 d-flex justify-content-between align-items-center"
                style={{ borderBottom: "1px solid rgba(0,0,0,0.05)", cursor: "pointer" }}
                onClick={() => toggleSection('description')}
              >
                <h6 className="mb-0 fw-bold">
                  <i className="fas fa-align-left me-2 text-danger"></i>
                  {t.description}
                </h6>
                <i className={`fas fa-chevron-${expandedSections.description ? 'up' : 'down'} text-muted`}></i>
              </div>
              {expandedSections.description && (
                <div className="card-body p-3">
                  <p className="text-muted mb-0" style={{ lineHeight: "1.8", fontSize: "15px" }}>
                    {product.description || product.specifications || 
                      (language === 'sw' ? 'Hakuna maelezo ya ziada.' : 'No additional description.')}
                  </p>
                  {product.description && (
                    <small className="text-muted d-block mt-2">
                      <i className="fas fa-file-alt me-1"></i>
                      {product.description.split(/\s+/).filter(w => w.length > 0).length} / 200 {language === 'sw' ? 'maneno' : 'words'}
                    </small>
                  )}
                </div>
              )}
            </div>
            
            {/* Specifications */}
            {product.specifications && (
              <div className="card border-0 mb-4" style={{ borderRadius: "16px", boxShadow: "0 5px 15px rgba(0,0,0,0.05)" }}>
                <div 
                  className="card-header bg-white p-3 d-flex justify-content-between align-items-center"
                  style={{ borderBottom: "1px solid rgba(0,0,0,0.05)", cursor: "pointer" }}
                  onClick={() => toggleSection('specifications')}
                >
                  <h6 className="mb-0 fw-bold">
                    <i className="fas fa-list-ul me-2 text-primary"></i>
                    {t.specifications}
                  </h6>
                  <i className={`fas fa-chevron-${expandedSections.specifications ? 'up' : 'down'} text-muted`}></i>
                </div>
                {expandedSections.specifications && (
                  <div className="card-body p-3">
                    <p className="text-muted mb-0" style={{ lineHeight: "1.8", fontSize: "15px" }}>
                      {product.specifications}
                    </p>
                  </div>
                )}
              </div>
            )}
            
            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div className="card border-0 mb-4" style={{ borderRadius: "16px", boxShadow: "0 5px 15px rgba(0,0,0,0.05)" }}>
                <div 
                  className="card-header bg-white p-3 d-flex justify-content-between align-items-center"
                  style={{ borderBottom: "1px solid rgba(0,0,0,0.05)", cursor: "pointer" }}
                  onClick={() => toggleSection('features')}
                >
                  <h6 className="mb-0 fw-bold">
                    <i className="fas fa-check-circle me-2 text-success"></i>
                    {t.features}
                  </h6>
                  <i className={`fas fa-chevron-${expandedSections.features ? 'up' : 'down'} text-muted`}></i>
                </div>
                {expandedSections.features && (
                  <div className="card-body p-3">
                    <div className="row g-2">
                      {product.features.map((feature, index) => (
                        <div key={index} className="col-12 col-md-6">
                          <div className="d-flex align-items-start">
                            <i className="fas fa-check-circle text-success me-2 mt-1"></i>
                            <span style={{ fontSize: "14px" }}>{feature}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Shipping & Warranty */}
            {(product.shippingCost || product.estimatedDelivery || product.warranty === "Yes") && (
              <div className="card border-0 mb-4" style={{ borderRadius: "16px", boxShadow: "0 5px 15px rgba(0,0,0,0.05)" }}>
                <div 
                  className="card-header bg-white p-3 d-flex justify-content-between align-items-center"
                  style={{ borderBottom: "1px solid rgba(0,0,0,0.05)", cursor: "pointer" }}
                  onClick={() => toggleSection('shipping')}
                >
                  <h6 className="mb-0 fw-bold">
                    <i className="fas fa-truck me-2 text-warning"></i>
                    {t.shipping} & {t.warranty}
                  </h6>
                  <i className={`fas fa-chevron-${expandedSections.shipping ? 'up' : 'down'} text-muted`}></i>
                </div>
                {expandedSections.shipping && (
                  <div className="card-body p-3">
                    <div className="row g-3">
                      {product.shippingCost && (
                        <div className="col-6">
                          <small className="text-muted d-block">{language === 'sw' ? 'Gharama' : 'Cost'}</small>
                          <span className="fw-bold text-warning">{formatPrice(product.shippingCost)}</span>
                        </div>
                      )}
                      {product.estimatedDelivery && (
                        <div className="col-6">
                          <small className="text-muted d-block">{language === 'sw' ? 'Muda' : 'Delivery'}</small>
                          <span className="fw-bold">{product.estimatedDelivery}</span>
                        </div>
                      )}
                      {product.warranty === "Yes" && (
                        <div className="col-12">
                          <small className="text-muted d-block">{t.warranty}</small>
                          <span className="fw-bold text-success">{product.warrantyPeriod || '1 Year'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Seller Information - WITH SHOP IMAGE, WHATSAPP AND EMAIL */}
            <div className="card border-0 mb-4" style={{ borderRadius: "16px", boxShadow: "0 5px 15px rgba(0,0,0,0.05)" }}>
              <div 
                className="card-header bg-white p-3 d-flex justify-content-between align-items-center"
                style={{ borderBottom: "1px solid rgba(0,0,0,0.05)", cursor: "pointer" }}
                onClick={() => toggleSection('seller')}
              >
                <h6 className="mb-0 fw-bold">
                  <i className="fas fa-store me-2 text-danger"></i>
                  {t.sellerInfo}
                </h6>
                <i className={`fas fa-chevron-${expandedSections.seller ? 'up' : 'down'} text-muted`}></i>
              </div>
              {expandedSections.seller && (
                <div className="card-body p-3">
                  <div className="row g-3">
                    {/* Shop Image */}
                    {product.shopImage && (
                      <div className="col-4">
                        <div style={{ 
                          width: "100%", 
                          height: "100px", 
                          borderRadius: "12px", 
                          overflow: "hidden",
                          border: "1px solid rgba(0,0,0,0.1)"
                        }}>
                          <img 
                            src={product.shopImage} 
                            alt={product.shop_name || product.shopName || 'Shop'}
                            className="w-100 h-100"
                            style={{ objectFit: "cover" }}
                          />
                        </div>
                      </div>
                    )}
                    
                    {/* Seller Details */}
                    <div className={product.shopImage ? "col-8" : "col-12"}>
                      <div className="d-flex align-items-center mb-2">
                        <div 
                          className="rounded-circle bg-danger text-white d-flex align-items-center justify-content-center me-2"
                          style={{ width: "40px", height: "40px", fontWeight: "bold", fontSize: "16px" }}
                        >
                          {(product.seller_name || product.sellerName)?.charAt(0).toUpperCase() || 'S'}
                        </div>
                        <div>
                          <h6 className="fw-bold mb-0">{product.shop_name || product.shopName || 'Shop'}</h6>
                          <small className="text-success">
                            <i className="fas fa-check-circle me-1"></i>
                            {language === 'sw' ? 'Muuza Thibitishwa' : 'Verified Seller'}
                          </small>
                        </div>
                      </div>
                      
                      <div className="mt-2">
                        <small className="text-muted d-block">
                          <i className="fas fa-user me-2"></i>
                          {product.seller_name || product.sellerName || 'Seller'}
                        </small>
                        <small className="text-muted d-block">
                          <i className="fas fa-map-marker-alt me-2"></i>
                          {product.area}, {product.district}
                        </small>
                        <small className="text-muted d-block">
                          <i className="fas fa-phone-alt me-2"></i>
                          {product.phone_number || product.phoneNumber}
                        </small>
                        {/* ✅ WhatsApp Number Display - Clickable */}
                        {(product.whatsapp_number || product.whatsappNumber) && (
                          <small className="text-muted d-block text-truncate">
                            <i className="fab fa-whatsapp me-2" style={{ color: "#25D366" }}></i>
                            <a 
                              href={`https://wa.me/${(product.whatsapp_number || product.whatsappNumber || '').replace(/\D/g, '')}?text=${encodeURIComponent(language === 'sw' ? 'Habari! Nina nia ya kununua bidhaa yako.' : 'Hello! I am interested in your product.')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ textDecoration: "none", color: "#25D366" }}
                            >
                              {product.whatsapp_number || product.whatsappNumber}
                            </a>
                          </small>
                        )}
                        {/* ✅ Email Display - Clickable */}
                        {product.email && (
                          <small className="text-muted d-block text-truncate">
                            <i className="fas fa-envelope me-2" style={{ color: "#0d6efd" }}></i>
                            <a 
                              href={`mailto:${product.email}`}
                              style={{ textDecoration: "none", color: "#0d6efd" }}
                            >
                              {product.email}
                            </a>
                          </small>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-5">
            <h5 className="fw-bold mb-4 d-flex align-items-center">
              <span style={{ 
                width: "40px", 
                height: "40px", 
                borderRadius: "12px", 
                background: "linear-gradient(135deg, #FF6B6B, #FF8E53)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                marginRight: "12px",
                fontSize: "18px"
              }}>
                <i className="fas fa-th-large"></i>
              </span>
              {t.relatedProducts}
            </h5>
            <div className="row g-3">
              {relatedProducts.map((related) => (
                <div key={related.id} className="col-6 col-md-4 col-lg-3">
                  <div 
                    className="card h-100 border-0 shadow-sm"
                    style={{ 
                      borderRadius: "12px", 
                      overflow: "hidden",
                      cursor: "pointer",
                      transition: "all 0.3s ease"
                    }}
                    onClick={() => navigate(`/product/${related.id}`)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-5px)";
                      e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)";
                    }}
                  >
                    <div style={{ height: "150px", overflow: "hidden" }}>
                      <img 
                        src={(related.product_images || related.productImages)?.[0] || "https://images.unsplash.com/photo-1556656793-08538906a9f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
                        className="w-100 h-100"
                        alt={related.product_name || related.productName || 'Product'}
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <div className="card-body p-2">
                      <h6 className="card-title mb-1" style={{ 
                        fontSize: "13px",
                        fontWeight: "600",
                        height: "38px",
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: "2"
                      }}>
                        {related.product_name || related.productName || 'Product'}
                      </h6>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="text-danger fw-bold" style={{ fontSize: "14px" }}>
                          {formatPrice(related.price)}
                        </span>
                        <span className={`badge bg-${getStockBadgeColor(related.stockStatus)}`} style={{ fontSize: "10px" }}>
                          {getStockText(related.stockStatus)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ==================== FIXED: MOBILE BOTTOM NAVIGATION - ALL LINKS WORKING ==================== */}
      {isMobile && (
        <div className="fixed-bottom bg-white shadow-lg border-top" style={{ 
          height: "60px",
          zIndex: 999,
          padding: "8px 0",
          display: "block"
        }}>
          <div className="container">
            <div className="row">
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
                  <small style={{ fontSize: "10px", color: "#666" }}>{t.home}</small>
                </button>
              </div>
              
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
                  <i className="fas fa-box" style={{ fontSize: "18px", color: "#666" }}></i>
                  <small style={{ fontSize: "10px", color: "#666" }}>{t.products}</small>
                </button>
              </div>
              
              {/* ✅ FIXED: Add New - WORKS FOR ALL USERS */}
              <div className="col text-center">
                <button 
                  className="btn btn-link text-decoration-none"
                  onClick={handleAddProductClick}
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
                    {t.addProduct}
                  </small>
                </button>
              </div>
              
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
                  <small style={{ fontSize: "10px", color: "#666" }}>{t.shopsNav}</small>
                </button>
              </div>
              
              {/* ✅ FIXED: Account with Profile Picture - NO CORS ERRORS */}
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
                  <ProfileImage size={30} showBorder={true} />
                  <small style={{ 
                    fontSize: "10px", 
                    color: user ? "#FF6B6B" : "#666",
                    fontWeight: user ? "bold" : "normal",
                    marginTop: "2px"
                  }}>
                    {t.account}
                  </small>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MOBILE MENU OVERLAY - EXACT SAME ==================== */}
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
                <ProfileImage size={80} showBorder={true} />
                
                {user ? (
                  <>
                    <h6 className="fw-bold mb-1 mt-2">{user?.name || user?.displayName || user?.email?.split('@')[0] || "Seller"}</h6>
                    <p className="text-muted small mb-3">{user?.email || "My Shop"}</p>
                  </>
                ) : (
                  <>
                    <h6 className="fw-bold mb-1 mt-2">{t.welcome}</h6>
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

      {/* ==================== MOBILE LANGUAGE SELECTOR - EXACT SAME ==================== */}
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
                    onClick={() => handleLanguageChange(lang.code)}
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

      {/* Font Awesome */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />

      <style>
        {`
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
            boxShadow: inset 0 0 0 1px rgba(0,0,0,0.1) !important;
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
            boxShadow: 0 4px 12px rgba(0,0,0,0.15);
            border-radius: 8px;
            background-color: #ffffff;
            margin-top: 5px;
          }
          
          @keyframes slideInLeft {
            from { transform: translateX(-100%); }
            to { transform: translateX(0); }
          }
          
          .mobile-language-selector {
            position: fixed;
            top: 0;
            left: 0;
            width: 280px;
            height: 100%;
            background: white;
            z-index: 1000;
            boxShadow: 2px 0 10px rgba(0,0,0,0.1);
            overflow-y: auto;
            animation: slideInLeft 0.3s ease;
          }
          
          .card {
            transition: all 0.3s ease;
          }
          
          .btn {
            transition: all 0.3s ease;
          }
          
          @media (max-width: 991px) {
            .fixed-bottom {
              display: block !important;
            }
          }
          
          /* ✅ FIXED: Bottom navigation buttons should have proper cursor */
          .fixed-bottom .btn-link {
            cursor: pointer !important;
          }
          
          .fixed-bottom .btn-link:hover {
            opacity: 0.8;
          }

          /* ✅ WhatsApp and Email links styling */
          a[href^="https://wa.me"] {
            text-decoration: none;
            font-weight: 500;
          }
          
          a[href^="https://wa.me"]:hover {
            text-decoration: underline;
          }
          
          a[href^="mailto:"] {
            text-decoration: none;
            font-weight: 500;
          }
          
          a[href^="mailto:"]:hover {
            text-decoration: underline;
          }
        `}
      </style>
    </div>
  );
}

export default ProductDetails;