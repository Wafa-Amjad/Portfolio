import { dbService } from '../services/db.js';

export const getCertifications = async (req, res) => {
    try {
        const certifications = await dbService.getCertifications();
        res.json(certifications);
    } catch (error) {
        console.error('[Certification Controller] getCertifications error:', error.message);
        res.status(500).json({ error: 'Failed to retrieve certifications' });
    }
};

export const createCertification = async (req, res) => {
    const { name, issuing_organization } = req.body;
    if (!name || !issuing_organization) {
        return res.status(400).json({ error: 'Certification name and issuing organization are required' });
    }

    try {
        const newCert = await dbService.createCertification(req.body);
        res.status(201).json(newCert);
    } catch (error) {
        console.error('[Certification Controller] createCertification error:', error.message);
        res.status(500).json({ error: 'Failed to create certification' });
    }
};

export const updateCertification = async (req, res) => {
    const { name, issuing_organization } = req.body;
    if (!name || !issuing_organization) {
        return res.status(400).json({ error: 'Certification name and issuing organization are required' });
    }

    try {
        const updated = await dbService.updateCertification(req.params.id, req.body);
        res.json(updated);
    } catch (error) {
        if (error.message === 'Certification not found') {
            return res.status(404).json({ error: error.message });
        }
        console.error('[Certification Controller] updateCertification error:', error.message);
        res.status(500).json({ error: 'Failed to update certification' });
    }
};

export const deleteCertification = async (req, res) => {
    try {
        await dbService.deleteCertification(req.params.id);
        res.json({ success: true, message: 'Certification deleted successfully' });
    } catch (error) {
        if (error.message === 'Certification not found') {
            return res.status(404).json({ error: error.message });
        }
        console.error('[Certification Controller] deleteCertification error:', error.message);
        res.status(500).json({ error: 'Failed to delete certification' });
    }
};
