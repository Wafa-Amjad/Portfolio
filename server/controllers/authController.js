import supabase from '../config/supabase.js';

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        if (supabase) {
            // Supabase Authentication
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) {
                return res.status(401).json({ error: error.message });
            }

            return res.json({
                token: data.session.access_token,
                user: {
                    id: data.user.id,
                    email: data.user.email,
                    role: 'admin'
                }
            });
        } else {
            // Local fallback Authentication
            const adminEmail = process.env.ADMIN_EMAIL || 'admin@local.portfolio';
            // If ADMIN_PASSWORD is not set, default to 'admin123'
            const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

            if (email === adminEmail && password === adminPassword) {
                return res.json({
                    token: 'mock-admin-token',
                    user: {
                        email,
                        role: 'admin'
                    }
                });
            }

            return res.status(401).json({ error: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Authentication logic error:', error);
        return res.status(500).json({ error: 'Internal server error during authentication' });
    }
};
