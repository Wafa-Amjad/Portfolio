import React, { useState } from 'react';
import { apiService } from '../services/api';
import { Mail, Send, AlertCircle, CheckCircle } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

const Contact = () => {
    const { profile } = usePortfolio();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', text: '' });

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: '', text: '' });

        // Validate name
        if (!formData.name.trim()) {
            return setStatus({ type: 'error', text: 'Name must not be empty.' });
        }

        // Validate email
        if (!formData.email.trim()) {
            return setStatus({ type: 'error', text: 'Email must not be empty.' });
        }
        if (!validateEmail(formData.email)) {
            return setStatus({ type: 'error', text: 'Please provide a valid email format.' });
        }

        // Validate subject
        if (!formData.subject.trim()) {
            return setStatus({ type: 'error', text: 'Subject must not be empty.' });
        }

        // Validate message
        if (!formData.message.trim()) {
            return setStatus({ type: 'error', text: 'Message must not be empty.' });
        }

        try {
            setLoading(true);
            await apiService.sendMessage(formData);

            setStatus({
                type: 'success',
                text: 'Your connection request has been sent successfully. Thank you!'
            });

            // Reset form
            setFormData({
                name: '',
                email: '',
                subject: '',
                message: ''
            });
        } catch (error) {
            console.error('Contact submission error:', error);
            setStatus({
                type: 'error',
                text: error.response?.data?.error || 'Unable to submit your request. Please try again.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <section style={{ padding: '80px 0' }}>
            <div className="container" style={{ maxWidth: '800px' }}>
                <h2 className="section-title">Contact Me</h2>
                <p className="section-subtitle">Reach out for collaborations, project inquiries, or references</p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'start' }}>
                    {/* Information Column */}
                    <div>
                        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', marginBottom: '16px' }}>
                            Let's Connect
                        </h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.95rem', lineHeight: 1.6 }}>
                            Whether you have a full-stack project idea, an internship opportunity, or generic academic questions, feel free to fill out the form or reach out directly via email.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <div style={{ padding: '8px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                                    <Mail size={16} style={{ color: 'var(--text-primary)' }} />
                                </div>
                                <div>
                                    <span style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
                                        Direct Email
                                    </span>
                                    <a href={`mailto:${profile?.email || 'wafaamjad058@gmail.com'}`} style={{ fontSize: '0.9rem', fontWeight: '500' }}>
                                        {profile?.email || 'wafaamjad058@gmail.com'}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Column */}
                    <div>
                        <form onSubmit={handleSubmit} style={{ border: '1px solid var(--border-color)', padding: '32px', backgroundColor: 'var(--bg-secondary)' }}>

                            {/* Alert Message Banner */}
                            {status.text && (
                                <div
                                    style={{
                                        padding: '12px 16px',
                                        marginBottom: '20px',
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: '10px',
                                        fontSize: '0.85rem',
                                        backgroundColor: status.type === 'success' ? '#f0fdf4' : '#fef2f2',
                                        border: '1px solid',
                                        borderColor: status.type === 'success' ? '#bbf7d0' : '#fecaca',
                                        color: status.type === 'success' ? '#15803d' : '#991b1b'
                                    }}
                                >
                                    {status.type === 'success' ? (
                                        <CheckCircle size={16} style={{ marginTop: '2px', flexShrink: 0 }} />
                                    ) : (
                                        <AlertCircle size={16} style={{ marginTop: '2px', flexShrink: 0 }} />
                                    )}
                                    <span>{status.text}</span>
                                </div>
                            )}

                            <div className="form-group">
                                <label className="form-label" htmlFor="name">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    className="form-control"
                                    style={{ backgroundColor: '#fff' }}
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Your full name"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    className="form-control"
                                    style={{ backgroundColor: '#fff' }}
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="name@example.com"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="subject">Subject</label>
                                <input
                                    type="text"
                                    name="subject"
                                    id="subject"
                                    className="form-control"
                                    style={{ backgroundColor: '#fff' }}
                                    value={formData.subject}
                                    onChange={handleChange}
                                    placeholder="Reason for contact"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="message">Message</label>
                                <textarea
                                    name="message"
                                    id="message"
                                    rows="4"
                                    className="form-control"
                                    style={{ backgroundColor: '#fff', resize: 'vertical' }}
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Hi Wafa, I am writing to you because..."
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn-primary"
                                style={{ width: '100%', justifyContent: 'center' }}
                                disabled={loading}
                            >
                                {loading ? 'Sending Message...' : <><Send size={14} /> Send Message</>}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <style>{`
        @media(max-width: 680px) {
          div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
        }
      `}</style>
        </section>
    );
};

export default Contact;
