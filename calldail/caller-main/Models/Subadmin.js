import mongoose from 'mongoose';

const subAdminSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  callers: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Caller' },
      name: { type: String },
      phoneNumber: { type: String },
      email: { type: String },
    },
  ],
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'SubAdmin', default: null },
}, { timestamps: true });

export default mongoose.model('SubAdmin', subAdminSchema);