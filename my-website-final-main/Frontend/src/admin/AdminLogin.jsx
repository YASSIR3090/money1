// src/Admin/AdminLogin.jsx
import React, { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function AdminLogin() {
  const { adminLogin, isAdmin } = useAdmin();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      navigate('/admin/dashboard');
    }
  }, [isAdmin, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      const success = adminLogin(email, password);
      
      if (success) {
        navigate('/admin/dashboard');
      } else {
        setError('Invalid admin credentials. Use admin@availo.co.tz / admin123');
      }
      
      setIsLoading(false);
    }, 800);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="card shadow-lg border-0" style={{ 
        maxWidth: '400px', 
        width: '100%', 
        borderRadius: '20px',
        overflow: 'hidden'
      }}>
        <div className="card-header bg-danger text-white text-center py-4">
          <h3 className="mb-0 fw-bold">
            <i className="fas fa-shield-alt me-2"></i>
            Admin Portal
          </h3>
          <p className="mb-0 text-white-50 small mt-2">Availo Marketplace</p>
        </div>
        
        <div className="card-body p-4">
          {error && (
            <div className="alert alert-danger d-flex align-items-center" role="alert">
              <i className="fas fa-exclamation-triangle me-2"></i>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-bold">Admin Email</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <i className="fas fa-envelope text-muted"></i>
                </span>
                <input
                  type="email"
                  className="form-control border-start-0"
                  placeholder="admin@availo.co.tz"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold">Password</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <i className="fas fa-lock text-muted"></i>
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control border-start-0"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary border-start-0"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
              <div className="mt-2 small text-muted">
                <i className="fas fa-info-circle me-1"></i>
                Demo: admin@availo.co.tz / admin123
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-danger w-100 py-2 fw-bold"
              disabled={isLoading}
              style={{ borderRadius: '10px' }}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Authenticating...
                </>
              ) : (
                <>
                  <i className="fas fa-sign-in-alt me-2"></i>
                  Login to Admin Dashboard
                </>
              )}
            </button>
          </form>

          <div className="mt-4 text-center">
            <a href="/" className="text-decoration-none text-muted small">
              <i className="fas fa-arrow-left me-1"></i>
              Back to Main Site
            </a>
          </div>
        </div>
      </div>

      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
    </div>
  );
}

export default AdminLogin;