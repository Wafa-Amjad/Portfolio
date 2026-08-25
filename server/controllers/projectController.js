import { dbService } from '../services/db.js';

export const getProjects = async (req, res) => {
    try {
        const projects = await dbService.getProjects();
        res.json(projects);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve projects' });
    }
};

export const getProjectById = async (req, res) => {
    try {
        const project = await dbService.getProjectById(req.params.id);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.json(project);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve project' });
    }
};

export const createProject = async (req, res) => {
    const { title, short_description } = req.body;
    if (!title || !short_description) {
        return res.status(400).json({ error: 'Title and short description are required' });
    }

    try {
        const newProject = await dbService.createProject(req.body);
        res.status(201).json(newProject);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create project' });
    }
};

export const updateProject = async (req, res) => {
    const { title, short_description } = req.body;
    if (!title || !short_description) {
        return res.status(400).json({ error: 'Title and short description are required' });
    }

    try {
        const updated = await dbService.updateProject(req.params.id, req.body);
        res.json(updated);
    } catch (error) {
        if (error.message === 'Project not found') {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: 'Failed to update project' });
    }
};

export const deleteProject = async (req, res) => {
    try {
        await dbService.deleteProject(req.params.id);
        res.json({ success: true, message: 'Project deleted successfully' });
    } catch (error) {
        if (error.message === 'Project not found') {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: 'Failed to delete project' });
    }
};
