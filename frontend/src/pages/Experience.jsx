import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Calendar, Briefcase, ChevronRight } from 'lucide-react';
import LoadingScreen from '../components/LoadingScreen';

const Experience = () => {
    const { experience, loading } = usePortfolio();

    if (loading) {
        return <LoadingScreen message="Loading professional experience logs..." />;
    }

    return (
        <section style={{ padding: '80px 0' }}>
            <div className="container" style={{ maxWidth: '900px' }}>
                <h2 className="section-title">Professional Experience</h2>
                <p className="section-subtitle">Internships and software development roles</p>

                {experience.length === 0 ? (
                    <div style={{ padding: '40px', border: '1px solid var(--border-color)', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No experience entries registered.
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                        {experience.map((entry) => (
                            <div
                                key={entry.id}
                                className="card"
                                style={{
                                    backgroundColor: 'var(--bg-secondary)',
                                    border: '1px solid var(--border-color)',
                                    padding: '32px'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
                                    <div>
                                        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', marginBottom: '4px' }}>
                                            {entry.position}
                                        </h3>
                                        <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                                            {entry.company}
                                        </h4>
                                    </div>
                                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                        <Calendar size={14} />
                                        <span>{entry.start_date} – {entry.end_date || 'Present'}</span>
                                    </div>
                                </div>

                                <div style={{ marginBottom: '24px' }}>
                                    <h5 style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '12px', fontWeight: 700 }}>
                                        Core Responsibilities & Scope
                                    </h5>
                                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {entry.responsibilities?.map((resp, index) => (
                                            <li key={index} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                                                <ChevronRight size={16} style={{ color: 'var(--text-primary)', marginTop: '4px', flexShrink: 0 }} />
                                                <span>{resp}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {entry.technologies && entry.technologies.length > 0 && (
                                    <div>
                                        <h5 style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 700 }}>
                                            Associated Technologies
                                        </h5>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                            {entry.technologies.map((tech) => (
                                                <span key={tech} className="badge" style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)' }}>
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Experience;
