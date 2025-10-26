import { Response } from "express";
import { Project } from "../models/Project.model";
import { AdminUser, IAdminUser } from "../models/AdminUser.model";
import { ActivityLog } from "../models/ActivityLog.model";
import { WebsiteContent } from "../models/WebsiteContent.model";
import { JobApplication } from "../models/JobApplication.model";
import { Types } from "mongoose";

// NOTE: AuthRequest interface must be defined either in this file or imported from auth.controller.ts
// We'll assume it's imported or defined in a shared file, but for this context, we will use the definition provided in the previous file:
export interface AuthRequest extends Request {
  user?: IAdminUser;
}

/**
 * ===========================
 * Dashboard Statistics
 * ===========================
 */
// 🔑 FIX: Changed req type from Express.Request to AuthRequest
export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    const totalProjects = await Project.countDocuments();
    const liveProjects = await Project.countDocuments({
      status: { $in: ["On-site", "Design stage"] },
    });
    const categoriesCount = (await Project.distinct("category")).length;

    const applicantsTotal = await JobApplication.countDocuments();
    // 🔑 FIX TS2339 (Line 72): req.query is available on AuthRequest
    const newApplicants = await JobApplication.countDocuments({ 
      appliedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    });
    const shortlisted = await JobApplication.countDocuments({
      status: "SHORTLISTED",
    });

    const recentActivity = await ActivityLog.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .limit(10)
      .select("action entityType description createdAt userId");

    res.status(200).json({
      success: true,
      data: {
        totalProjects,
        liveProjects,
        positions: { liveProjects, categoriesCount },
        applicantsTotal,
        newApplicants,
        shortlisted,
        recentActivity,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
      error: error.message,
    });
  }
};

/**
 * ===========================
 * User Management
 * ===========================
 */
// 🔑 FIX: Changed req type from Express.Request to AuthRequest
export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const users = await AdminUser.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: users });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Failed to fetch users", error: error.message });
  }
};

// 🔑 FIX: Changed req type from Express.Request to AuthRequest
export const createUser = async (req: AuthRequest, res: Response) => {
  try {
    // 🔑 FIX TS2339 (Line 85): req.body is available on AuthRequest
    const { email, password, name, role } = req.body; 

    if (!password || password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Initial password is required and must be at least 8 characters long.",
      });
    }

    const existingUser = await AdminUser.findOne({ email });
    if (existingUser)
      return res.status(400).json({ success: false, message: "User with this email already exists" });

    // 🔑 FIX TS2749 (Line 85): Use IAdminUser['role'] or assert the role type
    const validRole: IAdminUser["role"] =
      role === "super_admin" || role === "hr_hiring" || role === "project_content_manager"
        ? role
        : "project_content_manager";

    const user = await AdminUser.create({ email, password, name, role: validRole });

    // 🔑 FIX TS18046 (Line 152): req.user is guaranteed to exist by middleware
    await ActivityLog.create({
      userId: req.user!._id,
      action: "CREATE",
      entityType: "USER",
      entityId: user._id,
      description: `Created new user: ${user.email}`,
      metadata: { userRole: user.role },
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    console.error("Create User Error:", error);
    res.status(500).json({ success: false, message: "Failed to create user", error: error.message });
  }
};

// 🔑 FIX: Changed req type from Express.Request to AuthRequest
export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    // 🔑 FIX TS2339 (Line 121): req.params is available on AuthRequest
    const { id } = req.params; 
    // 🔑 FIX TS2339 (Line 122): req.body is available on AuthRequest
    const { name, email, role, isActive } = req.body; 

    const user = await AdminUser.findByIdAndUpdate(
      id,
      { name, email, role, isActive },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    await ActivityLog.create({
      userId: req.user!._id, // req.user is guaranteed to exist
      action: "UPDATE",
      entityType: "USER",
      entityId: user._id,
      description: `Updated user: ${user.email}`,
      metadata: { changes: { name, email, role, isActive } },
    });

    res.status(200).json({ success: true, message: "User updated successfully", data: user });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Failed to update user", error: error.message });
  }
};

// 🔑 FIX: Changed req type from Express.Request to AuthRequest
export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    // 🔑 FIX TS2339 (Line 149): req.params is available on AuthRequest
    const { id } = req.params; 

    if (!req.user) return res.status(401).json({ success: false, message: "Unauthorized" });
    if (id === req.user._id.toString())
      return res.status(400).json({ success: false, message: "Cannot delete your own account" });

    const user = await AdminUser.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    await ActivityLog.create({
      userId: req.user!._id, // req.user is guaranteed to exist
      action: "DELETE",
      entityType: "USER",
      entityId: user._id,
      description: `Deleted user: ${user.email}`,
      metadata: { deletedUser: user.email },
    });

    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Failed to delete user", error: error.message });
  }
};

/**
 * ===========================
 * Website Content Management
 * ===========================
 */
// 🔑 FIX: Changed req type from Express.Request to AuthRequest
export const getWebsiteContent = async (req: AuthRequest, res: Response) => {
  try {
    // 🔑 FIX TS2339 (Line 180): req.query is available on AuthRequest
    const { page } = req.query; 
    const query = page ? { page: page as string } : {};
    const content = await WebsiteContent.find(query)
      .populate("lastModifiedBy", "name email")
      .sort({ page: 1, section: 1 });

    res.status(200).json({ success: true, data: content });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Failed to fetch website content", error: error.message });
  }
};

// 🔑 FIX: Changed req type from Express.Request to AuthRequest
export const updateWebsiteContent = async (req: AuthRequest, res: Response) => {
  try {
    // 🔑 FIX TS2339 (Line 194): req.params is available on AuthRequest
    const { id } = req.params; 
    // 🔑 FIX TS2339 (Line 195): req.body is available on AuthRequest
    const { content, title, contentType, isActive } = req.body; 

    const updatedContent = await WebsiteContent.findByIdAndUpdate(
      id,
      {
        content,
        title,
        contentType,
        isActive,
        lastModifiedBy: req.user!._id,
        lastModifiedAt: new Date(),
      },
      { new: true, runValidators: true }
    ).populate("lastModifiedBy", "name email");

    if (!updatedContent) return res.status(404).json({ success: false, message: "Content not found" });

    await ActivityLog.create({
      userId: req.user!._id,
      action: "UPDATE",
      entityType: "CONTENT",
      entityId: updatedContent._id,
      description: `Updated website content: ${updatedContent.page} - ${updatedContent.section}`,
      metadata: { page: updatedContent.page, section: updatedContent.section },
    });

    res.status(200).json({ success: true, message: "Content updated successfully", data: updatedContent });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Failed to update content", error: error.message });
  }
};

/**
 * ===========================
 * Activity Logs
 * ===========================
 */
// 🔑 FIX: Changed req type from Express.Request to AuthRequest
export const getActivityLogs = async (req: AuthRequest, res: Response) => {
  try {
    // 🔑 FIX TS2339 (Line 234): req.query is available on AuthRequest
    const { userId, limit = 50, page = 1 } = req.query; 
    const query = userId ? { userId: userId as string } : {};
    const skip = (Number(page) - 1) * Number(limit);

    const activities = await ActivityLog.find(query)
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await ActivityLog.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        activities,
        pagination: {
          current: Number(page),
          total: Math.ceil(total / Number(limit)),
          count: activities.length,
          totalCount: total,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Failed to fetch activity logs", error: error.message });
  }
};