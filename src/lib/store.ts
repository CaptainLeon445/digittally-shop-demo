'use client';

import type {
  User, Shop, Product, Order, SalesRep,
  WalletTransaction, WalletSummary, PaymentLink,
} from '@/types';
import {
  DUMMY_USER, DUMMY_SHOPS, DUMMY_PRODUCTS, DUMMY_ORDERS,
  DUMMY_REPS, DUMMY_TRANSACTIONS, WALLET_SUMMARY, DUMMY_PAYMENT_LINKS,
} from './dummy-data';

const AUTH_KEY = 'dt_auth_user';
const SEED_VERSION = '2'; // bump this when dummy-data changes significantly
const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

// Clears all seed-data keys so fresh dummy data is reloaded on next access
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('dt_seed_version');
  if (stored !== SEED_VERSION) {
    ['dt_shops', 'dt_products', 'dt_orders', 'dt_reps', 'dt_transactions', 'dt_payment_links'].forEach(
      (k) => localStorage.removeItem(k),
    );
    localStorage.setItem('dt_seed_version', SEED_VERSION);
  }
}

function load<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, value: T) {
  if (typeof window !== 'undefined') localStorage.setItem(key, JSON.stringify(value));
}

// ── Auth ────────────────────────────────────────────────────────
export const authStore = {
  login: async (email: string, _password: string): Promise<User> => {
    await delay();
    if (!email.includes('@')) throw new Error('Invalid email address');
    const user = { ...DUMMY_USER, email };
    save(AUTH_KEY, user);
    return user;
  },

  signup: async (data: { email: string; name: string; businessName: string; password: string }): Promise<User> => {
    await delay(600);
    const user: User = {
      id: 'usr_' + Date.now(),
      email: data.email,
      name: data.name,
      businessName: data.businessName,
      plan: 'starter',
      createdAt: new Date().toISOString(),
    };
    save(AUTH_KEY, user);
    return user;
  },

  getUser: (): User | null => load<User | null>(AUTH_KEY, null),

  logout: () => {
    if (typeof window !== 'undefined') localStorage.removeItem(AUTH_KEY);
  },

  forgotPassword: async (email: string): Promise<void> => {
    await delay(800);
    if (!email.includes('@')) throw new Error('Invalid email');
  },

  resetPassword: async (_token: string, _password: string): Promise<void> => {
    await delay(600);
  },
};

// ── Shops ───────────────────────────────────────────────────────
export const shopsStore = {
  list: async (): Promise<Shop[]> => {
    await delay(350);
    return load<Shop[]>('dt_shops', DUMMY_SHOPS);
  },

  get: async (id: string): Promise<Shop> => {
    await delay(300);
    const shops = load<Shop[]>('dt_shops', DUMMY_SHOPS);
    const shop = shops.find((s) => s.id === id);
    if (!shop) throw new Error('Shop not found');
    return shop;
  },

  getBySlug: async (slug: string): Promise<Shop> => {
    await delay(300);
    const shops = load<Shop[]>('dt_shops', DUMMY_SHOPS);
    const shop = shops.find((s) => s.slug === slug);
    if (!shop) throw new Error('Shop not found');
    return shop;
  },

  create: async (data: Partial<Shop>): Promise<Shop> => {
    await delay(600);
    const shops = load<Shop[]>('dt_shops', DUMMY_SHOPS);
    const shop: Shop = {
      id: 'shop_' + Date.now(),
      type: data.type ?? 'online_vendor',
      name: data.name ?? 'New Shop',
      slug: data.slug ?? 'new-shop-' + Date.now(),
      description: data.description,
      currency: data.currency ?? 'NGN',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      businessName: data.businessName,
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone,
      logoUrl: data.logoUrl,
      bannerUrl: data.bannerUrl,
      bookingEnabled: data.type !== 'online_vendor',
      bookingSlotMinutes: data.type === 'consultation' ? 60 : 1440,
      bookingAdvanceDays: 30,
      theme: data.theme ?? {
        primaryColor: '#0b7d8e',
        accentColor: '#f59e0b',
        heroHeadline: `Welcome to ${data.name ?? 'Our Shop'}`,
        heroSubtext: data.description ?? 'Browse our collection and place your order.',
        heroCtaText: data.type === 'consultation' ? 'Book Now' : data.type === 'hospitality' ? 'Reserve Now' : 'Shop Now',
      },
    };
    save('dt_shops', [...shops, shop]);
    return shop;
  },

  update: async (id: string, data: Partial<Shop>): Promise<Shop> => {
    await delay(500);
    const shops = load<Shop[]>('dt_shops', DUMMY_SHOPS);
    const idx = shops.findIndex((s) => s.id === id);
    if (idx === -1) throw new Error('Shop not found');
    const updated = { ...shops[idx], ...data, updatedAt: new Date().toISOString() };
    shops[idx] = updated;
    save('dt_shops', shops);
    return updated;
  },

  delete: async (id: string): Promise<void> => {
    await delay(400);
    const shops = load<Shop[]>('dt_shops', DUMMY_SHOPS);
    save('dt_shops', shops.filter((s) => s.id !== id));
  },

  checkSlug: async (slug: string): Promise<boolean> => {
    await delay(300);
    const shops = load<Shop[]>('dt_shops', DUMMY_SHOPS);
    return !shops.some((s) => s.slug === slug);
  },
};

// ── Products ─────────────────────────────────────────────────────
export const productsStore = {
  list: async (shopId: string): Promise<Product[]> => {
    await delay(350);
    const products = load<Product[]>('dt_products', DUMMY_PRODUCTS);
    return products.filter((p) => p.shopId === shopId);
  },

  get: async (id: string): Promise<Product> => {
    await delay(250);
    const products = load<Product[]>('dt_products', DUMMY_PRODUCTS);
    const product = products.find((p) => p.id === id);
    if (!product) throw new Error('Product not found');
    return product;
  },

  create: async (shopId: string, data: Partial<Product>): Promise<Product> => {
    await delay(500);
    const products = load<Product[]>('dt_products', DUMMY_PRODUCTS);
    const product: Product = {
      id: 'prod_' + Date.now(),
      shopId,
      title: data.title ?? 'New Product',
      description: data.description,
      images: data.images ?? [],
      price: data.price ?? 0,
      comparePrice: data.comparePrice,
      currency: data.currency ?? 'NGN',
      unit: data.unit,
      sku: data.sku,
      stock: data.stock ?? 0,
      status: data.status ?? 'draft',
      variants: data.variants ?? [],
      category: data.category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    save('dt_products', [...products, product]);
    return product;
  },

  update: async (id: string, data: Partial<Product>): Promise<Product> => {
    await delay(450);
    const products = load<Product[]>('dt_products', DUMMY_PRODUCTS);
    const idx = products.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error('Product not found');
    const updated = { ...products[idx], ...data, updatedAt: new Date().toISOString() };
    products[idx] = updated;
    save('dt_products', products);
    return updated;
  },

  delete: async (id: string): Promise<void> => {
    await delay(350);
    const products = load<Product[]>('dt_products', DUMMY_PRODUCTS);
    save('dt_products', products.filter((p) => p.id !== id));
  },
};

// ── Orders ───────────────────────────────────────────────────────
export const ordersStore = {
  list: async (shopId: string): Promise<Order[]> => {
    await delay(400);
    const orders = load<Order[]>('dt_orders', DUMMY_ORDERS);
    return orders.filter((o) => o.shopId === shopId).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  get: async (id: string): Promise<Order> => {
    await delay(300);
    const orders = load<Order[]>('dt_orders', DUMMY_ORDERS);
    const order = orders.find((o) => o.id === id);
    if (!order) throw new Error('Order not found');
    return order;
  },

  updateStatus: async (id: string, status: Order['status']): Promise<Order> => {
    await delay(400);
    const orders = load<Order[]>('dt_orders', DUMMY_ORDERS);
    const idx = orders.findIndex((o) => o.id === id);
    if (idx === -1) throw new Error('Order not found');
    orders[idx] = { ...orders[idx], status, updatedAt: new Date().toISOString() };
    save('dt_orders', orders);
    return orders[idx];
  },
};

// ── Reps ─────────────────────────────────────────────────────────
export const repsStore = {
  list: async (shopId: string): Promise<SalesRep[]> => {
    await delay(350);
    const reps = load<SalesRep[]>('dt_reps', DUMMY_REPS);
    return reps.filter((r) => r.shopId === shopId);
  },

  invite: async (shopId: string, data: Partial<SalesRep>): Promise<SalesRep> => {
    await delay(500);
    const reps = load<SalesRep[]>('dt_reps', DUMMY_REPS);
    const rep: SalesRep = {
      id: 'rep_' + Date.now(),
      shopId,
      name: data.name ?? '',
      email: data.email ?? '',
      phone: data.phone,
      whatsappNumber: data.whatsappNumber,
      role: data.role ?? 'rep',
      status: 'pending',
      alertsEnabled: data.alertsEnabled ?? true,
      totalOrders: 0,
      revenue: 0,
      inviteCode: 'INV-' + Math.random().toString(36).toUpperCase().slice(2, 8),
      createdAt: new Date().toISOString(),
    };
    save('dt_reps', [...reps, rep]);
    return rep;
  },

  update: async (id: string, data: Partial<SalesRep>): Promise<SalesRep> => {
    await delay(400);
    const reps = load<SalesRep[]>('dt_reps', DUMMY_REPS);
    const idx = reps.findIndex((r) => r.id === id);
    if (idx === -1) throw new Error('Rep not found');
    reps[idx] = { ...reps[idx], ...data };
    save('dt_reps', reps);
    return reps[idx];
  },

  remove: async (id: string): Promise<void> => {
    await delay(350);
    const reps = load<SalesRep[]>('dt_reps', DUMMY_REPS);
    save('dt_reps', reps.filter((r) => r.id !== id));
  },
};

// ── Wallet ───────────────────────────────────────────────────────
export const walletStore = {
  getSummary: async (shopId: string): Promise<WalletSummary> => {
    await delay(300);
    return WALLET_SUMMARY[shopId] ?? { balance: 0, totalEarned: 0, totalWithdrawn: 0, pendingAmount: 0, currency: 'NGN' };
  },

  getTransactions: async (shopId: string): Promise<WalletTransaction[]> => {
    await delay(400);
    const txns = load<WalletTransaction[]>('dt_transactions', DUMMY_TRANSACTIONS);
    return txns.filter((t) => t.shopId === shopId).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  withdraw: async (shopId: string, amount: number): Promise<void> => {
    await delay(800);
    const txns = load<WalletTransaction[]>('dt_transactions', DUMMY_TRANSACTIONS);
    const txn: WalletTransaction = {
      id: 'txn_' + Date.now(),
      shopId,
      type: 'withdrawal',
      amount,
      currency: 'NGN',
      description: 'Manual withdrawal',
      reference: 'WDR-' + Date.now(),
      status: 'success',
      createdAt: new Date().toISOString(),
    };
    save('dt_transactions', [...txns, txn]);
  },
};

// ── Payment Links ────────────────────────────────────────────────
export const paymentLinksStore = {
  list: async (shopId: string): Promise<PaymentLink[]> => {
    await delay(350);
    const links = load<PaymentLink[]>('dt_payment_links', DUMMY_PAYMENT_LINKS);
    return links.filter((l) => l.shopId === shopId);
  },

  create: async (shopId: string, data: Partial<PaymentLink>): Promise<PaymentLink> => {
    await delay(500);
    const links = load<PaymentLink[]>('dt_payment_links', DUMMY_PAYMENT_LINKS);
    const link: PaymentLink = {
      id: 'pl_' + Date.now(),
      shopId,
      title: data.title ?? 'Payment Link',
      description: data.description,
      amount: data.amount ?? 0,
      currency: data.currency ?? 'NGN',
      slug: data.slug ?? 'link-' + Date.now(),
      isActive: true,
      allowCustomAmount: data.allowCustomAmount ?? false,
      maxUses: data.maxUses,
      uses: 0,
      expiresAt: data.expiresAt,
      createdAt: new Date().toISOString(),
    };
    save('dt_payment_links', [...links, link]);
    return link;
  },

  toggle: async (id: string, isActive: boolean): Promise<void> => {
    await delay(300);
    const links = load<PaymentLink[]>('dt_payment_links', DUMMY_PAYMENT_LINKS);
    const idx = links.findIndex((l) => l.id === id);
    if (idx !== -1) {
      links[idx] = { ...links[idx], isActive };
      save('dt_payment_links', links);
    }
  },

  delete: async (id: string): Promise<void> => {
    await delay(350);
    const links = load<PaymentLink[]>('dt_payment_links', DUMMY_PAYMENT_LINKS);
    save('dt_payment_links', links.filter((l) => l.id !== id));
  },
};
