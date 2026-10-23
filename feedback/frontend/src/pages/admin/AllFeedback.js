import { useEffect, useState } from 'react';
import api from '../../utils/api';
import StarRating from '../../components/StarRating';
import SentimentBadge from '../../components/SentimentBadge';

export default function AllFeedback() {
  const [feedback, setFeedback] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => { api.get('/feedback/all').then(r => setFeedback(r.data)); }, []);

  const filtered = feedback.filter(f => {
    const matchSentiment = filter === 'all' || f.sentiment === filter;
    const matchSearch = !search || f.student_name?.toLowerCase().includes(search.toLowerCase()) ||
      f.course_name?.toLowerCase().includes(search.toLowerCase()) || f.faculty_name?.toLowerCase().includes(search.toLowerCase());
    return matchSentiment && matchSearch;
  });

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>📊 All Feedback</h2>
      <div style={styles.toolbar}>
        <input style={styles.search} placeholder="🔍 Search student, course, faculty..." value={search}
          onChange={e => setSearch(e.target.value)} />
        <div style={styles.filters}>
          {['all', 'positive', 'neutral', 'negative'].map(f => (
            <button key={f} style={{ ...styles.filterBtn, ...(filter === f ? styles.active : {}) }}
              onClick={() => setFilter(f)}>
              {f === 'all' ? 'All' : f === 'positive' ? '😄' : f === 'neutral' ? '😐' : '😡'} {f}
            </button>
          ))}
        </div>
        <span style={styles.count}>{filtered.length} records</span>
      </div>

      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead><tr style={styles.thead}>
            <th style={styles.th}>Student</th><th style={styles.th}>Course</th><th style={styles.th}>Faculty</th>
            <th style={styles.th}>Rating</th><th style={styles.th}>Sentiment</th><th style={styles.th}>Comment</th><th style={styles.th}>Date</th>
          </tr></thead>
          <tbody>
            {filtered.map(f => (
              <tr key={f.id} style={styles.tr}>
                <td style={styles.td}><strong>{f.student_name}</strong></td>
                <td style={styles.td}>{f.course_name}</td>
                <td style={styles.td}>{f.faculty_name}</td>
                <td style={styles.td}><StarRating value={f.rating} readOnly /></td>
                <td style={styles.td}><SentimentBadge sentiment={f.sentiment} /></td>
                <td style={styles.td}><span style={styles.comment}>{f.comment?.slice(0, 60)}{f.comment?.length > 60 ? '...' : ''}</span></td>
                <td style={styles.td}>{new Date(f.submitted_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p style={styles.empty}>No feedback found.</p>}
      </div>
    </div>
  );
}

const styles = {
  page: { padding: 24, maxWidth: 1200, margin: '0 auto' },
  heading: { color: '#1a1a2e', marginBottom: 16 },
  toolbar: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' },
  search: { padding: '10px 14px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14, width: 280 },
  filters: { display: 'flex', gap: 6 },
  filterBtn: { padding: '8px 14px', border: '1px solid #ddd', borderRadius: 20, cursor: 'pointer', background: '#fff', fontSize: 13 },
  active: { background: '#e94560', color: '#fff', border: '1px solid #e94560' },
  count: { color: '#888', fontSize: 13, marginLeft: 'auto' },
  tableWrap: { background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', overflow: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', minWidth: 900 },
  thead: { background: '#1a1a2e' },
  th: { padding: '14px 16px', textAlign: 'left', color: '#fff', fontSize: 13 },
  tr: { borderBottom: '1px solid #f0f0f0' },
  td: { padding: '10px 16px', fontSize: 13, verticalAlign: 'middle' },
  comment: { color: '#666' },
  empty: { textAlign: 'center', color: '#aaa', padding: 30 },
};
