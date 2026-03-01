// src/App.jsx - ULTIMATE FIXED VERSION FOR VITE 🔥
// ✅ BrowserRouter IKO KWA main.jsx - SI HAPA!
// ✅ Nested routes ZINAFANYA KAZI SAHIHI!
// ✅ AdminProducts IMEFUNGWA KIKAMILI!
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// ==================== CONTEXT PROVIDERS ====================
import { AuthProvider } from './context/AuthContext';
import { AdminProvider } from './context/AdminContext';

// ==================== PUBLIC ROUTES ====================
// Auth pages - from './Auth' folder
import PublicSellersDashboard from './Auth/PublicSellersDashboard';
import VendorLogin from './Auth/VendorLogin';
import VendorRegister from './Auth/VendorRegister';
import GoogleCallback from './Auth/GoogleCallback';
import SellerProfile from './Auth/SellerProfile';
import ProductDetails from './Auth/ProductDetails';
import Products from './Auth/Products';
import SearchResults from './Auth/SearchResults';
import Shops from './Auth/Shops';
import Reset from './Auth/Reset';

// ==================== ADMIN ROUTES ====================
// ✅ CRITICAL: Use './admin/AdminDashboard' (small 'a') - matches your FOLDER!
import AdminDashboard from './admin/AdminDashboard';
import AdminLogin from './admin/AdminLogin';
import AdminAdsManager from './admin/AdminAdsManager';
import AdminMessages from './admin/AdminMessages';
import AdminUsers from './admin/AdminUsers';
import AdminRegister from './admin/AdminRegister';
import AdminProducts from './admin/AdminProducts'; // ✅ NEW - AdminProducts ADDED!

// ==================== LEGACY ADMIN ROUTES ====================
import Management from './admin/Management';

// ==================== APP COMPONENT ====================
function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <Routes>
          
          {/* ============== PUBLIC ROUTES ============== */}
          <Route path="/" element={<PublicSellersDashboard />} />
          <Route path="/vendor-login" element={<VendorLogin />} />
          <Route path="/vendor-register" element={<VendorRegister />} />
          <Route path="/auth/google/callback" element={<GoogleCallback />} />
          <Route path="/seller-profile" element={<SellerProfile />} />
          <Route path="/product/:productId" element={<ProductDetails />} />
          <Route path="/products" element={<Products />} />
          <Route path="/search-results" element={<SearchResults />} />
          <Route path="/shops" element={<Shops />} />
          <Route path="/reset" element={<Reset />} />

          {/* ============== ADMIN AUTH ROUTES ============== */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegister />} />
          
          {/* ============== ADMIN DASHBOARD WITH NESTED ROUTES ============== */}
          {/* ✅ FIXED: AdminDashboard is the LAYOUT, child routes go in <Outlet /> */}
          <Route path="/admin" element={<AdminDashboard />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} /> {/* This shows dashboard content */}
            <Route path="ads" element={<AdminAdsManager />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="products" element={<AdminProducts />} /> {/* ✅ NEW - PRODUCTS ROUTE! */}
            <Route path="management" element={<Management />} /> {/* Legacy route */}
          </Route>
          
          {/* Alternative direct routes (if needed) */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/ads" element={<AdminAdsManager />} />
          <Route path="/admin/messages" element={<AdminMessages />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/products" element={<AdminProducts />} /> {/* ✅ NEW - DIRECT ROUTE! */}
          <Route path="/admin/management" element={<Management />} />
          
          {/* ============== FALLBACK ROUTE ============== */}
          <Route path="*" element={<Navigate to="/" replace />} />
          
        </Routes>
      </AdminProvider>
    </AuthProvider>
  );
}

export default App;