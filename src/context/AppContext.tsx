import React, { createContext, useContext, useState } from 'react';

export type UserRole = 'Buyer' | 'Seller/Tutor';
export type Gender = 'Male' | 'Female' | 'Other';
export type AddressType = 'Home' | 'Office' | 'Other';
export type BookingStatus = 'Upcoming' | 'In-Progress' | 'Completed' | 'Cancelled';
export type PaymentStatus = 'Success' | 'Failed' | 'Pending';
export type PaymentMode = 'UPI' | 'Card' | 'NetBanking' | 'Cash on Delivery';
export type TicketIssueCategory = 'Service Delay' | 'Tutor Conduct' | 'Payment Failure' | 'App Issue';

export interface UserProfile {
  fullName: string;
  mobileNumber: string;
  email: string; // Read-only
  gender: Gender;
  role: UserRole;
  profilePicture?: string;
}

export interface AddressItem {
  id: string;
  type: AddressType;
  houseNo: string;
  street: string;
  landmark: string;
  city: string;
  pincode: string;
  isDefault: boolean;
  coordinates?: { latitude: number; longitude: number };
}

export interface BucketItem {
  id: string;
  serviceId: string;
  serviceName: string;
  categoryName: string;
  subCategoryName: string;
  price: number;
  timeSlot: string;
  serviceDate: string;
  paymentChoice: 'Prepaid' | 'Cash on Delivery';
  problemDescription?: string;
  quantity: number;
}

export interface BookingItem {
  id: string;
  bookingId: string;
  serviceName: string;
  subCategoryName: string;
  category: string;
  scheduledDate: string;
  scheduledTimeSlot: string;
  providerName: string;
  providerContact: string;
  providerRating: number;
  amount: number;
  status: BookingStatus;
  serviceAddress: string;
  paymentMode: PaymentMode;
  userRating?: number;
  userReview?: string;
}

export interface SupportTicket {
  id: string;
  ticketId: string;
  issueCategory: TicketIssueCategory;
  bookingId: string;
  subject: string;
  description: string;
  hasAttachment: boolean;
  status: 'Open' | 'Under Review' | 'Resolved';
  createdAt: string;
  messages: Array<{ sender: 'user' | 'support'; text: string; time: string }>;
}

export interface TransactionItem {
  id: string;
  transactionId: string;
  bookingId: string;
  serviceName: string;
  amount: number;
  paymentMode: PaymentMode;
  status: PaymentStatus;
  date: string;
  couponApplied?: string;
}

interface AppContextType {
  // User Profile (Module 1)
  user: UserProfile;
  updateUser: (updates: Partial<UserProfile>) => void;

  // Address Management (Module 2)
  addresses: AddressItem[];
  activeAddress: AddressItem;
  setActiveAddress: (address: AddressItem) => void;
  addAddress: (address: Omit<AddressItem, 'id'>) => void;
  updateAddress: (id: string, updates: Partial<AddressItem>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;

  // Bucket / Cart
  bucket: BucketItem[];
  addToBucket: (item: Omit<BucketItem, 'id'>) => void;
  removeFromBucket: (id: string) => void;
  clearBucket: () => void;
  appliedCoupon: string | null;
  applyCoupon: (code: string) => { success: boolean; discount: number; message: string };
  removeCoupon: () => void;
  getBucketTotals: () => { subtotal: number; discount: number; total: number };

  // My Bookings (Module 4)
  bookings: BookingItem[];
  createBookingFromBucket: (paymentMode: PaymentMode) => string;
  createInstantBooking: (booking: Omit<BookingItem, 'id' | 'bookingId'>) => string;
  cancelBooking: (id: string) => void;
  rescheduleBooking: (id: string, newDate: string, newTimeSlot: string) => void;
  rateBooking: (id: string, rating: number, review: string) => void;

  // Help & Support (Module 5)
  supportTickets: SupportTicket[];
  submitSupportTicket: (ticket: Omit<SupportTicket, 'id' | 'ticketId' | 'status' | 'createdAt' | 'messages'>) => void;
  addTicketMessage: (ticketId: string, message: string) => void;

  // Payment History (Module 3)
  transactions: TransactionItem[];
  // Watchlist (New Feature)
  watchlist: string[]; // Array of service IDs
  toggleWatchlist: (serviceId: string) => void;

  // Saved Searches
  savedSearches: string[];
  addSavedSearch: (keyword: string) => void;
  removeSavedSearch: (keyword: string) => void;

  // Recent Searches
  recentSearches: string[];
  addRecentSearch: (keyword: string) => void;
  removeRecentSearch: (keyword: string) => void;
}

const initialUser: UserProfile = {
  fullName: 'Rahul Sharma',
  mobileNumber: '+91 98765 43210',
  email: 'rahul.sharma@example.com',
  gender: 'Male',
  role: 'Buyer',
};

const initialAddresses: AddressItem[] = [
  {
    id: 'addr-1',
    type: 'Home',
    houseNo: 'Flat 402, Sunshine Heights',
    street: '12th Main, HAL 2nd Stage',
    landmark: 'Near Indiranagar Metro',
    city: 'Bengaluru',
    pincode: '560038',
    isDefault: true,
  },
  {
    id: 'addr-2',
    type: 'Office',
    houseNo: 'Tech Park Tower B, 3rd Floor',
    street: 'Outer Ring Road, Bellandur',
    landmark: 'Opposite EcoSpace',
    city: 'Bengaluru',
    pincode: '560103',
    isDefault: false,
  },
];

const initialBookings: BookingItem[] = [
  {
    id: 'bk-1',
    bookingId: 'BB-98421',
    serviceName: 'Plumber',
    subCategoryName: 'Tap Leakage & Valve Repair',
    category: 'Plumber',
    scheduledDate: 'Tomorrow, 10 Sep',
    scheduledTimeSlot: '10:00 AM - 12:00 PM',
    providerName: 'Ramesh Kumar (Certified Plumber)',
    providerContact: '+91 91234 56789',
    providerRating: 4.8,
    amount: 349,
    status: 'Upcoming',
    serviceAddress: 'Flat 402, Sunshine Heights, Indiranagar',
    paymentMode: 'Cash on Delivery',
  },
  {
    id: 'bk-2',
    bookingId: 'BB-87321',
    serviceName: 'Electrician',
    subCategoryName: 'Switchboard & MCB Tripping',
    category: 'Electrician',
    scheduledDate: 'Today',
    scheduledTimeSlot: '02:00 PM - 04:00 PM',
    providerName: 'Suresh Patel',
    providerContact: '+91 98765 12345',
    providerRating: 4.9,
    amount: 499,
    status: 'In-Progress',
    serviceAddress: 'Flat 402, Sunshine Heights, Indiranagar',
    paymentMode: 'UPI',
  },
  {
    id: 'bk-3',
    bookingId: 'BB-65120',
    serviceName: 'Home Tutor',
    subCategoryName: 'Class 10 Mathematics (1-on-1)',
    category: 'Tutor',
    scheduledDate: '02 Sep 2026',
    scheduledTimeSlot: '05:00 PM - 06:30 PM',
    providerName: 'Dr. Anita Roy (M.Sc, B.Ed)',
    providerContact: '+91 94567 89012',
    providerRating: 5.0,
    amount: 699,
    status: 'Completed',
    serviceAddress: 'Flat 402, Sunshine Heights, Indiranagar',
    paymentMode: 'UPI',
    userRating: 5,
    userReview: 'Excellent teacher! Cleared all geometry concepts clearly.',
  },
];

const initialTickets: SupportTicket[] = [
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
      { sender: 'support', text: 'Hi Rahul, Suresh is nearby and reaching within 10 minutes.', time: '01:47 PM' },
    ],
  },
];

const initialTransactions: TransactionItem[] = [
  {
    id: 'tx-1',
    transactionId: 'TXN-982173491',
    bookingId: 'BB-87321',
    serviceName: 'Switchboard & MCB Tripping',
    amount: 499,
    paymentMode: 'UPI',
    status: 'Success',
    date: '07 Sep 2026',
    couponApplied: 'FIRST20',
  },
  {
    id: 'tx-2',
    transactionId: 'TXN-761209384',
    bookingId: 'BB-65120',
    serviceName: 'Class 10 Mathematics Tutoring',
    amount: 699,
    paymentMode: 'UPI',
    status: 'Success',
    date: '02 Sep 2026',
  },
  {
    id: 'tx-3',
    transactionId: 'TXN-541289473',
    bookingId: 'BB-54910',
    serviceName: 'AC Deep Cleaning',
    amount: 799,
    paymentMode: 'Card',
    status: 'Failed',
    date: '28 Aug 2026',
  },
];

const initialBucket: BucketItem[] = [
  {
    id: 'bkt-1',
    serviceId: 'srv-101',
    serviceName: 'Plumber',
    categoryName: 'Plumbing',
    subCategoryName: 'Tap Repair & Washbasin Fix',
    price: 299,
    timeSlot: '10:00 AM - 12:00 PM',
    serviceDate: 'Tomorrow, 08 Sep',
    paymentChoice: 'Prepaid',
    quantity: 1,
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(initialUser);
  const [addresses, setAddresses] = useState<AddressItem[]>(initialAddresses);
  const [activeAddress, setActiveAddress] = useState<AddressItem>(initialAddresses[0]);
  const [bucket, setBucket] = useState<BucketItem[]>(initialBucket);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>('FIRST20');
  const [bookings, setBookings] = useState<BookingItem[]>(initialBookings);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(initialTickets);
  const [transactions, setTransactions] = useState<TransactionItem[]>(initialTransactions);
  const [watchlist, setWatchlist] = useState<string[]>([]); // New Watchlist state
  const [savedSearches, setSavedSearches] = useState<string[]>([]); 
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const toggleWatchlist = (serviceId: string) => {
    setWatchlist((prev) => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const addSavedSearch = (keyword: string) => {
    setSavedSearches((prev) => {
      if (prev.includes(keyword)) return prev;
      return [keyword, ...prev];
    });
  };

  const removeSavedSearch = (keyword: string) => {
    setSavedSearches((prev) => prev.filter((k) => k !== keyword));
  };

  const addRecentSearch = (keyword: string) => {
    setRecentSearches((prev) => {
      const filtered = prev.filter((k) => k !== keyword);
      return [keyword, ...filtered].slice(0, 10); // Keep max 10
    });
  };

  const removeRecentSearch = (keyword: string) => {
    setRecentSearches((prev) => prev.filter((k) => k !== keyword));
  };

  const updateUser = (updates: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };

  const addAddress = (newAddr: Omit<AddressItem, 'id'>) => {
    const id = `addr-${Date.now()}`;
    const address: AddressItem = { ...newAddr, id };
    if (address.isDefault) {
      setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: false })).concat(address));
      setActiveAddress(address);
    } else {
      setAddresses((prev) => [...prev, address]);
    }
  };

  const updateAddress = (id: string, updates: Partial<AddressItem>) => {
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

  const deleteAddress = (id: string) => {
    setAddresses((prev) => {
      const filtered = prev.filter((a) => a.id !== id);
      if (activeAddress.id === id && filtered.length > 0) {
        setActiveAddress(filtered[0]);
      }
      return filtered;
    });
  };

  const setDefaultAddress = (id: string) => {
    setAddresses((prev) =>
      prev.map((addr) => {
        const isMatch = addr.id === id;
        if (isMatch) setActiveAddress(addr);
        return { ...addr, isDefault: isMatch };
      })
    );
  };

  const addToBucket = (item: Omit<BucketItem, 'id'>) => {
    const newItem: BucketItem = { ...item, id: `bkt-${Date.now()}` };
    setBucket((prev) => [...prev, newItem]);
  };

  const removeFromBucket = (id: string) => {
    setBucket((prev) => prev.filter((item) => item.id !== id));
  };

  const clearBucket = () => {
    setBucket([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (code: string) => {
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

  const createBookingFromBucket = (paymentMode: PaymentMode) => {
    const newBookingId = `BB-${Math.floor(10000 + Math.random() * 90000)}`;
    const { total } = getBucketTotals();
    const primaryItem = bucket[0] || {
      serviceName: 'Home Service',
      subCategoryName: 'General Maintenance',
      category: 'Home Service',
      serviceDate: 'Tomorrow',
      timeSlot: '10:00 AM - 12:00 PM',
    };

    const newBooking: BookingItem = {
      id: `bk-${Date.now()}`,
      bookingId: newBookingId,
      serviceName: primaryItem.serviceName,
      subCategoryName: primaryItem.subCategoryName,
      category: primaryItem.categoryName || 'General',
      scheduledDate: primaryItem.serviceDate,
      scheduledTimeSlot: primaryItem.timeSlot,
      providerName: 'Assigned Certified Partner',
      providerContact: '+91 98888 77777',
      providerRating: 4.9,
      amount: total,
      status: 'Upcoming',
      serviceAddress: `${activeAddress.houseNo}, ${activeAddress.street}, ${activeAddress.city}`,
      paymentMode,
    };

    setBookings((prev) => [newBooking, ...prev]);

    // Record transaction
    const newTxn: TransactionItem = {
      id: `tx-${Date.now()}`,
      transactionId: `TXN-${Math.floor(100000000 + Math.random() * 900000000)}`,
      bookingId: newBookingId,
      serviceName: newBooking.subCategoryName,
      amount: total,
      paymentMode,
      status: 'Success',
      date: 'Today',
      couponApplied: appliedCoupon || undefined,
    };
    setTransactions((prev) => [newTxn, ...prev]);

    clearBucket();
    return newBookingId;
  };

  const createInstantBooking = (bookingData: Omit<BookingItem, 'id' | 'bookingId'>) => {
    const bookingId = `BB-${Math.floor(10000 + Math.random() * 90000)}`;
    const newBooking: BookingItem = {
      ...bookingData,
      id: `bk-${Date.now()}`,
      bookingId,
    };
    setBookings((prev) => [newBooking, ...prev]);

    const newTxn: TransactionItem = {
      id: `tx-${Date.now()}`,
      transactionId: `TXN-${Math.floor(100000000 + Math.random() * 900000000)}`,
      bookingId,
      serviceName: newBooking.subCategoryName,
      amount: newBooking.amount,
      paymentMode: newBooking.paymentMode,
      status: 'Success',
      date: 'Today',
    };
    setTransactions((prev) => [newTxn, ...prev]);

    return bookingId;
  };

  const cancelBooking = (id: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: 'Cancelled' as BookingStatus } : b))
    );
  };

  const rescheduleBooking = (id: string, newDate: string, newTimeSlot: string) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === id
          ? { ...b, scheduledDate: newDate, scheduledTimeSlot: newTimeSlot, status: 'Upcoming' as BookingStatus }
          : b
      )
    );
  };

  const rateBooking = (id: string, rating: number, review: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, userRating: rating, userReview: review } : b))
    );
  };

  const submitSupportTicket = (
    ticketData: Omit<SupportTicket, 'id' | 'ticketId' | 'status' | 'createdAt' | 'messages'>
  ) => {
    const ticketId = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTicket: SupportTicket = {
      ...ticketData,
      id: `tkt-${Date.now()}`,
      ticketId,
      status: 'Open',
      createdAt: 'Just now',
      messages: [
        { sender: 'user', text: ticketData.description, time: 'Just now' },
        { sender: 'support', text: 'We have received your ticket and an executive will contact you shortly.', time: 'Just now' },
      ],
    };
    setSupportTickets((prev) => [newTicket, ...prev]);
  };

  const addTicketMessage = (ticketId: string, message: string) => {
    setSupportTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId || t.ticketId === ticketId) {
          return {
            ...t,
            messages: [...t.messages, { sender: 'user', text: message, time: 'Just now' }],
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
