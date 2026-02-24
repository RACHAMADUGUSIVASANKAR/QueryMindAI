import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import useScrollAnimation from '../../hooks/useScrollAnimation';

const faqs = [
    {
        q: 'What is QueryMindAI?',
        a: 'QueryMindAI is an AI-powered tool that lets you query your MongoDB database using natural language. Instead of writing complex MongoDB syntax, you simply ask questions in plain English and get instant results.'
    },
    {
        q: 'Do I need to know MongoDB to use it?',
        a: 'Not at all. QueryMindAI is designed for everyone — from developers to non-technical team members. Just type your question, and the AI handles the rest.'
    },
    {
        q: 'How accurate are the generated queries?',
        a: 'Our AI uses advanced NLP with intent detection and entity extraction to generate highly accurate queries. It also provides a confidence score and full explanation for every query it creates.'
    },
    {
        q: 'Is my data secure?',
        a: 'Yes. Every generated query is validated and sanitized before execution. QueryMindAI never stores your database credentials, and all communication is encrypted.'
    },
    {
        q: 'What types of queries does it support?',
        a: 'QueryMindAI supports find, count, aggregation, grouping, sorting, filtering, and more. It can handle complex multi-stage aggregation pipelines and nested field queries.'
    },
    {
        q: 'Can I use it with any MongoDB database?',
        a: 'Yes. QueryMindAI works with any MongoDB instance — local, Atlas, or self-hosted. Simply provide your connection details and start querying.'
    },
    {
        q: 'Does it explain the queries it generates?',
        a: 'Absolutely. Every query comes with a detailed explanation showing the detected intent, extracted entities, and the actual MongoDB query — so you learn as you use it.'
    },
    {
        q: 'Is it free to use?',
        a: 'QueryMindAI offers a free tier for individual use. For teams and enterprises with higher usage needs, we offer premium plans with additional features.'
    },
];

export default function FAQSection() {
    const ref = useScrollAnimation();
    const [openIndex, setOpenIndex] = useState(null);

    const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

    return (
        <section id="faq" className="section" ref={ref}>
            <div className="container">
                <div className="section-header">
                    <h2>Frequently asked <span className="gradient-text">questions</span></h2>
                    <p className="section-desc">Everything you need to know about QueryMindAI.</p>
                </div>

                <div className="faq-list">
                    {faqs.map((faq, i) => (
                        <div key={i} className={`faq-item ${openIndex === i ? 'open' : ''}`}>
                            <button className="faq-question" onClick={() => toggle(i)}>
                                <span>{faq.q}</span>
                                {openIndex === i ? <Minus size={18} /> : <Plus size={18} />}
                            </button>
                            <div className="faq-answer">
                                <p>{faq.a}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
        .section-header { text-align: center; max-width: 500px; margin: 0 auto 48px; }
        .section-desc { color: var(--pearl-dim); font-size: 1.05rem; margin-top: 16px; }
        .faq-list { max-width: 700px; margin: 0 auto; display: flex; flex-direction: column; gap: 8px; }
        .faq-item {
          border: 1px solid rgba(255,255,255,0.1); border-radius: 14px;
          overflow: hidden; transition: all 0.2s ease;
          background: rgba(255,255,255,0.03);
        }
        .faq-item:hover { border-color: rgba(255,255,255,0.2); }
        .faq-item.open { background: rgba(255,255,255,0.06); }
        .faq-question {
          display: flex; align-items: center; justify-content: space-between;
          width: 100%; padding: 20px 24px; font-size: 0.95rem; font-weight: 600;
          color: var(--pearl); text-align: left; cursor: pointer;
        }
        .faq-question svg { flex-shrink: 0; color: var(--pearl-muted); }
        .faq-answer {
          max-height: 0; overflow: hidden; transition: max-height 0.3s ease, padding 0.3s ease;
          padding: 0 24px;
        }
        .faq-item.open .faq-answer {
          max-height: 300px; padding: 0 24px 20px;
        }
        .faq-answer p { font-size: 0.88rem; color: var(--pearl-dim); line-height: 1.7; }
      `}</style>
        </section>
    );
}
