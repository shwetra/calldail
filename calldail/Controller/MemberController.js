const memberService = require('../services/memberService');

exports.createMember = async (req, res) => {
  try {
    const { name, email, password, subAdminId } = req.body;
    const member = await memberService.createMember(name, email, password, subAdminId);
    res.status(201).json(member);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMembers = async (req, res) => {
  try {
    const members = await memberService.getMembers();
    res.status(200).json(members);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMemberById = async (req, res) => {
  try {
    const { id } = req.params;
    const member = await memberService.getMemberById(id);
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }
    res.status(200).json(member);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
