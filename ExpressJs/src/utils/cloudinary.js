import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'
cloudinary.config({
  cloud_name:process.env.CLOUD_NAME,
  api_key:process.env.API_KEY,
  api_secret:process.env.API_SECRET
})

// cloudinary.v2.uploader.unsigned_upload(file, upload_preset, options).then(callback);

const uploadOnCloudinary = async (localFilePath) => {
  try{
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: auto,
    })
    console.log("File uploaded on cloudinary successfully", response.url)
    return response
  }catch(error){
    fs.unlinkSync(localFilePath)
    //remove the locally saved temp files as upload get failed
    return null
  }
}

export {uploadOnCloudinary}