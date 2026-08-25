import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { Mail, RefreshCw, Trash2, CheckCircle, Eye, AlertCircle, EyeOff } from 'lucide-react';

const AdminMessages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedMessage, setSelectedMessage] = useState(null);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await apiService.getMessages();
            setMessages(data);
        } catch (err) {
            console.error(err);
            setError('Could not retrieve database communication entries.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const handleToggleRead = async (id, currentRead) => {
        try {
            await apiService.markMessageRead(id, !currentRead);
            setMessages(messages.map(m => m.id === id ? { ...m, read: !currentRead } : m));
            if (selectedMessage && selectedMessage.id === id) {
                setSelectedMessage({ ...selectedMessage, read: !currentRead });
            }
        } catch (err) {
            console.error('State modification fail:', err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this message permanently?')) return;
        try {
            await apiService.deleteMessage(id);
            setMessages(messages.filter(m => m.id !== id));
            if (selectedMessage && selectedMessage.id === id) {
                setSelectedMessage(null);
            }
        } catch (err) {
            console.error(err);
            alert('Delete operation failed.');
        }
    };

    const handleViewMessage = async (msg) => {
        setSelectedMessage(msg);
        // Auto-mark as read if unread
        if (!msg.read) {
            await handleToggleRead(msg.id, false);
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem' }}>Viewer Messages</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>View connection requests and visitor inquiries</p>
                </div>
                <button onClick={fetchMessages} className="btn-secondary" style={{ gap: '6px' }} disabled={loading}>
                    <RefreshCw size={14} className={loading ? 'spin' : ''} /> Refresh Inbox
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }} className="messages-grid">

                {/* Inbox List */}
                <div>
                    {loading ? (
                        <p style={{ color: 'var(--text-muted)' }}>Synching with data store...</p>
                    ) : error ? (
                        <div style={{ padding: '16px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b' }}>
                            {error}
                        </div>
                    ) : messages.length === 0 ? (
                        <div style={{ border: '1px solid var(--border-color)', padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                            No messages found.
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    onClick={() => handleViewMessage(msg)}
                                    style={{
                                        border: '1px solid',
                                        borderColor: selectedMessage?.id === msg.id ? 'var(--text-primary)' : 'var(--border-color)',
                                        padding: '16px 20px',
                                        cursor: 'pointer',
                                        backgroundColor: msg.read ? 'var(--bg-secondary)' : '#fef2f2',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '4px',
                                        transition: 'all 0.1s ease'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                        <span style={{ fontWeight: msg.read ? '500' : '700', fontSize: '0.95rem' }}>{msg.name}</span>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                            {msg.created_at ? new Date(msg.created_at).toLocaleDateString() : 'N/A'}
                                        </span>
                                    </div>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: msg.read ? '400' : '600' }}>
                                        {msg.subject}
                                    </span>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {msg.message}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Message Viewer Details */}
                <div>
                    {selectedMessage ? (
                        <div style={{ border: '1px solid var(--border-color)', padding: '32px', backgroundColor: 'var(--bg-secondary)', position: 'sticky', top: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '20px' }}>
                                <div>
                                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', marginBottom: '4px' }}>
                                        {selectedMessage.subject}
                                    </h3>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                        From: <strong>{selectedMessage.name}</strong> ({selectedMessage.email})
                                    </p>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                                        Received: {selectedMessage.created_at ? new Date(selectedMessage.created_at).toLocaleString() : 'N/A'}
                                    </p>
                                </div>

                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button
                                        onClick={() => handleToggleRead(selectedMessage.id, selectedMessage.read)}
                                        className="btn-secondary"
                                        style={{ padding: '6px 10px', fontSize: '0.75rem', gap: '4px' }}
                                        title={selectedMessage.read ? 'Mark Unread' : 'Mark Read'}
                                    >
                                        {selectedMessage.read ? <EyeOff size={14} /> : <Eye size={14} />}
                                        {selectedMessage.read ? 'Unread' : 'Read'}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(selectedMessage.id)}
                                        className="btn-danger"
                                        style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>

                            <div>
                                <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '8px', fontWeight: 700 }}>
                                    Message Content
                                </h4>
                                <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                                    {selectedMessage.message}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div style={{ border: '1px solid var(--border-color)', borderStyle: 'dashed', padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
                            <Mail size={32} style={{ margin: '0 auto 12px auto', display: 'block' }} />
                            <p>Select a message from inbox feed to view components details.</p>
                        </div>
                    )}
                </div>
            </div>
            <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin {
          animation: spin 1s linear infinite;
        }
        @media(max-width: 800px) {
          .messages-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
        </div>
    );
};

export default AdminMessages;
