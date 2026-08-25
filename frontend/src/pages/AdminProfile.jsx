import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { apiService } from '../services/api';
import { Save, AlertCircle, CheckCircle } from 'lucide-react';

const AdminProfile = () => {
    const { profile, refreshData } = usePortfolio();

    const [formData, setFormData] = useState({
        name: '',
        title: '',
        email: '',
        location: '',
        bio: '',
        long_bio: '',
        github_url: '',
        linkedin_url: '',
        resume_url: ''
    });

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', text: '' });

    // Sync profile details to edit form
    useEffect(() => {
        if (profile) {
            setFormData({
                name: profile.name || '',
                title: profile.title || '',
                email: profile.email || '',
                location: profile.location || '',
                bio: profile.bio || '',
                long_bio: profile.long_bio || '',
                github_url: profile.github_url || '',
                linkedin_url: profile.linkedin_url || '',
                resume_url: profile.resume_url || ''
            });
        }
    }, [profile]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: '', text: '' });

        if (!formData.name.trim() || !formData.email.trim()) {
            return setStatus({ type: 'error', text: 'Name and email are mandatory parameters.' });
        }

        try {
            setLoading(true);
            await apiService.updateProfile(formData);
            await refreshData();
            setStatus({ type: 'success', text: 'Developer profile settings updated successfully!' });
        } catch (err) {
            console.error(err);
            setStatus({ type: 'error', text: 'Profile configuration update failed.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '8px' }}>Developer Profile</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '32px' }}>
                Configure name, biography sections, resume sheet URLs and social configurations
            </p>

            <form onSubmit={handleSubmit} style={{ border: '1px solid var(--border-color)', padding: '32px', backgroundColor: 'var(--bg-secondary)', maxWidth: '800px' }}>
                {status.text && (
                    <div
                        style={{
                            padding: '12px 16px',
                            marginBottom: '24px',
                            display: 'flex',
                            alignItems: 'baseline',
                            gap: '8px',
                            fontSize: '0.85rem',
                            backgroundColor: status.type === 'success' ? '#f0fdf4' : '#fef2f2',
                            border: '1px solid',
                            borderColor: status.type === 'success' ? '#bbf7d0' : '#fecaca',
                            color: status.type === 'success' ? '#15803d' : '#991b1b'
                        }}
                    >
                        {status.type === 'success' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                        <span>{status.text}</span>
                    </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="grid-2">
                    <div className="form-group">
                        <label className="form-label">Developer Full Name *</label>
                        <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Professional Title *</label>
                        <input type="text" name="title" className="form-control" value={formData.title} onChange={handleChange} required />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="grid-2">
                    <div className="form-group">
                        <label className="form-label">Contact Email *</label>
                        <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Primary Location</label>
                        <input type="text" name="location" className="form-control" value={formData.location} onChange={handleChange} />
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Short Description (Intro Bio)</label>
                    <input type="text" name="bio" className="form-control" value={formData.bio} onChange={handleChange} placeholder="e.g. Building clean, structured full stack environments..." />
                </div>

                <div className="form-group">
                    <label className="form-label">Detailed Long Biography (HTML allowed)</label>
                    <textarea name="long_bio" rows="6" className="form-control" style={{ resize: 'vertical' }} value={formData.long_bio} onChange={handleChange} />
                </div>

                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginTop: '32px', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                    External Credentials & Links
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="grid-2">
                    <div className="form-group">
                        <label className="form-label">GitHub Account URL</label>
                        <input type="url" name="github_url" className="form-control" value={formData.github_url} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label className="form-label">LinkedIn Profile URL</label>
                        <input type="url" name="linkedin_url" className="form-control" value={formData.linkedin_url} onChange={handleChange} />
                    </div>
                </div>

                <div className="form-group" style={{ marginBottom: '32px' }}>
                    <label className="form-label">Resume / CV Document URL</label>
                    <input type="url" name="resume_url" className="form-control" value={formData.resume_url} onChange={handleChange} placeholder="https://drive.google.com/file/d/..." />
                </div>

                <button type="submit" className="btn-primary" disabled={loading}>
                    <Save size={16} /> {loading ? 'Saving Profile...' : 'Save Profile System Configuration'}
                </button>
            </form>
        </div>
    );
};

export default AdminProfile;
