import { Response } from "express";
import jwt, { SignOptions } from "jsonwebtoken";
import { Types } from "mongoose";
import { AdminUser, IAdminUser } from "../models/AdminUser.model";
import { ActivityLog } from "../models/ActivityLog.model";

// Extend Express Request
export interface AuthRequest extends Express.Request {
  user?: IAdminUser & { _id: Types.ObjectId };
  body: any;
  params: any;
  query: any;
}

// Generate JWT
const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET not configured");

  const options: SignOptions = {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  };

  return jwt.sign({ id: userId }, secret, options);
};

// Register first admin
export const registerAdmin = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password, name } = req.body;

    const existingAdminCount = await AdminUser.countDocuments();
    if (existingAdminCount > 0)
      return res.status(403).json({ message: "Registration disabled." });

    const existingUser = await AdminUser.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Admin user with this email exists" });

    const user = await AdminUser.create({
      email,
      password,
      name,
      role: "super_admin",
    });

    const token = generateToken(user._id.toString());

    res.status(201).json({
      message: "Admin user created successfully",
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to create admin user", error: error.message });
  }
};

// Login admin
export const loginAdmin = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Provide email and password" });

    const user = await AdminUser.findOne({ email }).select("+password");
    if (!user || !user.isActive)
      return res.status(401).json({ message: "Invalid credentials or deactivated" });

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid)
      return res.status(401).json({ message: "Invalid credentials" });

    await AdminUser.findByIdAndUpdate(user._id, { lastLogin: new Date() });

    await ActivityLog.create({
      userId: user._id,
      action: "LOGIN",
      entityType: "AUTH",
      description: `User logged in: ${user.email}`,
      metadata: { loginTime: new Date().toISOString() },
    });

    const token = generateToken(user._id.toString());

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    });
  } catch (error: any) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

// Get profile
export const getProfile = async (req: AuthRequest, res: Response) => {
  if (!req.user)
    return res.status(401).json({ message: "User not authenticated" });

  try {
    const user = await AdminUser.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
        isActive: user.isActive,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to get profile", error: error.message });
  }
};

// Update profile
export const updateProfile = async (req: AuthRequest, res: Response) => {
  if (!req.user)
    return res.status(401).json({ message: "User not authenticated" });

  try {
    const { name, email } = req.body;
    const updateData: Partial<IAdminUser> = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;

    const user = await AdminUser.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to update profile", error: error.message });
  }
};

// Change password
export const changePassword = async (req: AuthRequest, res: Response) => {
  if (!req.user)
    return res.status(401).json({ message: "User not authenticated" });

  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      return res.status(400).json({ message: "Provide current and new password" });
    if (newPassword.length < 6)
      return res.status(400).json({ message: "New password must be at least 6 characters" });

    const user = await AdminUser.findById(req.user._id).select("+password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const isCurrentValid = await user.comparePassword(currentPassword);
    if (!isCurrentValid)
      return res.status(400).json({ message: "Current password is incorrect" });

    user.password = newPassword;
    await user.save();

    const token = generateToken(user._id.toString());

    res.status(200).json({ message: "Password changed successfully", token });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to change password", error: error.message });
  }
};

// Logout
export const logoutAdmin = async (req: AuthRequest, res: Response) => {
  if (!req.user)
    return res.status(401).json({ message: "User not authenticated" });

  try {
    await ActivityLog.create({
      userId: req.user._id,
      action: "LOGOUT",
      entityType: "AUTH",
      description: `User logged out: ${req.user.email}`,
      metadata: { logoutTime: new Date().toISOString() },
    });

    res.status(200).json({ message: "Logout successful" });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to logout", error: error.message });
  }
};
