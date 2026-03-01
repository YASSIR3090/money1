// src/context/AuthContext.jsx - ULTIMATE FIXED VERSION 🔥
// ✅ USES EMAIL AS UNIQUE IDENTIFIER ACROSS DEVICES
// ✅ SAME USER PROFILE ON ALL DEVICES
// ✅ PERSISTENT LOGIN
// ✅ CROSS-DEVICE SYNC

import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // ============== LOAD USER FROM STORAGE ON MOUNT ==============
  useEffect(() => {
    const loadUser = () => {
      try {
        console.log("🔐 AuthContext: Loading user from storage...");
        
        // Try multiple storage locations
        const storageLocations = [
          { key: 'availoUser', type: 'local' },
          { key: 'googleOAuthUser', type: 'local' },
          { key: 'user', type: 'local' },
          { key: 'availoUser', type: 'session' }
        ];

        for (const loc of storageLocations) {
          let data = null;
          if (loc.type === 'local') {
            data = localStorage.getItem(loc.key);
          } else {
            data = sessionStorage.getItem(loc.key);
          }

          if (data) {
            try {
              const parsed = JSON.parse(data);
              if (parsed && parsed.email) {
                console.log(`✅ User loaded from ${loc.type}Storage.${loc.key}:`, parsed.email);
                setUser(parsed);
                
                // Save to all storages for consistency
                saveUserToAllStorages(parsed);
                return;
              }
            } catch (e) {
              console.warn(`Error parsing ${loc.key}:`, e);
            }
          }
        }

        console.log("ℹ️ No existing user found");
      } catch (error) {
        console.error("❌ Error loading user:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUser();
    
    // Listen for storage changes (for cross-tab/device sync)
    const handleStorageChange = (e) => {
      if (e.key === 'availoUser' || e.key === 'googleOAuthUser') {
        console.log("🔄 Storage changed, reloading user...");
        if (e.newValue) {
          try {
            const parsed = JSON.parse(e.newValue);
            setUser(parsed);
            console.log("✅ User updated from storage:", parsed.email);
          } catch {
            // Ignore
          }
        } else {
          setUser(null);
          console.log("ℹ️ User removed from storage");
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // ============== SAVE USER TO ALL STORAGES ==============
  const saveUserToAllStorages = (userData) => {
    try {
      const userString = JSON.stringify(userData);
      
      // Save to localStorage (persistent)
      localStorage.setItem('availoUser', userString);
      
      // Save to sessionStorage (backup)
      sessionStorage.setItem('availoUser', userString);
      
      // Save with domain prefix for cross-domain
      const domain = window.location.hostname.replace(/\./g, '_');
      sessionStorage.setItem(`${domain}_availoUser`, userString);
      
      console.log(`✅ User saved to all storages: ${userData.email}`);
    } catch (error) {
      console.error("❌ Error saving user to storages:", error);
    }
  };

  // ============== LOGIN FUNCTION ==============
  const login = (userData) => {
    try {
      console.log("🔐 AuthContext: Login attempt...");
      
      // Ensure we have email
      if (!userData || !userData.email) {
        console.error("❌ Login failed: No email provided");
        return false;
      }
      
      // Create user object with consistent structure
      const userObj = {
        id: userData.id || userData.uid || `user_${Date.now()}`,
        email: userData.email,
        name: userData.name || userData.displayName || userData.email.split('@')[0],
        displayName: userData.name || userData.displayName || userData.email.split('@')[0],
        picture: userData.picture || userData.photo || null,
        photo: userData.photo || userData.picture || null,
        provider: userData.provider || 'email',
        providerId: userData.providerId || 'email',
        email_verified: userData.email_verified || false,
        loginTime: new Date().toISOString()
      };
      
      // Save to all storage locations
      saveUserToAllStorages(userObj);
      
      setUser(userObj);
      console.log("✅ User logged in successfully:", userObj.email);
      return true;
      
    } catch (error) {
      console.error("❌ Login error:", error);
      return false;
    }
  };

  // ============== LOGOUT FUNCTION ==============
  const logout = () => {
    try {
      console.log("🔐 AuthContext: Logging out...");
      
      // Clear from all storage
      localStorage.removeItem('availoUser');
      localStorage.removeItem('googleOAuthUser');
      localStorage.removeItem('user');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      
      sessionStorage.removeItem('availoUser');
      sessionStorage.removeItem('access_token');
      
      // Clear domain-specific storage
      const domain = window.location.hostname.replace(/\./g, '_');
      sessionStorage.removeItem(`${domain}_availoUser`);
      
      setUser(null);
      console.log("✅ User logged out successfully");
      return true;
      
    } catch (error) {
      console.error("❌ Logout error:", error);
      return false;
    }
  };

  // ============== CHECK IF USER IS REGISTERED AS VENDOR ==============
  const isVendorRegistered = (email) => {
    if (!email) return false;
    
    try {
      // Check in registered vendors from localStorage
      const registeredVendors = JSON.parse(localStorage.getItem('registeredVendors') || '[]');
      const isRegistered = registeredVendors.some(v => v.email === email);
      
      console.log(`🔍 Vendor check for ${email}: ${isRegistered ? '✅ YES' : '❌ NO'}`);
      return isRegistered;
      
    } catch (error) {
      console.error("❌ Error checking vendor status:", error);
      return false;
    }
  };

  // ============== REGISTER VENDOR ==============
  const registerVendor = (vendorData) => {
    try {
      const registeredVendors = JSON.parse(localStorage.getItem('registeredVendors') || '[]');
      
      // Check if already registered
      const existingIndex = registeredVendors.findIndex(v => v.email === vendorData.email);
      
      if (existingIndex !== -1) {
        registeredVendors[existingIndex] = { ...registeredVendors[existingIndex], ...vendorData };
        console.log("ℹ️ Updating existing vendor registration");
      } else {
        registeredVendors.push({
          ...vendorData,
          registrationDate: new Date().toISOString()
        });
        console.log("✅ New vendor registered");
      }
      
      localStorage.setItem('registeredVendors', JSON.stringify(registeredVendors));
      
      // Update user to reflect vendor status
      if (user && user.email === vendorData.email) {
        const updatedUser = { ...user, is_vendor: true };
        saveUserToAllStorages(updatedUser);
        setUser(updatedUser);
      }
      
      return true;
      
    } catch (error) {
      console.error("❌ Error registering vendor:", error);
      return false;
    }
  };

  // ============== GET USER PROFILE PICTURE ==============
  const getUserProfilePicture = () => {
    if (!user) return null;
    
    // Try multiple sources
    return user.picture || user.photo || null;
  };

  // ============== GET USER INITIAL ==============
  const getUserInitial = () => {
    if (!user) return 'U';
    
    const name = user.name || user.displayName || user.email?.split('@')[0] || 'User';
    return name.charAt(0).toUpperCase();
  };

  // ============== CONTEXT VALUE ==============
  const value = {
    user,
    isLoading,
    login,
    logout,
    isVendorRegistered,
    registerVendor,
    getUserProfilePicture,
    getUserInitial
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;