import React, { useMemo } from 'react';
import { BarChart3, TrendingUp, Activity, Clock, Zap, Database } from 'lucide-react';

export default function AnalyticsPanel({ queryHistory = [] }) {
    const analytics = useMemo(() => {
        const total = queryHistory.length;
        const avgTime = total > 0 ? (queryHistory.reduce((a, h) => a + (h.executionTime || 0), 0) / total) : 0;
        const totalResults = queryHistory.reduce((a, h) => a + (h.resultCount || 0), 0);
        const successCount = queryHistory.filter(h => !h.error).length;
        const successRate = total > 0 ? (successCount / total * 100) : 0;
        const uniqueCollections = [...new Set(queryHistory.map(h => h.collection))].length;

        /* Simple distribution for chart */
        const intentCounts = {};
        queryHistory.forEach(h => {
            const intent = h.intent || 'FIND';
            intentCounts[intent] = (intentCounts[intent] || 0) + 1;
        });

        return { total, avgTime, totalResults, successRate, uniqueCollections, intentCounts };
    }, [queryHistory]);

    const stats = [
        { icon: Activity, label: 'Total Queries', value: analytics.total || '0', accent: analytics.total > 0 },
        { icon: Clock, label: 'Avg Response', value: analytics.avgTime > 0 ? `${analytics.avgTime.toFixed(1)}ms` : '—', accent: analytics.avgTime > 0 },
        { icon: TrendingUp, label: 'Success Rate', value: analytics.total > 0 ? `${analytics.successRate.toFixed(0)}%` : '—', accent: analytics.successRate > 0 },
        { icon: Zap, label: 'Total Results', value: analytics.totalResults > 0 ? analytics.totalResults.toLocaleString() : '0' },
        { icon: Database, label: 'Collections', value: analytics.uniqueCollections || '0' },
        { icon: BarChart3, label: 'Last Query', value: queryHistory.length > 0 ? `${(queryHistory[0].executionTime || 0).toFixed(1)}ms` : '—' },
    ];

    const intentEntries = Object.entries(analytics.intentCounts);
    const maxIntent = Math.max(...intentEntries.map(([, v]) => v), 1);

    return (
        <div className="glass-panel">
            <div className="analytics-header">
                <BarChart3 size={20} />
                <h3>Analytics Overview</h3>
                {analytics.total > 0 && <span className="glass-badge">{analytics.total} queries analyzed</span>}
            </div>

            <div className="stats-grid">
                {stats.map((s, i) => (
                    <div key={i} className="stat-card">
                        <div className="stat-icon"><s.icon size={20} /></div>
                        <div className="stat-content">
                            <div className="stat-value">{s.value}</div>
                            <div className="stat-label">{s.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {intentEntries.length > 0 && (
                <div className="chart-section">
                    <h4>Query Types</h4>
                    <div className="bar-chart">
                        {intentEntries.map(([intent, count]) => (
                            <div key={intent} className="bar-row">
                                <span className="bar-label">{intent}</span>
                                <div className="bar-track">
                                    <div className="bar-fill" style={{ width: `${(count / maxIntent) * 100}%` }} />
                                </div>
                                <span className="bar-value">{count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {analytics.total === 0 && (
                <div className="analytics-note">
                    <p>Analytics will populate as you execute queries. Run some queries to see performance metrics here.</p>
                </div>
            )}

            <style jsx>{`
        .analytics-header { display: flex; align-items: center; gap: 10px; color: var(--pearl); margin-bottom: 24px; }
        .analytics-header h3 { font-size: 1.1rem; font-weight: 700; color: var(--pearl); }
        .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 24px; }
        .stat-card {
          display: flex; gap: 12px; align-items: center; padding: 16px;
          background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
        }
        .stat-icon {
          width: 40px; height: 40px; border-radius: 10px;
          background: rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: center;
          color: var(--pearl-dim); flex-shrink: 0;
        }
        .stat-value { font-size: 1.2rem; font-weight: 800; color: var(--pearl); }
        .stat-label { font-size: 0.72rem; color: var(--pearl-muted); font-weight: 500; }

        .chart-section { margin-bottom: 16px; }
        .chart-section h4 { font-size: 0.85rem; font-weight: 700; color: var(--pearl); margin-bottom: 16px; }
        .bar-chart { display: flex; flex-direction: column; gap: 10px; }
        .bar-row { display: flex; align-items: center; gap: 12px; }
        .bar-label { font-size: 0.72rem; font-weight: 600; color: var(--pearl-dim); width: 80px; text-align: right; }
        .bar-track { flex: 1; height: 8px; background: rgba(255,255,255,0.06); border-radius: 4px; overflow: hidden; }
        .bar-fill { height: 100%; background: rgba(255,255,255,0.3); border-radius: 4px; transition: width 0.5s ease; }
        .bar-value { font-size: 0.72rem; font-weight: 700; color: var(--pearl-dim); width: 30px; }

        .analytics-note {
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px; padding: 16px 20px;
        }
        .analytics-note p { color: var(--pearl-dim); font-size: 0.85rem; line-height: 1.6; }
        @media (max-width: 600px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
      `}</style>
        </div>
    );
}
