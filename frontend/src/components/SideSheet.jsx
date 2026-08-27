import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const SideSheet = ({ isOpen, onClose, title, subtitle, children, width = '560px' }) => {
    // Lock scroll on main document body when sheet is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Handle Escape key to close
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', justifyContent: 'flex-end' }}>
            {/* Backdrop */}
            <div
                onClick={onClose}
                style={{
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(15, 23, 42, 0.5)',
                    backdropFilter: 'blur(3px)',
                    transition: 'opacity 0.25s ease',
                    zIndex: 1001
                }}
            />

            {/* Slide-over Drawer Panel */}
            <div
                style={{
                    position: 'relative',
                    zIndex: 1002,
                    width: '100%',
                    maxWidth: width,
                    height: '100vh',
                    backgroundColor: 'var(--bg-primary, #ffffff)',
                    boxShadow: '-8px 0 32px rgba(0, 0, 0, 0.15)',
                    display: 'flex',
                    flexDirection: 'column',
                    animation: 'sideSheetSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
                }}
            >
                {/* Header */}
                <div
                    style={{
                        padding: '24px 32px',
                        borderBottom: '1px solid var(--border-color, #e2e8f0)',
                        backgroundColor: 'var(--bg-secondary, #f8fafc)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start'
                    }}
                >
                    <div>
                        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 600, margin: 0, color: 'var(--text-primary)' }}>
                            {title}
                        </h3>
                        {subtitle && (
                            <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                {subtitle}
                            </p>
                        )}
                    </div>

                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: '1px solid var(--border-color)',
                            padding: '6px',
                            cursor: 'pointer',
                            color: 'var(--text-secondary)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.15s ease'
                        }}
                        title="Close Sheet"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Scrollable Form Body */}
                <div
                    style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: '32px'
                    }}
                >
                    {children}
                </div>
            </div>

            <style>{`
                @keyframes sideSheetSlideIn {
                    from {
                        transform: translateX(100%);
                    }
                    to {
                        transform: translateX(0);
                    }
                }
            `}</style>
        </div>
    );
};

export default SideSheet;
