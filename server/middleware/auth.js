import supabase from '../config/supabase.js';

export const requireAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authorization header missing or invalid' });
    }

    const token = authHeader.split(' ')[1];

    try {
        if (supabase) {
            // Validate token with Supabase Auth
            const { data: { user }, error } = await supabase.auth.getUser(token);

            if (error || !user) {
                return res.status(401).json({ error: 'Unauthorized: Invalid Supabase session' });
            }

            // Store user object in request for routing
            req.user = user;
            next();
        } else {
            // Local fallback mode
            if (token === 'mock-admin-token') {
                req.user = { email: process.env.ADMIN_EMAIL || 'wafaamjad058@gmail.com', role: 'admin' };
                return next();
            }
            return res.status(401).json({ error: 'Unauthorized: Invalid local token' });
        }
    } catch (error) {
        console.error('Authentication middleware error:', error);
        return res.status(500).json({ error: 'Internal server error during authentication' });
    }
};
