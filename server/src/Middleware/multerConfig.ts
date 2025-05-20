import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure upload directories exist
const ensureDirExists = (dir: string) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {

     console.log("Uploaded field name:", file.fieldname); // 👀 Debug log

    let uploadPath: string | undefined;

    if (file.fieldname === 'photo') {
      uploadPath = './public/assets/documents/photo';
    } 

    if (uploadPath) {
      ensureDirExists(uploadPath);
      cb(null, uploadPath);
    } else {
      cb(new Error('Unknown upload type'), '');
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Set limit to 10 MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, and JPG files are allowed.'));
    }
  },
});

export default upload;