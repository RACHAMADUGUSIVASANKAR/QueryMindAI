import React from 'react';
import GlassCard from '../ui/GlassCard';
import useScrollAnimation from '../../hooks/useScrollAnimation';

const steps = [
  {
    num: '01',
    title: 'Type your question',
    desc: 'Write what you want to know in plain English. For example: "Show me all users in the IT department."',
  },
  {
    num: '02',
    title: 'AI generates the query',
    desc: 'QueryMindAI understands your intent and builds an optimized MongoDB query automatically.',
  },
  {
    num: '03',
    title: 'Get your results',
    desc: 'Your results are returned instantly with a clear explanation of what the query did.',
  },
];

export default function AboutSection() {
  const ref = useScrollAnimation();

  return (
    <section id="how-it-works" className="section" ref={ref}>
      <div className="container">
        <div className="section-header">
          <h2>How it <span className="gradient-text">works</span></h2>
          <p className="section-desc">Three simple steps to go from question to answer.</p>
        </div>

        <div className="steps-grid">
          {steps.map((step, i) => (
            <GlassCard key={i} className="step-card">
              <div className="step-num">{step.num}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </GlassCard>
          ))}
        </div>
      </div>

      <style jsx>{`
        .section-header { text-align: center; max-width: 500px; margin: 0 auto 48px; }
        .section-desc { color: var(--pearl-dim); font-size: 1.05rem; margin-top: 16px; }
        .steps-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        :global(.step-card) { padding: 36px 28px !important; text-align: center; }
        .step-num {
          font-size: 2.5rem; font-weight: 900; letter-spacing: -0.04em;
          background: var(--gradient-text);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          margin-bottom: 20px;
        }
        h3 { font-size: 1.1rem; margin-bottom: 12px; }
        p { font-size: 0.9rem; color: var(--pearl-dim); line-height: 1.6; }
        @media (max-width: 768px) { .steps-grid { grid-template-columns: 1fr; } }
      `}</style>
    </section>
  );
}
