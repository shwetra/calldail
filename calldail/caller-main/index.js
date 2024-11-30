import express from'express';
import mongoose from'mongoose';
import bodyParser from'body-parser';
import dotenv from'dotenv';
import connectDB from'./config/db.js';  

import authRouter from './routes/authRoutes.js';
import {authenticateAdmin, authenticateSubAdmin} from "./middleware/authMiddleware.js"
import subAdminRoutes from "./routes/subAdminRoutes.js"
import callerRoutes from "./routes/callerRoutes.js"
import fileUploadRoutes from './routes/fileUploadRoutes.js';

dotenv.config(); 

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


// Database Connection
connectDB(); 

// Routes
// app.use('/api/admin', adminRoutes);  
app.use('/api/auth/v1', authRouter);






// Create SubAdmins (requires admin authentication)
app.use('/api/admin/subadmin', subAdminRoutes);
app.use('/api/subadmin/caller', callerRoutes);
app.use('/api/admin/file', fileUploadRoutes); //


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
