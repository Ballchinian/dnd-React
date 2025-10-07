import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';


cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY ? "✔️ loaded" : "❌ missing",
  api_secret: process.env.CLOUDINARY_API_SECRET ? "✔️ loaded" : "❌ missing",
});

//Storage configuration
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'characters',       //folder in Cloudinary
    allowed_formats: ['jpg', 'png'],
  }
});

export const parser = multer({ storage });
