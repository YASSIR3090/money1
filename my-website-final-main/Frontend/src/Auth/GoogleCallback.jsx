// src/Auth/GoogleCallback.jsx - DIRECT REDIRECT VERSION 🔥
// ✅ HAKUNA PAGE YA "KARIBU AVAILO"!
// ✅ REDIRECTS MOJA KWA MOJA KWA VENDORREGISTER

import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import apiClient from "../api/apiClient";

function GoogleCallback() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Prevent double processing
    if (hasProcessed.current) {
      return;
    }
    hasProcessed.current = true;

    const handleGoogleCallback = async () => {
      try {
        console.log("🔐 ===== GOOGLE CALLBACK STARTED =====");
        
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const accessToken = params.get('access_token');
        
        if (!accessToken) {
          console.error("❌ No access token found");
          navigate('/vendor-login?error=no_token');
          return;
        }

        console.log("✅ Google access token received");

        // Send token to backend
        const response = await apiClient.post('/api/auth/google/', {
          access_token: accessToken
        });

        console.log("✅ Backend response:", response.data);

        if (response.data && response.data.user) {
          // Save user to AuthContext
          login(response.data.user);
          
          // Clean URL
          window.history.replaceState({}, document.title, '/auth/google/callback');
          
          // 🔥 REDIRECT MOJA KWA MOJA - HAKUNA PAGE YA KUSUBIRI!
          console.log("✅ Redirecting directly to vendor registration...");
          navigate('/vendor-register', { 
            state: { 
              user: response.data.user,
              action: "register-vendor" 
            } 
          });
        } else {
          throw new Error("Invalid response from backend");
        }

      } catch (error) {
        console.error("❌ Google callback error:", error);
        navigate('/vendor-login?error=auth_failed');
      }
    };

    handleGoogleCallback();
  }, [navigate, login]);

  // 🔥 RETURN NULL - HAKUNA PAGE INAYOONEKANA!
  return null;
}

export default GoogleCallback;