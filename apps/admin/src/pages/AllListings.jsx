import React, { useState } from 'react';

const mockListings = [
  { id: 1, title: 'Vintage Leather Jacket', seller: 'John Doe', category: 'Clothing', price: '$120', location: 'New York', status: 'Live' },
  { id: 2, title: 'MacBook Pro M1', seller: 'Alice Smith', category: 'Electronics', price: '$999', location: 'San Francisco', status: 'Sold' },
  { id: 3, title: 'IKEA Dining Table', seller: 'Bob Johnson', category: 'Furniture', price: '$50', location: 'Chicago', status: 'Live' },
  { id: 4, title: 'Rolex Submariner', seller: 'Charlie Brown', category: 'Watches', price: '$8500', location: 'Miami', status: 'Suspended' },
  { id: 5, title: 'Sony PlayStation 5', seller: 'Eve Adams', category: 'Gaming', price: '$450', location: 'Seattle', status: 'Live' },
];

const AllListings = () => {
  const [filter, setFilter] = useState('All');

  const filteredListings = filter === 'All' 
    ? mockListings 
    : mockListings.filter(listing => listing.status === filter);

  return (
    <div className="admin-page" style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>All Listings</h1>
      
      <div className="admin-card" style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Manage Listings</h2>
          <div>
            <label htmlFor="status-filter" style={{ marginRight: '10px' }}>Filter by Status:</label>
            <select 
              id="status-filter"
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              style={{ padding: '5px 10px', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value="All">All</option>
              <option value="Live">Live</option>
              <option value="Sold">Sold</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
        </div>

        <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #eee' }}>
              <th style={{ padding: '10px' }}>Image</th>
              <th style={{ padding: '10px' }}>Title</th>
              <th style={{ padding: '10px' }}>Seller</th>
              <th style={{ padding: '10px' }}>Category</th>
              <th style={{ padding: '10px' }}>Price</th>
              <th style={{ padding: '10px' }}>Status</th>
              <th style={{ padding: '10px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredListings.map(listing => (
              <tr key={listing.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px' }}>
                  <div style={{ width: '40px', height: '40px', background: '#e0e0e0', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#666' }}>Img</div>
                </td>
                <td style={{ padding: '10px' }}>{listing.title}</td>
                <td style={{ padding: '10px' }}>{listing.seller}</td>
                <td style={{ padding: '10px' }}>{listing.category}</td>
                <td style={{ padding: '10px' }}>{listing.price}</td>
                <td style={{ padding: '10px' }}>
                  <span className={`badge badge-${listing.status.toLowerCase()}`} style={{
                    padding: '4px 8px', 
                    borderRadius: '12px', 
                    fontSize: '12px',
                    background: listing.status === 'Live' ? '#d4edda' : listing.status === 'Sold' ? '#cce5ff' : '#f8d7da',
                    color: listing.status === 'Live' ? '#155724' : listing.status === 'Sold' ? '#004085' : '#721c24'
                  }}>
                    {listing.status}
                  </span>
                </td>
                <td style={{ padding: '10px' }}>
                  <button className="btn-secondary" style={{ padding: '5px 10px', marginRight: '5px', border: '1px solid #ccc', borderRadius: '4px', background: '#fff', cursor: 'pointer' }}>View</button>
                  <button className="btn-primary" style={{ padding: '5px 10px', border: 'none', borderRadius: '4px', background: '#007bff', color: '#fff', cursor: 'pointer' }}>Edit</button>
                </td>
              </tr>
            ))}
            {filteredListings.length === 0 && (
              <tr>
                <td colSpan="7" style={{ padding: '20px', textAlign: 'center' }}>No listings found for this status.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllListings;
