const subAdminService = require('../services/subAdminService');

exports.createSubAdmin = async (req, res) => {
  try {
    const { name, email, password, adminId } = req.body; // Assuming `adminId` links this SubAdmin to an Admin
    const subAdmin = await subAdminService.createSubAdmin(name, email, password, adminId);
    res.status(201).json(subAdmin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSubAdmins = async (req, res) => {
  try {
    const subAdmins = await subAdminService.getSubAdmins();
    res.status(200).json(subAdmins);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSubAdminById = async (req, res) => {
  try {
    const { id } = req.params;
    const subAdmin = await subAdminService.getSubAdminById(id);
    if (!subAdmin) {
      return res.status(404).json({ error: 'SubAdmin not found' });
    }
    res.status(200).json(subAdmin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.assignContentToMembers = async (req, res) => {
  try {
    const { subAdminId, contentDetails } = req.body; // Assuming contentDetails is an array of items
    const result = await subAdminService.assignContentToMembers(subAdminId, contentDetails);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
