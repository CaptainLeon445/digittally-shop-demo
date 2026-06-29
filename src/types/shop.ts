export type ShopStatus = 'active' | 'inactive';
export type OrderStatus = 'pending' | 'paid' | 'failed' | 'cancelled';
export type RepRole = 'rep' | 'manager' | 'support';
export type RepStatus = 'active' | 'inactive';

export interface Shop {
  id: string;
  orgId: string;
  branchId: string;
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  currency: string;
  businessName?: string;
  locationId?: string;
  status: ShopStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShopOrder {
  id: string;
  shopId: string;
  orgId: string;
  branchId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  currency: string;
  subTotal: number;
  totalVat: number;
  totalDiscount: number;
  totalWHT: number;
  totalAmount: number;
  status: OrderStatus;
  invoiceId?: string;
  paymentReference?: string;
  paymentUrl?: string;
  receiptDocId?: string;
  items?: ShopOrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface ShopOrderItem {
  id: string;
  shopOrderId: string;
  inventoryId: string;
  productId: string;
  name: string;
  description?: string;
  unitOfMeasure: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  vat: number;
  wht: number;
  grossAmount: number;
  netAmount: number;
}

export interface WalletTransaction {
  id: string;
  shopId: string;
  orgId: string;
  shopOrderId: string;
  invoiceId: string;
  amount: number;
  currency: string;
  paymentReference: string;
  status: 'pending' | 'success' | 'failed';
  receiptDocId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShopSalesRep {
  id: string;
  shopId: string;
  orgId: string;
  name: string;
  email: string;
  phone?: string;
  role: RepRole;
  status: RepStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Branch {
  id: string;
  name: string;
  code?: string;
  operatingCurrency?: string;
}

export interface InventoryLocation {
  id: string;
  name: string;
  branchId: string;
  description?: string;
}
