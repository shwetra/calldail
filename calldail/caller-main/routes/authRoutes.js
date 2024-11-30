import express from 'express';
import bcrypt from "bcrypt";
import multer from 'multer';

import { generateNumberToken, generateEmailToken, generateResetToken } from '../handlers/tokenHandler.js';
import { validateConfirmPassword, validateEmail, validateName, validatePassword, validatePhoneNumber } from '../utils/validateInput.js';
// import { SALT_ROUNDS } from '../handlers/envHandler.js';
import { UPLOAD_FOLDER, PROFILE_PHOTO_FOLDER } from '../handlers/envHandler.js';
import { log } from '../utils/log.js';

// import User from '../models/userModel.js';
import { sendOTP } from '../genericOtp.js';
// import OTP from '../Models/otpModel.js';
import Admin from '../models/AdminModel.js';
import { adminLogin } from '../controllers/adminController.js';

const router = express.Router();

const profilePhotoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${UPLOAD_FOLDER}/${PROFILE_PHOTO_FOLDER}`);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const imageFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/octet-stream'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const profilePhotoUpload = multer({
  storage: profilePhotoStorage,
  fileFilter: imageFilter,
});

// router.post('/password-reset-otp', async (req, res) => {
//   try {
//     log(req, "");
//     const { email } = req.body;

//     if (!email || !validateEmail(email)) {
//       log(req, "Invalid email");
//       return res.status(400).json({ message: "Invalid email" });
//     }

//     const user = await User.findOne({ email });

//     if (!user) {
//       log(req, "User doesn't exists");
//       return res.status(400).json({ message: "User with this email doesn't exists" });
//     }

//     const otp = await OTP.findOne({ email });
//     const rand = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');

//     otp.otp = rand;
//     otp.expiresAt = Date.now() + 5 * 60 * 1000;

//     await otp.save();
//     sendOTP(email, rand);
//     res.status(200).json({ message: "Proceed" });
//   } catch (error) {
//     log(req, `Error occured ${error}`);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

// router.post('/verify-reset-otp', async (req, res) => {
//   const date = Date.now();
//   try {
//     const { email, otp } = req.body;

//     const user = await OTP.findOne({ email, otp });
//     if (!user) {
//       log(req, `OTP: ${otp} for ${email}, doesn't exists`);
//       return res.status(400).json({ message: "OTP for the email doesn't exists" });
//     }

//     if (user.expiresAt < date) {
//       log(req, `${email} OTP expired`);
//       return res.status(400).json({ message: "OTP expired" });
//     }

//     const token = generateResetToken(email);

//     // log(req, "OTP verified");
//     console.log(token);
//     res.set('Authorization', token);
//     res.status(200).json({ message: "proceed" });

//   } catch (error) {
//     log(req, `error in verifying password reset OTP ${error}`);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// });

router.post('/generate-otp', async (req, res) => {
  try {

    // console.log(req.body);
    log(req, "");
    const { name, email, phoneNumber } = req.body;

    if (!email || !phoneNumber || !name) {
      log(req, "All fields are not entered");
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!validateEmail(email) || !validatePhoneNumber(phoneNumber) || !validateName(name)) {
      log(req, "Invalid field values");
      return res.status(400).json({ message: "Invalid entries" });
    }

    // if (!(email && validateEmail(email)))
    //   return res.status(400).json({ message: "Invalid email" });

    const rand = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');

    let existingUser = await Admin.findOne({ $or: [{ email }, { phoneNumber }] });

    if (existingUser && existingUser.password) {
        return res.status(400).json({message: "Email or phone already exists"});
    }

    if(!existingUser) {
      existingUser = new Admin({email, phoneNumber, name, otp: rand, expiresAt: Date.now() + 5*60*1000})
    } else {
      existingUser.name = name;
      existingUser.email = email;
      existingUser.phoneNumber = phoneNumber;
      existingUser.otp = rand;
      existingUser.expiresAt = Date.now() + 5*60*1000;
    }
    // let otp;
    // console.log(existingUser);


    await existingUser.save();
    sendOTP(email, rand);
    log(req, "OTP sent successfully");
    res.status(201).json({ message: "Proceed" });
  } catch (error) {
    console.log("Error in otp", error, req.body);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post('/verify-otp', async (req, res) => {
  try {
    const date = Date.now();
    log(req, "");
    const { email, phoneNumber, name, password, confirmPassword, otp } = req.body;

    if (!email || !phoneNumber || !name || !password || !confirmPassword) {
      log(req, "All fields are not entered");
      return res.status(400).json({ message: "All fields are required" });
    }

    // if (!(email && validateEmail(email) && otp && otp.length === 6)) {
    //   return res.status(400).json({ message: "Invalid entries" });
    // }

    if (!validateEmail(email) || !validatePhoneNumber(phoneNumber) || !validateName(name) || !validatePassword(password) || !validateConfirmPassword(password, confirmPassword)) {
      log(req, "Invalid field values");
      return res.status(400).json({ message: "Invalid field values" });
    }

    let user = await Admin.findOne({ email, phoneNumber, otp });
    if (!user) {
      return res.status(400).json({ message: "Invalid otp" });
    }

    if (user.expiresAt < date) {
      return res.status(400).json({ message: "OTP expired" });
    }

    if(user.password) {
      return res.status(400).json({message: "Already registered"});
    }

    user.password = await bcrypt.hash(password, 15);
    await user.save();
    const token = generateNumberToken(phoneNumber, '1234567890');

    res.set('Authorization', `Bearer ${token}`);
    res.status(201).json({ message: "verified", token });
  } catch (error) {
    console.log("Error in verifying otp", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// router.post('/sign-up', verifySecurityToken, profilePhotoUpload.single('profilePhoto'), async (req, res) => {
//   const { password, confirmPassword, deviceId } = req.body;
//   console.log(req.body);
//   if (!password || !confirmPassword || !req.file || !deviceId)
//     return res.status(400).json({ message: "All fields are required" });

//   if (!validatePassword(password) || !validateConfirmPassword(password, confirmPassword))
//     return res.status(400).json({ message: "Invalid field value" });

//   try {
//     const user = await User.findOne({ $or: [{ email: req.security.email }, { phoneNumber: req.security.phoneNumber }] });
//     if (user) {
//       console.log(`Sign up ${phoneNumber} already exists`);
//       return res.status(400).json({ message: "Account is already created by this number" });
//     }

//     bcrypt.hash(password, parseInt(SALT_ROUNDS), async (error, hashedPassword) => {
//       if (error) {
//         console.log("Error in hashing", error);
//         return res.status(500).json({ message: "Internal server try again later" });
//       }

//       console.log(hashedPassword);
//       const newUser = new User({ name: req.security.name, email: req.security.email, phoneNumber: req.security.phoneNumber, password: hashedPassword, profilePhotoPath: req.file.filename, deviceId });

//       await newUser.save();

//       const token = generateNumberToken(req.security.phoneNumber, deviceId);

//       console.log(token);
//       res.set('Authorization', `Bearer ${token}`);
//       res.status(201).json({ message: "Account created successfully" });
//       console.log("success");
//     });
//   } catch (error) {
//     console.log("error while sign up", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }

// });
// router.post('/login', async (req, res) => {
//   const { phoneNumber, password, deviceId } = req.body;
//   console.log(req.body);
//   if (!phoneNumber || !password || !deviceId)
//     return res.status(400).json({ message: "All fields are required" });

//   if (!validatePhoneNumber(phoneNumber) || !validatePassword(password))
//     return res.status(400).json({ message: "Invalid field value" });

//   try {
//     const user = await User.findOne({ phoneNumber });
//     if (!user)
//       return res.status(400).json({ message: "Invalid credentials" });

//     bcrypt.compare(password, user.password, async (error, isMatch) => {
//       if (error) {
//         console.log("Error in hashing", error);
//         return res.status(500).json({ message: "Internal server error try again later" });
//       }

//       if (!isMatch)
//         return res.status(400).json({ message: "Invalid credentials" });

//       const token = generateNumberToken(user.phoneNumber, deviceId);
//       user.deviceId = deviceId;
//       await user.save();

//       console.log("success");
//       res.set('Authorization', `Bearer ${token}`);
//       res.status(201).json({ message: "Login successful" });
//     });
//   } catch (error) {
//     console.log("Error while login", error);
//     res.status(500).json({ message: "Internal server error try again later" });
//   }
// });

// router.post('/reset-password', verifyResetToken, async (req, res) => {
//   try {
//     console.log(req.body);
//     const { password } = req.body;
//     if (!password || !validatePassword(password)) {
//       console.log(req.body);
//       return res.status(400).json({ message: "Invalid password" });
//     }
//     const user = await User.findOne({ email: req.resetSecurity.email });
//     if (!user) {
//       console.log(req.security);
//       return res.status(400).json({ message: "User not found" });
//     }

//     const hashedPassword = await bcrypt.hash(password, parseInt(SALT_ROUNDS));

//     user.password = hashedPassword;

//     await user.save();
//     res.status(200).json({ message: "Password changed successfully" });
//   } catch (error) {
//     console.log("error", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

// router.get('/check-token', verifyNumberToken, (req, res) => {
//   res.status(200).json({ message: "Verified", authenticated: true });
// });

router.post('/login', adminLogin);

export default router;
