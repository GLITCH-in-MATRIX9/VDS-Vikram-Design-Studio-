import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { AdminUser, IAdminUser } from '../models/AdminUser.model';

/**
 * 🔐 Role Hierarchy
 * ------------------------------------------------------------
 * Roles:
 *  - super_admin
 *  - hr_hiring
 *  - project_content_manager
 *
 * Use requireRole(['role1', 'role2']) to protect routes based on roles.
 * ------------------------------------------------------------
 */

export interface AuthRequest extends Request {
  body: any;        // Fixes req.body
  params: any;      // Fixes req.params
  query: any;       // Fixes req.query
  user?: IAdminUser; // Fixes req.user
}

// JWT authentication middleware
export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token: string | undefined;

    // Extract token from Authorization header or cookie
    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload & { id?: string };

    if (!decoded?.id) {
      return res.status(401).json({ message: 'Invalid token payload.' });
    }

    // Fetch user from database
    const user = await AdminUser.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Token valid but user not found.' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'User account is deactivated.' });
    }

    // Update last login timestamp silently
    await AdminUser.findByIdAndUpdate(user._id, { lastLogin: new Date() }, { new: false });

    req.user = user;
    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired. Please log in again.' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token format.' });
    }
    return res.status(500).json({ message: 'Authentication failed.' });
  }
};

// Role-based guard
export const requireRole = (roles: Array<IAdminUser['role']>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated.' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied. Insufficient role privileges.' });
    }

    next();
  };
};
