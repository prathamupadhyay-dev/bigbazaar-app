import React, { useState } from 'react';

const mockVerifications = [
  {
    id: 101,
    userName: 'Vikram Singh',
    userType: 'Vendor',
    submittedInfo: 'GSTIN: 22AAAAA0000A1Z5, PAN: AAAAA0000A',
    documents: ['GST_Certificate.pdf', 'PAN_Card.jpg'],
    submittedDate: '2026-09-15',
    status: 'Pending'
  },
  {
    id: 102,
    userName: 'Neha Desai',
    userType: 'Delivery Agent',
    submittedInfo: 'DL: DL-1420230123456, Vehicle: MH-12-AB-1234',
    documents: ['Driving_License.png', 'RC_Book.pdf'],
    submittedDate: '2026-09-17',
    status: 'Pending'
  },
  {
    id: 103,
    userName: 'Rajesh Meena',
    userType: 'Vendor',
    submittedInfo: 'GSTIN: 33BBBBB1111B2Z6',
    documents: ['GST_Certificate.pdf', 'Address_Proof.jpg'],
    submittedDate: '2026-09-10',
    status: 'Approved'
  },
  {
    id: 104,
    userName: 'Suresh Kumar',
    userType: 'Customer',
    submittedInfo: 'Age Proof for restricted items',
    documents: ['Aadhaar_Card.jpg'],
    submittedDate: '2026-09-12',
    status: 'Rejected'
  }
];

export default function UserVerification() {
  const [verifications, setVerifications] = useState(mockVerifications);

  const handleAction = (id, newStatus) => {
    setVerifications(verifications.map(req => {
      if (req.id === id) {
        return { ...req, status: newStatus };
      }
      return req;
    }));
  };

  const getBadgeStyle = (status) => {
    switch(status) {
      case 'Approved':
        return { backgroundColor: '#d4edda', color: '#155724', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', display: 'inline-block' };
      case 'Pending':
        return { backgroundColor: '#fff3cd', color: '#856404', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', display: 'inline-block' };
      case 'Rejected':
        return { backgroundColor: '#f8d7da', color: '#721c24', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', display: 'inline-block' };
      default:
        return { backgroundColor: '#e2e3e5', color: '#383d41', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', display: 'inline-block' };
    }
  };

  return (
    <div className="admin-card" style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ margin: 0, color: '#333' }}>KYC & Verification Requests</h2>
        <p style={{ color: '#666', fontSize: '14px', marginTop: '4px' }}>Review and approve vendor and delivery agent registrations.</p>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
              <th style={{ padding: '12px', color: '#495057' }}>User</th>
              <th style={{ padding: '12px', color: '#495057' }}>Submitted Info</th>
              <th style={{ padding: '12px', color: '#495057' }}>Documents</th>
              <th style={{ padding: '12px', color: '#495057' }}>Date</th>
              <th style={{ padding: '12px', color: '#495057' }}>Status</th>
              <th style={{ padding: '12px', color: '#495057' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {verifications.map(req => (
              <tr key={req.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                <td style={{ padding: '12px' }}>
                  <div style={{ fontWeight: '600', color: '#212529' }}>{req.userName}</div>
                  <div style={{ fontSize: '12px', color: '#6c757d', marginTop: '2px' }}>{req.userType}</div>
                </td>
                <td style={{ padding: '12px', color: '#495057', fontSize: '14px' }}>
                  {req.submittedInfo}
                </td>
                <td style={{ padding: '12px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {req.documents.map((doc, idx) => (
                      <a key={idx} href="#" style={{ fontSize: '13px', color: '#007bff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ fontSize: '16px' }}>📄</span> {doc}
                      </a>
                    ))}
                  </div>
                </td>
                <td style={{ padding: '12px', color: '#495057' }}>{req.submittedDate}</td>
                <td style={{ padding: '12px' }}>
                  <span className="badge" style={getBadgeStyle(req.status)}>{req.status}</span>
                </td>
                <td style={{ padding: '12px' }}>
                  {req.status === 'Pending' ? (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        className="btn-success" 
                        onClick={() => handleAction(req.id, 'Approved')}
                        style={{ padding: '6px 12px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                      >
                        Approve
                      </button>
                      <button 
                        className="btn-danger" 
                        onClick={() => handleAction(req.id, 'Rejected')}
                        style={{ padding: '6px 12px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span style={{ fontSize: '13px', color: '#6c757d', fontStyle: 'italic' }}>Reviewed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
