// src/Admin/AdminUsers.jsx
import React, { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function AdminUsers() {
  const { getAllUsers, isAdmin } = useAdmin();
  const navigate = useNavigate();
  
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin/login');
    }
  }, [isAdmin, navigate]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const userList = getAllUsers();
    setUsers(userList);
    setFilteredUsers(userList);
  };

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = users.filter(user => 
        user.email?.toLowerCase().includes(term) ||
        user.name?.toLowerCase().includes(term) ||
        user.shopName?.toLowerCase().includes(term)
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const handleViewUserProducts = (email) => {
    try {
      const allSellers = JSON.parse(localStorage.getItem('allSellersData') || '[]');
      const userProducts = allSellers.filter(seller => 
        seller.email && seller.email.toLowerCase() === email.toLowerCase()
      );
      
      // Store in session for viewing
      sessionStorage.setItem('admin_viewing_user', JSON.stringify({
        email,
        products: userProducts
      }));
      
      alert(`📦 ${userProducts.length} products found for ${email}`);
    } catch (error) {
      console.error("Error loading user products:", error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-TZ', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="container-fluid py-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-0" style={{ color: '#333' }}>
            <i className="fas fa-users me-2 text-danger"></i>
            User Management
          </h2>
          <p className="text-muted mb-0">Total Registered Vendors: {users.length}</p>
        </div>
      </div>

      <div className="card shadow-sm border-0" style={{ borderRadius: '15px' }}>
        <div className="card-header bg-white py-3">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h5 className="mb-0 fw-bold">All Vendors</h5>
            </div>
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-light border-0">
                  <i className="fas fa-search text-muted"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-0 bg-light"
                  placeholder="Search by email, name or shop..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="bg-light">
                <tr>
                  <th style={{ width: '50px' }}>#</th>
                  <th>User</th>
                  <th>Email</th>
                  <th>Shop</th>
                  <th>Category</th>
                  <th>Products</th>
                  <th>Registered</th>
                  <th>Provider</th>
                  <th style={{ width: '120px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr key={user.id || index}>
                    <td className="fw-bold">{index + 1}</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="rounded-circle bg-danger text-white d-flex align-items-center justify-content-center me-2"
                             style={{ width: '35px', height: '35px' }}>
                          {user.picture ? (
                            <img 
                              src={user.picture} 
                              alt={user.name}
                              style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.style.display = 'none';
                                e.target.parentElement.innerHTML = user.name?.charAt(0).toUpperCase() || 'U';
                              }}
                            />
                          ) : (
                            user.name?.charAt(0).toUpperCase() || 'U'
                          )}
                        </div>
                        <span className="fw-bold">{user.name || 'N/A'}</span>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>{user.shopName || '-'}</td>
                    <td>
                      <span className="badge bg-light text-dark" style={{ borderRadius: '20px' }}>
                        {user.mainCategory || 'General'}
                      </span>
                    </td>
                    <td>
                      <span className="badge bg-primary" style={{ borderRadius: '20px' }}>
                        {user.products || 0}
                      </span>
                    </td>
                    <td>
                      <small className="text-muted">
                        {formatDate(user.registrationDate)}
                      </small>
                    </td>
                    <td>
                      <span className={`badge ${user.provider === 'google' ? 'bg-danger' : 'bg-success'}`} 
                            style={{ borderRadius: '20px' }}>
                        {user.provider === 'google' ? 'Google' : 'Email'}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary me-1"
                        onClick={() => handleViewUserProducts(user.email)}
                        title="View Products"
                      >
                        <i className="fas fa-box"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-info"
                        onClick={() => setSelectedUser(user)}
                        title="View Details"
                      >
                        <i className="fas fa-info-circle"></i>
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan="9" className="text-center py-5">
                      <i className="fas fa-users-slash fa-3x text-muted mb-3"></i>
                      <h6 className="text-muted">No vendors found</h6>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
             style={{ zIndex: 1050, backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded shadow-lg" style={{ maxWidth: '500px', width: '90%', borderRadius: '20px' }}>
            <div className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="mb-0 fw-bold">
                  <i className="fas fa-user-circle me-2 text-danger"></i>
                  User Details
                </h5>
                <button 
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => setSelectedUser(null)}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              
              <div className="text-center mb-4">
                <div className="rounded-circle bg-danger text-white d-flex align-items-center justify-content-center mx-auto mb-3"
                     style={{ width: '80px', height: '80px', fontSize: '32px' }}>
                  {selectedUser.picture ? (
                    <img 
                      src={selectedUser.picture} 
                      alt={selectedUser.name}
                      style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    selectedUser.name?.charAt(0).toUpperCase() || 'U'
                  )}
                </div>
                <h6 className="fw-bold mb-1">{selectedUser.name}</h6>
                <p className="text-muted small mb-2">{selectedUser.email}</p>
                <span className="badge bg-success" style={{ borderRadius: '20px' }}>
                  Active Vendor
                </span>
              </div>

              <div className="mb-4">
                <div className="row">
                  <div className="col-6 mb-3">
                    <small className="text-muted d-block">Shop Name</small>
                    <span className="fw-bold">{selectedUser.shopName || '-'}</span>
                  </div>
                  <div className="col-6 mb-3">
                    <small className="text-muted d-block">Category</small>
                    <span className="fw-bold">{selectedUser.mainCategory || '-'}</span>
                  </div>
                  <div className="col-6 mb-3">
                    <small className="text-muted d-block">Products</small>
                    <span className="fw-bold">{selectedUser.products || 0}</span>
                  </div>
                  <div className="col-6 mb-3">
                    <small className="text-muted d-block">Registration</small>
                    <span className="fw-bold">{formatDate(selectedUser.registrationDate)}</span>
                  </div>
                  <div className="col-6 mb-3">
                    <small className="text-muted d-block">Auth Provider</small>
                    <span className={`badge ${selectedUser.provider === 'google' ? 'bg-danger' : 'bg-success'}`}>
                      {selectedUser.provider === 'google' ? 'Google' : 'Email'}
                    </span>
                  </div>
                  <div className="col-6 mb-3">
                    <small className="text-muted d-block">User ID</small>
                    <span className="small text-muted">
                      {selectedUser.id?.substring(0, 12)}...
                    </span>
                  </div>
                </div>
              </div>

              <div className="d-flex gap-2">
                <button
                  className="btn btn-danger flex-grow-1"
                  onClick={() => {
                    handleViewUserProducts(selectedUser.email);
                    setSelectedUser(null);
                  }}
                >
                  <i className="fas fa-box me-2"></i>
                  View Products
                </button>
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setSelectedUser(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;