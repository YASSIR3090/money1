// src/context/AdminContext.jsx - ADMIN ONLY 🔥
// ✅ FIXED: Added getAllUsers function for AdminDashboard
import React, { createContext, useState, useContext, useEffect } from 'react';

const AdminContext = createContext(null);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [ads, setAds] = useState([]);
  const [messages, setMessages] = useState([]);

  console.log("🚀 AdminProvider mounted"); // Line 28

  useEffect(() => {
    const storedAdmin = localStorage.getItem('adminUser');
    if (storedAdmin) {
      try {
        const admin = JSON.parse(storedAdmin);
        setAdminUser(admin);
        setIsAdmin(true);
      } catch (error) {
        localStorage.removeItem('adminUser');
      }
    }
    loadAds();
    loadMessages();
  }, []);

  // ============== ADS FUNCTIONS ==============
  const loadAds = () => {
    try {
      const storedAds = localStorage.getItem('availo_ads');
      if (storedAds) {
        const parsed = JSON.parse(storedAds);
        setAds(parsed);
      } else {
        localStorage.setItem('availo_ads', JSON.stringify([]));
        setAds([]);
      }
    } catch (error) {
      setAds([]);
    }
  };

  const addAd = (adData) => {
    const newAd = { 
      id: Date.now(), 
      ...adData, 
      createdAt: new Date().toISOString(), 
      active: true 
    };
    const updatedAds = [...ads, newAd];
    localStorage.setItem('availo_ads', JSON.stringify(updatedAds));
    setAds(updatedAds);
    return newAd;
  };

  const updateAd = (adId, updatedData) => {
    const updatedAds = ads.map(ad => 
      ad.id === adId ? { ...ad, ...updatedData } : ad
    );
    localStorage.setItem('availo_ads', JSON.stringify(updatedAds));
    setAds(updatedAds);
  };

  const deleteAd = (adId) => {
    const updatedAds = ads.filter(ad => ad.id !== adId);
    localStorage.setItem('availo_ads', JSON.stringify(updatedAds));
    setAds(updatedAds);
  };

  // ============== MESSAGES FUNCTIONS ==============
  const loadMessages = () => {
    try {
      const storedMessages = localStorage.getItem('availo_messages');
      if (storedMessages) {
        const parsed = JSON.parse(storedMessages);
        setMessages(parsed);
      } else {
        localStorage.setItem('availo_messages', JSON.stringify([]));
        setMessages([]);
      }
    } catch (error) {
      setMessages([]);
    }
  };

  const addMessage = (messageData) => {
    const newMessage = { 
      id: Date.now(), 
      ...messageData, 
      status: 'unread', 
      replies: [],
      createdAt: new Date().toISOString() 
    };
    const updatedMessages = [...messages, newMessage];
    localStorage.setItem('availo_messages', JSON.stringify(updatedMessages));
    setMessages(updatedMessages);
    return newMessage;
  };

  const replyToMessage = (messageId, replyText, adminEmail) => {
    const updatedMessages = messages.map(msg => {
      if (msg.id === messageId) {
        const replies = msg.replies || [];
        return {
          ...msg,
          status: 'replied',
          replies: [...replies, { 
            id: Date.now(), 
            text: replyText, 
            adminEmail, 
            createdAt: new Date().toISOString() 
          }]
        };
      }
      return msg;
    });
    localStorage.setItem('availo_messages', JSON.stringify(updatedMessages));
    setMessages(updatedMessages);
  };

  const deleteMessage = (messageId) => {
    const updatedMessages = messages.filter(msg => msg.id !== messageId);
    localStorage.setItem('availo_messages', JSON.stringify(updatedMessages));
    setMessages(updatedMessages);
  };

  // ============== USER MANAGEMENT FUNCTIONS ==============
  // ✅ CRITICAL FIX: Added getAllUsers function for AdminDashboard!
  const getAllUsers = () => {
    try {
      // Get all registered vendors from localStorage
      const registeredVendors = JSON.parse(localStorage.getItem('registeredVendors') || '[]');
      
      // Also get Google OAuth users
      const googleOAuthUser = localStorage.getItem('googleOAuthUser');
      const googleUsers = [];
      
      if (googleOAuthUser) {
        try {
          const parsed = JSON.parse(googleOAuthUser);
          googleUsers.push(parsed);
        } catch (e) {
          console.error('Error parsing googleOAuthUser:', e);
        }
      }
      
      // Combine all users
      const allUsers = [...registeredVendors, ...googleUsers];
      
      // Remove duplicates by email
      const uniqueUsers = allUsers.filter((user, index, self) => 
        index === self.findIndex((u) => u.email === user.email)
      );
      
      console.log(`✅ AdminContext: Found ${uniqueUsers.length} total users`);
      return uniqueUsers;
    } catch (error) {
      console.error('❌ AdminContext: Error getting users:', error);
      return [];
    }
  };

  // ✅ Get user count
  const getUserCount = () => {
    const users = getAllUsers();
    return users.length;
  };

  // ✅ Delete user by email
  const deleteUser = (email) => {
    try {
      // Remove from registered vendors
      const registeredVendors = JSON.parse(localStorage.getItem('registeredVendors') || '[]');
      const updatedVendors = registeredVendors.filter(v => v.email !== email);
      localStorage.setItem('registeredVendors', JSON.stringify(updatedVendors));
      
      // Remove from allSellersData (their products)
      const allSellers = JSON.parse(localStorage.getItem('allSellersData') || '[]');
      const updatedSellers = allSellers.filter(s => s.email !== email);
      localStorage.setItem('allSellersData', JSON.stringify(updatedSellers));
      
      // If it's the Google OAuth user, remove it
      const googleOAuthUser = localStorage.getItem('googleOAuthUser');
      if (googleOAuthUser) {
        try {
          const parsed = JSON.parse(googleOAuthUser);
          if (parsed.email === email) {
            localStorage.removeItem('googleOAuthUser');
            localStorage.removeItem('userPicture');
          }
        } catch (e) {
          console.error('Error removing Google user:', e);
        }
      }
      
      console.log(`✅ Deleted user: ${email}`);
      return true;
    } catch (error) {
      console.error('❌ Error deleting user:', error);
      return false;
    }
  };

  // ============== PRODUCT MANAGEMENT FUNCTIONS ==============
  // ✅ Get all products from all sellers
  const getAllProducts = () => {
    try {
      const allSellers = JSON.parse(localStorage.getItem('allSellersData') || '[]');
      return allSellers;
    } catch (error) {
      console.error('❌ Error getting products:', error);
      return [];
    }
  };

  // ✅ Delete product by ID
  const deleteProduct = (productId) => {
    try {
      const allSellers = JSON.parse(localStorage.getItem('allSellersData') || '[]');
      const updatedSellers = allSellers.filter(p => p.id !== productId);
      localStorage.setItem('allSellersData', JSON.stringify(updatedSellers));
      console.log(`✅ Deleted product: ${productId}`);
      return true;
    } catch (error) {
      console.error('❌ Error deleting product:', error);
      return false;
    }
  };

  // ============== ADMIN AUTHENTICATION ==============
  const adminLogin = (email, password) => {
    if (email === 'admin@availo.co.tz' && password === 'admin123') {
      const admin = { 
        id: 'admin_' + Date.now(), 
        email, 
        name: 'Admin User', 
        role: 'super_admin' 
      };
      localStorage.setItem('adminUser', JSON.stringify(admin));
      setAdminUser(admin);
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    localStorage.removeItem('adminUser');
    setAdminUser(null);
    setIsAdmin(false);
  };

  // ============== CONTEXT VALUE ==============
  const value = {
    // Admin Auth
    isAdmin,
    adminUser,
    adminLogin,
    adminLogout,
    
    // Ads Management
    ads,
    addAd,
    updateAd,
    deleteAd,
    
    // Messages Management
    messages,
    addMessage,
    replyToMessage,
    deleteMessage,
    
    // ✅ User Management - FIXED: getAllUsers is now available!
    getAllUsers,
    getUserCount,
    deleteUser,
    
    // ✅ Product Management
    getAllProducts,
    deleteProduct,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export default AdminContext;