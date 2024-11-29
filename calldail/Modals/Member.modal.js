// models/CallerSchema.modal.js
const mongoose = require('mongoose');

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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Caller', CallerSchema);
