import { supabase } from '@/lib/supabaseClient';
import { v4 as uuidv4 } from 'uuid';

/**
 * Upload multiple vehicle images to Supabase Storage
 * @param {File[]} imageFiles - Array of image files to upload
 * @param {string} userId - User ID for organizing uploads
 * @returns {Promise<string[]>} - Array of URLs for the uploaded images
 */
export const uploadVehicleImages = async (imageFiles, userId) => {
  if (!imageFiles || imageFiles.length === 0) return [];
  
  const uploadPromises = imageFiles.map(async (file) => {
    // Create a unique file name to prevent collisions
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${uuidv4()}.${fileExt}`;
    const filePath = `${fileName}`;
    
    // Upload the file to the vehicle_photos bucket
    const { data, error } = await supabase.storage
      .from('vehicle_photos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
    
    // Get the public URL for the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from('vehicle_photos')
      .getPublicUrl(filePath);
    
    return publicUrl;
  });
  
  // Wait for all uploads to complete
  return Promise.all(uploadPromises);
};

/**
 * Upload multiple vehicle documents to Supabase Storage
 * @param {File[]} documentFiles - Array of document files to upload
 * @param {string} userId - User ID for organizing uploads
 * @returns {Promise<string[]>} - Array of URLs for the uploaded documents
 */
export const uploadVehicleDocuments = async (documentFiles, userId) => {
  if (!documentFiles || documentFiles.length === 0) return [];
  
  const uploadPromises = documentFiles.map(async (file) => {
    // Create a unique file name to prevent collisions
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${uuidv4()}.${fileExt}`;
    const filePath = `${fileName}`;
    
    // Upload the file to the vehicle_documents bucket
    const { data, error } = await supabase.storage
      .from('vehicle_documents')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
    
    // Get the URL for the uploaded file (not public)
    const { data: { signedUrl } } = await supabase.storage
      .from('vehicle_documents')
      .createSignedUrl(filePath, 60 * 60 * 24 * 7); // 7 days expiry
    
    return {
      path: filePath,
      url: signedUrl
    };
  });
  
  // Wait for all uploads to complete
  return Promise.all(uploadPromises);
};

/**
 * Delete vehicle images from Supabase Storage
 * @param {string[]} imagePaths - Array of image paths to delete
 * @returns {Promise<void>}
 */
export const deleteVehicleImages = async (imagePaths) => {
  if (!imagePaths || imagePaths.length === 0) return;
  
  const { data, error } = await supabase.storage
    .from('vehicle_photos')
    .remove(imagePaths);
  
  if (error) {
    console.error('Error deleting images:', error);
    throw error;
  }
  
  return data;
};

/**
 * Delete vehicle documents from Supabase Storage
 * @param {string[]} documentPaths - Array of document paths to delete
 * @returns {Promise<void>}
 */
export const deleteVehicleDocuments = async (documentPaths) => {
  if (!documentPaths || documentPaths.length === 0) return;
  
  const { data, error } = await supabase.storage
    .from('vehicle_documents')
    .remove(documentPaths);
  
  if (error) {
    console.error('Error deleting documents:', error);
    throw error;
  }
  
  return data;
};
