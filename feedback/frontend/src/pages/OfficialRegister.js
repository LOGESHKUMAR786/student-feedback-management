import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';

export default function OfficialRegister() {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '', full_name: '' });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
    setLoading(true);
    try {
      await api.post('/auth/register', { ...form, role: 'higher_official' });
      setRegisteredEmail(form.email);
      setDone(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  if (done) return (
    <div style={S.page}>
      <div style={S.left}>
        <div style={S.leftContent}><div style={{ fontSize: 80 }}>🎉</div><h1 style={S.brand}>Account Created!</h1><p style={S.tagline}>Login to access the Higher Official portal.</p></div>
      </div>
      <div style={S.right}>
        <div style={S.card}>
          <div style={{ fontSize: 56, textAlign: 'center', marginBottom: 16 }}>✅</div>
          <h2 style={{ ...S.title, textAlign: 'center' }}>Registration Successful!</h2>
          <div style={S.infoBox}>
            <div style={S.infoRow}><span style={S.infoLabel}>📧 Email</span><span style={S.infoValue}>{registeredEmail}</span></div>
            <div style={{ ...S.infoRow, borderBottom: 'none' }}><span style={S.infoLabel}>🔑 Password</span><span style={S.infoValue}>Your chosen password</span></div>
          </div>
          <button style={S.btn} onClick={() => navigate('/official/login', { state: { email: registeredEmail } })}>Go to Official Login →</button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={S.page}>
      <div style={S.left}>
        <div style={S.leftContent}>
          <div style={S.logo}>🏛️</div>
          <h1 style={S.brand}>Official Registration</h1>
          <p style={S.tagline}>Create a Higher Official account to manage reports and actions</p>
          <div style={S.steps}>
            {['Fill in your details','Account created instantly','Login with credentials','Manage reports & actions'].map((s, i) => (
              <div key={s} style={S.step}><span style={S.stepNum}>{i + 1}</span><span>{s}</span></div>
            ))}
          </div>
        </div>
      </div>
      <div style={S.right}>
        <div style={S.card}>
          <div style={S.roleTag}>🏛️ Higher Official Registration</div>
          <h2 style={S.title}>Create Official Account</h2>
          <p style={S.sub}>Fill in your details to register</p>
          <form onSubmit={handleSubmit}>
            <div style={S.row}>
              <div style={S.field}><label style={S.label}>Full Name *</label>
                <input style={S.input} placeholder="Official Name" value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} required /></div>
              <div style={S.field}><label style={S.label}>Username *</label>
                <input style={S.input} placeholder="officialuser" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} required /></div>
            </div>
            <div style={S.field}><label style={S.label}>Email Address *</label>
              <input style={S.input} type="email" placeholder="official@college.edu" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required /></div>
            <div style={S.row}>
              <div style={S.field}><label style={S.label}>Password *</label>
                <input style={S.input} type="password" placeholder="Min 6 characters" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required minLength={6} /></div>
              <div style={S.field}><label style={S.label}>Confirm Password *</label>
                <input style={S.input} type="password" placeholder="Repeat password" value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} required /></div>
            </div>
            {form.password && form.confirm && form.password !== form.confirm && (
              <div style={S.errorMsg}>⚠️ Passwords do not match</div>
            )}
            <button style={S.btn} disabled={loading}>{loading ? '⏳ Creating...' : 'Create Official Account →'}</button>
          </form>
          <p style={S.loginLink}>Already have an account? <Link to="/official/login" style={{ color: '#f59e0b', fontWeight: 600 }}>Sign in here</Link></p>
        </div>
      </div>
    </div>
  );
}

const S = {
  page: { display: 'flex', minHeight: '100vh' },
  left: { flex: '0 0 380px', background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48 },
  leftContent: { color: '#fff' },
  logo: { fontSize: 48, marginBottom: 12 },
  brand: { fontSize: 28, fontWeight: 800, margin: '0 0 8px' },
  tagline: { fontSize: 14, opacity: 0.85, marginBottom: 32, lineHeight: 1.6 },
  steps: { display: 'flex', flexDirection: 'column', gap: 16 },
  step: { display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, opacity: 0.9 },
  stepNum: { background: 'rgba(255,255,255,0.25)', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 },
  right: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: 32 },
  card: { background: '#fff', borderRadius: 20, padding: '40px 36px', width: '100%', maxWidth: 520, boxShadow: '0 4px 40px rgba(0,0,0,0.08)' },
  roleTag: { display: 'inline-block', background: '#fef3c7', color: '#d97706', padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600, marginBottom: 16 },
  title: { fontSize: 24, fontWeight: 800, color: '#1e293b', margin: '0 0 4px' },
  sub: { color: '#64748b', fontSize: 14, marginBottom: 22 },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 },
  field: { marginBottom: 14 },
  label: { display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 5 },
  input: { width: '100%', padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, boxSizing: 'border-box', outline: 'none', background: '#f8fafc' },
  btn: { width: '100%', padding: '13px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', marginTop: 8 },
  loginLink: { textAlign: 'center', marginTop: 16, fontSize: 14, color: '#64748b' },
  errorMsg: { background: '#fee2e2', color: '#dc2626', padding: '8px 12px', borderRadius: 8, fontSize: 13, marginBottom: 8 },
  infoBox: { background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 12, padding: '16px 20px', marginBottom: 24 },
  infoRow: { display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e2e8f0' },
  infoLabel: { fontSize: 13, color: '#64748b', fontWeight: 600 },
  infoValue: { fontSize: 13, color: '#1e293b', fontWeight: 700 },
};
