import { useEffect, useState } from 'react';
import api from '../../utils/api';

export default function DepartmentReports() {
  const [report, setReport] = useState([]);
  const [selectedDept, setSelectedDept] = useState('all');

  useEffect(() => { api.get('/dean/department-report').then(r => setReport(r.data)).catch(() => {}); }, []);

  const departments = [...new Set(report.map(r => r.department))];
  const filtered = selectedDept === 'all' ? report : report.filter(r => r.department === selectedDept);

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>📈 Department-wise Reports</h2>

      <div style={styles.filters}>
        <button style={{ ...styles.filterBtn, ...(selectedDept === 'all' ? styles.active : {}) }}
          onClick={() => setSelectedDept('all')}>All Departments</button>
        {departments.map(d => (
          <button key={d} style={{ ...styles.filterBtn, ...(selectedDept === d ? styles.active : {}) }}
            onClick={() => setSelectedDept(d)}>{d}</button>
        ))}
      </div>

      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead><tr style={styles.thead}>
            <th style={styles.th}>Department</th><th style={styles.th}>Faculty</th><th style={styles.th}>Course</th>
            <th style={styles.th}>Avg Rating</th><th style={styles.th}>Total</th><th style={styles.th}>Positive</th><th style={styles.th}>Negative</th>
          </tr></thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr key={i} style={styles.tr}>
                <td style={styles.td}><span style={styles.deptBadge}>{r.department}</span></td>
                <td style={styles.td}>{r.faculty}</td>
                <td style={styles.td}>{r.course_name}</td>
                <td style={styles.td}>
                  <strong style={{ color: parseFloat(r.avg_rating) >= 4 ? '#27ae60' : parseFloat(r.avg_rating) >= 3 ? '#f39c12' : '#e74c3c' }}>
                    {parseFloat(r.avg_rating || 0).toFixed(2)} ⭐
                  </strong>
                </td>
                <td style={styles.td}>{r.total_feedback}</td>
                <td style={styles.td}><span style={styles.pos}>{r.positive} 😄</span></td>
                <td style={styles.td}><span style={styles.neg}>{r.negative} 😡</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p style={styles.empty}>No data available.</p>}
      </div>
    </div>
  );
}

const styles = {
  page: { padding: 24, maxWidth: 1100, margin: '0 auto' },
  heading: { color: '#1a1a2e', marginBottom: 16 },
  filters: { display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' },
  filterBtn: { padding: '8px 16px', border: '1px solid #ddd', borderRadius: 20, cursor: 'pointer', background: '#fff', fontSize: 13 },
  active: { background: '#1a1a2e', color: '#fff', border: '1px solid #1a1a2e' },
  tableWrap: { background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', overflow: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', minWidth: 800 },
  thead: { background: '#1a1a2e' },
  th: { padding: '14px 16px', textAlign: 'left', color: '#fff', fontSize: 13 },
  tr: { borderBottom: '1px solid #f0f0f0' },
  td: { padding: '12px 16px', fontSize: 14 },
  deptBadge: { background: '#e8f4fd', color: '#3498db', padding: '3px 10px', borderRadius: 12, fontSize: 12, fontWeight: 600 },
  pos: { color: '#27ae60', fontWeight: 600 },
  neg: { color: '#e74c3c', fontWeight: 600 },
  empty: { textAlign: 'center', color: '#aaa', padding: 30 },
};
