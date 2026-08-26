import React from 'react';

const LoadingScreen = ({ message = 'Loading portfolio details...', fullScreen = false }) => {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: fullScreen ? '100vh' : '55vh',
                padding: '40px 20px',
                textAlign: 'center',
                backgroundColor: fullScreen ? 'var(--bg-primary)' : 'transparent',
            }}
        >
            {/* Main Typography Header */}
            <div style={{ marginBottom: '24px' }}>
                <h1
                    style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '2.5rem',
                        fontWeight: 700,
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        color: 'var(--text-primary)',
                        marginBottom: '8px',
                        lineHeight: 1.1,
                    }}
                >
                    Wafa Amjad
                </h1>
                <p
                    style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.8rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.2em',
                        fontWeight: 600,
                        color: 'var(--text-muted)',
                    }}
                >
                    Full-Stack Developer & Software Engineer
                </p>
            </div>

            {/* Sleek Minimalist Loading Bar */}
            <div
                style={{
                    width: '180px',
                    height: '2px',
                    backgroundColor: 'var(--border-color)',
                    position: 'relative',
                    overflow: 'hidden',
                    marginBottom: '16px',
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: 0,
                        width: '40%',
                        backgroundColor: 'var(--text-primary)',
                        animation: 'loadingSlide 1.4s cubic-bezier(0.65, 0, 0.35, 1) infinite',
                    }}
                />
            </div>

            {/* Context Message */}
            <p
                style={{
                    fontSize: '0.85rem',
                    color: 'var(--text-muted)',
                    letterSpacing: '0.04em',
                }}
            >
                {message}
            </p>

            {/* CSS Animation Keyframes */}
            <style>{`
                @keyframes loadingSlide {
                    0% {
                        left: -40%;
                    }
                    100% {
                        left: 100%;
                    }
                }
            `}</style>
        </div>
    );
};

export default LoadingScreen;
