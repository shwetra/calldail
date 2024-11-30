import express from 'express';
import Data from '../models/Data.model';  // Data schema
import { authenticateAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin assigns file data to SubAdmin
router.post('/assign-data-to-subadmin', authenticateAdmin, async (req, res) => {
  const { dataId, subAdminId } = req.body;

  // Validate dataId and subAdminId
  if (!dataId || !subAdminId) {
    return res.status(400).json({ message: 'Data ID and SubAdmin ID are required' });
  }

  try {
    // Find the data by ID
    const data = await Data.findById(dataId);
    if (!data) {
      return res.status(404).json({ message: 'Data not found' });
    }

    // Assign the data to the SubAdmin
    data.assignedTo = subAdminId;  // Assuming your Data schema has an `assignedTo` field
    await data.save();

    res.status(200).json({ message: 'Data assigned to SubAdmin successfully', data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
