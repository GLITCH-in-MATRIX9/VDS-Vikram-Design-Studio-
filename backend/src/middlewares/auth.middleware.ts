import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AdminUser, IAdminUser } from '../models/AdminUser.model';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: IAdminUser;
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token: string | undefined;

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ 
      message: 'Access denied. No token provided.' 
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
    
    // Get user from token
    const user = await AdminUser.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ 
        message: 'Token is valid but user not found.' 
      });
    }

    if (!user.isActive) {
      return res.status(401).json({ 
        message: 'User account is deactivated.' 
      });
    }

    // Update last login
    await AdminUser.findByIdAndUpdate(user._id, { lastLogin: new Date() });
    
    req.user = user;
    next();
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        message: 'Invalid token.' 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Token expired.' 
      });
    }
    
    return res.status(500).json({ 
      message: 'Token verification failed.' 
    });
  }
};

export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ 
        message: 'Access denied. User not authenticated.' 
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Access denied. Insufficient permissions.' 
      });
    }

    next();
  };
};
