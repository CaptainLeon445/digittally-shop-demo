'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { shopsApi } from '@/lib/api';
import { ShopOrder, OrderStatus } from '@/types/shop';
import OrdersTable from '@/components/orders/OrdersTable';
import Spinner from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';
import clsx from 'clsx';

const STATUS_TABS: { label: string; value: OrderStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Paid', value: 'paid' },
  { label: 'Failed', value: 'failed' },
  { label: 'Cancelled', value: 'cancelled' },
];


export default function OrdersPage() {
  const params = useParams<{ shopId: string }>();
  const shopId = params.shopId;
  const [activeStatus, setActiveStatus] = useState<OrderStatus | 'all'>('all');
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data, isLoading, error } = useQuery({
    queryKey: ['shop-orders', shopId, activeStatus, page],
    queryFn: () =>
      shopsApi.getOrders(shopId, {
        status: activeStatus === 'all' ? undefined : activeStatus,
        page,
        limit,
      }),
  });

  const orders: ShopOrder[] = data?.orders ?? [];
  const total: number = data?.total ?? 0;
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Orders</h2>
          <p className="text-sm text-gray-500">
            {total > 0 ? `${total} total orders` : 'No orders yet'}
          </p>
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 overflow-x-auto p-1 bg-white rounded-2xl border border-primary-100 shadow-card-sm w-fit">
        {STATUS_TABS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => {
              setActiveStatus(value);
              setPage(1);
            }}
            className={clsx(
              'px-4 py-2 text-sm font-medium rounded-xl transition-all whitespace-nowrap',
              activeStatus === value
                ? 'bg-primary text-white shadow-sm'
                : 'text-gray-500 hover:text-primary hover:bg-primary-50'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : error ? (
        <div className="rounded-xl bg-red-50 border border-red-200 p-6 text-center">
          <p className="text-red-700">Failed to load orders</p>
        </div>
      ) : (
        <OrdersTable orders={orders} />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between py-2">
          <p className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPage((p) => p - 1)}
              disabled={page <= 1}
            >
              Previous
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
