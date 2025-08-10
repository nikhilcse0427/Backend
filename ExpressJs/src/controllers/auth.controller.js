import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";

export const registerUser = async (req, res, next) => {
  try {
    const { fullName, userName, email, password } = req.body;

    // Validation for empty fields
    if ([fullName, userName, email, password].some(field => !field || field.trim() === "")) {
      throw new ApiError(400, "All fields are required");
    }

    // Check if username or email already exists
    const existedUser = await User.findOne({
      $or: [{ email }, { userName }]
    });

    if (existedUser) {
      throw new ApiError(409, "User with username or email already exists");
    }

    // File paths
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    if (!avatarLocalPath) {
      throw new ApiError(400, "Avatar field is required");
    }

    // Upload to Cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    console.log("Avatar: ", avatar)

    let coverImage = null;
    if (coverImageLocalPath) {
      coverImage = await uploadOnCloudinary(coverImageLocalPath);
    }
    console.log("Cover Image: ", coverImage)

    if (!avatar) {
      throw new ApiError(400, "Avatar upload failed");
    }

    // Create user in DB
    const user = await User.create({
      fullName,
      userName,
      email,
      password,
      avatar: avatar.url,
      coverImage: coverImage?.url || ""
    });

    // Fetch created user without sensitive info
    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
      throw new ApiError(500, "Something went wrong while registering the user");
    }

    // Response
    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: createdUser
    });

  } catch (error) {
    next(error); // Use global error handler
  }
};
