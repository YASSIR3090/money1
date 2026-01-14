import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import bgImage from "../Imgs/zawaBg.jpg";
import zawaLogo from "../Imgs/zawaLogo.png";

function AdminRegister() {
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "",
    maritalStatus: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

  
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    
    const existingAdmins = JSON.parse(localStorage.getItem('adminUsers')) || [];
    if (existingAdmins.some(admin => admin.email === formData.email)) {
      setError("Admin with this email already exists");
      return;
    }

    // Create admin user object
    const adminUser = {
      firstName: formData.firstName,
      middleName: formData.middleName,
      lastName: formData.lastName,
      gender: formData.gender,
      maritalStatus: formData.maritalStatus,
      phoneNumber: formData.phoneNumber,
      email: formData.email,
      password: formData.password,
      registrationDate: new Date().toISOString().split('T')[0]
    };

    // Save admin to localStorage
    existingAdmins.push(adminUser);
    localStorage.setItem('adminUsers', JSON.stringify(existingAdmins));

    setSuccess("Admin account created successfully! You can now login.");
    
    
    setFormData({
      firstName: "",
      middleName: "",
      lastName: "",
      gender: "",
      maritalStatus: "",
      phoneNumber: "",
      email: "",
      password: "",
      confirmPassword: ""
    });

    
    setTimeout(() => {
      navigate('/admin-login');
    }, 2000);
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center min-vh-100 py-4"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow border-0 rounded-4 overflow-hidden">
              <div className="card-header bg-primary text-white text-center py-4">
                <img
                  src={zawaLogo}
                  alt="Zawamis Logo"
                  className="img-fluid mb-3"
                  style={{ maxHeight: "70px", filter: "brightness(0) invert(1)" }}
                />
                <h3 className="mb-0">Admin Registration</h3>
                <p className="mb-0 mt-2 opacity-75">Create Administrator Account</p>
              </div>
              
              <div className="card-body p-5">
                {error && (
                  <div className="alert alert-danger" role="alert">
                    <i className="fas fa-exclamation-circle me-2"></i>
                    {error}
                  </div>
                )}
                
                {success && (
                  <div className="alert alert-success" role="alert">
                    <i className="fas fa-check-circle me-2"></i>
                    {success}
                  </div>
                )}
                
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label htmlFor="firstName" className="form-label">
                        First Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="col-md-4 mb-3">
                      <label htmlFor="middleName" className="form-label">
                        Middle Name
                      </label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        id="middleName"
                        name="middleName"
                        value={formData.middleName}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="col-md-4 mb-3">
                      <label htmlFor="lastName" className="form-label">
                        Last Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="col-md-6 mb-3">
                      <label htmlFor="gender" className="form-label">
                        Gender <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select rounded-3"
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    
                    <div className="col-md-6 mb-3">
                      <label htmlFor="maritalStatus" className="form-label">
                        Marital Status <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select rounded-3"
                        id="maritalStatus"
                        name="maritalStatus"
                        value={formData.maritalStatus}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Status</option>
                        <option value="single">Single</option>
                        <option value="married">Married</option>
                        <option value="divorced">Divorced</option>
                        <option value="widowed">Widowed</option>
                      </select>
                    </div>
                    
                    <div className="col-md-6 mb-3">
                      <label htmlFor="phoneNumber" className="form-label">
                        Phone Number (Tanzania) <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <span className="input-group-text">+255</span>
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
                        />
                      </div>
                      <small className="text-muted">Format: 712345678 (9 digits)</small>
                    </div>
                    
                    <div className="col-md-6 mb-3">
                      <label htmlFor="email" className="form-label">
                        Email Address <span className="text-danger">*</span>
                      </label>
                      <input
                        type="email"
                        className="form-control rounded-3"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="col-md-6 mb-3">
                      <label htmlFor="password" className="form-label">
                        Password <span className="text-danger">*</span>
                      </label>
                      <input
                        type="password"
                        className="form-control rounded-3"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        minLength="6"
                      />
                      <small className="text-muted">Minimum 6 characters</small>
                    </div>
                    
                    <div className="col-md-6 mb-3">
                      <label htmlFor="confirmPassword" className="form-label">
                        Confirm Password <span className="text-danger">*</span>
                      </label>
                      <input
                        type="password"
                        className="form-control rounded-3"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="d-grid gap-2 mt-4">
                    <button
                      type="submit"
                      className="btn btn-primary py-2 fw-bold rounded-3"
                    >
                      <i className="fas fa-user-plus me-2"></i>
                      Create Admin Account
                    </button>
                  </div>
                </form>
                
                <div className="text-center mt-4">
                  <button 
                    className="btn btn-link text-decoration-none me-3"
                    onClick={() => navigate('/admin-login')}
                  >
                    <i className="fas fa-sign-in-alt me-1"></i> Admin Login
                  </button>
                  
                  <button 
                    className="btn btn-link text-decoration-none"
                    onClick={() => navigate('/')}
                  >
                    <i className="fas fa-home me-1"></i> Back to Home
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminRegister;
