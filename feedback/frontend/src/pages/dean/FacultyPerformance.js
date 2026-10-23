import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import StarRating from '../../components/StarRating';

export default function FacultyPerformance() {
  const [performance, setPerformance] = useState([]);
  const [remark, setRemark] = useState({ faculty_id: null, text: '' });

  useEffect(() => { api.get('/dean/faculty-performance').then(r => setPerformance(r.data)).catch(() => {}); }, []);

  const handleRemark = async (faculty_id) => {
    if (!remark.text.trim()) return toast.error('Enter a remark');
    try {
      await api.post('/dean/remark', { faculty_id, remark: remark.text });
      toast.success('Remark saved');
      setRemark({ faculty_id: null, text: '' });
    } catch { toast.error('Failed to save remark'); }
  };

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>🎓 Faculty Performance Analysis</h2>
      {performance.map(f => (
        <div key={f.id} style={styles.card}>
          <div style={styles.cardHeader}>
            <div>
              <h3 style={styles.name}>{f.name}</h3>
              <span style={styles.dept}>{f.department || 'N/A'}</span>
            </div>
            <div style={styles.ratingBox}>
              <div style={{ fontSize: 28, fontWeight: 700, color: parseFloat(f.avg_rating) >= 4 ? '#27ae60' : parseFloat(f.avg_rating) >= 3 ? '#f39c12' : '#e74c3c' }}>
                {parseFloat(f.avg_rating || 0).toFixed(1)}
              </div>
              <StarRating value={Math.round(f.avg_rating || 0)} readOnly />
              <div style={{ fontSize: 12, color: '#888' }}>{f.total_feedback} reviews</div>
            </div>
          </div>

          <div style={styles.statsRow}>
            <div style={styles.stat}><span style={styles.statVal}>{f.total_feedback || 0}</span><span style={styles.statLabel}>Total</span></div>
            <div style={styles.stat}><span style={{ ...styles.statVal, color: '#27ae60' }}>{f.positive || 0}</span><span style={styles.statLabel}>😄 Positive</span></div>
            <div style={styles.stat}><span style={{ ...styles.statVal, color: '#f39c12' }}>{f.neutral || 0}</span><span style={styles.statLabel}>😐 Neutral</span></div>
            <div style={styles.stat}><span style={{ ...styles.statVal, color: '#e74c3c' }}>{f.negative || 0}</span><span style={styles.statLabel}>😡 Negative</span></div>
          </div>

          {f.keywords?.length > 0 && (
            <div style={styles.keywords}>
              <strong style={{ fontSize: 13 }}>🏷️ Top Keywords: </strong>
              {f.keywords.map(k => <span key={k} style={styles.keyword}>{k}</span>)}
            </div>
          )}

          <div style={styles.remarkSection}>
            {remark.faculty_id === f.id ? (
              <div style={styles.remarkForm}>
                <textarea style={styles.remarkInput} rows={3} placeholder="Enter your remarks/action plan..."
                  value={remark.text} onChange={e => setRemark({ ...remark, text: e.target.value })} />
                <div style={{ display: 'flex', gap: 8 }}>
                  <button style={styles.saveBtn} onClick={() => handleRemark(f.id)}>💾 Save Remark</button>
                  <button style={styles.cancelBtn} onClick={() => setRemark({ faculty_id: null, text: '' })}>Cancel</button>
                </div>
              </div>
            ) : (
              <button style={styles.remarkBtn} onClick={() => setRemark({ faculty_id: f.id, text: '' })}>
                ✍️ Add Remark / Action
              </button>
            )}
          </div>
        </div>
      ))}
      {performance.length === 0 && <p style={styles.empty}>No faculty performance data available.</p>}
    </div>
  );
}

const styles = {
  page: { padding: 24, maxWidth: 900, margin: '0 auto' },
  heading: { color: '#1a1a2e', marginBottom: 20 },
  card: { background: '#fff', borderRadius: 12, padding: 24, marginBottom: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  name: { margin: '0 0 4px', color: '#1a1a2e', fontSize: 18 },
  dept: { background: '#e8f4fd', color: '#3498db', padding: '3px 10px', borderRadius: 12, fontSize: 12 },
  ratingBox: { textAlign: 'center' },
  statsRow: { display: 'flex', gap: 20, marginBottom: 14, flexWrap: 'wrap' },
  stat: { display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 60 },
  statVal: { fontSize: 22, fontWeight: 700, color: '#1a1a2e' },
  statLabel: { fontSize: 12, color: '#888' },
  keywords: { display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center', marginBottom: 14 },
  keyword: { background: '#f0f0f0', color: '#555', padding: '3px 10px', borderRadius: 12, fontSize: 12 },
  remarkSection: { borderTop: '1px solid #f0f0f0', paddingTop: 14 },
  remarkForm: { display: 'flex', flexDirection: 'column', gap: 8 },
  remarkInput: { padding: '10px 12px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14, resize: 'vertical' },
  saveBtn: { background: '#27ae60', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: 8, cursor: 'pointer', fontWeight: 600 },
  cancelBtn: { background: '#f0f0f0', border: 'none', padding: '8px 16px', borderRadius: 8, cursor: 'pointer' },
  remarkBtn: { background: '#f8f9fa', border: '1px dashed #ccc', padding: '8px 18px', borderRadius: 8, cursor: 'pointer', color: '#555', fontSize: 13 },
  empty: { textAlign: 'center', color: '#aaa', padding: 40 },
};
