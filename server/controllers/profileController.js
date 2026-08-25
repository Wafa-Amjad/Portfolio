import { dbService } from '../services/db.js';

export const getProfile = async (req, res) => {
    try {
        const profile = await dbService.getProfile();
        res.json(profile);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve profile details' });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const updated = await dbService.updateProfile(req.body);
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update profile details' });
    }
};
