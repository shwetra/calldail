const adminService = require('../services/adminService');

exports.createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const admin = await adminService.createAdmin(name, email, password);
    res.status(201).json(admin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAdmins = async (req, res) => {
  try {
    const admins = await adminService.getAdmins();
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
