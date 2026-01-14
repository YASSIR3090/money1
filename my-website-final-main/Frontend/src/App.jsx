
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Import Components
import HomePage from './HomePage.jsx'; // HomePage is in src folder
import VendorLogin from './Auth/VendorLogin.jsx';
import VendorRegister from './Auth/VendorRegister.jsx';
import PublicSellersDashboard from './Auth/PublicSellersDashboard.jsx';
import SellerProfile from './Auth/SellerProfile.jsx';

// Protected Routes
const SellerProtectedRoute = ({ children }) => {
  const isSellerAuthenticated = localStorage.getItem('isSellerAuthenticated') === 'true';
  return isSellerAuthenticated ? children : <Navigate to="/vendor-login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        
        {/* Vendor/Auth Routes */}
        <Route path="/vendor-login" element={<VendorLogin />} />
        <Route path="/vendor-register" element={<VendorRegister />} />
        <Route path="/public-sellers" element={<PublicSellersDashboard />} />
        
        {/* Protected Seller Routes */}
        <Route 
          path="/seller-profile" 
          element={
            <SellerProtectedRoute>
              <SellerProfile />
            </SellerProtectedRoute>
          } 
        />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;