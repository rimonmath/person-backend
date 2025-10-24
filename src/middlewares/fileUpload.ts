import multer from 'multer';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// Helper: create directories if missing
function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// Custom Multer storage engine using memoryStorage + Sharp
const storage = multer.memoryStorage(); // store uploaded file in memory first

export const uploadSingle = multer({
  storage,
  limits: { fileSize: 10_000_000 }, // 10 MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only images allowed'));
    }
    cb(null, true);
  }
}).single('image');

// Middleware wrapper to process image inside Multer workflow
export const uploadAndProcess = async (req: any, res: any, next: any) => {
  uploadSingle(req, res, async (err: any) => {
    if (err) return next(err);
    if (!req.file) return next();

    try {
      const today = new Date();
      const month = today.getMonth() + 1;
      const year = today.getFullYear();
      const uploadDir = path.join('uploads', year.toString(), month.toString());
      ensureDir(uploadDir);

      const outputName = `${req.file.fieldname}-${Date.now()}.jpg`;
      const outputPath = path.join(uploadDir, outputName);

      // Resize and convert to JPEG
      await sharp(req.file.buffer).resize(300, 300).jpeg({ quality: 90 }).toFile(outputPath);

      // Replace req.file info with processed file
      req.file.path = outputPath;
      req.file.filename = outputName;

      next();
    } catch (err) {
      next(err);
    }
  });
};
