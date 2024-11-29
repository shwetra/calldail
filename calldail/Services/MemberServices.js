const MemberModal = require('../Modals/Member.modal');
const Member = require('../models/Member');

exports.createMember = async (name, email, password, subAdminId) => {
  const member = new MemberModal({ name, email, password, subAdminId });
  return await member.save();
};

exports.getMembers = async () => {
  return await Member.find(); 
};

exports.getMemberById = async (id) => {
  return await Member.findById(id); 
};
