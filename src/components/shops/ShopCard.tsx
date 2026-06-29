'use client';

import Link from 'next/link';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { Shop } from '@/types/shop';
import Badge from '@/components/ui/Badge';

const STOREFRONT_BASE = process.env.NEXT_PUBLIC_STOREFRONT_URL || 'http://localhost:3000';

interface ShopCardProps { shop: Shop; }

const STATUS_DOT: Record<string, string> = {
  active:   'bg-emerald-400',
  inactive: 'bg-gray-300',
};

export default function ShopCard({ shop }: ShopCardProps) {
  const storefrontUrl = `${STOREFRONT_BASE}/${shop.slug}`;

  return (
    <div className="bg-white rounded-2xl border border-primary-100 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 flex flex-col overflow-hidden group">
      {/* Coloured top accent */}
      <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg, #0b7d8e, #13a0b5)' }} />

      <div className="p-5 flex flex-col gap-4 flex-1">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${STATUS_DOT[shop.status] ?? 'bg-gray-300'}`} />
              <h3 className="font-semibold text-gray-900 truncate text-sm">{shop.name}</h3>
            </div>
            <p className="text-[11px] text-gray-400 font-mono ml-4">/{shop.slug}</p>
            {shop.businessName && (
              <p className="text-xs text-gray-500 mt-1 ml-4">{shop.businessName}</p>
            )}
          </div>
          <Badge color="primary">{shop.currency}</Badge>
        </div>

        {/* Description */}
        {shop.description && (
          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{shop.description}</p>
        )}

        {/* Storefront URL */}
        <div className="flex items-center gap-2 bg-primary-50 rounded-xl px-3 py-2 border border-primary-100">
          <span className="text-[11px] text-gray-500 truncate flex-1 font-mono">{storefrontUrl}</span>
          <a href={storefrontUrl} target="_blank" rel="noopener noreferrer"
            className="text-primary hover:text-primary-dark flex-shrink-0 transition-colors" aria-label="Open storefront">
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Manage link */}
        <Link href={`/shops/${shop.id}`}
          className="mt-auto flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium text-primary bg-primary-50 border border-primary-200 hover:bg-primary-100 transition-colors group-hover:border-primary/40">
          Manage Shop
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}
