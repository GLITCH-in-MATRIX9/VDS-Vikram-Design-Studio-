import { Router, Request, Response } from "express";
import JobApplication from "../models/JobApplication.model";
import validateJobApplication from "../middlewares/validateJobApplication";
import { submitApplication } from "../controllers/hiring.controller";

import multer from "multer";

const router = Router();

/* =========================
   MULTER SETUP (FOR FILE UPLOAD)
========================= */

const upload = multer({
  storage: multer.memoryStorage(), 
  limits: {
    fileSize: 1024 * 1024, // 1MB max
  },
});

/* =========================
   GET ALL APPLICATIONS
========================= */

router.get("/", async (_req: Request, res: Response) => {
  try {

    const applications = await JobApplication.find()
      .sort({ createdAt: -1 });

    res.json(applications);

  } catch (err) {

    res.status(500).json({
      message: "Failed to fetch applications"
    });

  }
});


/* =========================
   GET APPLICATIONS BY ROLE + CITY
========================= */

router.get("/role/:roleSlug", async (req: Request, res: Response) => {

  try {

    const { roleSlug } = req.params;
    const { city } = req.query;

    const query: any = { roleSlug };

    if (city) {
      query.city = city;
    }

    const applications = await JobApplication.find(query)
      .sort({ createdAt: -1 });

    res.json(applications);

  } catch (err) {

    res.status(500).json({
      message: "Failed to fetch applications for role"
    });

  }
});


/* =========================
   POST — Submit Application
========================= */

router.post(
  "/",
  upload.single("cvFile"), //
  validateJobApplication,
  submitApplication
);


/* =========================
   PATCH — Update Application Status
========================= */

router.patch("/:id/status", async (req: Request, res: Response) => {

  try {

    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "submitted",
      "reviewed",
      "shortlisted",
      "rejected",
      "on-hold"
    ];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status value",
        allowedStatuses
      });
    }

    const application = await JobApplication.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({
        message: "Application not found"
      });
    }

    res.json({
      message: "Application status updated successfully",
      application
    });

  } catch (error) {

    console.error("Status update error:", error);

    res.status(500).json({
      message: "Failed to update application status"
    });

  }

});


/* =========================
   DELETE — Remove Application
========================= */

router.delete("/:id", async (req: Request, res: Response) => {

  try {

    const { id } = req.params;

    const application = await JobApplication.findByIdAndDelete(id);

    if (!application) {
      return res.status(404).json({
        message: "Application not found"
      });
    }

    res.json({
      message: "Application deleted successfully",
      deletedId: id
    });

  } catch (error) {

    console.error("Delete error:", error);

    res.status(500).json({
      message: "Failed to delete application"
    });

  }

});

export default router;
