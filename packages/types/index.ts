// Shared Types for the BigBazaar Platform

export type Role = 'guest' | 'buyer' | 'seller' | 'provider' | 'moderator' | 'admin' | 'super_admin';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  role: Role;
  avatarUrl?: string;
  createdAt: string;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  condition?: string;
  sellerId: string;
  images: string[];
  createdAt: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  providerId: string;
  category: string;
  basePrice: number;
  images: string[];
}
