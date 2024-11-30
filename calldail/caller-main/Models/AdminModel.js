import mongoose from'mongoose';

const AdminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  otp: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    // required: true,
  },
  subAdmins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SubAdmin' }],
});

const Admin = mongoose.model('Admin', AdminSchema);

export default Admin;