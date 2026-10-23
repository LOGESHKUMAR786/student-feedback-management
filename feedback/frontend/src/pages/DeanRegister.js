import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';

export default function DeanRegister() {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '', name: '' });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await api.post('/auth/register', {
        username: form.username,
        email: form.email,
        password: form.password,
        name: form.name,
        role: 'higher_official'
      });
      setRegisteredEmail(form.email);
      setDone(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  if (done) {
    return (
      <div style={S.page}>
        <div style={{ ...S.left, background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' }}>
          <div style={S.leftContent}>
            <div style={{ fontSize: 80, marginBottom: 16 }}>🎉</div>
            <h1 style={S.brand}>Dean Account Created!</h1>
            <p style={S.tagline}>Your Dean/HOD account has been created. Login to access department reports and analytics.</p>
          </div>
        </div>
        <div style={S.right}>
          <div style={S.card}>
            <div style={S.successIcon}>✅</div>
            <h2 style={{ ...S.title, textAlign: 'center' }}>Registration Successful!</h2>
            <p style={{ ...S.sub, textAlign: 'center', marginBottom: 28 }}>
              Use your registered email and password to login.
            </p>
            <div style={S.infoBox}>
              <div style={S.infoRow}>
                <span style={S.infoLabel}>📧 Registered Email</span>
                <span style={S.infoValue}>{registeredEmail}</span>
              </div>
              <div style={{ ...S.infoRow, borderBottom: 'none' }}>
                <span style={S.infoLabel}>🔑 Password</span>
                <span style={S.infoValue}>Your chosen password</span>
              </div>
            </div>
            <button style={{ ...S.btn, background: 'linear-gradient(135deg, #11998e, #38ef7d)' }}
              onClick={() => navigate('/dean/login', { state: { email: registeredEmail } })}>
              Go to Dean Login →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={S.page}>
      <div style={{ ...S.left, background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' }}>
        <div style={S.leftContent}>
          <div style={S.logo}>🎓</div>
          <h1 style={S.brand}>Dean Registration</h1>
          <p style={S.tagline}>Create a Dean/HOD account to access department analytics and faculty reports</p>
          <div style={S.steps}>
            {[
              { n: 1, t: 'Fill in your dean details' },
              { n: 2, t: 'Account gets created instantly' },
              { n: 3, t: 'Login with your credentials' },
              { n: 4, t: 'Access reports and analytics' },
            ].map(s => (
              <div key={s.n} style={S.step}>
                <span style={S.stepNum}>{s.n}</span>
                <span>{s.t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={S.right}>
        <div style={S.card}>
          <div style={{ ...S.roleTag, background: '#dcfce7', color: '#16a34a' }}>🎓 Dean / HOD Registration</div>
          <h2 style={S.title}>Create Dean Account</h2>
          <p style={S.sub}>Fill in your details to register as Dean/HOD</p>

          <form onSubmit={handleSubmit}>
            <div style={S.row}>
              <div style={S.field}>
                <label style={S.label}>Full Name *</label>
                <input style={S.input} placeholder="Dean Name" value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div style={S.field}>
                <label style={S.label}>Username *</label>
                <input style={S.input} placeholder="deanuser" value={form.username}
                  onChange={e => setForm({ ...form, username: e.target.value })} required />
              </div>
            </div>

            <div style={S.field}>
              <label style={S.label}>Email Address *</label>
              <input style={S.input} type="email" placeholder="dean@college.edu" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>

            <div style={S.row}>
              <div style={S.field}>
                <label style={S.label}>Password *</label>
                <input style={S.input} type="password" placeholder="Min 6 characters" value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })} required minLength={6} />
              </div>
              <div style={S.field}>
                <label style={S.label}>Confirm Password *</label>
                <input style={S.input} type="password" placeholder="Repeat password" value={form.confirm}
                  onChange={e => setForm({ ...form, confirm: e.target.value })} required />
              </div>
            </div>

            {form.password && form.confirm && form.password !== form.confirm && (
              <div style={S.errorMsg}>⚠️ Passwords do not match</div>
            )}

            <button style={{ ...S.btn, background: 'linear-gradient(135deg, #11998e, #38ef7d)' }} disabled={loading}>
              {loading ? '⏳ Creating Account...' : 'Create Dean Account →'}
            </button>
          </form>

          <p style={S.loginLink}>
            Already have an account?{' '}
            <Link to="/dean/login" style={{ color: '#16a34a', fontWeight: 600 }}>Sign in here</Link>
          </p>
          <div style={S.divider}><span>Other Portals</span></div>
          <div style={S.portals}>
            <Link to="/register" style={{ ...S.portalBtn, borderColor: '#667eea', color: '#667eea' }}>👨🎓 Student</Link>
            <Link to="/admin/register" style={{ ...S.portalBtn, borderColor: '#e94560', color: '#e94560' }}>🔧 Admin</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

const S = {
  page: { display: 'flex', minHeight: '100vh' },
  left: { flex: '0 0 380px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48 },
  leftContent: { color: '#fff' },
  logo: { fontSize: 48, marginBottom: 12 },
  brand: { fontSize: 28, fontWeight: 800, margin: '0 0 8px' },
  tagline: { fontSize: 14, opacity: 0.85, marginBottom: 32, lineHeight: 1.6 },
  steps: { display: 'flex', flexDirection: 'column', gap: 16 },
  step: { display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, opacity: 0.9 },
  stepNum: { background: 'rgba(255,255,255,0.25)', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 },
  right: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: 32 },
  card: { background: '#fff', borderRadius: 20, padding: '40px 36px', width: '100%', maxWidth: 520, boxShadow: '0 4px 40px rgba(0,0,0,0.08)' },
  roleTag: { display: 'inline-block', padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600, marginBottom: 16 },
  title: { fontSize: 24, fontWeight: 800, color: '#1e293b', margin: '0 0 4px' },
  sub: { color: '#64748b', fontSize: 14, marginBottom: 22 },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 },
  field: { marginBottom: 14 },
  label: { display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 5 },
  input: { width: '100%', padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, boxSizing: 'border-box', outline: 'none', background: '#f8fafc' },
  btn: { width: '100%', padding: '13px', color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', marginTop: 8 },
  loginLink: { textAlign: 'center', marginTop: 16, fontSize: 14, color: '#64748b' },
  errorMsg: { background: '#fee2e2', color: '#dc2626', padding: '8px 12px', borderRadius: 8, fontSize: 13, marginBottom: 8 },
  successIcon: { fontSize: 56, textAlign: 'center', marginBottom: 16 },
  infoBox: { background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 12, padding: '16px 20px', marginBottom: 24 },
  infoRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #e2e8f0' },
  infoLabel: { fontSize: 13, color: '#64748b', fontWeight: 600 },
  infoValue: { fontSize: 13, color: '#1e293b', fontWeight: 700 },
  divider: { textAlign: 'center', margin: '16px 0', color: '#94a3b8', fontSize: 13, borderTop: '1px solid #e2e8f0', paddingTop: 14 },
  portals: { display: 'flex', gap: 10 },
  portalBtn: { flex: 1, textAlign: 'center', padding: '10px', border: '1.5px solid', borderRadius: 10, textDecoration: 'none', fontSize: 13, fontWeight: 600 },
};
