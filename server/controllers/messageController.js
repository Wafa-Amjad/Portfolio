import { dbService } from '../services/db.js';

// Simple email regex validation
const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const getMessages = async (req, res) => {
    try {
        const messages = await dbService.getMessages();
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve messages' });
    }
};

export const createMessage = async (req, res) => {
    const { name, email, subject, message } = req.body;

    // Validation
    if (!name || name.trim() === '') {
        return res.status(400).json({ error: 'Name is required' });
    }
    if (!email || !isValidEmail(email)) {
        return res.status(400).json({ error: 'A valid email address is required' });
    }
    if (!subject || subject.trim() === '') {
        return res.status(400).json({ error: 'Subject is required' });
    }
    if (!message || message.trim() === '') {
        return res.status(400).json({ error: 'Message content is required' });
    }

    try {
        const newMsg = await dbService.createMessage({
            name: name.trim(),
            email: email.trim(),
            subject: subject.trim(),
            message: message.trim()
        });
        res.status(201).json(newMsg);
    } catch (error) {
        res.status(500).json({ error: 'Failed to send message. Please try again.' });
    }
};

export const markMessageRead = async (req, res) => {
    try {
        // Expect read status in body or default to true
        const isRead = req.body.read !== undefined ? req.body.read : true;
        const updated = await dbService.markMessageRead(req.params.id, isRead);
        res.json(updated);
    } catch (error) {
        if (error.message === 'Message not found') {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: 'Failed to update message status' });
    }
};

export const deleteMessage = async (req, res) => {
    try {
        await dbService.deleteMessage(req.params.id);
        res.json({ success: true, message: 'Message deleted successfully' });
    } catch (error) {
        if (error.message === 'Message not found') {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: 'Failed to delete message' });
    }
};
