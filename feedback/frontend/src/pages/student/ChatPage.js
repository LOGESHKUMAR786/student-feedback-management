import ChatBox from '../../components/ChatBox';
import { useAuth } from '../../context/AuthContext';

export default function ChatPage() {
  const { user } = useAuth();
  return (
    <div style={S.page}>
      <div style={S.header}>
        <h2 style={S.title}>💬 Batch Chat Room</h2>
        <p style={S.sub}>
          Chat with your batchmates and department members in real-time.
          Filter by batch year, department or year of study.
        </p>
      </div>
      <div style={S.info}>
        <div style={S.infoCard}>
          <span style={S.infoIcon}>👤</span>
          <div><div style={S.infoLabel}>Logged in as</div><div style={S.infoVal}>{user?.fullName || user?.username}</div></div>
        </div>
        <div style={S.infoCard}>
          <span style={S.infoIcon}>🎭</span>
          <div><div style={S.infoLabel}>Role</div><div style={S.infoVal}>{user?.role?.replace('_', ' ').toUpperCase()}</div></div>
        </div>
        <div style={S.infoCard}>
          <span style={S.infoIcon}>💡</span>
          <div><div style={S.infoLabel}>Tip</div><div style={S.infoVal}>Select filters to join a specific batch room</div></div>
        </div>
      </div>
      <div style={S.chatWrap}>
        <ChatBox />
      </div>
    </div>
  );
}

const S = {
  page: { padding: '28px 32px', maxWidth: 1000, margin: '0 auto' },
  header: { marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 800, color: '#1e293b', margin: 0 },
  sub: { color: '#64748b', fontSize: 14, marginTop: 6 },
  info: { display: 'flex', gap: 14, marginBottom: 20, flexWrap: 'wrap' },
  infoCard: { background: '#fff', borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 1px 12px rgba(0,0,0,0.06)', flex: 1, minWidth: 200 },
  infoIcon: { fontSize: 24 },
  infoLabel: { fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' },
  infoVal: { fontSize: 14, fontWeight: 700, color: '#1e293b', marginTop: 2 },
  chatWrap: { height: 600 },
};
