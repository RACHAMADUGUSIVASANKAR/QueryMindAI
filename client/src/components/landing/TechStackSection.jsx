import React from 'react';
import GlassCard from '../ui/GlassCard';
import useScrollAnimation from '../../hooks/useScrollAnimation';

const technologies = [
    { name: 'Next.js', category: 'Frontend', color: '#000000', icon: '▲' },
    { name: 'React', category: 'Frontend', color: '#61DAFB', icon: '⚛' },
    { name: 'Three.js', category: 'Frontend', color: '#049EF4', icon: '◆' },
    { name: 'GSAP', category: 'Frontend', color: '#88CE02', icon: '◈' },
    { name: 'Node.js', category: 'Backend', color: '#339933', icon: '⬢' },
    { name: 'Express', category: 'Backend', color: '#000000', icon: '⚡' },
    { name: 'Python', category: 'AI Service', color: '#3776AB', icon: '🐍' },
    { name: 'FastAPI', category: 'AI Service', color: '#009688', icon: '⚡' },
    { name: 'MongoDB', category: 'Database', color: '#47A248', icon: '🍃' },
    { name: 'spaCy', category: 'NLP', color: '#09A3D5', icon: '🧠' },
    { name: 'Docker', category: 'DevOps', color: '#2496ED', icon: '🐳' },
    { name: 'Vector Search', category: 'AI', color: '#6C63FF', icon: '🔍' },
];

export default function TechStackSection() {
    const ref = useScrollAnimation();

    return (
        <section id="tech-stack" className="section">
            <div className="container">
                <div className="section-header" ref={ref}>
                    <h2 className="fade-in">Built with <span className="gradient-text">Modern Tech</span></h2>
                    <p className="fade-in">Production-grade stack for performance, scalability, and intelligence.</p>
                </div>

                <div className="tech-grid">
                    {technologies.map((tech, i) => (
                        <GlassCard key={i} className="tech-card" style={{ padding: '24px', textAlign: 'center' }}>
                            <div className="tech-icon" style={{ color: tech.color }}>{tech.icon}</div>
                            <h4 className="tech-name">{tech.name}</h4>
                            <span className="tech-category">{tech.category}</span>
                        </GlassCard>
                    ))}
                </div>
            </div>

            <style jsx>{`
        .section-header {
          text-align: center;
          margin-bottom: 64px;
        }
        .section-header p {
          color: var(--charcoal-50);
          font-size: 1.05rem;
          margin-top: 12px;
        }
        .tech-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 20px;
        }
        .tech-icon {
          font-size: 2rem;
          margin-bottom: 12px;
        }
        .tech-name {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--charcoal);
          margin-bottom: 4px;
        }
        .tech-category {
          font-size: 0.75rem;
          color: var(--charcoal-50);
          font-weight: 500;
        }
        @media (max-width: 1024px) {
          .tech-grid { grid-template-columns: repeat(4, 1fr); }
        }
        @media (max-width: 768px) {
          .tech-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 480px) {
          .tech-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
        </section>
    );
}
