const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Database Connection
const connectDB = require('./config/db');
const Admin = require('./Modals/AdminSchema.modal');
const Caller = require('./Modals/Member.modal');

const SubAdmin = require('./Modals/SubAdmin.modal');


connectDB();

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Middleware to Authenticate Admin
const authenticateAdmin = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.adminId = decoded.id;
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid token' });
  }
};



const authenticateSubAdmin = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.subAdminId = decoded.id; // Store the subadmin's ID in the request
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid token' });
  }
};

// Admin Routes

// Admin Signup
app.post('/api/admin/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    // Validate password
    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin document
    const admin = new Admin({ name, email, password: hashedPassword });
    await admin.save();

    res.status(201).json({ message: 'Admin created successfully', admin });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin and SubAdmin Login
app.post('/api/admin/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // First, check if the user is an Admin
    let user = await Admin.findOne({ email });
    if (!user) {
      // If not found in Admin, check in SubAdmin
      user = await SubAdmin.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' }); // User not found in both Admin and SubAdmin
      }
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token (use the correct model ID - Admin or SubAdmin)
    const token = jwt.sign({ id: user._id, role: user.constructor.modelName }, JWT_SECRET, { expiresIn: '1h' });

    // Respond with token and user data
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.constructor.modelName, // "Admin" or "SubAdmin"
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Create SubAdmins (requires admin authentication)
// app.post('/api/admin/subadmin/create', authenticateAdmin, async (req, res) => {
//   const subAdminsData = req.body.subAdmins;

//   try {
//     // Check if subAdminsData is an array
//     if (!Array.isArray(subAdminsData) || subAdminsData.length === 0) {
//       return res.status(400).json({ message: 'SubAdmins array is required' });
//     }

//     // Process each subadmin in the array
//     const createdSubAdmins = [];
//     for (const subAdminData of subAdminsData) {
//       const { name, email, password } = subAdminData;

//       // Validate password and other fields
//       if (!password) {
//         return res.status(400).json({ message: 'Password is required for each subadmin' });
//       }

//       // Check if subadmin email already exists
//       const existingSubAdmin = await SubAdmin.findOne({ email });
//       if (existingSubAdmin) {
//         return res.status(400).json({ message: `Subadmin with email ${email} already exists` });
//       }

//       // Hash password
//       const hashedPassword = await bcrypt.hash(password, 10);

//       // Create new SubAdmin
//       const subAdmin = new SubAdmin({
//         adminId: req.adminId, // Link the subadmin to the logged-in admin
//         name,
//         email,
//         password: hashedPassword,
//       });

//       // Save the subadmin in the SubAdmin collection
//       await subAdmin.save();

//       // Add the subadmin to the createdSubAdmins array
//       createdSubAdmins.push(subAdmin);
//     }

//     // Add all created subadmins to the admin's subAdmins array (only store references)
//     const admin = await Admin.findById(req.adminId);
//     if (!admin) {
//       return res.status(404).json({ message: 'Admin not found' });
//     }

//     // Push the subadmins' IDs to the admin's subAdmins array
//     admin.subAdmins.push(...createdSubAdmins.map(subAdmin => subAdmin._id));

//     // Save the updated admin document
//     await admin.save();

//     res.status(201).json({
//       message: 'Subadmins created successfully',
//       subAdmins: createdSubAdmins,
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });


// Create SubAdmins (requires admin authentication)
app.post('/api/admin/subadmin/create', authenticateAdmin, async (req, res) => {
  const subAdminsData = req.body.subAdmins;

  try {
    if (!Array.isArray(subAdminsData) || subAdminsData.length === 0) {
      return res.status(400).json({ message: 'SubAdmins array is required' });
    }
    const createdSubAdmins = [];
    for (const subAdminData of subAdminsData) {
      const { name, email, password } = subAdminData;
      if (!password) {
        return res.status(400).json({ message: 'Password is required for each subadmin' });
      }
      const existingSubAdmin = await SubAdmin.findOne({ email });
      if (existingSubAdmin) {
        return res.status(400).json({ message: `Subadmin with email ${email} already exists` });
      }
      const hashedPassword = await bcrypt.hash(password, 10);

      const subAdmin = new SubAdmin({
        adminId: req.adminId, 
        name,
        email,
        password: hashedPassword,
      });

      await subAdmin.save();

      createdSubAdmins.push(subAdmin);
    }

    // Add all created subadmins to the admin's subAdmins array (store full subadmin objects, not just IDs)
    const admin = await Admin.findById(req.adminId);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Push the full subadmin objects to the admin's subAdmins array
    admin.subAdmins.push(...createdSubAdmins);

    // Save the updated admin document
    await admin.save();

    // Send the full subadmin data in the response
    res.status(201).json({
      message: 'Subadmins created successfully',
      subAdmins: createdSubAdmins, // Send full subadmin data to the response
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




app.post('/api/subadmin/caller/create', authenticateSubAdmin, async (req, res) => {
  const { name, phoneNumber, email } = req.body;

  try {
    if (!name || !phoneNumber || !email) {
      return res.status(400).json({ message: 'All fields are required (name, phoneNumber, email)' });
    }

    const caller = new Caller({
      subAdminId: req.subAdminId, 
      name,
      phoneNumber,
      email,
    });
    await caller.save();

    const subAdmin = await SubAdmin.findById(req.subAdminId);
    if (!subAdmin) {
      return res.status(404).json({ message: 'SubAdmin not found' });
    }
    subAdmin.callers.push({
      _id: caller._id,
      name: caller.name,
      phoneNumber: caller.phoneNumber,
      email: caller.email,
    });
    await subAdmin.save();

    res.status(201).json({
      message: 'Caller created successfully',
      caller,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// Default Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
