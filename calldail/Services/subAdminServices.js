const MemberModal = require("../Modals/Member.modal");
const SubAdminModal = require("../Modals/SubAdmin.modal");


exports.createSubAdmin = async (name, email, password, adminId) => {
  const subAdmin = new SubAdminModal({ name, email, password, adminId });
  return await subAdmin.save();
};

exports.getSubAdmins = async () => {
  return await SubAdminModal.find(); 
};

exports.getSubAdminById = async (id) => {
  return await SubAdminModal.findById(id);
};

exports.assignContentToMembers = async (subAdminId, contentDetails) => {
  const members = await MemberModal.find({ subAdminId }); 
  if (members.length === 0) {
    throw new Error('No members found under this SubAdmin.');
  }

  // Distribute content equally among members
  const memberCount = members.length;
  const distributedContent = members.map((member, index) => {
    return {
      memberId: member._id,
      assignedContent: contentDetails.filter((_, i) => i % memberCount === index),
    };
  });

  // (Optional) Save the assigned content to the database (if required)
  // Example: Save to Member model
  await Promise.all(
    distributedContent.map(async (content) => {
      await Member.findByIdAndUpdate(content.memberId, {
        $set: { assignedContent: content.assignedContent },
      });
    })
  );

  return distributedContent;
};
