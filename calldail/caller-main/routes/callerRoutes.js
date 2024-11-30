import express from 'express';
import { createCaller } from '../controllers/callerController.js';  
import { authenticateSubAdmin } from '../middleware/authMiddleware.js'; 

const router = express.Router();

// Define the route for creating a caller
router.post('/create', authenticateSubAdmin, createCaller);

export default router;
