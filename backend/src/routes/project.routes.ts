import { Router } from 'express';
import { 
  createProject, 
  getProjects, 
  getProjectById, 
  updateProject, 
  deleteProject, 
  toggleProjectStatus, 
  searchProjects 
} from '../controllers/project.controller';
import { upload } from '../middlewares/upload';
import { protect, requireRole } from '../middlewares/auth.middleware';

const router = Router();

// Public routes (no authentication required)
router.get('/', getProjects);
router.get('/search', searchProjects);
router.get('/:id', getProjectById);

// Protected routes (admin only)
router.post('/', protect, requireRole(['admin', 'super_admin']), upload.single('preview'), createProject);
router.put('/:id', protect, requireRole(['admin', 'super_admin']), upload.single('preview'), updateProject);
router.delete('/:id', protect, requireRole(['admin', 'super_admin']), deleteProject);
router.patch('/:id/status', protect, requireRole(['admin', 'super_admin']), toggleProjectStatus);

export default router;


