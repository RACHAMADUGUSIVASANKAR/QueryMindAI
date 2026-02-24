import React from 'react';
import Link from 'next/link';
import { Search, Database, Clock, MessageSquare, BarChart3, Settings, Home, X, Menu } from 'lucide-react';

const navItems = [
  { id: 'query', label: 'Query', icon: Search },
  { id: 'collections', label: 'Collections', icon: Database },
  { id: 'history', label: 'History', icon: Clock },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'chat', label: 'AI Chat', icon: MessageSquare },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ activePanel, onPanelChange }) {
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <aside className={`sidebar glass-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <Link href="/" className="sidebar-logo">
          <img src="https://d2lgmzy8vjj79z.cloudfront.net/mongodb.svg" alt="MongoDB" width={28} height={28} />
          {!collapsed && <span className="logo-text">QueryMindAI</span>}
        </Link>
        <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <Menu size={18} /> : <X size={18} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${activePanel === item.id ? 'active' : ''}`}
            onClick={() => onPanelChange(item.id)}
            title={item.label}
          >
            <item.icon size={20} />
            {!collapsed && <span>{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <Link href="/" className="nav-item" title="Back to Home">
          <Home size={20} />
          {!collapsed && <span>Back to Home</span>}
        </Link>
      </div>

      <style jsx>{`
        .sidebar {
          position: fixed; top: 0; left: 0;
          width: 260px; height: 100vh;
          display: flex; flex-direction: column;
          z-index: 100; transition: width 0.3s ease;
        }
        .sidebar.collapsed { width: 72px; }
        .sidebar-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 20px 16px; border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .sidebar-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; color: var(--pearl); }
        .logo-text { font-size: 1.15rem; font-weight: 800; letter-spacing: -0.03em; color: var(--pearl); }
        .collapse-btn { color: var(--pearl-muted); padding: 4px; border-radius: 6px; transition: color 0.2s; }
        .collapse-btn:hover { color: var(--pearl); }
        .sidebar-nav {
          flex: 1; padding: 12px 10px;
          display: flex; flex-direction: column; gap: 4px; overflow-y: auto;
        }
        .nav-item {
          display: flex; align-items: center; gap: 12px;
          padding: 12px 14px; border-radius: 10px;
          font-size: 0.88rem; font-weight: 500;
          color: var(--pearl-muted); text-decoration: none;
          transition: all 0.2s ease; width: 100%; text-align: left;
        }
        .nav-item:hover { background: rgba(255,255,255,0.08); color: var(--pearl); }
        .nav-item.active { background: rgba(255,255,255,0.12); color: var(--pearl); font-weight: 600; }
        .sidebar-footer { padding: 12px 10px; border-top: 1px solid rgba(255,255,255,0.08); }
        @media (max-width: 768px) {
          .sidebar { width: 72px; }
          .sidebar .logo-text, .sidebar .nav-item span { display: none; }
          .sidebar .nav-item { justify-content: center; padding: 12px; }
          .sidebar .sidebar-header { justify-content: center; }
          .sidebar .collapse-btn { display: none; }
        }
      `}</style>
    </aside>
  );
}
