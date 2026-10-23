import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function StudentLogin() {
  const location = useLocation();
  const prefillEmail = location.state?.email || '';
  const [form, setForm] = useState({ email: prefillEmail, password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      if (!data.user.role) { toast.error('Login failed'); setLoading(false); return; }
      login(data.user, data.token);
      toast.success('Welcome back!');
      navigate('/student/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={S.page}>
      <div style={S.left}>
        <div style={S.leftContent}>
          <div style={S.logo}>🎓</div>
          <h1 style={S.brand}>StudentFeedback</h1>
          <p style={S.tagline}>AI-Powered Feedback Management System</p>
          <div style={S.features}>
            {['Submit course feedback instantly','Real-time AI sentiment analysis','Track your feedback history','Get notified about deadlines'].map(f => (
              <div key={f} style={S.feature}><span style={S.check}>✓</span>{f}</div>
            ))}
          </div>
        </div>
      </div>

      <div style={S.right}>
        <div style={S.card}>
          <div style={S.roleTag}>👨🎓 Student Portal</div>
          <h2 style={S.title}>Welcome Back</h2>
          <p style={S.sub}>Sign in with your registered email and password</p>

          {prefillEmail && (
            <div style={S.successBanner}>
              ✅ Registration successful! Your email is pre-filled below.
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={S.field}>
              <label style={S.label}>Email Address</label>
              <input
                style={{ ...S.input, ...(prefillEmail ? S.prefilled : {}) }}
                type="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div style={S.field}>
              <label style={S.label}>Password</label>
              <input
                style={S.input}
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
                autoFocus={!!prefillEmail}
              />
            </div>
            <button style={S.btn} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

          <p style={S.registerLink}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#667eea', fontWeight: 600 }}>Register here</Link>
          </p>
          <div style={S.divider}><span>Other Portals</span></div>
          <div style={S.portals}>
            <Link to="/admin/login" style={{ ...S.portalBtn, borderColor: '#e94560', color: '#e94560' }}>🔧 Admin</Link>
            <Link to="/dean/login" style={{ ...S.portalBtn, borderColor: '#27ae60', color: '#27ae60' }}>🎓 Dean</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

const S = {
  page: { display: 'flex', minHeight: '100vh' },
  left: { flex: 1, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48 },
  leftContent: { color: '#fff', maxWidth: 420 },
  logo: { fontSize: 56, marginBottom: 12 },
  brand: { fontSize: 36, fontWeight: 800, margin: '0 0 8px', letterSpacing: -1 },
  tagline: { fontSize: 16, opacity: 0.85, marginBottom: 40, lineHeight: 1.5 },
  features: { display: 'flex', flexDirection: 'column', gap: 14 },
  feature: { display: 'flex', alignItems: 'center', gap: 12, fontSize: 15, opacity: 0.9 },
  check: { background: 'rgba(255,255,255,0.2)', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, flexShrink: 0 },
  right: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: 32 },
  card: { background: '#fff', borderRadius: 20, padding: '44px 40px', width: '100%', maxWidth: 420, boxShadow: '0 4px 40px rgba(0,0,0,0.08)' },
  roleTag: { display: 'inline-block', background: '#ede9fe', color: '#7c3aed', padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600, marginBottom: 20 },
  title: { fontSize: 28, fontWeight: 800, color: '#1e293b', margin: '0 0 6px' },
  sub: { color: '#64748b', fontSize: 14, marginBottom: 20 },
  successBanner: { background: '#dcfce7', border: '1.5px solid #86efac', color: '#16a34a', borderRadius: 10, padding: '12px 16px', fontSize: 13, fontWeight: 600, marginBottom: 18 },
  field: { marginBottom: 18 },
  label: { display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 },
  input: { width: '100%', padding: '12px 16px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, boxSizing: 'border-box', outline: 'none', background: '#f8fafc' },
  prefilled: { background: '#f0fdf4', borderColor: '#86efac', color: '#15803d', fontWeight: 600 },
  btn: { width: '100%', padding: '14px', background: 'linear-gradient(135deg, #667eea, #764ba2)', color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', marginTop: 8 },
  registerLink: { textAlign: 'center', marginTop: 18, fontSize: 14, color: '#64748b' },
  divider: { textAlign: 'center', margin: '20px 0', color: '#94a3b8', fontSize: 13, borderTop: '1px solid #e2e8f0', paddingTop: 16 },
  portals: { display: 'flex', gap: 10 },
  portalBtn: { flex: 1, textAlign: 'center', padding: '10px', border: '1.5px solid', borderRadius: 10, textDecoration: 'none', fontSize: 13, fontWeight: 600 },
};
