import { Request, Response, NextFunction } from "express";
import Role from "../models/Role";

const validateJobApplication = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { roleSlug, answers } = req.body;

    if (!roleSlug || !answers) {
      return res.status(400).json({
        message: "roleSlug and answers are required",
      });
    }

    const role = await Role.findOne({ slug: roleSlug });

    if (!role) {
      return res.status(400).json({
        message: "Invalid role",
      });
    }

    const roleFields = role.fields;

    /* =========================
       Validate REQUIRED fields
    ========================= */

    const missingFields: string[] = [];

    for (const field of roleFields) {
      if (field.required) {
        const value = answers[field.name];

        const isEmpty =
          value === undefined ||
          value === null ||
          value === "" ||
          (Array.isArray(value) && value.length === 0);

        if (isEmpty) {
          missingFields.push(field.label);
        }
      }
    }

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: "Missing required fields",
        missingFields,
      });
    }

    /* =========================
       Reject UNKNOWN fields
    ========================= */

    const allowedFieldNames = roleFields.map((f: any) => f.name);

    const unknownFields = Object.keys(answers).filter(
      (key) => !allowedFieldNames.includes(key),
    );

    if (unknownFields.length > 0) {
      return res.status(400).json({
        message: "Unknown fields detected",
        unknownFields,
      });
    }

    next();
  } catch (err) {
    console.error("Validation error:", err);
    res.status(500).json({
      message: "Validation failed",
    });
  }
};

export default validateJobApplication;
