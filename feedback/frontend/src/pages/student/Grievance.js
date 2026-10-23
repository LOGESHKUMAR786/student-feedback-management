import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../utils/api';

const CATEGORIES = ['academic', 'facility', 'faculty', 'administration', 'other'];
const statusColor = { pending: '#f59e0b', in_review: '#3b82f6', resolved: '#22c55e', rejected: '#ef4444' };
const categoryColor = { academic: '#667eea', facility: '#f59e0b', faculty: '#22c55e', administration: '#e94560', other: '#94a3b8' };

const hasNumbers = val => /\d/.test(val);

export default function Grievance() {
  const [form, setForm] = useState({ title: '', category: 'academic', description: '' });
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);

  const load = () => api.get('/grievance/my').then(r => setGrievances(r.data)).catch(() => {});
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

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      if (hasNumbers(form.title)) { toast.error('Title must not contain numbers'); setLoading(false); return; }
      if (hasNumbers(form.description)) { toast.error('Description must not contain numbers'); setLoading(false); return; }
      await api.post('/grievance', form);
      toast.success('Grievance submitted! 🎉');
      setForm({ title: '', category: 'academic', description: '' });
      setEditId(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit');
    } finally { setLoading(false); }
  };

  const handleEdit = g => {
    setForm({ title: g.title, category: g.category, description: g.description });
    setEditId(g.id);
    window.scrollTo(0, 0);
  };

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>{editId ? '✏️ Edit Grievance' : '📢 Submit Grievance'}</h2>

      <div style={styles.formCard}>
        <form onSubmit={handleSubmit}>
          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Title *</label>
              <input style={{ ...styles.select, ...(hasNumbers(form.title) ? styles.inputError : {}) }}
                placeholder="Brief title of your grievance"
                value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
              {hasNumbers(form.title) && <span style={styles.errorMsg}>⚠️ Title must not contain numbers</span>}
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Category *</label>
              <select style={styles.select} value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>
          </div>

          <label style={{ ...styles.label, marginTop: 8 }}>Description *</label>
          <textarea style={{ ...styles.textarea, ...(hasNumbers(form.description) ? styles.inputError : {}) }}
            rows={5} placeholder="Describe your complaint or grievance in detail..."
            value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
          {hasNumbers(form.description) && <span style={styles.errorMsg}>⚠️ Description must not contain numbers</span>}

          <button style={styles.btn} disabled={loading}>
            {loading ? 'Submitting...' : editId ? 'Update Grievance' : 'Submit Grievance'}
          </button>
          {editId && (
            <button type="button" style={styles.cancelBtn}
              onClick={() => { setEditId(null); setForm({ title: '', category: 'academic', description: '' }); }}>
              Cancel
            </button>
          )}
        </form>
      </div>

      <h3 style={styles.heading}>📋 My Grievances</h3>
      {grievances.length === 0
        ? <p style={styles.empty}>No grievances submitted yet.</p>
        : grievances.map(g => (
          <div key={g.id} style={styles.feedbackCard}>
            <div style={styles.feedbackHeader}>
              <div>
                <strong>{g.title}</strong>
                <span style={{ ...styles.code, background: categoryColor[g.category] + '22', color: categoryColor[g.category] }}>
                  {g.category}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ ...styles.code, background: statusColor[g.status] + '22', color: statusColor[g.status] }}>
                  {g.status.replace('_', ' ').toUpperCase()}
                </span>
                {g.status === 'pending' && (
                  <button style={styles.editBtn} onClick={() => handleEdit(g)}>✏️ Edit</button>
                )}
                <button style={styles.deleteBtn} onClick={() => handleDelete(g.id)}>🗑️</button>
              </div>
            </div>
            <p style={styles.comment}>{g.description}</p>
            {g.admin_response && (
              <div style={styles.sentimentPreview}>
                📩 Admin Response: <span style={{ marginLeft: 8, color: '#166534' }}>{g.admin_response}</span>
              </div>
            )}
            {g.dean_action && (
              <div style={{ ...styles.sentimentPreview, background: '#eff6ff', border: '1px solid #93c5fd' }}>
                ⚡ Dean Action: <span style={{ marginLeft: 8, color: '#1d4ed8' }}>{g.dean_action}</span>
              </div>
            )}
            <p style={styles.date}>Submitted: {new Date(g.submitted_at).toLocaleString()}</p>
          </div>
        ))}
    </div>
  );
}

const styles = {
  page: { padding: 24, maxWidth: 900, margin: '0 auto' },
  heading: { color: '#1a1a2e', marginBottom: 16 },
  formCard: { background: '#fff', borderRadius: 12, padding: 28, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', marginBottom: 28 },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 },
  field: { display: 'flex', flexDirection: 'column' },
  label: { fontWeight: 600, color: '#444', marginBottom: 6, fontSize: 14 },
  select: { padding: '10px 12px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14, boxSizing: 'border-box', width: '100%' },
  textarea: { width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14, resize: 'vertical', boxSizing: 'border-box', marginTop: 4 },
  sentimentPreview: { display: 'flex', alignItems: 'center', gap: 10, margin: '12px 0', background: '#f0fdf4', padding: '10px 14px', borderRadius: 8, fontSize: 14, border: '1px solid #86efac' },
  btn: { background: '#e94560', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: 'pointer', marginTop: 16 },
  cancelBtn: { background: '#6c757d', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: 8, fontSize: 14, cursor: 'pointer', marginTop: 16, marginLeft: 10 },
  feedbackCard: { background: '#fff', borderRadius: 12, padding: 20, marginBottom: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' },
  feedbackHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  code: { padding: '2px 8px', borderRadius: 4, fontSize: 12, marginLeft: 6, fontWeight: 700 },
  comment: { color: '#555', margin: '8px 0', fontSize: 14 },
  date: { color: '#aaa', fontSize: 12, marginTop: 6 },
  deleteBtn: { background: '#fee2e2', border: 'none', padding: '5px 10px', borderRadius: 6, cursor: 'pointer', fontSize: 13, color: '#ef4444' },
  empty: { color: '#aaa', textAlign: 'center', padding: 30 },
  inputError: { border: '1.5px solid #ef4444', background: '#fff5f5' },
  errorMsg: { color: '#ef4444', fontSize: 12, marginTop: 4, display: 'block' },
};
