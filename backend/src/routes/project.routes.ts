import { Router } from 'express';
import { createProject, getProjects, getProjectById } from '../controllers/project.controller';
import { upload } from '../middlewares/upload';

const router = Router();

// POST expects multipart/form-data with optional field "preview" for image file
// and text fields, including JSON strings for "tags" and "sections".
router.post('/', upload.single('preview'), createProject);
router.get('/', getProjects);
router.get('/:id', getProjectById);

export default router;


