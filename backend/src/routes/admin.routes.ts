import { Router } from 'express';
import {
  getDashboardStats,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getWebsiteContent,
  updateWebsiteContent,
  getActivityLogs
} from '../controllers/admin.controller';
import { protect, requireRole } from '../middlewares/auth.middleware';

const router = Router();

// All routes require authentication
router.use(protect);

// Dashboard Statistics
router.get('/dashboard/stats', getDashboardStats);

// User Management (Super Admin only)
router.get('/users', requireRole(['super_admin']), getAllUsers);
router.post('/users', requireRole(['super_admin']), createUser);
router.put('/users/:id', requireRole(['super_admin']), updateUser);
router.delete('/users/:id', requireRole(['super_admin']), deleteUser);

// Website Content Management
router.get('/content', getWebsiteContent);
router.put('/content/:id', updateWebsiteContent);

// Activity Logs
router.get('/activity', getActivityLogs);

export default router;
