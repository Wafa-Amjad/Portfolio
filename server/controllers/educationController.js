import { dbService } from '../services/db.js';

export const getEducation = async (req, res) => {
    try {
        const education = await dbService.getEducation();
        res.json(education);
    } catch (error) {
        console.error('[Education Controller] getEducation error:', error.message);
        res.status(500).json({ error: 'Failed to retrieve education' });
    }
};

export const createEducation = async (req, res) => {
    const { institution, degree, start_date } = req.body;
    if (!institution || !degree || !start_date) {
        return res.status(400).json({ error: 'Institution, degree, and start date are required' });
    }

    try {
        const newEdu = await dbService.createEducation(req.body);
        res.status(201).json(newEdu);
    } catch (error) {
        console.error('[Education Controller] createEducation error:', error.message);
        res.status(500).json({ error: 'Failed to create education records' });
    }
};

export const updateEducation = async (req, res) => {
    const { institution, degree, start_date } = req.body;
    if (!institution || !degree || !start_date) {
        return res.status(400).json({ error: 'Institution, degree, and start date are required' });
    }

    try {
        const updated = await dbService.updateEducation(req.params.id, req.body);
        res.json(updated);
    } catch (error) {
        if (error.message === 'Education not found') {
            return res.status(404).json({ error: error.message });
        }
        console.error('[Education Controller] updateEducation error:', error.message);
        res.status(500).json({ error: 'Failed to update education records' });
    }
};

export const deleteEducation = async (req, res) => {
    try {
        await dbService.deleteEducation(req.params.id);
        res.json({ success: true, message: 'Education entry deleted successfully' });
    } catch (error) {
        if (error.message === 'Education not found') {
            return res.status(404).json({ error: error.message });
        }
        console.error('[Education Controller] deleteEducation error:', error.message);
        res.status(500).json({ error: 'Failed to delete education' });
    }
};
