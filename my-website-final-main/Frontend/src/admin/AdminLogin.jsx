import React, { useState } from "react";
import bgImage from "../Imgs/zawaBg.jpg";
import { Link, useNavigate } from 'react-router-dom';

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    
    const adminUsers = JSON.parse(localStorage.getItem('adminUsers')) || [];
    
    
    const admin = adminUsers.find(admin => admin.email === email && admin.password === password);
    
    if (admin) {
    
      localStorage.setItem('adminAuthenticated', 'true');
      localStorage.setItem('adminUser', JSON.stringify(admin));
      
      console.log("Admin login successful!");
      navigate('/admin');
    } else {
      // Check if it's a regular user trying to login
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const user = users.find(user => user.email === email && user.password === password);
      
      if (user) {
        setError("Please use the regular login page for user access.");
      } else {
        // Failed login
        setError("Invalid admin credentials");
      }
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        width: "100%",
        minHeight: "100vh",
      }}
    >
      <div
        className="card shadow border-0 rounded-4 p-4 bg-light"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <h3 className="text-center display-6 mt-2">Admin Login</h3>
        
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Admin Email
            </label>
            <input
              type="email"
              className="form-control rounded-3 border-2"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control rounded-3 border-2"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary border-0 rounded-3 w-100 mb-3 py-2 fw-bold"
          >
            Login
          </button>

          <div className="d-flex justify-content-between mb-3">
            <Link to="/admin-register" className="text-decoration-none">Register Admin</Link>
            <Link to="/reset" className="text-decoration-none">Forgot password?</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
