import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../utils/api';

export default function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');

  const load = () => api.get('/admin/students').then(r => setStudents(r.data));
  useEffect(() => { load(); }, []);

  const handleDelete = async id => {
    if (!window.confirm('Delete this student?')) return;
    try {
      await api.delete(`/admin/students/${id}`);
      toast.success('Student deleted');
      load();
    } catch { toast.error('Failed to delete'); }
  };

  const filtered = students.filter(s =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.email?.toLowerCase().includes(search.toLowerCase()) ||
    s.roll_number?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>👨🎓 Manage Students</h2>
      <div style={styles.toolbar}>
        <input style={styles.search} placeholder="🔍 Search by name, email, roll..." value={search}
          onChange={e => setSearch(e.target.value)} />
        <span style={styles.count}>{filtered.length} students</span>
      </div>
      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead><tr style={styles.thead}>
            <th style={styles.th}>#</th><th style={styles.th}>Name</th><th style={styles.th}>Roll No</th>
            <th style={styles.th}>Email</th><th style={styles.th}>Department</th><th style={styles.th}>Actions</th>
          </tr></thead>
          <tbody>
            {filtered.map((s, i) => (
              <tr key={s.id} style={styles.tr}>
                <td style={styles.td}>{i + 1}</td>
                <td style={styles.td}><strong>{s.name}</strong></td>
                <td style={styles.td}><span style={styles.badge}>{s.roll_number || 'N/A'}</span></td>
                <td style={styles.td}>{s.email}</td>
                <td style={styles.td}>{s.department || '—'}</td>
                <td style={styles.td}>
                  <button style={styles.delBtn} onClick={() => handleDelete(s.id)}>🗑 Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p style={styles.empty}>No students found.</p>}
      </div>
    </div>
  );
}

const styles = {
  page: { padding: 24, maxWidth: 1100, margin: '0 auto' },
  heading: { color: '#1a1a2e', marginBottom: 16 },
  toolbar: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 },
  search: { padding: '10px 14px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14, width: 320 },
  count: { color: '#888', fontSize: 14 },
  tableWrap: { background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { background: '#1a1a2e' },
  th: { padding: '14px 16px', textAlign: 'left', color: '#fff', fontSize: 13, fontWeight: 600 },
  tr: { borderBottom: '1px solid #f0f0f0', transition: 'background 0.15s' },
  td: { padding: '12px 16px', fontSize: 14 },
  badge: { background: '#e8f4fd', color: '#3498db', padding: '2px 8px', borderRadius: 4, fontSize: 12 },
  delBtn: { background: '#fee', color: '#e74c3c', border: '1px solid #fcc', padding: '5px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 13 },
  empty: { textAlign: 'center', color: '#aaa', padding: 30 },
};
