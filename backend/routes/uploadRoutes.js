import express from "express";
import multer from "multer";
import { v2 as cloudinaryV2 } from "cloudinary";

//Require and configure dotenv in this level (server.js doesnt have access to .env variables otherwise)
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

//Configure Cloudinary
cloudinaryV2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});



const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/upload-image", upload.single("file"), async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fileStr = req.file.buffer.toString("base64");

    const result = await cloudinaryV2.uploader.upload(
      `data:${req.file.mimetype};base64,${fileStr}`
    );

  

    res.json({ url: result.secure_url });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Failed to upload image" });
  }
});


export default router;
