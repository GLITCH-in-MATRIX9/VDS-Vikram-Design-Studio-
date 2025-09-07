import { Request, Response, NextFunction } from 'express';

interface RateLimitOptions {
  windowMs: number; // Time window in milliseconds
  max: number; // Max requests per window
  message?: string;
}

// Simple in-memory rate limiter (for production, use Redis)
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export const rateLimit = (options: RateLimitOptions) => {
  const { windowMs, max, message = 'Too many requests, please try again later.' } = options;

  return (req: Request, res: Response, next: NextFunction) => {
    const clientId = req.ip || 'unknown';
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean up old entries
    for (const [key, value] of requestCounts.entries()) {
      if (value.resetTime < now) {
        requestCounts.delete(key);
      }
    }

    // Get or create client record
    let clientRecord = requestCounts.get(clientId);
    if (!clientRecord || clientRecord.resetTime < now) {
      clientRecord = { count: 0, resetTime: now + windowMs };
      requestCounts.set(clientId, clientRecord);
    }

    // Check if limit exceeded
    if (clientRecord.count >= max) {
      return res.status(429).json({
        message,
        success: false,
        retryAfter: Math.ceil((clientRecord.resetTime - now) / 1000)
      });
    }

    // Increment counter
    clientRecord.count++;
    next();
  };
};

// Predefined rate limiters
export const contactRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per 15 minutes
  message: 'Too many contact form submissions. Please wait before trying again.'
});

export const generalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per 15 minutes
  message: 'Too many requests from this IP. Please try again later.'
});
