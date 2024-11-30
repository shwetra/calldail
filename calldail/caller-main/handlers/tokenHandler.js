import jwt from "jsonwebtoken";

import { ADMIN_SECRET, JWT_SECRET_EMAIL, JWT_SECRET_NUMBER, PASSWORD_RESET_SECRET } from "./envHandler.js";

// import User from "../models/userModel.js";
// import OTP from "../models/otpModel.js";
// import { adminUsername } from "../secret/admin.js";

export const generateEmailToken = (email, phoneNumber, name) => {
    const token = jwt.sign({ email, phoneNumber, name }, JWT_SECRET_EMAIL, {
        expiresIn: "30d",
    });
    return token;
};

export const generateNumberToken = (phoneNumber, deviceId) => {
    const token = jwt.sign({ phoneNumber, deviceId }, JWT_SECRET_NUMBER, { expiresIn: "30d", });
    return token;
}

export const generateResetToken = (email) => {
    const token = jwt.sign({ email }, PASSWORD_RESET_SECRET, { expiresIn: "30d" });
    return token;
}

// export const verifyNumberToken = async (req, res, next) => {
//     const bearerToken = req.headers['authorization'];
//     if (!bearerToken)
//         return res.status(401).json({ message: "No token found unauthorized access" });

//     const authToken = bearerToken.replace('Bearer ', '');

//     try {
//         const decoded = jwt.verify(authToken, JWT_SECRET_NUMBER);
//         const existingUser = await User.findOne({ phoneNumber: decoded.phoneNumber, deviceId: decoded.deviceId });
//         if (existingUser) {
//             req.user = decoded;
//             return next();
//         }
//         res.status(401).json({ message: "Invalid token" });
//     } catch (error) {
//         console.log("error in verifying number token", error);
//         return res.status(500).json({ message: "Error while fetching data try again later" });
//     }
// };

// export const verifySecurityToken = async (req, res, next) => {
//     const securityToken = req.headers['authorization'];
//     if (!securityToken) {
//         return res.status(401).json({ message: "No token found unauthorized access" });
//     }
//     const secureToken = securityToken.replace('Bearer ', '');

//     try {
//         const decoded = jwt.verify(secureToken, JWT_SECRET_EMAIL);
//         const existingUser = await OTP.findOne({ email: decoded.email, phoneNumber: decoded.phoneNumber, name: decoded.name });
//         if (existingUser) {
//             req.security = decoded;
//             return next();
//         }
//         res.status(401).json({ message: "Invalid token" });
//     } catch (error) {
//         console.log("error in verifying email token", error);
//         return res.status(500).json({ message: "Error while fetching data try again later" });
//     }
// };

// export const verifyResetToken = async (req, res, next) => {
//     const resetToken = req.headers['authorization'];
//     console.log(resetToken);
//     if (!resetToken) {
//         return res.status(401).json({ message: "No token found unauthorized access" });
//     }
//     // const passwordResetToken = resetToken.replace('Bearer ', '');

//     try {
//         const decoded = jwt.verify(resetToken, PASSWORD_RESET_SECRET);
//         const existingUser = await OTP.findOne({ email: decoded.email });
//         if (existingUser) {
//             req.resetSecurity = decoded;
//             return next();
//         }
//         res.status(400).json({ message: "Invalid token" });
//     } catch (error) {
//         console.log("error in verifying reset token", error);
//         return res.status(500).json({ message: "Internal server error" });
//     }
// }

// export const generateAdminToken = (username) => {
//     const token = jwt.sign({ username }, ADMIN_SECRET, {
//         expiresIn: "1d",
//     });
//     return token;
// }

// export const verifyAdmin = (req, res, next) => {
//     const token = req.headers['authorization'].split(' ')[1];
//     try {
//         const decoded = jwt.verify(token, ADMIN_SECRET);
//         if (!decoded || decoded.username !== adminUsername) {
//             console.log("Invalid token", token);
//             return res.status(401).json({ message: "Unauthorized access" });
//         }
//         req.admin = decoded;
//         next();
//     } catch (error) {
//         console.log("Error in verifying token", error);
//         return res.status(500).json({ message: "Internal server error" });
//     }
// };