const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

mongoose.set('strictQuery', true);

const url = process.env.MONGO_URI;

const dbConnect = async () => {
  try {
    await mongoose.connect(url);
    console.log('Connected to MongoDB successfully!');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = dbConnect;
