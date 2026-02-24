import React, { useState } from 'react';
import { Send, Sparkles, Loader2, Database } from 'lucide-react';

const exampleQueries = [
  'Find all active users in IT department',
  'Show users with salary greater than 40000',
  'Count users by department',
  'Get average salary by department',
  'Find admins with experience more than 3 years',
];

export default function QueryInput({ onSubmit, isLoading, collections = [] }) {
  const [query, setQuery] = useState('');
  const [collection, setCollection] = useState('users');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() && !isLoading) onSubmit(query.trim(), collection);
  };

  return (
    <div className="glass-panel qi-panel">
      <div className="qi-header">
        <Sparkles size={20} />
        <h3>Natural Language Query</h3>
      </div>

      <form onSubmit={handleSubmit} className="qi-form">
        <div className="qi-top-row">
          <div className="qi-collection glass-badge">
            <Database size={16} />
            <select value={collection} onChange={e => setCollection(e.target.value)}>
              {(collections.length > 0 ? collections : ['users']).map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="qi-input-row">
          <input
            type="text"
            className="glass-input"
            placeholder="Ask a question in plain English..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            disabled={isLoading}
          />
          <button type="submit" disabled={!query.trim() || isLoading} className="glass-button glass-button-primary qi-submit">
            {isLoading ? <Loader2 size={20} className="spin" /> : <Send size={20} />}
          </button>
        </div>
      </form>

      <div className="qi-examples">
        <span className="qi-examples-label">Try:</span>
        {exampleQueries.map((eq, i) => (
          <button key={i} className="glass-badge qi-example" onClick={() => setQuery(eq)}>{eq}</button>
        ))}
      </div>

      <style jsx>{`
        .qi-panel { padding: 28px; }
        .qi-header { display: flex; align-items: center; gap: 10px; color: var(--pearl); margin-bottom: 20px; }
        .qi-header h3 { font-size: 1.05rem; font-weight: 700; color: var(--pearl); }
        .qi-form { margin-bottom: 16px; }
        .qi-top-row { margin-bottom: 12px; }
        .qi-collection { cursor: pointer; }
        .qi-collection select {
          background: transparent; border: none; color: var(--pearl);
          font-size: 0.85rem; font-weight: 600; cursor: pointer; font-family: inherit;
        }
        .qi-collection select option { background: #000; color: var(--pearl); }
        .qi-input-row { display: flex; gap: 10px; }
        .qi-submit { width: 52px; height: 52px; padding: 0; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .qi-submit:disabled { opacity: 0.4; cursor: not-allowed; }
        .qi-examples { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
        .qi-examples-label { font-size: 0.75rem; color: var(--pearl-muted); font-weight: 600; }
        .qi-example { cursor: pointer; font-size: 0.72rem; transition: all 0.2s; }
        .qi-example:hover { background: rgba(255,255,255,0.2); }
        @keyframes spin { to { transform: rotate(360deg); } }
        :global(.spin) { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
}
