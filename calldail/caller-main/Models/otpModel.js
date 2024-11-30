import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true, unique: true, },
    name: { type: String, required: true, unique: true, },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true },
}, { timestamps: true });

const OTP = mongoose.model('OTP', otpSchema);

export default OTP;
