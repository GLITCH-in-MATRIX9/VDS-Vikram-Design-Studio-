import multer from 'multer';
import { Request } from 'express';
import path from 'path';
import fs from 'fs';

const uploadRoot = process.env.UPLOAD_DIR || 'uploads';
const dest = path.join(process.cwd(), uploadRoot, 'previews');
fs.mkdirSync(dest, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, dest);
    },
    filename: (req, file, cb) => {
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const ext = path.extname(file.originalname) || '.jpg';
        cb(null, `${unique}${ext}`);
    },
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // This allows both images and GIFs
    if (/^image\//.test(file.mimetype) || /^image\/gif$/.test(file.mimetype)) {
        return cb(null, true);
    }
    return cb(new Error('Only image and GIF uploads are allowed'));
};

export const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});