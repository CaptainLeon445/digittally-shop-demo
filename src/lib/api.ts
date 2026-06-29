import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9628';
const INVOICE_BASE_URL = process.env.NEXT_PUBLIC_INVOICE_API_URL || 'http://localhost:3001';

const TOKEN_KEY = 'dgt_dev_token';
const BRANCH_KEY = 'dgt_branch_id';

const api = axios.create({ baseURL: BASE_URL, withCredentials: true });
const invoiceApi = axios.create({ baseURL: INVOICE_BASE_URL, withCredentials: true });

const authInterceptor = (config: any) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

api.interceptors.request.use(authInterceptor);
invoiceApi.interceptors.request.use(authInterceptor);

export const saveToken = (token: string) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(BRANCH_KEY);
};
export const getToken = () =>
  typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
export const getCurrentBranchId = () =>
  typeof window !== 'undefined' ? localStorage.getItem(BRANCH_KEY) : null;

const extractDevToken = (data: any) => data?.data?.devToken ?? data?.devToken;
const extractBranchId = (data: any): string | null => {
  const branches: { id: string; default?: boolean }[] = data?.data?.branches ?? data?.branches ?? [];
  return branches.find((b) => b.default)?.id ?? branches[0]?.id ?? null;
};

// Auth
export const authApi = {
  login: async (email: string, password: string) => {
    const res = await api.post('/api/v1/account/auth/login', { email, password });
    const token = extractDevToken(res.data);
    if (token) saveToken(token);
    const branchId = extractBranchId(res.data);
    if (branchId) localStorage.setItem(BRANCH_KEY, branchId);
    return res.data;
  },
  me: () => api.get('/api/v1/account').then((r) => r.data),
  switchBranch: async (branchId: string) => {
    const res = await api.post('/api/v1/account/organizations/switch-branch', { branchId });
    const token = extractDevToken(res.data);
    if (token) saveToken(token);
    localStorage.setItem(BRANCH_KEY, branchId);
    return res.data;
  },
  logout: () => {
    clearToken();
    return api.post('/api/v1/account/auth/logout').then((r) => r.data);
  },
};

// Shops
export const shopsApi = {
  list: () => invoiceApi.get('/api/v1/shops').then((r) => r.data.data),
  create: (data: any) => invoiceApi.post('/api/v1/shops', data).then((r) => r.data.data),
  get: (shopId: string) => invoiceApi.get(`/api/v1/shops/${shopId}`).then((r) => r.data.data),
  update: (shopId: string, data: any) =>
    invoiceApi.put(`/api/v1/shops/${shopId}`, data).then((r) => r.data.data),
  delete: (shopId: string) => invoiceApi.delete(`/api/v1/shops/${shopId}`).then((r) => r.data),
  checkSlug: (slug: string) =>
    invoiceApi.get(`/api/v1/shops/slug-check?slug=${slug}`).then((r) => r.data.data),
  getOrders: (shopId: string, params?: any) =>
    invoiceApi.get(`/api/v1/shops/${shopId}/orders`, { params }).then((r) => r.data.data),
  getWallet: (shopId: string, params?: any) =>
    invoiceApi.get(`/api/v1/shops/${shopId}/wallet`, { params }).then((r) => r.data.data),
  getReps: (shopId: string) =>
    invoiceApi.get(`/api/v1/shops/${shopId}/reps`).then((r) => r.data.data),
  addRep: (shopId: string, data: any) =>
    invoiceApi.post(`/api/v1/shops/${shopId}/reps`, data).then((r) => r.data.data),
  removeRep: (shopId: string, repId: string) =>
    invoiceApi.delete(`/api/v1/shops/${shopId}/reps/${repId}`).then((r) => r.data),
};

// Branches (nexus service)
export const branchApi = {
  list: () => api.get('/api/v1/account/branches').then((r) => r.data.data),
};

// Inventory locations
export const locationApi = {
  list: (branchId?: string) =>
    invoiceApi
      .get('/api/v1/inventories/locations', {
        params: branchId ? { branchId } : {},
      })
      .then((r) => r.data.data),
};
