import '@/styles/globals.css';
import '@/styles/glass.css';
import '@/styles/theme.css';
import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

function PageLoader({ onFinish }) {
    const [progress, setProgress] = useState(0);
    const [fadeOut, setFadeOut] = useState(false);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const checkReady = () => setReady(true);
        if (document.readyState === 'complete') setReady(true);
        else window.addEventListener('load', checkReady);
        return () => window.removeEventListener('load', checkReady);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (!ready && prev >= 85) return prev + 0.5;
                if (prev >= 100) {
                    clearInterval(interval);
                    setFadeOut(true);
                    setTimeout(onFinish, 500);
                    return 100;
                }
                return prev + Math.random() * 10 + 2;
            });
        }, 100);
        return () => clearInterval(interval);
    }, [onFinish, ready]);

    useEffect(() => {
        if (ready && progress >= 85 && progress < 100) {
            setProgress(100);
            setFadeOut(true);
            setTimeout(onFinish, 500);
        }
    }, [ready, progress, onFinish]);

    return (
        <div className={`page-loader ${fadeOut ? 'fade-out' : ''}`}>
            <div className="loader-content">
                <div className="loader-rings">
                    <div className="ring ring-1" />
                    <div className="ring ring-2" />
                    <div className="loader-core" />
                </div>
                <div className="loader-brand">
                    <h1 className="brand-text">QueryMindAI</h1>
                </div>
                <div className="loader-progress-track">
                    <div className="loader-progress-fill" style={{ width: `${Math.min(progress, 100)}%` }} />
                </div>
                <p className="loader-status">
                    {progress < 30 ? 'Initializing...' :
                        progress < 60 ? 'Loading modules...' :
                            progress < 85 ? 'Preparing interface...' : 'Almost ready...'}
                </p>
            </div>

            <style jsx>{`
                .page-loader {
                    position: fixed; inset: 0; z-index: 99999;
                    display: flex; align-items: center; justify-content: center;
                    background: #000; transition: opacity 0.5s ease;
                }
                .page-loader.fade-out { opacity: 0; pointer-events: none; }
                .loader-content { display: flex; flex-direction: column; align-items: center; gap: 28px; }
                .loader-rings { position: relative; width: 80px; height: 80px; }
                .ring { position: absolute; border-radius: 50%; border: 2px solid transparent; }
                .ring-1 { inset: 0; border-top-color: var(--pearl); animation: spin 1.2s linear infinite; }
                .ring-2 { inset: 14px; border-bottom-color: rgba(245,246,247,0.3); animation: spin 1.8s linear infinite reverse; }
                .loader-core {
                    position: absolute; inset: 26px; border-radius: 50%;
                    background: radial-gradient(circle, rgba(255,255,255,0.1), transparent);
                }
                .loader-brand { display: flex; align-items: center; gap: 12px; }
                .brand-text { font-size: 1.6rem; font-weight: 800; letter-spacing: -0.03em; color: var(--pearl); }
                .loader-progress-track {
                    width: 200px; height: 2px;
                    background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden;
                }
                .loader-progress-fill {
                    height: 100%; background: var(--pearl); border-radius: 3px; transition: width 0.15s ease;
                }
                .loader-status { color: rgba(245,246,247,0.3); font-size: 0.75rem; letter-spacing: 0.04em; }
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}

export default function MyApp({ Component, pageProps }) {
    const [loading, setLoading] = useState(true);

    return (
        <>
            {loading && <PageLoader onFinish={() => setLoading(false)} />}
            <div style={{ opacity: loading ? 0 : 1, transition: 'opacity 0.3s ease' }}>
                <Component {...pageProps} />
            </div>
            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        background: 'rgba(255,255,255,0.13)',
                        backdropFilter: 'blur(25px)',
                        border: '1px solid rgba(255,255,255,0.3)',
                        borderRadius: '12px',
                        fontSize: '0.88rem',
                        color: '#F5F6F7',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                    },
                }}
            />
        </>
    );
}
