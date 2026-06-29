'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Plus, Store, ShoppingBag, Calendar, Clock } from 'lucide-react';
import { shopsStore } from '@/lib/store';
import type { Shop } from '@/types';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';

const TYPE_CONFIG: Record<string, { label: string; icon: any; color: string }> = {
  online_vendor: { label: 'Online Store', icon: ShoppingBag, color: 'bg-purple-100 text-purple-700' },
  consultation:  { label: 'Consultation', icon: Calendar, color: 'bg-blue-100 text-blue-700' },
  hospitality:   { label: 'Hospitality', icon: Clock, color: 'bg-teal-100 text-teal-700' },
  service:       { label: 'Service', icon: Store, color: 'bg-orange-100 text-orange-700' },
};

function ShopCard({ shop }: { shop: Shop }) {
  const type = TYPE_CONFIG[shop.type] ?? TYPE_CONFIG.online_vendor;
  const TypeIcon = type.icon;
  return (
    <Link href={`/shops/${shop.id}`} className="block group">
      <div className="bg-white rounded-2xl border border-primary-100 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all overflow-hidden">
        {/* Banner / color header */}
        <div
          className="h-20 relative"
          style={shop.bannerUrl ? {
            backgroundImage: `url(${shop.bannerUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          } : {
            background: `linear-gradient(135deg, ${shop.theme?.primaryColor ?? '#0b7d8e'}, #052e36)`,
          }}
        >
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute bottom-3 left-4 flex items-center gap-2">
            {shop.logoUrl ? (
              <img src={shop.logoUrl} alt={shop.name} className="w-9 h-9 rounded-xl object-cover border-2 border-white/50" />
            ) : (
              <div className="w-9 h-9 rounded-xl flex items-center justify-center border-2 border-white/30" style={{ background: 'rgba(255,255,255,0.2)' }}>
                <Store className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        </div>

        <div className="p-4 pt-3">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-semibold text-gray-900 text-sm leading-snug">{shop.name}</h3>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${type.color}`}>
              {type.label}
            </span>
          </div>
          {shop.description && (
            <p className="text-xs text-gray-500 line-clamp-2 mb-3">{shop.description}</p>
          )}
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${shop.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
              {shop.status}
            </span>
            <span className="text-[10px] text-gray-400">{shop.currency}</span>
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

      {isLoading && (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      )}

      {!isLoading && (!shops || shops.length === 0) && (
        <div className="flex flex-col items-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center mb-4">
            <Store className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">No shops yet</h2>
          <p className="text-gray-500 text-sm mb-6 max-w-xs">Create your first shop and start selling online today.</p>
          <Link href="/shops/create">
            <Button variant="primary" size="lg">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Shop
            </Button>
          </Link>
        </div>
      )}

      {!isLoading && shops && shops.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {shops.map((shop) => <ShopCard key={shop.id} shop={shop} />)}
        </div>
      )}
    </div>
  );
}
