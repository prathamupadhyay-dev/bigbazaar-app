import React, { useState } from 'react';

const initialPendingListings = [
  { id: 101, title: 'Antique Vase', seller: 'David Miller', category: 'Collectibles', price: '$300', dateSubmitted: '2026-09-18' },
  { id: 102, title: 'Custom Gaming PC', seller: 'Tech Guru', category: 'Electronics', price: '$1500', dateSubmitted: '2026-09-19' },
  { id: 103, title: 'Handmade Wooden Chair', seller: 'WoodCrafter', category: 'Furniture', price: '$85', dateSubmitted: '2026-09-19' },
];

const PendingListings = () => {
  const [listings, setListings] = useState(initialPendingListings);

  const handleApprove = (id) => {
    // Remove the approved listing from the pending list
    setListings(listings.filter(listing => listing.id !== id));
  };

  const handleReject = (id) => {
    // For now, just remove it as well, representing it was rejected
    setListings(listings.filter(listing => listing.id !== id));
  };

  const handleRequestChanges = (id) => {
    alert(`Requested changes for listing ID: ${id}`);
  };

  return (
    <div className="admin-page" style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Pending Listings</h1>
      
      <div className="admin-card" style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h2 style={{ marginBottom: '20px' }}>Listings Awaiting Moderation</h2>

        <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #eee' }}>
              <th style={{ padding: '10px' }}>ID</th>
              <th style={{ padding: '10px' }}>Title</th>
              <th style={{ padding: '10px' }}>Seller</th>
              <th style={{ padding: '10px' }}>Category</th>
              <th style={{ padding: '10px' }}>Price</th>
              <th style={{ padding: '10px' }}>Date Submitted</th>
              <th style={{ padding: '10px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {listings.map(listing => (
              <tr key={listing.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px' }}>#{listing.id}</td>
                <td style={{ padding: '10px' }}>{listing.title}</td>
                <td style={{ padding: '10px' }}>{listing.seller}</td>
                <td style={{ padding: '10px' }}>{listing.category}</td>
                <td style={{ padding: '10px' }}>{listing.price}</td>
                <td style={{ padding: '10px' }}>{listing.dateSubmitted}</td>
                <td style={{ padding: '10px' }}>
                  <button 
                    onClick={() => handleApprove(listing.id)}
                    className="btn-success" 
                    style={{ padding: '5px 10px', marginRight: '5px', border: 'none', borderRadius: '4px', background: '#28a745', color: '#fff', cursor: 'pointer' }}
                  >
                    Approve
                  </button>
                  <button 
                    onClick={() => handleReject(listing.id)}
                    className="btn-danger" 
                    style={{ padding: '5px 10px', marginRight: '5px', border: 'none', borderRadius: '4px', background: '#dc3545', color: '#fff', cursor: 'pointer' }}
                  >
                    Reject
                  </button>
                  <button 
                    onClick={() => handleRequestChanges(listing.id)}
                    className="btn-warning" 
                    style={{ padding: '5px 10px', border: 'none', borderRadius: '4px', background: '#ffc107', color: '#212529', cursor: 'pointer' }}
                  >
                    Request Changes
                  </button>
                </td>
              </tr>
            ))}
            {listings.length === 0 && (
              <tr>
                <td colSpan="7" style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                  No pending listings to review. Great job!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PendingListings;
