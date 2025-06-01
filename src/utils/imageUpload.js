import { supabase } from '@/lib/supabaseClient';
import { v4 as uuidv4 } from 'uuid';

/**
 * Upload an image to Supabase Storage
 * @param {File} file - The file to upload
 * @param {string} bucket - The storage bucket name (default: 'vehicle-images')
 * @returns {Promise<string>} - The public URL of the uploaded image
 */
export const uploadImage = async (file, bucket = 'vehicle-images') => {
  try {
    // Create a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${fileName}`;
    
    // Upload the file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
      
    if (error) throw error;
    
    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);
      
    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

/**
 * Upload multiple images to Supabase Storage
 * @param {File[]} files - Array of files to upload
 * @param {string} bucket - The storage bucket name (default: 'vehicle-images')
 * @returns {Promise<string[]>} - Array of public URLs of the uploaded images
 */
export const uploadMultipleImages = async (files, bucket = 'vehicle-images') => {
  try {
    // Upload each file and collect the URLs
    const uploadPromises = Array.from(files).map(file => uploadImage(file, bucket));
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Error uploading multiple images:', error);
    throw error;
  }
};
