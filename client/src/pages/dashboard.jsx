import React, { useState, useCallback, useEffect } from 'react';
import Head from 'next/head';
import toast from 'react-hot-toast';
import Sidebar from '@/components/layout/Sidebar';
import QueryInput from '@/components/dashboard/QueryInput';
import QueryResult from '@/components/dashboard/QueryResult';
import QueryExplanation from '@/components/dashboard/QueryExplanation';
import AnalyticsPanel from '@/components/dashboard/AnalyticsPanel';
import LoadingAnimation from '@/components/dashboard/LoadingAnimation';
import ChatbotWidget from '@/components/chatbot/ChatbotWidget';
import { translateQuery, getCollections } from '@/utils/api';
import { Database, Clock, Terminal, MessageSquare, Settings, Zap, Activity, Search, Lightbulb, ArrowRight } from 'lucide-react';

const quickTips = [
  'Try: "Show all users in the IT department"',
  'Try: "Count users by department"',
  'Try: "Find admins with salary above 50000"',
  'Try: "Get average salary by role"',
];

export default function Dashboard() {
  const [activePanel, setActivePanel] = useState('query');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [explanation, setExplanation] = useState(null);
  const [executionTime, setExecutionTime] = useState(null);
  const [error, setError] = useState(null);
  const [queryHistory, setQueryHistory] = useState([]);
  const [collections, setCollections] = useState([]);
  const [dbConnected, setDbConnected] = useState(false);

  useEffect(() => {
    getCollections().then(data => {
      setCollections(data.collections || []);
      setDbConnected(true);
    }).catch(() => {
      setCollections(['users']);
      setDbConnected(false);
    });
  }, []);

  const handleQuery = useCallback(async (query, collection) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setExplanation(null);
    const start = performance.now();

    try {
      const data = await translateQuery(query, collection);
      const elapsed = data.executionTime || (performance.now() - start);
      setExecutionTime(elapsed);
      setResult(data.results || data.data || []);
      setExplanation({
        intent: data.intent || 'FIND',
        entities: data.entities || [],
        mongoQuery: data.mongoQuery || data.query || {},
        confidence: data.confidence || 0.95,
        collection: data.collection || collection,
        pipeline: data.pipeline,
      });
      setQueryHistory(prev => [{
        query, collection,
        time: new Date(),
        executionTime: elapsed,
        resultCount: data.resultCount || 0,
        intent: data.intent || 'FIND',
      }, ...prev].slice(0, 50));
      toast.success(`Query executed · ${(data.resultCount || 0)} results`);
    } catch (err) {
      setError(err.message);
      setQueryHistory(prev => [{
        query, collection,
        time: new Date(),
        executionTime: performance.now() - start,
        resultCount: 0,
        error: true,
      }, ...prev].slice(0, 50));
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const renderPanel = () => {
    switch (activePanel) {
      case 'analytics':
        return <AnalyticsPanel queryHistory={queryHistory} />;

      case 'collections':
        return (
          <div className="glass-panel">
            <div className="panel-header"><Database size={20} /><h3>Collections</h3></div>
            <div className="list-container">
              {(collections.length > 0 ? collections : ['users']).map((c, i) => (
                <div key={i} className="list-item" onClick={() => setActivePanel('query')}>
                  <div className="item-icon"><Database size={18} /></div>
                  <div className="item-info">
                    <strong>{c}</strong>
                    <span>Click to query this collection</span>
                  </div>
                  <div className="item-arrow">→</div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'history':
        return (
          <div className="glass-panel">
            <div className="panel-header">
              <Clock size={20} /><h3>Query History</h3>
              {queryHistory.length > 0 && <span className="glass-badge">{queryHistory.length}</span>}
            </div>
            {queryHistory.length === 0 ? (
              <div className="empty-state">
                <Terminal size={36} strokeWidth={1} />
                <p>No queries yet</p>
                <span>Run your first query to build your history</span>
              </div>
            ) : (
              <div className="list-container">
                {queryHistory.map((h, i) => (
                  <div key={i} className="list-item" onClick={() => { setActivePanel('query'); handleQuery(h.query, h.collection); }}>
                    <div className="history-query"><Search size={14} /><span>{h.query}</span></div>
                    <div className="history-meta">
                      <span className="meta-tag"><Database size={12} /> {h.collection}</span>
                      <span className="meta-tag"><Zap size={12} /> {h.executionTime?.toFixed(1)}ms</span>
                      <span className="meta-tag"><Activity size={12} /> {h.resultCount} results</span>
                      <span className="meta-time">{h.time.toLocaleTimeString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'chat':
        return (
          <div className="glass-panel">
            <div className="panel-header"><MessageSquare size={20} /><h3>AI Chat Assistant</h3></div>
            <div className="chat-info">
              <p>Use the chatbot widget (bottom-right) to chat with the AI assistant. It can help you with:</p>
              <ul>
                <li>Writing MongoDB queries in natural language</li>
                <li>Understanding your database schema</li>
                <li>MongoDB concepts and best practices</li>
                <li>Suggesting query patterns for your data</li>
              </ul>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="glass-panel">
            <div className="panel-header"><Settings size={20} /><h3>Settings</h3></div>
            <div className="list-container">
              <div className="setting-row">
                <div className="setting-label">Database Connection</div>
                <div className="setting-val"><div className={`status-dot ${dbConnected ? 'on' : 'off'}`} />{dbConnected ? 'Connected' : 'Disconnected'}</div>
              </div>
              <div className="setting-row"><div className="setting-label">MongoDB URI</div><code className="setting-code">mongodb://localhost:27017/querymindDB</code></div>
              <div className="setting-row"><div className="setting-label">API Server</div><code className="setting-code">http://localhost:5000</code></div>
              <div className="setting-row"><div className="setting-label">AI Service</div><code className="setting-code">Gemini 2.0 Flash</code></div>
              <div className="setting-row"><div className="setting-label">Max Results</div><code className="setting-code">100 documents</code></div>
            </div>
          </div>
        );

      default:
        return (
          <>
            {/* Welcome card — only when no results yet */}
            {!result && !error && !isLoading && queryHistory.length === 0 && (
              <div className="glass-panel welcome-card">
                <h3>Welcome to QueryMindAI</h3>
                <p>Type your question below in plain English to start querying your MongoDB database. No syntax required.</p>
                <div className="tips-grid">
                  {quickTips.map((tip, i) => (
                    <button key={i} className="tip-item" onClick={() => {
                      const q = tip.replace('Try: "', '').replace('"', '');
                      handleQuery(q, collections[0] || 'users');
                    }}>
                      <Lightbulb size={14} />
                      <span>{tip.replace('Try: ', '')}</span>
                      <ArrowRight size={14} />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <QueryInput onSubmit={handleQuery} isLoading={isLoading} collections={collections} />
            {isLoading && <LoadingAnimation />}
            {explanation && <QueryExplanation explanation={explanation} />}
            {(result || error) && <QueryResult result={result} executionTime={executionTime} error={error} />}

            {/* Quick analytics snapshot */}
            {queryHistory.length > 0 && (
              <div className="glass-panel mini-analytics">
                <div className="panel-header">
                  <Activity size={18} /><h3>Session Summary</h3>
                  <button className="see-all" onClick={() => setActivePanel('analytics')}>View Analytics →</button>
                </div>
                <div className="mini-stats">
                  <div className="mini-stat"><strong>{queryHistory.length}</strong><span>Queries</span></div>
                  <div className="mini-stat"><strong>{(queryHistory.reduce((a, h) => a + (h.executionTime || 0), 0) / queryHistory.length).toFixed(1)}ms</strong><span>Avg Time</span></div>
                  <div className="mini-stat"><strong>{queryHistory.reduce((a, h) => a + (h.resultCount || 0), 0)}</strong><span>Total Results</span></div>
                  <div className="mini-stat"><strong>{(queryHistory.filter(h => !h.error).length / queryHistory.length * 100).toFixed(0)}%</strong><span>Success</span></div>
                </div>
              </div>
            )}
          </>
        );
    }
  };

  const panelTitles = { query: 'Query Dashboard', analytics: 'Analytics', history: 'Query History', collections: 'Collections', chat: 'AI Assistant', settings: 'Settings' };
  const panelDescs = { query: 'Ask questions in plain English and get results instantly.', analytics: 'Live query performance and usage statistics.', history: 'View and re-run your previous queries.', collections: 'Browse your database collections.', chat: 'Chat with the AI assistant.', settings: 'Configure your QueryMindAI settings.' };

  return (
    <>
      <Head>
        <title>Dashboard — QueryMindAI</title>
        <meta name="description" content="QueryMindAI Dashboard" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>

      <div className="dashboard-layout">
        <Sidebar activePanel={activePanel} onPanelChange={setActivePanel} />
        <main className="dashboard-main">
          <div className="dash-topbar">
            <div className="topbar-left">
              <h2>{panelTitles[activePanel]}</h2>
              <p>{panelDescs[activePanel]}</p>
            </div>
            <div className="topbar-right">
              <div className="glass-badge">
                <div className={`status-dot ${dbConnected ? 'on' : 'off'}`} />
                <span>{dbConnected ? 'Connected' : 'Offline'}</span>
              </div>
            </div>
          </div>

          <div className="dashboard-content">
            {renderPanel()}
          </div>
        </main>
      </div>

      <ChatbotWidget />

      <style jsx>{`
        .dashboard-layout { display: flex; min-height: 100vh; background: var(--black); color: var(--pearl); }
        .dashboard-main { flex: 1; margin-left: 260px; padding: 28px 36px; transition: margin-left 0.3s ease; }

        .dash-topbar { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 28px; }
        .topbar-left h2 { font-size: 1.5rem; font-weight: 800; letter-spacing: -0.02em; color: var(--pearl); margin-bottom: 4px; }
        .topbar-left p { color: var(--pearl-muted); font-size: 0.85rem; }
        .status-dot { width: 8px; height: 8px; border-radius: 50%; }
        .status-dot.on { background: var(--pearl); box-shadow: 0 0 8px rgba(245,246,247,0.4); }
        .status-dot.off { background: var(--pearl-muted); }

        .dashboard-content { display: flex; flex-direction: column; gap: 20px; max-width: 960px; }

        .panel-header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; color: var(--pearl); }
        .panel-header h3 { font-size: 1.05rem; font-weight: 700; color: var(--pearl); }

        /* Welcome card */
        .welcome-card h3 { margin-bottom: 8px; }
        .welcome-card p { color: var(--pearl-dim); font-size: 0.9rem; margin-bottom: 20px; }
        .tips-grid { display: flex; flex-direction: column; gap: 8px; }
        .tip-item {
          display: flex; align-items: center; gap: 10px;
          padding: 14px 18px; border-radius: 10px;
          background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
          font-size: 0.85rem; color: var(--pearl-dim); transition: all 0.2s; cursor: pointer; text-align: left;
        }
        .tip-item:hover { background: rgba(255,255,255,0.12); color: var(--pearl); border-color: rgba(255,255,255,0.2); }
        .tip-item svg:first-child { color: var(--pearl-muted); flex-shrink: 0; }
        .tip-item span { flex: 1; }
        .tip-item svg:last-child { color: var(--pearl-subtle); flex-shrink: 0; }

        /* Mini analytics */
        .see-all { margin-left: auto; font-size: 0.78rem; font-weight: 600; color: var(--pearl-muted); transition: color 0.2s; }
        .see-all:hover { color: var(--pearl); }
        .mini-stats { display: flex; gap: 16px; }
        .mini-stat {
          flex: 1; padding: 14px; text-align: center;
          background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px;
        }
        .mini-stat strong { display: block; font-size: 1.1rem; font-weight: 800; color: var(--pearl); }
        .mini-stat span { font-size: 0.68rem; color: var(--pearl-muted); font-weight: 500; }

        /* Shared items */
        .list-container { display: flex; flex-direction: column; gap: 8px; }
        .list-item {
          display: flex; align-items: center; gap: 14px; padding: 14px 18px;
          background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px; cursor: pointer; transition: all 0.2s;
        }
        .list-item:hover { background: rgba(255,255,255,0.12); border-color: rgba(255,255,255,0.2); }
        .item-icon {
          width: 40px; height: 40px; border-radius: 10px;
          background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12);
          display: flex; align-items: center; justify-content: center; color: var(--pearl-dim); flex-shrink: 0;
        }
        .item-info strong { display: block; color: var(--pearl); font-size: 0.9rem; }
        .item-info span { font-size: 0.72rem; color: var(--pearl-muted); }
        .item-arrow { margin-left: auto; color: var(--pearl-subtle); }

        .empty-state { text-align: center; padding: 48px 0; color: var(--pearl-muted); }
        .empty-state p { color: var(--pearl-dim); font-weight: 600; margin-top: 14px; margin-bottom: 6px; }
        .empty-state span { font-size: 0.8rem; color: var(--pearl-muted); }

        .history-query { display: flex; align-items: center; gap: 10px; color: var(--pearl); font-weight: 600; font-size: 0.85rem; margin-bottom: 8px; }
        .history-meta { display: flex; gap: 14px; flex-wrap: wrap; align-items: center; }
        .meta-tag { display: flex; align-items: center; gap: 5px; font-size: 0.7rem; color: var(--pearl-muted); }
        .meta-time { font-size: 0.7rem; color: var(--pearl-subtle); margin-left: auto; }

        .chat-info { color: var(--pearl-dim); font-size: 0.88rem; line-height: 1.8; }
        .chat-info ul { list-style: none; padding: 0; margin-top: 12px; }
        .chat-info li { padding: 7px 0 7px 22px; position: relative; color: var(--pearl-dim); }
        .chat-info li::before { content: '→'; position: absolute; left: 0; color: var(--pearl-muted); }

        .setting-row {
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 18px; background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1); border-radius: 12px;
        }
        .setting-label { color: var(--pearl-dim); font-size: 0.85rem; font-weight: 600; }
        .setting-val { display: flex; align-items: center; gap: 8px; font-size: 0.8rem; font-weight: 600; color: var(--pearl); }
        .setting-code {
          font-size: 0.75rem; color: var(--pearl-dim);
          background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.1);
          padding: 4px 12px; border-radius: 6px; font-family: var(--font-mono);
        }

        @media (max-width: 768px) {
          .dashboard-main { margin-left: 72px; padding: 16px; }
          .dash-topbar { flex-direction: column; gap: 12px; }
          .mini-stats { flex-wrap: wrap; }
          .mini-stat { min-width: 45%; }
        }
      `}</style>
    </>
  );
}
