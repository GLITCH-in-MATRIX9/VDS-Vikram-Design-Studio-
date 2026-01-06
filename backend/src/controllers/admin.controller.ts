import { Request, Response } from "express";
import { Types } from "mongoose";

import { Project } from "../models/Project.model";
import { AdminUser, IAdminUser } from "../models/AdminUser.model";
import { ActivityLog } from "../models/ActivityLog.model";
import { JobApplication } from "../models/JobApplication.model";
import AboutPage from "../models/AboutPage.model";

/* ================================
   EXTEND EXPRESS REQUEST
================================ */
export interface AuthRequest extends Request {
  user?: IAdminUser & { _id: Types.ObjectId };
  body: any;
  params: any;
  query: any;
}

/* ================================
   DASHBOARD STATISTICS
================================ */
export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    const totalProjects = await Project.countDocuments();
    const liveProjects = await Project.countDocuments({
      status: { $in: ["On-site", "Design stage"] },
    });
    const categoriesCount = (await Project.distinct("category")).length;

    const applicantsTotal = await JobApplication.countDocuments();
    const newApplicants = await JobApplication.countDocuments({
      appliedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    });
    const shortlisted = await JobApplication.countDocuments({
      status: "SHORTLISTED",
    });

    const recentActivity = await ActivityLog.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: {
        totalProjects,
        liveProjects,
        categoriesCount,
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

/* ================================
   USER MANAGEMENT
================================ */
export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const users = await AdminUser.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: users });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

export const createUser = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password, name, role } = req.body;

    if (!password || password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    const existingUser = await AdminUser.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    const validRole: IAdminUser["role"] =
      role === "super_admin" ||
      role === "hr_hiring" ||
      role === "project_content_manager"
        ? role
        : "project_content_manager";

    const user = await AdminUser.create({
      email,
      password,
      name,
      role: validRole,
    });

    await ActivityLog.create({
      userId: req.user!._id,
      action: "CREATE",
      entityType: "USER",
      entityId: user._id,
      description: `Created user ${user.email}`,
    });

    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to create user",
      error: error.message,
    });
  }
};

export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const user = await AdminUser.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await ActivityLog.create({
      userId: req.user!._id,
      action: "UPDATE",
      entityType: "USER",
      entityId: user._id,
      description: `Updated user ${user.email}`,
    });

    res.json({ success: true, data: user });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to update user",
      error: error.message,
    });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (id === req.user!._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete your own account",
      });
    }

    const user = await AdminUser.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await ActivityLog.create({
      userId: req.user!._id,
      action: "DELETE",
      entityType: "USER",
      entityId: user._id,
      description: `Deleted user ${user.email}`,
    });

    res.json({ success: true, message: "User deleted successfully" });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
      error: error.message,
    });
  }
};

/* ================================
   ABOUT PAGE MANAGEMENT
================================ */

/* GET ABOUT PAGE */
export const getAboutPage = async (req: Request, res: Response) => {
  try {
    let about = await AboutPage.findOne({ page: "ABOUT" });

    if (!about) {
      about = await AboutPage.create({ page: "ABOUT" });
    }

    res.json({
      hero: about.hero || {},
      metrics: about.metrics || [],
      sections: Object.fromEntries(about.sections || []),
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch About page" });
  }
};

/* UPDATE HERO */
export const updateHero = async (req: Request, res: Response) => {
  try {
    const { content, lastModifiedBy } = req.body;

    const about = await AboutPage.findOneAndUpdate(
      { page: "ABOUT" },
      { hero: content, lastModifiedBy },
      { new: true, upsert: true }
    );

    res.json(about?.hero);
  } catch (error) {
    res.status(500).json({ error: "Failed to update hero" });
  }
};

/* UPDATE METRICS */
export const updateMetrics = async (req: Request, res: Response) => {
  try {
    const { content, lastModifiedBy } = req.body;

    const about = await AboutPage.findOneAndUpdate(
      { page: "ABOUT" },
      { metrics: content, lastModifiedBy },
      { new: true, upsert: true }
    );

    res.json(about?.metrics);
  } catch (error) {
    res.status(500).json({ error: "Failed to update metrics" });
  }
};

/* UPDATE SECTIONS */
export const updateSections = async (req: Request, res: Response) => {
  try {
    const { content, lastModifiedBy } = req.body;

    const about = await AboutPage.findOneAndUpdate(
      { page: "ABOUT" },
      { sections: content, lastModifiedBy },
      { new: true, upsert: true }
    );

    res.json(Object.fromEntries(about?.sections || []));
  } catch (error) {
    res.status(500).json({ error: "Failed to update sections" });
  }
};

/* ================================
   ACTIVITY LOGS
================================ */
export const getActivityLogs = async (req: AuthRequest, res: Response) => {
  try {
    const { userId, page = 1, limit = 50 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const query = userId ? { userId } : {};

    const activities = await ActivityLog.find(query)
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await ActivityLog.countDocuments(query);

    res.json({
      success: true,
      data: {
        activities,
        total,
        page: Number(page),
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch activity logs",
      error: error.message,
    });
  }
};
