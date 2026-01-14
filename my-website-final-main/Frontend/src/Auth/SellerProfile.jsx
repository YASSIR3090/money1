import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate } from "react-router-dom";

function SellerProfile() {
  const [seller, setSeller] = useState(null);
  const [sellerProducts, setSellerProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("products");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [newProductForm, setNewProductForm] = useState({
    productName: "",
    mainCategory: "",
    productCategory: "",
    brand: "",
    price: "",
    stockStatus: "Available",
    condition: "New",
    specifications: "",
    description: ""
  });
  const [showNewProductForm, setShowNewProductForm] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
  
  const navigate = useNavigate();

  // Sample categories for dropdown
  const categories = [
    "Electronics", "Fashion", "Home Appliances", "Furniture", 
    "Sports", "Vehicles", "Beauty", "Books", "Other"
  ];

  const subCategories = {
    "Electronics": ["TV & Home Theater", "Mobile Phones", "Laptops", "Cameras", "Gaming", "Other"],
    "Fashion": ["Bags & Accessories", "Watches", "Clothing", "Footwear", "Jewelry"],
    "Home Appliances": ["Refrigerators", "Kitchen Appliances", "Air Conditioning", "Laundry", "Other"],
    "Furniture": ["Office Furniture", "Living Room", "Bedroom", "Kitchen", "Outdoor"],
    "Sports": ["Footwear", "Equipment", "Clothing", "Bicycles"],
    "Vehicles": ["Cars", "Motorcycles", "Bicycles", "Auto Parts"],
    "Beauty": ["Skincare", "Makeup", "Fragrances", "Hair Care"],
    "Books": ["Fiction", "Non-Fiction", "Educational", "Children"],
    "Other": ["General"]
  };

  const conditionOptions = ["New", "Refurbished", "Used - Like New", "Used - Good", "Used - Fair"];
  const stockStatusOptions = ["Available", "Limited", "Out of Stock"];

  useEffect(() => {
    checkLoginStatus();
    loadSellerProducts();
  }, []);

  const checkLoginStatus = () => {
    const isSellerAuthenticated = localStorage.getItem('isSellerAuthenticated') === 'true';
    const sellerData = JSON.parse(localStorage.getItem('currentSeller') || 'null');
    
    if (!isSellerAuthenticated || !sellerData) {
      navigate('/vendor-login');
      return;
    }
    
    setSeller(sellerData);
    setEditForm(sellerData);
    setIsLoading(false);
  };

  const loadSellerProducts = () => {
    const allSellers = JSON.parse(localStorage.getItem('allSellersData') || '[]');
    const currentSeller = JSON.parse(localStorage.getItem('currentSeller') || 'null');
    
    if (currentSeller) {
      // Filter products for this seller (simplified - in real app, you'd filter by seller ID)
      const sellerPhone = currentSeller.phoneNumber;
      const products = allSellers.filter(product => 
        product.phoneNumber === sellerPhone || 
        (currentSeller.email && product.email === currentSeller.email) ||
        (currentSeller.id && product.id === currentSeller.id)
      );
      
      setSellerProducts(products);
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    
    // Update seller in localStorage
    const allSellers = JSON.parse(localStorage.getItem('allSellersData') || '[]');
    const updatedSellers = allSellers.map(s => {
      if (s.phoneNumber === seller.phoneNumber || s.email === seller.email) {
        return { ...s, ...editForm };
      }
      return s;
    });
    
    localStorage.setItem('allSellersData', JSON.stringify(updatedSellers));
    localStorage.setItem('currentSeller', JSON.stringify(editForm));
    
    setSeller(editForm);
    setIsEditing(false);
    
    alert("Profile updated successfully!");
    loadSellerProducts(); // Reload products
  };

  const handleNewProductSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!newProductForm.productName.trim() || !newProductForm.price.trim()) {
      alert("Please fill in product name and price");
      return;
    }
    
    // Create new product
    const newProduct = {
      id: Date.now(),
      productName: newProductForm.productName,
      shopName: seller.shopName || "My Shop",
      brand: newProductForm.brand,
      mainCategory: newProductForm.mainCategory,
      productCategory: newProductForm.productCategory,
      area: seller.area || "",
      district: seller.district || "",
      region: seller.region || "",
      price: newProductForm.price,
      stockStatus: newProductForm.stockStatus,
      condition: newProductForm.condition,
      sellerName: seller.sellerName || seller.shopName || "Seller",
      phoneNumber: seller.phoneNumber,
      email: seller.email || "",
      productImages: imagePreviews.length > 0 ? imagePreviews : ["https://images.unsplash.com/photo-1556656793-08538906a9f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
      specifications: newProductForm.specifications,
      description: newProductForm.description,
      registrationDate: new Date().toISOString()
    };
    
    // Save to localStorage
    const allSellers = JSON.parse(localStorage.getItem('allSellersData') || '[]');
    allSellers.push(newProduct);
    localStorage.setItem('allSellersData', JSON.stringify(allSellers));
    
    // Reset form and reload products
    setNewProductForm({
      productName: "",
      mainCategory: "",
      productCategory: "",
      brand: "",
      price: "",
      stockStatus: "Available",
      condition: "New",
      specifications: "",
      description: ""
    });
    setImagePreviews([]);
    setShowNewProductForm(false);
    loadSellerProducts();
    
    alert("Product added successfully!");
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      const allSellers = JSON.parse(localStorage.getItem('allSellersData') || '[]');
      const updatedSellers = allSellers.filter(product => product.id !== productId);
      localStorage.setItem('allSellersData', JSON.stringify(updatedSellers));
      loadSellerProducts();
      alert("Product deleted successfully!");
    }
  };

  const handleImageUpload = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      const newPreviews = [];
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          newPreviews.push(e.target.result);
          if (newPreviews.length === files.length) {
            setImagePreviews(prev => [...prev, ...newPreviews].slice(0, 6)); // Max 6 images
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
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

  const handleLogout = () => {
    localStorage.removeItem("isSellerAuthenticated");
    localStorage.removeItem("currentSeller");
    localStorage.removeItem("sellerToken");
    localStorage.removeItem("sellerId");
    navigate('/vendor-login');
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
    <div style={{ minHeight: "100vh", background: "#f8f9fa" }}>
      {/* Top Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top py-2">
        <div className="container-fluid px-3">
          <Link className="navbar-brand fw-bold text-danger" to="/" style={{ fontSize: "18px" }}>
            <i className="fas fa-shopping-cart me-2"></i>
            Availo
          </Link>
          
          <div className="d-flex align-items-center">
            <Link to="/public-sellers" className="btn btn-outline-danger btn-sm me-2">
              <i className="fas fa-home me-1"></i> Marketplace
            </Link>
            <div className="dropdown">
              <button 
                className="btn btn-outline-danger dropdown-toggle" 
                type="button" 
                data-bs-toggle="dropdown"
                style={{ width: "40px", height: "40px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <i className="fas fa-user"></i>
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li><span className="dropdown-item disabled fw-bold">Hello, {seller?.sellerName || "Seller"}</span></li>
                <li><hr className="dropdown-divider" /></li>
                <li><button className="dropdown-item" onClick={() => setActiveTab("profile")}><i className="fas fa-user-circle me-2"></i> My Profile</button></li>
                <li><button className="dropdown-item" onClick={() => setActiveTab("products")}><i className="fas fa-box me-2"></i> My Products</button></li>
                <li><button className="dropdown-item" onClick={() => setActiveTab("settings")}><i className="fas fa-cog me-2"></i> Settings</button></li>
                <li><hr className="dropdown-divider" /></li>
                <li><button className="dropdown-item text-danger" onClick={handleLogout}><i className="fas fa-sign-out-alt me-2"></i> Logout</button></li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container-fluid mt-3 mb-5">
        <div className="row">
          {/* Sidebar */}
          <div className="col-lg-3 col-xl-2 d-none d-lg-block">
            <div className="card shadow-sm mb-3 sticky-top" style={{ top: "70px" }}>
              <div className="card-body text-center">
                <div className="mb-3">
                  <div className="position-relative d-inline-block">
                    <img 
                      src={seller?.shopImage || "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"} 
                      alt="Shop" 
                      className="rounded-circle" 
                      style={{ width: "120px", height: "120px", objectFit: "cover", border: "3px solid #FF6B6B" }}
                    />
                    {seller?.isVerified && (
                      <span className="position-absolute bottom-0 end-0 bg-success text-white rounded-circle p-1" title="Verified Seller">
                        <i className="fas fa-check-circle"></i>
                      </span>
                    )}
                  </div>
                  <h5 className="mt-3 mb-1">{seller?.shopName || "My Shop"}</h5>
                  <p className="text-muted mb-0">
                    <i className="fas fa-star text-warning me-1"></i>
                    Seller Rating: 4.5/5
                  </p>
                  <div className="mt-2">
                    <span className="badge bg-danger">Active</span>
                    <span className="badge bg-info ms-1">{sellerProducts.length} Products</span>
                  </div>
                </div>

                <div className="list-group list-group-flush">
                  <button 
                    className={`list-group-item list-group-item-action d-flex align-items-center ${activeTab === "profile" ? "active" : ""}`}
                    onClick={() => setActiveTab("profile")}
                  >
                    <i className="fas fa-user-circle me-3"></i>
                    Profile Details
                  </button>
                  <button 
                    className={`list-group-item list-group-item-action d-flex align-items-center ${activeTab === "products" ? "active" : ""}`}
                    onClick={() => setActiveTab("products")}
                  >
                    <i className="fas fa-box me-3"></i>
                    My Products
                    <span className="badge bg-danger ms-auto">{sellerProducts.length}</span>
                  </button>
                  <button 
                    className={`list-group-item list-group-item-action d-flex align-items-center ${activeTab === "add" ? "active" : ""}`}
                    onClick={() => setActiveTab("add")}
                  >
                    <i className="fas fa-plus-circle me-3"></i>
                    Add New Product
                  </button>
                  <button 
                    className={`list-group-item list-group-item-action d-flex align-items-center ${activeTab === "analytics" ? "active" : ""}`}
                    onClick={() => setActiveTab("analytics")}
                  >
                    <i className="fas fa-chart-line me-3"></i>
                    Analytics
                  </button>
                  <button 
                    className={`list-group-item list-group-item-action d-flex align-items-center ${activeTab === "settings" ? "active" : ""}`}
                    onClick={() => setActiveTab("settings")}
                  >
                    <i className="fas fa-cog me-3"></i>
                    Settings
                  </button>
                </div>

                <div className="mt-4">
                  <div className="card border-danger">
                    <div className="card-body text-center">
                      <h6 className="card-title">Quick Stats</h6>
                      <div className="row mt-3">
                        <div className="col-6 mb-3">
                          <div className="text-danger fw-bold">{sellerProducts.length}</div>
                          <small className="text-muted">Products</small>
                        </div>
                        <div className="col-6 mb-3">
                          <div className="text-danger fw-bold">24</div>
                          <small className="text-muted">Views Today</small>
                        </div>
                        <div className="col-6">
                          <div className="text-danger fw-bold">5</div>
                          <small className="text-muted">Messages</small>
                        </div>
                        <div className="col-6">
                          <div className="text-danger fw-bold">98%</div>
                          <small className="text-muted">Response Rate</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="col-lg-9 col-xl-10">
            {/* Mobile Profile Header */}
            <div className="d-lg-none mb-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <img 
                      src={seller?.shopImage || "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"} 
                      alt="Shop" 
                      className="rounded-circle me-3" 
                      style={{ width: "60px", height: "60px", objectFit: "cover" }}
                    />
                    <div>
                      <h5 className="mb-1">{seller?.shopName || "My Shop"}</h5>
                      <p className="text-muted mb-0">
                        <i className="fas fa-box me-1"></i>
                        {sellerProducts.length} Products
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <div className="btn-group w-100" role="group">
                      <button 
                        className={`btn ${activeTab === "profile" ? "btn-danger" : "btn-outline-danger"}`}
                        onClick={() => setActiveTab("profile")}
                      >
                        <i className="fas fa-user"></i>
                      </button>
                      <button 
                        className={`btn ${activeTab === "products" ? "btn-danger" : "btn-outline-danger"}`}
                        onClick={() => setActiveTab("products")}
                      >
                        <i className="fas fa-box"></i>
                      </button>
                      <button 
                        className={`btn ${activeTab === "add" ? "btn-danger" : "btn-outline-danger"}`}
                        onClick={() => setActiveTab("add")}
                      >
                        <i className="fas fa-plus"></i>
                      </button>
                      <button 
                        className={`btn ${activeTab === "analytics" ? "btn-danger" : "btn-outline-danger"}`}
                        onClick={() => setActiveTab("analytics")}
                      >
                        <i className="fas fa-chart-line"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Details Tab */}
            {activeTab === "profile" && (
              <div className="card shadow-sm mb-4">
                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">
                    <i className="fas fa-user-circle me-2"></i>
                    Seller Profile
                  </h5>
                  <button 
                    className="btn btn-sm btn-danger" 
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <i className={`fas fa-${isEditing ? "times" : "edit"} me-1`}></i>
                    {isEditing ? "Cancel" : "Edit"}
                  </button>
                </div>
                
                <div className="card-body">
                  {isEditing ? (
                    <form onSubmit={handleEditSubmit}>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Shop Name</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            value={editForm.shopName || ""}
                            onChange={(e) => setEditForm({...editForm, shopName: e.target.value})}
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Seller Name</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            value={editForm.sellerName || ""}
                            onChange={(e) => setEditForm({...editForm, sellerName: e.target.value})}
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Phone Number</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            value={editForm.phoneNumber || ""}
                            onChange={(e) => setEditForm({...editForm, phoneNumber: e.target.value})}
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Email</label>
                          <input 
                            type="email" 
                            className="form-control" 
                            value={editForm.email || ""}
                            onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Region</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            value={editForm.region || ""}
                            onChange={(e) => setEditForm({...editForm, region: e.target.value})}
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label">District</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            value={editForm.district || ""}
                            onChange={(e) => setEditForm({...editForm, district: e.target.value})}
                          />
                        </div>
                        <div className="col-md-12 mb-3">
                          <label className="form-label">Area / Street</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            value={editForm.area || ""}
                            onChange={(e) => setEditForm({...editForm, area: e.target.value})}
                          />
                        </div>
                        <div className="col-md-12 mb-3">
                          <label className="form-label">Business Description</label>
                          <textarea 
                            className="form-control" 
                            rows="3"
                            value={editForm.description || ""}
                            onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                          ></textarea>
                        </div>
                        <div className="col-12">
                          <button type="submit" className="btn btn-danger">
                            <i className="fas fa-save me-1"></i>
                            Save Changes
                          </button>
                        </div>
                      </div>
                    </form>
                  ) : (
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <h6><i className="fas fa-store me-2 text-muted"></i> Shop Information</h6>
                        <table className="table table-sm">
                          <tbody>
                            <tr>
                              <th width="40%">Shop Name:</th>
                              <td>{seller?.shopName || "Not set"}</td>
                            </tr>
                            <tr>
                              <th>Seller Name:</th>
                              <td>{seller?.sellerName || "Not set"}</td>
                            </tr>
                            <tr>
                              <th>Business Type:</th>
                              <td>{seller?.businessType || "Not specified"}</td>
                            </tr>
                            <tr>
                              <th>Registration Date:</th>
                              <td>{seller?.registrationDate ? new Date(seller.registrationDate).toLocaleDateString() : "Not available"}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      
                      <div className="col-md-6 mb-3">
                        <h6><i className="fas fa-address-card me-2 text-muted"></i> Contact Information</h6>
                        <table className="table table-sm">
                          <tbody>
                            <tr>
                              <th width="40%">Phone:</th>
                              <td>{seller?.phoneNumber || "Not set"}</td>
                            </tr>
                            <tr>
                              <th>Email:</th>
                              <td>{seller?.email || "Not set"}</td>
                            </tr>
                            <tr>
                              <th>Opening Hours:</th>
                              <td>{seller?.openingHours || "Not specified"}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      
                      <div className="col-12 mb-3">
                        <h6><i className="fas fa-map-marker-alt me-2 text-muted"></i> Location</h6>
                        <table className="table table-sm">
                          <tbody>
                            <tr>
                              <th width="40%">Region:</th>
                              <td>{seller?.region || "Not set"}</td>
                            </tr>
                            <tr>
                              <th>District:</th>
                              <td>{seller?.district || "Not set"}</td>
                            </tr>
                            <tr>
                              <th>Area/Street:</th>
                              <td>{seller?.area || "Not set"}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      
                      <div className="col-12">
                        <h6><i className="fas fa-info-circle me-2 text-muted"></i> Additional Information</h6>
                        <div className="card bg-light">
                          <div className="card-body">
                            <p className="mb-0">{seller?.description || "No additional information provided."}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* My Products Tab */}
            {activeTab === "products" && (
              <div className="card shadow-sm mb-4">
                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">
                    <i className="fas fa-box me-2"></i>
                    My Products ({sellerProducts.length})
                  </h5>
                  <button 
                    className="btn btn-sm btn-danger" 
                    onClick={() => setShowNewProductForm(true)}
                  >
                    <i className="fas fa-plus me-1"></i>
                    Add Product
                  </button>
                </div>
                
                <div className="card-body">
                  {sellerProducts.length === 0 ? (
                    <div className="text-center py-5">
                      <i className="fas fa-box-open fa-3x text-muted mb-3"></i>
                      <h5 className="text-muted">No products listed yet</h5>
                      <p className="text-muted mb-4">Start by adding your first product</p>
                      <button 
                        className="btn btn-danger" 
                        onClick={() => setShowNewProductForm(true)}
                      >
                        <i className="fas fa-plus me-1"></i>
                        Add First Product
                      </button>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Product</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Condition</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sellerProducts.map((product, index) => (
                            <tr key={product.id || index}>
                              <td>
                                <div className="d-flex align-items-center">
                                  <img 
                                    src={product.productImages?.[0] || "https://images.unsplash.com/photo-1556656793-08538906a9f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
                                    alt={product.productName} 
                                    className="rounded me-3"
                                    style={{ width: "50px", height: "50px", objectFit: "cover" }}
                                  />
                                  <div>
                                    <strong>{product.productName}</strong>
                                    <div className="small text-muted">{product.brand || "No brand"}</div>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <span className="badge bg-info">{product.mainCategory || "Uncategorized"}</span>
                                {product.productCategory && (
                                  <div className="small text-muted">{product.productCategory}</div>
                                )}
                              </td>
                              <td>
                                <strong className="text-danger">{formatPrice(product.price)}</strong>
                              </td>
                              <td>
                                <span className={`badge bg-${product.stockStatus === "Available" ? "success" : product.stockStatus === "Limited" ? "warning" : "danger"}`}>
                                  {product.stockStatus || "Unknown"}
                                </span>
                              </td>
                              <td>
                                <span className="badge bg-secondary">{product.condition || "New"}</span>
                              </td>
                              <td>
                                <div className="btn-group btn-group-sm">
                                  <button className="btn btn-outline-primary" title="Edit">
                                    <i className="fas fa-edit"></i>
                                  </button>
                                  <button 
                                    className="btn btn-outline-danger" 
                                    title="Delete"
                                    onClick={() => handleDeleteProduct(product.id)}
                                  >
                                    <i className="fas fa-trash"></i>
                                  </button>
                                  <Link 
                                    to="/public-sellers" 
                                    className="btn btn-outline-success"
                                    title="View in Marketplace"
                                  >
                                    <i className="fas fa-eye"></i>
                                  </Link>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Add New Product Tab/Form */}
            {(activeTab === "add" || showNewProductForm) && (
              <div className="card shadow-sm mb-4">
                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">
                    <i className="fas fa-plus-circle me-2"></i>
                    Add New Product
                  </h5>
                  <button 
                    className="btn btn-sm btn-outline-secondary" 
                    onClick={() => {
                      setShowNewProductForm(false);
                      if (activeTab === "add") setActiveTab("products");
                    }}
                  >
                    <i className="fas fa-times me-1"></i>
                    Close
                  </button>
                </div>
                
                <div className="card-body">
                  <form onSubmit={handleNewProductSubmit}>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Product Name *</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          required
                          value={newProductForm.productName}
                          onChange={(e) => setNewProductForm({...newProductForm, productName: e.target.value})}
                          placeholder="e.g., Samsung TV 55 inch"
                        />
                      </div>
                      
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Main Category *</label>
                        <select 
                          className="form-select" 
                          required
                          value={newProductForm.mainCategory}
                          onChange={(e) => setNewProductForm({...newProductForm, mainCategory: e.target.value, productCategory: ""})}
                        >
                          <option value="">Select Category</option>
                          {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Sub Category</label>
                        <select 
                          className="form-select" 
                          value={newProductForm.productCategory}
                          onChange={(e) => setNewProductForm({...newProductForm, productCategory: e.target.value})}
                          disabled={!newProductForm.mainCategory}
                        >
                          <option value="">Select Sub Category</option>
                          {newProductForm.mainCategory && subCategories[newProductForm.mainCategory]?.map(subCat => (
                            <option key={subCat} value={subCat}>{subCat}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Brand</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          value={newProductForm.brand}
                          onChange={(e) => setNewProductForm({...newProductForm, brand: e.target.value})}
                          placeholder="e.g., Samsung, Apple, Nike"
                        />
                      </div>
                      
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Price (TZS) *</label>
                        <input 
                          type="number" 
                          className="form-control" 
                          required
                          value={newProductForm.price}
                          onChange={(e) => setNewProductForm({...newProductForm, price: e.target.value})}
                          placeholder="e.g., 850000"
                        />
                      </div>
                      
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Stock Status</label>
                        <select 
                          className="form-select" 
                          value={newProductForm.stockStatus}
                          onChange={(e) => setNewProductForm({...newProductForm, stockStatus: e.target.value})}
                        >
                          {stockStatusOptions.map(status => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Condition</label>
                        <select 
                          className="form-select" 
                          value={newProductForm.condition}
                          onChange={(e) => setNewProductForm({...newProductForm, condition: e.target.value})}
                        >
                          {conditionOptions.map(condition => (
                            <option key={condition} value={condition}>{condition}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Product Images</label>
                        <input 
                          type="file" 
                          className="form-control" 
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                        <small className="text-muted">Upload up to 6 images (first image will be the main display)</small>
                        
                        {imagePreviews.length > 0 && (
                          <div className="mt-3">
                            <div className="d-flex flex-wrap gap-2">
                              {imagePreviews.map((preview, index) => (
                                <div key={index} className="position-relative">
                                  <img 
                                    src={preview} 
                                    alt={`Preview ${index + 1}`}
                                    className="rounded"
                                    style={{ width: "80px", height: "80px", objectFit: "cover" }}
                                  />
                                  <button 
                                    type="button"
                                    className="btn btn-sm btn-danger position-absolute top-0 end-0 translate-middle"
                                    onClick={() => removeImage(index)}
                                    style={{ width: "20px", height: "20px", padding: 0 }}
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="col-12 mb-3">
                        <label className="form-label">Specifications / Description</label>
                        <textarea 
                          className="form-control" 
                          rows="4"
                          value={newProductForm.specifications}
                          onChange={(e) => setNewProductForm({...newProductForm, specifications: e.target.value})}
                          placeholder="Describe your product features, specifications, condition, etc."
                        ></textarea>
                      </div>
                      
                      <div className="col-12">
                        <div className="d-flex justify-content-between">
                          <button 
                            type="button" 
                            className="btn btn-outline-secondary"
                            onClick={() => {
                              setNewProductForm({
                                productName: "",
                                mainCategory: "",
                                productCategory: "",
                                brand: "",
                                price: "",
                                stockStatus: "Available",
                                condition: "New",
                                specifications: "",
                                description: ""
                              });
                              setImagePreviews([]);
                            }}
                          >
                            <i className="fas fa-redo me-1"></i>
                            Reset Form
                          </button>
                          <button type="submit" className="btn btn-danger">
                            <i className="fas fa-save me-1"></i>
                            Add Product
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === "analytics" && (
              <div className="card shadow-sm mb-4">
                <div className="card-header bg-white">
                  <h5 className="mb-0">
                    <i className="fas fa-chart-line me-2"></i>
                    Seller Analytics
                  </h5>
                </div>
                
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-3 mb-3">
                      <div className="card bg-primary text-white">
                        <div className="card-body text-center">
                          <h3 className="mb-1">{sellerProducts.length}</h3>
                          <p className="mb-0">Total Products</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-md-3 mb-3">
                      <div className="card bg-success text-white">
                        <div className="card-body text-center">
                          <h3 className="mb-1">24</h3>
                          <p className="mb-0">Views Today</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-md-3 mb-3">
                      <div className="card bg-info text-white">
                        <div className="card-body text-center">
                          <h3 className="mb-1">12</h3>
                          <p className="mb-0">Inquiries</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-md-3 mb-3">
                      <div className="card bg-warning text-white">
                        <div className="card-body text-center">
                          <h3 className="mb-1">8</h3>
                          <p className="mb-0">Messages</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h6>Product Performance</h6>
                    <div className="table-responsive">
                      <table className="table table-sm">
                        <thead>
                          <tr>
                            <th>Product</th>
                            <th>Views</th>
                            <th>Inquiries</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sellerProducts.slice(0, 5).map((product, index) => (
                            <tr key={index}>
                              <td>{product.productName}</td>
                              <td>{Math.floor(Math.random() * 50) + 5}</td>
                              <td>{Math.floor(Math.random() * 10) + 1}</td>
                              <td>
                                <span className={`badge bg-${product.stockStatus === "Available" ? "success" : "danger"}`}>
                                  {product.stockStatus}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div className="alert alert-info mt-4">
                    <i className="fas fa-info-circle me-2"></i>
                    <strong>Tip:</strong> Keep your product information updated and respond quickly to inquiries to increase sales.
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="card shadow-sm mb-4">
                <div className="card-header bg-white">
                  <h5 className="mb-0">
                    <i className="fas fa-cog me-2"></i>
                    Account Settings
                  </h5>
                </div>
                
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <h6>Account Security</h6>
                      <div className="card">
                        <div className="card-body">
                          <div className="mb-3">
                            <label className="form-label">Change Password</label>
                            <input type="password" className="form-control" placeholder="Current password" />
                          </div>
                          <div className="mb-3">
                            <input type="password" className="form-control" placeholder="New password" />
                          </div>
                          <div className="mb-3">
                            <input type="password" className="form-control" placeholder="Confirm new password" />
                          </div>
                          <button className="btn btn-danger btn-sm">
                            <i className="fas fa-key me-1"></i>
                            Update Password
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-md-6 mb-4">
                      <h6>Notification Settings</h6>
                      <div className="card">
                        <div className="card-body">
                          <div className="form-check mb-2">
                            <input className="form-check-input" type="checkbox" id="notifyEmail" defaultChecked />
                            <label className="form-check-label" htmlFor="notifyEmail">
                              Email notifications
                            </label>
                          </div>
                          <div className="form-check mb-2">
                            <input className="form-check-input" type="checkbox" id="notifySMS" defaultChecked />
                            <label className="form-check-label" htmlFor="notifySMS">
                              SMS notifications
                            </label>
                          </div>
                          <div className="form-check mb-2">
                            <input className="form-check-input" type="checkbox" id="notifyWhatsApp" />
                            <label className="form-check-label" htmlFor="notifyWhatsApp">
                              WhatsApp notifications
                            </label>
                          </div>
                          <div className="form-check">
                            <input className="form-check-input" type="checkbox" id="notifyPromo" defaultChecked />
                            <label className="form-check-label" htmlFor="notifyPromo">
                              Promotional offers
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h6>Danger Zone</h6>
                    <div className="card border-danger">
                      <div className="card-body">
                        <h6 className="text-danger">Delete Account</h6>
                        <p className="text-muted">Once you delete your account, all your products and data will be permanently removed.</p>
                        <button className="btn btn-outline-danger" onClick={() => {
                          if (window.confirm("Are you sure? This action cannot be undone.")) {
                            handleLogout();
                          }
                        }}>
                          <i className="fas fa-trash me-1"></i>
                          Delete My Account
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-dark text-white py-4 mt-5">
        <div className="container">
          <div className="row">
            <div className="col-md-4 mb-3">
              <h5 className="mb-3" style={{ fontSize: "16px" }}>
                <i className="fas fa-shopping-cart me-2"></i>
                Availo Marketplace
              </h5>
              <p className="text-light small" style={{ fontSize: "13px" }}>
                Manage your products and grow your business with Availo.
              </p>
            </div>
            <div className="col-md-4 mb-3">
              <h5 className="mb-3" style={{ fontSize: "16px" }}>Quick Links</h5>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <Link to="/public-sellers" className="text-light text-decoration-none" style={{ fontSize: "13px" }}>
                    <i className="fas fa-store me-1"></i> Marketplace
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/vendor-register" className="text-light text-decoration-none" style={{ fontSize: "13px" }}>
                    <i className="fas fa-plus-circle me-1"></i> Add More Products
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col-md-4 mb-3">
              <h5 className="mb-3" style={{ fontSize: "16px" }}>Support</h5>
              <ul className="list-unstyled">
                <li className="mb-2" style={{ fontSize: "13px" }}>
                  <i className="fas fa-phone me-2"></i>
                  +255 754 AVAILO
                </li>
                <li className="mb-2" style={{ fontSize: "13px" }}>
                  <i className="fas fa-envelope me-2"></i>
                  seller-support@availo.co.tz
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

      {/* Font Awesome */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />

      <style>
        {`
          .list-group-item.active {
            background-color: #FF6B6B;
            border-color: #FF6B6B;
          }
          
          .card {
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          }
          
          .card:hover {
            transform: translateY(-3px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
          }
          
          .btn-danger {
            background: linear-gradient(135deg, #FF6B6B, #FF8E53);
            border: none;
          }
          
          .btn-danger:hover {
            background: linear-gradient(135deg, #FF8E53, #FF6B6B);
            transform: translateY(-2px);
          }
          
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
}

export default SellerProfile;