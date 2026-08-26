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
        console.error('[Message Controller] getMessages error:', error.message);
        res.status(500).json({ error: 'Failed to retrieve messages' });
    }
};

export const createMessage = async (req, res) => {
    const { name, email, subject, message } = req.body;

    // Validation
    if (!name || typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({ error: 'Name is required' });
    }
    if (name.trim().length > 100) {
        return res.status(400).json({ error: 'Name must not exceed 100 characters' });
    }

    if (!email || typeof email !== 'string' || !isValidEmail(email.trim())) {
        return res.status(400).json({ error: 'A valid email address is required' });
    }
    if (email.trim().length > 100) {
        return res.status(400).json({ error: 'Email must not exceed 100 characters' });
    }

    if (!subject || typeof subject !== 'string' || subject.trim() === '') {
        return res.status(400).json({ error: 'Subject is required' });
    }
    if (subject.trim().length > 200) {
        return res.status(400).json({ error: 'Subject must not exceed 200 characters' });
    }

    if (!message || typeof message !== 'string' || message.trim() === '') {
        return res.status(400).json({ error: 'Message content is required' });
    }
    if (message.trim().length > 5000) {
        return res.status(400).json({ error: 'Message must not exceed 5000 characters' });
    }

    try {
        const newMsg = await dbService.createMessage({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            subject: subject.trim(),
            message: message.trim()
        });
        res.status(201).json(newMsg);
    } catch (error) {
        console.error('[Message Controller] createMessage error:', error.message);
        res.status(500).json({ error: 'Failed to send message. Please try again.' });
    }
};

export const markMessageRead = async (req, res) => {
    try {
        const isRead = req.body.read !== undefined ? Boolean(req.body.read) : true;
        const updated = await dbService.markMessageRead(req.params.id, isRead);
        res.json(updated);
    } catch (error) {
        if (error.message === 'Message not found') {
            return res.status(404).json({ error: error.message });
        }
        console.error('[Message Controller] markMessageRead error:', error.message);
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
        console.error('[Message Controller] deleteMessage error:', error.message);
        res.status(500).json({ error: 'Failed to delete message' });
    }
};
