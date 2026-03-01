// src/admin/AdminDashboard.jsx - FIXED VERSION WITH OUTLET 🔥
import React, { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function AdminDashboard() {
  const { isAdmin, adminUser, adminLogout, ads, messages, getAllUsers } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalAds: 0,
    unreadMessages: 0,
    totalMessages: 0
  });

  // Set active tab based on current path
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/admin/users')) setActiveTab('users');
    else if (path.includes('/admin/ads')) setActiveTab('ads');
    else if (path.includes('/admin/messages')) setActiveTab('messages');
    else if (path.includes('/admin/products')) setActiveTab('products'); // ✅ NEW
    else setActiveTab('dashboard');
  }, [location]);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin/login');
    }
  }, [isAdmin, navigate]);

  useEffect(() => {
    const users = getAllUsers();
    const sellers = JSON.parse(localStorage.getItem('allSellersData') || '[]');
    const unread = messages.filter(m => m.status === 'unread').length;
    
    setStats({
      totalUsers: users.length,
      totalProducts: sellers.length,
      totalAds: ads.length,
      unreadMessages: unread,
      totalMessages: messages.length
    });
  }, [ads, messages, getAllUsers]);

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  // ✅ NEW: Added 'products' to menuItems
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt', path: '/admin/dashboard' },
    { id: 'users', label: 'Users', icon: 'fas fa-users', path: '/admin/users' },
    { id: 'products', label: 'Products', icon: 'fas fa-boxes', path: '/admin/products' }, // ✅ NEW
    { id: 'ads', label: 'Carousel Ads', icon: 'fas fa-ad', path: '/admin/ads' },
    { id: 'messages', label: 'Help Center', icon: 'fas fa-headset', path: '/admin/messages' }
  ];

  // Check if current page is dashboard
  const isDashboardPage = location.pathname === '/admin/dashboard' || location.pathname === '/admin';

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      {/* ============== SIDEBAR ============== */}
      <div className="bg-dark text-white" style={{ width: '280px', flexShrink: 0 }}>
        <div className="p-4">
          {/* Logo */}
          <div className="d-flex align-items-center mb-4">
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#dc3545',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '12px'
            }}>
              <i className="fas fa-store text-white"></i>
            </div>
            <div>
              <h5 className="mb-0 fw-bold text-white">Availo Admin</h5>
              <small className="text-white-50">v1.0.0</small>
            </div>
          </div>

          {/* Admin Info */}
          <div className="mb-4 p-3 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
            <div className="d-flex align-items-center">
              <div className="rounded-circle bg-danger text-white d-flex align-items-center justify-content-center me-2"
                   style={{ width: '40px', height: '40px' }}>
                {adminUser?.email?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div>
                <small className="text-white-50 d-block">Logged in as</small>
                <span className="fw-bold small text-white">{adminUser?.email || 'admin@availo.co.tz'}</span>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="nav flex-column">
            {menuItems.map(item => (
              <Link
                key={item.id}
                to={item.path}
                className={`nav-link text-white mb-2 d-flex align-items-center ${activeTab === item.id ? 'active bg-danger' : ''}`}
                style={{ 
                  padding: '12px 16px', 
                  borderRadius: '10px',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => setActiveTab(item.id)}
              >
                <i className={`${item.icon} me-3`} style={{ width: '20px' }}></i>
                {item.label}
                {item.id === 'messages' && stats.unreadMessages > 0 && (
                  <span className="badge bg-danger ms-auto">{stats.unreadMessages}</span>
                )}
                {item.id === 'products' && stats.totalProducts > 0 && (
                  <span className="badge bg-info ms-auto">{stats.totalProducts}</span>
                )}
              </Link>
            ))}
          </nav>

          <hr className="bg-white-50 my-4" />

          {/* Logout Button */}
          <button
            className="btn btn-outline-light w-100 d-flex align-items-center justify-content-center"
            onClick={handleLogout}
            style={{ borderRadius: '10px', padding: '12px' }}
          >
            <i className="fas fa-sign-out-alt me-2"></i>
            Logout
          </button>
        </div>
      </div>

      {/* ============== MAIN CONTENT ============== */}
      <div className="flex-grow-1" style={{ backgroundColor: '#f8f9fa' }}>
        {/* Top Navigation Bar */}
        <nav className="navbar navbar-light bg-white shadow-sm px-4 py-3">
          <div className="container-fluid px-0">
            <h5 className="mb-0 fw-bold">
              {menuItems.find(m => m.id === activeTab)?.label || 'Dashboard'}
            </h5>
            <div className="d-flex align-items-center gap-3">
              <Link to="/" className="btn btn-outline-danger btn-sm" target="_blank">
                <i className="fas fa-external-link-alt me-1"></i>
                View Site
              </Link>
              <div className="text-muted small">
                <i className="fas fa-calendar me-1"></i>
                {new Date().toLocaleDateString('en-TZ', { 
                  weekday: 'short', 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          </div>
        </nav>

        {/* Content Area - THIS IS WHERE Outlet GOES! */}
        <div className="p-4">
          {isDashboardPage ? (
            /* ============== DASHBOARD CONTENT ============== */
            <>
              {/* Stats Cards */}
              <div className="row g-4 mb-4">
                <div className="col-md-3">
                  <div className="card border-0 shadow-sm" style={{ borderRadius: '15px' }}>
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                          <i className="fas fa-users text-primary fa-2x"></i>
                        </div>
                        <div>
                          <h6 className="text-muted mb-1">Total Vendors</h6>
                          <h3 className="fw-bold mb-0">{stats.totalUsers}</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card border-0 shadow-sm" style={{ borderRadius: '15px' }}>
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <div className="rounded-circle bg-success bg-opacity-10 p-3 me-3">
                          <i className="fas fa-box text-success fa-2x"></i>
                        </div>
                        <div>
                          <h6 className="text-muted mb-1">Total Products</h6>
                          <h3 className="fw-bold mb-0">{stats.totalProducts}</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card border-0 shadow-sm" style={{ borderRadius: '15px' }}>
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <div className="rounded-circle bg-danger bg-opacity-10 p-3 me-3">
                          <i className="fas fa-ad text-danger fa-2x"></i>
                        </div>
                        <div>
                          <h6 className="text-muted mb-1">Active Ads</h6>
                          <h3 className="fw-bold mb-0">{stats.totalAds}</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card border-0 shadow-sm" style={{ borderRadius: '15px' }}>
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <div className="rounded-circle bg-warning bg-opacity-10 p-3 me-3">
                          <i className="fas fa-envelope text-warning fa-2x"></i>
                        </div>
                        <div>
                          <h6 className="text-muted mb-1">Unread Messages</h6>
                          <h3 className="fw-bold mb-0">{stats.unreadMessages}</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions & Recent Messages */}
              <div className="row g-4">
                <div className="col-md-6">
                  <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '15px' }}>
                    <div className="card-header bg-white py-3">
                      <h6 className="mb-0 fw-bold">
                        <i className="fas fa-bolt me-2 text-danger"></i>
                        Quick Actions
                      </h6>
                    </div>
                    <div className="card-body">
                      <div className="list-group list-group-flush">
                        <Link to="/admin/products" className="list-group-item list-group-item-action d-flex align-items-center py-3 border-0">
                          <div className="rounded-circle bg-success bg-opacity-10 p-2 me-3">
                            <i className="fas fa-box text-success"></i>
                          </div>
                          <div>
                            <span className="fw-bold d-block">Manage Products</span>
                            <small className="text-muted">{stats.totalProducts} products to review</small>
                          </div>
                          <i className="fas fa-chevron-right ms-auto text-muted"></i>
                        </Link>
                        <Link to="/admin/ads" className="list-group-item list-group-item-action d-flex align-items-center py-3 border-0">
                          <div className="rounded-circle bg-danger bg-opacity-10 p-2 me-3">
                            <i className="fas fa-plus-circle text-danger"></i>
                          </div>
                          <div>
                            <span className="fw-bold d-block">Add New Ad</span>
                            <small className="text-muted">Create a carousel promotion</small>
                          </div>
                          <i className="fas fa-chevron-right ms-auto text-muted"></i>
                        </Link>
                        <Link to="/admin/messages" className="list-group-item list-group-item-action d-flex align-items-center py-3 border-0">
                          <div className="rounded-circle bg-warning bg-opacity-10 p-2 me-3">
                            <i className="fas fa-reply text-warning"></i>
                          </div>
                          <div>
                            <span className="fw-bold d-block">Check Messages</span>
                            <small className="text-muted">{stats.unreadMessages} unread replies needed</small>
                          </div>
                          <i className="fas fa-chevron-right ms-auto text-muted"></i>
                        </Link>
                        <Link to="/admin/users" className="list-group-item list-group-item-action d-flex align-items-center py-3 border-0">
                          <div className="rounded-circle bg-primary bg-opacity-10 p-2 me-3">
                            <i className="fas fa-user-plus text-primary"></i>
                          </div>
                          <div>
                            <span className="fw-bold d-block">Manage Users</span>
                            <small className="text-muted">{stats.totalUsers} registered vendors</small>
                          </div>
                          <i className="fas fa-chevron-right ms-auto text-muted"></i>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '15px' }}>
                    <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                      <h6 className="mb-0 fw-bold">
                        <i className="fas fa-clock me-2 text-danger"></i>
                        Recent Messages
                      </h6>
                      <Link to="/admin/messages" className="btn btn-sm btn-outline-danger">
                        View All
                      </Link>
                    </div>
                    <div className="card-body p-0">
                      <div className="list-group list-group-flush">
                        {messages.slice(0, 5).map(message => (
                          <Link 
                            key={message.id}
                            to="/admin/messages"
                            className="list-group-item list-group-item-action d-flex align-items-start p-3 border-0"
                          >
                            <div className="flex-shrink-0 me-3">
                              <div className="rounded-circle bg-light d-flex align-items-center justify-content-center"
                                   style={{ width: '40px', height: '40px' }}>
                                <i className={`fas fa-user ${message.status === 'unread' ? 'text-danger' : 'text-secondary'}`}></i>
                              </div>
                            </div>
                            <div className="flex-grow-1">
                              <div className="d-flex justify-content-between align-items-center mb-1">
                                <h6 className="mb-0 fw-bold">{message.name}</h6>
                                <small className="text-muted">
                                  {new Date(message.createdAt).toLocaleDateString()}
                                </small>
                              </div>
                              <p className="mb-0 text-truncate small text-muted">
                                {message.message}
                              </p>
                              {message.status === 'unread' && (
                                <span className="badge bg-danger mt-1" style={{ borderRadius: '20px' }}>
                                  New
                                </span>
                              )}
                            </div>
                          </Link>
                        ))}
                        {messages.length === 0 && (
                          <div className="text-center py-4">
                            <i className="fas fa-inbox fa-2x text-muted mb-2"></i>
                            <p className="text-muted mb-0">No messages yet</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* ============== NESTED ROUTES (Ads, Messages, Users, Products) ============== */
            <Outlet /> /* ✅ THIS RENDERS THE CHILD ROUTES! */
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;