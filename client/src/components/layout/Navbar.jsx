import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="navbar-wrapper">
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <Link href="/" className="nav-logo">
          QueryMindAI
        </Link>

        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <a href="#features" onClick={() => setMenuOpen(false)}>Features</a>
          <a href="#how-it-works" onClick={() => setMenuOpen(false)}>How It Works</a>
          <a href="#faq" onClick={() => setMenuOpen(false)}>FAQ</a>
          <Link href="/dashboard" className="nav-cta" onClick={() => setMenuOpen(false)}>
            Get Started
          </Link>
        </div>

        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      <style jsx>{`
        .navbar-wrapper {
          position: fixed; top: 16px; left: 50%; transform: translateX(-50%);
          z-index: 1000; width: 100%; max-width: 720px; padding: 0 16px;
        }
        .navbar {
          display: flex; align-items: center; justify-content: space-between;
          padding: 12px 24px; border-radius: 50px;
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(25px); -webkit-backdrop-filter: blur(25px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
        }
        .navbar.scrolled {
          background: rgba(255, 255, 255, 0.12);
          box-shadow: 0 8px 40px rgba(0, 0, 0, 0.3);
        }
        .nav-logo {
          font-size: 1.1rem; font-weight: 800; letter-spacing: -0.03em;
          color: var(--pearl); text-decoration: none;
        }
        .nav-links { display: flex; align-items: center; gap: 28px; }
        .nav-links a {
          font-size: 0.85rem; font-weight: 500; color: var(--pearl-dim);
          text-decoration: none; transition: color 0.2s;
        }
        .nav-links a:hover { color: var(--pearl); }
        .nav-cta {
          background: rgba(255,255,255,0.15) !important;
          border: 1px solid rgba(255,255,255,0.25) !important;
          padding: 8px 20px !important; border-radius: 50px !important;
          font-weight: 600 !important; color: var(--pearl) !important;
          font-size: 0.85rem !important; transition: all 0.2s !important;
        }
        .nav-cta:hover {
          background: rgba(255,255,255,0.25) !important;
        }
        .menu-toggle { display: none; color: var(--pearl); padding: 4px; }
        @media (max-width: 640px) {
          .navbar-wrapper { max-width: 100%; top: 10px; }
          .nav-links {
            position: fixed; top: 70px; left: 16px; right: 16px;
            background: rgba(0,0,0,0.95); backdrop-filter: blur(25px);
            flex-direction: column; padding: 24px; gap: 18px;
            transform: translateY(-120%); transition: transform 0.3s ease;
            border: 1px solid rgba(255,255,255,0.1); border-radius: 20px;
          }
          .nav-links.open { transform: translateY(0); }
          .menu-toggle { display: block; }
        }
      `}</style>
    </div>
  );
}
