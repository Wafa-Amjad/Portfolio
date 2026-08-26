import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';
import { Github, ExternalLink, Filter } from 'lucide-react';
import LoadingScreen from '../components/LoadingScreen';

const Projects = () => {
    const { projects, loading } = usePortfolio();
    const [selectedCategory, setSelectedCategory] = useState('All');

    if (loading) {
        return <LoadingScreen message="Loading projects portfolio..." />;
    }

    // Extract unique categories, sorting them
    const categories = ['All', ...new Set(projects.map(p => p.category).filter(Boolean))];

    const filteredProjects = selectedCategory === 'All'
        ? projects
        : projects.filter(p => p.category === selectedCategory);

    return (
        <section style={{ padding: '80px 0' }}>
            <div className="container">
                <h2 className="section-title">Projects Catalogue</h2>
                <p className="section-subtitle">A collection of academic systems, mobile apps, and full-stack software</p>

                {/* Category Filters (Strict block shapes) */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '40px', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, color: 'var(--text-muted)', marginRight: '8px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <Filter size={14} /> Filter:
                    </span>
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            style={{
                                padding: '6px 14px',
                                fontSize: '0.8rem',
                                cursor: 'pointer',
                                border: '1px solid',
                                borderColor: selectedCategory === category ? 'var(--text-primary)' : 'var(--border-color)',
                                backgroundColor: selectedCategory === category ? 'var(--text-primary)' : 'var(--bg-primary)',
                                color: selectedCategory === category ? 'var(--bg-primary)' : 'var(--text-secondary)',
                                fontWeight: selectedCategory === category ? '600' : '400',
                                transition: 'all 0.15s ease'
                            }}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Grid List */}
                {filteredProjects.length === 0 ? (
                    <div style={{ padding: '40px', border: '1px solid var(--border-color)', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No projects found in this category.
                    </div>
                ) : (
                    <div className="grid-3">
                        {filteredProjects.map((project) => (
                            <div
                                key={project.id}
                                className="card"
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    borderTop: project.featured ? '3px solid var(--text-primary)' : '1px solid var(--border-color)'
                                }}
                            >
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                        <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
                                            {project.category}
                                        </span>
                                        {project.featured && (
                                            <span className="badge success" style={{ margin: 0, fontSize: '0.65rem' }}>Featured</span>
                                        )}
                                    </div>

                                    <h3 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-serif)', marginBottom: '12px' }}>
                                        {project.title}
                                    </h3>

                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '20px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {project.short_description}
                                    </p>
                                </div>

                                <div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '20px' }}>
                                        {project.technologies?.slice(0, 3).map((tech) => (
                                            <span key={tech} className="badge">
                                                {tech}
                                            </span>
                                        ))}
                                        {project.technologies?.length > 3 && (
                                            <span className="badge">+{project.technologies.length - 3} more</span>
                                        )}
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
                                        <Link to={`/projects/${project.id}`} style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                                            View Project Details
                                        </Link>
                                        <div style={{ display: 'flex', gap: '12px' }}>
                                            {project.github_url && (
                                                <a href={project.github_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)' }} title="GitHub Repository">
                                                    <Github size={16} />
                                                </a>
                                            )}
                                            {project.live_url && (
                                                <a href={project.live_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)' }} title="Live Deployment">
                                                    <ExternalLink size={16} />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Projects;
