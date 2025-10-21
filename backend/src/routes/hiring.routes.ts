import { Router } from 'express';
import {
  getJobPostings,
  createJobPosting,
  updateJobPosting,
  deleteJobPosting,
  getJobApplications,
  updateApplicationStatus,
  submitJobApplication
} from '../controllers/hiring.controller';
import { protect, requireRole } from '../middlewares/auth.middleware';

const router = Router();

// Public route for job application submission
router.post('/applications', submitJobApplication);

// All other routes require authentication
router.use(protect);

// Job Posting Management
router.get('/jobs', getJobPostings);
router.post('/jobs', requireRole(['admin', 'super_admin']), createJobPosting);
router.put('/jobs/:id', requireRole(['admin', 'super_admin']), updateJobPosting);
router.delete('/jobs/:id', requireRole(['admin', 'super_admin']), deleteJobPosting);

// Job Application Management
router.get('/applications', getJobApplications);
router.put('/applications/:id/status', requireRole(['admin', 'super_admin']), updateApplicationStatus);

export default router;
