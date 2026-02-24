import React from 'react';

export default function LoadingAnimation() {
  return (
    <div className="glass-panel loading-card">
      <div className="loader-dots">
        <span /><span /><span />
      </div>
      <p>Processing your query...</p>

      <style jsx>{`
        .loading-card { padding: 40px 28px; text-align: center; }
        .loader-dots { display: flex; justify-content: center; gap: 8px; margin-bottom: 16px; }
        .loader-dots span {
          width: 10px; height: 10px; border-radius: 50%;
          background: var(--pearl-dim); animation: bounce 1.2s ease-in-out infinite;
        }
        .loader-dots span:nth-child(2) { animation-delay: 0.15s; }
        .loader-dots span:nth-child(3) { animation-delay: 0.3s; }
        p { color: var(--pearl-muted); font-size: 0.88rem; font-weight: 500; }
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.3; }
          30% { transform: translateY(-12px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
