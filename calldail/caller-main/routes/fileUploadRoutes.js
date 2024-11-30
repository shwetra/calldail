import express from 'express';
import multer from 'multer';
import csvParser from 'csv-parser';
import XLSX from 'xlsx';
import fs from 'fs';
import { authenticateAdminOrSubAdmin } from '../middleware/authMiddleware.js';  // Middleware for authentication

const router = express.Router();

// Configure Multer for File Uploads (dest: folder where files will be saved temporarily)
const upload = multer({ dest: 'uploads/' });

// Upload and Process File
router.post('/upload', authenticateAdminOrSubAdmin, upload.single('file'), async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: 'File is required' });
  }

  try {
    let data = [];

    // Process CSV File
    if (file.mimetype === 'text/csv') {
      fs.createReadStream(file.path)
        .pipe(csvParser())
        .on('data', (row) => data.push(row))
        .on('end', () => {
          fs.unlinkSync(file.path); // Remove file after processing
          res.status(200).json({ message: 'File processed successfully', data });
        });

    } 
    // Process Excel File
    else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      const workbook = XLSX.readFile(file.path);
      const sheetName = workbook.SheetNames[0];
      data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
      fs.unlinkSync(file.path); // Remove file after processing
      res.status(200).json({ message: 'File processed successfully', data });

    } 
    // Handle Unsupported File Types
    else {
      fs.unlinkSync(file.path); // Remove unsupported file
      res.status(400).json({ message: 'Unsupported file type' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message }); // Internal Server Error
  }
});

export default router;
