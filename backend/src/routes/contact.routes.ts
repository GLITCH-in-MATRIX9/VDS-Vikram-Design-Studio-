import { Router } from "express";
import { sendContactEmail } from "../controllers/contact.controller";
import { contactRateLimit } from "../middlewares/rateLimit.middleware";
import {
  verifyRecaptcha,
  skipRecaptchaInDevelopment,
} from "../middlewares/recaptcha.middleware";

const router = Router();

router.post(
  "/",
  contactRateLimit,
  skipRecaptchaInDevelopment,
  sendContactEmail
);

export default router;
