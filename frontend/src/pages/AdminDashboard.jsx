import React, { useEffect, useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { apiService } from '../services/api';
import {
    FolderGit2,
    Wrench,
    Briefcase,
    Mail,
    AlertCircle,
    CheckCircle,
    Eye,
    Trash2
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    const { projects, skills, experience, education, refreshData } = usePortfolio();
    const [messages, setMessages] = useState([]);
    const [loadingMessages, setLoadingMessages] = useState(true);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                setLoadingMessages(true);
                const data = await apiService.getMessages();
                setMessages(data);
            } catch (err) {
                console.error('Failed to load dashboard messages:', err);
            } finally {
                setLoadingMessages(false);
            }
        };
        fetchMessages();
        refreshData(); // Sync other state variables
    }, []);

    const handleMarkAsRead = async (id, currentStatus) => {
        try {
            await apiService.markMessageRead(id, !currentStatus);
            setMessages(messages.map(m => m.id === id ? { ...m, read: !currentStatus } : m));
        } catch (err) {
            console.error('Failed to shift message state:', err);
        }
    };

    const handleDeleteMessage = async (id) => {
        if (!window.confirm('Are you sure you want to delete this message?')) return;
        try {
            await apiService.deleteMessage(id);
            setMessages(messages.filter(m => m.id !== id));
        } catch (err) {
            console.error('Failed to delete message:', err);
        }
    };

    const unreadMessagesCount = messages.filter(m => !m.read).length;
    const featuredProjectsCount = projects.filter(p => p.featured === true || p.featured === 'true').length;

    const cardStyle = {
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        padding: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '20px'
    };

    const statsIconWrap = {
        padding: '16px',
        backgroundColor: 'var(--text-primary)',
        color: 'var(--bg-primary)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    };

    return (
        <div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '8px' }}>Console Overview</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '32px' }}>
                Live metrics and controls of your developer portfolio
            </p>

            {/* Grid of stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px', marginBottom: '40px' }}>

                <div style={cardStyle}>
                    <div style={statsIconWrap}>
                        <FolderGit2 size={24} />
                    </div>
                    <div>
                        <span style={{ display: 'block', fontSize: '0.8-rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Projects</span>
                        <span style={{ fontSize: '1.8rem', fontWeight: 700, lineHeight: 1 }}>{projects.length}</span>
                        <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>({featuredProjectsCount} featured)</span>
                    </div>
                </div>

                <div style={cardStyle}>
                    <div style={statsIconWrap}>
                        <Wrench size={24} />
                    </div>
                    <div>
                        <span style={{ display: 'block', fontSize: '0.8-rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Skills</span>
                        <span style={{ fontSize: '1.8rem', fontWeight: 700, lineHeight: 1 }}>{skills.length}</span>
                        <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>items recorded</span>
                    </div>
                </div>

                <div style={cardStyle}>
                    <div style={statsIconWrap}>
                        <Briefcase size={24} />
                    </div>
                    <div>
                        <span style={{ display: 'block', fontSize: '0.8-rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Experience</span>
                        <span style={{ fontSize: '1.8rem', fontWeight: 700, lineHeight: 1 }}>{experience.length}</span>
                        <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>internships</span>
                    </div>
                </div>

                <div style={cardStyle}>
                    <div style={statsIconWrap}>
                        <Mail size={24} />
                    </div>
                    <div>
                        <span style={{ display: 'block', fontSize: '0.8-rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Messages</span>
                        <span style={{ fontSize: '1.8rem', fontWeight: 700, lineHeight: 1 }}>{messages.length}</span>
                        <span style={{ display: 'block', fontSize: '0.75rem', color: unreadMessagesCount > 0 ? 'var(--accent-danger)' : 'var(--accent-success)', marginTop: '2px', fontWeight: '500' }}>
                            ({unreadMessagesCount} unread)
                        </span>
                    </div>
                </div>
            </div>

            {/* Row layout: Recent projects + inbox */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }} className="dashboard-grid">

                {/* Featured / Recent projects preview */}
                <div style={{ border: '1px solid var(--border-color)', padding: '24px' }}>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        Featured Portfolio
                        <Link to="/admin/projects" style={{ fontSize: '0.8rem' }}>Manage</Link>
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {projects.slice(0, 5).map(proj => (
                            <div
                                key={proj.id}
                                style={{
                                    padding: '12px 16px',
                                    border: '1px solid var(--border-color)',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    backgroundColor: proj.featured ? '#f0f9ff' : 'transparent',
                                    borderColor: proj.featured ? '#bae6fd' : 'var(--border-color)'
                                }}
                            >
                                <div>
                                    <span style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-primary)' }}>{proj.title}</span>
                                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{proj.category}</span>
                                </div>
                                {proj.featured && <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 600, color: '#0369a1' }}>Featured</span>}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Inbox quick overview */}
                <div style={{ border: '1px solid var(--border-color)', padding: '24px' }}>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        Recent Messages
                        <Link to="/admin/messages" style={{ fontSize: '0.8rem' }}>Inbox</Link>
                    </h3>

                    {loadingMessages ? (
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Loading messages from cloud storage...</p>
                    ) : messages.length === 0 ? (
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No messages in database.</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {messages.slice(0, 4).map(msg => (
                                <div
                                    key={msg.id}
                                    style={{
                                        padding: '12px 16px',
                                        border: '1px solid var(--border-color)',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        backgroundColor: msg.read ? 'transparent' : '#fef2f2',
                                        borderColor: msg.read ? 'var(--border-color)' : '#fecaca'
                                    }}
                                >
                                    <div style={{ flex: 1, marginRight: '16px', overflow: 'hidden' }}>
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'baseline' }}>
                                            <span style={{ fontWeight: msg.read ? '500' : '700', fontSize: '0.9rem' }}>{msg.name}</span>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{msg.email}</span>
                                        </div>
                                        <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{msg.subject}</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button
                                            onClick={() => handleMarkAsRead(msg.id, msg.read)}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
                                            title={msg.read ? 'Mark as Unread' : 'Mark as Read'}
                                        >
                                            {msg.read ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                                        </button>
                                        <button
                                            onClick={() => handleDeleteMessage(msg.id)}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-danger)' }}
                                            title="Delete XML row"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <style>{`
        @media(max-width: 900px) {
          .dashboard-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
        </div>
    );
};

export default AdminDashboard;
