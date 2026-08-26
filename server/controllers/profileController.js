import { dbService } from '../services/db.js';

export const getProfile = async (req, res) => {
    try {
        const profile = await dbService.getProfile();
        res.json(profile);
    } catch (error) {
        console.error('[Profile Controller] getProfile error:', error.message);
        res.status(500).json({ error: 'Failed to retrieve profile details' });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const userId = req.user?.id || null;
        const updated = await dbService.updateProfile(req.body, userId);
        res.json(updated);
    } catch (error) {
        console.error('[Profile Controller] updateProfile error:', error.message);
        res.status(500).json({ error: error.message || 'Failed to update profile details' });
    }
};
