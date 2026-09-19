import React from 'react';

function CancelledBookings() {
  return (
    <div className="admin-page">
      <div className="admin-header">
        <h2 className="admin-title">Cancelled Bookings</h2>
      </div>
      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="admin-card-title">Manage Cancelled Bookings</h3>
        </div>
        <div className="table-container contain-content" style={{ padding: '20px' }}>
          <p style={{ color: 'var(--text-secondary)' }}>This module is currently running with mock data for demonstration purposes.</p>
          <div style={{ marginTop: '20px', padding: '40px', textAlign: 'center', background: 'var(--hover-bg)', borderRadius: '8px' }}>
            <span style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>No records found</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CancelledBookings;
