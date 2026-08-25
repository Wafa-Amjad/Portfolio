import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { apiService } from '../services/api';
import { Plus, Trash2, Calendar, MapPin } from 'lucide-react';

const AdminEducation = () => {
    const { education, refreshData } = usePortfolio();
    const [formOpen, setFormOpen] = useState(false);
    const [formData, setFormData] = useState({
        institution: '',
        degree: '',
        field_of_study: '',
        start_date: '',
        end_date: '',
        grade: '',
        location: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const resetForm = () => {
        setFormData({
            institution: '',
            degree: '',
            field_of_study: '',
            start_date: '',
            end_date: '',
            grade: '',
            location: ''
        });
        setFormOpen(false);
        setError(null);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!formData.institution.trim() || !formData.degree.trim() || !formData.start_date.trim()) {
            return setError('Institution, degree and start date are essential requirements.');
        }

        try {
            setLoading(true);
            await apiService.createEducation(formData);
            await refreshData();
            resetForm();
        } catch (err) {
            console.error(err);
            setError('Education record creation failed.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this academic log permanently?')) return;
        try {
            await apiService.deleteEducation(id);
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
                    <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem' }}>Manage Education</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Configure academic records and university stats Path</p>
                </div>
                {!formOpen && (
                    <button onClick={() => setFormOpen(true)} className="btn-primary" style={{ gap: '6px' }}>
                        <Plus size={16} /> Add Record
                    </button>
                )}
            </div>

            {formOpen && (
                <form onSubmit={handleSubmit} style={{ border: '1px solid var(--border-color)', padding: '32px', backgroundColor: 'var(--bg-secondary)', marginBottom: '32px' }}>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: '20px' }}>
                        Add Academic Record
                    </h3>

                    {error && (
                        <div style={{ padding: '10px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', fontSize: '0.85rem', marginBottom: '16px' }}>
                            {error}
                        </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="grid-2">
                        <div className="form-group">
                            <label className="form-label">Institution Name *</label>
                            <input type="text" name="institution" className="form-control" value={formData.institution} onChange={handleChange} placeholder="e.g. COMSATS University Islamabad" required />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Degree *</label>
                            <input type="text" name="degree" className="form-control" value={formData.degree} onChange={handleChange} placeholder="e.g. Bachelor of Science" required />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }} className="form-grid-3">
                        <div className="form-group">
                            <label className="form-label">Field of Study</label>
                            <input type="text" name="field_of_study" className="form-control" value={formData.field_of_study} onChange={handleChange} placeholder="e.g. Computer Science" />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Start Date *</label>
                            <input type="text" name="start_date" className="form-control" value={formData.start_date} onChange={handleChange} placeholder="e.g. 2023" required />
                        </div>

                        <div className="form-group">
                            <label className="form-label">End Date</label>
                            <input type="text" name="end_date" className="form-control" value={formData.end_date} onChange={handleChange} placeholder="e.g. 2027, Present" />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="grid-2">
                        <div className="form-group">
                            <label className="form-label">Grade / GPA (Optional)</label>
                            <input type="text" name="grade" className="form-control" value={formData.grade} onChange={handleChange} placeholder="e.g. CGPA: 3.8/4.0" />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Location (Optional)</label>
                            <input type="text" name="location" className="form-control" value={formData.location} onChange={handleChange} placeholder="e.g. Abbottabad, Abbottabad Campus" />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Recording...' : 'Record Education'}
                        </button>
                        <button type="button" onClick={resetForm} className="btn-secondary">
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {/* Grid listing */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {education.length === 0 ? (
                    <div style={{ border: '1px solid var(--border-color)', padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No education entries logged.
                    </div>
                ) : (
                    education.map((edu) => (
                        <div
                            key={edu.id}
                            style={{
                                border: '1px solid var(--border-color)',
                                padding: '24px',
                                backgroundColor: 'var(--bg-secondary)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}
                        >
                            <div>
                                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: '4px' }}>
                                    {edu.institution}
                                </h4>
                                <p style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                                    {edu.degree} {edu.field_of_study ? `in ${edu.field_of_study}` : ''}
                                </p>
                                <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                        <Calendar size={12} /> {edu.start_date} – {edu.end_date || 'Present'}
                                    </span>
                                    {edu.location && (
                                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                            <MapPin size={12} /> {edu.location}
                                        </span>
                                    )}
                                    {edu.grade && (
                                        <span>Grade: {edu.grade}</span>
                                    )}
                                </div>
                            </div>

                            <button onClick={() => handleDelete(edu.id)} className="btn-danger" style={{ padding: '8px 10px', fontSize: '0.8rem', gap: '4px' }}>
                                <Trash2 size={14} /> Remove
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminEducation;
