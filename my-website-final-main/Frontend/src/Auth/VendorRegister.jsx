// src/Auth/VendorRegister.jsx - FIXED VERSION 🔥
// ✅ NO MULTIPLE SUBMISSIONS
// ✅ PREVENTS INFINITE LOOPS
// ✅ RED ANIMATION FOR INCOMPLETE FIELDS
// ✅ AUTO-SCROLL TO FIRST MISSING FIELD
// ✅ CLEAR VISUAL INDICATORS
// ✅ SMOOTH USER EXPERIENCE

import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import apiClient, { getToken, isAuthenticated, debugTokenStorage, clearTokens } from "../api/apiClient";
import { compressImage } from "../services/imageCompressor";

function VendorRegister() {
  const [formData, setFormData] = useState({
    shopName: "",
    businessType: "",
    country: "Tanzania",
    region: "",
    district: "",
    area: "",
    street: "",
    mapLocation: "",
    openingHours: "",
    whatsappNumber: "",
    mainCategory: "",
    subCategory: "",
    productName: "",
    brand: "",
    description: "",
    specifications: "",
    stockStatus: "Available",
    quantityAvailable: "",
    lastUpdated: new Date().toISOString().split('T')[0],
    price: "",
    priceType: "Fixed",
    warranty: "No",
    warrantyPeriod: "",
    condition: "New",
    size: "",
    color: "",
    material: "",
    confirmAvailability: false,
    agreeToUpdate: false
  });

  const [files, setFiles] = useState({
    productImages: [],
    shopImage: null
  });

  const [filePreviews, setFilePreviews] = useState({
    productImages: [],
    shopImage: null
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // 🔥 CRITICAL: Prevent multiple submissions
  const [currentStep, setCurrentStep] = useState(1);
  const [progress, setProgress] = useState(33);
  const [imgError, setImgError] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [incompleteFields, setIncompleteFields] = useState([]);
  const [animateField, setAnimateField] = useState(null);
  
  const hasCheckedAuth = useRef(false);
  const fieldRefs = useRef({});
  
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    user: authUser, 
    isVendorRegistered, 
    registerVendor: registerVendorToContext,
    getUserProfilePicture,
    logout
  } = useAuth();

  // ✅ Save to multiple storages function
  const saveToAllStorages = (key, value) => {
    try {
      localStorage.setItem(key, value);
      sessionStorage.setItem(`${key}_backup`, value);
      const domain = window.location.hostname.replace(/\./g, '_');
      sessionStorage.setItem(`${domain}_${key}`, value);
      sessionStorage.setItem(`broadcast_${key}`, JSON.stringify({
        data: value,
        timestamp: Date.now(),
        domain: window.location.hostname
      }));
      console.log(`✅ Saved ${key} to all storages`);
    } catch (error) {
      console.warn(`❌ Error saving ${key}:`, error);
    }
  };

  // ✅ Load from multiple storages function
  const loadFromAllStorages = (key) => {
    const storages = [
      () => localStorage.getItem(key),
      () => sessionStorage.getItem(`${key}_backup`),
      () => {
        const domain = window.location.hostname.replace(/\./g, '_');
        return sessionStorage.getItem(`${domain}_${key}`);
      }
    ];
    
    for (const getter of storages) {
      try {
        const value = getter();
        if (value) {
          console.log(`✅ Found ${key} in storage`);
          return value;
        }
      } catch (e) {}
    }
    return null;
  };

  // ✅ Dispatch event for real-time updates
  const dispatchProductsUpdatedEvent = (action, productData) => {
    try {
      const event = new CustomEvent('productsUpdated', { 
        detail: { 
          action: action,
          timestamp: Date.now(),
          product: productData,
          domain: window.location.hostname
        } 
      });
      window.dispatchEvent(event);
      console.log(`📢 Dispatched productsUpdated event: ${action}`);
      
      try {
        const channel = new BroadcastChannel('availo_sync');
        channel.postMessage({ 
          type: 'PRODUCTS_UPDATE', 
          action: action,
          product: productData,
          timestamp: Date.now()
        });
        console.log("📢 Broadcast sent via BroadcastChannel");
      } catch (e) {
        console.warn("BroadcastChannel not supported:", e);
      }
      
      const allSellers = JSON.parse(localStorage.getItem('allSellersData') || '[]');
      localStorage.setItem('allSellersData', JSON.stringify(allSellers));
      
      sessionStorage.setItem('broadcast_products', JSON.stringify({
        action: action,
        product: productData,
        timestamp: Date.now(),
        domain: window.location.hostname
      }));
      
      setTimeout(() => {
        window.dispatchEvent(event);
        localStorage.setItem('allSellersData', JSON.stringify(allSellers));
      }, 100);
      
    } catch (error) {
      console.error('❌ Error dispatching event:', error);
    }
  };

  // ✅ DEBUG: Check on mount
  useEffect(() => {
    console.log("🔍 ========== VENDOR REGISTER MOUNTED ==========");
    console.log("🔍 Current URL:", window.location.href);
    console.log("🔍 ============================================");
  }, []);

  // ✅ SIMPLIFIED FOR PUBLIC ACCESS
  useEffect(() => {
    if (hasCheckedAuth.current) return;
    hasCheckedAuth.current = true;

    console.log("🔐 Vendor Register loaded");
    
    if (!authUser) {
      console.log("⏳ Waiting for authUser to load...");
      const storedUser = localStorage.getItem('availoUser');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          console.log("✅ Loaded user directly from localStorage:", parsedUser.email);
        } catch (e) {
          console.error("❌ Error parsing stored user:", e);
        }
      }
      return;
    }
    
    const action = location.state?.action;
    const isAddProductAction = action === "add-product";
    const isEditProductAction = action === "edit-product";
    
    console.log("🔍 Action from state:", action);
    
    if (!authUser || !authUser.email) {
      console.log("⏳ Auth user not fully loaded yet");
      return;
    }
    
    const isRegistered = isVendorRegistered(authUser.email);
    
    if (isRegistered && !isAddProductAction && !isEditProductAction) {
      console.log("✅ User already registered - redirecting to profile");
      hasCheckedAuth.current = true;
      navigate('/seller-profile', { 
        state: { message: "You are already registered as a vendor" } 
      });
      return;
    }
    
    if (isRegistered && isEditProductAction && location.state?.product) {
      console.log("✅ Editing product - populating form");
      const product = location.state.product;
      
      setFormData(prev => ({
        ...prev,
        shopName: product.shopName || "",
        businessType: "",
        country: "Tanzania",
        region: product.region || "",
        district: product.district || "",
        area: product.area || "",
        street: product.street || "",
        mapLocation: product.mapLocation || "",
        openingHours: product.openingHours || "",
        whatsappNumber: product.whatsappNumber || "",
        mainCategory: product.mainCategory || "",
        subCategory: product.subCategory || "",
        productName: product.productName || "",
        brand: product.brand || "",
        description: product.description || "",
        specifications: product.specifications || "",
        stockStatus: product.stockStatus || "Available",
        quantityAvailable: product.quantityAvailable || "",
        price: product.price || "",
        priceType: product.priceType || "Fixed",
        warranty: product.warranty || "No",
        warrantyPeriod: product.warrantyPeriod || "",
        condition: product.condition || "New",
        size: product.size || "",
        color: product.color || "",
        material: product.material || ""
      }));
      
      if (product.productImages?.length > 0) {
        setFilePreviews(prev => ({
          ...prev,
          productImages: product.productImages.slice(0, 7)
        }));
      }
      
      if (product.shopImage) {
        setFilePreviews(prev => ({
          ...prev,
          shopImage: product.shopImage
        }));
      }
    }
    
    hasCheckedAuth.current = true;
    
  }, [authUser]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  }, [formData.stockStatus, formData.quantityAvailable]);

  useEffect(() => {
    if (formData.mainCategory && !subCategories[formData.mainCategory]) {
      setFormData(prev => ({
        ...prev,
        subCategory: "",
        specifications: ""
      }));
    }
  }, [formData.mainCategory]);

  useEffect(() => {
    if (formData.description) {
      const words = formData.description.trim().split(/\s+/).filter(word => word.length > 0);
      setWordCount(words.length);
    } else {
      setWordCount(0);
    }
  }, [formData.description]);

  // ✅ Clear animation after 2 seconds
  useEffect(() => {
    if (animateField) {
      const timer = setTimeout(() => {
        setAnimateField(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [animateField]);

  const ProfileImage = ({ size = 60, showBorder = false }) => {
    const profileUrl = getUserProfilePicture();
    const [localImgError, setLocalImgError] = useState(false);
    
    const getUserInitial = () => {
      if (!authUser) return "U";
      const name = authUser.name || authUser.displayName || authUser.email?.split('@')[0] || "User";
      return name.charAt(0).toUpperCase();
    };

    if (authUser && profileUrl && !localImgError) {
      return (
        <img 
          src={profileUrl} 
          alt={authUser?.name || "Profile"} 
          className="rounded-circle"
          style={{ 
            width: `${size}px`, 
            height: `${size}px`, 
            objectFit: "cover",
            border: showBorder ? "3px solid #000000" : "none",
            borderRadius: "12px !important"
          }}
          onError={() => setLocalImgError(true)}
          referrerPolicy="no-referrer"
          crossOrigin="anonymous"
        />
      );
    }

    return (
      <div style={{ 
        width: `${size}px`, 
        height: `${size}px`, 
        borderRadius: "12px",
        backgroundColor: "#dc3545",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#FFFFFF",
        fontWeight: "bold",
        fontSize: `${size * 0.4}px`,
        border: showBorder ? "3px solid #000000" : "none"
      }}>
        {getUserInitial()}
      </div>
    );
  };

  const africanCountries = [
    "Tanzania", "Kenya", "Uganda", "Rwanda", "Burundi", "DR Congo",
    "Ethiopia", "Somalia", "South Sudan", "Sudan", "Egypt", "Libya",
    "Tunisia", "Algeria", "Morocco", "Mauritania", "Mali", "Niger",
    "Chad", "Nigeria", "Ghana", "Ivory Coast", "Senegal", "Guinea",
    "Burkina Faso", "Benin", "Togo", "Sierra Leone", "Liberia",
    "Cameroon", "Central African Republic", "Gabon", "Congo",
    "Equatorial Guinea", "Sao Tome and Principe", "Angola", "Zambia",
    "Malawi", "Mozambique", "Zimbabwe", "Botswana", "Namibia",
    "South Africa", "Lesotho", "Eswatini", "Madagascar", "Mauritius",
    "Seychelles", "Comoros", "Djibouti", "Eritrea", "Gambia",
    "Guinea-Bissau", "Cape Verde"
  ];

  const tanzaniaRegions = [
    "Dar es Salaam", "Arusha", "Kilimanjaro", "Tanga", "Morogoro", 
    "Pwani", "Dodoma", "Singida", "Tabora", "Rukwa", 
    "Kigoma", "Shinyanga", "Kagera", "Mwanza", "Mara", 
    "Manyara", "Mbeya", "Iringa", "Ruvuma", "Lindi", 
    "Mtwara", "Zanzibar Urban/West", "Zanzibar North", "Zanzibar South"
  ];

  const mainCategories = [
    "Electronics & Computers",
    "Fashion & Clothing",
    "Beauty & Personal Care",
    "Home Appliances",
    "Vehicles & Auto Parts",
    "General Goods",
    "Other"
  ];

  const subCategories = {
    "Electronics & Computers": {
      "Laptops": ["Gaming Laptops", "Business Laptops", "Student Laptops", "Convertible Laptops"],
      "Desktop Computers": ["Gaming PC", "Office Desktop", "All-in-One PC"],
      "Smartphones": ["Android Phones", "iPhone", "Basic Phones"],
      "Tablets": ["iPad", "Android Tablets", "Windows Tablets"],
      "Computer Accessories": ["RAM", "SSD", "Hard Drives", "Motherboards", "Processors"],
      "Computer Peripherals": ["Monitors", "Keyboards", "Mice", "Printers", "Scanners"],
      "Networking": ["Routers", "Switches", "Modems", "Network Cables"],
      "Electronics Parts": ["Batteries", "Chargers", "Adaptors", "Cables"],
      "Other Electronics": ["TVs", "Cameras", "Speakers", "Headphones"]
    },
    "Fashion & Clothing": {
      "Clothing": ["T-shirts", "Shirts", "Trousers", "Jeans", "Dresses", "Skirts", "Jackets", "Suits"],
      "Footwear": ["Shoes", "Sneakers", "Sandals", "Heels", "Boots"],
      "Fashion Accessories": ["Belts", "Bags", "Handbags", "Wallets", "Watches", "Sunglasses", "Hats", "Caps", "Scarves"],
      "Jewelry": ["Necklaces", "Rings", "Bracelets", "Earrings", "Anklets"]
    },
    "Beauty & Personal Care": {
      "Skincare": ["Face Creams", "Body Lotions", "Sunscreen", "Cleansers"],
      "Hair Care": ["Shampoo", "Conditioner", "Hair Oil", "Hair Color"],
      "Makeup": ["Lipstick", "Foundation", "Mascara", "Eyeshadow"],
      "Fragrances": ["Perfumes", "Body Sprays", "Deodorants"],
      "Personal Hygiene": ["Soaps", "Toothpaste", "Sanitary Products"],
      "Beauty Accessories": ["Makeup Brushes", "Hair Brushes", "Mirrors", "Beauty Kits"]
    },
    "Home Appliances": {
      "Kitchen Appliances": ["Refrigerators", "Microwaves", "Blenders", "Cookers"],
      "Cleaning Appliances": ["Vacuum Cleaners", "Washing Machines", "Iron Boxes"],
      "Home Electronics": ["TVs", "Home Theaters", "Air Conditioners", "Fans"],
      "Furniture": ["Sofas", "Beds", "Tables", "Chairs"],
      "Home Decor": ["Curtains", "Carpets", "Wall Art", "Lighting"]
    },
    "Vehicles & Auto Parts": {
      "Cars": ["Sedan", "SUV", "Hatchback", "Truck"],
      "Motorcycles": ["Sport Bikes", "Scooters", "Cruisers"],
      "Bicycles": ["Mountain Bikes", "Road Bikes", "Electric Bikes"],
      "Auto Parts": ["Engine Parts", "Brake Systems", "Suspension", "Electrical Parts"],
      "Accessories": ["Car Audio", "Seat Covers", "Car Care", "Tools"]
    },
    "General Goods": {
      "Food & Beverages": ["Packaged Foods", "Beverages", "Snacks"],
      "Household Items": ["Utensils", "Containers", "Cleaning Supplies"],
      "Stationery": ["Books", "Pens", "Office Supplies"],
      "Toys & Games": ["Children Toys", "Board Games", "Sports Equipment"]
    }
  };

  const conditionOptions = ["New", "Used - Like New", "Used - Good", "Used - Fair", "Refurbished"];
  const commonBrands = [
    "Generic", "Local Brand", "Other",
    "Apple", "Samsung", "Dell", "HP", "Lenovo", "Asus", "Acer", "Microsoft", "Toshiba", "Sony",
    "LG", "Intel", "AMD", "NVIDIA", "Corsair", "Kingston", "Western Digital", "Seagate", "TP-Link",
    "Nike", "Adidas", "Puma", "Gucci", "Louis Vuitton", "Zara", "H&M", "Levi's",
    "L'Oréal", "Maybelline", "MAC", "Nivea", "Vaseline", "Dove", "Garnier",
    "Toyota", "Honda", "Ford", "BMW", "Mercedes", "Yamaha", "Suzuki"
  ];

  const stockStatusOptions = ["Available", "Limited", "Out of Stock"];
  const priceTypeOptions = ["Fixed", "Negotiable"];
  const warrantyOptions = ["Yes", "No"];

  const getCurrencySymbol = () => {
    return "TZS";
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === "description") {
      const words = value.trim().split(/\s+/).filter(word => word.length > 0);
      if (words.length <= 200) {
        setFormData({ ...formData, [name]: value });
      } else {
        const limitedWords = words.slice(0, 200).join(' ');
        setFormData({ ...formData, [name]: limitedWords });
      }
      return;
    }
    
    if (name === "country" && value !== "Tanzania") {
      setFormData(prev => ({ ...prev, [name]: value, region: "" }));
    } else {
      setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    }
    
    // Remove from incomplete fields when user fills it
    if (incompleteFields.includes(name)) {
      setIncompleteFields(prev => prev.filter(field => field !== name));
    }
  };

  const handleFileChange = async (e, fileType) => {
    const selectedFiles = e.target.files;

    if (fileType === 'productImages') {
      const newFiles = Array.from(selectedFiles).slice(0, 7);
      const newPreviews = [];

      // Show loading indicator
      setIsLoading(true);
      console.log(`📸 Processing ${newFiles.length} images...`);

      for (const file of newFiles) {
        const preview = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = async (e) => {
            // 🔥 COMPRESS EACH IMAGE AUTOMATICALLY!
            const original = e.target.result;
            const originalSize = Math.round((original.length * 3) / 4 / 1024);
            console.log(`📸 Original image size: ${originalSize}KB`);

            // Compress the image
            const compressed = await compressImage(original, 600, 0.7);
            const compressedSize = Math.round((compressed.length * 3) / 4 / 1024);
            console.log(`📸 Compressed: ${originalSize}KB → ${compressedSize}KB`);

            resolve(compressed);
          };
          reader.readAsDataURL(file);
        });
        newPreviews.push(preview);
      }

      setFilePreviews(prev => ({ ...prev, productImages: newPreviews }));
      setFiles(prev => ({ ...prev, productImages: newFiles }));
      setIsLoading(false);

      // Remove from incomplete fields
      if (incompleteFields.includes('productImages')) {
        setIncompleteFields(prev => prev.filter(field => field !== 'productImages'));
      }

    } else if (fileType === 'shopImage') {
      const file = selectedFiles[0];
      if (file) {
        setIsLoading(true);
        const reader = new FileReader();
        reader.onload = async (e) => {
          const original = e.target.result;
          const originalSize = Math.round((original.length * 3) / 4 / 1024);
          console.log(`📸 Original shop image size: ${originalSize}KB`);

          const compressed = await compressImage(original, 400, 0.6);
          const compressedSize = Math.round((compressed.length * 3) / 4 / 1024);
          console.log(`📸 Compressed shop image: ${originalSize}KB → ${compressedSize}KB`);

          setFilePreviews(prev => ({ ...prev, shopImage: compressed }));
          setIsLoading(false);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const nextStep = () => {
    // 🔥 Prevent multiple clicks
    if (isLoading) return;
    
    const stepValid = validateStep(currentStep);
    const missingFields = getMissingFields(currentStep);
    
    if (!stepValid) {
      setIncompleteFields(missingFields);
      if (missingFields.length > 0) {
        const firstField = missingFields[0];
        setAnimateField(firstField);
        if (fieldRefs.current[firstField]) {
          fieldRefs.current[firstField].scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }
      }
      return;
    }
    
    if (currentStep < 3) {
      setIsLoading(true);
      setCurrentStep(currentStep + 1);
      setProgress(((currentStep + 1) / 3) * 100);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Reset loading after animation
      setTimeout(() => setIsLoading(false), 300);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setProgress(((currentStep - 1) / 3) * 100);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // ✅ Get missing fields for current step
  const getMissingFields = (step) => {
    const missing = [];
    
    switch (step) {
      case 1:
        if (!formData.shopName.trim()) missing.push('shopName');
        if (!formData.country.trim()) missing.push('country');
        if (!formData.whatsappNumber.trim()) missing.push('whatsappNumber');
        if (formData.country === "Tanzania" && !formData.region.trim()) missing.push('region');
        if (!formData.district.trim()) missing.push('district');
        if (!formData.area.trim()) missing.push('area');
        break;
      case 2:
        if (!formData.mainCategory.trim()) missing.push('mainCategory');
        if (!formData.productName.trim()) missing.push('productName');
        if (!formData.description.trim()) missing.push('description');
        if (!formData.price.trim()) missing.push('price');
        if (files.productImages.length === 0) missing.push('productImages');
        break;
      case 3:
        if (!formData.confirmAvailability) missing.push('confirmAvailability');
        if (!formData.agreeToUpdate) missing.push('agreeToUpdate');
        break;
      default:
        break;
    }
    
    return missing;
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return (
          formData.shopName.trim() !== "" &&
          formData.country.trim() !== "" &&
          formData.whatsappNumber.trim() !== "" &&
          (formData.country === "Tanzania" ? formData.region.trim() !== "" : true) &&
          formData.district.trim() !== "" &&
          formData.area.trim() !== ""
        );
      case 2:
        return (
          formData.mainCategory.trim() !== "" &&
          formData.productName.trim() !== "" &&
          formData.description.trim() !== "" &&
          formData.price.trim() !== "" &&
          files.productImages.length > 0
        );
      case 3:
        return (
          formData.confirmAvailability &&
          formData.agreeToUpdate
        );
      default:
        return false;
    }
  };

  const requiresSpecifications = () => {
    const specCategories = ["Electronics & Computers", "Home Appliances", "Vehicles & Auto Parts"];
    return specCategories.includes(formData.mainCategory);
  };

  const requiresFashionDetails = () => {
    return formData.mainCategory === "Fashion & Clothing";
  };

  // ============== HANDLE SUBMIT WITH APICLIENT - FIXED 🔥 ==============
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 🔥 CRITICAL: Prevent multiple submissions
    if (isSubmitting) {
      console.log("⏳ Already submitting, please wait...");
      return;
    }
    
    setError("");
    setSuccess("");
    
    // Validate step 3 before submitting
    const stepValid = validateStep(3);
    const missingFields = getMissingFields(3);
    
    if (!stepValid) {
      setIncompleteFields(missingFields);
      if (missingFields.length > 0) {
        const firstField = missingFields[0];
        setAnimateField(firstField);
        if (fieldRefs.current[firstField]) {
          fieldRefs.current[firstField].scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }
      }
      return;
    }

    if (files.productImages.length === 0) {
      setError("Please upload at least one product image");
      setIncompleteFields(['productImages']);
      setAnimateField('productImages');
      if (fieldRefs.current['productImages']) {
        fieldRefs.current['productImages'].scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
      return;
    }

    if (!authUser) {
      setError("Authentication required. Please login first.");
      return;
    }

    // 🔥 SET SUBMITTING TRUE - PREVENTS MULTIPLE CLICKS
    setIsSubmitting(true);

    try {
      const isEditOperation = location.state?.action === "edit-product" && location.state?.product;
      const existingProduct = isEditOperation ? location.state.product : null;
      
      const productImagesData = filePreviews.productImages.length > 0 
        ? filePreviews.productImages.slice(0, 7)
        : existingProduct?.productImages || ["https://images.unsplash.com/photo-1556656793-08538906a9f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"];
      
      const shopImageData = filePreviews.shopImage 
        ? filePreviews.shopImage 
        : existingProduct?.shopImage || "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80";
      
      const userPicture = getUserProfilePicture();

      console.log("📤 Preparing product data for backend...");
      
      const productData = {
        product_name: formData.productName,
        shop_name: formData.shopName,
        seller_name: authUser.name || authUser.displayName || authUser.email?.split('@')[0] || "Seller",
        seller: authUser.id || authUser.uid,
        main_category: formData.mainCategory,
        product_category: formData.subCategory,
        sub_category: formData.subCategory,
        brand: formData.brand,
        description: formData.description,
        specifications: formData.specifications,
        product_images: productImagesData,
        shop_image: shopImageData,
        price: parseFloat(formData.price) || 0,
        currency: "TZS",
        price_type: formData.priceType,
        stock_status: formData.stockStatus,
        quantity_available: parseInt(formData.quantityAvailable) || 0,
        condition: formData.condition,
        warranty: formData.warranty,
        warranty_period: formData.warrantyPeriod,
        size: formData.size,
        color: formData.color,
        material: formData.material,
        country: "Tanzania",
        region: formData.region,
        district: formData.district,
        area: formData.area,
        street: formData.street,
        map_location: formData.mapLocation,
        opening_hours: formData.openingHours,
        phone_number: formData.whatsappNumber,
        whatsapp_number: formData.whatsappNumber,
        email: authUser.email,
        features: [],
        is_active: true,
        is_verified: false,
        business_type: "Retail Shop",
        profile_picture: userPicture
      };

      console.log("📤 Sending product data to backend with apiClient...");

      let response;
      if (isEditOperation && existingProduct?.id) {
        response = await apiClient.put(`/api/products/${existingProduct.id}/`, productData);
        console.log("✅ Product updated:", response.data);
      } else {
        response = await apiClient.post('/api/products/', productData);
        console.log("✅ Product created:", response.data);
      }

      const result = response.data;

      let allSellers = [];
      try {
        allSellers = JSON.parse(localStorage.getItem('allSellersData') || '[]');
      } catch (e) {
        allSellers = [];
      }
      
      const sellerDataToStore = {
        id: result.id || Date.now(),
        email: authUser.email,
        name: authUser.name || authUser.displayName || authUser.email?.split('@')[0] || "Seller",
        displayName: authUser.name || authUser.displayName || authUser.email?.split('@')[0] || "Seller",
        picture: userPicture,
        photo: userPicture,
        ...formData,
        businessType: "Retail Shop",
        productImages: productImagesData,
        shopImage: shopImageData,
        registrationDate: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      };
      
      const existingIndex = allSellers.findIndex(seller => 
        seller.id === sellerDataToStore.id || 
        (seller.email?.toLowerCase() === authUser.email?.toLowerCase() && seller.productName === formData.productName)
      );
      
      if (existingIndex !== -1) {
        allSellers[existingIndex] = sellerDataToStore;
      } else {
        allSellers.push(sellerDataToStore);
      }
      
      saveToAllStorages('allSellersData', JSON.stringify(allSellers));

      if (!isVendorRegistered(authUser.email)) {
        registerVendorToContext(sellerDataToStore);
      }

      dispatchProductsUpdatedEvent(isEditOperation ? 'update' : 'add', sellerDataToStore);

      const successMessage = isEditOperation 
        ? "✅ Product updated successfully! Redirecting to your profile..." 
        : "✅ Registration successful! Redirecting to your profile...";
      
      setSuccess(successMessage);
      
      // 🔥 DON'T SET isSubmitting FALSE - we're navigating away
      
      setTimeout(() => {
        navigate('/seller-profile', { 
          replace: true,
          state: { 
            success: isEditOperation ? "Product updated successfully!" : "Registration completed successfully!" 
          }
        });
      }, 1500);

    } catch (error) {
      console.error("❌ Registration error:", error);
      
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message || 
                          error.message || 
                          "Registration failed. Please try again.";
      
      setError(errorMessage);
      
      if (error.response) {
        console.error("🔍 Error status:", error.response.status);
        console.error("🔍 Error data:", error.response.data);
      }
      
      // 🔥 Allow retry on error
      setIsSubmitting(false);
    }
    // 🔥 NOT setting isSubmitting false on success - we're navigating away
  };

  const removeProductImage = (index) => {
    setFiles(prev => ({
      ...prev,
      productImages: prev.productImages.filter((_, i) => i !== index)
    }));
    setFilePreviews(prev => ({
      ...prev,
      productImages: prev.productImages.filter((_, i) => i !== index)
    }));
  };

  if (isLoading && currentStep === 1) {
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
          <p style={{ 
            color: "#5f6368", 
            fontSize: "14px",
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif"
          }}>
            Loading...
          </p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#FFFFFF",
        padding: "20px 0"
      }}
      id="vendor-register-top"
    >
      <div className="container" style={{ maxWidth: "800px" }}>
        {/* Header */}
        <div className="text-center mb-5">
          <div style={{
            width: "80px",
            height: "80px",
            backgroundColor: "#f8f9fa",
            borderRadius: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
            border: "2px solid #000000"
          }}>
            <span style={{ fontSize: "2rem", color: "#000000" }}>
              {location.state?.action === "edit-product" ? "✏️" : "🏪"}
            </span>
          </div>
          
          <h1 className="mb-2" style={{
            color: "#000000",
            fontWeight: "700",
            fontSize: "2rem"
          }}>
            {location.state?.action === "edit-product" 
              ? "Edit Your Product" 
              : location.state?.action === "add-product" 
                ? "Add New Product"
                : "Complete Your Seller Registration"}
          </h1>
          <p className="text-muted" style={{ fontSize: "0.95rem" }}>
            {location.state?.action === "edit-product"
              ? "Update your product details"
              : location.state?.action === "add-product"
                ? "Add a new product to your shop"
                : "Add your shop details and list your products"}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "0.5rem"
          }}>
            {["Shop Details", "Product Info", "Confirmation"].map((step, index) => (
              <div key={index} className="text-center" style={{ flex: 1 }}>
                <div style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  backgroundColor: currentStep > index + 1 ? "rgba(0, 0, 0, 0.1)" : currentStep === index + 1 ? "rgba(0, 0, 0, 0.1)" : "#f8f9fa",
                  color: currentStep > index + 1 ? "#000000" : currentStep === index + 1 ? "#000000" : "#666",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 0.5rem",
                  border: currentStep === index + 1 ? "2px solid #000000" : "2px solid #d0d0d0",
                  fontWeight: "600",
                  fontSize: "1.1rem"
                }}>
                  {currentStep > index + 1 ? "✓" : index + 1}
                </div>
                <span style={{
                  color: currentStep === index + 1 ? "#000000" : "#666",
                  fontSize: "0.85rem",
                  fontWeight: currentStep === index + 1 ? "600" : "400"
                }}>
                  {step}
                </span>
              </div>
            ))}
          </div>
          
          <div style={{
            height: "6px",
            backgroundColor: "#f8f9fa",
            borderRadius: "3px",
            overflow: "hidden",
            marginBottom: "2rem",
            border: "1px solid #d0d0d0"
          }}>
            <div style={{
              height: "100%",
              width: `${progress}%`,
              backgroundColor: "#000000",
              borderRadius: "3px",
              transition: "width 0.3s ease"
            }}></div>
          </div>
        </div>

        {/* Registration Form Card */}
        <div className="card" style={{
          border: "2px solid #d0d0d0",
          borderRadius: "24px",
          backgroundColor: "#FFFFFF",
          overflow: "hidden"
        }}>
          <div className="card-header" style={{
            backgroundColor: "#f8f9fa",
            borderBottom: "2px solid #d0d0d0",
            padding: "20px 24px"
          }}>
            <div className="d-flex justify-content-between align-items-center">
              <h3 className="mb-0" style={{ color: "#000000", fontSize: "1.3rem", fontWeight: "600" }}>
                Step {currentStep}: {currentStep === 1 ? "Shop Details" : currentStep === 2 ? "Product Information" : "Confirmation"}
              </h3>
              <span className="badge" style={{
                backgroundColor: "rgba(0, 0, 0, 0.1)",
                color: "#000000",
                padding: "8px 16px",
                borderRadius: "8px",
                fontWeight: "600",
                fontSize: "0.9rem",
                border: "2px solid #d0d0d0"
              }}>
                {location.state?.action === "edit-product" ? "✏️ Edit Product" : 
                 location.state?.action === "add-product" ? "➕ Add Product" : 
                 "🧾 Complete Registration"}
              </span>
            </div>
          </div>

          <div className="card-body p-4">
            {error && (
              <div className="alert alert-danger d-flex align-items-center mb-4" role="alert" style={{
                borderRadius: "16px",
                padding: "14px 18px",
                fontSize: "0.95rem",
                border: "2px solid rgba(220, 53, 69, 0.3)",
                backgroundColor: "rgba(220, 53, 69, 0.08)"
              }}>
                <i className="fas fa-exclamation-triangle me-2" style={{ color: "#dc3545" }}></i>
                {error}
              </div>
            )}

            {success && (
              <div className="alert alert-success d-flex align-items-center mb-4" role="alert" style={{
                borderRadius: "16px",
                padding: "14px 18px",
                fontSize: "0.95rem",
                border: "2px solid rgba(40, 167, 69, 0.3)",
                backgroundColor: "rgba(40, 167, 69, 0.08)"
              }}>
                <i className="fas fa-check-circle me-2" style={{ color: "#28a745" }}></i>
                {success}
              </div>
            )}

            <div className="alert alert-info mb-4" style={{
              backgroundColor: "rgba(0, 0, 0, 0.05)",
              border: "2px solid rgba(0, 0, 0, 0.3)",
              color: "#333",
              borderRadius: "16px",
              padding: "14px 18px",
              fontSize: "0.95rem"
            }}>
              <div className="d-flex align-items-center">
                <div className="me-3">
                  <ProfileImage size={60} showBorder={true} />
                </div>
                <div>
                  <strong style={{ fontSize: "1.1rem" }}>Registering as:</strong> 
                  <span style={{ fontWeight: "600", marginLeft: "4px" }}>
                    {authUser?.name || authUser?.displayName || authUser?.email?.split('@')[0] || "Seller"}
                  </span>
                  <div className="text-muted" style={{ fontSize: "0.85rem", marginTop: "2px" }}>
                    <i className="fab fa-google me-1" style={{ color: "#DB4437" }}></i>
                    Google Account • {authUser?.email}
                  </div>
                  {getUserProfilePicture() && getUserProfilePicture().includes('googleusercontent.com') && (
                    <div className="mt-1">
                      <span style={{ 
                        fontSize: "0.75rem", 
                        backgroundColor: "#28a745", 
                        color: "white", 
                        padding: "2px 8px", 
                        borderRadius: "12px",
                        display: "inline-block"
                      }}>
                        <i className="fas fa-check-circle me-1"></i>
                        PERMANENT Google profile picture
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <form onSubmit={currentStep === 3 ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }}>
              {/* Step 1: Shop Information */}
              {currentStep === 1 && (
                <div>
                  <h5 className="mb-4" style={{ color: "#000000", fontSize: "1.1rem", fontWeight: "600" }}>
                    <i className="fas fa-store me-2" style={{ color: "#000000" }}></i>
                    A. Taarifa za Duka
                  </h5>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="shopName" className="form-label" style={{ color: "#333", fontWeight: "600", fontSize: "0.95rem" }}>
                        Shop Name <span className="text-danger">*</span>
                      </label>
                      <input
                        ref={el => fieldRefs.current['shopName'] = el}
                        type="text"
                        className={`form-control ${incompleteFields.includes('shopName') ? 'incomplete-field' : ''} ${animateField === 'shopName' ? 'field-animation' : ''}`}
                        id="shopName"
                        name="shopName"
                        value={formData.shopName}
                        onChange={handleInputChange}
                        required
                        disabled={isLoading || isSubmitting}
                        placeholder="e.g., Tech Hub Computer Store"
                        style={{
                          backgroundColor: "#FFFFFF",
                          border: "2px solid #d0d0d0",
                          color: "#333",
                          padding: "14px 18px",
                          borderRadius: "16px",
                          fontSize: "1rem"
                        }}
                      />
                      {incompleteFields.includes('shopName') && (
                        <small className="text-danger mt-1 d-block">
                          <i className="fas fa-exclamation-circle me-1"></i>
                          Shop name is required
                        </small>
                      )}
                    </div>

                    {/* Country Selection - Fixed to Tanzania */}
                    <div className="col-md-6 mb-3">
                      <label htmlFor="country" className="form-label" style={{ color: "#333", fontWeight: "600", fontSize: "0.95rem" }}>
                        Country <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="country"
                        name="country"
                        value="Tanzania"
                        readOnly
                        disabled
                        style={{
                          backgroundColor: "#f8f9fa",
                          border: "2px solid #d0d0d0",
                          color: "#333",
                          padding: "14px 18px",
                          borderRadius: "16px",
                          fontSize: "1rem"
                        }}
                      />
                      <small className="text-muted" style={{ fontSize: "0.85rem" }}>
                        Currency: Tanzanian Shilling (TZS)
                      </small>
                    </div>

                    {/* WhatsApp Number Field */}
                    <div className="col-md-6 mb-3">
                      <label htmlFor="whatsappNumber" className="form-label" style={{ color: "#333", fontWeight: "600", fontSize: "0.95rem" }}>
                        WhatsApp Number <span className="text-danger">*</span>
                        <i className="fab fa-whatsapp ms-2" style={{ color: "#25D366" }}></i>
                      </label>
                      <input
                        ref={el => fieldRefs.current['whatsappNumber'] = el}
                        type="tel"
                        className={`form-control ${incompleteFields.includes('whatsappNumber') ? 'incomplete-field' : ''} ${animateField === 'whatsappNumber' ? 'field-animation' : ''}`}
                        id="whatsappNumber"
                        name="whatsappNumber"
                        value={formData.whatsappNumber}
                        onChange={handleInputChange}
                        required
                        disabled={isLoading || isSubmitting}
                        placeholder="e.g., 255712345678 au +255712345678"
                        style={{
                          backgroundColor: "#FFFFFF",
                          border: "2px solid #d0d0d0",
                          color: "#333",
                          padding: "14px 18px",
                          borderRadius: "16px",
                          fontSize: "1rem"
                        }}
                      />
                      <small className="text-muted d-block mt-1" style={{ fontSize: "0.85rem" }}>
                        Wateja watakuwasiliana nawe kupitia namba hii ya WhatsApp
                      </small>
                      {incompleteFields.includes('whatsappNumber') && (
                        <small className="text-danger mt-1 d-block">
                          <i className="fas fa-exclamation-circle me-1"></i>
                          WhatsApp number is required
                        </small>
                      )}
                    </div>

                    {/* Region */}
                    <div className="col-md-6 mb-3">
                      <label htmlFor="region" className="form-label" style={{ color: "#333", fontWeight: "600", fontSize: "0.95rem" }}>
                        Region <span className="text-danger">*</span>
                      </label>
                      <select
                        ref={el => fieldRefs.current['region'] = el}
                        className={`form-select ${incompleteFields.includes('region') ? 'incomplete-field' : ''} ${animateField === 'region' ? 'field-animation' : ''}`}
                        id="region"
                        name="region"
                        value={formData.region}
                        onChange={handleInputChange}
                        required
                        disabled={isLoading || isSubmitting}
                        style={{
                          backgroundColor: "#FFFFFF",
                          border: "2px solid #d0d0d0",
                          color: "#333",
                          padding: "14px 18px",
                          borderRadius: "16px",
                          fontSize: "1rem"
                        }}
                      >
                        <option value="">Select Region</option>
                        {tanzaniaRegions.map(region => (
                          <option key={region} value={region}>{region}</option>
                        ))}
                      </select>
                      {incompleteFields.includes('region') && (
                        <small className="text-danger mt-1 d-block">
                          <i className="fas fa-exclamation-circle me-1"></i>
                          Region is required
                        </small>
                      )}
                    </div>

                    <div className="col-md-6 mb-3">
                      <label htmlFor="district" className="form-label" style={{ color: "#333", fontWeight: "600", fontSize: "0.95rem" }}>
                        District / City <span className="text-danger">*</span>
                      </label>
                      <input
                        ref={el => fieldRefs.current['district'] = el}
                        type="text"
                        className={`form-control ${incompleteFields.includes('district') ? 'incomplete-field' : ''} ${animateField === 'district' ? 'field-animation' : ''}`}
                        id="district"
                        name="district"
                        value={formData.district}
                        onChange={handleInputChange}
                        required
                        disabled={isLoading || isSubmitting}
                        placeholder="e.g., Ilala, Kinondoni"
                        style={{
                          backgroundColor: "#FFFFFF",
                          border: "2px solid #d0d0d0",
                          color: "#333",
                          padding: "14px 18px",
                          borderRadius: "16px",
                          fontSize: "1rem"
                        }}
                      />
                      {incompleteFields.includes('district') && (
                        <small className="text-danger mt-1 d-block">
                          <i className="fas fa-exclamation-circle me-1"></i>
                          District is required
                        </small>
                      )}
                    </div>

                    <div className="col-md-6 mb-3">
                      <label htmlFor="area" className="form-label" style={{ color: "#333", fontWeight: "600", fontSize: "0.95rem" }}>
                        Area / Ward <span className="text-danger">*</span>
                      </label>
                      <input
                        ref={el => fieldRefs.current['area'] = el}
                        type="text"
                        className={`form-control ${incompleteFields.includes('area') ? 'incomplete-field' : ''} ${animateField === 'area' ? 'field-animation' : ''}`}
                        id="area"
                        name="area"
                        value={formData.area}
                        onChange={handleInputChange}
                        required
                        disabled={isLoading || isSubmitting}
                        placeholder="e.g., Kariakoo, Masaki"
                        style={{
                          backgroundColor: "#FFFFFF",
                          border: "2px solid #d0d0d0",
                          color: "#333",
                          padding: "14px 18px",
                          borderRadius: "16px",
                          fontSize: "1rem"
                        }}
                      />
                      {incompleteFields.includes('area') && (
                        <small className="text-danger mt-1 d-block">
                          <i className="fas fa-exclamation-circle me-1"></i>
                          Area is required
                        </small>
                      )}
                    </div>

                   
                    {/* Map Location Field - Optional */}
                    <div className="col-md-6 mb-3">
                      <label htmlFor="mapLocation" className="form-label" style={{ color: "#333", fontWeight: "600", fontSize: "0.95rem" }}>
                        Google Map Location (Optional)
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="mapLocation"
                        name="mapLocation"
                        value={formData.mapLocation}
                        onChange={handleInputChange}
                        disabled={isLoading || isSubmitting}
                        placeholder="Paste Google Maps link"
                        style={{
                          backgroundColor: "#FFFFFF",
                          border: "2px solid #d0d0d0",
                          color: "#333",
                          padding: "14px 18px",
                          borderRadius: "16px",
                          fontSize: "1rem"
                        }}
                      />
                    </div>

                    {/* Opening Hours Field - Optional */}
                    <div className="col-md-6 mb-3">
                      <label htmlFor="openingHours" className="form-label" style={{ color: "#333", fontWeight: "600", fontSize: "0.95rem" }}>
                        Opening Hours (Optional)
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="openingHours"
                        name="openingHours"
                        value={formData.openingHours}
                        onChange={handleInputChange}
                        disabled={isLoading || isSubmitting}
                        placeholder="e.g., Mon-Fri 8AM-6PM, Sat 9AM-4PM"
                        style={{
                          backgroundColor: "#FFFFFF",
                          border: "2px solid #d0d0d0",
                          color: "#333",
                          padding: "14px 18px",
                          borderRadius: "16px",
                          fontSize: "1rem"
                        }}
                      />
                    </div>

                    {/* Currency Info Display */}
                    <div className="col-md-6 mb-3">
                      <div className="card" style={{
                        backgroundColor: "#f8f9fa",
                        border: "2px solid #d0d0d0",
                        borderRadius: "16px",
                        padding: "12px"
                      }}>
                        <div className="d-flex align-items-center">
                          <div style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "8px",
                            backgroundColor: "#1B5E20",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#FFFFFF",
                            marginRight: "12px",
                            fontSize: "18px"
                          }}>
                            TZS
                          </div>
                          <div>
                            <h6 className="mb-0" style={{ fontSize: "0.95rem", fontWeight: "600" }}>
                              Tanzanian Shilling (TZS)
                            </h6>
                            <small className="text-muted">
                              All prices will be displayed in Tanzanian Shillings
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Product Details */}
              {currentStep === 2 && (
                <div>
                  <h5 className="mb-4" style={{ color: "#000000", fontSize: "1.1rem", fontWeight: "600" }}>
                    <i className="fas fa-box me-2" style={{ color: "#000000" }}></i>
                    B. Taarifa za Bidhaa
                  </h5>
                  
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="mainCategory" className="form-label" style={{ color: "#333", fontWeight: "600", fontSize: "0.95rem" }}>
                        Main Category <span className="text-danger">*</span>
                      </label>
                      <select
                        ref={el => fieldRefs.current['mainCategory'] = el}
                        className={`form-select ${incompleteFields.includes('mainCategory') ? 'incomplete-field' : ''} ${animateField === 'mainCategory' ? 'field-animation' : ''}`}
                        id="mainCategory"
                        name="mainCategory"
                        value={formData.mainCategory}
                        onChange={handleInputChange}
                        required
                        disabled={isLoading || isSubmitting}
                        style={{
                          backgroundColor: "#FFFFFF",
                          border: "2px solid #d0d0d0",
                          color: "#333",
                          padding: "14px 18px",
                          borderRadius: "16px",
                          fontSize: "1rem"
                        }}
                      >
                        <option value="">Select Main Category</option>
                        {mainCategories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                      {incompleteFields.includes('mainCategory') && (
                        <small className="text-danger mt-1 d-block">
                          <i className="fas fa-exclamation-circle me-1"></i>
                          Main category is required
                        </small>
                      )}
                    </div>

                    <div className="col-md-6 mb-3">
                      <label htmlFor="subCategory" className="form-label" style={{ color: "#333", fontWeight: "600", fontSize: "0.95rem" }}>
                        Sub Category
                      </label>
                      <select
                        className="form-select"
                        id="subCategory"
                        name="subCategory"
                        value={formData.subCategory}
                        onChange={handleInputChange}
                        disabled={isLoading || isSubmitting || !formData.mainCategory || !subCategories[formData.mainCategory]}
                        style={{
                          backgroundColor: "#FFFFFF",
                          border: "2px solid #d0d0d0",
                          color: "#333",
                          padding: "14px 18px",
                          borderRadius: "16px",
                          fontSize: "1rem"
                        }}
                      >
                        <option value="">Select Sub Category</option>
                        {formData.mainCategory && subCategories[formData.mainCategory] && 
                          Object.keys(subCategories[formData.mainCategory]).map(subCat => (
                            <option key={subCat} value={subCat}>{subCat}</option>
                          ))
                        }
                      </select>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label htmlFor="productName" className="form-label" style={{ color: "#333", fontWeight: "600", fontSize: "0.95rem" }}>
                        Product Name / Model <span className="text-danger">*</span>
                      </label>
                      <input
                        ref={el => fieldRefs.current['productName'] = el}
                        type="text"
                        className={`form-control ${incompleteFields.includes('productName') ? 'incomplete-field' : ''} ${animateField === 'productName' ? 'field-animation' : ''}`}
                        id="productName"
                        name="productName"
                        value={formData.productName}
                        onChange={handleInputChange}
                        required
                        disabled={isLoading || isSubmitting}
                        placeholder="e.g., HP ProBook 450 G8 / Nike Air Max"
                        style={{
                          backgroundColor: "#FFFFFF",
                          border: "2px solid #d0d0d0",
                          color: "#333",
                          padding: "14px 18px",
                          borderRadius: "16px",
                          fontSize: "1rem"
                        }}
                      />
                      {incompleteFields.includes('productName') && (
                        <small className="text-danger mt-1 d-block">
                          <i className="fas fa-exclamation-circle me-1"></i>
                          Product name is required
                        </small>
                      )}
                    </div>

                    <div className="col-md-6 mb-3">
                      <label htmlFor="brand" className="form-label" style={{ color: "#333", fontWeight: "600", fontSize: "0.95rem" }}>
                        Brand
                      </label>
                      <select
                        className="form-select"
                        id="brand"
                        name="brand"
                        value={formData.brand}
                        onChange={handleInputChange}
                        disabled={isLoading || isSubmitting}
                        style={{
                          backgroundColor: "#FFFFFF",
                          border: "2px solid #d0d0d0",
                          color: "#333",
                          padding: "14px 18px",
                          borderRadius: "16px",
                          fontSize: "1rem"
                        }}
                      >
                        <option value="">Select Brand</option>
                        {commonBrands.map(brand => (
                          <option key={brand} value={brand}>{brand}</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-12 mb-3">
                      <label htmlFor="description" className="form-label" style={{ color: "#333", fontWeight: "600", fontSize: "0.95rem" }}>
                        Product Description <span className="text-danger">*</span>
                        <span style={{ 
                          fontSize: "0.8rem", 
                          marginLeft: "10px",
                          color: wordCount >= 200 ? "#dc3545" : "#28a745",
                          fontWeight: "normal"
                        }}>
                          {wordCount}/200 maneno
                        </span>
                      </label>
                      <textarea
                        ref={el => fieldRefs.current['description'] = el}
                        className={`form-control ${incompleteFields.includes('description') ? 'incomplete-field' : ''} ${animateField === 'description' ? 'field-animation' : ''}`}
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                        disabled={isLoading || isSubmitting}
                        placeholder="Describe your product in detail... (Max 200 words)"
                        rows="4"
                        style={{
                          backgroundColor: "#FFFFFF",
                          border: `2px solid ${wordCount >= 200 ? "#dc3545" : incompleteFields.includes('description') ? '#dc3545' : '#d0d0d0'}`,
                          color: "#333",
                          padding: "14px 18px",
                          borderRadius: "16px",
                          fontSize: "1rem"
                        }}
                      ></textarea>
                      {wordCount >= 200 && (
                        <small className="text-danger d-block mt-1">
                          <i className="fas fa-exclamation-circle me-1"></i>
                          Umefikia kikomo cha maneno 200
                        </small>
                      )}
                      {incompleteFields.includes('description') && (
                        <small className="text-danger mt-1 d-block">
                          <i className="fas fa-exclamation-circle me-1"></i>
                          Description is required
                        </small>
                      )}
                    </div>

                    <div className="col-md-6 mb-3">
                      <label htmlFor="condition" className="form-label" style={{ color: "#333", fontWeight: "600", fontSize: "0.95rem" }}>
                        Condition
                      </label>
                      <select
                        className="form-select"
                        id="condition"
                        name="condition"
                        value={formData.condition}
                        onChange={handleInputChange}
                        disabled={isLoading || isSubmitting}
                        style={{
                          backgroundColor: "#FFFFFF",
                          border: "2px solid #d0d0d0",
                          color: "#333",
                          padding: "14px 18px",
                          borderRadius: "16px",
                          fontSize: "1rem"
                        }}
                      >
                        {conditionOptions.map(condition => (
                          <option key={condition} value={condition}>{condition}</option>
                        ))}
                      </select>
                    </div>

                    {requiresSpecifications() && (
                      <div className="col-12 mb-3">
                        <label htmlFor="specifications" className="form-label" style={{ color: "#333", fontWeight: "600", fontSize: "0.95rem" }}>
                          Specifications / Details
                        </label>
                        <textarea
                          className="form-control"
                          id="specifications"
                          name="specifications"
                          value={formData.specifications}
                          onChange={handleInputChange}
                          disabled={isLoading || isSubmitting}
                          placeholder={
                            formData.mainCategory === "Electronics & Computers" 
                              ? "e.g., Intel i5, 8GB RAM, 512GB SSD, Windows 11" 
                              : formData.mainCategory === "Home Appliances"
                              ? "e.g., Capacity: 300L, Energy Rating: A++, Color: Silver"
                              : "e.g., Engine: 1500cc, Year: 2020, Fuel: Petrol"
                          }
                          rows="3"
                          style={{
                            backgroundColor: "#FFFFFF",
                            border: "2px solid #d0d0d0",
                            color: "#333",
                            padding: "14px 18px",
                            borderRadius: "16px",
                            fontSize: "1rem"
                          }}
                        ></textarea>
                      </div>
                    )}

                    {requiresFashionDetails() && (
                      <div className="row mb-3">
                        <div className="col-md-4 mb-3">
                          <label htmlFor="size" className="form-label" style={{ color: "#333", fontWeight: "600", fontSize: "0.95rem" }}>
                            Size (Optional)
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="size"
                            name="size"
                            value={formData.size}
                            onChange={handleInputChange}
                            disabled={isLoading || isSubmitting}
                            placeholder="e.g., M, L, XL, 42, 10"
                            style={{
                              backgroundColor: "#FFFFFF",
                              border: "2px solid #d0d0d0",
                              color: "#333",
                              padding: "14px 18px",
                              borderRadius: "16px",
                              fontSize: "1rem"
                            }}
                          />
                        </div>

                        <div className="col-md-4 mb-3">
                          <label htmlFor="color" className="form-label" style={{ color: "#333", fontWeight: "600", fontSize: "0.95rem" }}>
                            Color (Optional)
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="color"
                            name="color"
                            value={formData.color}
                            onChange={handleInputChange}
                            disabled={isLoading || isSubmitting}
                            placeholder="e.g., Red, Blue, Black"
                            style={{
                              backgroundColor: "#FFFFFF",
                              border: "2px solid #d0d0d0",
                              color: "#333",
                              padding: "14px 18px",
                              borderRadius: "16px",
                              fontSize: "1rem"
                            }}
                          />
                        </div>

                        <div className="col-md-4 mb-3">
                          <label htmlFor="material" className="form-label" style={{ color: "#333", fontWeight: "600", fontSize: "0.95rem" }}>
                            Material (Optional)
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="material"
                            name="material"
                            value={formData.material}
                            onChange={handleInputChange}
                            disabled={isLoading || isSubmitting}
                            placeholder="e.g., Cotton, Leather, Silk"
                            style={{
                              backgroundColor: "#FFFFFF",
                              border: "2px solid #d0d0d0",
                              color: "#333",
                              padding: "14px 18px",
                              borderRadius: "16px",
                              fontSize: "1rem"
                            }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="col-12 mb-4">
                      <h6 className="mb-3" style={{ color: "#000000", fontSize: "1rem", fontWeight: "600" }}>
                        <i className="fas fa-cubes me-2" style={{ color: "#000000" }}></i>
                        C. Upatikanaji wa Bidhaa
                      </h6>
                      <div className="row">
                        <div className="col-md-4 mb-3">
                          <label htmlFor="stockStatus" className="form-label" style={{ color: "#333", fontWeight: "600", fontSize: "0.95rem" }}>
                            Stock Status
                          </label>
                          <select
                            className="form-select"
                            id="stockStatus"
                            name="stockStatus"
                            value={formData.stockStatus}
                            onChange={handleInputChange}
                            disabled={isLoading || isSubmitting}
                            style={{
                              backgroundColor: "#FFFFFF",
                              border: "2px solid #d0d0d0",
                              color: "#333",
                              padding: "14px 18px",
                              borderRadius: "16px",
                              fontSize: "1rem"
                            }}
                          >
                            {stockStatusOptions.map(status => (
                              <option key={status} value={status}>{status}</option>
                            ))}
                          </select>
                        </div>

                        <div className="col-md-4 mb-3">
                          <label htmlFor="quantityAvailable" className="form-label" style={{ color: "#333", fontWeight: "600", fontSize: "0.95rem" }}>
                            Quantity Available
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            id="quantityAvailable"
                            name="quantityAvailable"
                            value={formData.quantityAvailable}
                            onChange={handleInputChange}
                            disabled={isLoading || isSubmitting}
                            min="0"
                            placeholder="e.g., 10"
                            style={{
                              backgroundColor: "#FFFFFF",
                              border: "2px solid #d0d0d0",
                              color: "#333",
                              padding: "14px 18px",
                              borderRadius: "16px",
                              fontSize: "1rem"
                            }}
                          />
                        </div>

                        <div className="col-md-4 mb-3">
                          <label htmlFor="lastUpdated" className="form-label" style={{ color: "#333", fontWeight: "600", fontSize: "0.95rem" }}>
                            Last Updated (Auto)
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="lastUpdated"
                            name="lastUpdated"
                            value={formData.lastUpdated}
                            readOnly
                            disabled
                            style={{
                              backgroundColor: "#f8f9fa",
                              border: "2px solid #d0d0d0",
                              color: "#666",
                              padding: "14px 18px",
                              borderRadius: "16px",
                              fontSize: "1rem"
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-12 mb-4">
                      <h6 className="mb-3" style={{ color: "#000000", fontSize: "1rem", fontWeight: "600" }}>
                        <i className="fas fa-tag me-2" style={{ color: "#000000" }}></i>
                        D. Bei & Ziada
                      </h6>
                      <div className="row">
                        <div className="col-md-4 mb-3">
                          <label htmlFor="price" className="form-label" style={{ color: "#333", fontWeight: "600", fontSize: "0.95rem" }}>
                            Price (TZS) <span className="text-danger">*</span>
                          </label>
                          <div className="input-group">
                            <span className="input-group-text" style={{
                              backgroundColor: "#f8f9fa",
                              border: "2px solid #d0d0d0",
                              color: "#666",
                              borderRadius: "16px 0 0 16px",
                              borderRight: "none",
                              padding: "14px 18px",
                              fontSize: "1rem",
                              fontWeight: "bold"
                            }}>
                              TZS
                            </span>
                            <input
                              ref={el => fieldRefs.current['price'] = el}
                              type="number"
                              className={`form-control ${incompleteFields.includes('price') ? 'incomplete-field' : ''} ${animateField === 'price' ? 'field-animation' : ''}`}
                              id="price"
                              name="price"
                              value={formData.price}
                              onChange={handleInputChange}
                              required
                              disabled={isLoading || isSubmitting}
                              min="0"
                              placeholder="e.g., 1500000"
                              style={{
                                backgroundColor: "#FFFFFF",
                                border: "2px solid #d0d0d0",
                                borderLeft: "none",
                                color: "#333",
                                padding: "14px 18px",
                                borderRadius: "0 16px 16px 0",
                                fontSize: "1rem"
                              }}
                            />
                          </div>
                          <small className="text-muted d-block mt-1">
                            Price in Tanzanian Shillings (TZS)
                          </small>
                          {incompleteFields.includes('price') && (
                            <small className="text-danger mt-1 d-block">
                              <i className="fas fa-exclamation-circle me-1"></i>
                              Price is required
                            </small>
                          )}
                        </div>

                        <div className="col-md-4 mb-3">
                          <label htmlFor="priceType" className="form-label" style={{ color: "#333", fontWeight: "600", fontSize: "0.95rem" }}>
                            Price Type
                          </label>
                          <select
                            className="form-select"
                            id="priceType"
                            name="priceType"
                            value={formData.priceType}
                            onChange={handleInputChange}
                            disabled={isLoading || isSubmitting}
                            style={{
                              backgroundColor: "#FFFFFF",
                              border: "2px solid #d0d0d0",
                              color: "#333",
                              padding: "14px 18px",
                              borderRadius: "16px",
                              fontSize: "1rem"
                            }}
                          >
                            {priceTypeOptions.map(type => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                          </select>
                        </div>

                        <div className="col-md-4 mb-3">
                          <label htmlFor="warranty" className="form-label" style={{ color: "#333", fontWeight: "600", fontSize: "0.95rem" }}>
                            Warranty
                          </label>
                          <select
                            className="form-select"
                            id="warranty"
                            name="warranty"
                            value={formData.warranty}
                            onChange={handleInputChange}
                            disabled={isLoading || isSubmitting}
                            style={{
                              backgroundColor: "#FFFFFF",
                              border: "2px solid #d0d0d0",
                              color: "#333",
                              padding: "14px 18px",
                              borderRadius: "16px",
                              fontSize: "1rem"
                            }}
                          >
                            {warrantyOptions.map(option => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          </select>
                        </div>

                        {formData.warranty === "Yes" && (
                          <div className="col-md-12 mt-3">
                            <label htmlFor="warrantyPeriod" className="form-label" style={{ color: "#333", fontWeight: "600", fontSize: "0.95rem" }}>
                              Warranty Period
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="warrantyPeriod"
                              name="warrantyPeriod"
                              value={formData.warrantyPeriod}
                              onChange={handleInputChange}
                              disabled={isLoading || isSubmitting}
                              placeholder="e.g., 1 Year, 6 Months, Lifetime"
                              style={{
                                backgroundColor: "#FFFFFF",
                                border: "2px solid #d0d0d0",
                                color: "#333",
                                padding: "14px 18px",
                                borderRadius: "16px",
                                fontSize: "1rem"
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="col-12 mb-4">
                      <h6 className="mb-3" style={{ color: "#000000", fontSize: "1rem", fontWeight: "600" }}>
                        <i className="fas fa-images me-2" style={{ color: "#000000" }}></i>
                        E. Picha
                      </h6>
                      
                      <div className="mb-4">
                        <label className="form-label" style={{ color: "#333", fontWeight: "600", fontSize: "0.95rem" }}>
                          Product Images (1-7) <span className="text-danger">*</span>
                        </label>
                        <div className="mb-3">
                          <input
                            ref={el => fieldRefs.current['productImages'] = el}
                            type="file"
                            className={`form-control ${incompleteFields.includes('productImages') ? 'incomplete-field' : ''} ${animateField === 'productImages' ? 'field-animation' : ''}`}
                            accept="image/*"
                            multiple
                            onChange={(e) => handleFileChange(e, 'productImages')}
                            disabled={isLoading || isSubmitting || files.productImages.length >= 7}
                            style={{
                              backgroundColor: "#FFFFFF",
                              border: `2px solid ${incompleteFields.includes('productImages') ? '#dc3545' : '#d0d0d0'}`,
                              color: "#333",
                              padding: "14px 18px",
                              borderRadius: "16px",
                              fontSize: "1rem"
                            }}
                          />
                          <small className="text-muted d-block mt-1" style={{ fontSize: "0.85rem" }}>
                            Upload 1-7 product images (Max 7). Recommended: Show product from different angles.
                          </small>
                          <small className="text-danger d-block mt-1" style={{ fontSize: "0.85rem" }}>
                            {files.productImages.length}/7 picha zimepakiwa
                          </small>
                          {incompleteFields.includes('productImages') && (
                            <small className="text-danger mt-1 d-block">
                              <i className="fas fa-exclamation-circle me-1"></i>
                              At least one product image is required
                            </small>
                          )}
                        </div>
                        
                        {filePreviews.productImages.length > 0 && (
                          <div className="row mt-3">
                            {filePreviews.productImages.map((preview, index) => (
                              <div key={index} className="col-md-3 col-sm-4 col-6 mb-3">
                                <div className="position-relative">
                                  <img
                                    src={preview}
                                    alt={`Product ${index + 1}`}
                                    className="img-thumbnail"
                                    style={{ 
                                      width: "100%",
                                      height: "120px",
                                      objectFit: "cover",
                                      border: "2px solid #d0d0d0",
                                      borderRadius: "12px"
                                    }}
                                  />
                                  <button
                                    type="button"
                                    className="btn btn-sm position-absolute top-0 end-0 m-1"
                                    onClick={() => removeProductImage(index)}
                                    disabled={isLoading || isSubmitting}
                                    style={{
                                      width: "28px",
                                      height: "28px",
                                      borderRadius: "6px",
                                      padding: "0",
                                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                                      border: "2px solid #dc3545",
                                      color: "#dc3545",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center"
                                    }}
                                  >
                                    <i className="fas fa-times"></i>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="form-label" style={{ color: "#333", fontWeight: "600", fontSize: "0.95rem" }}>
                          Shop Image (Optional)
                        </label>
                        <div className="mb-3">
                          <input
                            type="file"
                            className="form-control"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, 'shopImage')}
                            disabled={isLoading || isSubmitting}
                            style={{
                              backgroundColor: "#FFFFFF",
                              border: "2px solid #d0d0d0",
                              color: "#333",
                              padding: "14px 18px",
                              borderRadius: "16px",
                              fontSize: "1rem"
                            }}
                          />
                          <small className="text-muted d-block mt-1" style={{ fontSize: "0.85rem" }}>
                            Upload a picture of your shop (Optional but recommended)
                          </small>
                        </div>
                        
                        {filePreviews.shopImage && (
                          <div className="row mt-3">
                            <div className="col-md-4 col-sm-6">
                              <div className="position-relative">
                                <img
                                  src={filePreviews.shopImage}
                                  alt="Shop"
                                  className="img-thumbnail"
                                  style={{ 
                                    width: "100%",
                                    height: "150px",
                                    objectFit: "cover",
                                    border: "2px solid #d0d0d0",
                                    borderRadius: "16px"
                                  }}
                                />
                                <button
                                  type="button"
                                  className="btn btn-sm position-absolute top-0 end-0 m-2"
                                  onClick={() => {
                                    setFiles(prev => ({ ...prev, shopImage: null }));
                                    setFilePreviews(prev => ({ ...prev, shopImage: null }));
                                  }}
                                  disabled={isLoading || isSubmitting}
                                  style={{
                                    width: "32px",
                                    height: "32px",
                                    borderRadius: "8px",
                                    padding: "0",
                                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                                    border: "2px solid #dc3545",
                                    color: "#dc3545",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                  }}
                                >
                                  <i className="fas fa-times"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Confirmation */}
              {currentStep === 3 && (
                <div>
                  <h5 className="mb-4" style={{ color: "#000000", fontSize: "1.1rem", fontWeight: "600" }}>
                    <i className="fas fa-check-circle me-2" style={{ color: "#000000" }}></i>
                    F. Thibitisho
                  </h5>
                  
                  <div className="mb-4">
                    <div className="card" style={{
                      backgroundColor: "#f8f9fa",
                      border: "2px solid #d0d0d0",
                      borderRadius: "16px"
                    }}>
                      <div className="card-body">
                        <h6 className="mb-3" style={{ color: "#000000", fontWeight: "600" }}>
                          <i className="fas fa-info-circle me-2" style={{ color: "#000000" }}></i>
                          Summary of Your Registration
                        </h6>
                        
                        <div className="row">
                          <div className="col-md-6 mb-2">
                            <strong style={{ color: "#333", fontSize: "0.9rem" }}>Shop:</strong> {formData.shopName}
                          </div>
                          <div className="col-md-6 mb-2">
                            <strong style={{ color: "#333", fontSize: "0.9rem" }}>Country:</strong> Tanzania
                          </div>
                          <div className="col-md-6 mb-2">
                            <strong style={{ color: "#333", fontSize: "0.9rem" }}>WhatsApp:</strong> 
                            <span style={{ color: "#25D366" }}>
                              <i className="fab fa-whatsapp ms-1 me-1"></i>
                              {formData.whatsappNumber}
                            </span>
                          </div>
                          <div className="col-md-6 mb-2">
                            <strong style={{ color: "#333", fontSize: "0.9rem" }}>Location:</strong> {formData.area}, {formData.district}
                          </div>
                          <div className="col-md-6 mb-2">
                            <strong style={{ color: "#333", fontSize: "0.9rem" }}>Category:</strong> {formData.mainCategory}
                          </div>
                          <div className="col-md-6 mb-2">
                            <strong style={{ color: "#333", fontSize: "0.9rem" }}>Product:</strong> {formData.productName}
                          </div>
                          <div className="col-12 mb-2">
                            <strong style={{ color: "#333", fontSize: "0.9rem" }}>Description:</strong>
                            <p className="text-muted mt-1 mb-0" style={{ fontSize: "0.9rem", fontStyle: "italic" }}>
                              {formData.description?.substring(0, 150)}...
                            </p>
                          </div>
                          <div className="col-md-6 mb-2">
                            <strong style={{ color: "#333", fontSize: "0.9rem" }}>Price:</strong> 
                            {formData.price ? (
                              ` ${new Intl.NumberFormat('en-TZ').format(formData.price)} TZS`
                            ) : " 0"}
                          </div>
                          <div className="col-md-6 mb-2">
                            <strong style={{ color: "#333", fontSize: "0.9rem" }}>Stock:</strong> {formData.stockStatus}
                          </div>
                          <div className="col-md-6 mb-2">
                            <strong style={{ color: "#333", fontSize: "0.9rem" }}>Condition:</strong> {formData.condition}
                          </div>
                          <div className="col-md-6 mb-2">
                            <strong style={{ color: "#333", fontSize: "0.9rem" }}>Images:</strong> {files.productImages.length} uploaded
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="form-check mb-3">
                      <input
                        ref={el => fieldRefs.current['confirmAvailability'] = el}
                        className={`form-check-input ${incompleteFields.includes('confirmAvailability') ? 'incomplete-field' : ''} ${animateField === 'confirmAvailability' ? 'field-animation' : ''}`}
                        type="checkbox"
                        id="confirmAvailability"
                        name="confirmAvailability"
                        checked={formData.confirmAvailability}
                        onChange={handleInputChange}
                        required
                        disabled={isLoading || isSubmitting}
                        style={{
                          cursor: "pointer",
                          width: "20px",
                          height: "20px",
                          border: `2px solid ${incompleteFields.includes('confirmAvailability') ? '#dc3545' : '#d0d0d0'}`,
                          borderRadius: "6px"
                        }}
                      />
                      <label className="form-check-label" htmlFor="confirmAvailability" style={{ 
                        color: incompleteFields.includes('confirmAvailability') ? '#dc3545' : '#333',
                        fontWeight: "600",
                        fontSize: "0.95rem"
                      }}>
                        I confirm that the product information provided is accurate and the product is available as stated
                      </label>
                      {incompleteFields.includes('confirmAvailability') && (
                        <small className="text-danger mt-1 d-block">
                          <i className="fas fa-exclamation-circle me-1"></i>
                          You must confirm product availability
                        </small>
                      )}
                    </div>

                    <div className="form-check mb-3">
                      <input
                        ref={el => fieldRefs.current['agreeToUpdate'] = el}
                        className={`form-check-input ${incompleteFields.includes('agreeToUpdate') ? 'incomplete-field' : ''} ${animateField === 'agreeToUpdate' ? 'field-animation' : ''}`}
                        type="checkbox"
                        id="agreeToUpdate"
                        name="agreeToUpdate"
                        checked={formData.agreeToUpdate}
                        onChange={handleInputChange}
                        required
                        disabled={isLoading || isSubmitting}
                        style={{
                          cursor: "pointer",
                          width: "20px",
                          height: "20px",
                          border: `2px solid ${incompleteFields.includes('agreeToUpdate') ? '#dc3545' : '#d0d0d0'}`,
                          borderRadius: "6px"
                        }}
                      />
                      <label className="form-check-label" htmlFor="agreeToUpdate" style={{ 
                        color: incompleteFields.includes('agreeToUpdate') ? '#dc3545' : '#333',
                        fontWeight: "600",
                        fontSize: "0.95rem"
                      }}>
                        I agree to update stock information regularly and notify customers of any changes
                      </label>
                      {incompleteFields.includes('agreeToUpdate') && (
                        <small className="text-danger mt-1 d-block">
                          <i className="fas fa-exclamation-circle me-1"></i>
                          You must agree to update stock information
                        </small>
                      )}
                    </div>
                  </div>

                  <div className="alert alert-info" style={{
                    backgroundColor: "rgba(0, 0, 0, 0.05)",
                    border: "2px solid rgba(0, 0, 0, 0.3)",
                    color: "#333",
                    borderRadius: "16px",
                    padding: "14px 18px",
                    fontSize: "0.95rem"
                  }}>
                    <i className="fas fa-lightbulb me-2" style={{ color: "#000000" }}></i>
                    <strong>Important:</strong> After registration, you will be automatically redirected to your seller profile.
                  </div>
                </div>
              )}

              {/* Incomplete Fields Summary */}
              {incompleteFields.length > 0 && (
                <div className="alert alert-warning mt-3" style={{
                  borderRadius: "16px",
                  border: "2px solid #ffc107",
                  backgroundColor: "#fff3cd"
                }}>
                  <i className="fas fa-exclamation-triangle me-2 text-warning"></i>
                  <strong>Please fill in all required fields:</strong>
                  <ul className="mt-2 mb-0">
                    {incompleteFields.map(field => {
                      const fieldNames = {
                        shopName: 'Shop Name',
                        country: 'Country',
                        whatsappNumber: 'WhatsApp Number',
                        region: 'Region',
                        district: 'District',
                        area: 'Area',
                        mainCategory: 'Main Category',
                        productName: 'Product Name',
                        description: 'Description',
                        price: 'Price',
                        productImages: 'Product Images',
                        confirmAvailability: 'Confirmation',
                        agreeToUpdate: 'Agreement'
                      };
                      return (
                        <li key={field} style={{ color: '#856404' }}>
                          {fieldNames[field] || field}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top" style={{
                borderColor: "#d0d0d0"
              }}>
                {currentStep > 1 && (
                  <button
                    type="button"
                    className="btn"
                    onClick={prevStep}
                    disabled={isLoading || isSubmitting}
                    style={{
                      backgroundColor: "#FFFFFF",
                      border: "2px solid #d0d0d0",
                      color: "#000000",
                      padding: "12px 28px",
                      borderRadius: "18px",
                      fontWeight: "600",
                      fontSize: "1rem"
                    }}
                  >
                    <i className="fas fa-arrow-left me-2"></i>
                    Back
                  </button>
                )}
                
                <div className="ms-auto">
                  {currentStep < 3 ? (
                    <button
                      type="button"
                      className="btn"
                      onClick={nextStep}
                      disabled={isLoading || isSubmitting}
                      style={{
                        background: validateStep(currentStep) 
                          ? "#000000"
                          : incompleteFields.length > 0 ? "#dc3545" : "#f8f9fa",
                        border: "2px solid #000000",
                        color: validateStep(currentStep) ? "#FFFFFF" : incompleteFields.length > 0 ? "#FFFFFF" : "#666",
                        padding: "12px 28px",
                        borderRadius: "18px",
                        fontWeight: "600",
                        fontSize: "1rem",
                        opacity: (isLoading || isSubmitting) ? 0.6 : (validateStep(currentStep) ? 1 : 0.5),
                        transition: "all 0.3s ease",
                        cursor: (isLoading || isSubmitting) ? "not-allowed" : "pointer"
                      }}
                    >
                      {incompleteFields.length > 0 && !validateStep(currentStep) ? (
                        <>
                          <i className="fas fa-exclamation-circle me-2"></i>
                          Complete Required Fields
                        </>
                      ) : (
                        <>
                          Continue
                          <i className="fas fa-arrow-right ms-2"></i>
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="btn"
                      disabled={isLoading || isSubmitting}
                      style={{
                        background: "#000000",
                        border: "2px solid #000000",
                        color: "#FFFFFF",
                        padding: "12px 28px",
                        borderRadius: "18px",
                        fontWeight: "600",
                        fontSize: "1rem",
                        opacity: isSubmitting ? 0.6 : 1,
                        cursor: isSubmitting ? "not-allowed" : "pointer"
                      }}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          {location.state?.action === "edit-product" ? "Updating..." : "Registering..."}
                        </>
                      ) : (
                        <>
                          <i className="fas fa-check-circle me-2"></i>
                          {location.state?.action === "edit-product" ? "Update Product" : "Complete Registration"}
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              <div className="text-center mt-3">
                <small className="text-muted" style={{ fontSize: "0.85rem" }}>
                  Step {currentStep} of 3 • {Math.round(progress)}% Completed
                </small>
              </div>
            </form>
          </div>

          <div className="card-footer text-center" style={{
            backgroundColor: "#f8f9fa",
            borderTop: "2px solid #d0d0d0",
            padding: "16px 20px"
          }}>
            <small style={{ color: "#666", fontSize: "0.85rem" }}>
              <i className="fas fa-info-circle me-1" style={{ color: "#000000" }}></i>
              Your products will be visible to customers immediately • 
              <i className="fas fa-shield-alt ms-2 me-1" style={{ color: "#000000" }}></i>
              Verified sellers get priority in search results
            </small>
          </div>
        </div>

        <div className="text-center mt-4">
          <div className="d-flex justify-content-center gap-3 mb-3" style={{ flexWrap: "wrap" }}>
            <Link to="/" className="text-decoration-none" style={{ 
              color: "#666666",
              fontSize: "0.9rem",
              fontWeight: "500"
            }}>
              Home
            </Link>
            <span className="text-muted">•</span>
            <a href="#" className="text-decoration-none" style={{ 
              color: "#666666",
              fontSize: "0.9rem",
              fontWeight: "500"
            }}>
              Help
            </a>
            <span className="text-muted">•</span>
            <a href="mailto:support@availo.co.tz" className="text-decoration-none" style={{ 
              color: "#666666",
              fontSize: "0.9rem",
              fontWeight: "500"
            }}>
              Support
            </a>
          </div>
          
          <p className="mb-0" style={{ 
            color: "#666666",
            fontSize: "0.9rem",
            lineHeight: "1.4"
          }}>
            Already have an account?{" "}
            <Link to="/vendor-login" style={{ 
              color: "#000000",
              fontWeight: "600",
              textDecoration: "none"
            }}>
              Login here
            </Link>
            {" "}• Need help? Call <strong style={{ color: "#000000" }}>255 657 330 116</strong> or email{" "}
            <a href="mailto:support@availo.co.tz" style={{ 
              color: "#000000",
              fontWeight: "600",
              textDecoration: "none"
            }}>
              support@availo.co.tz
            </a>
          </p>
        </div>
      </div>

      <style>
        {`
          .form-control:focus, .form-select:focus {
            border-color: #000000 !important;
            box-shadow: 0 0 0 0.25rem rgba(0, 0, 0, 0.15) !important;
            outline: none !important;
            background-color: #FFFFFF !important;
          }
          
          button:hover:not(:disabled) {
            background-color: #333333 !important;
            color: #FFFFFF !important;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease !important;
            border-color: #333333 !important;
          }
          
          button[style*="border: 2px solid #d0d0d0"]:hover:not(:disabled) {
            background-color: #000000 !important;
            color: #FFFFFF !important;
            border-color: #000000 !important;
          }
          
          a.text-decoration-none:hover {
            color: #000000 !important;
            transition: color 0.2s ease !important;
          }
          
          input[type="file"] {
            border-radius: 16px !important;
            border: 2px solid #d0d0d0 !important;
            padding: 14px 18px !important;
          }
          
          input[type="file"]:focus {
            border-color: #000000 !important;
            box-shadow: 0 0 0 0.25rem rgba(0, 0, 0, 0.15) !important;
          }
          
          textarea.form-control {
            border-radius: 16px !important;
            border: 2px solid #d0d0d0 !important;
          }
          
          textarea.form-control:focus {
            border-color: #000000 !important;
            box-shadow: 0 0 0 0.25rem rgba(0, 0, 0, 0.15) !important;
          }
          
          .img-thumbnail {
            border: 2px solid #d0d0d0 !important;
            border-radius: 16px !important;
          }
          
          .form-check-input {
            border: 2px solid #d0d0d0 !important;
            border-radius: 6px !important;
            width: 20px !important;
            height: 20px !important;
          }
          
          .form-check-input:checked {
            background-color: #000000 !important;
            border-color: #000000 !important;
          }
          
          .form-check-input:focus {
            border-color: #000000 !important;
            box-shadow: 0 0 0 0.2rem rgba(0, 0, 0, 0.25) !important;
          }
          
          .badge {
            border-radius: 8px !important;
            border: 2px solid #d0d0d0 !important;
          }
          
          .alert {
            border-radius: 16px !important;
            border: 2px solid !important;
          }
          
          .card {
            transition: transform 0.3s ease, border-color 0.3s ease;
          }
          
          .card:hover {
            transform: translateY(-3px);
            border-color: #a0a0a0 !important;
          }
          
          /* 🔥 RED ANIMATION FOR INCOMPLETE FIELDS */
          .incomplete-field {
            border-color: #dc3545 !important;
            background-color: rgba(220, 53, 69, 0.05) !important;
          }
          
          .field-animation {
            animation: shake 0.5s ease-in-out, glow 1.5s ease-in-out;
          }
          
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
          }
          
          @keyframes glow {
            0% { box-shadow: 0 0 0 0 rgba(220, 53, 69, 0.7); }
            50% { box-shadow: 0 0 20px 5px rgba(220, 53, 69, 0.5); }
            100% { box-shadow: 0 0 0 0 rgba(220, 53, 69, 0); }
          }
          
          .form-check-input.field-animation {
            animation: pulse 1s ease-in-out;
          }
          
          @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(220, 53, 69, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(220, 53, 69, 0); }
            100% { box-shadow: 0 0 0 0 rgba(220, 53, 69, 0); }
          }
          
          @media (max-width: 576px) {
            .container {
              padding: 0 15px;
            }
            
            .card-body {
              padding: 20px !important;
            }
            
            .form-control, .form-select, textarea.form-control {
              padding: 12px 16px !important;
              font-size: 0.95rem !important;
              border-radius: 14px !important;
            }
            
            input[type="file"] {
              padding: 12px 16px !important;
              border-radius: 14px !important;
            }
            
            button {
              padding: 10px 20px !important;
              font-size: 0.95rem !important;
              border-radius: 16px !important;
            }
            
            .input-group-text {
              padding: 12px 16px !important;
              border-radius: 14px 0 0 14px !important;
            }
            
            .input-group .form-control {
              border-radius: 0 14px 14px 0 !important;
            }
            
            h1 {
              font-size: 1.6rem !important;
            }
            
            .card-header h3 {
              font-size: 1.1rem !important;
            }
            
            .img-thumbnail {
              height: 100px !important;
            }
          }
          
          @media (max-width: 768px) {
            .row {
              margin-left: -8px;
              margin-right: -8px;
            }
            
            .col-md-6, .col-md-4, .col-12 {
              padding-left: 8px;
              padding-right: 8px;
            }
            
            .card-header {
              padding: 12px 16px !important;
            }
          }
          
          html, body {
            scroll-behavior: auto;
          }
          
          #vendor-register-top {
            scroll-margin-top: 0;
          }
          
          .card, .btn, .form-control, .alert, .badge {
            transition: all 0.3s ease;
          }
          
          .btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
          
          .rounded-circle {
            border-radius: 12px !important;
            object-fit: cover;
          }
        `}
      </style>
      
      <link 
        rel="stylesheet" 
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" 
      />
    </div>
  );
}

export default VendorRegister;