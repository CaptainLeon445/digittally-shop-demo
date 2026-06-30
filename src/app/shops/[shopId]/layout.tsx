'use client';

import { useParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Palette, Package, ShoppingCart, Users, ArrowLeft, Eye,
} from 'lucide-react';
import clsx from 'clsx';

const TABS = [
  { label: 'Storefront', href: '', icon: Palette },
  { label: 'Inventory', href: '/inventory', icon: Package },
  { label: 'Orders', href: '/orders', icon: ShoppingCart },
  { label: 'Reps', href: '/reps', icon: Users },
  { label: 'Preview', href: '/preview', icon: Eye },
];

export default function ShopDetailLayout({ children }: { children: React.ReactNode }) {
  const params = useParams<{ shopId: string }>();
  const pathname = usePathname();
  const shopId = params.shopId;
  const basePath = `/shops/${shopId}`;

  return (
    <div>
      <div className="mb-5">
        <Link href="/shops" className="inline-flex items-center gap-1.5 text-xs font-medium text-primary/70 hover:text-primary transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          All Shops
        </Link>
      </div>

      <div className="overflow-x-auto mb-6">
        <div className="flex gap-1 p-1 bg-white rounded-2xl border border-primary-100 shadow-card-sm w-fit min-w-max">
          {TABS.map(({ label, href, icon: Icon }) => {
            const fullPath = `${basePath}${href}`;
            const isActive = href === ''
              ? (pathname === basePath || pathname === basePath + '/')
              : pathname.startsWith(fullPath);
            return (
              <Link
                key={href}
                href={fullPath}
                className={clsx(
                  'flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap',
                  isActive ? 'bg-primary text-white shadow-sm' : 'text-gray-500 hover:text-primary hover:bg-primary-50'
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </Link>
            );
          })}
        </div>
      </div>

      {children}
    </div>
  );
}
