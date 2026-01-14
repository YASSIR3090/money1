import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate } from "react-router-dom";

function VendorLogin() {
  const [formData, setFormData] = useState({
    phoneOrEmail: "",
    password: ""
  });
  
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeField, setActiveField] = useState("");
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isHovering, setIsHovering] = useState({
    login: false,
    register: false,
    reset: false
  });
  
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setError("");
  };

  const handleFocus = (fieldName) => {
    setActiveField(fieldName);
  };

  const handleBlur = () => {
    setActiveField("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Basic validation
    if (!formData.phoneOrEmail.trim() || !formData.password.trim()) {
      setError("Please enter both phone/email and password");
      setIsLoading(false);
      return;
    }

    // Check if input is phone or email
    const isPhone = /^[0-9]+$/.test(formData.phoneOrEmail.replace(/\s/g, ''));
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.phoneOrEmail);

    if (!isPhone && !isEmail) {
      setError("Please enter a valid phone number or email address");
      setIsLoading(false);
      return;
    }

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Get sellers from localStorage
      const allSellers = JSON.parse(localStorage.getItem('allSellersData') || '[]');
      
      // Find seller by phone or email
      const seller = allSellers.find(s => 
        s.phoneNumber === formData.phoneOrEmail || 
        s.email === formData.phoneOrEmail ||
        (formData.phoneOrEmail.startsWith('+255') && s.phoneNumber === formData.phoneOrEmail.slice(4)) ||
        (formData.phoneOrEmail.startsWith('255') && s.phoneNumber === formData.phoneOrEmail.slice(3))
      );

      if (seller) {
        // If seller has a saved password, validate it; otherwise fall back to demo len check
        if (seller.password) {
          if (formData.password !== seller.password) {
            setError("Invalid phone/email or password. Please try again.");
            setIsLoading(false);
            setLoginAttempts(prev => prev + 1);
            return;
          }
        } else {
          if (formData.password.length < 6) {
            throw new Error("Invalid credentials");
          }
        }

        // Store authentication data
        localStorage.setItem("isSellerAuthenticated", "true");
        localStorage.setItem("currentSeller", JSON.stringify(seller));
        localStorage.setItem("sellerPhone", seller.phoneNumber);
        localStorage.setItem("sellerToken", `seller-token-${seller.id}`);
        localStorage.setItem("sellerId", seller.id);

        // Remember me functionality
        if (rememberMe) {
          localStorage.setItem("rememberedPhoneOrEmail", formData.phoneOrEmail);
        } else {
          localStorage.removeItem("rememberedPhoneOrEmail");
        }

        // Reset login attempts on successful login
        setLoginAttempts(0);
        
        // Show success animation
        setTimeout(() => {
          alert("🎉 Login successful! Redirecting to marketplace.");
          navigate("/public-sellers");
        }, 500);

      } else {
        setLoginAttempts(prev => prev + 1);
        setError("Invalid phone/email or password. Please try again.");
        
        // Lock account after 5 failed attempts (demo)
        if (loginAttempts + 1 >= 5) {
          setError("Account temporarily locked. Please try again in 10 minutes or contact support.");
          setTimeout(() => {
            setLoginAttempts(0);
            setError("");
          }, 600000); // 10 minutes
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Invalid credentials. Please check your phone/email and password.");
      setLoginAttempts(prev => prev + 1);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    // Try to find a demo seller
    const allSellers = JSON.parse(localStorage.getItem('allSellersData') || '[]');
    const demoSeller = allSellers.find(s => s.id && s.id.startsWith('demo-seller-'));
    
    if (demoSeller) {
      setFormData({
        phoneOrEmail: demoSeller.phoneNumber,
        password: "demo123"
      });
    } else {
      // Fallback demo credentials
      setFormData({
        phoneOrEmail: "+255712345678",
        password: "demo123"
      });
    }
  };

  const handleMouseEnter = (button) => {
    setIsHovering(prev => ({ ...prev, [button]: true }));
  };

  const handleMouseLeave = (button) => {
    setIsHovering(prev => ({ ...prev, [button]: false }));
  };

  // Load remembered phone/email or recently registered credentials on component mount
  useEffect(() => {
    const remembered = localStorage.getItem("rememberedPhoneOrEmail");
    if (remembered) {
      setFormData(prev => ({ ...prev, phoneOrEmail: remembered }));
      setRememberMe(true);
    }

    const justEmail = localStorage.getItem('justRegisteredEmail');
    const justPassword = localStorage.getItem('justRegisteredPassword');
    if (justEmail) {
      setFormData(prev => ({ ...prev, phoneOrEmail: justEmail, password: justPassword || '' }));
      // Clear the one-time prefill (so it doesn't linger)
      localStorage.removeItem('justRegisteredEmail');
      localStorage.removeItem('justRegisteredPassword');
    }
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #ffffff, #ffefef, #ffe8e1, #ffdbd0)",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px"
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

      {/* Floating Icons */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0
      }}>
        {[...Array(15)].map((_, i) => (
          <div 
            key={i}
            style={{
              position: "absolute",
              fontSize: "1.2rem",
              opacity: 0.1,
              animation: `float ${15 + i}s infinite linear`,
              left: `${(i * 6.66)}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              color: "#FF6B6B"
            }}
          >
            {['🏪', '💻', '🖥️', '⌨️', '🖱️', '📱', '💾', '🔌', '🔧', '📊', '💰', '📦', '🚚', '📞', '📍'][i % 15]}
          </div>
        ))}
      </div>

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6 col-xl-5">
            {/* Animated Header */}
            <div className="text-center mb-5">
              <div style={{
                display: "inline-block",
                position: "relative",
                marginBottom: "1.5rem"
              }}>
                {/* Circuit Animation */}
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
                
                {/* Pulsing Icon */}
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
                  animation: "pulseIcon 2s infinite"
                }}>
                  🏪
                </div>
                
                {/* Outer Pulse */}
                <div style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "120px",
                  height: "120px",
                  border: "1px solid rgba(255, 107, 107, 0.2)",
                  borderRadius: "50%",
                  animation: "pulse 2s infinite",
                  animationDelay: "0.5s"
                }}></div>
              </div>
              
              <h1 className="mb-2" style={{
                color: "#333333",
                fontWeight: "bold",
                fontSize: "2.5rem"
              }}>
                Seller Login
              </h1>
              <p className="text-muted">
                Access your seller dashboard to manage products and orders
              </p>
              
              {/* Login Stats */}
              <div className="d-flex justify-content-center gap-4 mt-4">
                <div className="text-center">
                  <div style={{ color: "#FF6B6B", fontSize: "1.5rem", fontWeight: "bold" }}>500+</div>
                  <div className="text-muted" style={{ fontSize: "0.8rem" }}>Active Sellers</div>
                </div>
                <div className="text-center">
                  <div style={{ color: "#FF6B6B", fontSize: "1.5rem", fontWeight: "bold" }}>98%</div>
                  <div className="text-muted" style={{ fontSize: "0.8rem" }}>Satisfaction Rate</div>
                </div>
                <div className="text-center">
                  <div style={{ color: "#FF6B6B", fontSize: "1.5rem", fontWeight: "bold" }}>24/7</div>
                  <div className="text-muted" style={{ fontSize: "0.8rem" }}>Support</div>
                </div>
              </div>
            </div>

            {/* Login Card */}
            <div className="card shadow border-0 rounded-4 overflow-hidden" style={{
              background: "linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.98))",
              border: "2px solid rgba(255, 107, 107, 0.1)",
              position: "relative",
              zIndex: 2
            }}>
              {/* Card Header Glow */}
              <div className="card-header text-center py-4" style={{
                background: "linear-gradient(90deg, rgba(255, 107, 107, 0.1), rgba(255, 142, 83, 0.1))",
                borderBottom: "1px solid rgba(255, 107, 107, 0.2)",
                position: "relative",
                overflow: "hidden"
              }}>
                <div style={{
                  position: "absolute",
                  top: "-50%",
                  left: "-50%",
                  width: "200%",
                  height: "200%",
                  background: "radial-gradient(circle, rgba(255, 107, 107, 0.1) 0%, transparent 70%)",
                  opacity: isHovering.login ? 0.5 : 0,
                  transition: "opacity 0.3s ease"
                }}></div>
                <h3 className="mb-0" style={{ color: "#333333", position: "relative", zIndex: 1 }}>
                  <i className="fas fa-sign-in-alt me-2" style={{ color: "#FF6B6B" }}></i>
                  Sign In to Your Seller Account
                </h3>
                <p className="text-muted mb-0 mt-2" style={{ fontSize: "0.9rem", position: "relative", zIndex: 1 }}>
                  Enter your credentials to manage your products
                </p>
              </div>

              <div className="card-body p-4 p-md-5">
                {error && (
                  <div className="alert alert-danger d-flex align-items-center" role="alert" style={{
                    background: "rgba(255, 107, 107, 0.1)",
                    border: "1px solid rgba(255, 107, 107, 0.3)",
                    color: "#FF6B6B",
                    borderRadius: "10px"
                  }}>
                    <i className="fas fa-exclamation-triangle me-3 fs-5" style={{ color: "#FF6B6B" }}></i>
                    <div>
                      <strong>Error:</strong> {error}
                      {loginAttempts > 0 && (
                        <div className="mt-1" style={{ fontSize: "0.85rem" }}>
                          Failed attempts: {loginAttempts}/5
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* Phone/Email Input */}
                  <div className="mb-4">
                    <label htmlFor="phoneOrEmail" className="form-label d-flex align-items-center" style={{ color: "#555555", fontWeight: "600" }}>
                      <i className="fas fa-phone-alt me-2" style={{ color: "#FF6B6B" }}></i>
                      Phone Number or Email
                      <span className="text-danger ms-1">*</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text" style={{
                        background: activeField === "phoneOrEmail" 
                          ? "rgba(255, 107, 107, 0.2)" 
                          : "rgba(255,255,255,0.9)",
                        border: activeField === "phoneOrEmail" 
                          ? "1px solid #FF6B6B" 
                          : "1px solid rgba(255, 107, 107, 0.3)",
                        borderRight: "none",
                        transition: "all 0.3s ease"
                      }}>
                        <i className={`fas fa-${activeField === "phoneOrEmail" ? "phone-alt text-danger" : "phone-alt"}`} style={{ 
                          color: activeField === "phoneOrEmail" ? "#FF6B6B" : "#666666"
                        }}></i>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        id="phoneOrEmail"
                        name="phoneOrEmail"
                        value={formData.phoneOrEmail}
                        onChange={handleInputChange}
                        onFocus={() => handleFocus("phoneOrEmail")}
                        onBlur={handleBlur}
                        required
                        disabled={isLoading}
                        placeholder="+255712345678 or seller@example.com"
                        style={{
                          background: "rgba(255,255,255,0.9)",
                          border: activeField === "phoneOrEmail" 
                            ? "1px solid #FF6B6B" 
                            : "1px solid rgba(255, 107, 107, 0.3)",
                          borderLeft: "none",
                          color: "#333333",
                          height: "50px",
                          transition: "all 0.3s ease"
                        }}
                      />
                    </div>
                    <small className="text-muted mt-2 d-block">
                      Enter your registered phone number or email
                    </small>
                  </div>

                  {/* Password Input */}
                  <div className="mb-4">
                    <label htmlFor="password" className="form-label d-flex align-items-center" style={{ color: "#555555", fontWeight: "600" }}>
                      <i className="fas fa-key me-2" style={{ color: "#FF6B6B" }}></i>
                      Password
                      <span className="text-danger ms-1">*</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text" style={{
                        background: activeField === "password" 
                          ? "rgba(255, 107, 107, 0.2)" 
                          : "rgba(255,255,255,0.9)",
                        border: activeField === "password" 
                          ? "1px solid #FF6B6B" 
                          : "1px solid rgba(255, 107, 107, 0.3)",
                        borderRight: "none",
                        transition: "all 0.3s ease"
                      }}>
                        <i className={`fas fa-lock ${activeField === "password" ? "text-danger" : ""}`} style={{ 
                          color: activeField === "password" ? "#FF6B6B" : "#666666"
                        }}></i>
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        onFocus={() => handleFocus("password")}
                        onBlur={handleBlur}
                        required
                        disabled={isLoading}
                        placeholder="Enter your password"
                        style={{
                          background: "rgba(255,255,255,0.9)",
                          border: activeField === "password" 
                            ? "1px solid #FF6B6B" 
                            : "1px solid rgba(255, 107, 107, 0.3)",
                          borderLeft: "none",
                          color: "#333333",
                          height: "50px",
                          transition: "all 0.3s ease"
                        }}
                      />
                      <button
                        type="button"
                        className="input-group-text"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          background: "rgba(255,255,255,0.9)",
                          border: activeField === "password" 
                            ? "1px solid #FF6B6B" 
                            : "1px solid rgba(255, 107, 107, 0.3)",
                          borderLeft: "none",
                          color: showPassword ? "#FF6B6B" : "#666666",
                          cursor: "pointer",
                          transition: "all 0.3s ease"
                        }}
                      >
                        <i className={`fas fa-${showPassword ? "eye-slash" : "eye"}`}></i>
                      </button>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mt-2">
                      <small className="text-muted">
                        {showPassword ? "Password is visible" : "Password is hidden"}
                      </small>
                      <small>
                        <Link 
                          to="/reset-password" 
                          className="text-decoration-none"
                          style={{ 
                            color: "#FF6B6B",
                            fontWeight: "600"
                          }}
                          onMouseEnter={() => handleMouseEnter("reset")}
                          onMouseLeave={() => handleMouseLeave("reset")}
                        >
                          <i className="fas fa-key me-1"></i>
                          Forgot Password?
                        </Link>
                      </small>
                    </div>
                  </div>

                  {/* Remember Me & Options */}
                  <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="rememberMe"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          style={{
                            background: rememberMe ? "#FF6B6B" : "rgba(255,255,255,0.9)",
                            borderColor: rememberMe ? "#FF6B6B" : "rgba(255, 107, 107, 0.3)",
                            cursor: "pointer"
                          }}
                        />
                        <label className="form-check-label" htmlFor="rememberMe" style={{ color: "#555555" }}>
                          Remember me on this device
                        </label>
                      </div>
                      
                      <button
                        type="button"
                        className="btn btn-sm"
                        onClick={handleDemoLogin}
                        style={{
                          border: "1px solid rgba(255, 107, 107, 0.3)",
                          background: "rgba(255, 107, 107, 0.1)",
                          color: "#FF6B6B",
                          padding: "5px 15px",
                          borderRadius: "20px",
                          transition: "all 0.3s ease",
                          fontWeight: "600"
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = "rgba(255, 107, 107, 0.2)";
                          e.target.style.transform = "scale(1.05)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = "rgba(255, 107, 107, 0.1)";
                          e.target.style.transform = "scale(1)";
                        }}
                      >
                        <i className="fas fa-magic me-1"></i>
                        Try Demo
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="mb-4">
                    <button
                      type="submit"
                      className="btn w-100 py-3 fw-bold"
                      disabled={isLoading || loginAttempts >= 5}
                      style={{
                        background: isLoading 
                          ? "linear-gradient(135deg, #999, #bbb)" 
                          : isHovering.login
                            ? "linear-gradient(135deg, #FF8E53, #FF6B6B)"
                            : "linear-gradient(135deg, #FF6B6B, #FF8E53)",
                        border: "none",
                        color: "white",
                        borderRadius: "15px",
                        transition: "all 0.3s ease",
                        transform: isHovering.login ? "translateY(-2px)" : "translateY(0)",
                        boxShadow: isHovering.login 
                          ? "0 10px 20px rgba(255, 107, 107, 0.4)" 
                          : "0 5px 15px rgba(255, 107, 107, 0.2)"
                      }}
                      onMouseEnter={() => handleMouseEnter("login")}
                      onMouseLeave={() => handleMouseLeave("login")}
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Authenticating...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-sign-in-alt me-2"></i>
                          Sign In to Dashboard
                        </>
                      )}
                    </button>
                    
                    {/* Login Progress */}
                    {loginAttempts > 0 && (
                      <div className="mt-3">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <small style={{ color: "#555555" }}>Login Security</small>
                          <small style={{ color: "#555555" }}>{loginAttempts}/5 attempts</small>
                        </div>
                        <div style={{
                          height: "4px",
                          background: "rgba(255, 107, 107, 0.1)",
                          borderRadius: "2px",
                          overflow: "hidden"
                        }}>
                          <div style={{
                            height: "100%",
                            width: `${(loginAttempts / 5) * 100}%`,
                            background: loginAttempts >= 5 
                              ? "linear-gradient(90deg, #FF6B6B, #FF5252)" 
                              : "linear-gradient(90deg, #FF6B6B, #FF8E53)",
                            borderRadius: "2px",
                            transition: "width 0.5s ease"
                          }}></div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="position-relative text-center mb-4">
                    <hr className="my-4" style={{ borderColor: "rgba(255, 107, 107, 0.1)" }} />
                    <span className="position-absolute top-50 start-50 translate-middle px-3" style={{
                      background: "rgba(255, 255, 255, 0.9)",
                      color: "#666666",
                      fontSize: "0.85rem",
                      fontWeight: "600"
                    }}>
                      Or continue with
                    </span>
                  </div>

                  {/* Social Login Options */}
                  <div className="row g-3 mb-4">
                    <div className="col-6">
                      <button
                        type="button"
                        className="btn w-100 d-flex align-items-center justify-content-center gap-2"
                        style={{
                          background: "rgba(255, 255, 255, 0.9)",
                          border: "1px solid rgba(255, 107, 107, 0.3)",
                          color: "#333333",
                          padding: "12px",
                          borderRadius: "10px",
                          transition: "all 0.3s ease",
                          fontWeight: "600"
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = "rgba(255, 107, 107, 0.1)";
                          e.target.style.transform = "translateY(-2px)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = "rgba(255, 255, 255, 0.9)";
                          e.target.style.transform = "translateY(0)";
                        }}
                      >
                        <i className="fab fa-google fs-5" style={{ color: "#FF6B6B" }}></i>
                        <span>Google</span>
                      </button>
                    </div>
                    <div className="col-6">
                      <button
                        type="button"
                        className="btn w-100 d-flex align-items-center justify-content-center gap-2"
                        style={{
                          background: "rgba(255, 255, 255, 0.9)",
                          border: "1px solid rgba(255, 107, 107, 0.3)",
                          color: "#333333",
                          padding: "12px",
                          borderRadius: "10px",
                          transition: "all 0.3s ease",
                          fontWeight: "600"
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = "rgba(255, 107, 107, 0.1)";
                          e.target.style.transform = "translateY(-2px)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = "rgba(255, 255, 255, 0.9)";
                          e.target.style.transform = "translateY(0)";
                        }}
                      >
                        <i className="fab fa-whatsapp fs-5" style={{ color: "#25D366" }}></i>
                        <span>WhatsApp</span>
                      </button>
                    </div>
                  </div>
                </form>

                {/* Registration Link */}
                <div className="text-center mt-4 pt-3 border-top" style={{ borderColor: "rgba(255, 107, 107, 0.2)" }}>
                  <p className="mb-3" style={{ color: "#555555" }}>
                    <i className="fas fa-user-plus me-2" style={{ color: "#FF6B6B" }}></i>
                    New to Availo?
                  </p>
                  <Link 
                    to="/vendor-register" 
                    className="btn w-100 py-3 fw-bold"
                    style={{
                      border: "2px solid #4ECDC4",
                      background: isHovering.register ? "rgba(78, 205, 196, 0.1)" : "transparent",
                      color: "#4ECDC4",
                      borderRadius: "15px",
                      transition: "all 0.3s ease",
                      transform: isHovering.register ? "translateY(-2px)" : "translateY(0)",
                      boxShadow: isHovering.register ? "0 5px 15px rgba(78, 205, 196, 0.2)" : "none",
                      textDecoration: "none"
                    }}
                    onMouseEnter={() => handleMouseEnter("register")}
                    onMouseLeave={() => handleMouseLeave("register")}
                  >
                    <i className="fas fa-store-alt me-2"></i>
                    Register Your Shop
                  </Link>
                  <p className="text-muted mt-3 mb-0" style={{ fontSize: "0.85rem" }}>
                    Join 500+ sellers growing their business with us
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="card-footer text-center py-3" style={{
                background: "rgba(255, 255, 255, 0.8)",
                borderTop: "1px solid rgba(255, 107, 107, 0.1)"
              }}>
                <small style={{ color: "#666666" }}>
                  <i className="fas fa-shield-alt me-1" style={{ color: "#FF6B6B" }}></i>
                  Your data is secured with SSL encryption • 
                  <i className="fas fa-bolt ms-2 me-1" style={{ color: "#FFD166" }}></i>
                  Fast authentication
                </small>
              </div>
            </div>

            {/* Quick Links */}
            <div className="text-center mt-4">
              <div className="d-flex justify-content-center gap-3 mb-3">
                <Link to="/" className="text-decoration-none" style={{ color: "#FF6B6B", fontWeight: "600" }}>
                  <i className="fas fa-home me-1"></i> Home
                </Link>
                <span style={{ color: "#FF6B6B" }}>•</span>
                <a href="#" className="text-decoration-none" style={{ color: "#FF6B6B", fontWeight: "600" }}>
                  <i className="fas fa-question-circle me-1"></i> Help
                </a>
                <span style={{ color: "#FF6B6B" }}>•</span>
                <a href="#" className="text-decoration-none" style={{ color: "#FF6B6B", fontWeight: "600" }}>
                  <i className="fas fa-file-alt me-1"></i> Terms
                </a>
                <span style={{ color: "#FF6B6B" }}>•</span>
                <a href="#" className="text-decoration-none" style={{ color: "#FF6B6B", fontWeight: "600" }}>
                  <i className="fas fa-lock me-1"></i> Privacy
                </a>
              </div>
              <p className="mb-0" style={{ color: "#666666", fontSize: "0.85rem" }}>
                Need help? Contact seller support: <a href="mailto:support@availo.co.tz" style={{ color: "#FF6B6B", fontWeight: "600" }}>support@availo.co.tz</a>
              </p>
            </div>
          </div>
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
          
          @keyframes float {
            0% {
              transform: translateY(0) rotate(0deg);
              opacity: 0.1;
            }
            25% {
              transform: translateY(-50px) rotate(90deg);
              opacity: 0.2;
            }
            50% {
              transform: translateY(-100px) rotate(180deg);
              opacity: 0.1;
            }
            75% {
              transform: translateY(-50px) rotate(270deg);
              opacity: 0.05;
            }
            100% {
              transform: translateY(0) rotate(360deg);
              opacity: 0.1;
            }
          }
          
          @keyframes spin {
            0% { transform: translate(-50%, -50%) rotate(0deg); }
            100% { transform: translate(-50%, -50%) rotate(360deg); }
          }
          
          @keyframes pulse {
            0% {
              width: 120px;
              height: 120px;
              opacity: 0.5;
            }
            100% {
              width: 160px;
              height: 160px;
              opacity: 0;
            }
          }
          
          @keyframes pulseIcon {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
          
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          /* Form element styling */
          .form-control:focus, .form-select:focus, .form-check-input:focus {
            background: rgba(255,255,255,0.95) !important;
            border-color: #FF6B6B !important;
            box-shadow: 0 0 0 0.25rem rgba(255, 107, 107, 0.25) !important;
            color: #333333 !important;
          }
          
          .form-control::placeholder {
            color: rgba(102, 102, 102, 0.6) !important;
          }
          
          .form-check-input:checked {
            background-color: #FF6B6B !important;
            border-color: #FF6B6B !important;
          }
          
          /* Smooth transitions */
          * {
            transition: background-color 0.3s ease, 
                        border-color 0.3s ease, 
                        transform 0.3s ease, 
                        box-shadow 0.3s ease,
                        opacity 0.3s ease;
          }
          
          /* Custom scrollbar */
          ::-webkit-scrollbar {
            width: 8px;
          }
          
          ::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.5);
          }
          
          ::-webkit-scrollbar-thumb {
            background: rgba(255, 107, 107, 0.5);
            border-radius: 4px;
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 107, 107, 0.8);
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

export default VendorLogin;