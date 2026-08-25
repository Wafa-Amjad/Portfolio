import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';
import { KeyRound, Mail, AlertTriangle, ArrowLeft } from 'lucide-react';

const AdminLogin = () => {
    const { loginAdmin, token } = usePortfolio();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // If token is already present, route to dashboard automatically
    useEffect(() => {
        if (token) {
            navigate('/admin/dashboard');
        }
    }, [token, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!formData.email.trim() || !formData.password.trim()) {
            return setError('Please provide lock key credentials.');
        }

        try {
            setLoading(true);
            await loginAdmin(formData.email.trim(), formData.password);
            navigate('/admin/dashboard');
        } catch (err) {
            console.error('Authentication check failure:', err);
            setError(err.message || 'Verification failure. Please review input.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: 'calc(100vh - 70px)', justifyContent: 'center', alignItems: 'center', backgroundColor: 'var(--bg-secondary)', padding: '24px' }}>
            <div style={{ width: '100%', maxWidth: '420px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', padding: '40px' }}>

                {/* Title */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{ display: 'inline-flex', padding: '12px', backgroundColor: 'var(--text-primary)', color: 'var(--bg-primary)', marginBottom: '16px' }}>
                        <KeyRound size={24} />
                    </div>
                    <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', marginBottom: '8px' }}>
                        Console Login
                    </h2>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Enter credentials to authenticate session
                    </p>
                </div>

                {/* Error Alert */}
                {error && (
                    <div
                        style={{
                            padding: '12px 16px',
                            marginBottom: '24px',
                            display: 'flex',
                            gap: '10px',
                            fontSize: '0.85rem',
                            backgroundColor: '#fef2f2',
                            border: '1px solid #fecaca',
                            color: '#991b1b'
                        }}
                    >
                        <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span>{error}</span>
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="email">Console Email</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                className="form-control"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="wafaamjad058@gmail.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '28px' }}>
                        <label className="form-label" htmlFor="password">Console Password</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            className="form-control"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <button
                            type="submit"
                            className="btn-primary"
                            style={{ width: '100%', justifyContent: 'center' }}
                            disabled={loading}
                        >
                            {loading ? 'Authenticating...' : 'Sign In'}
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="btn-secondary"
                            style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem', borderWidth: '1px' }}
                        >
                            Return Home
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
