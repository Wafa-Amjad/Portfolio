import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Github, Linkedin, Mail, ExternalLink, Code2 } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import LoadingScreen from '../components/LoadingScreen';

const Home = () => {
    const { profile, projects, loading } = usePortfolio();

    if (loading) {
        return <LoadingScreen message="Initializing portfolio..." />;
    }

    const featuredProjects = projects.filter(p => p.featured === true || p.featured === 'true').slice(0, 3);
    const coreStack = ['React.js', 'Node.js', 'Express.js', 'Supabase PostgreSQL', 'Flutter', 'Java', 'Python'];

    return (
        <div style={{ backgroundColor: 'var(--bg-primary)' }}>
            {/* Hero Section */}
            <section style={{ padding: '100px 0 80px 0', borderBottom: '1px solid var(--border-color)' }}>
                <div className="container" style={{ maxWidth: '1000px' }}>
                    <p style={{ textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '16px' }}>
                        Available for Professional Opportunities
                    </p>
                    <h1 style={{ fontSize: '4.5rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '24px', lineHeight: 1.1 }}>
                        {profile?.name || 'WAFA AMJAD'}
                    </h1>
                    <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.5rem', fontWeight: 400, color: 'var(--text-secondary)', marginBottom: '32px', maxWidth: '750px', lineHeight: 1.4 }}>
                        {profile?.title || 'Computer Science Student | Full Stack Developer'}
                    </h2>
                    <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', marginBottom: '40px', maxWidth: '725px', lineHeight: 1.6 }}>
                        {profile?.bio || 'Building practical web and mobile applications using modern technologies.'}
                    </p>

                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '48px' }}>
                        <Link to="/projects" className="btn-primary">
                            View Projects <ArrowRight size={16} />
                        </Link>
                        <Link to="/contact" className="btn-secondary">
                            Contact Me
                        </Link>
                    </div>

                    {/* Social connections */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                        <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, color: 'var(--text-muted)' }}>
                            Follow
                        </span>
                        <a href={profile?.github_url || 'https://github.com/Wafa-Amjad'} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-primary)', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
                            <Github size={16} /> GitHub
                        </a>
                        <a href={profile?.linkedin_url || 'https://www.linkedin.com/in/wafa-a-639a78329/'} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-primary)', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
                            <Linkedin size={16} /> LinkedIn
                        </a>
                    </div>
                </div>
            </section>

            {/* Tech Highlight Banner */}
            <section style={{ padding: '40px 0', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                    <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, color: 'var(--text-muted)' }}>
                        Core Technology Stack
                    </span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px 24px' }}>
                        {coreStack.map((tech) => (
                            <span key={tech} style={{ fontSize: '0.95rem', fontWeight: 500, color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ width: '6px', height: '6px', backgroundColor: 'var(--text-primary)' }}></span>
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Projects Section */}
            <section style={{ padding: '80px 0' }}>
                <div className="container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
                        <div>
                            <h2 className="section-title">Featured Projects</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Select pieces of recent engineering submissions</p>
                        </div>
                        <Link to="/projects" style={{ fontSize: '0.9rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            All Projects <ArrowRight size={14} />
                        </Link>
                    </div>

                    {featuredProjects.length === 0 ? (
                        <div style={{ border: '1px solid var(--border-color)', padding: '40px', textLight: 'center', color: 'var(--text-muted)' }}>
                            No featured projects found.
                        </div>
                    ) : (
                        <div className="grid-3">
                            {featuredProjects.map((project) => (
                                <div key={project.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                    <div>
                                        <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
                                            {project.category}
                                        </span>
                                        <h3 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-serif)', marginBottom: '12px' }}>
                                            {project.title}
                                        </h3>
                                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
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
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Link to={`/projects/${project.id}`} style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                                                View Details
                                            </Link>
                                            {project.github_url && (
                                                <a href={project.github_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)' }}>
                                                    <Github size={16} />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Home;
