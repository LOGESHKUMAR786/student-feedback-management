import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import StarRating from '../../components/StarRating';
import SentimentBadge from '../../components/SentimentBadge';

const positiveWords = ['excellent','great','good','amazing','wonderful','fantastic','helpful','clear','best','love','perfect','outstanding','brilliant','superb','satisfied','happy','enjoyed','interesting','engaging','knowledgeable'];
const negativeWords = ['bad','poor','terrible','awful','boring','slow','confusing','worst','hate','difficult','unclear','disappointing','useless','waste','hard','unhelpful','monotonous','dull','ineffective','unprepared'];

function parseKeywords(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') {
    try { return JSON.parse(val); } catch { return val.split(',').map(k => k.trim()).filter(Boolean); }
  }
  return [];
}

function previewSentiment(text) {
  if (!text) return null;
  const words = text.toLowerCase().split(/\W+/);
  let score = 0;
  words.forEach(w => { if (positiveWords.includes(w)) score++; if (negativeWords.includes(w)) score--; });
  return score > 0 ? 'positive' : score < 0 ? 'negative' : 'neutral';
}

export default function SubmitFeedback() {
  const [courses, setCourses] = useState([]);
  const [cycles, setCycles] = useState([]);
  const [submitted, setSubmitted] = useState([]);
  const [form, setForm] = useState({ course_id: '', cycle_id: '', rating: 0, comment: '' });
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    api.get('/student/courses').then(r => setCourses(r.data));
    api.get('/student/cycles').then(r => setCycles(r.data));
    api.get('/feedback/my').then(r => setSubmitted(r.data));
  }, []);

  const alreadySubmitted = submitted.find(
    f => f.course_id === parseInt(form.course_id) && f.cycle_id === parseInt(form.cycle_id)
  );

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.rating) return toast.error('Please select a rating');
    setLoading(true);
    try {
      if (editId) {
        await api.put(`/feedback/${editId}`, { rating: form.rating, comment: form.comment });
        toast.success('Feedback updated!');
      } else {
        await api.post('/feedback', form);
        toast.success('Feedback submitted! 🎉');
      }
      const r = await api.get('/feedback/my');
      setSubmitted(r.data);
      setForm({ course_id: '', cycle_id: '', rating: 0, comment: '' });
      setEditId(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit');
    } finally { setLoading(false); }
  };

  const handleEdit = f => {
    setForm({ course_id: f.course_id, cycle_id: f.cycle_id, rating: f.rating, comment: f.comment });
    setEditId(f.id);
    window.scrollTo(0, 0);
  };

  const sentiment = previewSentiment(form.comment);

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>{editId ? '✏️ Edit Feedback' : '📝 Submit Feedback'}</h2>

      <div style={styles.formCard}>
        <form onSubmit={handleSubmit}>
          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Select Course</label>
              <select style={styles.select} value={form.course_id}
                onChange={e => setForm({ ...form, course_id: e.target.value })} required>
                <option value="">-- Choose Course --</option>
                {courses.map(c => <option key={c.id} value={c.id}>{c.course_name} ({c.course_code})</option>)}
              </select>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Feedback Cycle</label>
              <select style={styles.select} value={form.cycle_id}
                onChange={e => setForm({ ...form, cycle_id: e.target.value })} required>
                <option value="">-- Choose Cycle --</option>
                {cycles.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
            </div>
          </div>

          {alreadySubmitted && !editId && (
            <div style={styles.warning}>⚠️ You already submitted feedback for this course in this cycle.</div>
          )}

          <label style={styles.label}>Rating</label>
          <StarRating value={form.rating} onChange={r => setForm({ ...form, rating: r })} />

          <label style={{ ...styles.label, marginTop: 16 }}>Comment</label>
          <textarea style={styles.textarea} rows={5} placeholder="Share your experience with this course..."
            value={form.comment} onChange={e => setForm({ ...form, comment: e.target.value })} />

          {sentiment && form.comment.length > 5 && (
            <div style={styles.sentimentPreview}>
              🤖 AI Sentiment Preview: <SentimentBadge sentiment={sentiment} />
            </div>
          )}

          <button style={styles.btn} disabled={loading || (alreadySubmitted && !editId)}>
            {loading ? 'Submitting...' : editId ? 'Update Feedback' : 'Submit Feedback'}
          </button>
          {editId && (
            <button type="button" style={styles.cancelBtn}
              onClick={() => { setEditId(null); setForm({ course_id: '', cycle_id: '', rating: 0, comment: '' }); }}>
              Cancel
            </button>
          )}
        </form>
      </div>

      <h3 style={styles.heading}>📋 My Submitted Feedback</h3>
      {submitted.length === 0 ? <p style={styles.empty}>No feedback submitted yet.</p> :
        submitted.map(f => (
          <div key={f.id} style={styles.feedbackCard}>
            <div style={styles.feedbackHeader}>
              <div>
                <strong>{f.course_name}</strong> <span style={styles.code}>{f.course_code}</span>
                <span style={{ marginLeft: 10, color: '#888', fontSize: 13 }}>Cycle: {f.cycle_title}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <SentimentBadge sentiment={f.sentiment} />
                <button style={styles.editBtn} onClick={() => handleEdit(f)}>✏️ Edit</button>
              </div>
            </div>
            <StarRating value={f.rating} readOnly />
            <p style={styles.comment}>{f.comment}</p>
            {f.keywords && parseKeywords(f.keywords).length > 0 && (
              <div style={styles.keywords}>
                {parseKeywords(f.keywords).map(k => <span key={k} style={styles.keyword}>{k}</span>)}
              </div>
            )}
            <p style={styles.date}>Submitted: {new Date(f.submitted_at).toLocaleString()}</p>
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
  select: { padding: '10px 12px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14 },
  textarea: { width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: 8,
    fontSize: 14, resize: 'vertical', boxSizing: 'border-box', marginTop: 4 },
  sentimentPreview: { display: 'flex', alignItems: 'center', gap: 10, margin: '12px 0',
    background: '#f8f9fa', padding: '10px 14px', borderRadius: 8, fontSize: 14 },
  btn: { background: '#e94560', color: '#fff', border: 'none', padding: '12px 28px',
    borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: 'pointer', marginTop: 16 },
  cancelBtn: { background: '#6c757d', color: '#fff', border: 'none', padding: '12px 20px',
    borderRadius: 8, fontSize: 14, cursor: 'pointer', marginTop: 16, marginLeft: 10 },
  warning: { background: '#fff3cd', border: '1px solid #ffc107', borderRadius: 8, padding: '10px 14px', marginBottom: 12, fontSize: 14 },
  feedbackCard: { background: '#fff', borderRadius: 12, padding: 20, marginBottom: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' },
  feedbackHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  code: { background: '#e8f4fd', color: '#3498db', padding: '2px 8px', borderRadius: 4, fontSize: 12, marginLeft: 6 },
  comment: { color: '#555', margin: '8px 0', fontSize: 14 },
  keywords: { display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 },
  keyword: { background: '#e8f4fd', color: '#3498db', padding: '2px 10px', borderRadius: 12, fontSize: 12 },
  date: { color: '#aaa', fontSize: 12, marginTop: 6 },
  editBtn: { background: '#f0f0f0', border: 'none', padding: '5px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 13 },
  empty: { color: '#aaa', textAlign: 'center', padding: 30 },
};
