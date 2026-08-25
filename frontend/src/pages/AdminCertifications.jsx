import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { apiService } from '../services/api';
import { Plus, Trash2, Calendar, Award } from 'lucide-react';

const AdminCertifications = () => {
    const { certifications, refreshData } = usePortfolio();
    const [formOpen, setFormOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        issuing_organization: '',
        issue_date: '',
        expiration_date: '',
        credential_id: '',
        credential_url: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const resetForm = () => {
        setFormData({
            name: '',
            issuing_organization: '',
            issue_date: '',
            expiration_date: '',
            credential_id: '',
            credential_url: ''
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

        if (!formData.name.trim() || !formData.issuing_organization.trim()) {
            return setError('Certification name and issuing organization are required.');
        }

        try {
            setLoading(true);
            await apiService.createCertification(formData);
            await refreshData();
            resetForm();
        } catch (err) {
            console.error(err);
            setError('Certification registry creation failed.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this certification record permanently?')) return;
        try {
            await apiService.deleteCertification(id);
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
                    <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem' }}>Manage Certifications</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Configure professional achievements and cert validation URLs</p>
                </div>
                {!formOpen && (
                    <button onClick={() => setFormOpen(true)} className="btn-primary" style={{ gap: '6px' }}>
                        <Plus size={16} /> Add Certification
                    </button>
                )}
            </div>

            {formOpen && (
                <form onSubmit={handleSubmit} style={{ border: '1px solid var(--border-color)', padding: '32px', backgroundColor: 'var(--bg-secondary)', marginBottom: '32px' }}>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: '20px' }}>
                        Add Certification / Achievement
                    </h3>

                    {error && (
                        <div style={{ padding: '10px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', fontSize: '0.85rem', marginBottom: '16px' }}>
                            {error}
                        </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="grid-2">
                        <div className="form-group">
                            <label className="form-label">Certification Name *</label>
                            <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} placeholder="e.g. Meta Front-End Developer" required />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Issuing Organization *</label>
                            <input type="text" name="issuing_organization" className="form-control" value={formData.issuing_organization} onChange={handleChange} placeholder="e.g. Coursera / Meta" required />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }} className="form-grid-3">
                        <div className="form-group">
                            <label className="form-label">Credential ID</label>
                            <input type="text" name="credential_id" className="form-control" value={formData.credential_id} onChange={handleChange} placeholder="e.g. CERT-102938" />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Issue Date</label>
                            <input type="text" name="issue_date" className="form-control" value={formData.issue_date} onChange={handleChange} placeholder="e.g. Nov 2023" />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Expiration Date</label>
                            <input type="text" name="expiration_date" className="form-control" value={formData.expiration_date} onChange={handleChange} placeholder="e.g. Dec 2026, None" />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Verification URL</label>
                        <input type="url" name="credential_url" className="form-control" value={formData.credential_url} onChange={handleChange} placeholder="https://coursera.org/verify/..." />
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Recording...' : 'Record Certification'}
                        </button>
                        <button type="button" onClick={resetForm} className="btn-secondary">
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {/* Grid listing array */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {certifications.length === 0 ? (
                    <div style={{ border: '1px solid var(--border-color)', padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No certifications logged yet.
                    </div>
                ) : (
                    certifications.map((cert) => (
                        <div
                            key={cert.id}
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
                                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Award size={18} /> {cert.name}
                                </h4>
                                <p style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                                    {cert.issuing_organization}
                                </p>
                                <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                    {cert.issue_date && (
                                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                            <Calendar size={12} /> Issued: {cert.issue_date}
                                        </span>
                                    )}
                                    {cert.credential_id && (
                                        <span>ID: {cert.credential_id}</span>
                                    )}
                                </div>
                            </div>

                            <button onClick={() => handleDelete(cert.id)} className="btn-danger" style={{ padding: '8px 10px', fontSize: '0.8rem', gap: '4px' }}>
                                <Trash2 size={14} /> Remove
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminCertifications;
