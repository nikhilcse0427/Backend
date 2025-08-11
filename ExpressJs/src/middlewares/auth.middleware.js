import { ApiError } from "../utils/ApiError.js"
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"

export const verifyJWT = async (req, _, next) => {
  try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    console.log("🔍 Token from request:", token ? "FOUND" : "NOT FOUND")
    console.log("🔍 Cookies:", req.cookies)

    if (!token) {
      throw new ApiError(401, "Unauthorized request")
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    console.log("🔍 Decoded token:", decodedToken?._id)

    const user = await User.findById(decodedToken?._id).select("-password, -refreshToken")

    if (!user) {
      // Todo discuss about frontend
      throw new ApiError(401, "Invalid access token")
    }

    console.log("🔍 User found in middleware:", user._id)
    req.user = user
    next()

  } catch (error) {
    console.error("❌ Auth middleware error:", error)
    next(error) // Use global error handler instead of throwing
  }
}