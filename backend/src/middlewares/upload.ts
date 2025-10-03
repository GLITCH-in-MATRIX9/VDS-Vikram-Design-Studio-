import multer from 'multer';

const storage = multer.memoryStorage();

const fileFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  if (/^image\//.test(file.mimetype)) {
    return cb(null, true);
  }
  const error: any = new Error('Only image uploads are allowed');
  error.code = 'LIMIT_FILE_TYPE';
  return cb(error, false);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});
