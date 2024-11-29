const Admin = require('../models/Admin');

exports.createAdmin = async (name, email, password) => {
  const admin = new Admin({ name, email, password });
  return await admin.save();
};

exports.getAdmins = async () => {
  return await Admin.find(); 
};
