import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Award, Calendar, ExternalLink, ShieldCheck } from 'lucide-react';

const Certifications = () => {
    const { certifications, loading } = usePortfolio();

    if (loading) {
        return (
            <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-muted)' }}>Loading achievements inventory...</p>
            </div>
        );
    }

    return (
        <section style={{ padding: '80px 0' }}>
            <div className="container" style={{ maxWidth: '800px' }}>
                <h2 className="section-title">Certifications & Achievements</h2>
                <p className="section-subtitle">Technical courses, academic excellence and certificates</p>

                {certifications.length === 0 ? (
                    <div style={{ border: '1px solid var(--border-color)', padding: '48px', textAlign: 'center', backgroundColor: 'var(--bg-secondary)' }}>
                        <Award size={36} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>No certifications recorded yet.</p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>New certificates can be updated by the administrator in the management console.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {certifications.map((cert) => (
                            <div
                                key={cert.id}
                                className="card cert-card"
                                style={{
                                    backgroundColor: 'var(--bg-secondary)',
                                    border: '1px solid var(--border-color)',
                                    padding: '24px',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: '20px'
                                }}
                            >
                                <div style={{ padding: '10px', backgroundColor: 'var(--text-primary)', color: '#fff' }}>
                                    <ShieldCheck size={24} />
                                </div>

                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                                        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem' }}>
                                            {cert.name}
                                        </h3>
                                        {cert.issue_date && (
                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                                <Calendar size={12} /> {cert.issue_date}
                                            </span>
                                        )}
                                    </div>

                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                                        Issued by: {cert.issuing_organization}
                                    </p>

                                    {cert.credential_id && (
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                                            ID: {cert.credential_id}
                                        </p>
                                    )}
                                </div>

                                {cert.credential_url && (
                                    <a
                                        href={cert.credential_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-secondary"
                                        style={{ padding: '8px 12px', fontSize: '0.75rem', gap: '4px' }}
                                    >
                                        Verify <ExternalLink size={12} />
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <style>{`
        @media(max-width: 600px) {
          .cert-card {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 16px !important;
          }
          .cert-card a {
            width: 100% !important;
            justify-content: center !important;
          }
        }
      `}</style>
        </section>
    );
};

export default Certifications;
