import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const SOCKET_URL = 'http://localhost:5000';
const BATCH_YEARS = ['2021-2025', '2022-2026', '2023-2027', '2024-2028', '2025-2029'];
const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

let socket;

export default function ChatBox() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [departments, setDepartments] = useState([]);
  const [filter, setFilter] = useState({ batch_year: '', department: '', year_of_study: '' });
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  const room = `${filter.batch_year || 'all'}_${filter.department || 'all'}_${filter.year_of_study || 'all'}`;

  // Load departments
  useEffect(() => {
    api.get('/auth/departments').then(r => setDepartments(r.data)).catch(() => {});
  }, []);

  // Socket connection
  useEffect(() => {
    socket = io(SOCKET_URL, { transports: ['websocket'] });
    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));
    socket.on('receive_message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });
    return () => { socket.disconnect(); };
  }, []);

  // Join room & load messages when filter changes
  useEffect(() => {
    socket?.emit('join_room', { room });
    loadMessages();
  }, [filter]);

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter.batch_year) params.batch_year = filter.batch_year;
      if (filter.department) params.department = filter.department;
      const { data } = await api.get('/chat/messages', { params });
      setMessages(data);
    } catch {}
    setLoading(false);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const msgData = {
      sender_id: user.id,
      sender_name: user.fullName || user.username,
      role: user.role,
      batch_year: filter.batch_year || null,
      department: filter.department || null,
      year_of_study: filter.year_of_study || null,
      message: text.trim(),
      room,
    };
    socket.emit('send_message', msgData);
    setText('');
  };

  const roleColor = { student: '#667eea', admin: '#e94560', higher_official: '#f59e0b', dean: '#11998e' };
  const roleLabel = { student: '👨🎓', admin: '🔧', higher_official: '🏛️', dean: '🎓' };

  return (
    <div style={S.wrap}>
      {/* Header */}
      <div style={S.header}>
        <div style={S.headerLeft}>
          <span style={S.headerIcon}>💬</span>
          <div>
            <div style={S.headerTitle}>Batch Chat Room</div>
            <div style={S.headerSub}>
              {connected ? <span style={S.online}>● Online</span> : <span style={S.offline}>● Offline</span>}
              &nbsp;· {messages.length} messages
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={S.filters}>
        <div style={S.filterItem}>
          <label style={S.filterLabel}>📅 Batch Year</label>
          <select style={S.select} value={filter.batch_year}
            onChange={e => setFilter({ ...filter, batch_year: e.target.value })}>
            <option value="">All Batches</option>
            {BATCH_YEARS.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <div style={S.filterItem}>
          <label style={S.filterLabel}>🏛️ Department</label>
          <select style={S.select} value={filter.department}
            onChange={e => setFilter({ ...filter, department: e.target.value })}>
            <option value="">All Departments</option>
            {departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
          </select>
        </div>
        <div style={S.filterItem}>
          <label style={S.filterLabel}>📚 Year of Study</label>
          <select style={S.select} value={filter.year_of_study}
            onChange={e => setFilter({ ...filter, year_of_study: e.target.value })}>
            <option value="">All Years</option>
            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <div style={S.filterItem}>
          <label style={S.filterLabel}>🔍 Room</label>
          <div style={S.roomBadge}>{filter.batch_year || 'All'} · {filter.department || 'All'} · {filter.year_of_study || 'All'}</div>
        </div>
      </div>

      {/* Messages */}
      <div style={S.messages}>
        {loading ? (
          <div style={S.loading}>Loading messages...</div>
        ) : messages.length === 0 ? (
          <div style={S.empty}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>💬</div>
            <div>No messages yet. Start the conversation!</div>
          </div>
        ) : (
          messages.map((msg, i) => {
            const isMe = msg.sender_id === user.id;
            return (
              <div key={msg.id || i} style={{ ...S.msgRow, justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
                {!isMe && (
                  <div style={{ ...S.avatar, background: roleColor[msg.role] || '#667eea' }}>
                    {roleLabel[msg.role] || '👤'}
                  </div>
                )}
                <div style={{ maxWidth: '68%' }}>
                  {!isMe && (
                    <div style={S.msgMeta}>
                      <span style={{ ...S.msgName, color: roleColor[msg.role] || '#667eea' }}>{msg.sender_name}</span>
                      {msg.batch_year && <span style={S.msgTag}>{msg.batch_year}</span>}
                      {msg.department && <span style={S.msgTag}>{msg.department}</span>}
                      {msg.year_of_study && <span style={S.msgTag}>{msg.year_of_study}</span>}
                    </div>
                  )}
                  <div style={{ ...S.bubble, ...(isMe ? S.bubbleMe : S.bubbleThem) }}>
                    {msg.message}
                  </div>
                  <div style={{ ...S.msgTime, textAlign: isMe ? 'right' : 'left' }}>
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                {isMe && (
                  <div style={{ ...S.avatar, background: roleColor[user.role] || '#667eea' }}>
                    {roleLabel[user.role] || '👤'}
                  </div>
                )}
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} style={S.inputRow}>
        <input
          style={S.input}
          placeholder={`Message ${filter.batch_year || 'all batches'} · ${filter.department || 'all departments'}...`}
          value={text}
          onChange={e => setText(e.target.value)}
          disabled={!connected}
        />
        <button style={{ ...S.sendBtn, opacity: !connected || !text.trim() ? 0.5 : 1 }}
          disabled={!connected || !text.trim()}>
          ➤
        </button>
      </form>
    </div>
  );
}

const S = {
  wrap: { display: 'flex', flexDirection: 'column', height: '100%', background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 20px rgba(0,0,0,0.08)' },
  header: { background: 'linear-gradient(135deg,#667eea,#764ba2)', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  headerLeft: { display: 'flex', alignItems: 'center', gap: 12 },
  headerIcon: { fontSize: 28 },
  headerTitle: { fontWeight: 700, color: '#fff', fontSize: 16 },
  headerSub: { fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  online: { color: '#86efac' },
  offline: { color: '#fca5a5' },
  filters: { display: 'flex', gap: 12, padding: '12px 16px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', flexWrap: 'wrap', alignItems: 'flex-end' },
  filterItem: { display: 'flex', flexDirection: 'column', gap: 4, minWidth: 140 },
  filterLabel: { fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 },
  select: { padding: '7px 10px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13, background: '#fff', outline: 'none', cursor: 'pointer' },
  roomBadge: { padding: '7px 10px', background: '#ede9fe', color: '#7c3aed', borderRadius: 8, fontSize: 12, fontWeight: 600 },
  messages: { flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 12, minHeight: 300, maxHeight: 420 },
  loading: { textAlign: 'center', color: '#94a3b8', padding: 20 },
  empty: { textAlign: 'center', color: '#94a3b8', padding: 40, fontSize: 14 },
  msgRow: { display: 'flex', alignItems: 'flex-end', gap: 8 },
  avatar: { width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 },
  msgMeta: { display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, flexWrap: 'wrap' },
  msgName: { fontSize: 12, fontWeight: 700 },
  msgTag: { background: '#f1f5f9', color: '#64748b', padding: '1px 6px', borderRadius: 6, fontSize: 10, fontWeight: 600 },
  bubble: { padding: '10px 14px', borderRadius: 14, fontSize: 14, lineHeight: 1.5, wordBreak: 'break-word' },
  bubbleMe: { background: 'linear-gradient(135deg,#667eea,#764ba2)', color: '#fff', borderBottomRightRadius: 4 },
  bubbleThem: { background: '#f1f5f9', color: '#1e293b', borderBottomLeftRadius: 4 },
  msgTime: { fontSize: 10, color: '#94a3b8', marginTop: 3 },
  inputRow: { display: 'flex', gap: 8, padding: '12px 16px', borderTop: '1px solid #e2e8f0', background: '#fff' },
  input: { flex: 1, padding: '11px 16px', border: '1.5px solid #e2e8f0', borderRadius: 24, fontSize: 14, outline: 'none', background: '#f8fafc' },
  sendBtn: { width: 44, height: 44, background: 'linear-gradient(135deg,#667eea,#764ba2)', color: '#fff', border: 'none', borderRadius: '50%', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
};
