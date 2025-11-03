//Cloudinary SDK, v2 is current stable version
import { v2 as cloudinary } from 'cloudinary';
//Special storage engine for multer to directly upload to Cloudinary
import { CloudinaryStorage } from 'multer-storage-cloudinary';
//Middleware used by Node.js to handle form data, especially file uploads
import multer from 'multer';

//Used to load env, (doesnt work just importing in server.js)
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'characters',       
        allowed_formats: ['jpg', 'png', 'jpeg'],
    }
});

export const parser = multer({ storage });
