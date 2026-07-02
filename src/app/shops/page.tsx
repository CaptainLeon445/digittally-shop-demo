'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Plus, Store, ShoppingBag, Calendar, Clock, Wrench } from 'lucide-react';
import { shopsStore } from '@/lib/store';
import type { Shop } from '@/types';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';

const TYPE_CONFIG: Record<string, { label: string; dot: string }> = {
  online_vendor: { label: 'Online Store',   dot: 'bg-violet-500' },
  consultation:  { label: 'Consultation',   dot: 'bg-blue-500' },
  hospitality:   { label: 'Hospitality',    dot: 'bg-teal-500' },
  service:       { label: 'Service',        dot: 'bg-amber-500' },
};

function ShopCard({ shop }: { shop: Shop }) {
  const type = TYPE_CONFIG[shop.type] ?? TYPE_CONFIG.online_vendor;

  return (
    <Link href={`/shops/${shop.id}`} className="block group">
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 hover:shadow-card transition-all">
        {/* Banner */}
        <div
          className="h-[72px] relative"
          style={shop.bannerUrl ? {
            backgroundImage: `url(${shop.bannerUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          } : {
            background: `linear-gradient(135deg, ${shop.theme?.primaryColor ?? '#0b7d8e'}22, ${shop.theme?.primaryColor ?? '#0b7d8e'}08)`,
            borderBottom: `2px solid ${shop.theme?.primaryColor ?? '#0b7d8e'}22`,
          }}
        >
          <div className="absolute bottom-3 left-4">
            {shop.logoUrl ? (
              <img src={shop.logoUrl} alt={shop.name} className="w-9 h-9 rounded-lg object-cover border border-white shadow-sm" />
            ) : (
              <div
                className="w-9 h-9 rounded-lg border border-white/30 flex items-center justify-center"
                style={{ background: shop.theme?.primaryColor ?? '#0b7d8e' }}
              >
                <Store className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold text-ink text-sm leading-snug">{shop.name}</h3>
            <span className={`inline-flex items-center gap-1 text-[10px] font-medium text-gray-500 flex-shrink-0`}>
              <span className={`w-1.5 h-1.5 rounded-full ${type.dot}`} />
              {type.label}
            </span>
          </div>
          {shop.description && (
            <p className="text-[12px] text-gray-400 line-clamp-1 mb-2">{shop.description}</p>
          )}
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
            <span className={`text-[10px] font-semibold ${shop.status === 'active' ? 'text-green-600' : 'text-gray-400'}`}>
              {shop.status === 'active' ? '● Live' : '○ Inactive'}
            </span>
            <span className="text-[10px] text-gray-300 font-mono">{shop.currency}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function ShopsPage() {
  const { data: shops, isLoading } = useQuery<Shop[]>({
    queryKey: ['shops'],
    queryFn: shopsStore.list,
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">My Shops</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {shops ? `${shops.length} storefront${shops.length !== 1 ? 's' : ''}` : 'Your storefronts'}
          </p>
        </div>
        <Link href="/shops/create">
          <Button variant="primary" size="sm">
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            New shop
          </Button>
        </Link>
      </div>

      {isLoading && (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      )}

      {!isLoading && (!shops || shops.length === 0) && (
        <div className="flex flex-col items-center py-24 text-center">
          <div className="w-14 h-14 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center mb-5">
            <Store className="w-6 h-6 text-gray-300" />
          </div>
          <h2 className="text-sm font-semibold text-ink mb-1.5">No shops yet</h2>
          <p className="text-gray-400 text-xs mb-6 max-w-xs">Create your first shop and start selling, taking bookings, or collecting payments online.</p>
          <Link href="/shops/create">
            <Button variant="primary" size="md">
              <Plus className="w-4 h-4 mr-1.5" />
              Create your first shop
            </Button>
          </Link>
        </div>
      )}

      {!isLoading && shops && shops.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
          {shops.map((shop) => <ShopCard key={shop.id} shop={shop} />)}
        </div>
      )}
    </div>
  );
}
