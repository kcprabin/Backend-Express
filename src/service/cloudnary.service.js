import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import dotenv from "dotenv";

dotenv.config({
  path:"./.env"
})

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME?.trim(),
  api_key: process.env.CLOUDINARY_API_KEY?.trim(),
  api_secret: process.env.CLOUDINARY_API_SECRET?.trim(),
  secure: true,
});

export async function uploadToCloudinary(filePath) {
  if (!filePath) return null;

  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: 'auto', 
     
    });

    // Optionally delete local file after upload
    fs.unlink(filePath, (err) => {
      if (err) console.log('Failed to delete local file:', err);
    });

    console.log('Cloudinary Upload Success:', result.secure_url);
    return result;
  } catch (error) {
    console.error('Cloudinary Upload Error:', error.message);
    return null;
  }
}
