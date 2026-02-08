import { Router, Request, Response } from "express";
import Role from "../models/Role";

const router = Router();

/* =========================
   GET ALL ROLES (PUBLIC)
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
   TOGGLE ROLE CITY STATUS
   (REPLACES isActive)
========================= */

router.patch("/:id/status", async (req: Request, res: Response) => {

  try {

    const { city, state } = req.body;

    if (!city || typeof state !== "boolean") {
      return res.status(400).json({
        message: "city and state(boolean) required"
      });
    }

    if (!["Kolkata", "Guwahati"].includes(city)) {
      return res.status(400).json({
        message: "Invalid city"
      });
    }

    const role = await Role.findByIdAndUpdate(
      req.params.id,
      {
        [`cities.${city}`]: state
      },
      { new: true }
    );

    if (!role) {
      return res.status(404).json({
        message: "Role not found"
      });
    }

    res.json(role);

  } catch (err) {

    console.error("Failed to update role city status", err);

    res.status(500).json({
      message: "Failed to update role city status"
    });

  }
});


/* =========================
   ADMIN: GET ALL ROLES
========================= */

router.get("/admin/all", async (_req, res) => {
  const roles = await Role.find().select("-fields");
  res.json(roles);
});


/* =========================
   GET ROLE BY SLUG + CITY CHECK
========================= */

router.get("/:slug", async (req, res) => {

  try {

    const { city } = req.query;

    if (!city) {
      return res.status(400).json({
        message: "city query required"
      });
    }

    const role = await Role.findOne({
      slug: req.params.slug,
      [`cities.${city}`]: true
    });

    if (!role) {
      return res.status(404).json({
        message: "Role not found or inactive for selected city"
      });
    }

    res.json(role);

  } catch (err) {

    res.status(500).json({
      message: "Failed to fetch role"
    });

  }
});


export default router;
