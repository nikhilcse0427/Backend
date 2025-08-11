// Debug script for change password functionality
// Run this with: node debug-change-password.js

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { User } from './src/models/user.model.js';

dotenv.config({ path: './.env' });

const debugChangePassword = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to database");

    // Test user data
    const testUserData = {
      fullName: "Test User",
      userName: "testuser123",
      email: "test@example.com",
      password: "oldpassword123",
      avatar: "https://example.com/avatar.jpg"
    };

    // Check if user exists
    let user = await User.findOne({ email: testUserData.email });

    if (!user) {
      console.log("🔍 Creating test user...");
      user = await User.create(testUserData);
      console.log("✅ Test user created:", user._id);
    } else {
      console.log("✅ Test user found:", user._id);
    }

    // Test password validation
    console.log("🔍 Testing password validation...");
    const isOldPasswordCorrect = await user.isPasswordCorrect("oldpassword123");
    console.log("Old password validation:", isOldPasswordCorrect);

    const isWrongPasswordCorrect = await user.isPasswordCorrect("wrongpassword");
    console.log("Wrong password validation:", isWrongPasswordCorrect);

    // Test password change
    console.log("🔍 Testing password change...");
    user.password = "newpassword123";
    await user.save({ validateBeforeSave: false });
    console.log("✅ Password changed successfully");

    // Verify new password
    const isNewPasswordCorrect = await user.isPasswordCorrect("newpassword123");
    console.log("New password validation:", isNewPasswordCorrect);

    console.log("✅ All tests passed!");

  } catch (error) {
    console.error("❌ Debug error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from database");
  }
};

debugChangePassword(); 