import dotenv from "dotenv"
dotenv.config()
import { v2 as cloudinary } from "cloudinary"
import fs from "fs"

// Debug environment variables
console.log("🔍 Environment Check:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "NOT FOUND",
  api_key: process.env.CLOUDINARY_API_KEY || "NOT FOUND",
  api_secret: process.env.CLOUDINARY_API_SECRET ? "FOUND" : "NOT FOUND"
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      console.log("❌ No file path provided");
      return null;
    }

    console.log("📤 Uploading file:", localFilePath);
    console.log("🔍 File exists:", fs.existsSync(localFilePath));

    //upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto"
    })

    console.log("✅ Upload successful:", response.url);
    fs.unlinkSync(localFilePath)
    return response;

  } catch (error) {
    console.error("❌ Upload failed:", error.message);
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath)
    }
    return null;
  }
}

export { uploadOnCloudinary }