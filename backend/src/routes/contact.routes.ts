import { Router } from 'express';
import { sendContactEmail } from '../controllers/contact.controller';
import { contactRateLimit } from '../middlewares/rateLimit.middleware';
import { verifyRecaptcha, skipRecaptchaInDevelopment } from '../middlewares/recaptcha.middleware';

const router = Router();

// Contact form submission (public route with rate limiting and reCAPTCHA)
router.post('/', contactRateLimit, skipRecaptchaInDevelopment, sendContactEmail);

// Test endpoint to verify reCAPTCHA integration (remove in production)
router.post('/test-recaptcha', contactRateLimit, verifyRecaptcha, (req, res) => {
  res.json({
    message: 'reCAPTCHA verification successful!',
    success: true,
    timestamp: new Date().toISOString()
  });
});

export default router;
