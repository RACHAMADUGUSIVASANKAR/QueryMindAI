import React, { useState } from 'react';
import { CheckCircle, XCircle, Table, Code, Copy, Check } from 'lucide-react';

export default function QueryResult({ result, executionTime, error }) {
  const [view, setView] = useState('table');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (error) {
    return (
      <div className="glass-panel error-panel">
        <div className="result-header">
          <XCircle size={20} />
          <h3>Error</h3>
        </div>
        <p className="error-msg">{error}</p>
        <style jsx>{`
          .error-panel { border-color: rgba(255,255,255,0.15); }
          .result-header { display: flex; align-items: center; gap: 10px; color: var(--pearl); margin-bottom: 16px; }
          .result-header h3 { color: var(--pearl); font-size: 1rem; font-weight: 700; }
          .error-msg { color: var(--pearl-dim); font-size: 0.9rem; line-height: 1.6; }
        `}</style>
      </div>
    );
  }

  if (!result || !Array.isArray(result) || result.length === 0) {
    return (
      <div className="glass-panel">
        <div className="result-header">
          <CheckCircle size={20} />
          <h3>No Results</h3>
          {executionTime && <span className="glass-badge">{executionTime.toFixed(1)}ms</span>}
        </div>
        <p className="no-results">Query executed successfully but returned no documents.</p>
        <style jsx>{`
          .result-header { display: flex; align-items: center; gap: 10px; color: var(--pearl); margin-bottom: 16px; }
          .result-header h3 { color: var(--pearl); font-size: 1rem; font-weight: 700; }
          .no-results { color: var(--pearl-dim); font-size: 0.9rem; }
        `}</style>
      </div>
    );
  }

  const columns = Object.keys(result[0]).filter(k => k !== '_id');

  return (
    <div className="glass-panel">
      <div className="result-header">
        <CheckCircle size={20} />
        <h3>{result.length} Result{result.length !== 1 ? 's' : ''}</h3>
        {executionTime && <span className="glass-badge">{executionTime.toFixed(1)}ms</span>}
        <div className="view-toggle">
          <button className={view === 'table' ? 'active' : ''} onClick={() => setView('table')}><Table size={16} /></button>
          <button className={view === 'json' ? 'active' : ''} onClick={() => setView('json')}><Code size={16} /></button>
          <button onClick={handleCopy}>{copied ? <Check size={16} /> : <Copy size={16} />}</button>
        </div>
      </div>

      {view === 'table' ? (
        <div className="table-wrapper">
          <table>
            <thead><tr>{columns.map(col => <th key={col}>{col}</th>)}</tr></thead>
            <tbody>
              {result.map((row, i) => (
                <tr key={i}>
                  {columns.map(col => (
                    <td key={col}>{typeof row[col] === 'object' ? JSON.stringify(row[col]) : row[col]?.toString() || '—'}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="json-view">
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}

      <style jsx>{`
        .result-header { display: flex; align-items: center; gap: 10px; color: var(--pearl); margin-bottom: 20px; }
        .result-header h3 { color: var(--pearl); font-size: 1rem; font-weight: 700; }
        .view-toggle { margin-left: auto; display: flex; gap: 4px; }
        .view-toggle button {
          padding: 6px 10px; border-radius: 8px; color: var(--pearl-muted); transition: all 0.2s;
        }
        .view-toggle button:hover, .view-toggle button.active {
          background: rgba(255,255,255,0.12); color: var(--pearl);
        }
        .table-wrapper {
          overflow-x: auto; border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.1);
        }
        table { width: 100%; border-collapse: collapse; font-size: 0.82rem; }
        th {
          text-align: left; padding: 10px 14px;
          background: rgba(255,255,255,0.06); color: var(--pearl-dim);
          font-weight: 600; font-size: 0.75rem; text-transform: uppercase;
          letter-spacing: 0.04em; white-space: nowrap;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        td {
          padding: 10px 14px; color: var(--pearl-dim);
          border-bottom: 1px solid rgba(255,255,255,0.04);
          max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        tr:hover td { background: rgba(255,255,255,0.04); }
        .json-view {
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px; padding: 16px 20px; overflow-x: auto; max-height: 400px;
        }
        .json-view pre { font-family: var(--font-mono); font-size: 0.8rem; color: var(--pearl-dim); line-height: 1.6; }
      `}</style>
    </div>
  );
}
