import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../utils/api';

export default function GenerateReport() {
  const [courses, setCourses] = useState([]);
  const [reports, setReports] = useState([]);
  const [form, setForm] = useState({ title: '', course_id: '' });
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(null);

  const load = () => {
    api.get('/admin/courses').then(r => setCourses(r.data)).catch(() => {});
    api.get('/reports').then(r => setReports(r.data)).catch(() => {});
  };
  useEffect(() => { load(); }, []);

  const handleGenerate = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/reports/generate', form);
      setGenerated(data);
      toast.success('Report generated!');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate report');
    } finally { setLoading(false); }
  };

  const statusColor = { pending: '#f59e0b', reviewed: '#3b82f6', action_taken: '#8b5cf6', closed: '#22c55e' };

  return (
    <div style={S.page}>
      <h2 style={S.heading}>📋 Generate Reports</h2>

      <div style={S.formCard}>
        <h3 style={{ marginTop: 0, color: '#1e293b' }}>Create New Report</h3>
        <form onSubmit={handleGenerate} style={S.formRow}>
          <div style={S.field}>
            <label style={S.label}>Report Title *</label>
            <input style={S.input} placeholder="e.g. Semester 1 Analysis Report" value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div style={S.field}>
            <label style={S.label}>Course (Optional - leave blank for all)</label>
            <select style={S.input} value={form.course_id} onChange={e => setForm({ ...form, course_id: e.target.value })}>
              <option value="">All Courses</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.course_name} ({c.course_code})</option>)}
            </select>
          </div>
          <button style={S.btn} disabled={loading}>{loading ? '⏳ Generating...' : '📊 Generate Report'}</button>
        </form>
      </div>

      {generated && (
        <div style={S.resultCard}>
          <h3 style={{ marginTop: 0, color: '#1e293b' }}>✅ Report Generated Successfully</h3>
          <div style={S.aiBox}><strong>🤖 AI Summary:</strong> {generated.summary}</div>
          <div style={S.statsRow}>
            {[
              { label: 'Total Feedback', value: generated.total, color: '#667eea' },
              { label: 'Avg Rating', value: `${generated.avgRating}⭐`, color: '#f59e0b' },
              { label: 'Positive', value: generated.positive, color: '#22c55e' },
              { label: 'Negative', value: generated.negative, color: '#ef4444' },
            ].map(s => (
              <div key={s.label} style={S.statBox}>
                <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 12, color: '#64748b' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={S.tableCard}>
        <h3 style={{ marginTop: 0, color: '#1e293b' }}>All Generated Reports</h3>
        {reports.length === 0 ? <p style={S.empty}>No reports generated yet.</p> :
          <table style={S.table}>
            <thead><tr style={S.thead}>
              <th style={S.th}>Title</th><th style={S.th}>Course</th><th style={S.th}>Total</th>
              <th style={S.th}>Avg Rating</th><th style={S.th}>Status</th><th style={S.th}>Date</th>
            </tr></thead>
            <tbody>
              {reports.map(r => (
                <tr key={r.id} style={S.tr}>
                  <td style={S.td}><strong>{r.title}</strong></td>
                  <td style={S.td}>{r.course_name || 'All Courses'}</td>
                  <td style={S.td}>{r.total_feedback}</td>
                  <td style={S.td}><strong style={{ color: '#f59e0b' }}>{parseFloat(r.avg_rating || 0).toFixed(2)}⭐</strong></td>
                  <td style={S.td}>
                    <span style={{ background: (statusColor[r.status] || '#ccc') + '22', color: statusColor[r.status] || '#ccc', padding: '3px 10px', borderRadius: 12, fontSize: 12, fontWeight: 700 }}>
                      {r.status?.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td style={S.td}>{new Date(r.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>}
      </div>
    </div>
  );
}

const S = {
  page: { padding: '28px 32px', maxWidth: 1100, margin: '0 auto' },
  heading: { fontSize: 24, fontWeight: 800, color: '#1e293b', marginBottom: 20 },
  formCard: { background: '#fff', borderRadius: 16, padding: '24px 28px', marginBottom: 20, boxShadow: '0 1px 20px rgba(0,0,0,0.06)' },
  formRow: { display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 16, alignItems: 'flex-end' },
  field: { display: 'flex', flexDirection: 'column' },
  label: { fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 },
  input: { padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none' },
  btn: { padding: '11px 24px', background: 'linear-gradient(135deg,#667eea,#764ba2)', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap' },
  resultCard: { background: '#fff', borderRadius: 16, padding: '24px 28px', marginBottom: 20, boxShadow: '0 1px 20px rgba(0,0,0,0.06)', border: '2px solid #22c55e' },
  aiBox: { background: 'linear-gradient(135deg,#667eea,#764ba2)', color: '#fff', borderRadius: 10, padding: '12px 16px', fontSize: 13, lineHeight: 1.6, marginBottom: 16 },
  statsRow: { display: 'flex', gap: 16 },
  statBox: { flex: 1, textAlign: 'center', background: '#f8fafc', borderRadius: 10, padding: '14px 8px' },
  tableCard: { background: '#fff', borderRadius: 16, padding: '24px 28px', boxShadow: '0 1px 20px rgba(0,0,0,0.06)' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { background: '#f8fafc' },
  th: { padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' },
  tr: { borderBottom: '1px solid #f1f5f9' },
  td: { padding: '13px 16px', fontSize: 14 },
  empty: { textAlign: 'center', color: '#94a3b8', padding: 30 },
};
