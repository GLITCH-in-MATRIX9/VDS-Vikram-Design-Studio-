import { Request, Response } from "express";
import Role from "../models/Role";
import JobApplication from "../models/JobApplication.model";
import { sendApplicantConfirmationEmail } from "../services/ApplicantMail.service";
import { sendStudioApplicationEmail } from "../services/StudioMail.service";
import cloudinary from "../config/cloudinary";

interface SubmitApplicationRequest extends Request {
  file?: Express.Multer.File;
}

/* =======================================================
   SUBMIT APPLICATION - COMPLETE FIXED VERSION
======================================================= */
export const submitApplication = async (
  req: SubmitApplicationRequest,
  res: Response
) => {
  try {

    console.log("📋 FORM FIELDS:", Object.keys(req.body));
    console.log("📁 req.file:", req.file ? "EXISTS" : "MISSING");

    const { answers, roleSlug, city } = req.body;

    const parsedAnswers = JSON.parse(answers);

    let cvFileUrl = "";

    /* ============================
       Upload CV to Cloudinary
    ============================ */

    if (req.file) {
      console.log("🚀 Starting Cloudinary upload...");

      cvFileUrl = await new Promise<string>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "JOB_APPLICATIONS/CV",
            resource_type: "raw",
            access_mode: "public",
          },
          (error, result) => {
            if (error) {
              console.error("❌ Cloudinary error:", error.message);
              reject(error);
            } else if (result) {
              const url = (result as any).secure_url;
              console.log("✅ CV uploaded:", url);
              resolve(url);
            } else {
              reject(new Error("No upload result"));
            }
          }
        );

        if (req.file?.buffer) {
          uploadStream.end(req.file.buffer);
        } else {
          reject(new Error("No file buffer"));
        }
      });
    } else {
      console.log("⚠️ No CV file uploaded");
    }

    parsedAnswers.cvFile = cvFileUrl;

    /* ============================
       Save Application
    ============================ */

    const application = new JobApplication({
      roleSlug,
      city,
      applicant: {
        name: parsedAnswers.fullName || parsedAnswers.name || "Unknown",
        email: parsedAnswers.email || "",
      },
      answers: parsedAnswers,
      status: "submitted",
    });

    await application.save();

    console.log("✅ Application saved to DB:", application._id);

    /* ============================
       Send Emails
    ============================ */

    try {

      await sendApplicantConfirmationEmail({
        email: application.applicant.email,
        name: application.applicant.name,
        position: roleSlug,
      });

      await sendStudioApplicationEmail({
        applicantName: application.applicant.name,
        applicantEmail: application.applicant.email,
        position: roleSlug,
        answers: parsedAnswers,
      });

      console.log("📧 Emails sent successfully");

    } catch (emailError) {
      console.error("⚠️ Email sending failed:", emailError);
    }

    /* ============================
       Response
    ============================ */

    res.json({
      message: "Application submitted successfully!",
      application: {
        id: application._id,
        cvFile: cvFileUrl || null,
      },
    });

  } catch (error) {

    console.error("❌ SubmitApplication ERROR:", error);

    res.status(500).json({
      message: "Failed to submit application",
      error: (error as Error).message,
    });

  }
};


/* =======================================================
   UPDATE STATUS
======================================================= */
export const updateApplicationStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const allowedStatuses = [
      "submitted", "reviewed", "shortlisted", "rejected", "on-hold"
    ];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
        allowedStatuses,
      });
    }

    const application = await JobApplication.findByIdAndUpdate(
      id,
      { status, notes },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json({
      message: "Status updated successfully",
      application,
    });
  } catch (error) {
    console.error("Update status error:", error);
    res.status(500).json({ message: "Failed to update status" });
  }
};

/* =======================================================
   DELETE APPLICATION + CLOUDINARY FILE
======================================================= */
export const deleteApplication = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const application = await JobApplication.findById(id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // ✅ DELETE CLOUDINARY FILE IF EXISTS
    const fileUrl = application.answers?.cvFile;
    if (fileUrl) {
      try {
        const parts = fileUrl.split("/upload/")[1];
        const publicIdWithExtension = parts.substring(parts.indexOf("/") + 1);
        const publicId = publicIdWithExtension.replace(/\.[^/.]+$/, "");

        await cloudinary.uploader.destroy(publicId, {
          resource_type: "raw",
        });
        console.log("✅ Cloudinary file deleted:", publicId);
      } catch (cloudErr) {
        console.error("⚠️ Cloudinary delete failed:", cloudErr);
      }
    }

    await JobApplication.findByIdAndDelete(id);

    res.json({
      message: "Application and CV deleted successfully",
      deletedId: id,
    });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Failed to delete application" });
  }
};
