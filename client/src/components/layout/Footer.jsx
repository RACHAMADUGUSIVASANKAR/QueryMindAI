import React from 'react';
import { Github, Twitter, Linkedin, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-brand">
            <h3>QueryMindAI</h3>
            <p>Transform natural language into powerful MongoDB queries — instantly.</p>
            <div className="social-links">
              <a href="#" aria-label="GitHub"><Github size={18} /></a>
              <a href="#" aria-label="Twitter"><Twitter size={18} /></a>
              <a href="#" aria-label="LinkedIn"><Linkedin size={18} /></a>
            </div>
          </div>
          <div className="footer-links">
            <h4>Product</h4>
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="/dashboard">Dashboard</a>
          </div>
          <div className="footer-links">
            <h4>Resources</h4>
            <a href="#faq">FAQ</a>
            <a href="#">Documentation</a>
            <a href="#">Changelog</a>
          </div>
          <div className="footer-links">
            <h4>Company</h4>
            <a href="#">About</a>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 QueryMindAI. Built with <Heart size={14} color="var(--pearl)" fill="var(--pearl)" style={{ display: 'inline', verticalAlign: 'middle' }} /></p>
        </div>
      </div>

      <style jsx>{`
        .footer { background: var(--black); color: var(--pearl); padding: 60px 0 0; border-top: 1px solid rgba(255,255,255,0.08); }
        .footer-container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
        .footer-grid {
          display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 48px;
          padding-bottom: 40px; border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .footer-brand h3 { font-size: 1.3rem; color: var(--pearl); margin-bottom: 12px; font-weight: 800; }
        .footer-brand p { font-size: 0.88rem; color: var(--pearl-muted); line-height: 1.6; margin-bottom: 20px; }
        .social-links { display: flex; gap: 16px; }
        .social-links a { color: var(--pearl-muted); transition: color 0.2s; }
        .social-links a:hover { color: var(--pearl); }
        .footer-links h4 {
          font-size: 0.82rem; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.08em; color: var(--pearl); margin-bottom: 16px;
        }
        .footer-links a {
          display: block; font-size: 0.85rem; color: var(--pearl-muted);
          text-decoration: none; padding: 5px 0; transition: color 0.2s;
        }
        .footer-links a:hover { color: var(--pearl); }
        .footer-bottom { text-align: center; padding: 20px 0; font-size: 0.8rem; color: var(--pearl-subtle); }
        @media (max-width: 768px) { .footer-grid { grid-template-columns: 1fr 1fr; gap: 32px; } .footer-brand { grid-column: 1 / -1; } }
        @media (max-width: 480px) { .footer-grid { grid-template-columns: 1fr; } }
      `}</style>
    </footer>
  );
}
