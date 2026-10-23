import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function DeanLogin() {
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
      toast.success('Welcome, Dean!');
      navigate('/dean/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={S.page}>
      <div style={{ ...S.left, background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' }}>
        <div style={S.leftContent}>
          <div style={S.logo}>🎓</div>
          <h1 style={S.brand}>Dean Portal</h1>
          <p style={S.tagline}>Strategic insights for academic excellence</p>
          <div style={S.features}>
            {['Department-wise performance reports','Faculty analytics & rankings','Add remarks & action plans','AI-generated insights & summaries'].map(f => (
              <div key={f} style={S.feature}><span style={S.check}>✓</span>{f}</div>
            ))}
          </div>
          <div style={S.credBox}>
            <p style={{ margin: '0 0 4px', fontWeight: 700, fontSize: 13 }}>Default Credentials</p>
            <p style={{ margin: 0, fontSize: 13, opacity: 0.9 }}>dean@college.edu / password</p>
          </div>
        </div>
      </div>
      <div style={S.right}>
        <div style={S.card}>
          <div style={{ ...S.roleTag, background: '#dcfce7', color: '#16a34a' }}>🎓 Dean / HOD Portal</div>
          <h2 style={S.title}>Dean Sign In</h2>
          <p style={S.sub}>Access department reports and faculty analytics</p>

          {prefillEmail && (
            <div style={S.successBanner}>
              ✅ Registration successful! Your email is pre-filled below.
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={S.field}>
              <label style={S.label}>Dean Email</label>
              <input style={{ ...S.input, ...(prefillEmail ? S.prefilled : {}) }}
                type="email" placeholder="dean@college.edu" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div style={S.field}>
              <label style={S.label}>Password</label>
              <input style={S.input} type="password" placeholder="Enter your password"
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                required autoFocus={!!prefillEmail} />
            </div>
            <button style={{ ...S.btn, background: 'linear-gradient(135deg, #11998e, #38ef7d)' }} disabled={loading}>
              {loading ? 'Authenticating...' : 'Access Dean Portal →'}
            </button>
          </form>

          <p style={S.registerLink}>
            Don't have an account?{' '}
            <Link to="/dean/register" style={{ color: '#16a34a', fontWeight: 600 }}>Register here</Link>
          </p>
          <div style={S.divider}><span>Other Portals</span></div>
          <div style={S.portals}>
            <Link to="/login" style={{ ...S.portalBtn, borderColor: '#667eea', color: '#667eea' }}>👨🎓 Student</Link>
            <Link to="/admin/login" style={{ ...S.portalBtn, borderColor: '#e94560', color: '#e94560' }}>🔧 Admin</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

const S = {
  page: { display: 'flex', minHeight: '100vh' },
  left: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48 },
  leftContent: { color: '#fff', maxWidth: 420 },
  logo: { fontSize: 56, marginBottom: 12 },
  brand: { fontSize: 36, fontWeight: 800, margin: '0 0 8px', letterSpacing: -1 },
  tagline: { fontSize: 16, opacity: 0.85, marginBottom: 32, lineHeight: 1.5 },
  features: { display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 28 },
  feature: { display: 'flex', alignItems: 'center', gap: 12, fontSize: 15, opacity: 0.9 },
  check: { background: 'rgba(255,255,255,0.2)', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, flexShrink: 0 },
  credBox: { background: 'rgba(255,255,255,0.2)', borderRadius: 10, padding: '12px 16px', color: '#fff' },
  right: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: 32 },
  card: { background: '#fff', borderRadius: 20, padding: '44px 40px', width: '100%', maxWidth: 420, boxShadow: '0 4px 40px rgba(0,0,0,0.08)' },
  roleTag: { display: 'inline-block', padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600, marginBottom: 20 },
  title: { fontSize: 28, fontWeight: 800, color: '#1e293b', margin: '0 0 6px' },
  sub: { color: '#64748b', fontSize: 14, marginBottom: 20 },
  successBanner: { background: '#dcfce7', border: '1.5px solid #86efac', color: '#16a34a', borderRadius: 10, padding: '12px 16px', fontSize: 13, fontWeight: 600, marginBottom: 18 },
  field: { marginBottom: 18 },
  label: { display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 },

  prefilled: { background: '#f0fdf4', borderColor: '#86efac', color: '#15803d', fontWeight: 600 },
  btn: { width: '100%', padding: '14px', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', marginTop: 8 },
  registerLink: { textAlign: 'center', marginTop: 18, fontSize: 14, color: '#64748b' },
  divider: { textAlign: 'center', margin: '20px 0', color: '#94a3b8', fontSize: 13, borderTop: '1px solid #e2e8f0', paddingTop: 16 },
  portals: { display: 'flex', gap: 10 },
  portalBtn: { flex: 1, textAlign: 'center', padding: '10px', border: '1.5px solid', borderRadius: 10, textDecoration: 'none', fontSize: 13, fontWeight: 600 },
};
