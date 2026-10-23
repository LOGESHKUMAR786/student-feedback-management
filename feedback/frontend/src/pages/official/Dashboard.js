import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../utils/api';

export default function OfficialDashboard() {
  const [reports, setReports] = useState([]);
  const [actions, setActions] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportDetail, setReportDetail] = useState(null);
  const [actionForm, setActionForm] = useState({ action_description: '', priority: 'medium', assigned_to: '' });
  const [closeForm, setCloseForm] = useState({ remarks: '' });
  const [showActionModal, setShowActionModal] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [tab, setTab] = useState('reports');

  const load = () => {
    api.get('/reports').then(r => setReports(r.data)).catch(() => {});
    api.get('/reports/actions/all').then(r => setActions(r.data)).catch(() => {});
    api.get('/reports/admins/list').then(r => setAdmins(r.data)).catch(() => {});
  };

  useEffect(() => { load(); }, []);

  const viewReport = async (id) => {
    try {
      const { data } = await api.get(`/reports/${id}`);
      setReportDetail(data);
      setSelectedReport(id);
    } catch { toast.error('Failed to load report'); }
  };

  const handleAssignAction = async e => {
    e.preventDefault();
    try {
      await api.post('/reports/actions/create', { ...actionForm, report_id: selectedReport });
      toast.success('Action assigned!');
      setShowActionModal(false);
      setActionForm({ action_description: '', priority: 'medium', assigned_to: '' });
      load();
    } catch { toast.error('Failed to assign action'); }
  };

  const handleCloseCase = async e => {
    e.preventDefault();
    try {
      await api.post('/reports/actions/close-case', { report_id: selectedReport, remarks: closeForm.remarks });
      toast.success('Case closed!');
      setShowCloseModal(false);
      setReportDetail(null);
      load();
    } catch { toast.error('Failed to close case'); }
  };

  const handleActionStatus = async (id, status) => {
    try {
      await api.patch(`/reports/actions/${id}/status`, { status });
      toast.success('Action updated');
      load();
    } catch { toast.error('Failed to update'); }
  };

  const statusColor = { pending: '#f59e0b', in_progress: '#3b82f6', completed: '#22c55e', closed: '#94a3b8', action_taken: '#8b5cf6', reviewed: '#06b6d4' };
  const priorityColor = { low: '#22c55e', medium: '#f59e0b', high: '#ef4444', critical: '#7c3aed' };

  return (
    <div style={S.page}>
      <div style={S.header}>
        <h2 style={S.title}>🏛️ Higher Official Dashboard</h2>
        <p style={S.sub}>Manage reports, assign actions and close feedback cases</p>
      </div>

      {/* Stats */}
      <div style={S.statsGrid}>
        {[
          { icon: '📋', label: 'Total Reports', value: reports.length, color: '#667eea', bg: '#ede9fe' },
          { icon: '⏳', label: 'Pending Reports', value: reports.filter(r => r.status === 'pending').length, color: '#f59e0b', bg: '#fef3c7' },
          { icon: '⚡', label: 'Active Actions', value: actions.filter(a => a.status === 'pending' || a.status === 'in_progress').length, color: '#ef4444', bg: '#fee2e2' },
          { icon: '✅', label: 'Closed Cases', value: reports.filter(r => r.status === 'closed').length, color: '#22c55e', bg: '#dcfce7' },
        ].map(s => (
          <div key={s.label} style={S.statCard}>
            <div style={{ ...S.statIcon, background: s.bg, color: s.color }}>{s.icon}</div>
            <div><div style={{ ...S.statVal, color: s.color }}>{s.value}</div><div style={S.statLabel}>{s.label}</div></div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={S.tabs}>
        {['reports', 'actions'].map(t => (
          <button key={t} style={{ ...S.tab, ...(tab === t ? S.activeTab : {}) }} onClick={() => setTab(t)}>
            {t === 'reports' ? '📋 Analysis Reports' : '⚡ Assigned Actions'}
          </button>
        ))}
      </div>

      {tab === 'reports' && (
        <div style={S.grid}>
          <div style={S.tableCard}>
            <h3 style={S.cardTitle}>All Reports</h3>
            {reports.length === 0 ? <p style={S.empty}>No reports available yet.</p> :
              reports.map(r => (
                <div key={r.id} style={{ ...S.reportItem, borderLeft: `4px solid ${statusColor[r.status] || '#ccc'}` }}
                  onClick={() => viewReport(r.id)}>
                  <div style={S.reportTop}>
                    <strong>{r.title}</strong>
                    <span style={{ ...S.badge, background: statusColor[r.status] + '22', color: statusColor[r.status] }}>
                      {r.status?.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <div style={S.reportMeta}>
                    📚 {r.course_name || 'All Courses'} &nbsp;|&nbsp;
                    📊 {r.total_feedback} feedbacks &nbsp;|&nbsp;
                    ⭐ {parseFloat(r.avg_rating || 0).toFixed(1)} avg &nbsp;|&nbsp;
                    📅 {new Date(r.created_at).toLocaleDateString()}
                  </div>
                  <div style={S.sentimentRow}>
                    <span style={{ color: '#22c55e' }}>😄 {r.positive_count}</span>
                    <span style={{ color: '#f59e0b', marginLeft: 12 }}>😐 {r.neutral_count}</span>
                    <span style={{ color: '#ef4444', marginLeft: 12 }}>😡 {r.negative_count}</span>
                  </div>
                </div>
              ))}
          </div>

          {reportDetail && (
            <div style={S.detailCard}>
              <div style={S.detailHeader}>
                <h3 style={{ margin: 0 }}>{reportDetail.report.title}</h3>
                <button style={S.closeBtn} onClick={() => setReportDetail(null)}>✕</button>
              </div>
              <div style={S.aiSummary}><strong>🤖 AI Summary:</strong> {reportDetail.report.summary}</div>
              <div style={S.detailStats}>
                <div style={S.dStat}><span style={S.dVal}>{reportDetail.report.total_feedback}</span><span style={S.dLabel}>Total</span></div>
                <div style={S.dStat}><span style={{ ...S.dVal, color: '#f59e0b' }}>{parseFloat(reportDetail.report.avg_rating).toFixed(1)}⭐</span><span style={S.dLabel}>Avg Rating</span></div>
                <div style={S.dStat}><span style={{ ...S.dVal, color: '#22c55e' }}>{reportDetail.report.positive_count}</span><span style={S.dLabel}>Positive</span></div>
                <div style={S.dStat}><span style={{ ...S.dVal, color: '#ef4444' }}>{reportDetail.report.negative_count}</span><span style={S.dLabel}>Negative</span></div>
              </div>
              <div style={S.actionBtns}>
                <button style={S.assignBtn} onClick={() => setShowActionModal(true)}>⚡ Assign Action</button>
                {reportDetail.report.status !== 'closed' && (
                  <button style={S.closeCase} onClick={() => setShowCloseModal(true)}>🔒 Close Case</button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'actions' && (
        <div style={S.tableCard}>
          <h3 style={S.cardTitle}>All Assigned Actions</h3>
          {actions.length === 0 ? <p style={S.empty}>No actions assigned yet.</p> :
            <table style={S.table}>
              <thead><tr style={S.thead}>
                <th style={S.th}>Report</th><th style={S.th}>Description</th><th style={S.th}>Assigned To</th>
                <th style={S.th}>Priority</th><th style={S.th}>Status</th><th style={S.th}>Update</th>
              </tr></thead>
              <tbody>
                {actions.map(a => (
                  <tr key={a.id} style={S.tr}>
                    <td style={S.td}>{a.report_title}</td>
                    <td style={S.td}>{a.action_description?.slice(0, 50)}...</td>
                    <td style={S.td}>{a.assigned_to_fullname || 'All Admins'}</td>
                    <td style={S.td}><span style={{ ...S.badge, background: priorityColor[a.priority] + '22', color: priorityColor[a.priority] }}>{a.priority?.toUpperCase()}</span></td>
                    <td style={S.td}><span style={{ ...S.badge, background: statusColor[a.status] + '22', color: statusColor[a.status] }}>{a.status?.replace('_', ' ')}</span></td>
                    <td style={S.td}>
                      <select style={S.select} value={a.status} onChange={e => handleActionStatus(a.id, e.target.value)}>
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>}
        </div>
      )}

      {/* Assign Action Modal */}
      {showActionModal && (
        <div style={S.overlay}>
          <div style={S.modal}>
            <h3 style={{ marginTop: 0 }}>⚡ Assign Action</h3>
            <form onSubmit={handleAssignAction}>
              <label style={S.label}>Action Description *</label>
              <textarea style={S.textarea} rows={4} placeholder="Describe the action to be taken..."
                value={actionForm.action_description} onChange={e => setActionForm({ ...actionForm, action_description: e.target.value })} required />
              <label style={S.label}>Priority</label>
              <select style={S.input} value={actionForm.priority} onChange={e => setActionForm({ ...actionForm, priority: e.target.value })}>
                <option value="low">Low</option><option value="medium">Medium</option>
                <option value="high">High</option><option value="critical">Critical</option>
              </select>
              <label style={S.label}>Assign To Admin (Optional)</label>
              <select style={S.input} value={actionForm.assigned_to} onChange={e => setActionForm({ ...actionForm, assigned_to: e.target.value })}>
                <option value="">All Admins</option>
                {admins.map(a => <option key={a.id} value={a.id}>{a.full_name || a.username}</option>)}
              </select>
              <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                <button style={S.assignBtn} type="submit">Assign Action</button>
                <button style={S.cancelBtn} type="button" onClick={() => setShowActionModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Close Case Modal */}
      {showCloseModal && (
        <div style={S.overlay}>
          <div style={S.modal}>
            <h3 style={{ marginTop: 0 }}>🔒 Close Feedback Case</h3>
            <form onSubmit={handleCloseCase}>
              <label style={S.label}>Closing Remarks *</label>
              <textarea style={S.textarea} rows={4} placeholder="Enter closing remarks..."
                value={closeForm.remarks} onChange={e => setCloseForm({ remarks: e.target.value })} required />
              <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                <button style={S.closeCase} type="submit">Close Case</button>
                <button style={S.cancelBtn} type="button" onClick={() => setShowCloseModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const S = {
  page: { padding: '28px 32px', maxWidth: 1280, margin: '0 auto' },
  header: { marginBottom: 24 },
  title: { fontSize: 24, fontWeight: 800, color: '#1e293b', margin: 0 },
  sub: { color: '#64748b', fontSize: 14, marginTop: 4 },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 },
  statCard: { background: '#fff', borderRadius: 16, padding: '20px 22px', display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 1px 20px rgba(0,0,0,0.06)' },
  statIcon: { width: 52, height: 52, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 },
  statVal: { fontSize: 28, fontWeight: 800, lineHeight: 1 },
  statLabel: { fontSize: 13, color: '#64748b', marginTop: 4 },
  tabs: { display: 'flex', gap: 8, marginBottom: 20 },
  tab: { padding: '10px 20px', border: '1.5px solid #e2e8f0', borderRadius: 10, cursor: 'pointer', background: '#fff', fontSize: 14, fontWeight: 600, color: '#64748b' },
  activeTab: { background: '#1e293b', color: '#fff', border: '1.5px solid #1e293b' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 },
  tableCard: { background: '#fff', borderRadius: 16, padding: '22px 24px', boxShadow: '0 1px 20px rgba(0,0,0,0.06)' },
  cardTitle: { fontSize: 15, fontWeight: 700, color: '#1e293b', margin: '0 0 16px' },
  reportItem: { padding: '14px 16px', borderRadius: 10, marginBottom: 10, background: '#f8fafc', cursor: 'pointer', transition: 'all 0.2s' },
  reportTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  reportMeta: { fontSize: 12, color: '#64748b', marginBottom: 6 },
  sentimentRow: { fontSize: 13, fontWeight: 600 },
  badge: { padding: '3px 10px', borderRadius: 12, fontSize: 11, fontWeight: 700 },
  detailCard: { background: '#fff', borderRadius: 16, padding: '22px 24px', boxShadow: '0 1px 20px rgba(0,0,0,0.06)' },
  detailHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  closeBtn: { background: '#f1f5f9', border: 'none', width: 32, height: 32, borderRadius: 8, cursor: 'pointer', fontSize: 16 },
  aiSummary: { background: 'linear-gradient(135deg,#667eea,#764ba2)', color: '#fff', borderRadius: 10, padding: '12px 16px', fontSize: 13, lineHeight: 1.6, marginBottom: 16 },
  detailStats: { display: 'flex', gap: 16, marginBottom: 20 },
  dStat: { flex: 1, textAlign: 'center', background: '#f8fafc', borderRadius: 10, padding: '12px 8px' },
  dVal: { display: 'block', fontSize: 22, fontWeight: 800, color: '#1e293b' },
  dLabel: { fontSize: 12, color: '#64748b' },
  actionBtns: { display: 'flex', gap: 10 },
  assignBtn: { flex: 1, padding: '11px', background: 'linear-gradient(135deg,#667eea,#764ba2)', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 700, fontSize: 14 },
  closeCase: { flex: 1, padding: '11px', background: 'linear-gradient(135deg,#ef4444,#dc2626)', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 700, fontSize: 14 },
  cancelBtn: { flex: 1, padding: '11px', background: '#f1f5f9', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 600, fontSize: 14 },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { background: '#f8fafc' },
  th: { padding: '12px 14px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' },
  tr: { borderBottom: '1px solid #f1f5f9' },
  td: { padding: '12px 14px', fontSize: 13 },
  select: { padding: '6px 10px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 12 },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { background: '#fff', borderRadius: 16, padding: 32, width: '100%', maxWidth: 480, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' },
  label: { display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6, marginTop: 14 },
  input: { width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' },
  textarea: { width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 14, boxSizing: 'border-box', resize: 'vertical' },
  empty: { textAlign: 'center', color: '#94a3b8', padding: 30 },
};
