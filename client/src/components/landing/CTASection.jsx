import React from 'react';
import Link from 'next/link';
import useScrollAnimation from '../../hooks/useScrollAnimation';

export default function CTASection() {
  const ref = useScrollAnimation();

  return (
    <section className="cta-section" ref={ref}>
      <div className="container cta-inner">
        <h2>Ready to <span className="gradient-text">get started</span>?</h2>
        <p>Start querying your MongoDB database in plain English today.</p>
        <Link href="/dashboard">
          <button className="glass-button glass-button-primary cta-btn">
            Get Started — It's Free →
          </button>
        </Link>
      </div>

      <style jsx>{`
        .cta-section { padding: 60px 0 30px; }
        .cta-inner { text-align: center; max-width: 520px; margin: 0 auto; }
        .cta-inner h2 { margin-bottom: 16px; }
        .cta-inner p { color: var(--pearl-dim); font-size: 1.05rem; margin-bottom: 32px; }
        .cta-btn { padding: 16px 40px; font-size: 1rem; border-radius: 50px; }
      `}</style>
    </section>
  );
}
