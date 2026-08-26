import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Calendar, GraduationCap, MapPin } from 'lucide-react';

const Education = () => {
    const { education, loading } = usePortfolio();

    if (loading) {
        return (
            <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-muted)' }}>Loading academic logs...</p>
            </div>
        );
    }

    return (
        <section style={{ padding: '80px 0' }}>
            <div className="container" style={{ maxWidth: '800px' }}>
                <h2 className="section-title">Education</h2>
                <p className="section-subtitle">Academic degrees, certifications and study paths</p>

                {education.length === 0 ? (
                    <div style={{ padding: '40px', border: '1px solid var(--border-color)', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No educational credentials registered.
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {education.map((edu) => (
                            <div
                                key={edu.id}
                                className="card education-entry"
                                style={{
                                    backgroundColor: 'var(--bg-secondary)',
                                    border: '1px solid var(--border-color)',
                                    padding: '32px',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    gap: '24px',
                                    alignItems: 'flex-start'
                                }}
                            >
                                <div style={{ padding: '12px', backgroundColor: 'var(--text-primary)', color: 'var(--bg-primary)' }}>
                                    <GraduationCap size={24} />
                                </div>

                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                                        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem' }}>
                                            {edu.institution}
                                        </h3>
                                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '500' }}>
                                            <Calendar size={12} />
                                            <span>{edu.start_date} – {edu.end_date || 'Present'}</span>
                                        </div>
                                    </div>

                                    <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                                        {edu.degree} {edu.field_of_study ? `in ${edu.field_of_study}` : ''}
                                    </h4>

                                    <div style={{ display: 'flex', gap: '20px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                        {edu.location && (
                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                                <MapPin size={12} /> {edu.location}
                                            </span>
                                        )}
                                        {edu.grade && (
                                            <span>{edu.grade}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <style>{`
        @media(max-width: 600px) {
          .education-entry {
            flex-direction: column !important;
            gap: 16px !important;
          }
        }
      `}</style>
        </section>
    );
};

export default Education;
