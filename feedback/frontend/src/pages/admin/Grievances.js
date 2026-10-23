import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../utils/api';

const statusColor = { pending: '#f59e0b', in_review: '#3b82f6', resolved: '#22c55e', rejected: '#ef4444' };
const categoryColor = { academic: '#667eea', facility: '#f59e0b', faculty: '#22c55e', administration: '#e94560', other: '#94a3b8' };

export default function AdminGrievances() {
  const [grievances, setGrievances] = useState([]);
  const [selected, setSelected] = useState(null);
  const [response, setResponse] = useState('');
  const [status, setStatus] = useState('in_review');
  const [filter, setFilter] = useState('all');

  const load = () => api.get('/grievance/all').then(r => setGrievances(r.data)).catch(() => {});
  useEffect(() => {
    load();
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleDelete = async id => {
    if (!window.confirm('Delete this grievance? It will be removed for everyone.')) return;
    try {
      await api.delete(`/grievance/${id}`);
      toast.success('Grievance deleted');
      load();
    } catch { toast.error('Failed to delete'); }
  };

  const handleUpdate = async () => {
    try {
      await api.patch(`/grievance/${selected.id}/status`, { status, admin_response: response });
      toast.success('Grievance updated!');
      setSelected(null);
      setResponse('');
      load();
    } catch { toast.error('Failed to update'); }
  };

  const filtered = filter === 'all' ? grievances : grievances.filter(g => g.status === filter);

  const counts = grievances.reduce((acc, g) => { acc[g.status] = (acc[g.status] || 0) + 1; return acc; }, {});

  return (
    <div style={S.page}>
      <h2 style={S.heading}>📢 Complaints & Grievances</h2>

      <div style={S.statsRow}>
        {[
          { label: 'Total', value: grievances.length, color: '#667eea' },
          { label: 'Pending', value: counts.pending || 0, color: '#f59e0b' },
          { label: 'In Review', value: counts.in_review || 0, color: '#3b82f6' },
          { label: 'Resolved', value: counts.resolved || 0, color: '#22c55e' },
          { label: 'Rejected', value: counts.rejected || 0, color: '#ef4444' },
        ].map(s => (
          <div key={s.label} style={S.statCard}>
            <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: '#64748b' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={S.filters}>
        {['all', 'pending', 'in_review', 'resolved', 'rejected'].map(f => (
          <button key={f} style={{ ...S.filterBtn, ...(filter === f ? S.activeFilter : {}) }}
            onClick={() => setFilter(f)}>{f.replace('_', ' ').toUpperCase()}</button>
        ))}
      </div>

      {filtered.length === 0
        ? <p style={S.empty}>No grievances found.</p>
        : filtered.map(g => (
          <div key={g.id} style={S.card}>
            <div style={S.cardHeader}>
              <div>
                <strong style={{ fontSize: 15 }}>{g.title}</strong>
                <span style={{ ...S.badge, background: categoryColor[g.category] + '22', color: categoryColor[g.category] }}>{g.category}</span>
                <span style={{ marginLeft: 8, fontSize: 13, color: '#64748b' }}>by {g.student_name} {g.roll_number ? `(${g.roll_number})` : ''} — {g.department || 'N/A'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ ...S.badge, background: statusColor[g.status] + '22', color: statusColor[g.status] }}>
                  {g.status.replace('_', ' ').toUpperCase()}
                </span>
                <button style={S.actionBtn} onClick={() => { setSelected(g); setStatus(g.status); setResponse(g.admin_response || ''); }}>
                  ✏️ Respond
                </button>
                <button style={S.deleteBtn} onClick={() => handleDelete(g.id)}>🗑️ Delete</button>
              </div>
            </div>
            <p style={S.desc}>{g.description}</p>
            {g.admin_response && <div style={S.response}><strong>📩 Response:</strong> {g.admin_response}</div>}
            {g.dean_action && <div style={S.deanBox}><strong>⚡ Dean Action:</strong> {g.dean_action}</div>}
            <p style={S.date}>{new Date(g.submitted_at).toLocaleString()}</p>
          </div>
        ))}

      {selected && (
        <div style={S.overlay}>
          <div style={S.modal}>
            <h3 style={{ margin: '0 0 16px', color: '#1e293b' }}>📝 Respond to Grievance</h3>
            <p style={{ fontSize: 14, color: '#64748b', marginBottom: 16 }}><strong>{selected.title}</strong></p>
            <label style={S.label}>Update Status</label>
            <select style={S.input} value={status} onChange={e => setStatus(e.target.value)}>
              <option value="in_review">In Review</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </select>
            <label style={{ ...S.label, marginTop: 12 }}>Response Message</label>
            <textarea style={S.textarea} rows={4} placeholder="Write your response..."
              value={response} onChange={e => setResponse(e.target.value)} />
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <button style={S.btn} onClick={handleUpdate}>Save Response</button>
              <button style={S.cancelBtn} onClick={() => setSelected(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const S = {
  page: { padding: 24, maxWidth: 1000, margin: '0 auto' },
  heading: { color: '#1e293b', marginBottom: 16 },
  statsRow: { display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' },
  statCard: { background: '#fff', borderRadius: 12, padding: '16px 24px', textAlign: 'center', boxShadow: '0 1px 10px rgba(0,0,0,0.06)', flex: 1, minWidth: 80 },
  filters: { display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' },
  filterBtn: { padding: '7px 14px', border: '1.5px solid #e2e8f0', borderRadius: 20, cursor: 'pointer', background: '#fff', fontSize: 12, fontWeight: 600, color: '#64748b' },
  activeFilter: { background: '#1e293b', color: '#fff', borderColor: '#1e293b' },
  card: { background: '#fff', borderRadius: 12, padding: 20, marginBottom: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10, flexWrap: 'wrap', gap: 8 },
  badge: { marginLeft: 8, padding: '3px 10px', borderRadius: 12, fontSize: 12, fontWeight: 700 },
  desc: { color: '#555', fontSize: 14, margin: '0 0 8px' },
  response: { background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 8, padding: '8px 12px', fontSize: 13, color: '#166534', marginBottom: 8 },
  deanBox: { background: '#eff6ff', border: '1px solid #93c5fd', borderRadius: 8, padding: '8px 12px', fontSize: 13, color: '#1d4ed8', marginBottom: 8 },
  date: { color: '#aaa', fontSize: 12, margin: 0 },
  actionBtn: { background: '#f1f5f9', border: 'none', padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 },
  deleteBtn: { background: '#fee2e2', border: 'none', padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#ef4444' },
  empty: { color: '#aaa', textAlign: 'center', padding: 30 },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { background: '#fff', borderRadius: 16, padding: 28, width: '100%', maxWidth: 480, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' },
  label: { display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 5 },
  input: { width: '100%', padding: '10px 12px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' },
  textarea: { width: '100%', padding: '10px 12px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 14, boxSizing: 'border-box', resize: 'vertical' },
  btn: { background: 'linear-gradient(135deg,#667eea,#764ba2)', color: '#fff', border: 'none', padding: '11px 24px', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer' },
  cancelBtn: { background: '#f1f5f9', color: '#64748b', border: 'none', padding: '11px 20px', borderRadius: 8, fontSize: 14, cursor: 'pointer' },
};
