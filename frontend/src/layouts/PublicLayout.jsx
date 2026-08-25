import React, { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { Menu, X, ArrowUpRight, Github, Linkedin, Mail } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

const PublicLayout = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { profile } = usePortfolio();

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {/* Header / Navbar */}
            <header className="navbar">
                <div className="container nav-container">
                    <Link to="/" className="logo" onClick={closeMobileMenu}>
                        WAFA AMJAD
                    </Link>

                    {/* Desktop Nav */}
                    <nav style={{ display: 'flex', alignItems: 'center' }}>
                        <ul className="nav-menu" style={{ display: 'flex' }}>
                            <li>
                                <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                                    About
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/skills" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                                    Skills
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/projects" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                                    Projects
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/experience" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                                    Experience
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/education" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                                    Education
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/certifications" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                                    Certifications
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                                    Contact
                                </NavLink>
                            </li>
                        </ul>

                        {/* Resume button */}
                        <a
                            href={profile?.resume_url || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-secondary"
                            style={{
                                marginLeft: '24px',
                                padding: '8px 16px',
                                fontSize: '0.8rem',
                                borderWidth: '1px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                            }}
                        >
                            Resume <ArrowUpRight size={14} />
                        </a>

                        {/* Mobile Menu Trigger */}
                        <button
                            onClick={toggleMobileMenu}
                            style={{
                                background: 'none',
                                border: 'none',
                                marginLeft: '16px',
                                cursor: 'pointer',
                                color: 'var(--text-primary)',
                                display: 'none'
                            }}
                            className="mobile-menu-btn"
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </nav>
                </div>

                {/* Mobile Navigation overlay */}
                {mobileMenuOpen && (
                    <div
                        style={{
                            position: 'absolute',
                            top: '70px',
                            left: 0,
                            width: '100%',
                            backgroundColor: 'var(--bg-primary)',
                            borderBottom: '1px solid var(--border-color)',
                            zIndex: 99,
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '16px 24px'
                        }}
                    >
                        <NavLink to="/about" className="nav-link" style={{ padding: '12px 0' }} onClick={closeMobileMenu}>
                            About
                        </NavLink>
                        <NavLink to="/skills" className="nav-link" style={{ padding: '12px 0' }} onClick={closeMobileMenu}>
                            Skills
                        </NavLink>
                        <NavLink to="/projects" className="nav-link" style={{ padding: '12px 0' }} onClick={closeMobileMenu}>
                            Projects
                        </NavLink>
                        <NavLink to="/experience" className="nav-link" style={{ padding: '12px 0' }} onClick={closeMobileMenu}>
                            Experience
                        </NavLink>
                        <NavLink to="/education" className="nav-link" style={{ padding: '12px 0' }} onClick={closeMobileMenu}>
                            Education
                        </NavLink>
                        <NavLink to="/certifications" className="nav-link" style={{ padding: '12px 0' }} onClick={closeMobileMenu}>
                            Certifications
                        </NavLink>
                        <NavLink to="/contact" className="nav-link" style={{ padding: '12px 0' }} onClick={closeMobileMenu}>
                            Contact
                        </NavLink>
                        <a
                            href={profile?.resume_url || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-secondary"
                            style={{
                                marginTop: '16px',
                                textAlign: 'center',
                                justifyContent: 'center',
                                padding: '10px'
                            }}
                            onClick={closeMobileMenu}
                        >
                            View Resume <ArrowUpRight size={14} />
                        </a>
                    </div>
                )}
            </header>

            {/* Main Content Area */}
            <main style={{ flex: 1 }}>
                <Outlet />
            </main>

            {/* Styled Footer */}
            <footer style={{ borderTop: '1px solid var(--border-color)', padding: '40px 0', backgroundColor: 'var(--bg-secondary)' }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                    <div>
                        <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', marginBottom: '4px' }}>WAFA AMJAD</h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            Computer Science Student | Full-Stack Developer
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <a href={profile?.github_url || 'https://github.com/wafaamjad'} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)' }}>
                            <Github size={20} />
                        </a>
                        <a href={profile?.linkedin_url || 'https://linkedin.com/in/wafaamjad'} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)' }}>
                            <Linkedin size={20} />
                        </a>
                        <a href={`mailto:${profile?.email || 'wafaamjad058@gmail.com'}`} style={{ color: 'var(--text-secondary)' }}>
                            <Mail size={20} />
                        </a>
                    </div>
                    <div style={{ width: '100%', borderTop: '1px solid var(--border-color)', marginTop: '20px', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <span>&copy; {new Date().getFullYear()} Wafa Amjad. All rights reserved.</span>
                        <span>
                            <Link to="/admin/dashboard" style={{ color: 'var(--text-muted)' }}>Console</Link>
                        </span>
                    </div>
                </div>
            </footer>

            {/* Responsive CSS inject for nav menu button display */}
            <style>{`
        @media (max-width: 992px) {
          .nav-menu {
            display: none !important;
          }
          .mobile-menu-btn {
            display: inline-flex !important;
          }
        }
      `}</style>
        </div>
    );
};

export default PublicLayout;
