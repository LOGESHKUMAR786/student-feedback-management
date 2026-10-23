import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';

const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
const BATCH_YEARS = ['2021-2025', '2022-2026', '2023-2027', '2024-2028', '2025-2029'];

export default function Register() {
  const [form, setForm] = useState({
    username: '', email: '', password: '', confirm: '',
    name: '', roll_number: '', department_id: '',
    batch_year: '', year_of_study: ''
  });
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/auth/departments').then(r => setDepartments(r.data)).catch(() => {});
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await api.post('/auth/register', {
        username: form.username, email: form.email, password: form.password,
        name: form.name, roll_number: form.roll_number,
        department_id: form.department_id || null,
        batch_year: form.batch_year, year_of_study: form.year_of_study,
        role: 'student'
      });
      setRegisteredEmail(form.email);
      setDone(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  if (done) return (
    <div style={S.page}>
      <div style={S.left}>
        <div style={S.leftContent}>
          <div style={{ fontSize: 80, marginBottom: 16 }}>🎉</div>
          <h1 style={S.brand}>You're all set!</h1>
          <p style={S.tagline}>Your student account has been created. Login with your email and password.</p>
        </div>
      </div>
      <div style={S.right}>
        <div style={S.card}>
          <div style={{ fontSize: 56, textAlign: 'center', marginBottom: 16 }}>✅</div>
          <h2 style={{ ...S.title, textAlign: 'center' }}>Registration Successful!</h2>
          <p style={{ ...S.sub, textAlign: 'center', marginBottom: 28 }}>Use your registered email and password to login.</p>
          <div style={S.infoBox}>
            <div style={S.infoRow}><span style={S.infoLabel}>📧 Email</span><span style={S.infoValue}>{registeredEmail}</span></div>
            <div style={S.infoRow}><span style={S.infoLabel}>🎓 Batch</span><span style={S.infoValue}>{form.batch_year || '—'}</span></div>
            <div style={{ ...S.infoRow, borderBottom: 'none' }}><span style={S.infoLabel}>📚 Year</span><span style={S.infoValue}>{form.year_of_study || '—'}</span></div>
          </div>
          <button style={S.btn} onClick={() => navigate('/login', { state: { email: registeredEmail } })}>Go to Login Page →</button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={S.page}>
      <div style={S.left}>
        <div style={S.leftContent}>
          <div style={S.logo}>🎓</div>
          <h1 style={S.brand}>Join StudentFeedback</h1>
          <p style={S.tagline}>Create your student account and start giving meaningful feedback</p>
          <div style={S.steps}>
            {['Fill in your details below','Account gets created instantly','Login with your email & password','Submit AI-powered feedback'].map((s, i) => (
              <div key={s} style={S.step}><span style={S.stepNum}>{i + 1}</span><span>{s}</span></div>
            ))}
          </div>
        </div>
      </div>

      <div style={S.right}>
        <div style={S.card}>
          <div style={S.roleTag}>👨🎓 Student Registration</div>
          <h2 style={S.title}>Create Account</h2>
          <p style={S.sub}>Fill in your details to get started</p>

          <form onSubmit={handleSubmit}>
            {/* Row 1 */}
            <div style={S.row}>
              <div style={S.field}>
                <label style={S.label}>Full Name *</label>
                <input style={S.input} placeholder="John Doe" value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div style={S.field}>
                <label style={S.label}>Username *</label>
                <input style={S.input} placeholder="johndoe" value={form.username}
                  onChange={e => setForm({ ...form, username: e.target.value })} required />
              </div>
            </div>

            {/* Email */}
            <div style={S.field}>
              <label style={S.label}>Email Address *</label>
              <input style={S.input} type="email" placeholder="john@college.edu" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>

            {/* Row 2 */}
            <div style={S.row}>
              <div style={S.field}>
                <label style={S.label}>Roll Number</label>
                <input style={S.input} placeholder="CS2024001" value={form.roll_number}
                  onChange={e => setForm({ ...form, roll_number: e.target.value })} />
              </div>
              <div style={S.field}>
                <label style={S.label}>Department</label>
                <select style={S.input} value={form.department_id}
                  onChange={e => setForm({ ...form, department_id: e.target.value })}>
                  <option value="">Select Department</option>
                  {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
            </div>

            {/* Row 3 - Batch & Year */}
            <div style={S.row}>
              <div style={S.field}>
                <label style={S.label}>📅 Batch Year *</label>
                <select style={S.input} value={form.batch_year}
                  onChange={e => setForm({ ...form, batch_year: e.target.value })} required>
                  <option value="">Select Batch</option>
                  {BATCH_YEARS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div style={S.field}>
                <label style={S.label}>📚 Year of Study *</label>
                <select style={S.input} value={form.year_of_study}
                  onChange={e => setForm({ ...form, year_of_study: e.target.value })} required>
                  <option value="">Select Year</option>
                  {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>

            {/* Row 4 - Passwords */}
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

            <button style={S.btn} disabled={loading}>
              {loading ? '⏳ Creating Account...' : 'Create Account →'}
            </button>
          </form>

          <p style={S.loginLink}>Already have an account? <Link to="/login" style={{ color: '#667eea', fontWeight: 600 }}>Sign in here</Link></p>
        </div>
      </div>
    </div>
  );
}

const S = {
  page: { display: 'flex', minHeight: '100vh' },
  left: { flex: '0 0 360px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 },
  leftContent: { color: '#fff' },
  logo: { fontSize: 48, marginBottom: 12 },
  brand: { fontSize: 28, fontWeight: 800, margin: '0 0 8px' },
  tagline: { fontSize: 14, opacity: 0.85, marginBottom: 28, lineHeight: 1.6 },
  steps: { display: 'flex', flexDirection: 'column', gap: 14 },
  step: { display: 'flex', alignItems: 'center', gap: 12, fontSize: 13, opacity: 0.9 },
  stepNum: { background: 'rgba(255,255,255,0.25)', borderRadius: '50%', width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 },
  right: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: 28, overflowY: 'auto' },
  card: { background: '#fff', borderRadius: 20, padding: '36px 32px', width: '100%', maxWidth: 560, boxShadow: '0 4px 40px rgba(0,0,0,0.08)' },
  roleTag: { display: 'inline-block', background: '#ede9fe', color: '#7c3aed', padding: '5px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600, marginBottom: 14 },
  title: { fontSize: 24, fontWeight: 800, color: '#1e293b', margin: '0 0 4px' },
  sub: { color: '#64748b', fontSize: 13, marginBottom: 20 },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  field: { marginBottom: 12 },
  label: { display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5 },
  input: { width: '100%', padding: '10px 12px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 13, boxSizing: 'border-box', outline: 'none', background: '#f8fafc' },
  btn: { width: '100%', padding: '13px', background: 'linear-gradient(135deg, #667eea, #764ba2)', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', marginTop: 8 },
  loginLink: { textAlign: 'center', marginTop: 14, fontSize: 13, color: '#64748b' },
  errorMsg: { background: '#fee2e2', color: '#dc2626', padding: '8px 12px', borderRadius: 8, fontSize: 12, marginBottom: 8 },
  infoBox: { background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 12, padding: '14px 18px', marginBottom: 20 },
  infoRow: { display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid #e2e8f0' },
  infoLabel: { fontSize: 13, color: '#64748b', fontWeight: 600 },
  infoValue: { fontSize: 13, color: '#1e293b', fontWeight: 700 },
};
