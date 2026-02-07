import { Router, Request, Response } from "express";
import Role from "../models/Role";

const router = Router();

/* =========================
   GET ALL ROLES
========================= */
router.get("/", async (_req: Request, res: Response) => {
  try {
    const roles = await Role.find().select("-fields"); // list view
    res.json(roles);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch roles" });
  }
});

/* =========================
   TOGGLE ROLE ACTIVE STATUS
========================= */
router.patch("/:id/status", async (req, res) => {
  try {
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        message: "isActive must be boolean"
      });
    }

    const role = await Role.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    );

    if (!role) {
      return res.status(404).json({
        message: "Role not found"
      });
    }

    res.json(role);
  } catch (err) {
    console.error("Failed to update role status", err);
    res.status(500).json({
      message: "Failed to update role status"
    });
  }
});


router.post("/fix-is-active", async (_req, res) => {
  const result = await Role.updateMany(
    { isActive: { $exists: false } },
    { $set: { isActive: true } }
  );

  res.json({
    message: "Roles fixed",
    updated: result.modifiedCount
  });
});


// ADMIN: get all roles (including inactive)
router.get("/admin/all", async (_req, res) => {
  const roles = await Role.find().select("-fields");
  res.json(roles);
});


router.get("/:slug", async (req, res) => {
  try {
    const role = await Role.findOne({
      slug: req.params.slug,
      isActive: true
    });

    if (!role) {
      return res.status(404).json({
        message: "Role not found or inactive"
      });
    }

    res.json(role);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch role" });
  }
});




export default router;
