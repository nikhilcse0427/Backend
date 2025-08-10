import { ApiError } from "../utils/ApiError";
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import { User } from "../models/user.model";

export const registerUser = async (req, res) => {
  // Steps to Register user
  // get user-detail from frontend
  // Validation -> not empty any required user-detail
  // check if username or email already exist
  // check for img and avatar
  // upload img, avatar on cloudinary
  // create user object and save it at db
  // remove password and refresh token from resoponse
  // check for user creation
  // return response

  const { fullName, email, password, userName } = req.body;

  if (
    [fullName, email, password, userName].some((field) => {
      return !field || field.trim() === "";
    })
  ) {
    throw new ApiError(400, "All fields are required");
  }
  const existedUser = User.findOne({
    $or: [{ email }, { userName }]
  })
  if (existedUser) {
    throw new ApiError(409, "User with useName or email already exist")
  }

  const AvatarlocalPath = req.files?.avatar[0]?.path
  const coverImagelocalPath = req.files?.coverImage[0]?.path

  if (!AvatarlocalPath) {
    throw new ApiError(400, "Avatar field is required")
  }
  const avatar = await uploadOnCloudinary(AvatarlocalPath)
  const coverImage = await uploadOnCloudinary(coverImagelocalPath)

  if(!avatar){
    throw new ApiError(400, "Avatar cloudinary url is required")
  }

  const user = await User.create({
    fullName,
    email,
    userName,
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url|| ""
  })

  const createdUser = await User.findById(user_id).select("-password -refreshToken")
  if(!createdUser){
    throw new ApiError(500, "Something went wrong while registering the user")
  }

  return res.status(201).json({
    user: createdUser,
    message: "user created successfully"
  })

}