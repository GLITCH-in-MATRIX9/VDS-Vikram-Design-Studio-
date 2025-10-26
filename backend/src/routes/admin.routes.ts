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

// ------------------------------
// Dashboard Statistics
// Accessible by all roles
// ------------------------------
router.get('/dashboard/stats', requireRole(['super_admin', 'hr_hiring', 'project_content_manager']), getDashboardStats);

// ------------------------------
// User Management
// Only Super Admin can manage users
// ------------------------------
router.get('/users', requireRole(['super_admin']), getAllUsers);
router.post('/users', requireRole(['super_admin']), createUser);
router.put('/users/:id', requireRole(['super_admin']), updateUser);
router.delete('/users/:id', requireRole(['super_admin']), deleteUser);

// ------------------------------
// Website Content Management
// Super Admin: full access
// Project Content Manager: only project-related sections
// HR: view-only (if needed, add requireRole here)
// ------------------------------
router.get('/content', requireRole(['super_admin', 'hr_hiring', 'project_content_manager']), getWebsiteContent);
router.put(
  '/content/:id',
  requireRole(['super_admin', 'project_content_manager']),
  updateWebsiteContent
);

// ------------------------------
// Activity Logs
// Super Admin and HR only
// ------------------------------
router.get('/activity', requireRole(['super_admin', 'hr_hiring']), getActivityLogs);

export default router;
