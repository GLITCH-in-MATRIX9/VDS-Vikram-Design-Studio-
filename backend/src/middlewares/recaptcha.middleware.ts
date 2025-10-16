import { Request, Response, NextFunction } from "express";
import Recaptcha, { RecaptchaResponse } from "google-recaptcha";
import { config } from "../config/env";

// Initialize reCAPTCHA with secret key
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
        message: "reCAPTCHA token is required",
        success: false,
        error: "MISSING_RECAPTCHA_TOKEN",
      });
    }

    const clientIP =
      req.ip || req.connection.remoteAddress || req.socket.remoteAddress || "";

    // Type-safe promise
    const verificationResult: RecaptchaResponse = await new Promise(
      (resolve, reject) => {
        recaptcha.verify(recaptchaToken, clientIP, (error, data) => {
          if (error) reject(error);
          else resolve(data);
        });
      }
    );

    if (!verificationResult.success) {
      console.warn("reCAPTCHA verification failed:", {
        errorCodes: verificationResult["error-codes"],
        clientIP,
        timestamp: new Date().toISOString(),
      });

      return res.status(400).json({
        message: "reCAPTCHA verification failed. Please try again.",
        success: false,
        error: "RECAPTCHA_VERIFICATION_FAILED",
        errorCodes: verificationResult["error-codes"],
      });
    }

    if (
      verificationResult.score !== undefined &&
      verificationResult.score < 0.5
    ) {
      console.warn("reCAPTCHA score too low:", {
        score: verificationResult.score,
        clientIP,
        timestamp: new Date().toISOString(),
      });

      return res.status(400).json({
        message: "reCAPTCHA verification failed. Please try again.",
        success: false,
        error: "RECAPTCHA_SCORE_TOO_LOW",
        score: verificationResult.score,
      });
    }

    req.recaptchaValid = true;

    console.log("reCAPTCHA verification successful:", {
      clientIP,
      timestamp: new Date().toISOString(),
      score: verificationResult.score,
    });

    next();
  } catch (error: any) {
    console.error("reCAPTCHA verification error:", error);

    return res.status(500).json({
      message:
        "reCAPTCHA verification service unavailable. Please try again later.",
      success: false,
      error: "RECAPTCHA_SERVICE_ERROR",
    });
  }
};

// Optional: skip reCAPTCHA in development
export const skipRecaptchaInDevelopment = (
  req: RecaptchaRequest,
  res: Response,
  next: NextFunction
) => {
  if (process.env.NODE_ENV === "development") {
    console.log("Skipping reCAPTCHA verification in development mode");
    req.recaptchaValid = true;
    return next();
  }
  return verifyRecaptcha(req, res, next);
};
