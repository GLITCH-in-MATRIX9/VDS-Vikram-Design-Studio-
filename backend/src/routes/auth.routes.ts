import { Router } from 'express';
import { 
  registerAdmin, 
  loginAdmin, 
  getProfile, 
  updateProfile, 
  changePassword 
} from '../controllers/auth.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

// Public routes
router.post('/register', registerAdmin);
router.post('/login', loginAdmin);

// Protected routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

export default router;
