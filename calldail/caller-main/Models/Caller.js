// models/CallerSchema.modal.js
import mongoose from 'mongoose';

const CallerSchema = new mongoose.Schema({
  subAdminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubAdmin',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  assignedData: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Data' }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Caller', CallerSchema);