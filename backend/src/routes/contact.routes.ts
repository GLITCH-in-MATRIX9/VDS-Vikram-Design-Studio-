import { Router } from "express";
import { sendContactEmail } from "../controllers/contact.controller";
import { contactRateLimit } from "../middlewares/rateLimit.middleware";

const router = Router();

router.post(
  "/",
  contactRateLimit,
  sendContactEmail
);

export default router;
