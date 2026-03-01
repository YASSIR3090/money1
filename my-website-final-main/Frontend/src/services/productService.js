// src/services/productService.js
// ✅ PURE API MODE - HAKUNA LOCALSTORAGE!
// ✅ Data inatoka moja kwa moja kwenye backend

import apiClient from '../api/apiClient';
import { compressImages, isImageTooLarge } from './imageCompressor';

class ProductService {
  constructor() {
    this.listeners = [];
    this.cache = {
      allProducts: null,
      allProductsTime: null,
      sellerProducts: {}
    };
  }

  // ============== COMPRESS PRODUCT IMAGES ==============
  async compressProductImages(products) {
    if (!products || products.length === 0) return products;

    console.log('📸 Checking product images for compression...');

    const compressedProducts = await Promise.all(
      products.map(async (product) => {
        // Skip if no images
        if (!product.productImages || product.productImages.length === 0) {
          return product;
        }

        // Check if any image is too large
        const needsCompression = product.productImages.some(img =>
          img && typeof img === 'string' && img.startsWith('data:image') && isImageTooLarge(img)
        );

        if (needsCompression) {
          console.log(`📸 Compressing images for product: ${product.productName || product.product_name}`);
          const compressedImages = await compressImages(product.productImages);
          return { ...product, productImages: compressedImages };
        }

        return product;
      })
    );
    return compressedProducts;
  }
  
  // ============== GET ALL PRODUCTS ==============
  async getAllProducts(forceRefresh = false) {
    console.log('📦 ProductService: Fetching from API...');
    
    // Optional: Tumia memory cache tu kwa muda mfupi sana
    if (!forceRefresh && this.cache.allProducts) {
      const age = Date.now() - this.cache.allProductsTime;
      if (age < 5000) { // 5 seconds only!
        console.log(`📦 Using memory cache (${Math.round(age/1000)}s old)`);
        return this.cache.allProducts;
      }
    }
    
    // Fetch from API
    try {
      console.log('📡 Fetching all products from API...');
      const response = await apiClient.get('/api/products/');
      
      let products = [];
      if (response.data?.results) {
        products = response.data.results;
      } else if (Array.isArray(response.data)) {
        products = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        products = response.data.data;
      }
      
      // Ensure every product has email (CRITICAL FOR SELLER FILTERING!)
      products = products.map(p => ({
        ...p,
        // Normalize email field
        email: p.email || p.seller_email || p.sellerEmail || 'unknown@email.com',
        // Ensure consistent field names
        productName: p.product_name || p.productName || 'Unnamed Product',
        shopName: p.shop_name || p.shopName || 'Shop',
        productImages: p.product_images || p.productImages || [],
        price: p.price || 0,
        registrationDate: p.registration_date || p.registrationDate || p.created_at || new Date().toISOString()
      }));
      
      // 🔥 COMPRESS ALL PRODUCT IMAGES
      const compressedProducts = await this.compressProductImages(products);
      
      console.log(`✅ Fetched and compressed ${compressedProducts.length} products from API`);
      
      // Update caches
      this.cache.allProducts = compressedProducts;
      this.cache.allProductsTime = Date.now();
      
      return compressedProducts;
      
    } catch (error) {
      console.error('❌ Error fetching products:', error);
      
      // Return whatever we have in cache as fallback
      if (this.cache.allProducts) {
        console.log('⚠️ Returning cached products due to API error');
        return this.cache.allProducts;
      }
      
      return [];
    }
  }
  
  // ============== GET PRODUCTS BY EMAIL (SELLER'S PRODUCTS) ==============
  async getProductsByEmail(email, forceRefresh = false) {
    if (!email) return [];
    
    const normalizedEmail = email.toLowerCase().trim();
    console.log(`📦 Fetching products for ${normalizedEmail}...`);
    
    // Check memory cache (5 seconds only)
    if (!forceRefresh) {
      const cached = this.cache.sellerProducts[normalizedEmail];
      if (cached && cached.time) {
        const age = Date.now() - cached.time;
        if (age < 5000) { // 5 seconds
          return cached.data;
        }
      }
    }
    
    // Try API first
    try {
      console.log(`📡 Fetching products for ${normalizedEmail} from API...`);
      const response = await apiClient.get(`/api/products/seller/${encodeURIComponent(normalizedEmail)}/`);
      
      let products = [];
      if (response.data?.products) {
        products = response.data.products;
      } else if (response.data?.results) {
        products = response.data.results;
      } else if (Array.isArray(response.data)) {
        products = response.data;
      }
      
      console.log(`✅ Found ${products.length} products for ${normalizedEmail} from API`);
      
      // Cache the results
      this.cache.sellerProducts[normalizedEmail] = {
        data: products,
        time: Date.now()
      };
      
      return products;
      
    } catch (error) {
      console.error(`❌ Error fetching products for ${normalizedEmail}:`, error);
      return [];
    }
  }
  
  // ============== GET SINGLE PRODUCT BY ID ==============
  async getProductById(productId) {
    if (!productId) return null;
    
    try {
      console.log(`📡 Fetching product ${productId} from API...`);
      const response = await apiClient.get(`/api/products/${productId}/`);
      return response.data;
      
      if (response.data) {
        console.log(`✅ Found product via API: ${response.data.productName || response.data.product_name}`);
        return response.data;
      }
    } catch (error) {
      console.error(`❌ Error fetching product ${productId}:`, error);
    }
    
    return null;
  }
  
  // ============== CREATE/UPDATE PRODUCT ==============
  async saveProduct(productData, isEdit = false, productId = null) {
    try {
      let response;
      
      if (isEdit && productId) {
        console.log(`📡 Updating product ${productId}...`);
        response = await apiClient.put(`/api/products/${productId}/`, productData);
      } else {
        console.log('📡 Creating new product...');
        response = await apiClient.post('/api/products/', productData);
      }
      
      // Clear memory caches after successful save
      this.clearCaches(productData.email);
      
      // Notify listeners
      this.notifyChange(isEdit ? 'update' : 'create', response.data);
      
      return { success: true, data: response.data };
      
    } catch (error) {
      console.error('❌ Error saving product:', error);
      return { success: false, error };
    }
  }
  
  // ============== DELETE PRODUCT ==============
  async deleteProduct(productId, sellerEmail) {
    try {
      console.log(`🗑️ Deleting product ${productId}...`);
      await apiClient.delete(`/api/products/${productId}/`);
      
      // Clear memory caches
      this.clearCaches(sellerEmail);
      
      // Notify listeners
      this.notifyChange('delete', { id: productId, email: sellerEmail });
      
      return { success: true };
      
    } catch (error) {
      console.error('❌ Error deleting product:', error);
      return { success: false, error };
    }
  }
  
  // ============== CLEAR CACHES ==============
  clearCaches(sellerEmail = null) {
    // Clear memory caches only
    this.cache.allProducts = null;
    this.cache.allProductsTime = null;
    
    if (sellerEmail) {
      delete this.cache.sellerProducts[sellerEmail.toLowerCase()];
    } else {
      this.cache.sellerProducts = {};
    }
    
    console.log('🧹 Memory caches cleared');
  }
  
  // ============== LISTENER SYSTEM ==============
  addListener(callback) {
    this.listeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }
  
  notifyChange(action, product) {
    console.log(`📢 Notifying ${this.listeners.length} listeners of ${action}`, product);
    this.listeners.forEach(cb => {
      try {
        cb({ action, product });
      } catch (e) {
        console.error('Error in listener:', e);
      }
    });
  }
}

export default new ProductService();