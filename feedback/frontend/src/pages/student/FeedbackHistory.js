import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import StarRating from '../../components/StarRating';
import SentimentBadge from '../../components/SentimentBadge';

function parseKeywords(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  try { return JSON.parse(val); } catch { return val.split(',').map(k => k.trim()).filter(Boolean); }
}

export default function FeedbackHistory() {
  const [feedback, setFeedback] = useState([]);
  const [filter, setFilter] = useState('all');
  const [editItem, setEditItem] = useState(null);
  const [editForm, setEditForm] = useState({ rating: 0, comment: '' });
  const [loading, setLoading] = useState(false);

  const load = () => api.get('/feedback/my').then(r => setFeedback(r.data));
  useEffect(() => { load(); }, []);

  const filtered = filter === 'all' ? feedback : feedback.filter(f => f.sentiment === filter);

  const handleEdit = f => {
    setEditItem(f);
    setEditForm({ rating: f.rating, comment: f.comment });
  };

  const handleUpdate = async () => {
    if (!editForm.rating) return toast.error('Please select a rating');
    setLoading(true);
    try {
      await api.put(`/feedback/${editItem.id}`, editForm);
      toast.success('Feedback updated!');
      setEditItem(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally { setLoading(false); }
  };

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>📋 My Feedback History</h2>

      <div style={styles.filters}>
        {['all', 'positive', 'neutral', 'negative'].map(f => (
          <button key={f} style={{ ...styles.filterBtn, ...(filter === f ? styles.activeFilter : {}) }}
            onClick={() => setFilter(f)}>
            {f === 'all' ? '📋 All' : f === 'positive' ? '😄 Positive' : f === 'neutral' ? '😐 Neutral' : '😡 Negative'}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? <p style={styles.empty}>No feedback found.</p> :
        filtered.map(f => (
          <div key={f.id} style={styles.card}>
            <div style={styles.header}>
              <div>
                <strong style={{ fontSize: 16 }}>{f.course_name}</strong>
                <span style={styles.code}>{f.course_code}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <SentimentBadge sentiment={f.sentiment} />
                <button style={styles.editBtn} onClick={() => handleEdit(f)}>✏️ Edit</button>
              </div>
            </div>
            <div style={styles.meta}>👨🏫 {f.faculty_name} &nbsp;|&nbsp; 🔄 {f.cycle_title}</div>
            <StarRating value={f.rating} readOnly />
            <p style={styles.comment}>{f.comment}</p>
            {f.keywords && parseKeywords(f.keywords).length > 0 && (
              <div style={styles.keywords}>
                <strong style={{ fontSize: 13 }}>🏷️ Keywords: </strong>
                {parseKeywords(f.keywords).map(k => <span key={k} style={styles.keyword}>{k}</span>)}
              </div>
            )}
            <p style={styles.date}>📅 {new Date(f.submitted_at).toLocaleString()}</p>
          </div>
        ))}

      {editItem && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3 style={{ margin: '0 0 6px', color: '#1e293b' }}>✏️ Edit Feedback</h3>
            <p style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>
              <strong>{editItem.course_name}</strong> — {editItem.cycle_title}
            </p>
            <label style={styles.label}>Rating</label>
            <StarRating value={editForm.rating} onChange={r => setEditForm({ ...editForm, rating: r })} />
            <label style={{ ...styles.label, marginTop: 14 }}>Comment</label>
            <textarea style={styles.textarea} rows={5}
              placeholder="Update your comment..."
              value={editForm.comment}
              onChange={e => setEditForm({ ...editForm, comment: e.target.value })} />
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <button style={styles.saveBtn} disabled={loading} onClick={handleUpdate}>
                {loading ? 'Saving...' : '💾 Save Changes'}
              </button>
              <button style={styles.cancelBtn} onClick={() => setEditItem(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { padding: 24, maxWidth: 800, margin: '0 auto' },
  heading: { color: '#1a1a2e', marginBottom: 16 },
  filters: { display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' },
  filterBtn: { padding: '8px 16px', border: '1px solid #ddd', borderRadius: 20, cursor: 'pointer', background: '#fff', fontSize: 13 },
  activeFilter: { background: '#e94560', color: '#fff', border: '1px solid #e94560' },
  card: { background: '#fff', borderRadius: 12, padding: 20, marginBottom: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  code: { background: '#e8f4fd', color: '#3498db', padding: '2px 8px', borderRadius: 4, fontSize: 12, marginLeft: 8 },
  meta: { color: '#888', fontSize: 13, marginBottom: 8 },
  comment: { color: '#555', margin: '8px 0', fontSize: 14, lineHeight: 1.5 },
  keywords: { display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center', marginTop: 6 },
  keyword: { background: '#e8f4fd', color: '#3498db', padding: '2px 10px', borderRadius: 12, fontSize: 12 },
  date: { color: '#aaa', fontSize: 12, marginTop: 8 },
  editBtn: { background: '#f0f0f0', border: 'none', padding: '5px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 600 },
  empty: { color: '#aaa', textAlign: 'center', padding: 40, fontSize: 16 },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { background: '#fff', borderRadius: 16, padding: 28, width: '100%', maxWidth: 480, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' },
  label: { display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 },
  textarea: { width: '100%', padding: '10px 12px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 14, boxSizing: 'border-box', resize: 'vertical' },
  saveBtn: { background: 'linear-gradient(135deg,#667eea,#764ba2)', color: '#fff', border: 'none', padding: '11px 24px', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer' },
  cancelBtn: { background: '#f1f5f9', color: '#64748b', border: 'none', padding: '11px 20px', borderRadius: 8, fontSize: 14, cursor: 'pointer' },
};
