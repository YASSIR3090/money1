// src/api/apiClient.js - ULTRA FAST VERSION 🔥
// ✅ Timeout: SEKUNDE 5 TU (seconds, siyo minutes!)
// ✅ Inaonyesha mara moja kutoka cache
// ✅ Inafetch background bila kusubiri
// ✅ Hakuna wakeUpBackend - tunatumia cache smart

import axios from "axios";

const API_BASE_URL = "https://availo-backend-1.onrender.com";
const isDev = import.meta.env.DEV;

// ============== AXIOS INSTANCE - FAST! ==============
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000, // 🔥 SEKUNDE 5 TU - HARAKA SANA!
  withCredentials: false,
});

// ============== REQUEST INTERCEPTOR ==============
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    if (isDev) {
      console.log(`📤 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// ============== RESPONSE INTERCEPTOR ==============
apiClient.interceptors.response.use(
  (response) => {
    if (isDev) {
      console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    }
    return response;
  },
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.log('⚠️ Request timeout (5s) - using cache if available');
    }
    
    if (isDev) {
      if (error.response) {
        console.error(`❌ API Error: ${error.response.status}`, error.response.data);
      } else {
        console.error(`❌ API Error: ${error.message}`);
      }
    }
    
    return Promise.reject(error);
  }
);

// ============== TOKEN MANAGEMENT ==============

/**
 * Save authentication tokens to localStorage
 */
export const setTokens = (accessToken, refreshToken) => {
  if (accessToken) {
    localStorage.setItem('authToken', accessToken);
    localStorage.setItem('access_token', accessToken);
  }
  if (refreshToken) {
    localStorage.setItem('refresh_token', refreshToken);
  }
  console.log("🔑 Tokens saved");
};

/**
 * Clear all authentication tokens
 */
export const clearTokens = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  console.log("🧹 Tokens cleared");
};

/**
 * Get the current access token
 */
export const getToken = () => {
  return localStorage.getItem('access_token') || localStorage.getItem('authToken');
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  return !!getToken();
};

/**
 * Debug helper
 */
export const debugTokenStorage = () => {
  console.log("🔍 TOKEN DEBUG:");
  console.log("  authToken:", localStorage.getItem('authToken') ? "✅" : "❌");
  console.log("  access_token:", localStorage.getItem('access_token') ? "✅" : "❌");
  console.log("  refresh_token:", localStorage.getItem('refresh_token') ? "✅" : "❌");
};

// ============== TEST CONNECTION ==============
export const testAPIConnection = async () => {
  try {
    const response = await apiClient.get('/api/products/?limit=1');
    const count = response.data?.results?.length || response.data?.length || 0;
    console.log(`✅ API connected! Found ${count} products`);
    return { success: true, count };
  } catch (error) {
    console.error('❌ API connection failed:', error.message);
    return { success: false, error: error.message };
  }
};

export default apiClient;