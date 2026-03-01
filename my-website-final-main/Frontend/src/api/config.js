// API Configuration
const API_BASE_URL = 'https://availo-backend-1.onrender.com/api';

export const API_ENDPOINTS = {
    // Auth endpoints
    AUTH_REGISTER: `${API_BASE_URL}/auth/register/`,
    AUTH_GOOGLE: `${API_BASE_URL}/auth/google/`,
    AUTH_LOGIN: `${API_BASE_URL}/auth/login/`,
    AUTH_ME: `${API_BASE_URL}/auth/me/`,
    AUTH_VENDOR_REGISTER: `${API_BASE_URL}/auth/vendor/register/`,
    AUTH_VENDOR_CHECK: `${API_BASE_URL}/auth/vendor/check/`,
    
    // Products endpoints
    PRODUCTS_LIST: `${API_BASE_URL}/products/`,
    PRODUCTS_SEARCH: `${API_BASE_URL}/products/search/`,
    PRODUCTS_BY_SELLER: (email) => `${API_BASE_URL}/products/seller/${email}/`,
    PRODUCTS_BY_CATEGORY: (category) => `${API_BASE_URL}/products/category/${category}/`,
    PRODUCT_DETAIL: (id) => `${API_BASE_URL}/products/${id}/`,
    
    // Shops endpoints
    SHOPS_LIST: `${API_BASE_URL}/shops/`,
    SHOPS_SEARCH: `${API_BASE_URL}/shops/search/`,
    SHOPS_BY_REGION: (region) => `${API_BASE_URL}/shops/region/${region}/`,
    SHOP_DETAIL: (id) => `${API_BASE_URL}/shops/${id}/`,
    
    // Ads endpoints
    ADS_LIST: `${API_BASE_URL}/ads/`,
    ADS_ACTIVE: `${API_BASE_URL}/ads/active/`,
    AD_DETAIL: (id) => `${API_BASE_URL}/ads/${id}/`,
    AD_TOGGLE: (id) => `${API_BASE_URL}/ads/${id}/toggle/`,
    
    // Messages endpoints
    MESSAGES_LIST: `${API_BASE_URL}/messages/`,
    MESSAGE_DETAIL: (id) => `${API_BASE_URL}/messages/${id}/`,
    MESSAGE_REPLY: (id) => `${API_BASE_URL}/messages/${id}/reply/`,
    MESSAGE_READ: (id) => `${API_BASE_URL}/messages/${id}/read/`,
};

export default API_BASE_URL;