import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import api from '../../utils/api';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, Filler);

export default function DeanDashboard() {
  const [performance, setPerformance] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    api.get('/dean/faculty-performance').then(r => setPerformance(r.data)).catch(() => {});
    api.get('/feedback/analytics').then(r => setAnalytics(r.data)).catch(() => {});
  }, []);

  const chartData = performance.length ? {
    labels: performance.map(f => f.name),
    datasets: [
      { label: 'Avg Rating (×20)', data: performance.map(f => parseFloat(f.avg_rating || 0) * 20), backgroundColor: 'rgba(102,126,234,0.85)', borderRadius: 6 },
      { label: 'Positive %', data: performance.map(f => f.total_feedback ? Math.round((f.positive / f.total_feedback) * 100) : 0), backgroundColor: 'rgba(34,197,94,0.85)', borderRadius: 6 },
    ]
  } : null;

  const totalFeedback = performance.reduce((s, f) => s + (f.total_feedback || 0), 0);
  const overallRating = performance.length
    ? (performance.reduce((s, f) => s + parseFloat(f.avg_rating || 0), 0) / performance.length).toFixed(1)
    : '—';

  return (
    <div style={S.page}>
      <div style={S.header}>
        <h2 style={S.title}>Dean Dashboard</h2>
        <p style={S.sub}>Faculty performance overview and academic insights</p>
      </div>

      <div style={S.statsGrid}>
        {[
          { icon: '👨🏫', label: 'Faculty Members', value: performance.length, color: '#667eea', bg: '#ede9fe' },
          { icon: '⭐', label: 'Overall Avg Rating', value: overallRating, color: '#f59e0b', bg: '#fef3c7' },
          { icon: '💬', label: 'Total Feedbacks', value: totalFeedback, color: '#22c55e', bg: '#dcfce7' },
          { icon: '😄', label: 'Positive Responses', value: performance.reduce((s, f) => s + (f.positive || 0), 0), color: '#e94560', bg: '#fee2e2' },
        ].map(s => (
          <div key={s.label} style={S.statCard}>
            <div style={{ ...S.statIcon, background: s.bg, color: s.color }}>{s.icon}</div>
            <div><div style={{ ...S.statVal, color: s.color }}>{s.value}</div><div style={S.statLabel}>{s.label}</div></div>
          </div>
        ))}
      </div>

      {analytics?.summary && (
        <div style={S.aiCard}>
          <div style={S.aiHeader}><span>🤖</span><strong>AI-Generated Insights</strong></div>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, opacity: 0.95 }}>{analytics.summary}</p>
        </div>
      )}

      {chartData && (
        <div style={S.chartCard}>
          <h3 style={S.chartTitle}>Faculty Performance Overview</h3>
          <Bar data={chartData} options={{ responsive: true, scales: { y: { min: 0, max: 100, grid: { color: '#f1f5f9' } }, x: { grid: { display: false } } } }} />
        </div>
      )}

      <div style={S.tableCard}>
        <h3 style={S.chartTitle}>🏆 Faculty Rankings</h3>
        <table style={S.table}>
          <thead><tr style={S.thead}>
            <th style={S.th}>Rank</th><th style={S.th}>Faculty</th><th style={S.th}>Department</th>
            <th style={S.th}>Avg Rating</th><th style={S.th}>Reviews</th><th style={S.th}>Positive %</th><th style={S.th}>Performance</th>
          </tr></thead>
          <tbody>
            {performance.map((f, i) => {
              const rating = parseFloat(f.avg_rating || 0);
              const posPct = f.total_feedback ? Math.round((f.positive / f.total_feedback) * 100) : 0;
              const color = rating >= 4 ? '#22c55e' : rating >= 3 ? '#f59e0b' : '#ef4444';
              return (
                <tr key={f.id} style={S.tr}>
                  <td style={S.td}><span style={S.rank}>{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}</span></td>
                  <td style={S.td}><strong style={{ color: '#1e293b' }}>{f.name}</strong></td>
                  <td style={S.td}><span style={S.deptBadge}>{f.department || 'N/A'}</span></td>
                  <td style={S.td}><span style={{ color, fontWeight: 700 }}>{rating.toFixed(2)} ⭐</span></td>
                  <td style={S.td}>{f.total_feedback || 0}</td>
                  <td style={S.td}><span style={{ color: '#22c55e', fontWeight: 600 }}>{posPct}%</span></td>
                  <td style={S.td}>
                    <div style={S.bar}><div style={{ ...S.barFill, width: `${(rating / 5) * 100}%`, background: color }} /></div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {performance.length === 0 && <p style={S.empty}>No performance data available yet.</p>}
      </div>
    </div>
  );
}

const S = {
  page: { padding: '28px 32px', maxWidth: 1280, margin: '0 auto' },
  header: { marginBottom: 24 },
  title: { fontSize: 24, fontWeight: 800, color: '#1e293b', margin: 0 },
  sub: { color: '#64748b', fontSize: 14, marginTop: 4 },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 },
  statCard: { background: '#fff', borderRadius: 16, padding: '20px 22px', display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 1px 20px rgba(0,0,0,0.06)' },
  statIcon: { width: 52, height: 52, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 },
  statVal: { fontSize: 28, fontWeight: 800, lineHeight: 1 },
  statLabel: { fontSize: 13, color: '#64748b', marginTop: 4 },
  aiCard: { background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', borderRadius: 16, padding: '18px 22px', marginBottom: 24, color: '#fff' },
  aiHeader: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: 15, fontWeight: 700 },
  chartCard: { background: '#fff', borderRadius: 16, padding: '22px 24px', marginBottom: 20, boxShadow: '0 1px 20px rgba(0,0,0,0.06)' },
  chartTitle: { fontSize: 15, fontWeight: 700, color: '#1e293b', margin: '0 0 18px' },
  tableCard: { background: '#fff', borderRadius: 16, padding: '22px 24px', boxShadow: '0 1px 20px rgba(0,0,0,0.06)' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { background: '#f8fafc' },
  th: { padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 },
  tr: { borderBottom: '1px solid #f1f5f9' },
  td: { padding: '14px 16px', fontSize: 14 },
  rank: { fontSize: 18 },
  deptBadge: { background: '#dcfce7', color: '#16a34a', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 },
  bar: { background: '#f1f5f9', borderRadius: 4, height: 8, width: 100 },
  barFill: { height: '100%', borderRadius: 4 },
  empty: { textAlign: 'center', color: '#94a3b8', padding: 30 },
};
