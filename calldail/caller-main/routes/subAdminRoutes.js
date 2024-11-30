// subAdminRoutes.js
import express from 'express';
import { authenticateAdmin } from '../middleware/authMiddleware.js';  
import Admin from '../models/AdminModel.js';
import SubAdmin from '../Models/Subadmin.js';
import bcrypt from 'bcrypt';

const router = express.Router();

// Route to create subadmins (requires admin authentication)
router.post('/create', authenticateAdmin, async (req, res) => {
  const subAdminsData = req.body.subAdmins;

  try {
    // Check if subAdminsData is an array
    if (!Array.isArray(subAdminsData) || subAdminsData.length === 0) {
      return res.status(400).json({ message: 'SubAdmins array is required' });
    }

    // Process each subadmin in the array
    const createdSubAdmins = [];
    for (const subAdminData of subAdminsData) {
      const { name, email, password } = subAdminData;

      // Validate password and other fields
      if (!password) {
        return res.status(400).json({ message: 'Password is required for each subadmin' });
      }

      // Check if subadmin email already exists
      const existingSubAdmin = await SubAdmin.findOne({ email });
      if (existingSubAdmin) {
        return res.status(400).json({ message: `Subadmin with email ${email} already exists` });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new SubAdmin
      const subAdmin = new SubAdmin({
        adminId: req.adminId, // Link the subadmin to the logged-in admin
        name,
        email,
        password: hashedPassword,
      });

      // Save the subadmin in the SubAdmin collection
      await subAdmin.save();

      // Add the subadmin to the createdSubAdmins array
      createdSubAdmins.push(subAdmin);
    }

    // Add all created subadmins to the admin's subAdmins array (only store references)
    const admin = await Admin.findById(req.adminId);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Push the subadmins' IDs to the admin's subAdmins array
    admin.subAdmins.push(...createdSubAdmins.map(subAdmin => subAdmin._id));

    // Save the updated admin document
    await admin.save();

    res.status(201).json({
      message: 'Subadmins created successfully',
      subAdmins: createdSubAdmins,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
