import { Request, Response, NextFunction } from "express";

export const validateProject = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    name,
    location,
    status,
    category,
    client,
    collaborators,
    projectTeam,
    keyDate,
    latitude,
    longitude,
  } = req.body;

  const errors: string[] = [];

  if (!name || name.trim().length === 0) {
    errors.push("Project name is required");
  }

  if (!location || location.trim().length === 0) {
    errors.push("Location is required");
  }

  if (
    !status ||
    !["ON-SITE", "DESIGN STAGE", "COMPLETED", "UNBUILT"].includes(
      status.toUpperCase()
    )
  ) {
    errors.push(
      "Status must be one of: ON-SITE, DESIGN STAGE, COMPLETED, UNBUILT"
    );
  }

  if (!category || category.trim().length === 0) {
    errors.push("Category is required");
  }

  if (!client || client.trim().length === 0) {
    errors.push("Client is required");
  }

  if (!collaborators || collaborators.trim().length === 0) {
    errors.push("Collaborators is required");
  }

  if (!projectTeam || projectTeam.trim().length === 0) {
    errors.push("Project team is required");
  }

  if (!keyDate || keyDate.trim().length === 0) {
    errors.push("Key date is required");
  }

  // 🌍 Validate geographic coordinates (if provided)
  if (latitude !== undefined && latitude !== null && latitude !== "") {
    const lat = parseFloat(latitude);
    if (isNaN(lat) || lat < -90 || lat > 90) {
      errors.push("Latitude must be a number between -90 and 90");
    }
  }

  if (longitude !== undefined && longitude !== null && longitude !== "") {
    const lng = parseFloat(longitude);
    if (isNaN(lng) || lng < -180 || lng > 180) {
      errors.push("Longitude must be a number between -180 and 180");
    }
  }

  // Validate tags if provided
  if (req.body.tags) {
    try {
      const tags =
        typeof req.body.tags === "string"
          ? JSON.parse(req.body.tags)
          : req.body.tags;
      if (!Array.isArray(tags)) {
        errors.push("Tags must be an array");
      }
    } catch (error) {
      errors.push("Invalid tags format");
    }
  }

  // Validate sections if provided
  if (req.body.sections) {
    try {
      const sections =
        typeof req.body.sections === "string"
          ? JSON.parse(req.body.sections)
          : req.body.sections;
      if (!Array.isArray(sections)) {
        errors.push("Sections must be an array");
      } else {
        for (const section of sections) {
          if (!section.type || !["text", "image", "gif"].includes(section.type)) {
            errors.push("Each section must have a valid type (text, image, or gif)");
            break;
          }
          if (!section.content || section.content.trim().length === 0) {
            errors.push("Each section must have content");
            break;
          }
        }
      }
    } catch (error) {
      errors.push("Invalid sections format");
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      message: "Validation failed",
      errors,
    });
  }

  next();
};


export const validateAuth = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  const errors: string[] = [];

  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    errors.push("Valid email is required.");
  }

  if (!password || password.length < 6) {
    errors.push("Password must be at least 6 characters.");
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: "Validation failed", errors });
  }

  next();
};

export const validateRegister = (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;
  const errors: string[] = [];

  if (!name || name.trim().length === 0) {
    errors.push("Name is required.");
  }

  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    errors.push("Valid email is required.");
  }

  if (!password || password.length < 6) {
    errors.push("Password must be at least 6 characters.");
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: "Validation failed", errors });
  }

  next();
};
