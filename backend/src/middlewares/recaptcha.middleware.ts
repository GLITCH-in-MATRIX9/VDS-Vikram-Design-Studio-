import { Request, Response, NextFunction } from "express";
import Recaptcha, { RecaptchaResponse } from "google-recaptcha";
import { config } from "../config/env";

const recaptcha = new Recaptcha({
  secret: config.recaptcha.secretKey,
});

export interface RecaptchaRequest extends Request {
  recaptchaValid?: boolean;
}

export const verifyRecaptcha = async (
  req: RecaptchaRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { recaptchaToken } = req.body;

    if (!recaptchaToken) {
      return res.status(400).json({
        success: false,
        message: "reCAPTCHA token is required",
      });
    }

    const verification: RecaptchaResponse = await new Promise(
      (resolve, reject) => {
        recaptcha.verify(recaptchaToken, req.ip || "", (err, data) => {
          if (err) reject(err);
          else resolve(data);
        });
      }
    );

    if (!verification.success || (verification.score ?? 1) < 0.5) {
      return res.status(400).json({
        success: false,
        message: "reCAPTCHA verification failed",
      });
    }

    req.recaptchaValid = true;
    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "reCAPTCHA service unavailable",
    });
  }
};

export const skipRecaptchaInDevelopment = (
  req: RecaptchaRequest,
  _res: Response,
  next: NextFunction
) => {
  if (process.env.NODE_ENV === "development") {
    req.recaptchaValid = true;
    return next();
  }
  return verifyRecaptcha(req, _res, next);
};
