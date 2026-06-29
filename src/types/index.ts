export type ShopType = 'online_vendor' | 'consultation' | 'hospitality' | 'service';
export type ShopStatus = 'active' | 'inactive' | 'suspended';
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
export type RepRole = 'manager' | 'rep' | 'support';
export type RepStatus = 'active' | 'inactive' | 'pending';
export type PlanTier = 'starter' | 'growth' | 'scale';
export type MeetingType = 'in_person' | 'virtual' | 'both';

// ── Auth ────────────────────────────────────────────────────────
export interface User {
  id: string;
  email: string;
  name: string;
  businessName: string;
  phone?: string;
  avatar?: string;
  plan: PlanTier;
  createdAt: string;
}

// ── Shop ────────────────────────────────────────────────────────
export interface Shop {
  id: string;
  type: ShopType;
  name: string;
  slug: string;
  description?: string;
  currency: string;
  status: ShopStatus;
  createdAt: string;
  updatedAt: string;
  // Customisation
  theme: ShopTheme;
  logoUrl?: string;
  bannerUrl?: string;
  businessName?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  socialLinks?: SocialLinks;

  // Booking (consultation / hospitality / service)
  bookingEnabled?: boolean;
  bookingSlotMinutes?: number;
  bookingAdvanceDays?: number;
  availableHours?: { start: string; end: string };
  availableDays?: number[]; // 0=Sun … 6=Sat

  // Consultation / service
  calendlyUrl?: string;
  meetingLink?: string; // Zoom / Google Meet
  maxDailyBookings?: number;

  // Hospitality
  checkInTime?: string;  // e.g. "14:00"
  checkOutTime?: string; // e.g. "11:00"
  minStayNights?: number;
  houseRules?: string;
  featuredAmenities?: string[];
  restaurantMode?: boolean; // true → food menu + table ordering flow instead of room bookings
}

export interface ShopTheme {
  primaryColor: string;
  accentColor: string;
  heroHeadline: string;
  heroSubtext: string;
  heroCtaText: string;
}

export interface SocialLinks {
  instagram?: string;
  twitter?: string;
  facebook?: string;
  whatsapp?: string;
  tiktok?: string;
}

// ── Inventory / Products ─────────────────────────────────────────
// "Product" covers all types: physical product, service, room, etc.
export interface Product {
  id: string;
  shopId: string;
  title: string;
  description?: string;
  images: string[];
  price: number;
  comparePrice?: number;
  currency: string;
  unit?: string;       // piece / session / night / hour …
  sku?: string;
  stock: number;       // qty for vendor; rooms available for hospitality; 999 for unlimited services
  status: 'active' | 'draft' | 'archived';
  variants: ProductVariant[];
  category?: string;
  createdAt: string;
  updatedAt: string;

  // ── Service / consultation / hospitality extras ──────────────
  duration?: number;        // minutes (consultation / service)
  meetingType?: MeetingType; // in_person | virtual | both
  meetingLink?: string;     // per-service Zoom / Meet link
  capacity?: number;        // max guests (hospitality rooms)
  amenities?: string[];     // room amenities
  serviceArea?: string;     // geographic coverage (service shops)
}

export interface ProductVariant {
  id: string;
  name: string;
  options: VariantOption[];
}

export interface VariantOption {
  id: string;
  label: string;
  priceModifier: number;
  stock: number;
}

// ── Orders ───────────────────────────────────────────────────────
export interface Order {
  id: string;
  orderNumber: string;
  shopId: string;
  status: OrderStatus;
  customer: Customer;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  currency: string;
  paymentReference?: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  notes?: string;
  trackingNumber?: string;
  repId?: string;
  createdAt: string;
  updatedAt: string;
  bookingDate?: string;
  bookingTime?: string;
  bookingService?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  totalOrders?: number;
  totalSpent?: number;
}

export interface OrderItem {
  id: string;
  productId: string;
  productTitle: string;
  variant?: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

// ── Sales Reps ───────────────────────────────────────────────────
export interface SalesRep {
  id: string;
  shopId: string;
  name: string;
  email: string;
  phone?: string;
  whatsappNumber?: string;
  role: RepRole;
  status: RepStatus;
  alertsEnabled: boolean;
  avatar?: string;
  totalOrders?: number;
  revenue?: number;
  inviteCode?: string;
  joinedAt?: string;
  createdAt: string;
}

// ── Wallet ───────────────────────────────────────────────────────
export interface WalletTransaction {
  id: string;
  shopId: string;
  type: 'credit' | 'debit' | 'withdrawal' | 'fee';
  amount: number;
  currency: string;
  description: string;
  reference: string;
  orderId?: string;
  status: 'pending' | 'success' | 'failed';
  createdAt: string;
}

export interface WalletSummary {
  balance: number;
  totalEarned: number;
  totalWithdrawn: number;
  pendingAmount: number;
  currency: string;
}

// ── Billing ──────────────────────────────────────────────────────
export interface Plan {
  id: PlanTier;
  name: string;
  price: number;
  currency: string;
  billingCycle: 'monthly' | 'yearly';
  limits: PlanLimits;
  features: string[];
}

export interface PlanLimits {
  shops: number;
  productsPerShop: number;
  repsPerShop: number;
  ordersPerMonth: number;
  paymentLinks: number;
}

export interface Subscription {
  planId: PlanTier;
  status: 'active' | 'past_due' | 'cancelled' | 'trialing';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  shopCount: number;
  productCount: number;
  repCount: number;
  nextBillingAmount: number;
}

// ── Payment Links ────────────────────────────────────────────────
export interface PaymentLink {
  id: string;
  shopId: string;
  title: string;
  description?: string;
  amount: number;
  currency: string;
  slug: string;
  isActive: boolean;
  allowCustomAmount: boolean;
  maxUses?: number;
  uses: number;
  expiresAt?: string;
  createdAt: string;
}

// ── Booking slot ──────────────────────────────────────────────────
export interface BookingSlot {
  date: string;
  time: string;
  available: boolean;
  bookingId?: string;
}
