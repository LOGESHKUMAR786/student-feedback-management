import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../utils/api';

const empty = { name: '', email: '', department_id: '' };

export default function ManageFaculty() {
  const [faculty, setFaculty] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const load = () => {
    api.get('/admin/faculty').then(r => setFaculty(r.data));
    api.get('/admin/departments').then(r => setDepartments(r.data));
  };
  useEffect(() => { load(); }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editId) { await api.put(`/admin/faculty/${editId}`, form); toast.success('Faculty updated'); }
      else { await api.post('/admin/faculty', form); toast.success('Faculty added'); }
      setForm(empty); setEditId(null); setShowForm(false); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleEdit = f => { setForm({ name: f.name, email: f.email, department_id: f.department_id }); setEditId(f.id); setShowForm(true); };
  const handleDelete = async id => {
    if (!window.confirm('Delete faculty?')) return;
    await api.delete(`/admin/faculty/${id}`); toast.success('Deleted'); load();
  };

  return (
    <div style={styles.page}>
      <div style={styles.topBar}>
        <h2 style={styles.heading}>👨🏫 Manage Faculty</h2>
        <button style={styles.addBtn} onClick={() => { setShowForm(!showForm); setForm(empty); setEditId(null); }}>
          {showForm ? '✕ Cancel' : '+ Add Faculty'}
        </button>
      </div>

      {showForm && (
        <div style={styles.formCard}>
          <h3 style={{ marginTop: 0 }}>{editId ? 'Edit Faculty' : 'Add New Faculty'}</h3>
          <form onSubmit={handleSubmit} style={styles.formRow}>
            <input style={styles.input} placeholder="Full Name" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })} required />
            <input style={styles.input} type="email" placeholder="Email" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} required />
            <select style={styles.input} value={form.department_id}
              onChange={e => setForm({ ...form, department_id: e.target.value })}>
              <option value="">Select Department</option>
              {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
            <button style={styles.saveBtn}>{editId ? 'Update' : 'Add'}</button>
          </form>
        </div>
      )}

      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead><tr style={styles.thead}>
            <th style={styles.th}>#</th><th style={styles.th}>Name</th>
            <th style={styles.th}>Email</th><th style={styles.th}>Department</th><th style={styles.th}>Actions</th>
          </tr></thead>
          <tbody>
            {faculty.map((f, i) => (
              <tr key={f.id} style={styles.tr}>
                <td style={styles.td}>{i + 1}</td>
                <td style={styles.td}><strong>{f.name}</strong></td>
                <td style={styles.td}>{f.email}</td>
                <td style={styles.td}>{f.department || '—'}</td>
                <td style={styles.td}>
                  <button style={styles.editBtn} onClick={() => handleEdit(f)}>✏️ Edit</button>
                  <button style={styles.delBtn} onClick={() => handleDelete(f.id)}>🗑 Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {faculty.length === 0 && <p style={styles.empty}>No faculty added yet.</p>}
      </div>
    </div>
  );
}

const styles = {
  page: { padding: 24, maxWidth: 1000, margin: '0 auto' },
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  heading: { color: '#1a1a2e', margin: 0 },
  addBtn: { background: '#27ae60', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, cursor: 'pointer', fontWeight: 600 },
  formCard: { background: '#fff', borderRadius: 12, padding: 24, marginBottom: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
  formRow: { display: 'flex', gap: 12, flexWrap: 'wrap' },
  input: { padding: '10px 12px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14, flex: 1, minWidth: 180 },
  saveBtn: { background: '#e94560', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 8, cursor: 'pointer', fontWeight: 600 },
  tableWrap: { background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { background: '#1a1a2e' },
  th: { padding: '14px 16px', textAlign: 'left', color: '#fff', fontSize: 13 },
  tr: { borderBottom: '1px solid #f0f0f0' },
  td: { padding: '12px 16px', fontSize: 14 },
  editBtn: { background: '#e8f4fd', color: '#3498db', border: 'none', padding: '5px 12px', borderRadius: 6, cursor: 'pointer', marginRight: 6, fontSize: 13 },
  delBtn: { background: '#fee', color: '#e74c3c', border: '1px solid #fcc', padding: '5px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 13 },
  empty: { textAlign: 'center', color: '#aaa', padding: 30 },
};
