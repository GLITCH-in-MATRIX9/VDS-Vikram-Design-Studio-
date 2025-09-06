import { Router } from 'express';
import { sendContactEmail } from '../controllers/contact.controller';
import { contactRateLimit } from '../middlewares/rateLimit.middleware';

const router = Router();

// Contact form submission (public route with rate limiting)
router.post('/', contactRateLimit, sendContactEmail);

export default router;
