import { useEffect, useState } from 'react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement,
  PointElement, LineElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import api from '../../utils/api';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [counts, setCounts] = useState({ students: 0, faculty: 0, courses: 0, feedback: 0 });

  useEffect(() => {
    api.get('/feedback/analytics').then(r => setAnalytics(r.data)).catch(() => {});
    Promise.all([
      api.get('/admin/students'), api.get('/admin/faculty'),
      api.get('/admin/courses'), api.get('/feedback/all')
    ]).then(([s, f, c, fb]) => setCounts({ students: s.data.length, faculty: f.data.length, courses: c.data.length, feedback: fb.data.length }))
      .catch(() => {});
  }, []);

  const ratingChart = analytics?.courseStats?.length ? {
    labels: analytics.courseStats.map(c => c.course_name),
    datasets: [{ label: 'Avg Rating', data: analytics.courseStats.map(c => parseFloat(c.avg_rating || 0).toFixed(1)),
      backgroundColor: 'rgba(102,126,234,0.85)', borderRadius: 8, borderSkipped: false }]
  } : null;

  const sentimentChart = analytics?.courseStats ? {
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [{ data: [
      analytics.courseStats.reduce((s, c) => s + (c.positive || 0), 0),
      analytics.courseStats.reduce((s, c) => s + (c.neutral || 0), 0),
      analytics.courseStats.reduce((s, c) => s + (c.negative || 0), 0),
    ], backgroundColor: ['#22c55e', '#f59e0b', '#ef4444'], borderWidth: 0 }]
  } : null;

  const trendChart = analytics?.monthlyTrend?.length ? {
    labels: [...analytics.monthlyTrend].reverse().map(t => t.month),
    datasets: [{ label: 'Avg Rating', data: [...analytics.monthlyTrend].reverse().map(t => parseFloat(t.avg_rating || 0).toFixed(1)),
      borderColor: '#667eea', backgroundColor: 'rgba(102,126,234,0.1)', tension: 0.4, fill: true, pointBackgroundColor: '#667eea', pointRadius: 5 }]
  } : null;

  const stats = [
    { icon: '👨🎓', label: 'Total Students', value: counts.students, color: '#667eea', bg: '#ede9fe' },
    { icon: '👨🏫', label: 'Faculty Members', value: counts.faculty, color: '#22c55e', bg: '#dcfce7' },
    { icon: '📚', label: 'Active Courses', value: counts.courses, color: '#f59e0b', bg: '#fef3c7' },
    { icon: '💬', label: 'Total Feedbacks', value: counts.feedback, color: '#e94560', bg: '#fee2e2' },
  ];

  return (
    <div style={S.page}>
      <div style={S.header}>
        <div>
          <h2 style={S.title}>Analytics Dashboard</h2>
          <p style={S.sub}>Overview of feedback system performance</p>
        </div>
      </div>

      <div style={S.statsGrid}>
        {stats.map(s => (
          <div key={s.label} style={S.statCard}>
            <div style={{ ...S.statIcon, background: s.bg, color: s.color }}>{s.icon}</div>
            <div style={S.statInfo}>
              <div style={{ ...S.statVal, color: s.color }}>{s.value}</div>
              <div style={S.statLabel}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {analytics?.summary && (
        <div style={S.aiCard}>
          <div style={S.aiHeader}><span style={S.aiIcon}>🤖</span><strong>AI-Generated Summary</strong></div>
          <p style={S.aiText}>{analytics.summary}</p>
        </div>
      )}

      <div style={S.chartsRow}>
        {ratingChart ? (
          <div style={S.chartCard}>
            <h3 style={S.chartTitle}>Average Rating by Course</h3>
            <Bar data={ratingChart} options={{ responsive: true, plugins: { legend: { display: false } }, scales: { y: { min: 0, max: 5, grid: { color: '#f1f5f9' } }, x: { grid: { display: false } } } }} />
          </div>
        ) : <EmptyChart title="Average Rating by Course" msg="No feedback data yet" />}

        {sentimentChart ? (
          <div style={{ ...S.chartCard, maxWidth: 320 }}>
            <h3 style={S.chartTitle}>Sentiment Distribution</h3>
            <Doughnut data={sentimentChart} options={{ responsive: true, plugins: { legend: { position: 'bottom' } }, cutout: '65%' }} />
          </div>
        ) : <EmptyChart title="Sentiment Distribution" msg="No feedback data yet" />}
      </div>

      {trendChart ? (
        <div style={S.chartCard}>
          <h3 style={S.chartTitle}>Monthly Rating Trend</h3>
          <Line data={trendChart} options={{ responsive: true, scales: { y: { min: 0, max: 5, grid: { color: '#f1f5f9' } }, x: { grid: { display: false } } }, plugins: { legend: { display: false } } }} />
        </div>
      ) : null}

      {analytics?.deptStats?.length > 0 && (
        <div style={S.tableCard}>
          <h3 style={S.chartTitle}>Department Comparison</h3>
          <table style={S.table}>
            <thead><tr style={S.thead}>
              <th style={S.th}>Department</th><th style={S.th}>Avg Rating</th><th style={S.th}>Total Feedback</th><th style={S.th}>Performance</th>
            </tr></thead>
            <tbody>
              {analytics.deptStats.map(d => {
                const rating = parseFloat(d.avg_rating || 0);
                const pct = (rating / 5) * 100;
                return (
                  <tr key={d.department} style={S.tr}>
                    <td style={S.td}><span style={S.deptBadge}>{d.department}</span></td>
                    <td style={S.td}><strong style={{ color: rating >= 4 ? '#22c55e' : rating >= 3 ? '#f59e0b' : '#ef4444' }}>{rating.toFixed(2)} ⭐</strong></td>
                    <td style={S.td}>{d.total}</td>
                    <td style={S.td}>
                      <div style={S.bar}><div style={{ ...S.barFill, width: `${pct}%`, background: rating >= 4 ? '#22c55e' : rating >= 3 ? '#f59e0b' : '#ef4444' }} /></div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function EmptyChart({ title, msg }) {
  return (
    <div style={{ ...S.chartCard, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
      <h3 style={S.chartTitle}>{title}</h3>
      <p style={{ color: '#94a3b8', fontSize: 14 }}>📭 {msg}</p>
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
  statInfo: {},
  statVal: { fontSize: 28, fontWeight: 800, lineHeight: 1 },
  statLabel: { fontSize: 13, color: '#64748b', marginTop: 4 },
  aiCard: { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: 16, padding: '18px 22px', marginBottom: 24, color: '#fff' },
  aiHeader: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: 15 },
  aiIcon: { fontSize: 20 },
  aiText: { margin: 0, fontSize: 14, lineHeight: 1.7, opacity: 0.95 },
  chartsRow: { display: 'grid', gridTemplateColumns: '1fr auto', gap: 20, marginBottom: 20 },
  chartCard: { background: '#fff', borderRadius: 16, padding: '22px 24px', marginBottom: 20, boxShadow: '0 1px 20px rgba(0,0,0,0.06)' },
  chartTitle: { fontSize: 15, fontWeight: 700, color: '#1e293b', margin: '0 0 18px' },
  tableCard: { background: '#fff', borderRadius: 16, padding: '22px 24px', boxShadow: '0 1px 20px rgba(0,0,0,0.06)' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { background: '#f8fafc' },
  th: { padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 },
  tr: { borderBottom: '1px solid #f1f5f9' },
  td: { padding: '14px 16px', fontSize: 14 },
  deptBadge: { background: '#ede9fe', color: '#7c3aed', padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 600 },
  bar: { background: '#f1f5f9', borderRadius: 4, height: 8, width: 120 },
  barFill: { height: '100%', borderRadius: 4, transition: 'width 0.5s' },
};
