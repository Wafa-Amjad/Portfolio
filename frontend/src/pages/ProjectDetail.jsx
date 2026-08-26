import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiService } from '../services/api';
import { Github, ExternalLink, ArrowLeft, Terminal, Server, Layout, Database, Check } from 'lucide-react';
import LoadingScreen from '../components/LoadingScreen';

const ProjectDetail = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                setLoading(true);
                const data = await apiService.getProjectById(id);
                setProject(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching project detail:', err);
                setError('Project details could not be found or retrieved.');
            } finally {
                setLoading(false);
            }
        };
        fetchProject();
    }, [id]);

    if (loading) {
        return <LoadingScreen message="Retrieving project specifications..." />;
    }

    if (error || !project) {
        return (
            <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', marginBottom: '16px' }}>Project Error</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>{error || 'Project not found.'}</p>
                <Link to="/projects" className="btn-primary">
                    <ArrowLeft size={16} /> Back to Projects
                </Link>
            </div>
        );
    }

    return (
        <section style={{ padding: '60px 0 80px 0' }}>
            <div className="container" style={{ maxWidth: '900px' }}>
                <Link to="/projects" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                    <ArrowLeft size={16} /> Back to Projects Catalogue
                </Link>

                {/* Project Header */}
                <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '32px', marginBottom: '32px' }}>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '12px' }}>
                        <span className="badge success">{project.project_type || 'Academic Project'}</span>
                        <span className="badge accent">{project.category}</span>
                    </div>

                    <h1 style={{ fontSize: '3rem', fontFamily: 'var(--font-serif)', marginBottom: '16px' }}>
                        {project.title}
                    </h1>

                    <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '750px', lineHeight: 1.6 }}>
                        {project.short_description}
                    </p>
                </div>

                {/* Project Splitting Details */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '48px' }}>
                    {/* Main Specs */}
                    <div>
                        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                            Project Overview & Objectives
                        </h3>
                        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                            {project.detailed_description || 'Detailed specifications are missing for this catalog entry.'}
                        </p>

                        {project.highlights && project.highlights.length > 0 && (
                            <div>
                                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                                    Key Implementations & Highlights
                                </h3>
                                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                                    {project.highlights.map((highlight, idx) => (
                                        <li key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                                            <Check size={18} style={{ color: 'var(--text-primary)', marginTop: '2px', flexShrink: 0 }} />
                                            <span>{highlight}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Sidebar Specifications */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {/* Tech Stack */}
                        <div style={{ border: '1px solid var(--border-color)', padding: '24px', backgroundColor: 'var(--bg-secondary)' }}>
                            <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                                Technology Stack
                            </h4>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                {project.technologies?.map((tech) => (
                                    <span key={tech} className="badge" style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)' }}>
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Architecture Details */}
                        <div style={{ border: '1px solid var(--border-color)', padding: '24px' }}>
                            <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                                Development Stats
                            </h4>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.85rem' }}>
                                <div>
                                    <span style={{ display: 'block', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '2px' }}>Role</span>
                                    <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{project.role || 'Developer'}</span>
                                </div>
                                <div>
                                    <span style={{ display: 'block', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '2px' }}>Database Eng</span>
                                    <span style={{ fontWeight: '500', color: 'var(--text-primary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                        <Database size={12} /> {project.database_tech || 'None'}
                                    </span>
                                </div>
                                {project.project_date && (
                                    <div>
                                        <span style={{ display: 'block', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '2px' }}>Submission Date</span>
                                        <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>
                                            {new Date(project.project_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Links Connection */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {project.github_url && (
                                <a
                                    href={project.github_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-primary"
                                    style={{ justifyContent: 'center', width: '100%' }}
                                >
                                    <Github size={16} /> GitHub Repository
                                </a>
                            )}
                            {project.live_url && (
                                <a
                                    href={project.live_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-secondary"
                                    style={{ justifyContent: 'center', width: '100%' }}
                                >
                                    <ExternalLink size={16} /> Live Application
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
        @media(max-width: 768px) {
          div[style*="grid-template-columns: 2fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
        </section>
    );
};

export default ProjectDetail;
