import { dbService } from '../services/db.js';

export const getSkills = async (req, res) => {
    try {
        const skills = await dbService.getSkills();
        res.json(skills);
    } catch (error) {
        console.error('[Skill Controller] getSkills error:', error.message);
        res.status(500).json({ error: 'Failed to retrieve skills' });
    }
};

export const createSkill = async (req, res) => {
    const { name, category } = req.body;
    if (!name || !category) {
        return res.status(400).json({ error: 'Skill name and category are required' });
    }

    try {
        const newSkill = await dbService.createSkill(req.body);
        res.status(201).json(newSkill);
    } catch (error) {
        console.error('[Skill Controller] createSkill error:', error.message);
        res.status(500).json({ error: 'Failed to create skill' });
    }
};

export const updateSkill = async (req, res) => {
    const { name, category } = req.body;
    if (!name || !category) {
        return res.status(400).json({ error: 'Skill name and category are required' });
    }

    try {
        const updated = await dbService.updateSkill(req.params.id, req.body);
        res.json(updated);
    } catch (error) {
        if (error.message === 'Skill not found') {
            return res.status(404).json({ error: error.message });
        }
        console.error('[Skill Controller] updateSkill error:', error.message);
        res.status(500).json({ error: 'Failed to update skill' });
    }
};

export const deleteSkill = async (req, res) => {
    try {
        await dbService.deleteSkill(req.params.id);
        res.json({ success: true, message: 'Skill deleted successfully' });
    } catch (error) {
        if (error.message === 'Skill not found') {
            return res.status(404).json({ error: error.message });
        }
        console.error('[Skill Controller] deleteSkill error:', error.message);
        res.status(500).json({ error: 'Failed to delete skill' });
    }
};
