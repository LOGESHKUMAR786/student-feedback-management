import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../utils/api';

const empty = { course_name: '', course_code: '', faculty_id: '', department_id: '' };

export default function ManageCourses() {
  const [courses, setCourses] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [assign, setAssign] = useState({ student_id: '', course_id: '' });

  const load = () => {
    api.get('/admin/courses').then(r => setCourses(r.data));
    api.get('/admin/faculty').then(r => setFaculty(r.data));
    api.get('/admin/departments').then(r => setDepartments(r.data));
    api.get('/admin/students').then(r => setStudents(r.data));
  };
  useEffect(() => { load(); }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editId) { await api.put(`/admin/courses/${editId}`, form); toast.success('Course updated'); }
      else { await api.post('/admin/courses', form); toast.success('Course added'); }
      setForm(empty); setEditId(null); setShowForm(false); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleAssign = async e => {
    e.preventDefault();
    try {
      await api.post('/admin/courses/assign', assign);
      toast.success('Course assigned to student');
      setAssign({ student_id: '', course_id: '' });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleEdit = c => { setForm({ course_name: c.course_name, course_code: c.course_code, faculty_id: c.faculty_id, department_id: c.department_id }); setEditId(c.id); setShowForm(true); };
  const handleDelete = async id => {
    if (!window.confirm('Delete course?')) return;
    await api.delete(`/admin/courses/${id}`); toast.success('Deleted'); load();
  };

  return (
    <div style={styles.page}>
      <div style={styles.topBar}>
        <h2 style={styles.heading}>📚 Manage Courses</h2>
        <button style={styles.addBtn} onClick={() => { setShowForm(!showForm); setForm(empty); setEditId(null); }}>
          {showForm ? '✕ Cancel' : '+ Add Course'}
        </button>
      </div>

      {showForm && (
        <div style={styles.formCard}>
          <h3 style={{ marginTop: 0 }}>{editId ? 'Edit Course' : 'Add New Course'}</h3>
          <form onSubmit={handleSubmit} style={styles.formGrid}>
            <input style={styles.input} placeholder="Course Name" value={form.course_name}
              onChange={e => setForm({ ...form, course_name: e.target.value })} required />
            <input style={styles.input} placeholder="Course Code" value={form.course_code}
              onChange={e => setForm({ ...form, course_code: e.target.value })} required />
            <select style={styles.input} value={form.faculty_id} onChange={e => setForm({ ...form, faculty_id: e.target.value })}>
              <option value="">Select Faculty</option>
              {faculty.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
            <select style={styles.input} value={form.department_id} onChange={e => setForm({ ...form, department_id: e.target.value })}>
              <option value="">Select Department</option>
              {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
            <button style={styles.saveBtn}>{editId ? 'Update' : 'Add'}</button>
          </form>
        </div>
      )}

      <div style={styles.formCard}>
        <h3 style={{ marginTop: 0 }}>🔗 Assign Course to Student</h3>
        <form onSubmit={handleAssign} style={styles.formRow}>
          <select style={styles.input} value={assign.student_id} onChange={e => setAssign({ ...assign, student_id: e.target.value })} required>
            <option value="">Select Student</option>
            {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.roll_number})</option>)}
          </select>
          <select style={styles.input} value={assign.course_id} onChange={e => setAssign({ ...assign, course_id: e.target.value })} required>
            <option value="">Select Course</option>
            {courses.map(c => <option key={c.id} value={c.id}>{c.course_name}</option>)}
          </select>
          <button style={styles.saveBtn}>Assign</button>
        </form>
      </div>

      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead><tr style={styles.thead}>
            <th style={styles.th}>#</th><th style={styles.th}>Course</th><th style={styles.th}>Code</th>
            <th style={styles.th}>Faculty</th><th style={styles.th}>Department</th><th style={styles.th}>Actions</th>
          </tr></thead>
          <tbody>
            {courses.map((c, i) => (
              <tr key={c.id} style={styles.tr}>
                <td style={styles.td}>{i + 1}</td>
                <td style={styles.td}><strong>{c.course_name}</strong></td>
                <td style={styles.td}><span style={styles.badge}>{c.course_code}</span></td>
                <td style={styles.td}>{c.faculty_name || '—'}</td>
                <td style={styles.td}>{c.department || '—'}</td>
                <td style={styles.td}>
                  <button style={styles.editBtn} onClick={() => handleEdit(c)}>✏️ Edit</button>
                  <button style={styles.delBtn} onClick={() => handleDelete(c.id)}>🗑 Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {courses.length === 0 && <p style={styles.empty}>No courses added yet.</p>}
      </div>
    </div>
  );
}

const styles = {
  page: { padding: 24, maxWidth: 1100, margin: '0 auto' },
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  heading: { color: '#1a1a2e', margin: 0 },
  addBtn: { background: '#27ae60', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, cursor: 'pointer', fontWeight: 600 },
  formCard: { background: '#fff', borderRadius: 12, padding: 24, marginBottom: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  formRow: { display: 'flex', gap: 12, flexWrap: 'wrap' },
  input: { padding: '10px 12px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14 },
  saveBtn: { background: '#e94560', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 8, cursor: 'pointer', fontWeight: 600 },
  tableWrap: { background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { background: '#1a1a2e' },
  th: { padding: '14px 16px', textAlign: 'left', color: '#fff', fontSize: 13 },
  tr: { borderBottom: '1px solid #f0f0f0' },
  td: { padding: '12px 16px', fontSize: 14 },
  badge: { background: '#e8f4fd', color: '#3498db', padding: '2px 8px', borderRadius: 4, fontSize: 12 },
  editBtn: { background: '#e8f4fd', color: '#3498db', border: 'none', padding: '5px 12px', borderRadius: 6, cursor: 'pointer', marginRight: 6, fontSize: 13 },
  delBtn: { background: '#fee', color: '#e74c3c', border: '1px solid #fcc', padding: '5px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 13 },
  empty: { textAlign: 'center', color: '#aaa', padding: 30 },
};
