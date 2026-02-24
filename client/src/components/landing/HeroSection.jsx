import React from 'react';
import Link from 'next/link';
import useScrollAnimation from '../../hooks/useScrollAnimation';

export default function HeroSection() {
  const ref = useScrollAnimation();

  return (
    <section className="hero" ref={ref}>
      <div className="container hero-inner">
        <div className="hero-content">
          <h1>
            Ask your database<br />
            <span className="gradient-text">in plain English</span>
          </h1>
          <p className="hero-desc">
            QueryMindAI transforms your natural language questions into powerful MongoDB queries — instantly. No syntax. No complexity. Just answers.
          </p>
          <div className="hero-actions">
            <Link href="/dashboard">
              <button className="glass-button glass-button-primary hero-btn">
                Get Started →
              </button>
            </Link>
            <a href="#how-it-works" className="hero-link">See how it works</a>
          </div>
        </div>

        <div className="hero-visual">
          <div className="mock-dashboard glass-card">
            <div className="mock-topbar">
              <div className="mock-dots"><span /><span /><span /></div>
              <div className="mock-search">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                <span>Show all users in the IT department...</span>
              </div>
            </div>
            <div className="mock-content">
              <div className="mock-row header"><span>Name</span><span>Department</span><span>Role</span><span>Status</span></div>
              <div className="mock-row"><span>Arjun Kumar</span><span>IT</span><span>Engineer</span><span className="badge-active">Active</span></div>
              <div className="mock-row"><span>Priya Singh</span><span>IT</span><span>Lead</span><span className="badge-active">Active</span></div>
              <div className="mock-row"><span>Rahul Mehta</span><span>IT</span><span>Analyst</span><span className="badge-active">Active</span></div>
              <div className="mock-row"><span>Sneha Das</span><span>IT</span><span>Developer</span><span className="badge-active">Active</span></div>
            </div>
            <div className="mock-footer">
              <span>4 results</span><span>12ms</span><span>✓ Query validated</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hero { padding: 140px 0 80px; min-height: 100vh; display: flex; align-items: center; }
        .hero-inner { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 56px; }
        .hero-content { max-width: 700px; }
        .hero-desc { color: var(--pearl-dim); font-size: 1.15rem; line-height: 1.7; margin: 24px auto 36px; max-width: 520px; }
        .hero-actions { display: flex; align-items: center; justify-content: center; gap: 24px; }
        .hero-btn { padding: 16px 36px; font-size: 1rem; border-radius: 50px; }
        .hero-link { color: var(--pearl-muted); font-size: 0.9rem; font-weight: 500; transition: color 0.2s; }
        .hero-link:hover { color: var(--pearl); }

        .hero-visual { width: 100%; max-width: 800px; }
        :global(.mock-dashboard) { padding: 0 !important; overflow: hidden; border-radius: 16px !important; }
        .mock-topbar {
          display: flex; align-items: center; gap: 16px; padding: 14px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .mock-dots { display: flex; gap: 6px; }
        .mock-dots span { width: 10px; height: 10px; border-radius: 50%; background: rgba(255,255,255,0.15); }
        .mock-search {
          flex: 1; display: flex; align-items: center; gap: 8px; padding: 8px 14px;
          background: rgba(255,255,255,0.06); border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);
          color: var(--pearl-muted); font-size: 0.82rem;
        }
        .mock-content { padding: 8px 20px; }
        .mock-row {
          display: grid; grid-template-columns: 1.5fr 1fr 1fr 0.8fr;
          padding: 10px 0; font-size: 0.8rem; color: var(--pearl-dim);
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        .mock-row.header { color: var(--pearl-muted); font-weight: 600; font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.05em; }
        .badge-active {
          display: inline-block; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15);
          padding: 2px 10px; border-radius: 50px; font-size: 0.7rem; color: var(--pearl-dim); width: fit-content;
        }
        .mock-footer {
          display: flex; gap: 20px; padding: 12px 20px;
          border-top: 1px solid rgba(255,255,255,0.08);
          font-size: 0.72rem; color: var(--pearl-muted);
        }
        @media (max-width: 768px) {
          .hero { padding: 120px 0 60px; min-height: auto; }
          .hero-actions { flex-direction: column; gap: 16px; }
          .mock-row { grid-template-columns: 1fr 1fr; }
          .mock-row span:nth-child(3), .mock-row span:nth-child(4) { display: none; }
        }
      `}</style>
    </section>
  );
}
