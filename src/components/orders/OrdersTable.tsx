'use client';

import { ShopOrder, OrderStatus } from '@/types/shop';
import Badge, { BadgeColor } from '@/components/ui/Badge';

interface OrdersTableProps {
  orders: ShopOrder[];
  currency?: string;
}

const statusColor: Record<OrderStatus, BadgeColor> = {
  pending: 'yellow',
  paid: 'green',
  failed: 'red',
  cancelled: 'gray',
};

function formatPrice(amount: number, currency: string) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function OrdersTable({ orders, currency = 'NGN' }: OrdersTableProps) {
  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-primary-100 shadow-card p-12 text-center">
        <p className="text-gray-500 font-medium">No orders found</p>
        <p className="text-sm text-gray-400 mt-1">Orders will appear here once customers start purchasing</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-primary-100 shadow-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-primary-100 bg-primary-50">
              <th className="text-left px-4 py-3 font-medium text-primary-dark/70 whitespace-nowrap uppercase text-xs tracking-wide">Order ID</th>
              <th className="text-left px-4 py-3 font-medium text-primary-dark/70 uppercase text-xs tracking-wide">Customer</th>
              <th className="text-left px-4 py-3 font-medium text-primary-dark/70 whitespace-nowrap uppercase text-xs tracking-wide">Items</th>
              <th className="text-left px-4 py-3 font-medium text-primary-dark/70 whitespace-nowrap uppercase text-xs tracking-wide">Amount</th>
              <th className="text-left px-4 py-3 font-medium text-primary-dark/70 uppercase text-xs tracking-wide">Currency</th>
              <th className="text-left px-4 py-3 font-medium text-primary-dark/70 uppercase text-xs tracking-wide">Status</th>
              <th className="text-left px-4 py-3 font-medium text-primary-dark/70 uppercase text-xs tracking-wide">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary-50">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-primary-50/50 transition-colors">
                <td className="px-4 py-3 font-mono text-xs text-gray-500 whitespace-nowrap">
                  {order.id.slice(0, 8)}...
                </td>
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium text-gray-900">{order.customerName}</p>
                    <p className="text-xs text-gray-400">{order.customerEmail}</p>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-700">
                  {order.items?.length ?? '—'}
                </td>
                <td className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap">
                  {formatPrice(order.totalAmount, order.currency || currency)}
                </td>
                <td className="px-4 py-3">
                  <Badge color="primary">{order.currency}</Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge color={statusColor[order.status]}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                  {formatDate(order.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
