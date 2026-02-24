import React, { useRef, useState, useEffect } from 'react';
import { Zap, Search, Shield, BarChart3, Database, Brain } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import useScrollAnimation from '../../hooks/useScrollAnimation';

const features = [
  {
    icon: Search,
    title: 'Natural Language Queries',
    desc: 'Ask questions in plain English — no need to learn MongoDB syntax or commands.'
  },
  {
    icon: Brain,
    title: 'AI-Powered Understanding',
    desc: 'Our AI understands context and intent to generate accurate database queries.'
  },
  {
    icon: Zap,
    title: 'Instant Results',
    desc: 'Get your query results in milliseconds with optimized query generation.'
  },
  {
    icon: Shield,
    title: 'Secure & Validated',
    desc: 'Every query is validated and sanitized before execution for safety.'
  },
  {
    icon: BarChart3,
    title: 'Visual Analytics',
    desc: 'See your query performance and usage patterns at a glance.'
  },
  {
    icon: Database,
    title: 'Multi-Collection Support',
    desc: 'Query across any collection in your database seamlessly.'
  },
];

export default function FeaturesSection() {
  const ref = useScrollAnimation();
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
    scrollRef.current.style.cursor = 'grabbing';
  };
  const handleMouseUp = () => {
    setIsDragging(false);
    if (scrollRef.current) scrollRef.current.style.cursor = 'grab';
  };
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, []);

  return (
    <section id="features" className="section" ref={ref}>
      <div className="container">
        <div className="section-header">
          <h2>Everything you need to<br /><span className="gradient-text">query smarter</span></h2>
          <p className="section-desc">Powerful features designed to make database querying effortless.</p>
        </div>
      </div>

      <div
        className="features-scroll"
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseUp}
      >
        <div className="features-track">
          {features.map((f, i) => (
            <GlassCard key={i} className="feature-card">
              <div className="feature-icon"><f.icon size={24} /></div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </GlassCard>
          ))}
        </div>
      </div>

      <style jsx>{`
        .section-header { text-align: center; max-width: 600px; margin: 0 auto 48px; }
        .section-desc { color: var(--pearl-dim); font-size: 1.05rem; margin-top: 16px; }
        .features-scroll {
          overflow-x: auto; cursor: grab; user-select: none;
          padding: 0 24px 20px; -ms-overflow-style: none; scrollbar-width: none;
        }
        .features-scroll::-webkit-scrollbar { display: none; }
        .features-track {
          display: flex; gap: 20px; min-width: max-content;
          padding: 4px; /* prevent box-shadow clipping */
        }
        :global(.feature-card) {
          flex: 0 0 300px; padding: 32px 28px !important;
          transition: transform 0.2s ease !important;
        }
        :global(.feature-card:hover) { transform: translateY(-4px); }
        .feature-icon {
          width: 48px; height: 48px; border-radius: 12px;
          background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 20px; color: var(--pearl);
        }
        h3 { margin-bottom: 10px; font-size: 1.1rem; }
        p { font-size: 0.9rem; line-height: 1.6; color: var(--pearl-dim); }
      `}</style>
    </section>
  );
}
