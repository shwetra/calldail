import mongoose from 'mongoose';

const DataSchema = new mongoose.Schema({
  data: { type: Array, required: true },  // Store the file data
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to Admin/SubAdmin
});

const Data = mongoose.model('Data', DataSchema);
export default Data;
