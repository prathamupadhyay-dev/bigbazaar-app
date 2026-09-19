// ============================================================
// Premium Dashboard Layout Component (Lazy Loaded & Theme Enabled)
// ============================================================
// Uses React.lazy & Suspense to code-split dashboard modules 
// and eliminate heavy bundle warnings.
// ============================================================

import { useState, useEffect, Suspense } from 'react'
import { lazyRetry } from '../utils/lazyRetry'
import { Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { API_BASE } from '../config'
import { getAuthToken } from '../utils/api'

import PageSkeletonLoader from '../components/PageSkeletonLoader'

// Lazy Route Imports for Code Splitting
const Overview = lazyRetry(() => import('./Overview'))

const UsersList = lazyRetry(() => import('./UsersList'))
const UserVerification = lazyRetry(() => import('./UserVerification'))
const SuspendedUsers = lazyRetry(() => import('./SuspendedUsers'))

const AllListings = lazyRetry(() => import('./AllListings'))
const PendingListings = lazyRetry(() => import('./PendingListings'))
const MarketplaceCategories = lazyRetry(() => import('./MarketplaceCategories'))
const FeaturedListings = lazyRetry(() => import('./FeaturedListings'))

const ServiceCatalogue = lazyRetry(() => import('./ServiceCatalogue'))
const ServiceCategories = lazyRetry(() => import('./ServiceCategories'))
const ServicePackages = lazyRetry(() => import('./ServicePackages'))

const AllProviders = lazyRetry(() => import('./AllProviders'))
const KYC = lazyRetry(() => import('./KYC'))
const ProviderServiceAds = lazyRetry(() => import('./ProviderServiceAds'))
const ProviderAvailability = lazyRetry(() => import('./ProviderAvailability'))

const AllBookings = lazyRetry(() => import('./AllBookings'))
const UpcomingBookings = lazyRetry(() => import('./UpcomingBookings'))
const InProgressBookings = lazyRetry(() => import('./InProgressBookings'))
const CompletedBookings = lazyRetry(() => import('./CompletedBookings'))
const CancelledBookings = lazyRetry(() => import('./CancelledBookings'))

const Transactions = lazyRetry(() => import('./Transactions'))
const Refunds = lazyRetry(() => import('./Refunds'))
const Invoices = lazyRetry(() => import('./Invoices'))
const SellerPackages = lazyRetry(() => import('./SellerPackages'))

const Reports = lazyRetry(() => import('./Reports'))
const FlaggedListings = lazyRetry(() => import('./FlaggedListings'))
const FlaggedUsers = lazyRetry(() => import('./FlaggedUsers'))
const Appeals = lazyRetry(() => import('./Appeals'))
const RiskFlags = lazyRetry(() => import('./RiskFlags'))

const Banners = lazyRetry(() => import('./Banners'))
const HomeModules = lazyRetry(() => import('./HomeModules'))
const FAQs = lazyRetry(() => import('./FAQs'))
const SafetyContent = lazyRetry(() => import('./SafetyContent'))
const StaticPages = lazyRetry(() => import('./StaticPages'))
const NotificationTemplates = lazyRetry(() => import('./NotificationTemplates'))

const Notifications = lazyRetry(() => import('./Notifications'))
const Analytics = lazyRetry(() => import('./Analytics'))
const AuditLogs = lazyRetry(() => import('./AuditLogs'))
const RolesPermissions = lazyRetry(() => import('./RolesPermissions'))
const SystemSettings = lazyRetry(() => import('./SystemSettings'))
const Configuration = lazyRetry(() => import('./Configuration'))

const Profile = lazyRetry(() => import('./Profile'))
const Settings = lazyRetry(() => import('./Settings'))

function Dashboard({ onLogout, token }) {
  const [sidebarOpen, setSidebarOpen] = useState(() => typeof window !== 'undefined' ? window.innerWidth > 991 : true)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const handleToggleSidebar = () => {
    setIsTransitioning(true)
    setSidebarOpen((prev) => !prev)
  }

  const handleCloseSidebar = () => {
    if (sidebarOpen) {
      setIsTransitioning(true)
      setSidebarOpen(false)
    }
  }

  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => {
        setIsTransitioning(false)
      }, 520)
      return () => clearTimeout(timer)
    }
  }, [isTransitioning, sidebarOpen])
  
  const [profileImage, setProfileImage] = useState(() => {
    return localStorage.getItem('adminProfileImage') || null
  })

  const [userName, setUserName] = useState('Admin')
  const [userEmail, setUserEmail] = useState('admin@mybigbazaar.com')

  const handleProfileImageChange = (img) => {
    setProfileImage(img)
    if (img) localStorage.setItem('adminProfileImage', img)
  }

  return (
    <div className="dashboard-wrapper">
      <style>{`
        .dashboard-wrapper {
          display: flex;
          min-height: 100vh;
          width: 100%;
          background-color: var(--page-bg, #1a1e29);
          transition: background-color 0.4s ease;
          overflow-x: hidden;
          position: relative;
        }
        
        .dashboard-main {
          flex: 1 1 auto;
          display: flex;
          flex-direction: column;
          min-width: 0;
          width: ${sidebarOpen ? 'calc(100% - 260px)' : '100%'};
          margin-left: ${sidebarOpen ? '260px' : '0'};
          box-sizing: border-box;
          transform: translateZ(0);
          position: relative;
          height: 100vh;
          overflow: hidden;
          transition: margin-left 0.28s cubic-bezier(0.4, 0, 0.2, 1), width 0.28s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .dashboard-content-wrapper {
          position: relative;
          flex: 1;
          display: flex;
          flex-direction: column;
          width: 100%;
          min-width: 0;
          overflow-y: auto;
          overflow-x: hidden;
        }

        .dashboard-content {
          flex: 1;
          box-sizing: border-box;
          width: 100%;
          min-width: 0;
        }

        .dashboard-transition-overlay {
          display: none !important;
        }

        .dashboard-suspense-loader {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          height: 60vh;
          font-size: 0.95rem;
          color: var(--text-secondary);
        }

        @media (max-width: 991px) {
          .dashboard-main {
            margin-left: 0;
            width: 100%;
            height: 100vh;
            overflow: hidden;
          }
          .dashboard-content { padding: 0; }
        }
      `}</style>

      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={handleCloseSidebar} 
        profileImage={profileImage} 
        userName={userName}
        userEmail={userEmail}
        onLogout={onLogout} 
      />
      
      <div className="dashboard-main">
        <Header 
          onLogout={onLogout} 
          onMenuToggle={handleToggleSidebar} 
          profileImage={profileImage} 
          token={token} 
        />
        <div className="dashboard-content-wrapper">
          <div className="dashboard-content">
          <Suspense fallback={<PageSkeletonLoader />}>
            <Routes>
              <Route index element={<Overview token={token} />} />

              <Route path="users" element={<UsersList token={token} />} />
              <Route path="users/verification" element={<UserVerification token={token} />} />
              <Route path="users/suspended" element={<SuspendedUsers token={token} />} />

              <Route path="listings" element={<AllListings token={token} />} />
              <Route path="listings/pending" element={<PendingListings token={token} />} />
              <Route path="listings/categories" element={<MarketplaceCategories token={token} />} />
              <Route path="listings/featured" element={<FeaturedListings token={token} />} />

              <Route path="services" element={<ServiceCatalogue token={token} />} />
              <Route path="services/categories" element={<ServiceCategories token={token} />} />
              <Route path="services/packages" element={<ServicePackages token={token} />} />

              <Route path="providers" element={<AllProviders token={token} />} />
              <Route path="providers/kyc" element={<KYC token={token} />} />
              <Route path="providers/service-ads" element={<ProviderServiceAds token={token} />} />
              <Route path="providers/availability" element={<ProviderAvailability token={token} />} />

              <Route path="bookings" element={<AllBookings token={token} />} />
              <Route path="bookings/upcoming" element={<UpcomingBookings token={token} />} />
              <Route path="bookings/in-progress" element={<InProgressBookings token={token} />} />
              <Route path="bookings/completed" element={<CompletedBookings token={token} />} />
              <Route path="bookings/cancelled" element={<CancelledBookings token={token} />} />

              <Route path="payments/transactions" element={<Transactions token={token} />} />
              <Route path="payments/refunds" element={<Refunds token={token} />} />
              <Route path="payments/invoices" element={<Invoices token={token} />} />
              <Route path="payments/seller-packages" element={<SellerPackages token={token} />} />

              <Route path="moderation/reports" element={<Reports token={token} />} />
              <Route path="moderation/flagged-listings" element={<FlaggedListings token={token} />} />
              <Route path="moderation/flagged-users" element={<FlaggedUsers token={token} />} />
              <Route path="moderation/appeals" element={<Appeals token={token} />} />
              <Route path="moderation/risk-flags" element={<RiskFlags token={token} />} />

              <Route path="cms/banners" element={<Banners token={token} />} />
              <Route path="cms/home-modules" element={<HomeModules token={token} />} />
              <Route path="cms/faqs" element={<FAQs token={token} />} />
              <Route path="cms/safety" element={<SafetyContent token={token} />} />
              <Route path="cms/static-pages" element={<StaticPages token={token} />} />
              <Route path="cms/notification-templates" element={<NotificationTemplates token={token} />} />

              <Route path="notifications" element={<Notifications token={token} />} />
              <Route path="analytics" element={<Analytics token={token} />} />
              <Route path="audit-logs" element={<AuditLogs token={token} />} />
              
              <Route path="settings/roles" element={<RolesPermissions token={token} />} />
              <Route path="settings/system" element={<SystemSettings token={token} />} />
              <Route path="settings/config" element={<Configuration token={token} />} />

              <Route path="profile" element={<Profile profileImage={profileImage} onProfileImageChange={handleProfileImageChange} token={token} />} />
              <Route path="settings" element={<Settings token={token} />} />
              
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Suspense>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  )
}

export default Dashboard
