import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { apiService } from '../services/api';
import { Plus, Trash2 } from 'lucide-react';

const AdminSkills = () => {
    const { skills, refreshData } = usePortfolio();
    const [formData, setFormData] = useState({
        name: '',
        proficiency: 80,
        category: 'Programming Languages'
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const resetForm = () => {
        setFormData({
            name: '',
            proficiency: 80,
            category: 'Programming Languages'
        });
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

        if (!formData.name.trim()) {
            return setError('Skill name is required.');
        }

        try {
            setLoading(true);
            await apiService.createSkill({
                name: formData.name.trim(),
                proficiency: parseInt(formData.proficiency) || 80,
                category: formData.category
            });
            await refreshData();
            resetForm();
        } catch (err) {
            console.error(err);
            setError('Failed to record skill.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this skill from portfolio?')) return;
        try {
            await apiService.deleteSkill(id);
            await refreshData();
        } catch (err) {
            console.error(err);
            alert('Delete operation failed.');
        }
    };

    return (
        <div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '8px' }}>Manage Skills</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '32px' }}>
                Configure proficiency bars and technical categories
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }} className="skills-grid">

                {/* Creation Box */}
                <div>
                    <form onSubmit={handleSubmit} style={{ border: '1px solid var(--border-color)', padding: '24px', backgroundColor: 'var(--bg-secondary)', position: 'sticky', top: '20px' }}>
                        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: '20px' }}>
                            Add Technology Skill
                        </h3>

                        {error && (
                            <div style={{ padding: '10px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', fontSize: '0.85rem', marginBottom: '16px' }}>
                                {error}
                            </div>
                        )}

                        <div className="form-group">
                            <label className="form-label">Technology Name *</label>
                            <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} placeholder="e.g. React.js, Java" required />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Category *</label>
                            <select name="category" className="form-control" value={formData.category} onChange={handleChange}>
                                <option value="Programming Languages">Programming Languages</option>
                                <option value="Web Development">Web Development</option>
                                <option value="Databases">Databases</option>
                                <option value="Other Technologies">Other Technologies</option>
                            </select>
                        </div>

                        <div className="form-group" style={{ marginBottom: '24px' }}>
                            <label className="form-label">Proficiency ({formData.proficiency}%)</label>
                            <input
                                type="range"
                                name="proficiency"
                                min="1"
                                max="100"
                                className="form-control"
                                style={{ padding: 0, height: 'auto', cursor: 'pointer' }}
                                value={formData.proficiency}
                                onChange={handleChange}
                            />
                        </div>

                        <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
                            <Plus size={16} /> Record Skill
                        </button>
                    </form>
                </div>

                {/* Dynamic table listing */}
                <div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid var(--border-color)', fontSize: '0.9rem' }}>
                        <thead>
                            <tr style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                                <th style={{ padding: '12.5px 16px' }}>Skill</th>
                                <th style={{ padding: '12.5px 16px' }}>Category</th>
                                <th style={{ padding: '12.5px 16px' }}>Proficiency</th>
                                <th style={{ padding: '12.5px 16px', textAlign: 'right' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {skills.length === 0 ? (
                                <tr>
                                    <td colSpan="4" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                                        No technical skills found.
                                    </td>
                                </tr>
                            ) : (
                                skills.map((skill) => (
                                    <tr key={skill.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <td style={{ padding: '12.5px 16px', fontWeight: '600' }}>{skill.name}</td>
                                        <td style={{ padding: '12.5px 16px', fontSize: '0.85rem' }}>{skill.category}</td>
                                        <td style={{ padding: '12.5px 16px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div style={{ flex: 1, height: '4px', backgroundColor: 'var(--bg-tertiary)' }}>
                                                    <div style={{ height: '100%', backgroundColor: 'var(--text-primary)', width: `${skill.proficiency}%` }}></div>
                                                </div>
                                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', width: '36px', textAlign: 'right' }}>{skill.proficiency}%</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '12.5px 16px', textAlign: 'right' }}>
                                            <button onClick={() => handleDelete(skill.id)} className="btn-danger" style={{ padding: '6px 8px', fontSize: '0.75rem' }}>
                                                <Trash2 size={12} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <style>{`
        @media(max-width: 800px) {
          .skills-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
        </div>
    );
};

export default AdminSkills;
