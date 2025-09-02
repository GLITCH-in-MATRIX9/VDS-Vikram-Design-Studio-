import { Request, Response } from 'express';
import { Project } from '../models/Project.model';

export const createProject = async (req: Request, res: Response) => {
  try {
    const {
      name,
      location,
      year,
      status,
      category,
      subCategory,
      client,
      collaborators,
      projectTeam,
      tags,
      keyDate,
      sections,
    } = req.body as Record<string, any>;

    const parsedTags: string[] = typeof tags === 'string' ? JSON.parse(tags) : Array.isArray(tags) ? tags : [];
    const parsedSections = typeof sections === 'string' ? JSON.parse(sections) : Array.isArray(sections) ? sections : [];

    const previewImageUrl = req.file ? `/uploads/previews/${req.file.filename}` : undefined;

    if (!name || !location || !status || !category || !client || !collaborators || !projectTeam || !keyDate) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const project = await Project.create({
      name,
      location,
      year,
      status,
      category,
      subCategory,
      client,
      collaborators,
      projectTeam,
      tags: parsedTags,
      keyDate,
      previewImageUrl,
      sections: parsedSections,
    });

    return res.status(201).json(project);
  } catch (err: any) {
    return res.status(500).json({ message: 'Failed to create project', error: err.message });
  }
};

export const getProjects = async (_req: Request, res: Response) => {
  try {
    const projects = await Project.find({}).sort({ createdAt: -1 });
    return res.status(200).json(projects);
  } catch (err: any) {
    return res.status(500).json({ message: 'Failed to fetch projects', error: err.message });
  }
};

export const getProjectById = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    return res.status(200).json(project);
  } catch (err: any) {
    return res.status(500).json({ message: 'Failed to fetch project', error: err.message });
  }
};


