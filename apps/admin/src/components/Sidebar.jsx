import React, { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { API_BASE, getAssetUrl } from '../config'

function Sidebar({ isOpen, onClose, profileImage, userName = 'Admin', userEmail = 'admin@mybigbazaar.com', onLogout }) {
  const location = useLocation()
  const [open, setOpen] = useState('marketplace')

  const siteLogo = '/aeryp.png'
  const siteName = 'MyBigBazaar'

  const toggle = (section) => setOpen(open === section ? '' : section)

  useEffect(() => {
    const p = location.pathname
    if (p.includes('/users')) setOpen('users')
    //else if (p.includes('/listings')) setOpen('marketplace')
  else if (p.includes('/listings')) setOpen('Ads Management')
    else if (p.includes('/services')) setOpen('services')
    else if (p.includes('/providers')) setOpen('providers')
    else if (p.includes('/bookings')) setOpen('bookings')
    else if (p.includes('/payments')) setOpen('payments')
    else if (p.includes('/moderation')) setOpen('moderation')
    else if (p.includes('/cms')) setOpen('cms')
    else if (p.includes('/settings')) setOpen('settings')
  }, [location.pathname])

  const Icon = ({ path }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ minWidth: '20px' }}>
      <path d={path} />
    </svg>
  )

  const Arrow = ({ section }) => (
    <span className={`p-nav-arrow ${open === section ? 'open' : ''}`}>▶</span>
  )

  const SubLink = ({ to, badge, children }) => (
    <NavLink to={to} className={({ isActive }) => `p-sub-link ${isActive ? 'active' : ''}`}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <span>{children}</span>
        {Boolean(badge && Number(badge) > 0) && <span className="p-badge-pill">{badge}</span>}
      </div>
    </NavLink>
  )

  return (
    <>
      <style>{`
        .sidebar-backdrop, .premium-overlay { display: none; }
        @media (max-width: 991px) {
          .sidebar-backdrop, .premium-overlay {
            display: block; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(0, 0, 0, 0.55); backdrop-filter: blur(4px); z-index: 998;
            opacity: ${isOpen ? '1' : '0'}; visibility: ${isOpen ? 'visible' : 'hidden'};
            pointer-events: ${isOpen ? 'auto' : 'none'}; transition: opacity 0.25s ease, visibility 0.25s ease;
          }
        }
        .premium-sidebar {
          position: fixed; top: 0; left: 0; width: 260px; height: 100vh;
          background-color: var(--sidebar-bg); color: var(--text-secondary); z-index: 999;
          display: flex; flex-direction: column; border-right: 1px solid var(--border-color);
          transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
          transform: ${isOpen ? 'translate3d(0, 0, 0)' : 'translate3d(-100%, 0, 0)'};
        }
        @media (max-width: 991px) { .premium-sidebar { width: 280px; z-index: 1000; } }
        .p-sidebar-header { padding: 14px 16px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--border-color); }
        .p-brand-link { display: flex; align-items: center; gap: 10px; text-decoration: none; flex: 1; }
        .p-brand-logo-box { width: 32px; height: 32px; border-radius: 6px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.05); }
        .p-brand-name { font-size: 0.92rem; font-weight: 700; color: var(--text-primary); }
        .p-brand-subtitle { font-size: 0.7rem; font-weight: 600; color: var(--text-secondary); }
        .p-sidebar-collapse-btn { display: flex; padding: 6px; border-radius: 6px; border: 1px solid var(--border-color); background: transparent; color: var(--text-secondary); cursor: pointer; }
        .p-sidebar-nav { flex: 1; overflow-y: auto; padding: 8px 0; }
        .p-sidebar-link { display: flex; align-items: center; justify-content: space-between; padding: 11px 20px; color: var(--text-secondary); text-decoration: none; font-size: 0.9rem; cursor: pointer; }
        .p-sidebar-link:hover { background: var(--hover-bg); color: var(--text-primary); }
        .p-sidebar-link.active { background: var(--active-bg); color: var(--text-primary); border-left: 3px solid var(--accent-color); font-weight: 600; }
        .p-link-content { display: flex; align-items: center; gap: 14px; }
        .p-nav-arrow { font-size: 0.65rem; transition: transform 0.2s ease; }
        .p-nav-arrow.open { transform: rotate(90deg); color: var(--accent-color); }
        .p-submenu { margin: 4px 16px 8px 30px; border-left: 2px solid var(--border-color); display: flex; flex-direction: column; }
        .p-sub-link { padding: 8px 16px; color: var(--text-secondary); text-decoration: none; font-size: 0.84rem; display: block; }
        .p-sub-link:hover { color: var(--text-primary); background: var(--hover-bg); padding-left: 20px; }
        .p-sub-link.active { color: var(--accent-color); font-weight: 600; background: var(--active-bg); padding-left: 20px; }
        .p-badge-pill { background: var(--accent-color); color: #000; font-size: 0.68rem; padding: 2px 7px; border-radius: 12px; }
      `}</style>

      <div className="sidebar-backdrop premium-overlay" onClick={onClose} />
      <aside className="premium-sidebar">
        <div className="p-sidebar-header">
          <Link to="/dashboard" className="p-brand-link">
            <div className="p-brand-logo-box"><span style={{ fontWeight: 'bold' }}>MB</span></div>
            <div className="p-brand-text">
              <span className="p-brand-name">MyBigBazaar</span>
              <span className="p-brand-subtitle">Admin Workspace</span>
            </div>
          </Link>
          <button className="p-sidebar-collapse-btn" onClick={onClose}>✕</button>
        </div>

        <nav className="p-sidebar-nav">
          <NavLink to="/dashboard" end className={({ isActive }) => `p-sidebar-link ${isActive ? 'active' : ''}`}>
            <div className="p-link-content"><Icon path="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /><span>Dashboard</span></div>
          </NavLink>

          <div className={`p-sidebar-link ${open === 'marketplace' ? 'active' : ''}`} onClick={() => toggle('marketplace')}>
            <div className="p-link-content"><Icon path="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /><span>Ads Management</span></div><Arrow section="marketplace" />
          </div>
          {open === 'marketplace' && (
            <div className="p-submenu">
              <SubLink to="/dashboard/listings">Banner</SubLink>
              <SubLink to="/dashboard/listings/pending" badge="5">Campaign</SubLink>
  
            </div>
          )}

          <div className={`p-sidebar-link ${open === 'users' ? 'active' : ''}`} onClick={() => toggle('users')}>
            <div className="p-link-content"><Icon path="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /><span>Users</span></div><Arrow section="users" />
          </div>
          {open === 'users' && (
            <div className="p-submenu">
              <SubLink to="/dashboard/users">Buyer</SubLink>
              <SubLink to="/dashboard/users/verification">Seller</SubLink>
            </div>
          )}

          <div className={`p-sidebar-link ${open === 'services' ? 'active' : ''}`} onClick={() => toggle('services')}>
            <div className="p-link-content"><Icon path="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /><span>Services</span></div><Arrow section="services" />
          </div>
          {open === 'services' && (
            <div className="p-submenu">
              <SubLink to="/dashboard/services">Service Catalogue</SubLink>
              <SubLink to="/dashboard/services/categories">Categories</SubLink>
              <SubLink to="/dashboard/services/packages">Packages / Variants</SubLink>
            </div>
          )}

          {/* <div className={`p-sidebar-link ${open === 'providers' ? 'active' : ''}`} onClick={() => toggle('providers')}>
            <div className="p-link-content"><Icon path="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /><span>Providers</span></div><Arrow section="providers" />
          </div>
          {open === 'providers' && (
            <div className="p-submenu">
              <SubLink to="/dashboard/providers">All Providers</SubLink>
              <SubLink to="/dashboard/providers/kyc" badge="1">Verification / KYC</SubLink>
              <SubLink to="/dashboard/providers/service-ads">Service Ads</SubLink>
              <SubLink to="/dashboard/providers/availability">Provider Availability</SubLink>
            </div>
          )} */}

          <div className={`p-sidebar-link ${open === 'bookings' ? 'active' : ''}`} onClick={() => toggle('bookings')}>
            <div className="p-link-content"><Icon path="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /><span>Bookings</span></div><Arrow section="bookings" />
          </div>
          {open === 'bookings' && (
            <div className="p-submenu">
              <SubLink to="/dashboard/bookings">All Bookings</SubLink>
              <SubLink to="/dashboard/bookings/upcoming">Upcoming</SubLink>
              <SubLink to="/dashboard/bookings/in-progress">In Progress</SubLink>
              <SubLink to="/dashboard/bookings/completed">Completed</SubLink>
              <SubLink to="/dashboard/bookings/cancelled">Cancelled</SubLink>
            </div>
          )}

          <div className={`p-sidebar-link ${open === 'payments' ? 'active' : ''}`} onClick={() => toggle('payments')}>
            <div className="p-link-content"><Icon path="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /><span>Payments</span></div><Arrow section="payments" />
          </div>
          {open === 'payments' && (
            <div className="p-submenu">
              <SubLink to="/dashboard/payments/transactions">Transactions</SubLink>
              <SubLink to="/dashboard/payments/refunds">Refunds</SubLink>
              <SubLink to="/dashboard/payments/invoices">Invoices</SubLink>
              <SubLink to="/dashboard/payments/seller-packages">Seller Packages</SubLink>
            </div>
          )}

          <div className={`p-sidebar-link ${open === 'moderation' ? 'active' : ''}`} onClick={() => toggle('moderation')}>
            <div className="p-link-content"><Icon path="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /><span>Moderation</span></div><Arrow section="moderation" />
          </div>
          {open === 'moderation' && (
            <div className="p-submenu">
              <SubLink to="/dashboard/moderation/reports" badge="4">Reports</SubLink>
              <SubLink to="/dashboard/moderation/flagged-listings">Flagged Listings</SubLink>
              <SubLink to="/dashboard/moderation/flagged-users">Flagged Users</SubLink>
              <SubLink to="/dashboard/moderation/appeals">Appeals</SubLink>
              <SubLink to="/dashboard/moderation/risk-flags">Risk Flags</SubLink>
            </div>
          )}

          <div className={`p-sidebar-link ${open === 'cms' ? 'active' : ''}`} onClick={() => toggle('cms')}>
            <div className="p-link-content"><Icon path="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /><span>CMS</span></div><Arrow section="cms" />
          </div>
          {open === 'cms' && (
            <div className="p-submenu">
        
              
              <SubLink to="/dashboard/cms/faqs">FAQs</SubLink>
              <SubLink to="/dashboard/cms/safety">Safety Content</SubLink>
              
              <SubLink to="/dashboard/cms/notification-templates">Notification Templates</SubLink>
            </div>
          )}

          <NavLink to="/dashboard/notifications" className={({ isActive }) => `p-sidebar-link ${isActive ? 'active' : ''}`}>
            <div className="p-link-content"><Icon path="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /><span>Notifications</span></div>
          </NavLink>

          <NavLink to="/dashboard/analytics" className={({ isActive }) => `p-sidebar-link ${isActive ? 'active' : ''}`}>
            <div className="p-link-content"><Icon path="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /><span>Analytics</span></div>
          </NavLink>

          <NavLink to="/dashboard/audit-logs" className={({ isActive }) => `p-sidebar-link ${isActive ? 'active' : ''}`}>
            <div className="p-link-content"><Icon path="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /><span>Audit Logs</span></div>
          </NavLink>

          <div className={`p-sidebar-link ${open === 'settings' ? 'active' : ''}`} onClick={() => toggle('settings')}>
            <div className="p-link-content"><Icon path="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><span>Settings</span></div><Arrow section="settings" />
          </div>
          {open === 'settings' && (
            <div className="p-submenu">
              <SubLink to="/dashboard/settings/roles">Roles & Permissions</SubLink>
              <SubLink to="/dashboard/settings/system">System Settings</SubLink>
              <SubLink to="/dashboard/settings/config">Configuration</SubLink>
            </div>
          )}
        </nav>
      </aside>
    </>
  )
}

export default Sidebar;
