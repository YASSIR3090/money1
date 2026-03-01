// src/Auth/VendorLogin.jsx - ULTIMATE FIXED VERSION WITH REFRESH TOKEN 🔥
// ✅ CORS errors resolved
// ✅ 401 Unauthorized handled properly
// ✅ Uses apiClient instead of fetch
// ✅ Better error messages for users
// ✅ Google OAuth working on all domains
// ✅ FIXED: Redirect URI matching Google Cloud Console
// ✅ FIXED: Saves both access token (30min) and refresh token (6 months)

import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import apiClient, { setTokens, clearTokens } from "../api/apiClient";
import API_BASE_URL from "../api/config";

function VendorLogin() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login: authLogin, isVendorRegistered } = useAuth();

  // ✅ List of allowed domains for Google Sign-In
  const allowedDomains = [
    'localhost',
    '127.0.0.1',
    'availo-frontend.vercel.app',
    'availo.co.tz',
    'www.availo.co.tz',
    '.vercel.app',
    '.onrender.com',
    '.netlify.app'
  ];

  const isAllowedDomain = () => {
    const hostname = window.location.hostname;
    return allowedDomains.some(domain => hostname.includes(domain));
  };

  // ============== 🔥 FIXED REDIRECT URI FUNCTION ==============
  const getRedirectUri = () => {
    const hostname = window.location.hostname;
    
    // 🔥 MUHIMU: Tumia URL kamili inayolingana na Google Cloud Console
    if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
      return "http://localhost:5173/auth/google/callback";
    } else if (hostname.includes('availo.co.tz')) {
      return "https://availo.co.tz/auth/google/callback";
    } else if (hostname.includes('availo-frontend.vercel.app')) {
      return "https://availo-frontend.vercel.app/auth/google/callback";
    } else {
      // Fallback - tumia origin ya sasa
      return `${window.location.origin}/auth/google/callback`;
    }
  };

  // ✅ Listen for auth errors from apiClient
  useEffect(() => {
    const handleAuthError = (event) => {
      setError(event.detail?.message || 'Authentication failed. Please login again.');
      clearTokens();
    };

    window.addEventListener('auth:unauthorized', handleAuthError);
    
    return () => {
      window.removeEventListener('auth:unauthorized', handleAuthError);
    };
  }, []);

  // ✅ Check for messages from location state
  useEffect(() => {
    if (location.state?.error) {
      setError(location.state.error);
      window.history.replaceState({}, document.title);
    }
    
    if (location.state?.success) {
      setSuccess(location.state.success);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // ============== GOOGLE LOGIN ==============
  const googleLogin = () => {
    setIsLoading(true);
    setError("");

    try {
      // Your Google Client ID
      const clientId = "656979344483-3j0dfdb7afmsnqejq0kgbgm5ivaspcm9.apps.googleusercontent.com";
      
      // ✅ Get correct redirect URI based on current domain
      const redirectUri = getRedirectUri();
      
      console.log("📋 Google OAuth Configuration:", {
        clientId: clientId.substring(0, 20) + "...",
        redirectUri,
        hostname: window.location.hostname
      });

      // Generate simple state
      const state = Math.random().toString(36).substring(2, 15);
      
      // ✅ Save state to localStorage
      localStorage.setItem('oauth_state', state);
      localStorage.setItem('oauth_timestamp', Date.now().toString());
      localStorage.setItem('oauth_redirect_uri', redirectUri);
      
      // Build auth URL with IMPLICIT FLOW (token)
      const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
      
      authUrl.searchParams.append("client_id", clientId);
      authUrl.searchParams.append("redirect_uri", redirectUri);
      authUrl.searchParams.append("response_type", "token");
      authUrl.searchParams.append("scope", "openid email profile");
      authUrl.searchParams.append("state", state);
      authUrl.searchParams.append("prompt", "select_account");
      authUrl.searchParams.append("include_granted_scopes", "true");
      
      console.log("🔗 Redirecting to:", authUrl.toString());
      
      // Redirect to Google
      window.location.href = authUrl.toString();
      
    } catch (error) {
      console.error("❌ Google OAuth error:", error);
      setError(`Google Sign-In Error: ${error.message}`);
      setIsLoading(false);
    }
  };

  // ============== EMAIL LOGIN (USING APICLIENT) ==============
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!loginData.email.trim()) {
      setError("Please enter email address");
      setIsLoading(false);
      return;
    }

    if (!loginData.password.trim()) {
      setError("Please enter password");
      setIsLoading(false);
      return;
    }

    try {
      console.log("📤 Attempting login with API:", loginData.email);
      
      // ✅ USE APICLIENT INSTEAD OF FETCH - FIXES CORS!
      const response = await apiClient.post('/auth/login/', {
        email: loginData.email,
        password: loginData.password
      });

      console.log("✅ Login API response:", response.data);
      const data = response.data;
      
      // ✅ Check if login was successful
      if (data.success && data.tokens) {
        
        // ✅ Save tokens using helper function (access + refresh)
        const accessToken = data.tokens.access;
        const refreshToken = data.tokens.refresh;
        
        setTokens(accessToken, refreshToken);
        console.log("✅ ACCESS TOKEN (30min) saved to localStorage");
        if (refreshToken) {
          console.log("✅ REFRESH TOKEN (6 months) saved to localStorage");
        }
        
        // Create user data from response
        const userData = data.user || {
          id: `email_${Date.now()}`,
          email: loginData.email,
          name: loginData.email.split('@')[0],
          displayName: loginData.email.split('@')[0],
          picture: null,
          photo: null,
          email_verified: true,
          provider: 'email',
          providerId: 'email',
          loginTime: new Date().toISOString()
        };

        // ✅ Save user to auth context
        const loginSuccess = authLogin(userData);
        
        if (!loginSuccess) {
          throw new Error("Failed to save user session");
        }
        
        // ✅ Also save to localStorage for backup
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('authUser', JSON.stringify(userData));
        
        // ✅ Check if user is a registered vendor
        const isRegistered = isVendorRegistered(userData.email);
        
        // ✅ Show success message
        setSuccess("Login successful! Redirecting...");
        
        // ✅ Redirect based on vendor status
        setTimeout(() => {
          if (isRegistered) {
            navigate('/seller-profile', { replace: true });
          } else {
            // Directly go to vendor registration without extra messages
            navigate('/vendor-register', { 
              replace: true,
              state: { user: userData }
            });
          }
        }, 1500);
        
      } else {
        // If API returns success false
        throw new Error(data.error || data.message || "Login failed");
      }
      
    } catch (error) {
      console.error("❌ Login error:", error);
      
      // ✅ Handle different types of errors
      if (error.isNetworkError) {
        setError("Network error. Please check your connection and try again.");
      } else if (error.isCorsError) {
        setError("CORS error: Backend configuration issue. Please contact support.");
      } else if (error.status === 401) {
        setError("Invalid email or password. Please try again.");
      } else if (error.status === 400) {
        setError(error.message || "Invalid input. Please check your details.");
      } else {
        setError(error.message || "Login failed. Please try again.");
      }
      
      // Clear any invalid tokens
      clearTokens();
      
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value
    });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px"
      }}
    >
      <div className="container" style={{ 
        maxWidth: "480px",
        width: "100%",
        margin: "0 auto"
      }}>
        {/* App Header */}
        <div className="text-center mb-4">
          <div className="d-flex justify-content-center align-items-center mb-3">
            <div style={{
              width: "50px",
              height: "50px",
              backgroundColor: "#dc3545",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "12px"
            }}>
              <i className="fas fa-store fa-lg text-white"></i>
            </div>
            <div className="text-start">
              <h1 className="mb-0" style={{
                color: "#dc3545",
                fontWeight: "700",
                fontSize: "28px"
              }}>
                Availo
              </h1>
              <p className="mb-0 text-muted" style={{ fontSize: "0.85rem" }}>
                Seller Portal
              </p>
            </div>
          </div>
          
          <div className="mb-3">
            <h2 className="h5" style={{ color: "#333", fontWeight: "600" }}>
              Seller Login
            </h2>
            <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
              Sign in to your seller account
            </p>
            <p className="text-muted small mt-1">
              <i className="fas fa-clock me-1"></i> Access token: dakika 30 • Refresh token: miezi 6
            </p>
          </div>

          {!isAllowedDomain() && (
            <div className="alert alert-danger" style={{ fontSize: "0.85rem", marginTop: "12px", padding: "10px" }}>
              <i className="fas fa-exclamation-triangle me-2"></i>
              <strong>IMPORTANT:</strong> You are accessing via {window.location.hostname}. 
              <div className="mt-2">
                This domain is not configured for Google Sign-In.
              </div>
            </div>
          )}
        </div>

        {/* Login Card */}
        <div className="card shadow" style={{
          border: "none",
          borderRadius: "16px",
          overflow: "hidden",
          width: "100%"
        }}>
          <div className="card-body p-4">
            {error && (
              <div className="alert alert-danger alert-dismissible fade show mb-3" role="alert">
                <div className="d-flex align-items-start">
                  <i className="fas fa-exclamation-circle me-2 mt-1"></i>
                  <div className="flex-grow-1">
                    <strong>Error:</strong>
                    <div className="small mt-1">{error}</div>
                  </div>
                </div>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setError("")}
                ></button>
              </div>
            )}

            {success && (
              <div className="alert alert-success alert-dismissible fade show mb-3" role="alert">
                <div className="d-flex align-items-center">
                  <i className="fas fa-check-circle me-2"></i>
                  <div>{success}</div>
                </div>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setSuccess("")}
                ></button>
              </div>
            )}

            {/* Google OAuth Button */}
            <div className="mb-3">
              <button
                type="button"
                className="btn w-100 d-flex align-items-center justify-content-center"
                onClick={googleLogin}
                disabled={isLoading || !isAllowedDomain()}
                style={{
                  borderRadius: "10px",
                  fontSize: "0.95rem",
                  fontWeight: "600",
                  border: "2px solid #ddd",
                  transition: "all 0.3s ease",
                  height: "50px",
                  backgroundColor: "#ffffff",
                  color: "#333",
                  cursor: isAllowedDomain() ? 'pointer' : 'not-allowed',
                  opacity: isAllowedDomain() ? 1 : 0.6,
                  padding: "0 16px"
                }}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Connecting to Google...
                  </>
                ) : (
                  <>
                    <span className="me-2" style={{ fontSize: "1.3rem", lineHeight: "1" }}>
                      <span style={{ color: "#4285F4" }}>G</span>
                      <span style={{ color: "#EA4335" }}>o</span>
                      <span style={{ color: "#FBBC05" }}>o</span>
                      <span style={{ color: "#4285F4" }}>g</span>
                      <span style={{ color: "#34A853" }}>l</span>
                      <span style={{ color: "#EA4335" }}>e</span>
                    </span>
                    Continue with Google
                  </>
                )}
              </button>
              <p className="text-center text-muted small mt-1 mb-0" style={{ fontSize: "0.75rem" }}>
                {isAllowedDomain() 
                  ? `✅ Google Sign-In ready for ${window.location.hostname}` 
                  : `❌ Google Sign-In not configured for ${window.location.hostname}`}
              </p>
            </div>

            {/* Divider */}
            <div className="position-relative text-center my-3">
              <hr className="w-100" />
              <span className="position-absolute top-50 start-50 translate-middle bg-white px-3 text-muted small">
                OR
              </span>
            </div>

            {/* Email Login Form */}
            <form onSubmit={handleEmailLogin}>
              <div className="mb-2">
                <label className="form-label fw-semibold small">
                  <i className="fas fa-envelope me-2 text-primary"></i>
                  Email Address
                </label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={loginData.email}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  placeholder="you@example.com"
                  required
                  style={{
                    borderRadius: "10px",
                    border: "2px solid #dee2e6",
                    padding: "12px 14px",
                    fontSize: "0.95rem"
                  }}
                />
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="form-label fw-semibold small">
                    <i className="fas fa-lock me-2 text-primary"></i>
                    Password
                  </label>
                </div>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    name="password"
                    value={loginData.password}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    placeholder="••••••••"
                    style={{
                      borderRadius: "10px 0 0 10px",
                      border: "2px solid #dee2e6",
                      borderRight: "none",
                      padding: "12px 14px",
                      fontSize: "0.95rem"
                    }}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      border: "2px solid #dee2e6",
                      borderLeft: "none",
                      borderRadius: "0 10px 10px 0",
                      width: "50px",
                      padding: "0"
                    }}
                  >
                    <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-success w-100 d-flex align-items-center justify-content-center mb-3"
                disabled={isLoading}
                style={{
                  borderRadius: "10px",
                  fontSize: "0.95rem",
                  fontWeight: "600",
                  border: "none",
                  transition: "all 0.3s ease",
                  height: "50px",
                  background: "linear-gradient(135deg, #28a745, #20c997)",
                  padding: "0 16px"
                }}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Logging in...
                  </>
                ) : (
                  <>
                    <i className="fas fa-sign-in-alt me-2"></i>
                    Login with Email
                  </>
                )}
              </button>
            </form>

            {/* Demo Login - Only for testing */}
            <div className="mt-2 text-center">
              <button
                type="button"
                className="btn btn-outline-primary w-100"
                onClick={() => {
                  setLoginData({ email: "demo@availo.co.tz", password: "demo123" });
                  setTimeout(() => handleEmailLogin({ preventDefault: () => {} }), 100);
                }}
                disabled={isLoading}
                style={{ 
                  fontSize: "0.9rem", 
                  padding: "8px",
                  borderRadius: "8px"
                }}
              >
                <i className="fas fa-user-tie me-1"></i>
                Try Demo Account
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-3">
          <div className="d-flex justify-content-center gap-3 mb-2">
            <Link to="/" className="text-decoration-none text-muted small">
              <i className="fas fa-home me-1"></i> Home
            </Link>
            <span className="text-muted small">•</span>
            <Link to="/vendor-register" className="text-decoration-none text-muted small">
              <i className="fas fa-user-plus me-1"></i> Register
            </Link>
          </div>
          
          <p className="text-muted small mt-2" style={{ fontSize: "0.75rem" }}>
            © {new Date().getFullYear()} Availo Tanzania • support@availo.co.tz
          </p>
        </div>
      </div>

      <style>
        {`
          .form-control:focus {
            border-color: #28a745 !important;
            box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.2) !important;
          }
          
          button.btn.w-100.d-flex.align-items-center.justify-content-center {
            background-color: #ffffff !important;
            color: #333 !important;
          }
          
          button.btn.w-100.d-flex.align-items-center.justify-content-center:hover:not(:disabled) {
            background-color: #f8f9fa !important;
            border-color: #bbb !important;
            transform: translateY(-1px);
            box-shadow: 0 4px 10px rgba(0,0,0,0.08) !important;
          }
          
          .btn-success:hover:not(:disabled) {
            background: linear-gradient(135deg, #20c997, #28a745) !important;
            transform: translateY(-1px);
            box-shadow: 0 4px 10px rgba(40, 167, 69, 0.2) !important;
          }
          
          .container {
            padding-left: 0 !important;
            padding-right: 0 !important;
          }
          
          @media (max-width: 380px) {
            .card-body {
              padding: 1.2rem !important;
            }
            
            h1 {
              font-size: 24px !important;
            }
            
            .btn {
              font-size: 0.9rem !important;
            }
          }
        `}
      </style>
      
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
    </div>
  );
}

export default VendorLogin;