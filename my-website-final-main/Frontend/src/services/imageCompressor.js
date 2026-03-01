// src/services/imageCompressor.js
// ✅ COMPRESS IMAGES AUTOMATICALLY - MAKES ALL IMAGES SMALL (KB)

/**
 * Compress base64 image to reduce size
 * @param {string} base64String - The original base64 image
 * @param {number} maxWidth - Max width (default 600px)
 * @param {number} quality - Image quality 0-1 (default 0.7)
 * @returns {Promise<string>} - Compressed base64 image
 */
export const compressImage = async (base64String, maxWidth = 600, quality = 0.7) => {
  return new Promise((resolve, reject) => {
    try {
      // If it's not a base64 image or already small, return as is
      if (!base64String || !base64String.startsWith('data:image')) {
        resolve(base64String);
        return;
      }

      const img = new Image();
      img.src = base64String;
      
      img.onload = () => {
        // Calculate new dimensions
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
          height = Math.floor(height * (maxWidth / width));
          width = maxWidth;
        }
        
        // Create canvas and draw resized image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Get compressed base64
        const compressed = canvas.toDataURL('image/jpeg', quality);
        
        // Calculate size reduction
        const originalSize = Math.round((base64String.length * 3) / 4 / 1024);
        const newSize = Math.round((compressed.length * 3) / 4 / 1024);
        const reduction = ((originalSize - newSize) / originalSize * 100).toFixed(1);
        
        console.log(`📸 Image compressed: ${originalSize}KB → ${newSize}KB (${reduction}% smaller)`);
        
        resolve(compressed);
      };
      
      img.onerror = () => {
        console.warn('⚠️ Failed to load image for compression, using original');
        resolve(base64String);
      };
    } catch (error) {
      console.error('❌ Image compression error:', error);
      resolve(base64String); // Return original on error
    }
  });
};

/**
 * Compress multiple images at once
 * @param {Array} images - Array of base64 strings
 * @returns {Promise<Array>} - Array of compressed images
 */
export const compressImages = async (images) => {
  if (!images || !Array.isArray(images)) return images;
  
  console.log(`📸 Compressing ${images.length} images...`);
  
  const compressed = await Promise.all(
    images.map(img => compressImage(img))
  );
  
  return compressed;
};

/**
 * Get image size in KB
 * @param {string} base64String 
 * @returns {number} - Size in KB
 */
export const getImageSize = (base64String) => {
  if (!base64String) return 0;
  return Math.round((base64String.length * 3) / 4 / 1024);
};

/**
 * Check if image is too large (> 100KB)
 * @param {string} base64String 
 * @returns {boolean}
 */
export const isImageTooLarge = (base64String) => {
  const size = getImageSize(base64String);
  return size > 100; // 100KB threshold
};

export default {
  compressImage,
  compressImages,
  getImageSize,
  isImageTooLarge
};