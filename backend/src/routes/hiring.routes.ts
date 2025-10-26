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

//  Changed all instances of invalid role 'admin' to the valid role 'hr_hiring'

// Job Posting Management
router.get('/jobs', getJobPostings);
router.post('/jobs', requireRole(['hr_hiring', 'super_admin']), createJobPosting);
router.put('/jobs/:id', requireRole(['hr_hiring', 'super_admin']), updateJobPosting);
router.delete('/jobs/:id', requireRole(['hr_hiring', 'super_admin']), deleteJobPosting);

// Job Application Management
router.get('/applications', getJobApplications);
router.put('/applications/:id/status', requireRole(['hr_hiring', 'super_admin']), updateApplicationStatus);

export default router;