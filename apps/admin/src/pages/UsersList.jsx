import React, { useState } from 'react';

const mockUsers = [
  {
    id: 1,
    name: 'Rahul Sharma',
    email: 'rahul.s@example.com',
    phone: '+91 9876543210',
    role: 'Customer',
    verification: 'Verified',
    status: 'Active',
    joinedDate: '2025-01-15'
  },
  {
    id: 2,
    name: 'Priya Patel',
    email: 'priya.p@example.com',
    phone: '+91 8765432109',
    role: 'Vendor',
    verification: 'Pending',
    status: 'Active',
    joinedDate: '2025-02-20'
  },
  {
    id: 3,
    name: 'Amit Kumar',
    email: 'amit.k@example.com',
    phone: '+91 7654321098',
    role: 'Delivery Agent',
    verification: 'Rejected',
    status: 'Suspended',
    joinedDate: '2024-11-05'
  },
  {
    id: 4,
    name: 'Sneha Gupta',
    email: 'sneha.g@example.com',
    phone: '+91 6543210987',
    role: 'Admin',
    verification: 'Verified',
    status: 'Active',
    joinedDate: '2023-08-12'
  }
];

export default function UsersList() {
  const [users, setUsers] = useState(mockUsers);

  const toggleStatus = (id) => {
    setUsers(users.map(user => {
      if (user.id === id) {
        return {
          ...user,
          status: user.status === 'Active' ? 'Suspended' : 'Active'
        };
      }
      return user;
    }));
  };

  const getBadgeStyle = (text) => {
    switch(text) {
      case 'Verified':
      case 'Active':
        return { backgroundColor: '#d4edda', color: '#155724', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', display: 'inline-block' };
      case 'Pending':
        return { backgroundColor: '#fff3cd', color: '#856404', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', display: 'inline-block' };
      case 'Rejected':
      case 'Suspended':
        return { backgroundColor: '#f8d7da', color: '#721c24', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', display: 'inline-block' };
      default:
        return { backgroundColor: '#e2e3e5', color: '#383d41', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', display: 'inline-block' };
    }
  };

  return (
    <div className="admin-card" style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, color: '#333' }}>Users List</h2>
        <button className="btn-primary" style={{ padding: '8px 16px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          Add New User
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #dee2e6', backgroundColor: '#f8f9fa' }}>
              <th style={{ padding: '12px', borderBottom: '2px solid #dee2e6', color: '#495057' }}>User</th>
              <th style={{ padding: '12px', borderBottom: '2px solid #dee2e6', color: '#495057' }}>Name</th>
              <th style={{ padding: '12px', borderBottom: '2px solid #dee2e6', color: '#495057' }}>Phone</th>
              <th style={{ padding: '12px', borderBottom: '2px solid #dee2e6', color: '#495057' }}>Email</th>
              <th style={{ padding: '12px', borderBottom: '2px solid #dee2e6', color: '#495057' }}>Role</th>
              <th style={{ padding: '12px', borderBottom: '2px solid #dee2e6', color: '#495057' }}>Verification</th>
              <th style={{ padding: '12px', borderBottom: '2px solid #dee2e6', color: '#495057' }}>Status</th>
              <th style={{ padding: '12px', borderBottom: '2px solid #dee2e6', color: '#495057' }}>Joined Date</th>
              <th style={{ padding: '12px', borderBottom: '2px solid #dee2e6', color: '#495057' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                <td style={{ padding: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#e9ecef', color: '#495057', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px' }}>
                    {user.name.charAt(0)}
                  </div>
                </td>
                <td style={{ padding: '12px', fontWeight: '500', color: '#212529' }}>{user.name}</td>
                <td style={{ padding: '12px', color: '#495057' }}>{user.phone}</td>
                <td style={{ padding: '12px', color: '#495057' }}>{user.email}</td>
                <td style={{ padding: '12px', color: '#212529' }}>{user.role}</td>
                <td style={{ padding: '12px' }}>
                  <span className="badge" style={getBadgeStyle(user.verification)}>{user.verification}</span>
                </td>
                <td style={{ padding: '12px' }}>
                  <span className="badge" style={getBadgeStyle(user.status)}>{user.status}</span>
                </td>
                <td style={{ padding: '12px', color: '#495057' }}>{user.joinedDate}</td>
                <td style={{ padding: '12px' }}>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button className="btn-secondary" style={{ padding: '4px 8px', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                      View
                    </button>
                    <button className="btn-secondary" style={{ padding: '4px 8px', backgroundColor: '#ffc107', color: '#212529', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                      Edit
                    </button>
                    <button 
                      className="btn-danger" 
                      onClick={() => toggleStatus(user.id)}
                      style={{ padding: '4px 8px', backgroundColor: user.status === 'Active' ? '#dc3545' : '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                    >
                      {user.status === 'Active' ? 'Suspend' : 'Activate'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
