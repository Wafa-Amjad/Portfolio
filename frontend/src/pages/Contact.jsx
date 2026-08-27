import React, { useState } from 'react';
import { apiService } from '../services/api';
import { Send, AlertCircle, CheckCircle, MessageSquare } from 'lucide-react';

const Contact = () => {
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
                text: 'Your message has been sent successfully. Thank you for connecting!'
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
            <div className="container" style={{ maxWidth: '680px', margin: '0 auto' }}>
                {/* Centered Header */}
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <div style={{ display: 'inline-flex', padding: '12px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', marginBottom: '16px' }}>
                        <MessageSquare size={28} style={{ color: 'var(--text-primary)' }} />
                    </div>
                    <h2 className="section-title" style={{ marginBottom: '12px' }}>Let's Connect</h2>
                    <p className="section-subtitle" style={{ maxWidth: '520px', margin: '0 auto' }}>
                        Have a full-stack project idea, an internship opportunity, or testing feedback? Send a message directly below.
                    </p>
                </div>

                {/* Form Container */}
                <div style={{ border: '1px solid var(--border-color)', padding: '36px', backgroundColor: 'var(--bg-secondary)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                    <form onSubmit={handleSubmit}>
                        {/* Alert Message Banner */}
                        {status.text && (
                            <div
                                style={{
                                    padding: '14px 16px',
                                    marginBottom: '24px',
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '10px',
                                    fontSize: '0.9rem',
                                    backgroundColor: status.type === 'success' ? '#f0fdf4' : '#fef2f2',
                                    border: '1px solid',
                                    borderColor: status.type === 'success' ? '#bbf7d0' : '#fecaca',
                                    color: status.type === 'success' ? '#15803d' : '#991b1b'
                                }}
                            >
                                {status.type === 'success' ? (
                                    <CheckCircle size={18} style={{ marginTop: '2px', flexShrink: 0 }} />
                                ) : (
                                    <AlertCircle size={18} style={{ marginTop: '2px', flexShrink: 0 }} />
                                )}
                                <span>{status.text}</span>
                            </div>
                        )}

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="form-grid-2">
                            <div className="form-group">
                                <label className="form-label" htmlFor="name">Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    className="form-control"
                                    style={{ backgroundColor: '#fff' }}
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Your full name"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="email">Email *</label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    className="form-control"
                                    style={{ backgroundColor: '#fff' }}
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="name@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="subject">Subject *</label>
                            <input
                                type="text"
                                name="subject"
                                id="subject"
                                className="form-control"
                                style={{ backgroundColor: '#fff' }}
                                value={formData.subject}
                                onChange={handleChange}
                                placeholder="Reason for contacting"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="message">Message *</label>
                            <textarea
                                name="message"
                                id="message"
                                rows="5"
                                className="form-control"
                                style={{ backgroundColor: '#fff', resize: 'vertical' }}
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="Hi Wafa, I would like to discuss..."
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn-primary"
                            style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '0.95rem' }}
                            disabled={loading}
                        >
                            {loading ? 'Sending Message...' : <><Send size={16} /> Send Message</>}
                        </button>
                    </form>
                </div>
            </div>
            <style>{`
                @media(max-width: 600px) {
                    .form-grid-2 {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </section>
    );
};

export default Contact;
