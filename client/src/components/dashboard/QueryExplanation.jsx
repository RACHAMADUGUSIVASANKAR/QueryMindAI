import React from 'react';
import { Brain, Tag, Code } from 'lucide-react';

export default function QueryExplanation({ explanation }) {
  if (!explanation) return null;
  const { intent, entities, mongoQuery, confidence, pipeline } = explanation;

  return (
    <div className="glass-panel">
      <div className="exp-header">
        <Brain size={20} />
        <h3>AI Explanation</h3>
        <span className="glass-badge">{(confidence * 100).toFixed(0)}% confident</span>
      </div>

      <div className="exp-grid">
        <div className="exp-item">
          <div className="exp-label"><Tag size={14} /> Intent</div>
          <div className="glass-badge intent-badge">{intent}</div>
        </div>

        {entities && entities.length > 0 && (
          <div className="exp-item">
            <div className="exp-label"><Tag size={14} /> Entities</div>
            <div className="entities-list">
              {entities.map((e, i) => (
                <span key={i} className="glass-badge">{e.type}: {e.value}</span>
              ))}
            </div>
          </div>
        )}

        <div className="exp-item full-width">
          <div className="exp-label"><Code size={14} /> Generated Query</div>
          <div className="query-display">
            <pre>{pipeline
              ? `db.collection.aggregate(${JSON.stringify(pipeline, null, 2)})`
              : `db.collection.find(${JSON.stringify(mongoQuery, null, 2)})`
            }</pre>
          </div>
        </div>
      </div>

      <style jsx>{`
        .exp-header { display: flex; align-items: center; gap: 10px; color: var(--pearl); margin-bottom: 24px; }
        .exp-header h3 { font-size: 1rem; font-weight: 700; color: var(--pearl); }
        .exp-grid { display: flex; flex-wrap: wrap; gap: 16px; }
        .exp-item { flex: 1; min-width: 200px; }
        .exp-item.full-width { flex-basis: 100%; }
        .exp-label {
          display: flex; align-items: center; gap: 6px;
          font-size: 0.75rem; font-weight: 600; color: var(--pearl-muted);
          text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 10px;
        }
        .intent-badge { font-weight: 700; }
        .entities-list { display: flex; flex-wrap: wrap; gap: 6px; }
        .query-display {
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px; padding: 16px 20px; overflow-x: auto;
        }
        .query-display pre {
          font-family: var(--font-mono); font-size: 0.8rem;
          color: var(--pearl-dim); line-height: 1.6; margin: 0;
        }
      `}</style>
    </div>
  );
}
