import multer, { FileFilterCallback } from 'multer';
import fs from 'fs';
import path from 'path';
import { Request } from 'express';

// Helper: create directories if missing
function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req: Request, file, cb) => {
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();

    const yearDir = path.join('uploads', year.toString());
    const monthDir = path.join(yearDir, month.toString());

    ensureDir(monthDir);

    cb(null, monthDir);
  },

  filename: (req: Request, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.ceil(Math.random() * 9_999_999);
    const safeName = `${file.fieldname}-${uniqueSuffix}-${file.originalname}`;
    cb(null, safeName);
  }
});

// File filter with type safety
const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
  if (!['image'].includes(file.fieldname)) {
    return cb(new Error('Too many files not allowed'));
  }
  cb(null, true);
};

// Multer upload configurations
export const uploadSingle = multer({
  storage,
  limits: { fileSize: 10_000_000 }, // 10 MB
  fileFilter
});

export const upload = multer({
  storage,
  limits: { fileSize: 10_000_000 },
  fileFilter: (req, file, cb) => cb(null, true)
});
