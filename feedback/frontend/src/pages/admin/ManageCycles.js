import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../utils/api';

export default function ManageCycles() {
  const [cycles, setCycles] = useState([]);
  const [form, setForm] = useState({ title: '', start_date: '', end_date: '' });
  const [showForm, setShowForm] = useState(false);

  const load = () => api.get('/admin/cycles').then(r => setCycles(r.data));
  useEffect(() => { load(); }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await api.post('/admin/cycles', form);
      toast.success('Cycle created');
      setForm({ title: '', start_date: '', end_date: '' });
      setShowForm(false); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleToggle = async id => {
    await api.patch(`/admin/cycles/${id}/toggle`);
    toast.success('Cycle status updated'); load();
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this cycle? All feedback in this cycle will also be deleted.')) return;
    try {
      await api.delete(`/admin/cycles/${id}`);
      toast.success('Cycle deleted'); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to delete'); }
  };

  return (
    <div style={styles.page}>
      <div style={styles.topBar}>
        <h2 style={styles.heading}>🔄 Feedback Cycles</h2>
        <button style={styles.addBtn} onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '+ New Cycle'}
        </button>
      </div>

      {showForm && (
        <div style={styles.formCard}>
          <h3 style={{ marginTop: 0 }}>Create New Feedback Cycle</h3>
          <form onSubmit={handleSubmit} style={styles.formRow}>
            <input style={styles.input} placeholder="Cycle Title (e.g. Semester 1 - 2024)" value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })} required />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={styles.label}>Start Date</label>
              <input style={styles.input} type="date" value={form.start_date}
                onChange={e => setForm({ ...form, start_date: e.target.value })} required />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={styles.label}>End Date</label>
              <input style={styles.input} type="date" value={form.end_date}
                onChange={e => setForm({ ...form, end_date: e.target.value })} required />
            </div>
            <button style={styles.saveBtn}>Create</button>
          </form>
        </div>
      )}

      <div style={styles.grid}>
        {cycles.map(c => (
          <div key={c.id} style={{ ...styles.cycleCard, borderLeft: `4px solid ${c.status === 'open' ? '#27ae60' : '#e74c3c'}` }}>
            <div style={styles.cycleHeader}>
              <strong style={{ fontSize: 16 }}>{c.title}</strong>
              <span style={{ ...styles.statusBadge, background: c.status === 'open' ? '#eafaf1' : '#fdedec',
                color: c.status === 'open' ? '#27ae60' : '#e74c3c' }}>
                {c.status === 'open' ? '🟢 Open' : '🔴 Closed'}
              </span>
            </div>
            <div style={styles.cycleDates}>
              📅 {new Date(c.start_date).toLocaleDateString()} → {new Date(c.end_date).toLocaleDateString()}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button style={{ ...styles.toggleBtn, background: c.status === 'open' ? '#fee' : '#eafaf1',
                color: c.status === 'open' ? '#e74c3c' : '#27ae60', flex: 1 }}
                onClick={() => handleToggle(c.id)}>
                {c.status === 'open' ? '🔒 Close Cycle' : '🔓 Open Cycle'}
              </button>
              <button style={{ ...styles.toggleBtn, background: '#fee2e2', color: '#ef4444' }}
                onClick={() => handleDelete(c.id)}>🗑️ Delete</button>
            </div>
          </div>
        ))}
        {cycles.length === 0 && <p style={styles.empty}>No cycles created yet.</p>}
      </div>
    </div>
  );
}

const styles = {
  page: { padding: 24, maxWidth: 900, margin: '0 auto' },
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  heading: { color: '#1a1a2e', margin: 0 },
  addBtn: { background: '#27ae60', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, cursor: 'pointer', fontWeight: 600 },
  formCard: { background: '#fff', borderRadius: 12, padding: 24, marginBottom: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
  formRow: { display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' },
  label: { fontSize: 12, color: '#666', fontWeight: 600 },
  input: { padding: '10px 12px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14, flex: 1, minWidth: 180 },
  saveBtn: { background: '#e94560', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 8, cursor: 'pointer', fontWeight: 600 },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  cycleCard: { background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
  cycleHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  statusBadge: { padding: '4px 12px', borderRadius: 12, fontSize: 13, fontWeight: 600 },
  cycleDates: { color: '#666', fontSize: 13, marginBottom: 14 },
  toggleBtn: { border: 'none', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13 },
  empty: { textAlign: 'center', color: '#aaa', padding: 30, gridColumn: '1/-1' },
};
