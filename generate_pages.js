const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'apps/admin/src/pages');

const pages = [
  'UsersList', 'UserVerification', 'SuspendedUsers',
  'AllListings', 'PendingListings', 'MarketplaceCategories', 'FeaturedListings',
  'ServiceCatalogue', 'ServiceCategories', 'ServicePackages',
  'AllProviders', 'KYC', 'ProviderServiceAds', 'ProviderAvailability',
  'AllBookings', 'UpcomingBookings', 'InProgressBookings', 'CompletedBookings', 'CancelledBookings',
  'Transactions', 'Refunds', 'Invoices', 'SellerPackages',
  'Reports', 'FlaggedListings', 'FlaggedUsers', 'Appeals', 'RiskFlags',
  'Banners', 'HomeModules', 'FAQs', 'SafetyContent', 'StaticPages', 'NotificationTemplates',
  'Notifications', 'Analytics', 'AuditLogs', 'RolesPermissions', 'SystemSettings', 'Configuration'
];

pages.forEach(page => {
  const content = `import React from 'react';

function ${page}() {
  return (
    <div className="admin-page">
      <div className="admin-header">
        <h2 className="admin-title">${page.replace(/([A-Z])/g, ' $1').trim()}</h2>
      </div>
      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="admin-card-title">Manage ${page.replace(/([A-Z])/g, ' $1').trim()}</h3>
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

export default ${page};
`;
  
  fs.writeFileSync(path.join(pagesDir, `${page}.jsx`), content);
});

console.log('Pages generated successfully!');
