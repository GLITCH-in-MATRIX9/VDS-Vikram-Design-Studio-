// controllers/hiring.controller.ts

import { Request, Response } from "express";
import Role from "../models/Role";
import JobApplication from "../models/JobApplication.model";
import { sendApplicantConfirmationEmail } from "../services/ApplicantMail.service";
import { sendStudioApplicationEmail } from "../services/StudioMail.service";

import cloudinary from "../config/cloudinary";
import streamifier from "streamifier";

interface SubmitApplicationRequest extends Request {
  file?: Express.Multer.File;
}

/**
 * Submit job application
 * Called AFTER validateJobApplication middleware
 */
export const submitApplication = async (
  req: SubmitApplicationRequest,
  res: Response,
) => {
  try {
    const { roleSlug, city } = req.body;

    // FormData sends answers as string → parse safely
    let answers =
      typeof req.body.answers === "string"
        ? JSON.parse(req.body.answers)
        : req.body.answers;

    /* =========================
       CHECK ROLE + CITY ACTIVE
    ========================= */

    const role = await Role.findOne({
      slug: roleSlug,
      [`cities.${city}`]: true,
    });

    if (!role) {
      return res.status(404).json({
        message: "Role not available for selected city",
      });
    }

    /* =========================
   CLOUDINARY FILE UPLOAD
========================= */

    const applicantData =
      typeof req.body.applicant === "string"
        ? JSON.parse(req.body.applicant)
        : req.body.applicant;

    const applicantName = applicantData?.name || "Applicant";
    const applicantEmail = applicantData?.email || "";

    if (req.file) {
      const safeApplicantName = applicantName
        .replace(/[^a-zA-Z0-9]/g, "_")
        .toUpperCase();

      const uploadFromBuffer = () =>
        new Promise<string>((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              //STORED INSIDE VDS_FOLDER (LIKE PROJECTS)
              folder: `VDS_FOLDER/job_applications/${roleSlug}/${city}/${safeApplicantName}`,
              resource_type: "raw",
            },
            (error, result) => {
              if (error) return reject(error);
              resolve(result?.secure_url || "");
            },
          );

          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });

      const fileUrl = await uploadFromBuffer();

      answers.cvFile = fileUrl;
    }

    /* =========================
       CREATE APPLICATION
    ========================= */

    const application = await JobApplication.create({
      roleSlug,
      city,
      applicant: {
        name: applicantName,
        email: applicantEmail,
      },
      answers,
      status: "submitted",
    });

    console.log(
      `New application: ${applicantName} <${applicantEmail}> for ${role.roleName} (${city})`,
    );

    /* =========================
       EMAILS
    ========================= */

    if (applicantEmail) {
      sendApplicantConfirmationEmail({
        email: applicantEmail,
        name: applicantName,
        position: role.roleName,
      }).catch(console.error);
    }

    sendStudioApplicationEmail({
      applicantName,
      applicantEmail,
      position: role.roleName,
      answers,
    }).catch(console.error);

    res.status(201).json({
      message: "Application submitted successfully!",
      applicationId: application._id,
      roleName: role.roleName,
    });
  } catch (error) {
    console.error("❌ Submit application error:", error);

    res.status(500).json({
      message: "Failed to submit application",
    });
  }
};

/**
 * Get all applications (admin)
 */
export const getApplications = async (req: Request, res: Response) => {
  try {
    const { roleSlug, status, page = 1, limit = 20 } = req.query;
    const skip = ((Number(page) - 1) * Number(limit)) as number;

    const query: any = {};

    if (roleSlug) query.roleSlug = roleSlug;
    if (status) query.status = status;

    const [applications, total] = await Promise.all([
      JobApplication.find(query)
        .sort({ createdAt: -1 })
        .limit(Number(limit))
        .skip(skip)
        .lean(),

      JobApplication.countDocuments(query),
    ]);

    const applicationsWithRole = await Promise.all(
      applications.map(async (app: any) => {
        const role = await Role.findOne({ slug: app.roleSlug }).select(
          "roleName",
        );
        return { ...app, roleName: role?.roleName };
      }),
    );

    res.json({
      applications: applicationsWithRole,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error("❌ Get applications error:", error);
    res.status(500).json({ message: "Failed to fetch applications" });
  }
};

/**
 * Get applications by role slug
 */
export const getApplicationsByRole = async (req: Request, res: Response) => {
  try {
    const { roleSlug } = req.params;

    const applications = await JobApplication.find({ roleSlug })
      .sort({ createdAt: -1 })
      .lean();

    const role = await Role.findOne({ slug: roleSlug });

    res.json({
      roleName: role?.roleName || roleSlug,
      applications: applications.map((app: any) => ({
        ...app,
        roleName: role?.roleName,
      })),
    });
  } catch (error) {
    console.error("❌ Get role applications error:", error);
    res.status(500).json({ message: "Failed to fetch applications" });
  }
};

/**
 * Update application status (admin)
 */
export const updateApplicationStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const allowedStatuses = [
      "submitted",
      "reviewed",
      "shortlisted",
      "rejected",
      "on-hold",
    ];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
        allowedStatuses,
      });
    }

    const application = await JobApplication.findByIdAndUpdate(
      id,
      {
        status,
        notes,
        updatedAt: new Date(),
      },
      { new: true },
    );

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json({
      message: "Status updated successfully",
      application,
    });
  } catch (error) {
    console.error("❌ Update status error:", error);
    res.status(500).json({ message: "Failed to update status" });
  }
};

/**
 * Delete application (admin)
 */
export const deleteApplication = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const application = await JobApplication.findByIdAndDelete(id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json({
      message: "Application deleted successfully",
      deletedId: id,
    });
  } catch (error) {
    console.error("❌ Delete error:", error);
    res.status(500).json({ message: "Failed to delete application" });
  }
};

/**
 * Get application stats (admin dashboard)
 */
export const getApplicationStats = async (req: Request, res: Response) => {
  try {
    const stats = await JobApplication.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    const total = await JobApplication.countDocuments();

    res.json({
      stats,
      total,
      byStatus: stats.reduce((acc: any, stat: any) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {}),
    });
  } catch (error) {
    console.error("❌ Stats error:", error);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
};
