import { useNavigate } from 'react-router-dom';

export default function Welcome() {
  const navigate = useNavigate();

  const portals = [
    {
      role: 'Student',
      icon: '👨🎓',
      desc: 'Submit feedback for your courses and track your history',
      features: ['Submit course feedback', 'AI sentiment preview', 'View feedback history', 'Edit before deadline'],
      loginPath: '/login',
      registerPath: '/register',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      btnColor: '#667eea',
      tagBg: '#ede9fe',
      tagColor: '#7c3aed',
    },
    {
      role: 'Admin',
      icon: '🔧',
      desc: 'Manage students, faculty, courses and feedback cycles',
      features: ['Manage students & faculty', 'Open/close cycles', 'Analytics dashboard', 'Generate reports'],
      loginPath: '/admin/login',
      registerPath: '/admin/register',
      gradient: 'linear-gradient(135deg, #e94560 0%, #c0392b 100%)',
      btnColor: '#e94560',
      tagBg: '#fee2e2',
      tagColor: '#dc2626',
    },
    {
      role: 'Dean / HOD',
      icon: '🎓',
      desc: 'Access department reports and faculty performance analytics',
      features: ['Department-wise reports', 'Faculty rankings', 'AI-generated insights', 'Add remarks'],
      loginPath: '/dean/login',
      registerPath: '/dean/register',
      gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
      btnColor: '#11998e',
      tagBg: '#dcfce7',
      tagColor: '#16a34a',
    },
  ];

  const stats = [
    { value: '3', label: 'User Roles', icon: '👥' },
    { value: 'AI', label: 'Sentiment Analysis', icon: '🤖' },
    { value: '100%', label: 'Digital Process', icon: '💻' },
    { value: '24/7', label: 'System Access', icon: '🕐' },
  ];

  const features = [
    { icon: '🤖', title: 'AI Sentiment Analysis', desc: 'Automatically detects Positive, Neutral, or Negative sentiment from feedback text using keyword scoring.' },
    { icon: '📊', title: 'Real-time Analytics', desc: 'Live charts and graphs showing average ratings, trends, and department-wise performance comparisons.' },
    { icon: '🔐', title: 'JWT Authentication', desc: 'Secure role-based login system with JSON Web Tokens ensuring only authorized access to each portal.' },
    { icon: '📋', title: 'Report Generation', desc: 'Admins can generate detailed AI-summarized reports that Higher Officials can review and act upon.' },
    { icon: '⚡', title: 'Action Management', desc: 'Higher Officials can assign action items to admins and track their resolution status in real-time.' },
    { icon: '🔑', title: 'Keyword Extraction', desc: 'Automatically extracts key themes like "slow teaching" or "good explanation" from feedback comments.' },
  ];

  return (
    <div style={S.page}>

      {/* ── NAVBAR ── */}
      <nav style={S.nav}>
        <div style={S.navInner}>
          <div style={S.navLogo}>
            <div style={S.navLogoIcon}>🎓</div>
            <div>
              <div style={S.navBrand}>StudentFeedback</div>
              <div style={S.navTagline}>AI-Powered System</div>
            </div>
          </div>
          <div style={S.navLinks}>
            <a href="#portals" style={S.navLink}>Portals</a>
            <a href="#features" style={S.navLink}>Features</a>
            <a href="#about" style={S.navLink}>About</a>
          </div>
          <button style={S.navCta} onClick={() => navigate('/login')}>Get Started →</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <div style={S.hero}>
        <div style={S.heroInner}>
          <div style={S.heroBadge}>🚀 Smart Academic Feedback Platform</div>
          <h1 style={S.heroTitle}>
            AI-Powered<br />
            <span style={S.heroGradient}>Feedback Management</span><br />
            System
          </h1>
          <p style={S.heroSub}>
            A complete digital solution for colleges to collect, analyze and act on student feedback.
            Powered by AI sentiment analysis and real-time analytics.
          </p>
          <div style={S.heroBtns}>
            <button style={S.heroBtnPrimary} onClick={() => navigate('/register')}>
              🎓 Student Register
            </button>
            <button style={S.heroBtnSecondary} onClick={() => { const el = document.getElementById('portals'); el && el.scrollIntoView({ behavior: 'smooth' }); }}>
              View All Portals ↓
            </button>
          </div>

          {/* Stats Row */}
          <div style={S.statsRow}>
            {stats.map(s => (
              <div key={s.label} style={S.statItem}>
                <div style={S.statIcon}>{s.icon}</div>
                <div style={S.statValue}>{s.value}</div>
                <div style={S.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Hero Visual */}
        <div style={S.heroVisual}>
          <div style={S.visualCard}>
            <div style={S.visualHeader}>
              <div style={S.dot1} /><div style={S.dot2} /><div style={S.dot3} />
              <span style={{ marginLeft: 8, fontSize: 12, color: '#94a3b8' }}>AI Analysis</span>
            </div>
            <div style={S.visualBody}>
              {[
                { text: '"Excellent teaching method!"', s: 'positive', color: '#22c55e', emoji: '😄' },
                { text: '"Need more practical sessions"', s: 'neutral', color: '#f59e0b', emoji: '😐' },
                { text: '"Slow pace, hard to follow"', s: 'negative', color: '#ef4444', emoji: '😡' },
              ].map(f => (
                <div key={f.s} style={S.visualFeedback}>
                  <span style={S.visualEmoji}>{f.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, color: '#1e293b', marginBottom: 4 }}>{f.text}</div>
                    <div style={{ ...S.visualBadge, background: f.color + '22', color: f.color }}>{f.s.toUpperCase()}</div>
                  </div>
                </div>
              ))}
              <div style={S.visualAI}>
                <span>🤖</span>
                <span style={{ fontSize: 12, color: '#667eea', fontWeight: 600 }}>AI Summary Generated ✓</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── PORTALS ── */}
      <div id="portals" style={S.section}>
        <div style={S.sectionInner}>
          <div style={S.sectionBadge}>🔑 Access Portals</div>
          <h2 style={S.sectionTitle}>Choose Your Role</h2>
          <p style={S.sectionSub}>Select your role to login or create a new account and get started</p>

          <div style={S.cards}>
            {portals.map(p => (
              <div key={p.role} style={S.card}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.08)'; }}>
                <div style={{ ...S.cardTop, background: p.gradient }}>
                  <div style={S.cardIcon}>{p.icon}</div>
                  <h3 style={S.cardRole}>{p.role}</h3>
                  <p style={S.cardDesc}>{p.desc}</p>
                </div>
                <div style={S.cardBody}>
                  <div style={{ ...S.cardTag, background: p.tagBg, color: p.tagColor }}>{p.icon} {p.role} Portal</div>
                  <ul style={S.featureList}>
                    {p.features.map(f => (
                      <li key={f} style={S.featureItem}>
                        <span style={{ ...S.featureDot, background: p.btnColor }} />{f}
                      </li>
                    ))}
                  </ul>
                  <div style={S.cardBtns}>
                    <button style={{ ...S.loginBtn, background: p.gradient }} onClick={() => navigate(p.loginPath)}>Login →</button>
                    <button style={{ ...S.registerBtn, borderColor: p.btnColor, color: p.btnColor }} onClick={() => navigate(p.registerPath)}>Register</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FEATURES ── */}
      <div id="features" style={{ ...S.section, background: '#f8fafc' }}>
        <div style={S.sectionInner}>
          <div style={S.sectionBadge}>✨ Key Features</div>
          <h2 style={S.sectionTitle}>Everything You Need</h2>
          <p style={S.sectionSub}>Built with modern technology to make feedback management effortless</p>
          <div style={S.featuresGrid}>
            {features.map(f => (
              <div key={f.title} style={S.featureCard}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#667eea'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(102,126,234,0.15)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; }}>
                <div style={S.featureIcon}>{f.icon}</div>
                <h3 style={S.featureTitle}>{f.title}</h3>
                <p style={S.featureDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <div id="about" style={S.section}>
        <div style={S.sectionInner}>
          <div style={S.sectionBadge}>📖 How It Works</div>
          <h2 style={S.sectionTitle}>Simple 4-Step Process</h2>
          <div style={S.stepsRow}>
            {[
              { n: '01', icon: '📝', title: 'Register', desc: 'Create your account based on your role — Student, Admin, Dean or Higher Official' },
              { n: '02', icon: '🔐', title: 'Login', desc: 'Securely login to your dedicated portal using JWT-based authentication' },
              { n: '03', icon: '💬', title: 'Submit Feedback', desc: 'Students submit ratings and comments. AI instantly analyzes sentiment' },
              { n: '04', icon: '📊', title: 'Take Action', desc: 'Admins generate reports, Officials assign actions and track improvements' },
            ].map((s, i) => (
              <div key={s.n} style={S.stepCard}>
                <div style={S.stepNum}>{s.n}</div>
                <div style={S.stepIcon}>{s.icon}</div>
                <h3 style={S.stepTitle}>{s.title}</h3>
                <p style={S.stepDesc}>{s.desc}</p>
                {i < 3 && <div style={S.stepArrow}>→</div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div style={S.cta}>
        <div style={S.ctaInner}>
          <h2 style={S.ctaTitle}>Ready to Get Started?</h2>
          <p style={S.ctaSub}>Join the AI-powered feedback revolution. Register your account today.</p>
          <div style={S.ctaBtns}>
            <button style={S.ctaBtnPrimary} onClick={() => navigate('/register')}>🎓 Student Register</button>
            <button style={S.ctaBtnSecondary} onClick={() => navigate('/admin/login')}>🔧 Admin Login</button>
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer style={S.footer}>
        <div style={S.footerInner}>
          <div style={S.footerLogo}>
            <div style={S.navLogoIcon}>🎓</div>
            <div>
              <div style={{ fontWeight: 800, color: '#fff', fontSize: 16 }}>StudentFeedback</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>AI-Powered Feedback System</div>
            </div>
          </div>
          <div style={S.footerLinks}>
            {[
              { label: '👨🎓 Student Login', path: '/login' },
              { label: '🔧 Admin Login', path: '/admin/login' },
              { label: '🎓 Dean Login', path: '/dean/login' },
            ].map(l => (
              <button key={l.path} style={S.footerLink} onClick={() => navigate(l.path)}>{l.label}</button>
            ))}
          </div>
          <div style={S.footerRight}>
            <div style={S.techStack}>
              {['React.js', 'Node.js', 'MySQL', 'JWT', 'AI/ML'].map(t => (
                <span key={t} style={S.techBadge}>{t}</span>
              ))}
            </div>
          </div>
        </div>
        <div style={S.footerBottom}>
          <p style={{ margin: 0, color: '#475569', fontSize: 13 }}>
            © 2024 StudentFeedback — AI-Powered Student Feedback Management System. Built with ❤️ using React.js + Node.js + MySQL
          </p>
        </div>
      </footer>
    </div>
  );
}

const S = {
  page: { minHeight: '100vh', background: '#fff', fontFamily: "'Inter','Segoe UI',sans-serif" },

  // Navbar
  nav: { background: '#fff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 100, padding: '0 40px' },
  navInner: { maxWidth: 1200, margin: '0 auto', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  navLogo: { display: 'flex', alignItems: 'center', gap: 10 },
  navLogoIcon: { width: 38, height: 38, background: 'linear-gradient(135deg,#667eea,#764ba2)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 },
  navBrand: { fontWeight: 800, fontSize: 17, color: '#1e293b' },
  navTagline: { fontSize: 11, color: '#94a3b8' },
  navLinks: { display: 'flex', gap: 32 },
  navLink: { color: '#64748b', textDecoration: 'none', fontSize: 14, fontWeight: 500 },
  navCta: { background: 'linear-gradient(135deg,#667eea,#764ba2)', color: '#fff', border: 'none', padding: '10px 22px', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' },

  // Hero
  hero: { background: 'linear-gradient(135deg,#0f172a 0%,#1e293b 60%,#0f172a 100%)', padding: '80px 40px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 60, flexWrap: 'wrap' },
  heroInner: { maxWidth: 560, color: '#fff' },
  heroBadge: { display: 'inline-block', background: 'rgba(102,126,234,0.2)', color: '#a5b4fc', padding: '8px 18px', borderRadius: 20, fontSize: 13, fontWeight: 600, marginBottom: 24, border: '1px solid rgba(102,126,234,0.3)' },
  heroTitle: { fontSize: 48, fontWeight: 900, color: '#fff', margin: '0 0 20px', lineHeight: 1.15, letterSpacing: -1 },
  heroGradient: { background: 'linear-gradient(135deg,#667eea,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  heroSub: { fontSize: 16, color: '#94a3b8', lineHeight: 1.8, marginBottom: 32 },
  heroBtns: { display: 'flex', gap: 12, marginBottom: 48, flexWrap: 'wrap' },
  heroBtnPrimary: { padding: '14px 28px', background: 'linear-gradient(135deg,#667eea,#764ba2)', color: '#fff', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer' },
  heroBtnSecondary: { padding: '14px 28px', background: 'transparent', color: '#a5b4fc', border: '1.5px solid rgba(102,126,234,0.4)', borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: 'pointer' },
  statsRow: { display: 'flex', gap: 24, flexWrap: 'wrap' },
  statItem: { textAlign: 'center' },
  statIcon: { fontSize: 22, marginBottom: 4 },
  statValue: { fontSize: 24, fontWeight: 800, color: '#fff' },
  statLabel: { fontSize: 12, color: '#64748b' },

  // Hero Visual
  heroVisual: { flexShrink: 0 },
  visualCard: { background: '#1e293b', borderRadius: 16, padding: 0, width: 320, border: '1px solid #334155', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' },
  visualHeader: { background: '#0f172a', padding: '12px 16px', display: 'flex', alignItems: 'center', borderBottom: '1px solid #334155' },
  dot1: { width: 10, height: 10, borderRadius: '50%', background: '#ef4444' },
  dot2: { width: 10, height: 10, borderRadius: '50%', background: '#f59e0b', marginLeft: 6 },
  dot3: { width: 10, height: 10, borderRadius: '50%', background: '#22c55e', marginLeft: 6 },
  visualBody: { padding: 16 },
  visualFeedback: { display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 0', borderBottom: '1px solid #334155' },
  visualEmoji: { fontSize: 20, flexShrink: 0 },
  visualBadge: { display: 'inline-block', padding: '2px 8px', borderRadius: 6, fontSize: 10, fontWeight: 700 },
  visualAI: { display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, padding: '8px 12px', background: 'rgba(102,126,234,0.1)', borderRadius: 8 },

  // Sections
  section: { padding: '80px 40px', background: '#fff' },
  sectionInner: { maxWidth: 1200, margin: '0 auto' },
  sectionBadge: { display: 'inline-block', background: '#ede9fe', color: '#7c3aed', padding: '6px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600, marginBottom: 16 },
  sectionTitle: { fontSize: 36, fontWeight: 800, color: '#1e293b', margin: '0 0 12px', textAlign: 'center' },
  sectionSub: { color: '#64748b', fontSize: 16, textAlign: 'center', marginBottom: 48 },

  // Portal Cards
  cards: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 },
  card: { background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', transition: 'transform 0.25s, box-shadow 0.25s', cursor: 'default' },
  cardTop: { padding: '28px 24px', textAlign: 'center' },
  cardIcon: { fontSize: 48, marginBottom: 10 },
  cardRole: { fontSize: 20, fontWeight: 800, color: '#fff', margin: '0 0 6px' },
  cardDesc: { fontSize: 13, color: 'rgba(255,255,255,0.85)', lineHeight: 1.5, margin: 0 },
  cardBody: { padding: '20px 24px' },
  cardTag: { display: 'inline-block', padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700, marginBottom: 14 },
  featureList: { listStyle: 'none', padding: 0, margin: '0 0 20px' },
  featureItem: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#475569', padding: '5px 0', borderBottom: '1px solid #f1f5f9' },
  featureDot: { width: 7, height: 7, borderRadius: '50%', flexShrink: 0 },
  cardBtns: { display: 'flex', gap: 8 },
  loginBtn: { flex: 1, padding: '11px', color: '#fff', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer' },
  registerBtn: { flex: 1, padding: '11px', background: '#fff', border: '2px solid', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer' },

  // Features Grid
  featuresGrid: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 },
  featureCard: { background: '#fff', borderRadius: 16, padding: '28px 24px', border: '1.5px solid #e2e8f0', transition: 'border-color 0.2s, box-shadow 0.2s', cursor: 'default' },
  featureIcon: { fontSize: 36, marginBottom: 14 },
  featureTitle: { fontSize: 16, fontWeight: 700, color: '#1e293b', margin: '0 0 8px' },
  featureDesc: { fontSize: 14, color: '#64748b', lineHeight: 1.6, margin: 0 },

  // Steps
  stepsRow: { display: 'flex', gap: 0, position: 'relative', justifyContent: 'center' },
  stepCard: { flex: 1, textAlign: 'center', padding: '0 20px', position: 'relative', maxWidth: 260 },
  stepNum: { fontSize: 48, fontWeight: 900, color: '#e2e8f0', lineHeight: 1, marginBottom: 8 },
  stepIcon: { fontSize: 36, marginBottom: 12 },
  stepTitle: { fontSize: 17, fontWeight: 700, color: '#1e293b', margin: '0 0 8px' },
  stepDesc: { fontSize: 13, color: '#64748b', lineHeight: 1.6 },
  stepArrow: { position: 'absolute', right: -12, top: 60, fontSize: 24, color: '#cbd5e1', fontWeight: 700 },

  // CTA
  cta: { background: 'linear-gradient(135deg,#667eea 0%,#764ba2 100%)', padding: '72px 40px' },
  ctaInner: { maxWidth: 700, margin: '0 auto', textAlign: 'center' },
  ctaTitle: { fontSize: 36, fontWeight: 800, color: '#fff', margin: '0 0 12px' },
  ctaSub: { fontSize: 16, color: 'rgba(255,255,255,0.8)', marginBottom: 36 },
  ctaBtns: { display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' },
  ctaBtnPrimary: { padding: '14px 28px', background: '#fff', color: '#667eea', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer' },
  ctaBtnSecondary: { padding: '14px 28px', background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1.5px solid rgba(255,255,255,0.3)', borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: 'pointer' },

  // Footer
  footer: { background: '#0f172a', padding: '48px 40px 0' },
  footerInner: { maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 40, flexWrap: 'wrap', paddingBottom: 40, borderBottom: '1px solid #1e293b' },
  footerLogo: { display: 'flex', alignItems: 'center', gap: 10 },
  footerLinks: { display: 'flex', flexDirection: 'column', gap: 10 },
  footerLink: { background: 'none', border: 'none', color: '#64748b', fontSize: 14, cursor: 'pointer', textAlign: 'left', padding: 0 },
  footerRight: {},
  techStack: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  techBadge: { background: '#1e293b', color: '#94a3b8', padding: '5px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600 },
  footerBottom: { maxWidth: 1200, margin: '0 auto', padding: '20px 0', textAlign: 'center' },
};
