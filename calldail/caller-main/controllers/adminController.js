import Admin from"../models/AdminModel.js";
import bcrypt from"bcrypt";
import jwt from"jsonwebtoken";
import nodemailer from"nodemailer";
import crypto from"crypto";

import { sendOTP } from "../genericOtp.js";
import Subadmin from "../Models/Subadmin.js";
import Caller from "../Models/Caller.js";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

// Admin Signup
// const adminSignup = async (req, res) => {
//   const { name, email, password } = req.body;

//   try {
//     // Check if admin already exists
//     const existingAdmin = await Admin.findOne({ email });
//     if (existingAdmin) {
//       return res.status(400).json({ message: "Admin already exists" });
//     }

//     // Validate password
//     if (!password) {
//       return res.status(400).json({ message: "Password is required" });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create admin document
//     const admin = new Admin({ name, email, password: hashedPassword });

//     // Save admin to database
//     await admin.save();

//     // Generate OTP
//     const otp = crypto.randomInt(100000, 999999).toString();

//     // Send OTP to the admin's email
//     await sendOTP(email, otp);

//     // Save the OTP in the database (consider setting an expiry time, like 10 minutes)
//     admin.otp = otp;
//     await admin.save();

//     res
//       .status(201)
//       .json({
//         message:
//           "Admin created successfully. Please check your email for OTP to verify.",
//       });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// Admin and SubAdmin Login
// const adminLogin = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     let user = await Admin.findOne({ email });
//     if (!user) {
//       user = await Subadmin.findOne({ email });
//       if (!user) {
//         return res.status(404).json({ message: "User not found" });
//       }
//     }

//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     // Generate JWT token (use the correct model ID - Admin or SubAdmin)
//     const token = jwt.sign(
//       { id: user._id, role: user.constructor.modelName },
//       JWT_SECRET,
//       { expiresIn: "30d" }
//     );

//     // Respond with token and user data
//     res.status(200).json({
//       message: "Login successful",
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.constructor.modelName,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };




const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check for User in Admin, Subadmin, and Caller models
    let user = await Admin.findOne({ email });
    if (!user) {
      user = await Subadmin.findOne({ email });
      if (!user) {
        user = await Caller.findOne({ email }); // Check for Caller if Admin or Subadmin are not found
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
      }
    }

    // Validate Password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token with the correct model role
    const token = jwt.sign(
      { id: user._id, role: user.constructor.modelName },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    // Respond with the token and user data
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.constructor.modelName,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export {
  
  adminLogin,
};
