import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';






























































































































































const initialUser = {
  fullName: 'John Doe',
  mobileNumber: '+1 555-0198',
  email: 'john.doe@example.com',
  gender: 'Male',
  role: 'Buyer'
};

const APP_LOCK_ENABLED_KEY = '@app_lock_enabled';
const APP_LOCK_PROMPT_SHOWN_KEY = '@app_lock_prompt_shown';

const initialAddresses = [
{
  id: 'addr-1',
  type: 'Home',
  houseNo: '12 Temple Road',
  street: 'Kumarakom',
  landmark: 'Near Kumarakom Market',
  city: 'Kottayam',
  pincode: '686001',
  isDefault: true
},
{
  id: 'addr-2',
  type: 'Office',
  houseNo: '48 Market Junction',
  street: 'Kaloor',
  landmark: 'Opposite Metro Station',
  city: 'Kottayam',
  pincode: '682017',
  isDefault: false
}];


const initialBookings = [
{
  id: 'bk-1',
  bookingId: 'BB-98421',
  serviceName: 'Plumber',
  subCategoryName: 'Tap Leakage & Valve Repair',
  category: 'Plumber',
  scheduledDate: 'Tomorrow, 10 Sep',
  scheduledTimeSlot: '10:00 AM - 12:00 PM',
  providerName: 'Alex Smith (Certified Plumber)',
  providerContact: '+1 555-0101',
  providerRating: 4.8,
  amount: 349,
  status: 'Upcoming',
  serviceAddress: '12 Temple Road, Kottayam',
  paymentMode: 'Cash on Delivery'
},
{
  id: 'bk-2',
  bookingId: 'BB-87321',
  serviceName: 'Electrician',
  subCategoryName: 'Switchboard & MCB Tripping',
  category: 'Electrician',
  scheduledDate: 'Today',
  scheduledTimeSlot: '02:00 PM - 04:00 PM',
  providerName: 'David Lee',
  providerContact: '+1 555-0102',
  providerRating: 4.9,
  amount: 499,
  status: 'In-Progress',
  serviceAddress: '12 Temple Road, Kottayam',
  paymentMode: 'UPI'
},
{
  id: 'bk-3',
  bookingId: 'BB-65120',
  serviceName: 'Home Tutor',
  subCategoryName: 'Class 10 Mathematics (1-on-1)',
  category: 'Tutor',
  scheduledDate: '02 Sep 2026',
  scheduledTimeSlot: '05:00 PM - 06:30 PM',
  providerName: 'Dr. Sarah Connor',
  providerContact: '+1 555-0103',
  providerRating: 5.0,
  amount: 699,
  status: 'Completed',
  serviceAddress: '12 Temple Road, Kottayam',
  paymentMode: 'UPI',
  userRating: 5,
  userReview: 'Excellent teacher! Cleared all geometry concepts clearly.'
}];


const initialTickets = [
{
  id: 'tkt-1',
  ticketId: 'TKT-1049',
  issueCategory: 'Service Delay',
  bookingId: 'BB-87321',
  subject: 'Technician running 15 minutes late',
  description: 'The assigned electrician called to inform about traffic delay.',
  hasAttachment: false,
  status: 'Under Review',
  createdAt: '07 Sep 2026, 01:45 PM',
  messages: [
  { sender: 'user', text: 'Hello, what is the status of the technician?', time: '01:45 PM' },
  { sender: 'support', text: 'Hi John, David is nearby and reaching within 10 minutes.', time: '01:47 PM' }]

}];


const initialTransactions = [
{
  id: 'tx-1',
  transactionId: 'TXN-982173491',
  bookingId: 'BB-87321',
  serviceName: 'Switchboard & MCB Tripping',
  amount: 499,
  paymentMode: 'UPI',
  status: 'Success',
  date: '07 Sep 2026',
  couponApplied: 'FIRST20'
},
{
  id: 'tx-2',
  transactionId: 'TXN-761209384',
  bookingId: 'BB-65120',
  serviceName: 'Class 10 Mathematics Tutoring',
  amount: 699,
  paymentMode: 'UPI',
  status: 'Success',
  date: '02 Sep 2026'
},
{
  id: 'tx-3',
  transactionId: 'TXN-541289473',
  bookingId: 'BB-54910',
  serviceName: 'AC Deep Cleaning',
  amount: 799,
  paymentMode: 'Card',
  status: 'Failed',
  date: '28 Aug 2026'
}];


const initialBucket = [];


const AppContext = createContext(undefined);

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(initialUser);
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [appLockEnabled, setAppLockEnabledState] = useState(false);
  const [appLockPromptShown, setAppLockPromptShownState] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [addresses, setAddresses] = useState(initialAddresses);
  const [activeAddress, setActiveAddress] = useState(initialAddresses[0]);
  const [bucket, setBucket] = useState(initialBucket);
  const [appliedCoupon, setAppliedCoupon] = useState('FIRST20');
  const [bookings, setBookings] = useState(initialBookings);
  const [supportTickets, setSupportTickets] = useState(initialTickets);
  const [transactions, setTransactions] = useState(initialTransactions);
  const [watchlist, setWatchlist] = useState([]); // New Watchlist state
  const [savedSearches, setSavedSearches] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [ads, setAds] = useState([]);

  useEffect(() => {
    const restoreSecurityPreferences = async () => {
      try {
        const [storedLock, storedPrompt] = await Promise.all([
          AsyncStorage.getItem(APP_LOCK_ENABLED_KEY),
          AsyncStorage.getItem(APP_LOCK_PROMPT_SHOWN_KEY)
        ]);
        setAppLockEnabledState(storedLock === 'true');
        setAppLockPromptShownState(storedPrompt === 'true');
      } catch (error) {
        // Security settings remain usable with in-memory defaults if storage is unavailable.
      }
    };
    restoreSecurityPreferences();
  }, []);

  const setAppLockEnabled = (enabled) => {
    setAppLockEnabledState(enabled);
    AsyncStorage.setItem(APP_LOCK_ENABLED_KEY, String(enabled)).catch(() => {});
  };

  const setAppLockPromptShown = (shown) => {
    setAppLockPromptShownState(shown);
    AsyncStorage.setItem(APP_LOCK_PROMPT_SHOWN_KEY, String(shown)).catch(() => {});
  };

  const addAd = (ad) => setAds((prev) => [ad, ...prev]);
  const updateAdStatus = (id, status) => {
    setAds((prev) => prev.map((a) => a.id === id ? { ...a, status } : a));
  };

  const requireAuth = (navigation, callback) => {
    if (isAuthenticated) {
      callback();
    } else {
      setPendingAction(() => callback);
      navigation.navigate('Login');
    }
  };

  const executePendingAction = () => {
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  const toggleWatchlist = (serviceId) => {
    setWatchlist((prev) =>
    prev.includes(serviceId) ?
    prev.filter((id) => id !== serviceId) :
    [...prev, serviceId]
    );
  };

  const addSavedSearch = (keyword) => {
    setSavedSearches((prev) => {
      if (prev.includes(keyword)) return prev;
      return [keyword, ...prev];
    });
  };

  const removeSavedSearch = (keyword) => {
    setSavedSearches((prev) => prev.filter((k) => k !== keyword));
  };

  const addRecentSearch = (keyword) => {
    setRecentSearches((prev) => {
      const filtered = prev.filter((k) => k !== keyword);
      return [keyword, ...filtered].slice(0, 10); // Keep max 10
    });
  };

  const removeRecentSearch = (keyword) => {
    setRecentSearches((prev) => prev.filter((k) => k !== keyword));
  };

  const updateUser = (updates) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };

  const addAddress = (newAddr) => {
    const id = `addr-${Date.now()}`;
    const address = { ...newAddr, id };
    if (address.isDefault) {
      setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: false })).concat(address));
      setActiveAddress(address);
    } else {
      setAddresses((prev) => [...prev, address]);
    }
  };

  const updateAddress = (id, updates) => {
    setAddresses((prev) =>
    prev.map((addr) => {
      if (addr.id === id) {
        const updated = { ...addr, ...updates };
        if (updated.isDefault) {
          setActiveAddress(updated);
        }
        return updated;
      }
      return updates.isDefault ? { ...addr, isDefault: false } : addr;
    })
    );
  };

  const deleteAddress = (id) => {
    setAddresses((prev) => {
      const filtered = prev.filter((a) => a.id !== id);
      if (activeAddress.id === id && filtered.length > 0) {
        setActiveAddress(filtered[0]);
      }
      return filtered;
    });
  };

  const setDefaultAddress = (id) => {
    setAddresses((prev) =>
    prev.map((addr) => {
      const isMatch = addr.id === id;
      if (isMatch) setActiveAddress(addr);
      return { ...addr, isDefault: isMatch };
    })
    );
  };

  const addToBucket = (item) => {
    const newItem = { ...item, id: `bkt-${Date.now()}` };
    setBucket((prev) => [...prev, newItem]);
  };

  const removeFromBucket = (id) => {
    setBucket((prev) => prev.filter((item) => item.id !== id));
  };

  const updateBucketQuantity = (id, quantity) => {
    setBucket((prev) => prev.map((item) => item.id === id ? { ...item, quantity } : item));
  };

  const clearBucket = () => {
    setBucket([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (code) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'FIRST20' || cleanCode === 'BIGBAZAAR') {
      setAppliedCoupon(cleanCode);
      return { success: true, discount: 20, message: 'Coupon applied! 20% discount added.' };
    }
    return { success: false, discount: 0, message: 'Invalid coupon code. Try FIRST20.' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const getBucketTotals = () => {
    const subtotal = bucket.reduce((sum, item) => sum + item.price * item.quantity, 0);
    let discount = 0;
    if (appliedCoupon === 'FIRST20' || appliedCoupon === 'BIGBAZAAR') {
      discount = Math.round(subtotal * 0.2);
    }
    const total = Math.max(0, subtotal - discount);
    return { subtotal, discount, total };
  };

  const createBookingFromBucket = (paymentMode) => {
    const newBookingId = `BB-${Math.floor(10000 + Math.random() * 90000)}`;
    const { total } = getBucketTotals();
    const primaryItem = bucket[0] || {
      serviceName: 'Home Service',
      subCategoryName: 'General Maintenance',
      category: 'Home Service',
      serviceDate: 'Tomorrow',
      timeSlot: '10:00 AM - 12:00 PM'
    };

    const newBooking = {
      id: `bk-${Date.now()}`,
      bookingId: newBookingId,
      serviceName: primaryItem.serviceName,
      subCategoryName: primaryItem.subCategoryName,
      category: primaryItem.categoryName || 'General',
      scheduledDate: primaryItem.serviceDate || 'Not specified',
      scheduledTimeSlot: primaryItem.timeSlot || 'Not specified',
      providerName: 'Assigned Certified Partner',
      providerContact: '+1 555-0199',
      providerRating: 4.9,
      amount: total,
      status: 'Upcoming',
      serviceAddress: `${activeAddress.houseNo}, ${activeAddress.street}, ${activeAddress.city}`,
      paymentMode
    };

    setBookings((prev) => [newBooking, ...prev]);

    // Record transaction
    const newTxn = {
      id: `tx-${Date.now()}`,
      transactionId: `TXN-${Math.floor(100000000 + Math.random() * 900000000)}`,
      bookingId: newBookingId,
      serviceName: newBooking.subCategoryName,
      amount: total,
      paymentMode,
      status: 'Success',
      date: 'Today',
      couponApplied: appliedCoupon || undefined
    };
    setTransactions((prev) => [newTxn, ...prev]);

    clearBucket();
    return newBookingId;
  };

  const createInstantBooking = (bookingData) => {
    const bookingId = `BB-${Math.floor(10000 + Math.random() * 90000)}`;
    const newBooking = {
      ...bookingData,
      id: `bk-${Date.now()}`,
      bookingId
    };
    setBookings((prev) => [newBooking, ...prev]);

    const newTxn = {
      id: `tx-${Date.now()}`,
      transactionId: `TXN-${Math.floor(100000000 + Math.random() * 900000000)}`,
      bookingId,
      serviceName: newBooking.subCategoryName,
      amount: newBooking.amount,
      paymentMode: newBooking.paymentMode,
      status: 'Success',
      date: 'Today'
    };
    setTransactions((prev) => [newTxn, ...prev]);

    return bookingId;
  };

  const cancelBooking = (id) => {
    setBookings((prev) =>
    prev.map((b) => b.id === id ? { ...b, status: 'Cancelled' } : b)
    );
  };

  const rescheduleBooking = (id, newDate, newTimeSlot) => {
    setBookings((prev) =>
    prev.map((b) =>
    b.id === id ?
    { ...b, scheduledDate: newDate, scheduledTimeSlot: newTimeSlot, status: 'Upcoming' } :
    b
    )
    );
  };

  const rateBooking = (id, rating, review) => {
    setBookings((prev) =>
    prev.map((b) => b.id === id ? { ...b, userRating: rating, userReview: review } : b)
    );
  };

  const submitSupportTicket = (
  ticketData) =>
  {
    const ticketId = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTicket = {
      ...ticketData,
      id: `tkt-${Date.now()}`,
      ticketId,
      status: 'Open',
      createdAt: 'Just now',
      messages: [
      { sender: 'user', text: ticketData.description, time: 'Just now' },
      { sender: 'support', text: 'We have received your ticket and an executive will contact you shortly.', time: 'Just now' }]

    };
    setSupportTickets((prev) => [newTicket, ...prev]);
  };

  const addTicketMessage = (ticketId, message) => {
    setSupportTickets((prev) =>
    prev.map((t) => {
      if (t.id === ticketId || t.ticketId === ticketId) {
        return {
          ...t,
          messages: [...t.messages, { sender: 'user', text: message, time: 'Just now' }]
        };
      }
      return t;
    })
    );
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated,
        setAuthenticated,
        appLockEnabled,
        setAppLockEnabled,
        appLockPromptShown,
        setAppLockPromptShown,
        pendingAction,
        requireAuth,
        executePendingAction,
        updateUser,
        addresses,
        activeAddress,
        setActiveAddress,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        bucket,
        addToBucket,
        removeFromBucket,
        updateBucketQuantity,
        clearBucket,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        getBucketTotals,
        bookings,
        createBookingFromBucket,
        createInstantBooking,
        cancelBooking,
        rescheduleBooking,
        rateBooking,
        supportTickets,
        submitSupportTicket,
        addTicketMessage,
        transactions,
        watchlist,
        toggleWatchlist,
        savedSearches,
        addSavedSearch,
        removeSavedSearch,
        recentSearches,
        addRecentSearch,
        removeRecentSearch,
        ads,
        addAd,
        updateAdStatus
      }}>
      
      {children}
    </AppContext.Provider>);

};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
