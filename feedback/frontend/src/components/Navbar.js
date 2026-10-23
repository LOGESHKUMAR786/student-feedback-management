import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navLinks = {
  student: [
    { to: '/student/dashboard', icon: '🏠', label: 'Dashboard' },
    { to: '/student/feedback', icon: '📝', label: 'Submit Feedback' },
    { to: '/student/grievance', icon: '📢', label: 'Grievance' },
    { to: '/student/history', icon: '📋', label: 'My History' },
  ],
  admin: [
    { to: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
    { to: '/admin/students', icon: '👨🎓', label: 'Students' },
    { to: '/admin/faculty', icon: '👨🏫', label: 'Faculty' },
    { to: '/admin/courses', icon: '📚', label: 'Courses' },
    { to: '/admin/cycles', icon: '🔄', label: 'Cycles' },
    { to: '/admin/feedback', icon: '💬', label: 'Feedback' },
    { to: '/admin/reports', icon: '📋', label: 'Reports' },
    { to: '/admin/grievances', icon: '📢', label: 'Grievances' },
  ],
  higher_official: [
    { to: '/dean/dashboard', icon: '📊', label: 'Dashboard' },
    { to: '/dean/reports', icon: '📈', label: 'Dept Reports' },
    { to: '/dean/faculty', icon: '🎓', label: 'Faculty Analytics' },
    { to: '/dean/grievances', icon: '📢', label: 'Grievances' },
  ],
};

const roleColors = {
  student:         { bg: '#667eea', light: '#ede9fe', text: '#7c3aed' },
  admin:           { bg: '#e94560', light: '#fee2e2', text: '#dc2626' },
  higher_official: { bg: '#11998e', light: '#dcfce7', text: '#16a34a' },
};

const logoutRoutes = {
  student: '/login',
  admin: '/admin/login',
  higher_official: '/dean/login',
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const links = user ? (navLinks[user.role] || []) : [];
  const colors = user ? (roleColors[user.role] || roleColors.student) : roleColors.student;

  const handleLogout = () => {
    logout();
    navigate(logoutRoutes[user?.role] || '/');
  };

  return (
    <nav style={{ ...S.nav, borderBottom: `3px solid ${colors.bg}` }}>
      <div style={S.left}>
        <div style={{ ...S.logo, background: colors.bg }}>🎓</div>
        <div>
          <span style={S.brand}>StudentFeedback</span>
          {user && <span style={{ ...S.roleChip, background: colors.light, color: colors.text }}>
            {user.role === 'higher_official' ? 'OFFICIAL' : user.role.toUpperCase()}
          </span>}
        </div>
      </div>

      <div style={S.links}>
        {links.map(l => (
          <Link key={l.to} to={l.to} style={{
            ...S.link,
            ...(location.pathname === l.to ? { ...S.activeLink, color: colors.bg, borderBottom: `2px solid ${colors.bg}` } : {})
          }}>
            <span>{l.icon}</span> {l.label}
          </Link>
        ))}
      </div>

      {user && (
        <div style={S.right}>
          <div style={S.userInfo}>
            <div style={{ ...S.avatar, background: colors.bg }}>{user.username[0].toUpperCase()}</div>
            <div>
              <div style={S.username}>{user.fullName || user.username}</div>
              <div style={S.email}>{user.email}</div>
            </div>
          </div>
          <button onClick={handleLogout} style={S.logoutBtn}>Sign Out</button>
        </div>
      )}
    </nav>
  );
}

const S = {
  nav: { display: 'flex', alignItems: 'center', background: '#fff', padding: '0 24px', height: 64, boxShadow: '0 1px 20px rgba(0,0,0,0.08)', position: 'sticky', top: 0, zIndex: 100, gap: 8 },
  left: { display: 'flex', alignItems: 'center', gap: 10, marginRight: 24, minWidth: 180 },
  logo: { width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 },
  brand: { fontWeight: 800, fontSize: 18, color: '#1e293b', letterSpacing: -0.5 },
  roleChip: { marginLeft: 8, padding: '2px 8px', borderRadius: 6, fontSize: 10, fontWeight: 700, letterSpacing: 0.5 },
  links: { display: 'flex', gap: 2, flex: 1, height: '100%', alignItems: 'center', overflowX: 'auto' },
  link: { display: 'flex', alignItems: 'center', gap: 6, padding: '0 12px', height: 64, color: '#64748b', textDecoration: 'none', fontSize: 13, fontWeight: 500, borderBottom: '2px solid transparent', whiteSpace: 'nowrap' },
  activeLink: { fontWeight: 700 },
  right: { display: 'flex', alignItems: 'center', gap: 14, marginLeft: 'auto' },
  userInfo: { display: 'flex', alignItems: 'center', gap: 10 },
  avatar: { width: 34, height: 34, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14 },
  username: { fontSize: 13, fontWeight: 600, color: '#1e293b' },
  email: { fontSize: 11, color: '#94a3b8' },
  logoutBtn: { background: '#f1f5f9', color: '#64748b', border: 'none', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 },
};
