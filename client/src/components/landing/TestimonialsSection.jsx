import React from 'react';
import useScrollAnimation from '../../hooks/useScrollAnimation';

const testimonials = [
    { name: 'Arjun K.', role: 'Backend Developer', text: 'QueryMindAI completely changed how I interact with MongoDB. I just type what I need in plain English and get instant results.' },
    { name: 'Priya S.', role: 'Data Analyst', text: 'I don\'t know MongoDB syntax at all, but with QueryMindAI I can query any collection effortlessly. It feels like magic.' },
    { name: 'Rahul M.', role: 'Full Stack Engineer', text: 'The AI understands context so well. I asked complex aggregation questions and it built the right pipeline every time.' },
    { name: 'Sneha D.', role: 'Product Manager', text: 'Our non-technical team members can now pull their own data without waiting for engineering. Huge time saver.' },
    { name: 'Vikram T.', role: 'Startup Founder', text: 'I integrated QueryMindAI in a day. The query explanations help me learn MongoDB while I get work done.' },
    { name: 'Ananya R.', role: 'Database Admin', text: 'Even as someone who knows MongoDB well, this tool speeds up my workflow significantly. The analytics are great.' },
    { name: 'Karthik P.', role: 'DevOps Engineer', text: 'Clean interface, fast results, and the security validation gives me confidence the queries are safe.' },
    { name: 'Meera J.', role: 'QA Lead', text: 'I use it daily to verify data. The natural language input saves me hours of writing manual queries.' },
];

export default function TestimonialsSection() {
    const ref = useScrollAnimation();

    /* double the list for seamless infinite scroll */
    const track = [...testimonials, ...testimonials];

    return (
        <section className="section testimonials-section" ref={ref}>
            <div className="container">
                <div className="section-header">
                    <h2>Loved by <span className="gradient-text">developers</span></h2>
                    <p className="section-desc">See what our users are saying.</p>
                </div>
            </div>

            <div className="marquee-wrapper">
                <div className="marquee-track">
                    {track.map((t, i) => (
                        <div key={i} className="testimonial-card glass-card">
                            <p className="testimonial-text">"{t.text}"</p>
                            <div className="testimonial-author">
                                <div className="author-avatar">{t.name[0]}</div>
                                <div className="author-info">
                                    <strong>{t.name}</strong>
                                    <span>{t.role}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
        .section-header { text-align: center; max-width: 500px; margin: 0 auto 48px; }
        .section-desc { color: var(--pearl-dim); font-size: 1.05rem; margin-top: 16px; }

        .marquee-wrapper { overflow: hidden; width: 100%; padding: 4px 0; }
        .marquee-track {
          display: flex; gap: 20px; min-width: max-content;
          animation: marquee 40s linear infinite;
        }
        .marquee-wrapper:hover .marquee-track { animation-play-state: paused; }

        :global(.testimonial-card) {
          flex: 0 0 340px; padding: 28px 24px !important;
          display: flex; flex-direction: column; justify-content: space-between;
        }
        .testimonial-text { font-size: 0.9rem; color: var(--pearl-dim); line-height: 1.7; margin-bottom: 20px; font-style: italic; }
        .testimonial-author { display: flex; align-items: center; gap: 12px; }
        .author-avatar {
          width: 36px; height: 36px; border-radius: 50%;
          background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.2);
          display: flex; align-items: center; justify-content: center;
          font-size: 0.85rem; font-weight: 700; color: var(--pearl);
        }
        .author-info strong { display: block; font-size: 0.85rem; color: var(--pearl); }
        .author-info span { font-size: 0.75rem; color: var(--pearl-muted); }

        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @media (max-width: 480px) {
          :global(.testimonial-card) { flex: 0 0 280px; }
        }
      `}</style>
        </section>
    );
}
