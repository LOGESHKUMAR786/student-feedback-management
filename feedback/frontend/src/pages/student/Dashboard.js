import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import StarRating from '../../components/StarRating';
import SentimentBadge from '../../components/SentimentBadge';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [cycles, setCycles] = useState([]);
  const [recentFeedback, setRecentFeedback] = useState([]);

  useEffect(() => {
    api.get('/student/courses').then(r => setCourses(r.data)).catch(() => {});
    api.get('/student/cycles').then(r => setCycles(r.data)).catch(() => {});
    api.get('/feedback/my').then(r => setRecentFeedback(r.data.slice(0, 3))).catch(() => {});
  }, []);

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>👋 Welcome, {user?.username}!</h2>

      <div style={styles.statsRow}>
        <StatCard icon="📚" label="My Courses" value={courses.length} color="#3498db" />
        <StatCard icon="🔄" label="Active Cycles" value={cycles.length} color="#27ae60" />
        <StatCard icon="📝" label="Feedbacks Given" value={recentFeedback.length} color="#e94560" />
      </div>

      {cycles.length > 0 && (
        <div style={styles.alert}>
          🔔 <strong>{cycles.length} active feedback cycle(s)</strong> — Deadline: {new Date(cycles[0]?.end_date).toLocaleDateString()}
          <Link to="/student/feedback" style={styles.alertLink}>Submit Now →</Link>
        </div>
      )}

      <div style={styles.grid}>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>📚 My Courses</h3>
          {courses.length === 0 ? <p style={styles.empty}>No courses assigned yet.</p> :
            courses.map(c => (
              <div key={c.id} style={styles.courseItem}>
                <div>
                  <strong>{c.course_name}</strong> <span style={styles.code}>{c.course_code}</span>
                </div>
                <div style={styles.sub}>👨🏫 {c.faculty_name} | 🏛 {c.department}</div>
              </div>
            ))}
        </div>

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>📋 Recent Feedback</h3>
          {recentFeedback.length === 0 ? <p style={styles.empty}>No feedback submitted yet.</p> :
            recentFeedback.map(f => (
              <div key={f.id} style={styles.feedbackItem}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong>{f.course_name}</strong>
                  <SentimentBadge sentiment={f.sentiment} />
                </div>
                <StarRating value={f.rating} readOnly />
                <p style={styles.comment}>{f.comment?.slice(0, 80)}...</p>
              </div>
            ))}
          <Link to="/student/history" style={styles.viewAll}>View All →</Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div style={{ ...styles.statCard, borderTop: `4px solid ${color}` }}>
      <div style={{ fontSize: 32 }}>{icon}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color }}>{value}</div>
      <div style={{ color: '#666', fontSize: 14 }}>{label}</div>
    </div>
  );
}

const styles = {
  page: { padding: 24, maxWidth: 1100, margin: '0 auto' },
  heading: { color: '#1a1a2e', marginBottom: 20 },
  statsRow: { display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap' },
  statCard: { background: '#fff', borderRadius: 12, padding: '20px 28px', flex: 1, minWidth: 150,
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)', textAlign: 'center' },
  alert: { background: '#fff3cd', border: '1px solid #ffc107', borderRadius: 10, padding: '12px 18px',
    marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 },
  alertLink: { marginLeft: 'auto', color: '#e94560', fontWeight: 600, textDecoration: 'none' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 },
  card: { background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
  cardTitle: { color: '#1a1a2e', marginTop: 0, marginBottom: 16, borderBottom: '2px solid #f0f0f0', paddingBottom: 10 },
  courseItem: { padding: '10px 0', borderBottom: '1px solid #f5f5f5' },
  code: { background: '#e8f4fd', color: '#3498db', padding: '2px 8px', borderRadius: 4, fontSize: 12, marginLeft: 6 },
  sub: { color: '#888', fontSize: 13, marginTop: 4 },
  feedbackItem: { padding: '10px 0', borderBottom: '1px solid #f5f5f5' },
  comment: { color: '#666', fontSize: 13, margin: '4px 0 0' },
  empty: { color: '#aaa', textAlign: 'center', padding: 20 },
  viewAll: { display: 'block', textAlign: 'right', marginTop: 10, color: '#e94560', textDecoration: 'none', fontWeight: 600 },
};
