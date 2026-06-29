'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Plus, Store } from 'lucide-react';
import { shopsApi } from '@/lib/api';
import { Shop } from '@/types/shop';
import ShopCard from '@/components/shops/ShopCard';
import Spinner from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';

export default function ShopsPage() {
  const { data: shops, isLoading, error } = useQuery<Shop[]>({
    queryKey: ['shops'],
    queryFn: shopsApi.list,
  });

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-xl font-bold text-gray-900">My Shops</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage your storefronts</p>
        </div>
        <Link href="/shops/create">
          <Button variant="primary" size="md">
            <Plus className="w-4 h-4 mr-1.5" />
            New Shop
          </Button>
        </Link>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-6 text-center">
          <p className="text-red-700 font-medium">Failed to load shops</p>
          <p className="text-sm text-red-500 mt-1">Check your connection and try again</p>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && (!shops || shops.length === 0) && (
        <div className="flex flex-col items-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center mb-4">
            <Store className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">No shops yet</h2>
          <p className="text-gray-500 text-sm mb-6 max-w-xs">
            Create your first shop to start selling online with a dedicated storefront.
          </p>
          <Link href="/shops/create">
            <Button variant="primary" size="lg">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Shop
            </Button>
          </Link>
        </div>
      )}

      {/* Shops grid */}
      {!isLoading && !error && shops && shops.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {shops.map((shop) => (
            <ShopCard key={shop.id} shop={shop} />
          ))}
        </div>
      )}
    </div>
  );
}
