'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft, MapPin, Mail, Phone, User, Package, Calendar,
  CheckCircle, Truck, XCircle, Clock, CreditCard,
} from 'lucide-react';
import { ordersStore } from '@/lib/store';
import { formatCurrency } from '@/lib/dummy-data';
import type { Order } from '@/types';
import Spinner from '@/components/ui/Spinner';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'refunded', label: 'Refunded' },
];

const STATUS_BADGE: Record<string, 'green' | 'gray' | 'red' | 'primary'> = {
  pending: 'gray', confirmed: 'primary', processing: 'primary',
  shipped: 'primary', delivered: 'green', cancelled: 'red', refunded: 'gray',
};

const TIMELINE = [
  { status: 'pending', label: 'Order Placed', icon: Clock },
  { status: 'confirmed', label: 'Confirmed', icon: CheckCircle },
  { status: 'processing', label: 'Processing', icon: Package },
  { status: 'shipped', label: 'Shipped', icon: Truck },
  { status: 'delivered', label: 'Delivered', icon: CheckCircle },
];

const STATUS_ORDER = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];

export default function OrderDetailPage() {
  const params = useParams<{ shopId: string; orderId: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: order, isLoading } = useQuery<Order>({
    queryKey: ['order', params.orderId],
    queryFn: () => ordersStore.get(params.orderId),
  });

  const mutation = useMutation({
    mutationFn: (status: Order['status']) => ordersStore.updateStatus(params.orderId, status),
    onSuccess: (updated) => {
      queryClient.setQueryData(['order', params.orderId], updated);
      queryClient.invalidateQueries({ queryKey: ['orders', params.shopId] });
    },
  });

  if (isLoading) return <div className="flex justify-center py-16"><Spinner size="lg" /></div>;
  if (!order) return <p className="text-center py-16 text-gray-400">Order not found.</p>;

  const currentStatusIdx = STATUS_ORDER.indexOf(order.status);
  const isCancelled = order.status === 'cancelled' || order.status === 'refunded';

  return (
    <div>
      <button
        onClick={() => router.push(`/shops/${params.shopId}/orders`)}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-primary/70 hover:text-primary transition-colors mb-5"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Orders
      </button>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{order.orderNumber}</h2>
          <p className="text-sm text-gray-500">
            {new Date(order.createdAt).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge color={STATUS_BADGE[order.status] ?? 'gray'} className="text-xs px-3 py-1">
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Badge>
          <Badge color={order.paymentStatus === 'paid' ? 'green' : 'gray'}>
            {order.paymentStatus}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-4">
          {/* Timeline */}
          {!isCancelled && (
            <div className="bg-white rounded-2xl border border-primary-100 shadow-card p-5">
              <p className="section-label mb-4">Order Progress</p>
              <div className="flex items-center gap-0">
                {TIMELINE.map(({ status, label, icon: Icon }, idx) => {
                  const isCompleted = currentStatusIdx >= idx;
                  const isCurrent = STATUS_ORDER[currentStatusIdx] === status;
                  return (
                    <div key={status} className="flex items-center flex-1 last:flex-none">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isCompleted ? 'bg-primary' : 'bg-gray-100'}`}>
                          <Icon className={`w-4 h-4 ${isCompleted ? 'text-white' : 'text-gray-400'}`} />
                        </div>
                        <p className={`text-[10px] mt-1 text-center leading-tight max-w-[52px] ${isCurrent ? 'font-semibold text-primary' : isCompleted ? 'text-gray-600' : 'text-gray-300'}`}>
                          {label}
                        </p>
                      </div>
                      {idx < TIMELINE.length - 1 && (
                        <div className={`flex-1 h-0.5 mx-1 mb-4 transition-all ${currentStatusIdx > idx ? 'bg-primary' : 'bg-gray-100'}`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Items */}
          <div className="bg-white rounded-2xl border border-primary-100 shadow-card p-5">
            <p className="section-label mb-4">Order Items</p>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3 py-2 border-b border-primary-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                      <Package className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{item.productTitle}</p>
                      {item.variant && <p className="text-xs text-gray-400">{item.variant}</p>}
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-gray-900 flex-shrink-0">{formatCurrency(item.total, order.currency)}</p>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="mt-4 pt-4 border-t border-primary-100 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium">{formatCurrency(order.subtotal, order.currency)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Discount</span>
                  <span className="font-medium text-green-600">-{formatCurrency(order.discount, order.currency)}</span>
                </div>
              )}
              {order.tax > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tax</span>
                  <span className="font-medium">{formatCurrency(order.tax, order.currency)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold pt-2 border-t border-primary-50">
                <span>Total</span>
                <span>{formatCurrency(order.total, order.currency)}</span>
              </div>
            </div>
          </div>

          {/* Booking info (if applicable) */}
          {order.bookingDate && (
            <div className="bg-white rounded-2xl border border-primary-100 shadow-card p-5">
              <p className="section-label mb-3">Booking Details</p>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">{order.bookingService}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(order.bookingDate).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    {order.bookingTime && ` at ${order.bookingTime}`}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Update Status */}
          <div className="bg-white rounded-2xl border border-primary-100 shadow-card p-5">
            <p className="section-label mb-3">Update Order Status</p>
            <div className="flex gap-3">
              <Select
                options={STATUS_OPTIONS}
                value={order.status}
                onChange={(e) => mutation.mutate((e as any).target.value as Order['status'])}
                className="flex-1"
              />
              {mutation.isPending && <Spinner size="sm" />}
            </div>
          </div>
        </div>

        {/* Right column — Customer info */}
        <div className="space-y-4">
          {/* Customer Profile */}
          <div className="bg-white rounded-2xl border border-primary-100 shadow-card p-5">
            <p className="section-label mb-4">Customer</p>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{order.customer.name}</p>
                {order.customer.totalOrders !== undefined && (
                  <p className="text-xs text-gray-400">{order.customer.totalOrders} order{order.customer.totalOrders !== 1 ? 's' : ''} total</p>
                )}
              </div>
            </div>

            <div className="space-y-2.5">
              <a href={`mailto:${order.customer.email}`} className="flex items-center gap-2.5 text-sm text-gray-600 hover:text-primary transition-colors">
                <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="truncate">{order.customer.email}</span>
              </a>
              {order.customer.phone && (
                <a href={`tel:${order.customer.phone}`} className="flex items-center gap-2.5 text-sm text-gray-600 hover:text-primary transition-colors">
                  <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span>{order.customer.phone}</span>
                </a>
              )}
              {(order.customer.address || order.customer.city) && (
                <div className="flex items-start gap-2.5 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span>
                    {[order.customer.address, order.customer.city, order.customer.state, order.customer.country].filter(Boolean).join(', ')}
                  </span>
                </div>
              )}
              {order.customer.totalSpent !== undefined && (
                <div className="mt-3 pt-3 border-t border-primary-50">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide">Total spent</p>
                  <p className="text-sm font-bold text-gray-900">{formatCurrency(order.customer.totalSpent, order.currency)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-2xl border border-primary-100 shadow-card p-5">
            <p className="section-label mb-3">Payment</p>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Status</span>
                <Badge color={order.paymentStatus === 'paid' ? 'green' : 'gray'}>
                  {order.paymentStatus}
                </Badge>
              </div>
              {order.paymentReference && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Reference</span>
                  <span className="text-xs font-mono text-gray-700">{order.paymentReference}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Amount</span>
                <span className="text-sm font-bold text-gray-900">{formatCurrency(order.total, order.currency)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="bg-white rounded-2xl border border-primary-100 shadow-card p-5">
              <p className="section-label mb-2">Order Notes</p>
              <p className="text-sm text-gray-600 leading-relaxed">{order.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
