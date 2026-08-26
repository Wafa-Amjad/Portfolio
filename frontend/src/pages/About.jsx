import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Mail, MapPin, GraduationCap, Calendar, FileText } from 'lucide-react';
import LoadingScreen from '../components/LoadingScreen';

const About = () => {
    const { profile, loading } = usePortfolio();

    if (loading) {
        return <LoadingScreen message="Loading biography records..." />;
    }

    return (
        <section style={{ padding: '80px 0' }}>
            <div className="container" style={{ maxWidth: '900px' }}>
                <h2 className="section-title">About Me</h2>
                <p className="section-subtitle">Professional profile and academic overview</p>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '48px', alignItems: 'start' }}>
                    {/* Main Info */}
                    <div>
                        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', marginBottom: '20px' }}>
                            Wafa Amjad
                        </h3>
                        <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.7 }}>
                            {profile?.long_bio ||
                                "I am Wafa Amjad, a Computer Science undergraduate at COMSATS University Islamabad, Abbottabad Campus. I specialize in designing and engineering practical web and mobile applications from concept to deployment."}
                        </p>
                        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: 1.6 }}>
                            My engineering philosophy focuses on content-first layouts, strict security structures, clean relational databases, and highly structured backend environments. I aim to create codebases that are modular, fast, and easy for teams to maintain and scale.
                        </p>

                        <h4 style={{ fontFamily: 'var(--font-sans)', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.08em', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '16px' }}>
                            Academic Context
                        </h4>
                        <div style={{ border: '1px solid var(--border-color)', padding: '24px', backgroundColor: 'var(--bg-secondary)', marginBottom: '40px' }}>
                            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                                <GraduationCap size={24} style={{ color: 'var(--text-primary)', marginTop: '4px' }} />
                                <div>
                                    <h5 style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                                        COMSATS University Islamabad, Abbottabad Campus
                                    </h5>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                                        Bachelor of Science in Computer Science
                                    </p>
                                    <div style={{ display: 'flex', gap: '20px', fontSize: '0.8rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                            <Calendar size={12} /> 2023 – 2027
                                        </span>
                                        <span>Expected Graduation: 2027</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Details Sidebar */}
                    <div style={{ border: '1px solid var(--border-color)', padding: '24px', backgroundColor: 'var(--bg-primary)' }}>
                        <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px solid var(--border-color)' }}>
                            Developer Contact
                        </h4>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <span style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '4px' }}>
                                    Location
                                </span>
                                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                    <MapPin size={14} /> {profile?.location || 'Abbottabad, KPK, Pakistan'}
                                </span>
                            </div>

                            <div>
                                <span style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '4px' }}>
                                    Email
                                </span>
                                <a href={`mailto:${profile?.email || 'wafaamjad058@gmail.com'}`} style={{ fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                    <Mail size={14} /> {profile?.email || 'wafaamjad058@gmail.com'}
                                </a>
                            </div>

                            <div>
                                <span style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '4px' }}>
                                    University Path
                                </span>
                                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                    BS CS (Undergrad)
                                </span>
                            </div>

                            <div>
                                <span style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '4px' }}>
                                    Resume
                                </span>
                                <a
                                    href={profile?.resume_url || '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-secondary"
                                    style={{
                                        padding: '8px 12px',
                                        fontSize: '0.75rem',
                                        width: '100%',
                                        justifyContent: 'center',
                                        marginTop: '4px'
                                    }}
                                >
                                    <FileText size={14} /> View CV / Resume
                                </a>
                            </div>
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

export default About;
