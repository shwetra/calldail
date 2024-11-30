import jwt from'jsonwebtoken';


const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Middleware to Authenticate Admin
// const authenticateAdmin = async (req, res, next) => {
//   const token = req.headers.authorization?.split(' ')[1];
//   if (!token) return res.status(401).json({ message: 'Unauthorized, token missing' });

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET);
//     // Check if the user is an Admin (by checking role or the model name)
//     if (decoded.role !== 'Admin') {
//       return res.status(403).json({ message: 'Not authorized as Admin' });
//     }
//     req.adminId = decoded.id;  // Attach Admin ID to request
//     next();
//   } catch (error) {
//     res.status(403).json({ message: 'Invalid token' });
//   }
// };

// Middleware to Authenticate SubAdmin
// const authenticateSubAdmin = async (req, res, next) => {
//   const token = req.headers.authorization?.split(' ')[1];
//   if (!token) return res.status(401).json({ message: 'Unauthorized, token missing' });

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET);
//     // Check if the user is a SubAdmin (by checking role or model name)
//     if (decoded.role !== 'SubAdmin') {
//       return res.status(403).json({ message: 'Not authorized as SubAdmin' });
//     }
//     req.subAdminId = decoded.id;  // Attach SubAdmin ID to request
//     next();
//   } catch (error) {
//     res.status(403).json({ message: 'Invalid token' });
//   }
// };



// const authenticateAdmin = async (req, res, next) => {
//     const token = req.headers.authorization?.split(' ')[1];
//     if (!token) return res.status(401).json({ message: 'Unauthorized' });
  
//     try {
//       const decoded = jwt.verify(token, JWT_SECRET);
//       req.adminId = decoded.id;
//       next();
//     } catch (error) {
//       res.status(403).json({ message: 'Invalid token' });
//     }
//   };


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



  const authenticateAdminOrSubAdmin =async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
  
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      if (decoded.role !== 'admin' && decoded.role !== 'subadmin') {
        return res.status(403).json({ message: 'Forbidden: Admins or Subadmins only' });
      }
      req.userId = decoded.id; // Store user ID in the request
      req.role = decoded.role; // Store role in the request
      next();
    } catch (error) {
      res.status(403).json({ message: 'Invalid token' });
    }
  };
  
  

export {
    authenticateAdmin,
  authenticateSubAdmin,
  authenticateAdminOrSubAdmin,
};
