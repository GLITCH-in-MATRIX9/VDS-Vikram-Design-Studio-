import multer from 'multer';

const storage = multer.memoryStorage();

const fileFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  // Allow all image types including GIFs
  const allowedMimeTypes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml'
  ];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    return cb(null, true);
  }
  const error: any = new Error('Only image uploads are allowed (JPEG, PNG, GIF, WebP, SVG)');
  error.code = 'LIMIT_FILE_TYPE';
  return cb(error, false);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB - increased for GIFs
});
