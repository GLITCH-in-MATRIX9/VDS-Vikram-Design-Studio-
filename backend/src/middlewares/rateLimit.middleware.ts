import { Request, Response, NextFunction } from 'express';

interface RateLimitOptions {
  windowMs: number; // Time window in milliseconds
  max: number; // Max requests per window
  message?: string;
}

// Memory-optimized in-memory rate limiter with automatic cleanup
const requestCounts = new Map<string, { count: number; resetTime: number }>();

// Cleanup interval to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of requestCounts.entries()) {
    if (value.resetTime < now) {
      requestCounts.delete(key);
    }
  }
  // Limit map size to prevent memory bloat
  if (requestCounts.size > 1000) {
    const entries = Array.from(requestCounts.entries());
    entries.sort((a, b) => a[1].resetTime - b[1].resetTime);
    const toDelete = entries.slice(0, 200); // Remove oldest 200 entries
    toDelete.forEach(([key]) => requestCounts.delete(key));
  }
}, 60000); // Cleanup every minute

export const rateLimit = (options: RateLimitOptions) => {
  const { windowMs, max, message = 'Too many requests, please try again later.' } = options;

  return (req: Request, res: Response, next: NextFunction) => {
    const clientId = req.ip || 'unknown';
    const now = Date.now();

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

export const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 requests per 15 minutes
  message: 'Too many login attempts. Please try again later.'
});

export const registerRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 requests per hour
  message: 'Too many registration attempts. Please try again later.'
});
