import Caller from '../Models/Caller.js';  
import SubAdmin from '../Models/Subadmin.js';
import bcrypt from "bcrypt";  // Assuming SubAdmin model is in models/SubAdminModel.js

// Controller for creating a caller
export const createCaller = async (req, res) => {
    const { name, phoneNumber, email, password } = req.body;
  
    try {
      if (!name || !phoneNumber || !email || !password) {
        return res.status(400).json({ message: 'All fields are required (name, phoneNumber, email)' });
      }
  
      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(password, 10);  // 10 is the salt rounds
  
      // Create a new Caller
      const caller = new Caller({
        subAdminId: req.subAdminId, 
        name,
        phoneNumber,
        email,
        password: hashedPassword  // Store hashed password
      });
  
      await caller.save();
  
      // Find the SubAdmin by ID and update their callers list
      const subAdmin = await SubAdmin.findById(req.subAdminId);
      if (!subAdmin) {
        return res.status(404).json({ message: 'SubAdmin not found' });
      }
  
      // Add the caller to the SubAdmin's callers list
      subAdmin.callers.push({
        _id: caller._id,
        name: caller.name,
        phoneNumber: caller.phoneNumber,
        email: caller.email,
        password: caller.password // You should not store the password in the subadmin's caller list, consider removing this
      });
  
      await subAdmin.save();
  
      res.status(201).json({
        message: 'Caller created successfully',
        caller,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };