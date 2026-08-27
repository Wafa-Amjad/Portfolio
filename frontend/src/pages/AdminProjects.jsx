import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { apiService } from '../services/api';
import { Plus, Edit2, Trash2, Star } from 'lucide-react';
import SideSheet from '../components/SideSheet';

const AdminProjects = () => {
    const { projects, refreshData } = usePortfolio();
    const [formOpen, setFormOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Form State (role field removed)
    const [formData, setFormData] = useState({
        title: '',
        short_description: '',
        detailed_description: '',
        category: '',
        technologies: '',
        image_url: '',
        github_url: '',
        live_url: '',
        featured: false,
        project_date: '',
        highlights: '',
        database_tech: '',
        project_type: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const resetForm = () => {
        setFormData({
            title: '',
            short_description: '',
            detailed_description: '',
            category: '',
            technologies: '',
            image_url: '',
            github_url: '',
            live_url: '',
            featured: false,
            project_date: '',
            highlights: '',
            database_tech: '',
            project_type: ''
        });
        setEditingId(null);
        setFormOpen(false);
        setError(null);
    };

    const handleEditClick = (project) => {
        setEditingId(project.id);
        setFormData({
            title: project.title || '',
            short_description: project.short_description || '',
            detailed_description: project.detailed_description || '',
            category: project.category || '',
            technologies: Array.isArray(project.technologies) ? project.technologies.join(', ') : '',
            image_url: project.image_url || '',
            github_url: project.github_url || '',
            live_url: project.live_url || '',
            featured: project.featured === true || project.featured === 'true',
            project_date: project.project_date ? project.project_date.split('T')[0] : '',
            highlights: Array.isArray(project.highlights) ? project.highlights.join('\n') : '',
            database_tech: project.database_tech || '',
            project_type: project.project_type || ''
        });
        setFormOpen(true);
    };

    const handleDeleteClick = async (id) => {
        if (!window.confirm('Are you sure you want to permanently delete this project?')) return;
        try {
            setLoading(true);
            await apiService.deleteProject(id);
            await refreshData();
        } catch (err) {
            console.error(err);
            alert('Delete operation failed');
        } finally {
            setLoading(false);
        }
    };

    const toggleFeatured = async (project) => {
        try {
            await apiService.updateProject(project.id, {
                ...project,
                featured: !project.featured
            });
            await refreshData();
        } catch (err) {
            console.error(err);
            alert('Updating featured status failed');
        }
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

        // Simple validate
        if (!formData.title.trim() || !formData.short_description.trim()) {
            return setError('Title and short description are required.');
        }

        // Parse array variables
        const parsedTech = formData.technologies
            .split(',')
            .map(t => t.trim())
            .filter(t => t !== '');

        const parsedHighlights = formData.highlights
            .split('\n')
            .map(h => h.trim())
            .filter(h => h !== '');

        const payload = {
            ...formData,
            technologies: parsedTech,
            highlights: parsedHighlights
        };

        try {
            setLoading(true);
            if (editingId) {
                await apiService.updateProject(editingId, payload);
            } else {
                await apiService.createProject(payload);
            }
            await refreshData();
            resetForm();
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || 'Database submission failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem' }}>Manage Projects</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Add, update, or remove portfolio items</p>
                </div>
                <button onClick={() => setFormOpen(true)} className="btn-primary" style={{ gap: '6px' }}>
                    <Plus size={16} /> Add Project
                </button>
            </div>

            {/* SideSheet Editor Panel Drawer */}
            <SideSheet
                isOpen={formOpen}
                onClose={resetForm}
                title={editingId ? 'Edit Project Details' : 'Create New Project'}
                subtitle="Configure project metadata, technological stack, and links."
                width="640px"
            >
                <form onSubmit={handleSubmit}>
                    {error && (
                        <div style={{ padding: '12px 16px', border: '1px solid #fecaca', backgroundColor: '#fef2f2', color: '#991b1b', marginBottom: '20px', fontSize: '0.85rem' }}>
                            {error}
                        </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div className="form-group">
                            <label className="form-label">Project Title *</label>
                            <input type="text" name="title" className="form-control" value={formData.title} onChange={handleChange} placeholder="e.g. Lost and Found Portal" required />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Category *</label>
                            <input type="text" name="category" className="form-control" value={formData.category} onChange={handleChange} placeholder="Full Stack, Mobile App..." required />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Short Description *</label>
                        <input type="text" name="short_description" className="form-control" value={formData.short_description} onChange={handleChange} placeholder="Brief one-line summary" required />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Detailed Description / Objectives</label>
                        <textarea name="detailed_description" rows="4" className="form-control" style={{ resize: 'vertical' }} value={formData.detailed_description} onChange={handleChange} placeholder="Detailed explanation of system architecture and features..." />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Technologies (comma separated)</label>
                        <input type="text" name="technologies" className="form-control" value={formData.technologies} onChange={handleChange} placeholder="React, Node.js, Express, Supabase" />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Highlights (one per line)</label>
                        <textarea name="highlights" rows="3" className="form-control" style={{ resize: 'vertical' }} value={formData.highlights} onChange={handleChange} placeholder="Responsive React frontend querying REST API&#10;Secure cloud storage integration" />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div className="form-group">
                            <label className="form-label">Database Tech</label>
                            <input type="text" name="database_tech" className="form-control" value={formData.database_tech} onChange={handleChange} placeholder="Supabase, SQL Server, etc." />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Project Type</label>
                            <input type="text" name="project_type" className="form-control" value={formData.project_type} onChange={handleChange} placeholder="Personal Project, Internship, etc." />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div className="form-group">
                            <label className="form-label">GitHub Repository URL (Optional)</label>
                            <input type="url" name="github_url" className="form-control" value={formData.github_url} onChange={handleChange} placeholder="https://github.com/wafaamjad/..." />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Live Deployment URL (Optional)</label>
                            <input type="url" name="live_url" className="form-control" value={formData.live_url} onChange={handleChange} placeholder="https://..." />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Completion Date</label>
                        <input type="date" name="project_date" className="form-control" value={formData.project_date} onChange={handleChange} />
                    </div>

                    <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '20px 0' }}>
                        <input type="checkbox" name="featured" id="featured" checked={formData.featured} onChange={handleChange} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                        <label htmlFor="featured" style={{ fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer' }}>
                            Feature this project on home landing page
                        </label>
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }} disabled={loading}>
                            {loading ? 'Saving...' : (editingId ? 'Update Project' : 'Create Project')}
                        </button>
                        <button type="button" onClick={resetForm} className="btn-secondary">
                            Cancel
                        </button>
                    </div>
                </form>
            </SideSheet>

            {/* Projects Inventory Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid var(--border-color)', fontSize: '0.9rem' }} id="admin-projects-table">
                <thead>
                    <tr style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                        <th style={{ padding: '12.5px 16px' }}>Featured</th>
                        <th style={{ padding: '12.5px 16px' }}>Project Title</th>
                        <th style={{ padding: '12.5px 16px' }}>Category</th>
                        <th style={{ padding: '12.5px 16px' }}>Completion Date</th>
                        <th style={{ padding: '12.5px 16px', textAlign: 'right' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {projects.map((project) => (
                        <tr key={project.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <td style={{ padding: '12px 16px' }}>
                                <button
                                    onClick={() => toggleFeatured(project)}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: project.featured ? '#eab308' : 'var(--text-muted)' }}
                                    title={project.featured ? 'Click to Un-feature' : 'Click to Feature'}
                                >
                                    <Star size={18} fill={project.featured ? '#eab308' : 'none'} />
                                </button>
                            </td>
                            <td style={{ padding: '12px 16px', fontWeight: '600' }}>{project.title}</td>
                            <td style={{ padding: '12px 16px' }}>{project.category}</td>
                            <td style={{ padding: '12px 16px' }}>
                                {project.project_date ? new Date(project.project_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : 'N/A'}
                            </td>
                            <td style={{ padding: '12px 16px', textAlign: 'right', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                <button onClick={() => handleEditClick(project)} className="btn-secondary" style={{ padding: '6px 10px', fontSize: '0.75rem', gap: '2px', textTransform: 'none' }}>
                                    <Edit2 size={12} /> Edit
                                </button>
                                <button onClick={() => handleDeleteClick(project.id)} className="btn-danger" style={{ padding: '6px 10px', fontSize: '0.75rem', gap: '2px', textTransform: 'none' }}>
                                    <Trash2 size={12} /> Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminProjects;
