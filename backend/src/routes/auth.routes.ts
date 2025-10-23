import { Router } from 'express';
import { 
  registerAdmin, 
  loginAdmin, 
  getProfile, 
  updateProfile, 
  changePassword,
  logoutAdmin
} from '../controllers/auth.controller';
import { protect } from '../middlewares/auth.middleware';
import { validateAuth, validateRegister } from '../middlewares/validation.middleware';
import { loginRateLimit, registerRateLimit } from '../middlewares/rateLimit.middleware';

const router = Router();

// Public routes
router.post('/register', registerRateLimit, validateRegister, registerAdmin);
router.post('/login', loginRateLimit, validateAuth, loginAdmin);

// Protected routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.post('/logout', protect, logoutAdmin);

export default router;
