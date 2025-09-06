import { Request, Response, NextFunction } from 'express';

export const validateProject = (req: Request, res: Response, next: NextFunction) => {
  const { name, location, status, category, client, collaborators, projectTeam, keyDate } = req.body;

  const errors: string[] = [];

  if (!name || name.trim().length === 0) {
    errors.push('Project name is required');
  }

  if (!location || location.trim().length === 0) {
    errors.push('Location is required');
  }

  if (!status || !['Ongoing', 'Completed', 'On Hold'].includes(status)) {
    errors.push('Status must be one of: Ongoing, Completed, On Hold');
  }

  if (!category || category.trim().length === 0) {
    errors.push('Category is required');
  }

  if (!client || client.trim().length === 0) {
    errors.push('Client is required');
  }

  if (!collaborators || collaborators.trim().length === 0) {
    errors.push('Collaborators is required');
  }

  if (!projectTeam || projectTeam.trim().length === 0) {
    errors.push('Project team is required');
  }

  if (!keyDate || keyDate.trim().length === 0) {
    errors.push('Key date is required');
  }

  // Validate tags if provided
  if (req.body.tags) {
    try {
      const tags = typeof req.body.tags === 'string' ? JSON.parse(req.body.tags) : req.body.tags;
      if (!Array.isArray(tags)) {
        errors.push('Tags must be an array');
      }
    } catch (error) {
      errors.push('Invalid tags format');
    }
  }

  // Validate sections if provided
  if (req.body.sections) {
    try {
      const sections = typeof req.body.sections === 'string' ? JSON.parse(req.body.sections) : req.body.sections;
      if (!Array.isArray(sections)) {
        errors.push('Sections must be an array');
      } else {
        for (const section of sections) {
          if (!section.type || !['text', 'image'].includes(section.type)) {
            errors.push('Each section must have a valid type (text or image)');
            break;
          }
          if (!section.content || section.content.trim().length === 0) {
            errors.push('Each section must have content');
            break;
          }
        }
      }
    } catch (error) {
      errors.push('Invalid sections format');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      message: 'Validation failed',
      errors,
    });
  }

  next();
};

export const validateAuth = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  const errors: string[] = [];

  if (!email || email.trim().length === 0) {
    errors.push('Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Email must be valid');
  }

  if (!password || password.trim().length === 0) {
    errors.push('Password is required');
  } else if (password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      message: 'Validation failed',
      errors,
    });
  }

  next();
};
