'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Search, ChevronRight, Clock, CheckCircle, XCircle, Truck } from 'lucide-react';
import { ordersStore } from '@/lib/store';
import { formatCurrency } from '@/lib/dummy-data';
import type { Order } from '@/types';
import Spinner from '@/components/ui/Spinner';
import Badge from '@/components/ui/Badge';

const STATUS_CONFIG: Record<string, { color: 'green' | 'gray' | 'red' | 'primary'; icon: any; label: string }> = {
  pending:    { color: 'gray',    icon: Clock,       label: 'Pending' },
  confirmed:  { color: 'primary', icon: CheckCircle, label: 'Confirmed' },
  processing: { color: 'primary', icon: Clock,       label: 'Processing' },
  shipped:    { color: 'primary', icon: Truck,       label: 'Shipped' },
  delivered:  { color: 'green',   icon: CheckCircle, label: 'Delivered' },
  cancelled:  { color: 'red',     icon: XCircle,     label: 'Cancelled' },
  refunded:   { color: 'gray',    icon: XCircle,     label: 'Refunded' },
};

const PAYMENT_COLORS: Record<string, 'green' | 'gray' | 'red'> = {
  paid: 'green', pending: 'gray', failed: 'red', refunded: 'gray',
};

export default function OrdersPage() {
  const params = useParams<{ shopId: string }>();
  const shopId = params.shopId;
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ['orders', shopId],
    queryFn: () => ordersStore.list(shopId),
  });

  const filtered = (orders ?? []).filter((o) => {
    const matchSearch = !search ||
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.name.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const revenue = (orders ?? []).filter((o) => o.paymentStatus === 'paid').reduce((s, o) => s + o.total, 0);
  const pending = (orders ?? []).filter((o) => o.status === 'pending').length;
  const delivered = (orders ?? []).filter((o) => o.status === 'delivered').length;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900">Orders</h2>
        <p className="text-sm text-gray-500">{orders?.length ?? 0} total orders</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Revenue', value: formatCurrency(revenue, 'NGN'), color: 'text-gray-900' },
          { label: 'Pending', value: pending, color: 'text-amber-600' },
          { label: 'Delivered', value: delivered, color: 'text-green-600' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl border border-primary-100 shadow-card-sm p-3 text-center">
            <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">{label}</p>
            <p className={`text-sm font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-primary-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white"
            placeholder="Search orders or customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-primary-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white text-gray-700"
        >
          <option value="all">All Statuses</option>
          {Object.keys(STATUS_CONFIG).map((s) => (
            <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
          ))}
        </select>
      </div>

      {isLoading && <div className="flex justify-center py-12"><Spinner size="lg" /></div>}

      {!isLoading && filtered.length === 0 && (
        <div className="flex flex-col items-center py-16 text-center">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-3">
            <ShoppingCart className="w-7 h-7 text-primary" />
          </div>
          <p className="font-semibold text-gray-900 mb-1">No orders found</p>
          <p className="text-sm text-gray-400">Orders appear here when customers checkout from your storefront</p>
        </div>
      )}

      {!isLoading && filtered.length > 0 && (
        <div className="bg-white rounded-2xl border border-primary-100 shadow-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-primary-50">
                {['Order', 'Customer', 'Date', 'Status', 'Total', ''].map((h, i) => (
                  <th key={i} className={`text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400 px-4 py-3 ${i === 2 ? 'hidden sm:table-cell' : ''} ${i === 4 ? 'text-right' : ''} ${i === 5 ? 'w-10' : ''}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => {
                const sc = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
                const StatusIcon = sc.icon;
                return (
                  <tr
                    key={order.id}
                    onClick={() => router.push(`/shops/${shopId}/orders/${order.id}`)}
                    className="border-b border-primary-50 last:border-0 hover:bg-primary-50/50 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3.5">
                      <p className="text-xs font-bold text-gray-900">{order.orderNumber}</p>
                      <p className="text-[10px] text-gray-400">{order.items.length} item{order.items.length > 1 ? 's' : ''}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-xs font-semibold text-gray-800 truncate max-w-[120px]">{order.customer.name}</p>
                      <p className="text-[10px] text-gray-400 truncate max-w-[120px]">{order.customer.email}</p>
                    </td>
                    <td className="px-4 py-3.5 hidden sm:table-cell">
                      <p className="text-xs text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <StatusIcon className="w-3.5 h-3.5 text-gray-400" />
                        <Badge color={sc.color}>{sc.label}</Badge>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <p className="text-xs font-bold text-gray-900">{formatCurrency(order.total, order.currency)}</p>
                      <Badge color={PAYMENT_COLORS[order.paymentStatus] ?? 'gray'} className="text-[9px] mt-0.5">
                        {order.paymentStatus}
                      </Badge>
                    </td>
                    <td className="px-2">
                      <ChevronRight className="w-4 h-4 text-gray-300" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
