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

export const updateProject = async (req: Request, res: Response) => {
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

    // Handle preview image update
    let updateData: any = {
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
      sections: parsedSections,
    };

    // If new preview image is uploaded, update the URL
    if (req.file) {
      updateData.previewImageUrl = `/uploads/previews/${req.file.filename}`;
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    return res.status(200).json(project);
  } catch (err: any) {
    return res.status(500).json({ message: 'Failed to update project', error: err.message });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    return res.status(200).json({ message: 'Project deleted successfully' });
  } catch (err: any) {
    return res.status(500).json({ message: 'Failed to delete project', error: err.message });
  }
};

export const toggleProjectStatus = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Toggle between active/inactive (you can add an 'active' field to the model if needed)
    // For now, we'll just return success
    return res.status(200).json({ message: 'Project status updated', project });
  } catch (err: any) {
    return res.status(500).json({ message: 'Failed to update project status', error: err.message });
  }
};

export const searchProjects = async (req: Request, res: Response) => {
  try {
    const { q, category, status, year } = req.query;
    
    let filter: any = {};
    
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { client: { $regex: q, $options: 'i' } },
        { location: { $regex: q, $options: 'i' } }
      ];
    }
    
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (year) filter.year = year;

    const projects = await Project.find(filter).sort({ createdAt: -1 });
    return res.status(200).json(projects);
  } catch (err: any) {
    return res.status(500).json({ message: 'Failed to search projects', error: err.message });
  }
};


