import supabase from '../config/supabase.js';

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    if (!supabase) {
        return res.status(500).json({ error: 'Supabase authentication service is not configured' });
    }

    const trimmedEmail = email.trim().toLowerCase();

    try {
        // Authenticate directly and exclusively with Supabase Auth
        const { data, error } = await supabase.auth.signInWithPassword({
            email: trimmedEmail,
            password
        });

        if (error || !data?.session) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        return res.json({
            token: data.session.access_token,
            user: {
                id: data.user.id,
                email: data.user.email,
                role: 'admin'
            }
        });
    } catch (error) {
        console.error('[Auth Controller] Login exception:', error.message);
        return res.status(500).json({ error: 'Internal server error during authentication' });
    }
};
