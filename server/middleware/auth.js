import supabase from '../config/supabase.js';

export const requireAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authorization header missing or malformed' });
    }

    const token = authHeader.split(' ')[1];
    if (!token || token.trim() === '') {
        return res.status(401).json({ error: 'Authentication token required' });
    }

    if (!supabase) {
        return res.status(500).json({ error: 'Supabase authentication service is not configured' });
    }

    try {
        // Validate JWT token strictly with Supabase Auth
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            return res.status(401).json({ error: 'Unauthorized: Invalid or expired Supabase session' });
        }

        // Attach validated user to request object
        req.user = {
            id: user.id,
            email: user.email,
            role: 'admin',
            metadata: user.user_metadata || {}
        };
        return next();
    } catch (error) {
        console.error('[Auth Middleware] Authentication error:', error.message);
        return res.status(500).json({ error: 'Internal server error during session authentication' });
    }
};
