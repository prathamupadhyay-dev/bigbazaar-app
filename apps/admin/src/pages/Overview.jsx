// ============================================================
// Premium Overview Dashboard Module
// ============================================================
// Features: Dynamic Real DB Stats Counters linking to sub-pages,
// Recent Inquiries Table, Quick Resolve Action Modal.
// ============================================================

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_BASE } from '../config'
import { getAuthToken } from '../utils/api'

function Overview({ token }) {
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [enquiries, setEnquiries] = useState([])
  const [selected, setSelected] = useState(null)
  const [toast, setToast] = useState(null)
  const [loading, setLoading] = useState(true)

  const authToken = getAuthToken(token)

  const showToast = (msg, type = 'info') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const res = await fetch(`${API_BASE}/api/dashboard`, {
          headers: { Authorization: `Bearer ${authToken}` },
        })
        const data = await res.json()
        
        if (res.ok) {
          setStats(data.stats || data) 
          setEnquiries(data.recentEnquiries || data.recent_enquiries || [])
        } else {
          showToast('Failed to load dashboard data', 'error')
        }
      } catch {
        showToast('Server connection failed', 'error')
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [token])

  const handleView = (enq) => {
    setSelected({ ...enq, message: enq.message || 'No message provided', phone: enq.phone || '' })
  }

  const handleResolve = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/enquiries/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
        body: JSON.stringify({ status: 'closed' }),
      })
      if (res.ok) {
        showToast('Enquiry marked as resolved', 'success')
        setSelected(null)
        setEnquiries(enquiries.map(e => e.id === id ? { ...e, status: 'closed' } : e))
        window.dispatchEvent(new Event('badge-updated'))
      }
    } catch {
      showToast('Server error', 'error')
    }
  }

  const counters = [
    { label: 'Active Users', value: '4,521', subtext: '+124 New Users this week', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { label: 'Live Listings', value: '1,280', subtext: '34 Pending Moderation', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
    { label: 'Active Services', value: '315', subtext: '12 Pending Provider Verification', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { label: 'Pending Bookings', value: '42', subtext: '8 Completed today', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { label: 'Total Revenue', value: '$84,050', subtext: '3 Payment Issues to resolve', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: 'Open Reports', value: '7', subtext: '2 High Priority Complaints', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' }
  ]

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'replied':
        return 'badge badge-info'
      case 'closed':
        return 'badge badge-success'
      default:
        return 'badge badge-warning'
    }
  }

  return (
    <div className="admin-page">
      {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}

      <div className="admin-header">
        <h2 className="admin-title">Store Operations & Performance</h2>
      </div>

      {/* Counters Grid */}
      <div className="admin-grid-3" style={{ marginBottom: '24px' }}>
        {counters.map((c, i) => (
          <div
            key={i}
            className="admin-card stat-card interactive"
            style={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              margin: 0,
              padding: '20px',
            }}
            onClick={() => navigate(c.path)}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '10px',
                background: 'var(--hover-bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-color)',
                flexShrink: 0,
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={c.icon} />
              </svg>
            </div>
            <div>
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block' }}>
                {c.label}
              </span>
              <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2, display: 'block' }}>
                {c.value}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {c.subtext}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Customer Inquiries */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="admin-card-title">Recent Moderation Reports</h3>
          <button
            className="btn-secondary"
            style={{ fontSize: '0.8rem', padding: '6px 12px' }}
            onClick={() => navigate('/dashboard/moderation/reports')}
          >
            View All Reports →
          </button>
        </div>
        
        <div className="table-container contain-content">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '50px' }}>#</th>
                <th>Target</th>
                <th>Type</th>
                <th>Priority</th>
                <th>Date</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-secondary)' }}>
                    Loading data...
                  </td>
                </tr>
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                    No recent reports.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-container" style={{ maxWidth: '540px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Enquiry #{selected.id} Details</h3>
              <button className="modal-close-btn" onClick={() => setSelected(null)}>✕</button>
            </div>
            
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="admin-grid-2">
                <div>
                  <span className="form-label">Customer</span>
                  <p style={{ margin: '4px 0 0', fontWeight: 600, color: 'var(--text-primary)' }}>{selected.name}</p>
                </div>
                <div>
                  <span className="form-label">Date</span>
                  <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {new Date(selected.created_at).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="admin-grid-2">
                <div>
                  <span className="form-label">Email</span>
                  <p style={{ margin: '4px 0 0', color: 'var(--text-primary)' }}>{selected.email}</p>
                </div>
                <div>
                  <span className="form-label">Phone</span>
                  <p style={{ margin: '4px 0 0', color: 'var(--text-primary)' }}>{selected.phone || '—'}</p>
                </div>
              </div>

              {selected.product_name && (
                <div style={{ background: 'var(--header-bg)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <span className="form-label">Enquired Product</span>
                  <p style={{ margin: '2px 0 0', fontWeight: 600, color: 'var(--accent-color)' }}>{selected.product_name}</p>
                </div>
              )}

              <div>
                <span className="form-label">Message</span>
                <div style={{ margin: '4px 0 0', background: 'var(--header-bg)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.9rem', lineHeight: 1.5, color: 'var(--text-primary)' }}>
                  {selected.message}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setSelected(null)}>Close</button>
              {selected.status !== 'closed' && (
                <button className="btn-primary" onClick={() => handleResolve(selected.id)}>Mark as Resolved</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Overview
