// src/admin/AdminProducts.jsx - COMPLETE FIXED VERSION 🔥
// ✅ VIEW ALL PRODUCTS FROM ALL SELLERS
// ✅ DELETE INAPPROPRIATE PRODUCTS
// ✅ SEARCH & FILTER PRODUCTS
// ✅ SHOW SELLER INFORMATION
// ✅ REAL-TIME UPDATES

import React, { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function AdminProducts() {
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();
  
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    limited: 0,
    outOfStock: 0
  });

  // ✅ Check admin authentication
  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin/login');
    }
  }, [isAdmin, navigate]);

  // ✅ Load all products from localStorage
  const loadAllProducts = () => {
    setIsLoading(true);
    try {
      const allSellers = JSON.parse(localStorage.getItem('allSellersData') || '[]');
      
      // Sort by registration date (newest first)
      const sortedProducts = [...allSellers].sort((a, b) => {
        const dateA = new Date(a.registrationDate || 0);
        const dateB = new Date(b.registrationDate || 0);
        return dateB - dateA;
      });

      setProducts(sortedProducts);
      setFilteredProducts(sortedProducts);
      
      // Calculate stats
      const total = sortedProducts.length;
      const available = sortedProducts.filter(p => p.stockStatus === 'Available').length;
      const limited = sortedProducts.filter(p => p.stockStatus === 'Limited').length;
      const outOfStock = sortedProducts.filter(p => p.stockStatus === 'Out of Stock').length;
      
      setStats({ total, available, limited, outOfStock });
      
      console.log(`✅ AdminProducts: Loaded ${sortedProducts.length} products`);
    } catch (error) {
      console.error('❌ Error loading products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Initial load and refresh on storage changes
  useEffect(() => {
    loadAllProducts();

    // Listen for storage changes (when seller adds/edits products)
    const handleStorageChange = (e) => {
      if (e.key === 'allSellersData' || e.key === null) {
        console.log('🔄 Storage changed, reloading products...');
        loadAllProducts();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Custom event for real-time updates
    const handleProductsUpdated = () => {
      console.log('🔄 Products updated event received');
      loadAllProducts();
    };

    window.addEventListener('productsUpdated', handleProductsUpdated);
    
    // Refresh every 5 seconds for real-time updates
    const interval = setInterval(() => {
      loadAllProducts();
    }, 5000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('productsUpdated', handleProductsUpdated);
      clearInterval(interval);
    };
  }, [refreshKey]);

  // ✅ Filter and search products
  useEffect(() => {
    let filtered = [...products];

    // Apply search
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.productName?.toLowerCase().includes(term) ||
        product.shopName?.toLowerCase().includes(term) ||
        product.sellerName?.toLowerCase().includes(term) ||
        product.email?.toLowerCase().includes(term) ||
        product.brand?.toLowerCase().includes(term) ||
        product.mainCategory?.toLowerCase().includes(term)
      );
    }

    // Apply category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(product => 
        product.mainCategory === filterCategory || 
        product.productCategory === filterCategory
      );
    }

    // Apply stock status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(product => product.stockStatus === filterStatus);
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, filterCategory, filterStatus]);

  // ✅ Delete product from all sellers data
  const handleDeleteProduct = (productId) => {
    try {
      // Get all sellers
      const allSellers = JSON.parse(localStorage.getItem('allSellersData') || '[]');
      
      // Find the product to delete for logging
      const productToDelete = allSellers.find(p => p.id === productId);
      
      // Filter out the product
      const updatedSellers = allSellers.filter(product => product.id !== productId);
      
      // Save back to localStorage
      localStorage.setItem('allSellersData', JSON.stringify(updatedSellers));
      
      console.log(`🗑️ Admin deleted product: ${productId}`, productToDelete?.productName);
      
      // Update state
      setProducts(updatedSellers);
      
      // Dispatch event for other components
      const event = new CustomEvent('productsUpdated', { 
        detail: { 
          action: 'delete',
          productId,
          adminDeleted: true,
          timestamp: Date.now()
        } 
      });
      window.dispatchEvent(event);
      
      // Also dispatch storage event for other tabs
      window.dispatchEvent(new Event('storage'));
      
      // Close modal
      setShowDeleteModal(false);
      setProductToDelete(null);
      setSelectedProduct(null);
      
      // Show success message
      alert('✅ Product deleted successfully!');
      
    } catch (error) {
      console.error('❌ Error deleting product:', error);
      alert('❌ Failed to delete product. Please try again.');
    }
  };

  // ✅ Confirm delete
  const confirmDelete = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  // ✅ Format price
  const formatPrice = (price, currency = 'TZS') => {
    if (!price) return 'Price not set';
    const numPrice = parseFloat(price);
    if (isNaN(numPrice)) return price;
    
    if (currency === 'TZS' || !currency) {
      return new Intl.NumberFormat('en-TZ', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(numPrice) + ' TZS';
    } else {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(numPrice);
    }
  };

  // ✅ Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-TZ', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };

  // ✅ Get stock badge color
  const getStockBadgeColor = (status) => {
    switch (status) {
      case 'Available': return 'success';
      case 'Limited': return 'warning';
      case 'Out of Stock': return 'danger';
      default: return 'secondary';
    }
  };

  // ✅ Get unique categories for filter
  const getUniqueCategories = () => {
    const categories = products
      .map(p => p.mainCategory)
      .filter(Boolean)
      .filter((value, index, self) => self.indexOf(value) === index);
    return ['all', ...categories];
  };

  // ✅ Refresh handler
  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  // ✅ View seller profile
  const viewSellerProducts = (email) => {
    if (email) {
      alert(`📦 Viewing products for: ${email}\nThis feature will show all products from this seller.`);
    }
  };

  // ✅ Loading state
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <div className="text-center">
          <div className="spinner-border text-danger mb-3" style={{ width: '3rem', height: '3rem' }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* ✅ HEADER WITH STATS */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <div>
          <h1 className="fw-bold mb-2" style={{ color: '#333', fontSize: '28px' }}>
            <i className="fas fa-boxes me-2 text-danger"></i>
            Manage All Products
          </h1>
          <p className="text-muted mb-0">
            <span className="fw-bold">{stats.total}</span> total products • 
            <span className="text-success ms-2">🟢 {stats.available} available</span> •
            <span className="text-warning ms-2">🟡 {stats.limited} limited</span> •
            <span className="text-danger ms-2">🔴 {stats.outOfStock} out of stock</span>
          </p>
        </div>
        
        <div className="d-flex gap-2">
          <button 
            className="btn btn-outline-primary"
            onClick={handleRefresh}
            title="Refresh products"
          >
            <i className="fas fa-sync-alt me-1"></i>
            Refresh
          </button>
          <span className="badge bg-danger p-3" style={{ fontSize: '14px', borderRadius: '50px' }}>
            <i className="fas fa-shield-alt me-1"></i>
            ADMIN MODE • DELETE ENABLED
          </span>
        </div>
      </div>

      {/* ✅ STATS CARDS */}
      <div className="row g-4 mb-4">
        <div className="col-md-3 col-sm-6">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '15px' }}>
            <div className="card-body d-flex align-items-center">
              <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                <i className="fas fa-box text-primary fa-2x"></i>
              </div>
              <div>
                <h6 className="text-muted mb-1">Total Products</h6>
                <h3 className="fw-bold mb-0">{stats.total}</h3>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 col-sm-6">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '15px' }}>
            <div className="card-body d-flex align-items-center">
              <div className="rounded-circle bg-success bg-opacity-10 p-3 me-3">
                <i className="fas fa-check-circle text-success fa-2x"></i>
              </div>
              <div>
                <h6 className="text-muted mb-1">Available</h6>
                <h3 className="fw-bold mb-0">{stats.available}</h3>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 col-sm-6">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '15px' }}>
            <div className="card-body d-flex align-items-center">
              <div className="rounded-circle bg-warning bg-opacity-10 p-3 me-3">
                <i className="fas fa-exclamation-triangle text-warning fa-2x"></i>
              </div>
              <div>
                <h6 className="text-muted mb-1">Limited</h6>
                <h3 className="fw-bold mb-0">{stats.limited}</h3>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 col-sm-6">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '15px' }}>
            <div className="card-body d-flex align-items-center">
              <div className="rounded-circle bg-danger bg-opacity-10 p-3 me-3">
                <i className="fas fa-ban text-danger fa-2x"></i>
              </div>
              <div>
                <h6 className="text-muted mb-1">Out of Stock</h6>
                <h3 className="fw-bold mb-0">{stats.outOfStock}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ SEARCH & FILTERS */}
      <div className="card shadow-sm border-0 mb-4" style={{ borderRadius: '15px' }}>
        <div className="card-body p-4">
          <div className="row g-3">
            <div className="col-md-5">
              <label className="form-label fw-bold text-muted small mb-1">
                <i className="fas fa-search me-1"></i> SEARCH PRODUCTS
              </label>
              <div className="input-group">
                <span className="input-group-text bg-light border-0">
                  <i className="fas fa-search text-muted"></i>
                </span>
                <input
                  type="text"
                  className="form-control bg-light border-0"
                  placeholder="Search by product, shop, seller, email, brand..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button 
                    className="btn btn-outline-secondary border-0"
                    onClick={() => setSearchTerm('')}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>
              <small className="text-muted mt-1 d-block">
                {filteredProducts.length} products found
              </small>
            </div>
            
            <div className="col-md-3">
              <label className="form-label fw-bold text-muted small mb-1">
                <i className="fas fa-tag me-1"></i> CATEGORY
              </label>
              <select 
                className="form-select bg-light border-0"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                {getUniqueCategories().map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="col-md-3">
              <label className="form-label fw-bold text-muted small mb-1">
                <i className="fas fa-boxes me-1"></i> STOCK STATUS
              </label>
              <select 
                className="form-select bg-light border-0"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="Available">Available</option>
                <option value="Limited">Limited</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>
            
            <div className="col-md-1 d-flex align-items-end">
              <button 
                className="btn btn-outline-danger w-100"
                onClick={() => {
                  setSearchTerm('');
                  setFilterCategory('all');
                  setFilterStatus('all');
                }}
                title="Clear all filters"
              >
                <i className="fas fa-eraser"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ PRODUCTS TABLE */}
      <div className="card shadow-sm border-0" style={{ borderRadius: '15px', overflow: 'hidden' }}>
        <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold">
            <i className="fas fa-list me-2 text-danger"></i>
            All Products ({filteredProducts.length})
          </h5>
          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-light text-dark p-2">
              <i className="fas fa-database me-1"></i>
              Last updated: {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>
        
        <div className="card-body p-0">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-5">
              <div className="display-1 text-muted mb-4">
                <i className="fas fa-box-open"></i>
              </div>
              <h3 className="fw-bold text-muted mb-3">No Products Found</h3>
              <p className="text-muted fs-5 mb-4">
                {searchTerm || filterCategory !== 'all' || filterStatus !== 'all' 
                  ? 'Try adjusting your search filters'
                  : 'No products have been listed yet'}
              </p>
              {(searchTerm || filterCategory !== 'all' || filterStatus !== 'all') && (
                <button 
                  className="btn btn-danger px-5 py-3"
                  onClick={() => {
                    setSearchTerm('');
                    setFilterCategory('all');
                    setFilterStatus('all');
                  }}
                  style={{ borderRadius: '50px' }}
                >
                  <i className="fas fa-eraser me-2"></i>
                  Clear All Filters
                </button>
              )}
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="bg-light">
                  <tr>
                    <th style={{ width: '80px' }}>IMAGE</th>
                    <th>PRODUCT DETAILS</th>
                    <th>SELLER</th>
                    <th>PRICE</th>
                    <th>STATUS</th>
                    <th>LOCATION</th>
                    <th>DATE</th>
                    <th style={{ width: '100px' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product, index) => (
                    <tr key={product.id || index}>
                      {/* Product Image */}
                      <td>
                        <div 
                          className="rounded"
                          style={{
                            width: '60px',
                            height: '60px',
                            backgroundImage: `url(${product.productImages?.[0] || 'https://images.unsplash.com/photo-1556656793-08538906a9f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            borderRadius: '8px',
                            border: '2px solid #e0e0e0'
                          }}
                        ></div>
                      </td>
                      
                      {/* Product Details */}
                      <td>
                        <div>
                          <span className="fw-bold d-block" style={{ fontSize: '15px' }}>
                            {product.productName || 'Unnamed Product'}
                          </span>
                          <div className="d-flex flex-wrap gap-2 mt-1">
                            <small className="text-muted">
                              <i className="fas fa-tag me-1"></i>
                              {product.brand || 'No Brand'}
                            </small>
                            {product.condition && (
                              <small className="text-muted">
                                <i className="fas fa-clipboard-check me-1"></i>
                                {product.condition}
                              </small>
                            )}
                          </div>
                          {product.specifications && (
                            <small className="text-muted d-block text-truncate" style={{ maxWidth: '250px' }}>
                              <i className="fas fa-info-circle me-1"></i>
                              {product.specifications}
                            </small>
                          )}
                        </div>
                      </td>
                      
                      {/* Seller Info */}
                      <td>
                        <div>
                          <span className="fw-bold d-block" style={{ fontSize: '14px' }}>
                            {product.sellerName || product.name || 'Unknown Seller'}
                          </span>
                          <small className="text-muted d-block">
                            {product.shopName || 'No Shop Name'}
                          </small>
                          <small className="text-muted d-block" style={{ fontSize: '11px' }}>
                            <i className="fas fa-envelope me-1"></i>
                            {product.email || 'No Email'}
                          </small>
                          {product.phoneNumber && (
                            <small className="text-muted d-block" style={{ fontSize: '11px' }}>
                              <i className="fas fa-phone me-1"></i>
                              {product.phoneNumber}
                            </small>
                          )}
                        </div>
                      </td>
                      
                      {/* Price */}
                      <td>
                        <span className="fw-bold text-danger" style={{ fontSize: '16px' }}>
                          {formatPrice(product.price, product.currency)}
                        </span>
                      </td>
                      
                      {/* Stock Status */}
                      <td>
                        <span className={`badge bg-${getStockBadgeColor(product.stockStatus)} px-3 py-2`} 
                              style={{ borderRadius: '30px', fontSize: '12px' }}>
                          {product.stockStatus || 'Unknown'}
                        </span>
                        {product.quantityAvailable && (
                          <small className="text-muted d-block mt-1">
                            Qty: {product.quantityAvailable}
                          </small>
                        )}
                      </td>
                      
                      {/* Location */}
                      <td>
                        <small className="d-block">
                          <i className="fas fa-map-marker-alt me-1 text-danger"></i>
                          {product.area || 'N/A'}
                        </small>
                        <small className="text-muted d-block">
                          {product.district}, {product.region}
                        </small>
                      </td>
                      
                      {/* Date */}
                      <td>
                        <small className="text-muted d-block">
                          {formatDate(product.registrationDate)}
                        </small>
                        <small className="text-muted d-block" style={{ fontSize: '10px' }}>
                          ID: {product.id?.toString().slice(-6) || 'N/A'}
                        </small>
                      </td>
                      
                      {/* Actions */}
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-outline-info"
                            onClick={() => setSelectedProduct(product)}
                            title="View Details"
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => confirmDelete(product)}
                            title="Delete Product"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* Footer with summary */}
        {filteredProducts.length > 0 && (
          <div className="card-footer bg-white py-3 px-4 border-0">
            <div className="d-flex flex-wrap justify-content-between align-items-center">
              <span className="text-muted">
                <i className="fas fa-database me-2"></i>
                Showing {filteredProducts.length} of {products.length} total products
              </span>
              <span className="text-danger fw-bold">
                <i className="fas fa-trash me-1"></i>
                You can delete inappropriate products
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ✅ PRODUCT DETAILS MODAL */}
      {selectedProduct && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ 
            zIndex: 1050, 
            backgroundColor: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(5px)'
          }}
          onClick={() => setSelectedProduct(null)}
        >
          <div 
            className="bg-white rounded-4 shadow-lg"
            style={{ 
              maxWidth: '600px', 
              width: '90%', 
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4">
              {/* Header */}
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="mb-0 fw-bold">
                  <i className="fas fa-box-open me-2 text-danger"></i>
                  Product Details
                </h4>
                <button 
                  className="btn btn-sm btn-outline-secondary rounded-circle"
                  onClick={() => setSelectedProduct(null)}
                  style={{ width: '40px', height: '40px' }}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>

              {/* Product Images */}
              {selectedProduct.productImages && selectedProduct.productImages.length > 0 && (
                <div className="mb-4">
                  <label className="form-label fw-bold text-muted small">PRODUCT IMAGES</label>
                  <div className="d-flex gap-2 overflow-auto pb-2">
                    {selectedProduct.productImages.map((img, idx) => (
                      <div 
                        key={idx}
                        className="rounded"
                        style={{
                          width: '100px',
                          height: '100px',
                          backgroundImage: `url(${img})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          borderRadius: '10px',
                          border: '2px solid #e0e0e0',
                          flexShrink: 0
                        }}
                      ></div>
                    ))}
                  </div>
                </div>
              )}

              {/* Product Info */}
              <div className="mb-4">
                <label className="form-label fw-bold text-muted small">PRODUCT NAME</label>
                <h5 className="fw-bold">{selectedProduct.productName || 'N/A'}</h5>
              </div>

              <div className="row mb-4">
                <div className="col-6">
                  <label className="form-label fw-bold text-muted small">PRICE</label>
                  <h5 className="text-danger fw-bold">
                    {formatPrice(selectedProduct.price, selectedProduct.currency)}
                  </h5>
                </div>
                <div className="col-6">
                  <label className="form-label fw-bold text-muted small">STATUS</label>
                  <div>
                    <span className={`badge bg-${getStockBadgeColor(selectedProduct.stockStatus)} px-3 py-2`}>
                      {selectedProduct.stockStatus || 'Unknown'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="row mb-4">
                <div className="col-6">
                  <label className="form-label fw-bold text-muted small">CATEGORY</label>
                  <p className="mb-0">{selectedProduct.mainCategory || 'N/A'}</p>
                  {selectedProduct.subCategory && (
                    <small className="text-muted">{selectedProduct.subCategory}</small>
                  )}
                </div>
                <div className="col-6">
                  <label className="form-label fw-bold text-muted small">BRAND</label>
                  <p className="mb-0">{selectedProduct.brand || 'N/A'}</p>
                </div>
              </div>

              {selectedProduct.specifications && (
                <div className="mb-4">
                  <label className="form-label fw-bold text-muted small">SPECIFICATIONS</label>
                  <p className="mb-0 bg-light p-3 rounded" style={{ whiteSpace: 'pre-wrap' }}>
                    {selectedProduct.specifications}
                  </p>
                </div>
              )}

              {/* Seller Info */}
              <div className="mb-4">
                <label className="form-label fw-bold text-muted small">SELLER INFORMATION</label>
                <div className="bg-light p-3 rounded">
                  <p className="mb-1 fw-bold">{selectedProduct.sellerName || selectedProduct.name || 'Unknown Seller'}</p>
                  <p className="mb-1 text-muted small">{selectedProduct.shopName || 'No Shop Name'}</p>
                  <p className="mb-1 text-muted small">
                    <i className="fas fa-envelope me-1"></i> {selectedProduct.email || 'No Email'}
                  </p>
                  {selectedProduct.phoneNumber && (
                    <p className="mb-1 text-muted small">
                      <i className="fas fa-phone me-1"></i> {selectedProduct.phoneNumber}
                    </p>
                  )}
                  <p className="mb-0 text-muted small">
                    <i className="fas fa-map-marker-alt me-1"></i> 
                    {selectedProduct.area}, {selectedProduct.district}, {selectedProduct.region}
                  </p>
                </div>
              </div>

              {/* Additional Details */}
              <div className="mb-4">
                <label className="form-label fw-bold text-muted small">ADDITIONAL DETAILS</label>
                <div className="row">
                  <div className="col-6">
                    <small className="text-muted d-block">Condition</small>
                    <span className="fw-bold">{selectedProduct.condition || 'N/A'}</span>
                  </div>
                  <div className="col-6">
                    <small className="text-muted d-block">Warranty</small>
                    <span className="fw-bold">
                      {selectedProduct.warranty === 'Yes' 
                        ? `Yes (${selectedProduct.warrantyPeriod || 'Not specified'})` 
                        : 'No'}
                    </span>
                  </div>
                  <div className="col-6 mt-2">
                    <small className="text-muted d-block">Quantity</small>
                    <span className="fw-bold">{selectedProduct.quantityAvailable || '0'}</span>
                  </div>
                  <div className="col-6 mt-2">
                    <small className="text-muted d-block">Price Type</small>
                    <span className="fw-bold">{selectedProduct.priceType || 'Fixed'}</span>
                  </div>
                  {selectedProduct.size && (
                    <div className="col-6 mt-2">
                      <small className="text-muted d-block">Size</small>
                      <span className="fw-bold">{selectedProduct.size}</span>
                    </div>
                  )}
                  {selectedProduct.color && (
                    <div className="col-6 mt-2">
                      <small className="text-muted d-block">Color</small>
                      <span className="fw-bold">{selectedProduct.color}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Registration Date */}
              <div className="mb-4">
                <label className="form-label fw-bold text-muted small">LISTED DATE</label>
                <p className="mb-0 text-muted">
                  {formatDate(selectedProduct.registrationDate)}
                </p>
                <small className="text-muted d-block mt-1">
                  Product ID: {selectedProduct.id}
                </small>
              </div>

              {/* Action Buttons */}
              <div className="d-flex gap-3 mt-4">
                <button
                  className="btn btn-danger flex-grow-1 py-3"
                  onClick={() => {
                    setSelectedProduct(null);
                    confirmDelete(selectedProduct);
                  }}
                  style={{ borderRadius: '12px' }}
                >
                  <i className="fas fa-trash me-2"></i>
                  DELETE THIS PRODUCT
                </button>
                <button
                  className="btn btn-outline-secondary px-4"
                  onClick={() => setSelectedProduct(null)}
                  style={{ borderRadius: '12px' }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ✅ DELETE CONFIRMATION MODAL */}
      {showDeleteModal && productToDelete && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ 
            zIndex: 1060, 
            backgroundColor: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(5px)'
          }}
          onClick={() => setShowDeleteModal(false)}
        >
          <div 
            className="bg-white rounded-4 shadow-lg"
            style={{ maxWidth: '450px', width: '90%' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 text-center">
              <div className="rounded-circle bg-danger bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3"
                   style={{ width: '80px', height: '80px' }}>
                <i className="fas fa-exclamation-triangle text-danger fa-3x"></i>
              </div>
              
              <h4 className="fw-bold mb-3">Delete Product?</h4>
              
              <p className="text-muted mb-3">
                You are about to delete:
              </p>
              
              <div className="bg-light p-3 rounded mb-4">
                <p className="fw-bold mb-1">{productToDelete.productName}</p>
                <small className="text-muted d-block">
                  Seller: {productToDelete.sellerName || productToDelete.name || 'Unknown'}
                </small>
                <small className="text-muted d-block">
                  Price: {formatPrice(productToDelete.price, productToDelete.currency)}
                </small>
              </div>
              
              <p className="text-danger mb-4">
                <i className="fas fa-shield-alt me-1"></i>
                This action cannot be undone. The product will be permanently removed from the marketplace.
              </p>
              
              <div className="d-flex gap-3">
                <button
                  className="btn btn-danger flex-grow-1 py-3"
                  onClick={() => handleDeleteProduct(productToDelete.id)}
                  style={{ borderRadius: '12px' }}
                >
                  <i className="fas fa-trash me-2"></i>
                  Yes, Delete
                </button>
                <button
                  className="btn btn-outline-secondary flex-grow-1 py-3"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setProductToDelete(null);
                  }}
                  style={{ borderRadius: '12px' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Font Awesome */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />

      {/* ✅ Custom Styles */}
      <style>
        {`
          .table th {
            font-size: 0.85rem;
            font-weight: 600;
            color: #495057;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-bottom-width: 1px;
          }

          .table td {
            vertical-align: middle;
            padding: 1rem 0.75rem;
          }

          .table-hover tbody tr:hover {
            background-color: rgba(220, 53, 69, 0.03);
          }

          .card {
            transition: all 0.3s ease;
          }

          .btn {
            transition: all 0.3s ease;
          }

          .btn-outline-danger:hover {
            background-color: #dc3545;
            color: white;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
          }

          .btn-outline-info:hover {
            background-color: #17a2b8;
            color: white;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(23, 162, 184, 0.3);
          }

          .badge {
            font-weight: 500;
            letter-spacing: 0.3px;
          }

          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(-30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @media (max-width: 768px) {
            .table {
              font-size: 0.85rem;
            }
            
            .badge {
              font-size: 0.7rem !important;
            }
            
            h1 {
              font-size: 1.8rem !important;
            }
          }

          ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }

          ::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
          }

          ::-webkit-scrollbar-thumb {
            background: #dc3545;
            border-radius: 10px;
          }

          ::-webkit-scrollbar-thumb:hover {
            background: #c82333;
          }
        `}
      </style>
    </div>
  );
}

export default AdminProducts;