export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  plan: string;
  challenge: string;
  day: number;
  progress: number;
  status: string;
  streak: number;
  joinedDate: string;
  startDate: string;
  endDate: string;
  about: string;
  couponUsed: string | null;
}

export interface Subscription {
  id: number;
  userId: number;
  userName: string;
  plan: string;
  status: string;
  startDate: string;
  endDate: string;
  couponCode: string | null;
  device_type: string;
}

export interface Coupon {
  id: number;
  code: string;
  discount: number;
  type: string;
  status: string;
  usageCount: number;
  usageLimit: number;
  startDate: string;
  expiryDate: string;
  description: string;
  deviceTypes: string[];
}

export interface AuthUser {
  name: string;
  role: string;
  email: string;
}
