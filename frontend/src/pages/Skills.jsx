import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import LoadingScreen from '../components/LoadingScreen';

const Skills = () => {
    const { skills, loading } = usePortfolio();

    if (loading) {
        return <LoadingScreen message="Loading technical skills inventory..." />;
    }

    // Group skills by category
    const categories = [
        'Programming Languages',
        'Web Development',
        'Databases',
        'Other Technologies'
    ];

    const getSkillsByCategory = (cat) => {
        return skills.filter(s => s.category?.toLowerCase() === cat.toLowerCase());
    };

    return (
        <section style={{ padding: '80px 0' }}>
            <div className="container">
                <h2 className="section-title">Technical Skills</h2>
                <p className="section-subtitle">Categorized registry of languages, tools, and platforms</p>

                {skills.length === 0 ? (
                    <div style={{ padding: '40px', border: '1px solid var(--border-color)', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No skills recorded.
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
                        {categories.map((category) => {
                            const categorySkills = getSkillsByCategory(category);
                            if (categorySkills.length === 0) return null;

                            return (
                                <div key={category} style={{ border: '1px solid var(--border-color)', padding: '32px', backgroundColor: 'var(--bg-secondary)' }}>
                                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                                        {category}
                                    </h3>

                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
                                        {categorySkills.map((skill) => (
                                            <div
                                                key={skill.id}
                                                style={{
                                                    backgroundColor: 'var(--bg-primary)',
                                                    border: '1px solid var(--border-color)',
                                                    padding: '16px 20px',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: '8px'
                                                }}
                                            >
                                                <span style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '1rem' }}>
                                                    {skill.name}
                                                </span>

                                                {/* Custom visual progress indicator (flat, zero-borderRadius) */}
                                                <div style={{ height: '4px', backgroundColor: 'var(--bg-tertiary)', width: '100%' }}>
                                                    <div
                                                        style={{
                                                            height: '100%',
                                                            backgroundColor: 'var(--text-primary)',
                                                            width: `${parseInt(skill.proficiency) || 80}%`
                                                        }}
                                                    ></div>
                                                </div>
                                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'right' }}>
                                                    {skill.proficiency}% Proficiency
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Skills;
