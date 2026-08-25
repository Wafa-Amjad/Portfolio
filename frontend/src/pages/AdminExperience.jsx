import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { apiService } from '../services/api';
import { Plus, Trash2, Calendar, FileText } from 'lucide-react';

const AdminExperience = () => {
    const { experience, refreshData } = usePortfolio();
    const [formOpen, setFormOpen] = useState(false);
    const [formData, setFormData] = useState({
        position: '',
        company: '',
        start_date: '',
        end_date: '',
        current: false,
        responsibilities: '',
        technologies: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const resetForm = () => {
        setFormData({
            position: '',
            company: '',
            start_date: '',
            end_date: '',
            current: false,
            responsibilities: '',
            technologies: ''
        });
        setFormOpen(false);
        setError(null);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!formData.position.trim() || !formData.company.trim() || !formData.start_date.trim()) {
            return setError('Position, company and start date are required.');
        }

        const parsedResponsibilities = formData.responsibilities
            .split('\n')
            .map(r => r.trim())
            .filter(r => r !== '');

        const parsedTech = formData.technologies
            .split(',')
            .map(t => t.trim())
            .filter(t => t !== '');

        const payload = {
            position: formData.position.trim(),
            company: formData.company.trim(),
            start_date: formData.start_date.trim(),
            end_date: formData.current ? 'Present' : formData.end_date.trim(),
            responsibilities: parsedResponsibilities,
            technologies: parsedTech
        };

        try {
            setLoading(true);
            await apiService.createExperience(payload);
            await refreshData();
            resetForm();
        } catch (err) {
            console.error(err);
            setError('Failed to record professional experience.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this entry permanently?')) return;
        try {
            await apiService.deleteExperience(id);
            await refreshData();
        } catch (err) {
            console.error(err);
            alert('Delete operation failed.');
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem' }}>Manage Experience</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Configure professional internships and work timelines</p>
                </div>
                {!formOpen && (
                    <button onClick={() => setFormOpen(true)} className="btn-primary" style={{ gap: '6px' }}>
                        <Plus size={16} /> Add Experience
                    </button>
                )}
            </div>

            {formOpen && (
                <form onSubmit={handleSubmit} style={{ border: '1px solid var(--border-color)', padding: '32px', backgroundColor: 'var(--bg-secondary)', marginBottom: '32px' }}>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: '20px' }}>
                        Record Work/Internship Experience
                    </h3>

                    {error && (
                        <div style={{ padding: '10px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', fontSize: '0.85rem', marginBottom: '16px' }}>
                            {error}
                        </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="grid-2">
                        <div className="form-group">
                            <label className="form-label">Position *</label>
                            <input type="text" name="position" className="form-control" value={formData.position} onChange={handleChange} placeholder="e.g. Full-Stack Dev Intern" required />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Company Name *</label>
                            <input type="text" name="company" className="form-control" value={formData.company} onChange={handleChange} placeholder="e.g. Tech Incubator" required />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', alignItems: 'end' }} className="form-grid-3">
                        <div className="form-group">
                            <label className="form-label">Start Date *</label>
                            <input type="text" name="start_date" className="form-control" value={formData.start_date} onChange={handleChange} placeholder="e.g. Oct 2023" required />
                        </div>

                        <div className="form-group">
                            <label className="form-label">End Date</label>
                            <input
                                type="text"
                                name="end_date"
                                className="form-control"
                                value={formData.end_date}
                                onChange={handleChange}
                                placeholder="e.g. Present, Dec 2023"
                                disabled={formData.current}
                            />
                        </div>

                        <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                            <input
                                type="checkbox"
                                name="current"
                                id="current"
                                checked={formData.current}
                                onChange={handleChange}
                                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                            />
                            <label htmlFor="current" style={{ fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer' }}>
                                Currently working here
                            </label>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Responsibilities (One per line)</label>
                        <textarea
                            name="responsibilities"
                            rows="4"
                            className="form-control"
                            style={{ resize: 'vertical' }}
                            value={formData.responsibilities}
                            onChange={handleChange}
                            placeholder="Designed RESTful API endpoints&#10;Configured local Supabase fallbacks"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Associated Technologies (comma separated)</label>
                        <input type="text" name="technologies" className="form-control" value={formData.technologies} onChange={handleChange} placeholder="Node.js, Express, PostgreSQL" />
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Recording...' : 'Record Experience'}
                        </button>
                        <button type="button" onClick={resetForm} className="btn-secondary">
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {/* Experience Timeline details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {experience.length === 0 ? (
                    <div style={{ border: '1px solid var(--border-color)', padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No professional experience records loaded.
                    </div>
                ) : (
                    experience.map((entry) => (
                        <div
                            key={entry.id}
                            style={{
                                border: '1px solid var(--border-color)',
                                padding: '24px',
                                backgroundColor: 'var(--bg-secondary)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start'
                            }}
                        >
                            <div>
                                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: '4px' }}>
                                    {entry.position}
                                </h4>
                                <p style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                                    {entry.company}
                                </p>
                                <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                        <Calendar size={12} /> {entry.start_date} – {entry.end_date || 'Present'}
                                    </span>
                                </div>

                                {entry.responsibilities && entry.responsibilities.length > 0 && (
                                    <ul style={{ listStyle: 'circle', display: 'flex', flexDirection: 'column', gap: '4px', paddingLeft: '20px', marginBottom: '12px' }}>
                                        {entry.responsibilities.map((resp, i) => (
                                            <li key={i} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{resp}</li>
                                        ))}
                                    </ul>
                                )}

                                {entry.technologies && entry.technologies.length > 0 && (
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                        {entry.technologies.map((t) => (
                                            <span key={t} className="badge" style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)' }}>
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <button onClick={() => handleDelete(entry.id)} className="btn-danger" style={{ padding: '8px 10px', fontSize: '0.8rem', gap: '4px' }}>
                                <Trash2 size={14} /> Remove
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminExperience;
