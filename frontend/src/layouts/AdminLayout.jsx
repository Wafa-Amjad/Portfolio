import React, { useEffect } from 'react';
import { NavLink, useNavigate, Outlet, Link } from 'react-router-dom';
import {
    LayoutDashboard,
    FolderGit2,
    Wrench,
    Briefcase,
    GraduationCap,
    Award,
    User,
    Mail,
    LogOut,
    ArrowLeft
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

const AdminLayout = () => {
    const { token, logoutAdmin, user, unreadCount } = usePortfolio();
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate('/admin/login');
        }
    }, [token, navigate]);

    const handleLogout = () => {
        logoutAdmin();
        navigate('/admin/login');
    };

    if (!token) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'var(--font-sans)' }}>
                <p>Redirecting to security authentication...</p>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {/* Admin Top Header */}
            <header className="navbar" style={{ borderBottomColor: 'var(--text-primary)', backgroundColor: 'var(--bg-secondary)' }}>
                <div className="container nav-container" style={{ height: '60px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            <ArrowLeft size={16} /> Back to Site
                        </Link>
                        <span style={{ color: 'var(--border-color-dark)' }}>|</span>
                        <span style={{ fontWeight: '600', letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.85rem' }}>
                            Admin Management Console
                        </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.85rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Logged in: {user?.email}</span>
                        <button
                            onClick={handleLogout}
                            className="btn-secondary"
                            style={{ padding: '6px 12px', fontSize: '0.75rem', gap: '4px', textTransform: 'none' }}
                        >
                            <LogOut size={14} /> Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Admin Dashboard Sidebar + Content Layout */}
            <div className="dashboard-layout">
                <aside className="sidebar">
                    <ul className="sidebar-menu">
                        <li>
                            <NavLink to="/admin/dashboard" end className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                                <LayoutDashboard size={18} /> Overview
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/admin/projects" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                                <FolderGit2 size={18} /> Projects
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/admin/skills" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                                <Wrench size={18} /> Skills
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/admin/experience" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                                <Briefcase size={18} /> Experience
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/admin/education" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                                <GraduationCap size={18} /> Education
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/admin/certifications" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                                <Award size={18} /> Certifications
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/admin/profile" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                                <User size={18} /> Profile
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/admin/messages" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                                <Mail size={18} />
                                <span style={{ flex: 1 }}>Messages</span>
                                {unreadCount > 0 && (
                                    <span style={{
                                        backgroundColor: '#ef4444',
                                        color: '#ffffff',
                                        borderRadius: '10px',
                                        padding: '2px 8px',
                                        fontSize: '0.75rem',
                                        fontWeight: '700',
                                        lineHeight: 1
                                    }}>
                                        {unreadCount}
                                    </span>
                                )}
                            </NavLink>
                        </li>
                    </ul>
                </aside>

                <main className="dashboard-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
