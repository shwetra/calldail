import express from 'express';
import Data from '../models/Data.model';
import Caller from '../models/Caller.model'; // Caller model
import { authenticateSubAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// SubAdmin sends data to Caller (specific or all)
router.post('/send-data-to-caller', authenticateSubAdmin, async (req, res) => {
  const { dataId, assignedToId } = req.body;

  // Validate dataId and assignedToId
  if (!dataId || !assignedToId) {
    return res.status(400).json({ message: 'Data ID and Assigned Caller ID are required' });
  }

  try {
    // Check if assignedToId is 'all' (indicating all callers)
    if (assignedToId === 'all') {
      // Find all Callers under the SubAdmin
      const callers = await Caller.find({ subAdminId: req.subAdminId });
      if (callers.length === 0) {
        return res.status(404).json({ message: 'No callers found under this SubAdmin' });
      }

      // Send data to all Callers
      for (const caller of callers) {
        const data = await Data.findById(dataId);
        if (!data) {
          return res.status(404).json({ message: 'Data not found' });
        }

        // Add data to the caller's assigned data array (assumed field)
        caller.assignedData.push(data);
        await caller.save();
      }

      return res.status(200).json({ message: 'Data assigned to all Callers successfully' });
    }

    // If assignedToId is a specific caller ID, assign data to that caller
    const caller = await Caller.findOne({ _id: assignedToId, subAdminId: req.subAdminId });
    if (!caller) {
      return res.status(404).json({ message: 'Caller not found or not associated with this SubAdmin' });
    }

    const data = await Data.findById(dataId);
    if (!data) {
      return res.status(404).json({ message: 'Data not found' });
    }

    // Assign data to specific caller
    caller.assignedData.push(data);
    await caller.save();

    res.status(200).json({ message: 'Data assigned to Caller successfully', caller });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred', error: error.message });
  }
});

export default router;
