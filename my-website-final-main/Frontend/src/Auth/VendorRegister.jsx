import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate } from "react-router-dom";

function VendorRegister() {
  const [formData, setFormData] = useState({
    // A. Taarifa za Duka
    shopName: "",
    sellerName: "",
    phoneNumber: "",
    email: "",
    businessType: "",
    
    // B. Mahali Duka Lilipo
    region: "",
    district: "",
    area: "",
    street: "",
    mapLocation: "",
    openingHours: "",
    
    // C. Taarifa za Bidhaa
    mainCategory: "",
    subCategory: "",
    productName: "",
    brand: "",
    specifications: "",
    
    // D. Upatikanaji wa Bidhaa
    stockStatus: "Available",
    quantityAvailable: "",
    lastUpdated: new Date().toISOString().split('T')[0],
    
    // E. Bei & Ziada
    price: "",
    priceType: "Fixed",
    warranty: "No",
    warrantyPeriod: "",
    
    // F. Additional Fields based on category
    condition: "New",
    size: "",
    color: "",
    material: "",
    
    // G. Thibitisho
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
  const [currentStep, setCurrentStep] = useState(1);
  const [progress, setProgress] = useState(25);
  const [isHovering, setIsHovering] = useState({
    submit: false,
    back: false,
    next: false
  });

  // New states for credential flow
  const [showCredentialsStep, setShowCredentialsStep] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [tempPassword, setTempPassword] = useState("");
  const [createdSellerId, setCreatedSellerId] = useState(null);
  
  const navigate = useNavigate();

  // Tanzanian regions and districts data
  const tanzaniaRegions = [
    "Dar es Salaam", "Arusha", "Kilimanjaro", "Tanga", "Morogoro", 
    "Pwani", "Dodoma", "Singida", "Tabora", "Rukwa", 
    "Kigoma", "Shinyanga", "Kagera", "Mwanza", "Mara", 
    "Manyara", "Mbeya", "Iringa", "Ruvuma", "Lindi", 
    "Mtwara", "Zanzibar Urban/West", "Zanzibar North", "Zanzibar South"
  ];

  const businessTypes = [
    "Retail Shop", "Wholesaler", "Online Store", "Authorized Dealer",
    "General Store", "Specialty Store", "Showroom", "Boutique",
    "Supermarket", "Hardware Store", "Electronics Shop"
  ];

  // Main Categories
  const mainCategories = [
    "Electronics & Computers",
    "Fashion & Clothing",
    "Beauty & Personal Care",
    "Home Appliances",
    "Vehicles & Auto Parts",
    "General Goods",
    "Other"
  ];

  // Sub-categories for each main category
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

  // Condition options
  const conditionOptions = ["New", "Used - Like New", "Used - Good", "Used - Fair", "Refurbished"];

  // Common brands across categories
  const commonBrands = [
    "Generic", "Local Brand", "Other",
    // Electronics
    "Apple", "Samsung", "Dell", "HP", "Lenovo", "Asus", "Acer", "Microsoft", "Toshiba", "Sony",
    "LG", "Intel", "AMD", "NVIDIA", "Corsair", "Kingston", "Western Digital", "Seagate", "TP-Link",
    // Fashion
    "Nike", "Adidas", "Puma", "Gucci", "Louis Vuitton", "Zara", "H&M", "Levi's",
    // Beauty
    "L'Oréal", "Maybelline", "MAC", "Nivea", "Vaseline", "Dove", "Garnier",
    // Vehicles
    "Toyota", "Honda", "Ford", "BMW", "Mercedes", "Yamaha", "Suzuki"
  ];

  const stockStatusOptions = ["Available", "Limited", "Out of Stock"];
  const priceTypeOptions = ["Fixed", "Negotiable"];
  const warrantyOptions = ["Yes", "No"];

  // Auto-update lastUpdated when stock status changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  }, [formData.stockStatus, formData.quantityAvailable]);

  // Reset subCategory when mainCategory changes
  useEffect(() => {
    if (formData.mainCategory && !subCategories[formData.mainCategory]) {
      setFormData(prev => ({
        ...prev,
        subCategory: "",
        specifications: ""
      }));
    }
  }, [formData.mainCategory]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleFileChange = (e, fileType) => {
    const selectedFiles = e.target.files;
    
    if (fileType === 'productImages') {
      // Allow up to 6 images
      const newFiles = Array.from(selectedFiles).slice(0, 6);
      
      // Create previews
      const newPreviews = [];
      newFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          newPreviews.push(e.target.result);
          if (newPreviews.length === newFiles.length) {
            setFilePreviews(prev => ({
              ...prev,
              productImages: newPreviews
            }));
          }
        };
        reader.readAsDataURL(file);
      });
      
      setFiles(prev => ({
        ...prev,
        productImages: newFiles
      }));
      
    } else if (fileType === 'shopImage') {
      const file = selectedFiles[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFilePreviews(prev => ({
            ...prev,
            shopImage: e.target.result
          }));
        };
        reader.readAsDataURL(file);
        
        setFiles(prev => ({
          ...prev,
          shopImage: file
        }));
      }
    }
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      setProgress(((currentStep + 1) / 4) * 100);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setProgress(((currentStep - 1) / 4) * 100);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return (
          formData.shopName.trim() !== "" &&
          formData.sellerName.trim() !== "" &&
          formData.phoneNumber.trim() !== "" &&
          formData.businessType.trim() !== ""
        );
      case 2:
        return (
          formData.region.trim() !== "" &&
          formData.district.trim() !== "" &&
          formData.area.trim() !== ""
        );
      case 3:
        return (
          formData.mainCategory.trim() !== "" &&
          formData.productName.trim() !== "" &&
          formData.price.trim() !== "" &&
          files.productImages.length > 0
        );
      case 4:
        return (
          formData.confirmAvailability &&
          formData.agreeToUpdate
        );
      default:
        return false;
    }
  };

  // Check if category requires specifications
  const requiresSpecifications = () => {
    const specCategories = ["Electronics & Computers", "Home Appliances", "Vehicles & Auto Parts"];
    return specCategories.includes(formData.mainCategory);
  };

  // Check if category requires size/color/material
  const requiresFashionDetails = () => {
    return formData.mainCategory === "Fashion & Clothing";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validate required fields
    if (!validateStep(4)) {
      setError("Please agree to all terms and confirm product availability");
      setIsLoading(false);
      return;
    }

    // Validate files
    if (files.productImages.length === 0) {
      setError("Please upload at least one product image");
      setIsLoading(false);
      return;
    }

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Generate seller data
      const sellerId = Date.now();
      const shopImageUrl = filePreviews.shopImage || "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80";
      
      const sellerDataToStore = {
        id: sellerId,
        // Shop Information
        shopName: formData.shopName,
        sellerName: formData.sellerName,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        businessType: formData.businessType,
        
        // Location
        region: formData.region,
        district: formData.district,
        area: formData.area,
        street: formData.street,
        mapLocation: formData.mapLocation,
        openingHours: formData.openingHours,
        
        // Product Information
        mainCategory: formData.mainCategory,
        subCategory: formData.subCategory,
        productName: formData.productName,
        brand: formData.brand,
        specifications: formData.specifications,
        condition: formData.condition,
        size: formData.size,
        color: formData.color,
        material: formData.material,
        
        // Availability
        stockStatus: formData.stockStatus,
        quantityAvailable: formData.quantityAvailable,
        lastUpdated: formData.lastUpdated,
        
        // Pricing
        price: formData.price,
        priceType: formData.priceType,
        warranty: formData.warranty,
        warrantyPeriod: formData.warrantyPeriod,
        
        // Images
        productImages: filePreviews.productImages,
        shopImage: shopImageUrl,
        
        // Verification
        isVerified: false,
        registrationDate: new Date().toISOString(),
        status: "active"
      };

      // Store seller registration data (not logged in yet). We'll require them to set/save a password and log in.
      localStorage.setItem("pendingSeller", JSON.stringify(sellerDataToStore));
      localStorage.setItem("currentSeller", JSON.stringify(sellerDataToStore));
      localStorage.setItem("sellerEmail", formData.email || formData.phoneNumber);

      // Get existing sellers or initialize empty array
      const existingSellers = JSON.parse(localStorage.getItem('allSellersData') || '[]');

      // Helper to sanitize large data (remove base64 previews) before storing
      const sanitizeSellerForStorage = (seller) => {
        const copy = { ...seller };
        // Replace large base64 product images with placeholders to avoid exceeding storage
        if (Array.isArray(copy.productImages)) {
          copy.productImages = copy.productImages.map((img, idx) => {
            if (typeof img === 'string' && img.startsWith('data:')) {
              return `uploaded-image-${Date.now()}-${idx}`; // placeholder tag
            }
            return img;
          });
        } else {
          copy.productImages = [];
        }

        if (typeof copy.shopImage === 'string' && copy.shopImage.startsWith('data:')) {
          copy.shopImage = "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80";
        }

        return copy;
      };

      // Add sanitized seller to the list and try to store; on quota error, progressively trim data
      const sanitized = sanitizeSellerForStorage(sellerDataToStore);
      existingSellers.push(sanitized);

      try {
        localStorage.setItem('allSellersData', JSON.stringify(existingSellers));
      } catch (e) {
        console.warn('Failed saving allSellersData, trying fallback cleanup:', e);

        // First, remove productImages from all sellers to free space
        const stripped = existingSellers.map(s => ({ ...s, productImages: [], shopImage: s.shopImage && s.shopImage.startsWith('data:') ? "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" : s.shopImage }));
        try {
          localStorage.setItem('allSellersData', JSON.stringify(stripped));
          setSuccess(prev => prev + ' (Images not saved due to storage limits)');
        } catch (e2) {
          console.warn('Still failing to save after stripping images, removing demo sellers...', e2);

          // Remove demo sellers first
          let filtered = stripped.filter(s => !(s.id && String(s.id).startsWith('demo-seller-')));
          try {
            localStorage.setItem('allSellersData', JSON.stringify(filtered));
            setSuccess(prev => prev + ' (Cleared demo data to save registration)');
          } catch (e3) {
            console.error('Unable to save registration to localStorage due to quota limits:', e3);
            // As last resort, store only the newly registered seller alone
            try {
              localStorage.setItem('allSellersData', JSON.stringify([sanitized]));
              setSuccess(prev => prev + ' (Stored only your registration due to limited storage)');
            } catch (e4) {
              console.error('Final fallback failed, cannot persist sellers locally:', e4);
              setError('Registration completed but unable to save data locally due to browser storage limits.');
            }
          }
        }
      }

      // Store for admin management
      const registrationData = {
        id: sellerId,
        shopName: formData.shopName,
        sellerName: formData.sellerName,
        phoneNumber: formData.phoneNumber,
        region: formData.region,
        district: formData.district,
        mainCategory: formData.mainCategory,
        productName: formData.productName,
        price: formData.price,
        registrationDate: new Date().toLocaleString(),
        status: "pending"
      };

      const existingRegistrations = JSON.parse(localStorage.getItem('sellerRegistrations') || '[]');
      existingRegistrations.push(registrationData);
      localStorage.setItem('sellerRegistrations', JSON.stringify(existingRegistrations));

      // Add demo sellers if this is the first registration
      if (existingSellers.length <= 1) {
        addDemoSellers();
      }

      // Show success message and show credential setup step
      setSuccess("🎉 Registration successful! Set your password below (you can change it if you want)");
      setIsLoading(false);

      // Generate a temporary password and show credential UI
      const genPass = generateRandomPassword();
      setGeneratedPassword(genPass);
      setTempPassword(genPass);
      setCreatedSellerId(sellerId);
      setShowCredentialsStep(true);

      // Also pre-fill just-registered email so login can be prefilled later
      localStorage.setItem("justRegisteredEmail", formData.email || formData.phoneNumber);
      localStorage.setItem("justRegisteredPassword", genPass);

      // Redirect to vendor login so the user can sign in (login will be prefilled)
      setTimeout(() => {
        navigate('/vendor-login');
      }, 1500);

    } catch (error) {
      console.error("Registration error:", error);
      setError("Registration error: " + error.message);
      setIsLoading(false);
    }
  };

  // Add demo sellers for testing
  const addDemoSellers = () => {
    const demoCategories = ["Electronics & Computers", "Fashion & Clothing", "Beauty & Personal Care", 
                          "Home Appliances", "Vehicles & Auto Parts", "General Goods"];
    
    const demoProducts = [
      // Electronics
      "HP Laptop Probook", "Dell XPS 13", "iPhone 13 Pro", "Samsung Galaxy S22",
      // Fashion
      "Nike Air Max Shoes", "Levi's Jeans", "Gucci Handbag", "Ray-Ban Sunglasses",
      // Beauty
      "L'Oréal Shampoo", "MAC Lipstick", "Chanel Perfume", "Nivea Body Lotion",
      // Home Appliances
      "LG Refrigerator", "Samsung TV", "Philips Blender", "Moulinex Iron",
      // Vehicles
      "Toyota Corolla", "Honda Motorcycle", "Car Audio System", "Car Tires",
      // General
      "Office Chair", "Kitchen Set", "Sports Shoes", "School Bag"
    ];
    
    const demoSellers = [];
    
    for (let i = 1; i <= 15; i++) {
      const categoryIndex = i % demoCategories.length;
      const mainCategory = demoCategories[categoryIndex];
      const productIndex = i % demoProducts.length;
      const product = demoProducts[productIndex];
      
      let subCategory = "";
      let region = "";
      
      // Assign appropriate sub-category based on main category
      if (mainCategory === "Electronics & Computers") {
        subCategory = i % 2 === 0 ? "Laptops" : "Smartphones";
        region = "Dar es Salaam";
      } else if (mainCategory === "Fashion & Clothing") {
        subCategory = i % 2 === 0 ? "Clothing" : "Footwear";
        region = "Arusha";
      } else if (mainCategory === "Beauty & Personal Care") {
        subCategory = i % 2 === 0 ? "Skincare" : "Fragrances";
        region = "Mwanza";
      } else if (mainCategory === "Home Appliances") {
        subCategory = i % 2 === 0 ? "Kitchen Appliances" : "Home Electronics";
        region = "Mbeya";
      } else if (mainCategory === "Vehicles & Auto Parts") {
        subCategory = i % 2 === 0 ? "Cars" : "Auto Parts";
        region = "Dodoma";
      } else {
        subCategory = "General Goods";
        region = "Tanga";
      }
      
      demoSellers.push({
        id: `demo-seller-${i}`,
        shopName: `${mainCategory.split(' ')[0]} Shop ${i}`,
        sellerName: `Seller ${i}`,
        phoneNumber: `+255 7${Math.floor(Math.random() * 90000000 + 10000000)}`,
        email: `seller${i}@example.com`,
        businessType: ["Retail Shop", "Wholesaler", "Online Store"][i % 3],
        region: region,
        district: `${region} District`,
        area: `Area ${i % 5 + 1}`,
        street: `Street ${i}`,
        mainCategory: mainCategory,
        subCategory: subCategory,
        productName: product,
        brand: product.includes("HP") ? "HP" : product.includes("Dell") ? "Dell" : 
               product.includes("Nike") ? "Nike" : product.includes("LG") ? "LG" : 
               product.includes("Toyota") ? "Toyota" : "Various",
        stockStatus: i % 3 === 0 ? "Limited" : "Available",
        quantityAvailable: Math.floor(Math.random() * 50).toString(),
        price: `${(Math.floor(Math.random() * 500) + 50) * 1000} TZS`,
        priceType: i % 2 === 0 ? "Fixed" : "Negotiable",
        warranty: i % 2 === 0 ? "Yes" : "No",
        productImages: [`https://images.unsplash.com/photo-${149+i}?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80`],
        shopImage: `https://images.unsplash.com/photo-${160+i}?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80`,
        isVerified: i % 3 !== 0,
        registrationDate: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
        status: i % 3 === 0 ? "pending" : "active"
      });
    }
    
    // Get existing sellers
    const existingSellers = JSON.parse(localStorage.getItem('allSellersData') || '[]');
    
    // Add demo sellers
    const allSellers = [...existingSellers, ...demoSellers];
    localStorage.setItem('allSellersData', JSON.stringify(allSellers));
    
    console.log(`Added ${demoSellers.length} demo sellers to localStorage`);
  };

  // Generate a simple random password
  const generateRandomPassword = (length = 8) => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleSaveCredentials = (saveAndLogin = false) => {
    try {
      if (!tempPassword || tempPassword.length < 6) {
        setError('Password must be at least 6 characters long');
        return;
      }

      const allSellers = JSON.parse(localStorage.getItem('allSellersData') || '[]');
      const updatedSellers = allSellers.map(s => {
        if (s.id === createdSellerId) {
          return { ...s, password: tempPassword };
        }
        return s;
      });
      // Try to save updated sellers; handle quota errors by stripping images then retrying
      try {
        localStorage.setItem('allSellersData', JSON.stringify(updatedSellers));
      } catch (e) {
        console.warn('Failed to update allSellersData when saving credentials, retrying without images', e);
        const stripped = updatedSellers.map(s => ({ ...s, productImages: [], shopImage: s.shopImage && s.shopImage.startsWith('data:') ? "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" : s.shopImage }));
        try {
          localStorage.setItem('allSellersData', JSON.stringify(stripped));
        } catch (e2) {
          console.error('Still failed to update allSellersData after stripping images', e2);
          // Best-effort: store only the updated seller
          try {
            const updatedOnly = stripped.filter(s => s.id === createdSellerId);
            localStorage.setItem('allSellersData', JSON.stringify(updatedOnly));
          } catch (e3) {
            console.error('Final fallback failed to persist seller password', e3);
            setError('Could not save password due to browser storage limits. You can still log in with the generated password (it was stored temporarily).');
          }
        }
      }

      // Update currentSeller if it matches
      const currentSeller = JSON.parse(localStorage.getItem('currentSeller') || 'null');
      if (currentSeller && currentSeller.id === createdSellerId) {
        localStorage.setItem('currentSeller', JSON.stringify({ ...currentSeller, password: tempPassword }));
      }

      // Keep the email/password available briefly to prefill login
      localStorage.setItem('justRegisteredEmail', formData.email || formData.phoneNumber);
      localStorage.setItem('justRegisteredPassword', tempPassword);

      setSuccess('✅ Password saved. You can now sign in using your email and password.');
      setShowCredentialsStep(false);

      if (saveAndLogin) {
        // Redirect to login page after a short delay
        setTimeout(() => navigate('/vendor-login'), 1200);
      }
    } catch (err) {
      console.error('Error saving credentials:', err);
      setError('Error saving credentials. Please try again.');
    }
  };

  const handleSkipToLogin = () => {
    // If skipping, we still saved the generated password into localStorage for prefill, but didn't attach it to seller record.
    localStorage.setItem('justRegisteredEmail', formData.email || formData.phoneNumber);
    localStorage.setItem('justRegisteredPassword', generatedPassword);
    setShowCredentialsStep(false);
    setTimeout(() => navigate('/vendor-login'), 500);
  };

  const handleMouseEnter = (button) => {
    setIsHovering(prev => ({ ...prev, [button]: true }));
  };

  const handleMouseLeave = (button) => {
    setIsHovering(prev => ({ ...prev, [button]: false }));
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

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #ffffff, #f8f9fa, #e9ecef, #dee2e6)",
        position: "relative",
        overflow: "hidden",
        padding: "20px 0"
      }}
    >
      {/* Background Pattern */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
        opacity: 0.05,
        backgroundImage: `repeating-linear-gradient(
          45deg,
          #FF6B6B,
          #FF6B6B 10px,
          transparent 10px,
          transparent 20px
        )`
      }}></div>

      <div className="container col-md-10 col-lg-8" style={{ position: "relative", zIndex: 2 }}>
        {/* Animated Header */}
        <div className="text-center mb-4">
          <div style={{
            display: "inline-block",
            position: "relative",
            marginBottom: "1rem"
          }}>
            <div style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "120px",
              height: "120px",
              border: "2px dashed rgba(255, 107, 107, 0.3)",
              borderRadius: "50%",
              animation: "spin 20s linear infinite"
            }}></div>
            
            <div style={{
              width: "100px",
              height: "100px",
              background: "linear-gradient(135deg, #FF6B6B, #FF8E53)",
              borderRadius: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "3rem",
              fontWeight: "bold",
              margin: "0 auto",
              position: "relative",
              zIndex: 2,
              boxShadow: "0 15px 35px rgba(255, 107, 107, 0.4)",
              transform: "rotate(-5deg)"
            }}>
              🏪
            </div>
          </div>
          
          <h1 className="mb-2" style={{
            color: "#333333",
            fontWeight: "bold",
            fontSize: "2.5rem"
          }}>
            Seller Registration
          </h1>
          <p className="text-muted">Register your shop and list your products on Availo</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "0.5rem"
          }}>
            {["Shop Info", "Location", "Products", "Confirmation"].map((step, index) => (
              <div key={index} className="text-center" style={{ flex: 1 }}>
                <div style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: currentStep > index + 1 ? "#FF6B6B" : currentStep === index + 1 ? "#FF6B6B" : "rgba(255, 107, 107, 0.2)",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 0.5rem",
                  border: currentStep === index + 1 ? "2px solid #FF8E53" : "none",
                  boxShadow: currentStep === index + 1 ? "0 0 15px rgba(255, 107, 107, 0.5)" : "none"
                }}>
                  {currentStep > index + 1 ? "✓" : index + 1}
                </div>
                <span style={{
                  color: currentStep === index + 1 ? "#FF6B6B" : "#666666",
                  fontSize: "0.9rem",
                  fontWeight: currentStep === index + 1 ? "bold" : "normal"
                }}>
                  {step}
                </span>
              </div>
            ))}
          </div>
          
          <div style={{
            height: "6px",
            background: "rgba(255, 107, 107, 0.1)",
            borderRadius: "3px",
            overflow: "hidden",
            marginBottom: "2rem"
          }}>
            <div style={{
              height: "100%",
              width: `${progress}%`,
              background: "linear-gradient(90deg, #FF6B6B, #FF8E53)",
              borderRadius: "3px",
              transition: "width 0.5s ease",
              position: "relative"
            }}>
              <div style={{
                position: "absolute",
                right: "-5px",
                top: "-2px",
                width: "10px",
                height: "10px",
                background: "#FF8E53",
                borderRadius: "50%",
                boxShadow: "0 0 10px rgba(255, 142, 83, 0.8)"
              }}></div>
            </div>
          </div>
        </div>

        <div className="card shadow border-0 rounded-4 overflow-hidden" style={{
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.98))",
          border: "2px solid rgba(255, 107, 107, 0.1)"
        }}>
          <div className="card-header" style={{
            background: "linear-gradient(90deg, rgba(255, 107, 107, 0.1), rgba(255, 142, 83, 0.1))",
            borderBottom: "1px solid rgba(255, 107, 107, 0.2)"
          }}>
            <div className="d-flex justify-content-between align-items-center">
              <h3 className="mb-0" style={{ color: "#333333" }}>
                Step {currentStep}: {currentStep === 1 ? "Shop Information" : currentStep === 2 ? "Shop Location" : currentStep === 3 ? "Product Details" : "Confirmation"}
              </h3>
              <span className="badge" style={{
                background: "rgba(255, 107, 107, 0.2)",
                color: "#FF6B6B",
                padding: "8px 15px",
                borderRadius: "20px",
                fontWeight: "bold"
              }}>
                🧾 Seller Form
              </span>
            </div>
          </div>

          <div className="card-body p-4">
            {error && (
              <div className="alert alert-danger d-flex align-items-center" role="alert" style={{
                background: "rgba(255, 107, 107, 0.1)",
                border: "1px solid rgba(255, 107, 107, 0.3)",
                color: "#FF6B6B"
              }}>
                <i className="fas fa-exclamation-triangle me-2"></i>
                {error}
              </div>
            )}

            {success && (
              <div className="alert alert-success d-flex align-items-center" role="alert" style={{
                background: "rgba(78, 205, 196, 0.1)",
                border: "1px solid rgba(78, 205, 196, 0.3)",
                color: "#4ECDC4"
              }}>
                <i className="fas fa-check-circle me-2"></i>
                {success}
              </div>
            )}

            {/* Credential setup: show email and auto-generated password, allow edit and save */}
            {showCredentialsStep && (
              <div className="card mt-3 p-3" style={{ border: '1px solid rgba(0,0,0,0.05)', background: '#fff' }}>
                <h5 className="mb-3">Your account details</h5>
                <div className="mb-2">
                  <label className="form-label">Registered Email</label>
                  <input className="form-control" value={formData.email || formData.phoneNumber} readOnly />
                </div>

                <div className="mb-3">
                  <label className="form-label">Password (auto-generated)</label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      value={tempPassword}
                      onChange={(e) => setTempPassword(e.target.value)}
                      placeholder="Set password or keep the generated one"
                    />
                    <button type="button" className="btn btn-outline-secondary" onClick={() => { const p = generateRandomPassword(); setTempPassword(p); setGeneratedPassword(p); }}>
                      Regenerate
                    </button>
                  </div>
                  <div className="form-text">Make sure to choose a password that you can remember (min 6 characters).</div>
                </div>

                <div className="d-flex gap-2">
                  <button type="button" className="btn btn-primary" onClick={() => handleSaveCredentials(true)}>Save & go to Login</button>
                  <button type="button" className="btn btn-outline-secondary" onClick={handleSkipToLogin}>Skip & go to Login</button>
                </div>
              </div>
            )}

            <form onSubmit={currentStep === 4 ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }}>
              {/* Step 1: Shop Information */}
              {currentStep === 1 && (
                <div style={{ animation: "fadeIn 0.5s ease" }}>
                  <h5 className="mb-4" style={{ color: "#333333" }}>
                    <i className="fas fa-store me-2" style={{ color: "#FF6B6B" }}></i>
                    A. Taarifa za Duka
                  </h5>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="shopName" className="form-label" style={{ color: "#555555", fontWeight: "600" }}>
                        Shop Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        id="shopName"
                        name="shopName"
                        value={formData.shopName}
                        onChange={handleInputChange}
                        required
                        disabled={isLoading}
                        placeholder="e.g., Tech Hub Computer Store"
                        style={{
                          background: "rgba(255, 255, 255, 0.9)",
                          border: "1px solid rgba(255, 107, 107, 0.3)",
                          color: "#333333",
                          padding: "12px 15px"
                        }}
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label htmlFor="sellerName" className="form-label" style={{ color: "#555555", fontWeight: "600" }}>
                        Seller Full Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        id="sellerName"
                        name="sellerName"
                        value={formData.sellerName}
                        onChange={handleInputChange}
                        required
                        disabled={isLoading}
                        placeholder="Your full name"
                        style={{
                          background: "rgba(255, 255, 255, 0.9)",
                          border: "1px solid rgba(255, 107, 107, 0.3)",
                          color: "#333333",
                          padding: "12px 15px"
                        }}
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label htmlFor="phoneNumber" className="form-label" style={{ color: "#555555", fontWeight: "600" }}>
                        Phone Number (Call/WhatsApp) <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <span className="input-group-text" style={{
                          background: "rgba(255, 107, 107, 0.1)",
                          border: "1px solid rgba(255, 107, 107, 0.3)",
                          color: "#FF6B6B"
                        }}>+255</span>
                        <input
                          type="tel"
                          className="form-control rounded-3"
                          id="phoneNumber"
                          name="phoneNumber"
                          placeholder="712345678"
                          pattern="[0-9]{9}"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          required
                          disabled={isLoading}
                          style={{
                            background: "rgba(255, 255, 255, 0.9)",
                            border: "1px solid rgba(255, 107, 107, 0.3)",
                            color: "#333333",
                            padding: "12px 15px"
                          }}
                        />
                      </div>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label htmlFor="email" className="form-label" style={{ color: "#555555", fontWeight: "600" }}>
                        Email Address (optional)
                      </label>
                      <input
                        type="email"
                        className="form-control rounded-3"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        placeholder="shop@example.com"
                        style={{
                          background: "rgba(255, 255, 255, 0.9)",
                          border: "1px solid rgba(255, 107, 107, 0.3)",
                          color: "#333333",
                          padding: "12px 15px"
                        }}
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label htmlFor="businessType" className="form-label" style={{ color: "#555555", fontWeight: "600" }}>
                        Business Type <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select rounded-3"
                        id="businessType"
                        name="businessType"
                        value={formData.businessType}
                        onChange={handleInputChange}
                        required
                        disabled={isLoading}
                        style={{
                          background: "rgba(255, 255, 255, 0.9)",
                          border: "1px solid rgba(255, 107, 107, 0.3)",
                          color: "#333333",
                          padding: "12px 15px"
                        }}
                      >
                        <option value="">Select Business Type</option>
                        {businessTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Location */}
              {currentStep === 2 && (
                <div style={{ animation: "fadeIn 0.5s ease" }}>
                  <h5 className="mb-4" style={{ color: "#333333" }}>
                    <i className="fas fa-map-marker-alt me-2" style={{ color: "#FF6B6B" }}></i>
                    B. Mahali Duka Lilipo
                  </h5>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="region" className="form-label" style={{ color: "#555555", fontWeight: "600" }}>
                        Region <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select rounded-3"
                        id="region"
                        name="region"
                        value={formData.region}
                        onChange={handleInputChange}
                        required
                        disabled={isLoading}
                        style={{
                          background: "rgba(255, 255, 255, 0.9)",
                          border: "1px solid rgba(255, 107, 107, 0.3)",
                          color: "#333333",
                          padding: "12px 15px"
                        }}
                      >
                        <option value="">Select Region</option>
                        {tanzaniaRegions.map(region => (
                          <option key={region} value={region}>{region}</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label htmlFor="district" className="form-label" style={{ color: "#555555", fontWeight: "600" }}>
                        District <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        id="district"
                        name="district"
                        value={formData.district}
                        onChange={handleInputChange}
                        required
                        disabled={isLoading}
                        placeholder="e.g., Ilala, Kinondoni"
                        style={{
                          background: "rgba(255, 255, 255, 0.9)",
                          border: "1px solid rgba(255, 107, 107, 0.3)",
                          color: "#333333",
                          padding: "12px 15px"
                        }}
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label htmlFor="area" className="form-label" style={{ color: "#555555", fontWeight: "600" }}>
                        Area / Ward <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        id="area"
                        name="area"
                        value={formData.area}
                        onChange={handleInputChange}
                        required
                        disabled={isLoading}
                        placeholder="e.g., Kariakoo, Masaki"
                        style={{
                          background: "rgba(255, 255, 255, 0.9)",
                          border: "1px solid rgba(255, 107, 107, 0.3)",
                          color: "#333333",
                          padding: "12px 15px"
                        }}
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label htmlFor="street" className="form-label" style={{ color: "#555555", fontWeight: "600" }}>
                        Street / Landmark
                      </label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        id="street"
                        name="street"
                        value={formData.street}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        placeholder="e.g., Samora Avenue, Near Post Office"
                        style={{
                          background: "rgba(255, 255, 255, 0.9)",
                          border: "1px solid rgba(255, 107, 107, 0.3)",
                          color: "#333333",
                          padding: "12px 15px"
                        }}
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label htmlFor="mapLocation" className="form-label" style={{ color: "#555555", fontWeight: "600" }}>
                        Google Map Location (Pin)
                      </label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        id="mapLocation"
                        name="mapLocation"
                        value={formData.mapLocation}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        placeholder="Paste Google Maps link"
                        style={{
                          background: "rgba(255, 255, 255, 0.9)",
                          border: "1px solid rgba(255, 107, 107, 0.3)",
                          color: "#333333",
                          padding: "12px 15px"
                        }}
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label htmlFor="openingHours" className="form-label" style={{ color: "#555555", fontWeight: "600" }}>
                        Opening Hours
                      </label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        id="openingHours"
                        name="openingHours"
                        value={formData.openingHours}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        placeholder="e.g., Mon-Fri 8AM-6PM, Sat 9AM-4PM"
                        style={{
                          background: "rgba(255, 255, 255, 0.9)",
                          border: "1px solid rgba(255, 107, 107, 0.3)",
                          color: "#333333",
                          padding: "12px 15px"
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Product Details */}
              {currentStep === 3 && (
                <div style={{ animation: "fadeIn 0.5s ease" }}>
                  <h5 className="mb-4" style={{ color: "#333333" }}>
                    <i className="fas fa-box me-2" style={{ color: "#FF6B6B" }}></i>
                    C. Taarifa za Bidhaa
                  </h5>
                  
                  <div className="row">
                    {/* Main Category */}
                    <div className="col-md-6 mb-3">
                      <label htmlFor="mainCategory" className="form-label" style={{ color: "#555555", fontWeight: "600" }}>
                        Main Category <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select rounded-3"
                        id="mainCategory"
                        name="mainCategory"
                        value={formData.mainCategory}
                        onChange={handleInputChange}
                        required
                        disabled={isLoading}
                        style={{
                          background: "rgba(255, 255, 255, 0.9)",
                          border: "1px solid rgba(255, 107, 107, 0.3)",
                          color: "#333333",
                          padding: "12px 15px"
                        }}
                      >
                        <option value="">Select Main Category</option>
                        {mainCategories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>

                    {/* Sub Category */}
                    <div className="col-md-6 mb-3">
                      <label htmlFor="subCategory" className="form-label" style={{ color: "#555555", fontWeight: "600" }}>
                        Sub Category
                      </label>
                      <select
                        className="form-select rounded-3"
                        id="subCategory"
                        name="subCategory"
                        value={formData.subCategory}
                        onChange={handleInputChange}
                        disabled={isLoading || !formData.mainCategory || !subCategories[formData.mainCategory]}
                        style={{
                          background: "rgba(255, 255, 255, 0.9)",
                          border: "1px solid rgba(255, 107, 107, 0.3)",
                          color: "#333333",
                          padding: "12px 15px"
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

                    {/* Product Name */}
                    <div className="col-md-6 mb-3">
                      <label htmlFor="productName" className="form-label" style={{ color: "#555555", fontWeight: "600" }}>
                        Product Name / Model <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        id="productName"
                        name="productName"
                        value={formData.productName}
                        onChange={handleInputChange}
                        required
                        disabled={isLoading}
                        placeholder="e.g., HP ProBook 450 G8 / Nike Air Max"
                        style={{
                          background: "rgba(255, 255, 255, 0.9)",
                          border: "1px solid rgba(255, 107, 107, 0.3)",
                          color: "#333333",
                          padding: "12px 15px"
                        }}
                      />
                    </div>

                    {/* Brand */}
                    <div className="col-md-6 mb-3">
                      <label htmlFor="brand" className="form-label" style={{ color: "#555555", fontWeight: "600" }}>
                        Brand
                      </label>
                      <select
                        className="form-select rounded-3"
                        id="brand"
                        name="brand"
                        value={formData.brand}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        style={{
                          background: "rgba(255, 255, 255, 0.9)",
                          border: "1px solid rgba(255, 107, 107, 0.3)",
                          color: "#333333",
                          padding: "12px 15px"
                        }}
                      >
                        <option value="">Select Brand</option>
                        {commonBrands.map(brand => (
                          <option key={brand} value={brand}>{brand}</option>
                        ))}
                      </select>
                    </div>

                    {/* Condition */}
                    <div className="col-md-6 mb-3">
                      <label htmlFor="condition" className="form-label" style={{ color: "#555555", fontWeight: "600" }}>
                        Condition
                      </label>
                      <select
                        className="form-select rounded-3"
                        id="condition"
                        name="condition"
                        value={formData.condition}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        style={{
                          background: "rgba(255, 255, 255, 0.9)",
                          border: "1px solid rgba(255, 107, 107, 0.3)",
                          color: "#333333",
                          padding: "12px 15px"
                        }}
                      >
                        {conditionOptions.map(condition => (
                          <option key={condition} value={condition}>{condition}</option>
                        ))}
                      </select>
                    </div>

                    {/* Specifications (for Electronics, Appliances, Vehicles) */}
                    {requiresSpecifications() && (
                      <div className="col-12 mb-3">
                        <label htmlFor="specifications" className="form-label" style={{ color: "#555555", fontWeight: "600" }}>
                          Specifications / Details
                        </label>
                        <textarea
                          className="form-control rounded-3"
                          id="specifications"
                          name="specifications"
                          value={formData.specifications}
                          onChange={handleInputChange}
                          disabled={isLoading}
                          placeholder={
                            formData.mainCategory === "Electronics & Computers" 
                              ? "e.g., Intel i5, 8GB RAM, 512GB SSD, Windows 11" 
                              : formData.mainCategory === "Home Appliances"
                              ? "e.g., Capacity: 300L, Energy Rating: A++, Color: Silver"
                              : "e.g., Engine: 1500cc, Year: 2020, Fuel: Petrol"
                          }
                          rows="3"
                          style={{
                            background: "rgba(255, 255, 255, 0.9)",
                            border: "1px solid rgba(255, 107, 107, 0.3)",
                            color: "#333333",
                            padding: "12px 15px"
                          }}
                        ></textarea>
                      </div>
                    )}

                    {/* Size, Color, Material (for Fashion) */}
                    {requiresFashionDetails() && (
                      <div className="row mb-3">
                        <div className="col-md-4 mb-3">
                          <label htmlFor="size" className="form-label" style={{ color: "#555555", fontWeight: "600" }}>
                            Size (Optional)
                          </label>
                          <input
                            type="text"
                            className="form-control rounded-3"
                            id="size"
                            name="size"
                            value={formData.size}
                            onChange={handleInputChange}
                            disabled={isLoading}
                            placeholder="e.g., M, L, XL, 42, 10"
                            style={{
                              background: "rgba(255, 255, 255, 0.9)",
                              border: "1px solid rgba(255, 107, 107, 0.3)",
                              color: "#333333",
                              padding: "12px 15px"
                            }}
                          />
                        </div>

                        <div className="col-md-4 mb-3">
                          <label htmlFor="color" className="form-label" style={{ color: "#555555", fontWeight: "600" }}>
                            Color (Optional)
                          </label>
                          <input
                            type="text"
                            className="form-control rounded-3"
                            id="color"
                            name="color"
                            value={formData.color}
                            onChange={handleInputChange}
                            disabled={isLoading}
                            placeholder="e.g., Red, Blue, Black"
                            style={{
                              background: "rgba(255, 255, 255, 0.9)",
                              border: "1px solid rgba(255, 107, 107, 0.3)",
                              color: "#333333",
                              padding: "12px 15px"
                            }}
                          />
                        </div>

                        <div className="col-md-4 mb-3">
                          <label htmlFor="material" className="form-label" style={{ color: "#555555", fontWeight: "600" }}>
                            Material (Optional)
                          </label>
                          <input
                            type="text"
                            className="form-control rounded-3"
                            id="material"
                            name="material"
                            value={formData.material}
                            onChange={handleInputChange}
                            disabled={isLoading}
                            placeholder="e.g., Cotton, Leather, Silk"
                            style={{
                              background: "rgba(255, 255, 255, 0.9)",
                              border: "1px solid rgba(255, 107, 107, 0.3)",
                              color: "#333333",
                              padding: "12px 15px"
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Stock Information */}
                    <div className="col-12 mb-4">
                      <h6 className="mb-3" style={{ color: "#333333" }}>
                        <i className="fas fa-cubes me-2" style={{ color: "#FF6B6B" }}></i>
                        D. Upatikanaji wa Bidhaa
                      </h6>
                      <div className="row">
                        <div className="col-md-4 mb-3">
                          <label htmlFor="stockStatus" className="form-label" style={{ color: "#555555", fontWeight: "600" }}>
                            Stock Status
                          </label>
                          <select
                            className="form-select rounded-3"
                            id="stockStatus"
                            name="stockStatus"
                            value={formData.stockStatus}
                            onChange={handleInputChange}
                            disabled={isLoading}
                            style={{
                              background: "rgba(255, 255, 255, 0.9)",
                              border: "1px solid rgba(255, 107, 107, 0.3)",
                              color: "#333333",
                              padding: "12px 15px"
                            }}
                          >
                            {stockStatusOptions.map(status => (
                              <option key={status} value={status}>{status}</option>
                            ))}
                          </select>
                        </div>

                        <div className="col-md-4 mb-3">
                          <label htmlFor="quantityAvailable" className="form-label" style={{ color: "#555555", fontWeight: "600" }}>
                            Quantity Available
                          </label>
                          <input
                            type="number"
                            className="form-control rounded-3"
                            id="quantityAvailable"
                            name="quantityAvailable"
                            value={formData.quantityAvailable}
                            onChange={handleInputChange}
                            disabled={isLoading}
                            min="0"
                            placeholder="e.g., 10"
                            style={{
                              background: "rgba(255, 255, 255, 0.9)",
                              border: "1px solid rgba(255, 107, 107, 0.3)",
                              color: "#333333",
                              padding: "12px 15px"
                            }}
                          />
                        </div>

                        <div className="col-md-4 mb-3">
                          <label htmlFor="lastUpdated" className="form-label" style={{ color: "#555555", fontWeight: "600" }}>
                            Last Updated (Auto)
                          </label>
                          <input
                            type="text"
                            className="form-control rounded-3"
                            id="lastUpdated"
                            name="lastUpdated"
                            value={formData.lastUpdated}
                            readOnly
                            disabled
                            style={{
                              background: "rgba(255, 255, 255, 0.7)",
                              border: "1px solid rgba(255, 107, 107, 0.3)",
                              color: "#666666",
                              padding: "12px 15px"
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="col-12 mb-4">
                      <h6 className="mb-3" style={{ color: "#333333" }}>
                        <i className="fas fa-tag me-2" style={{ color: "#FF6B6B" }}></i>
                        E. Bei & Ziada
                      </h6>
                      <div className="row">
                        <div className="col-md-4 mb-3">
                          <label htmlFor="price" className="form-label" style={{ color: "#555555", fontWeight: "600" }}>
                            Price (TZS) <span className="text-danger">*</span>
                          </label>
                          <div className="input-group">
                            <span className="input-group-text" style={{
                              background: "rgba(255, 107, 107, 0.1)",
                              border: "1px solid rgba(255, 107, 107, 0.3)",
                              color: "#FF6B6B"
                            }}>TZS</span>
                            <input
                              type="number"
                              className="form-control rounded-3"
                              id="price"
                              name="price"
                              value={formData.price}
                              onChange={handleInputChange}
                              required
                              disabled={isLoading}
                              min="0"
                              placeholder="e.g., 1500000"
                              style={{
                                background: "rgba(255, 255, 255, 0.9)",
                                border: "1px solid rgba(255, 107, 107, 0.3)",
                                color: "#333333",
                                padding: "12px 15px"
                              }}
                            />
                          </div>
                        </div>

                        <div className="col-md-4 mb-3">
                          <label htmlFor="priceType" className="form-label" style={{ color: "#555555", fontWeight: "600" }}>
                            Price Type
                          </label>
                          <select
                            className="form-select rounded-3"
                            id="priceType"
                            name="priceType"
                            value={formData.priceType}
                            onChange={handleInputChange}
                            disabled={isLoading}
                            style={{
                              background: "rgba(255, 255, 255, 0.9)",
                              border: "1px solid rgba(255, 107, 107, 0.3)",
                              color: "#333333",
                              padding: "12px 15px"
                            }}
                          >
                            {priceTypeOptions.map(type => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                          </select>
                        </div>

                        <div className="col-md-4 mb-3">
                          <label htmlFor="warranty" className="form-label" style={{ color: "#555555", fontWeight: "600" }}>
                            Warranty
                          </label>
                          <select
                            className="form-select rounded-3"
                            id="warranty"
                            name="warranty"
                            value={formData.warranty}
                            onChange={handleInputChange}
                            disabled={isLoading}
                            style={{
                              background: "rgba(255, 255, 255, 0.9)",
                              border: "1px solid rgba(255, 107, 107, 0.3)",
                              color: "#333333",
                              padding: "12px 15px"
                            }}
                          >
                            {warrantyOptions.map(option => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          </select>
                        </div>

                        {formData.warranty === "Yes" && (
                          <div className="col-md-12 mt-3">
                            <label htmlFor="warrantyPeriod" className="form-label" style={{ color: "#555555", fontWeight: "600" }}>
                              Warranty Period
                            </label>
                            <input
                              type="text"
                              className="form-control rounded-3"
                              id="warrantyPeriod"
                              name="warrantyPeriod"
                              value={formData.warrantyPeriod}
                              onChange={handleInputChange}
                              disabled={isLoading}
                              placeholder="e.g., 1 Year, 6 Months, Lifetime"
                              style={{
                                background: "rgba(255, 255, 255, 0.9)",
                                border: "1px solid rgba(255, 107, 107, 0.3)",
                                color: "#333333",
                                padding: "12px 15px"
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Images */}
                    <div className="col-12 mb-4">
                      <h6 className="mb-3" style={{ color: "#333333" }}>
                        <i className="fas fa-images me-2" style={{ color: "#FF6B6B" }}></i>
                        F. Picha
                      </h6>
                      
                      {/* Product Images */}
                      <div className="mb-4">
                        <label className="form-label" style={{ color: "#555555", fontWeight: "600" }}>
                          Product Images (1-6) <span className="text-danger">*</span>
                        </label>
                        <div className="mb-3">
                          <input
                            type="file"
                            className="form-control rounded-3"
                            accept="image/*"
                            multiple
                            onChange={(e) => handleFileChange(e, 'productImages')}
                            disabled={isLoading || files.productImages.length >= 6}
                            style={{
                              background: "rgba(255, 255, 255, 0.9)",
                              border: "1px solid rgba(255, 107, 107, 0.3)",
                              color: "#333333",
                              padding: "12px 15px"
                            }}
                          />
                          <small className="text-muted">
                            Upload 1-6 product images (Max 6). Recommended: Show product from different angles.
                          </small>
                        </div>
                        
                        {/* Image Previews */}
                        {filePreviews.productImages.length > 0 && (
                          <div className="row mt-3">
                            {filePreviews.productImages.map((preview, index) => (
                              <div key={index} className="col-md-4 col-sm-6 mb-3">
                                <div className="position-relative">
                                  <img
                                    src={preview}
                                    alt={`Product ${index + 1}`}
                                    className="img-thumbnail rounded-3"
                                    style={{ 
                                      width: "100%",
                                      height: "150px",
                                      objectFit: "cover",
                                      border: "2px solid rgba(255, 107, 107, 0.3)"
                                    }}
                                  />
                                  <button
                                    type="button"
                                    className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2"
                                    onClick={() => removeProductImage(index)}
                                    style={{
                                      width: "30px",
                                      height: "30px",
                                      borderRadius: "50%",
                                      padding: "0",
                                      background: "#FF6B6B",
                                      border: "none"
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

                      {/* Shop Image */}
                      <div>
                        <label className="form-label" style={{ color: "#555555", fontWeight: "600" }}>
                          Shop Image (Optional)
                        </label>
                        <div className="mb-3">
                          <input
                            type="file"
                            className="form-control rounded-3"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, 'shopImage')}
                            disabled={isLoading}
                            style={{
                              background: "rgba(255, 255, 255, 0.9)",
                              border: "1px solid rgba(255, 107, 107, 0.3)",
                              color: "#333333",
                              padding: "12px 15px"
                            }}
                          />
                          <small className="text-muted">
                            Upload a picture of your shop (Optional but recommended)
                          </small>
                        </div>
                        
                        {/* Shop Image Preview */}
                        {filePreviews.shopImage && (
                          <div className="row mt-3">
                            <div className="col-md-6">
                              <div className="position-relative">
                                <img
                                  src={filePreviews.shopImage}
                                  alt="Shop"
                                  className="img-thumbnail rounded-3"
                                  style={{ 
                                    width: "100%",
                                    height: "200px",
                                    objectFit: "cover",
                                    border: "2px solid rgba(255, 107, 107, 0.3)"
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Confirmation */}
              {currentStep === 4 && (
                <div style={{ animation: "fadeIn 0.5s ease" }}>
                  <h5 className="mb-4" style={{ color: "#333333" }}>
                    <i className="fas fa-check-circle me-2" style={{ color: "#FF6B6B" }}></i>
                    G. Thibitisho
                  </h5>
                  
                  <div className="mb-4">
                    <div className="card" style={{
                      background: "rgba(255, 107, 107, 0.05)",
                      border: "2px dashed rgba(255, 107, 107, 0.3)",
                      borderRadius: "15px"
                    }}>
                      <div className="card-body">
                        <h6 className="mb-3" style={{ color: "#333333" }}>
                          <i className="fas fa-info-circle me-2" style={{ color: "#FF6B6B" }}></i>
                          Summary of Your Registration
                        </h6>
                        
                        <div className="row">
                          <div className="col-md-6 mb-2">
                            <strong style={{ color: "#555555" }}>Shop:</strong> {formData.shopName}
                          </div>
                          <div className="col-md-6 mb-2">
                            <strong style={{ color: "#555555" }}>Seller:</strong> {formData.sellerName}
                          </div>
                          <div className="col-md-6 mb-2">
                            <strong style={{ color: "#555555" }}>Phone:</strong> {formData.phoneNumber}
                          </div>
                          <div className="col-md-6 mb-2">
                            <strong style={{ color: "#555555" }}>Category:</strong> {formData.mainCategory}
                          </div>
                          <div className="col-md-6 mb-2">
                            <strong style={{ color: "#555555" }}>Location:</strong> {formData.area}, {formData.district}
                          </div>
                          <div className="col-md-6 mb-2">
                            <strong style={{ color: "#555555" }}>Product:</strong> {formData.productName}
                          </div>
                          <div className="col-md-6 mb-2">
                            <strong style={{ color: "#555555" }}>Price:</strong> {formData.price ? new Intl.NumberFormat('en-TZ').format(formData.price) : "0"} TZS
                          </div>
                          <div className="col-md-6 mb-2">
                            <strong style={{ color: "#555555" }}>Stock:</strong> {formData.stockStatus}
                          </div>
                          <div className="col-md-6 mb-2">
                            <strong style={{ color: "#555555" }}>Condition:</strong> {formData.condition}
                          </div>
                          <div className="col-md-6 mb-2">
                            <strong style={{ color: "#555555" }}>Images:</strong> {files.productImages.length} uploaded
                          </div>
                          {formData.size && (
                            <div className="col-md-6 mb-2">
                              <strong style={{ color: "#555555" }}>Size:</strong> {formData.size}
                            </div>
                          )}
                          {formData.color && (
                            <div className="col-md-6 mb-2">
                              <strong style={{ color: "#555555" }}>Color:</strong> {formData.color}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="form-check mb-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="confirmAvailability"
                        name="confirmAvailability"
                        checked={formData.confirmAvailability}
                        onChange={handleInputChange}
                        required
                        style={{
                          background: formData.confirmAvailability ? "#FF6B6B" : "rgba(255, 255, 255, 0.9)",
                          borderColor: formData.confirmAvailability ? "#FF6B6B" : "rgba(255, 107, 107, 0.3)",
                          cursor: "pointer",
                          width: "20px",
                          height: "20px"
                        }}
                      />
                      <label className="form-check-label" htmlFor="confirmAvailability" style={{ 
                        color: "#555555",
                        fontWeight: "600"
                      }}>
                        I confirm that the product information provided is accurate and the product is available as stated
                      </label>
                    </div>

                    <div className="form-check mb-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="agreeToUpdate"
                        name="agreeToUpdate"
                        checked={formData.agreeToUpdate}
                        onChange={handleInputChange}
                        required
                        style={{
                          background: formData.agreeToUpdate ? "#FF6B6B" : "rgba(255, 255, 255, 0.9)",
                          borderColor: formData.agreeToUpdate ? "#FF6B6B" : "rgba(255, 107, 107, 0.3)",
                          cursor: "pointer",
                          width: "20px",
                          height: "20px"
                        }}
                      />
                      <label className="form-check-label" htmlFor="agreeToUpdate" style={{ 
                        color: "#555555",
                        fontWeight: "600"
                      }}>
                        I agree to update stock information regularly and notify customers of any changes
                      </label>
                    </div>
                  </div>

                  <div className="alert alert-info" style={{
                    background: "rgba(78, 205, 196, 0.1)",
                    border: "1px solid rgba(78, 205, 196, 0.3)",
                    color: "#4ECDC4",
                    borderRadius: "10px"
                  }}>
                    <i className="fas fa-lightbulb me-2"></i>
                    <strong>Tip:</strong> After registration, you can add more products from your seller dashboard. Different products can have different categories.
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top" style={{
                borderColor: "rgba(255, 107, 107, 0.2)"
              }}>
                <div>
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      className="btn btn-outline-secondary rounded-3 px-4 py-2"
                      onClick={prevStep}
                      disabled={isLoading}
                      style={{
                        border: "2px solid rgba(255, 107, 107, 0.3)",
                        background: isHovering.back ? "rgba(255, 107, 107, 0.1)" : "transparent",
                        color: "#FF6B6B",
                        transition: "all 0.3s ease",
                        transform: isHovering.back ? "translateX(-5px)" : "translateX(0)",
                        fontWeight: "600"
                      }}
                      onMouseEnter={() => handleMouseEnter("back")}
                      onMouseLeave={() => handleMouseLeave("back")}
                    >
                      <i className="fas fa-arrow-left me-2"></i>
                      Back
                    </button>
                  ) : (
                    <Link to="/vendor-login" className="btn btn-outline-secondary rounded-3 px-4 py-2 text-decoration-none" style={{
                      border: "2px solid rgba(255, 107, 107, 0.3)",
                      color: "#FF6B6B",
                      fontWeight: "600"
                    }}>
                      <i className="fas fa-sign-in-alt me-2"></i>
                      Back to Login
                    </Link>
                  )}
                </div>

                <div className="d-flex gap-3">
                  {currentStep < 4 ? (
                    <button
                      type="button"
                      className="btn rounded-3 px-4 py-2 fw-bold"
                      onClick={nextStep}
                      disabled={!validateStep(currentStep)}
                      style={{
                        background: validateStep(currentStep) 
                          ? "linear-gradient(135deg, #FF6B6B, #FF8E53)" 
                          : "rgba(255, 107, 107, 0.3)",
                        border: "none",
                        color: "white",
                        transition: "all 0.3s ease",
                        transform: isHovering.next ? "scale(1.05)" : "scale(1)",
                        opacity: validateStep(currentStep) ? 1 : 0.5,
                        fontWeight: "600"
                      }}
                      onMouseEnter={() => handleMouseEnter("next")}
                      onMouseLeave={() => handleMouseLeave("next")}
                    >
                      Continue
                      <i className="fas fa-arrow-right ms-2"></i>
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="btn btn-success rounded-3 px-4 py-2 fw-bold"
                      disabled={isLoading || !validateStep(4)}
                      style={{
                        background: isLoading 
                          ? "linear-gradient(135deg, #666, #888)" 
                          : isHovering.submit
                            ? "linear-gradient(135deg, #FF8E53, #FF6B6B)"
                            : "linear-gradient(135deg, #FF6B6B, #FF8E53)",
                        border: "none",
                        color: "white",
                        transition: "all 0.3s ease",
                        transform: isHovering.submit ? "scale(1.05)" : "scale(1)",
                        opacity: validateStep(4) ? 1 : 0.5,
                        boxShadow: isHovering.submit 
                          ? "0 10px 20px rgba(255, 107, 107, 0.4)" 
                          : "none",
                        fontWeight: "600"
                      }}
                      onMouseEnter={() => handleMouseEnter("submit")}
                      onMouseLeave={() => handleMouseLeave("submit")}
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Registering...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-check-circle me-2"></i>
                          Complete Registration
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Step Indicator */}
              <div className="text-center mt-3">
                <small className="text-muted">
                  Step {currentStep} of 4 • {Math.round(progress)}% Completed
                </small>
              </div>
            </form>
          </div>

          {/* Additional Info */}
          <div className="card-footer text-center" style={{
            background: "rgba(255, 255, 255, 0.8)",
            borderTop: "1px solid rgba(255, 107, 107, 0.1)"
          }}>
            <small style={{ color: "#666666" }}>
              <i className="fas fa-info-circle me-1" style={{ color: "#FF6B6B" }}></i>
              Your products will be visible to customers immediately • 
              <i className="fas fa-shield-alt ms-2 me-1" style={{ color: "#4ECDC4" }}></i>
              Verified sellers get priority in search results
            </small>
          </div>
        </div>

        {/* Footer Links */}
        <div className="text-center mt-4">
          <div className="d-flex justify-content-center gap-4 mb-3">
            <Link to="/" className="text-decoration-none" style={{ color: "#FF6B6B", fontWeight: "600" }}>
              <i className="fas fa-home me-1"></i> Home
            </Link>
            <a href="#" className="text-decoration-none" style={{ color: "#FF6B6B", fontWeight: "600" }}>
              <i className="fas fa-question-circle me-1"></i> Help Center
            </a>
            <a href="#" className="text-decoration-none" style={{ color: "#FF6B6B", fontWeight: "600" }}>
              <i className="fas fa-envelope me-1"></i> support@availo.co.tz
            </a>
            <a href="#" className="text-decoration-none" style={{ color: "#FF6B6B", fontWeight: "600" }}>
              <i className="fas fa-phone me-1"></i> +255 754 AVAILO
            </a>
          </div>
          <p style={{ color: "#666666", marginBottom: "0" }}>
            Already have an account? <Link to="/vendor-login" style={{ 
              color: "#FF6B6B", 
              fontWeight: "bold",
              textDecoration: "none",
              borderBottom: "2px solid transparent",
              transition: "border-bottom 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.target.style.borderBottom = "2px solid #FF6B6B";
            }}
            onMouseLeave={(e) => {
              e.target.style.borderBottom = "2px solid transparent";
            }}>
              Login here
            </Link>
          </p>
        </div>
      </div>

      {/* Inline Styles for Animations */}
      <style>
        {`
          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          
          @keyframes spin {
            0% { transform: translate(-50%, -50%) rotate(0deg); }
            100% { transform: translate(-50%, -50%) rotate(360deg); }
          }
          
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          .form-control:focus, .form-select:focus {
            background: rgba(255, 255, 255, 0.95) !important;
            border-color: #FF6B6B !important;
            box-shadow: 0 0 0 0.25rem rgba(255, 107, 107, 0.25) !important;
            color: #333333 !important;
          }
          
          .form-control::placeholder {
            color: rgba(102, 102, 102, 0.6) !important;
          }
          
          .btn:hover {
            transform: translateY(-2px);
            transition: all 0.3s ease;
          }
        `}
      </style>
      
      {/* Font Awesome Icons */}
      <link 
        rel="stylesheet" 
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" 
      />
    </div>
  );
}

export default VendorRegister;