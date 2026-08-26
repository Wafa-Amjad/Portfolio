import { dbService } from '../services/db.js';

export const getExperience = async (req, res) => {
    try {
        const experience = await dbService.getExperience();
        res.json(experience);
    } catch (error) {
        console.error('[Experience Controller] getExperience error:', error.message);
        res.status(500).json({ error: 'Failed to retrieve experience' });
    }
};

export const createExperience = async (req, res) => {
    const { company, position, start_date } = req.body;
    if (!company || !position || !start_date) {
        return res.status(400).json({ error: 'Company, position, and start date are required' });
    }

    try {
        const newExp = await dbService.createExperience(req.body);
        res.status(201).json(newExp);
    } catch (error) {
        console.error('[Experience Controller] createExperience error:', error.message);
        res.status(500).json({ error: 'Failed to create experience' });
    }
};

export const updateExperience = async (req, res) => {
    const { company, position, start_date } = req.body;
    if (!company || !position || !start_date) {
        return res.status(400).json({ error: 'Company, position, and start date are required' });
    }

    try {
        const updated = await dbService.updateExperience(req.params.id, req.body);
        res.json(updated);
    } catch (error) {
        if (error.message === 'Experience not found') {
            return res.status(404).json({ error: error.message });
        }
        console.error('[Experience Controller] updateExperience error:', error.message);
        res.status(500).json({ error: 'Failed to update experience' });
    }
};

export const deleteExperience = async (req, res) => {
    try {
        await dbService.deleteExperience(req.params.id);
        res.json({ success: true, message: 'Experience entry deleted successfully' });
    } catch (error) {
        if (error.message === 'Experience not found') {
            return res.status(404).json({ error: error.message });
        }
        console.error('[Experience Controller] deleteExperience error:', error.message);
        res.status(500).json({ error: 'Failed to delete experience' });
    }
};
