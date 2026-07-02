'use client';

import { useParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Palette, Package, ShoppingCart, ArrowLeft, Eye } from 'lucide-react';
import clsx from 'clsx';

const TABS = [
  { label: 'Storefront',  href: '',           icon: Palette },
  { label: 'Inventory',   href: '/inventory', icon: Package },
  { label: 'Orders',      href: '/orders',    icon: ShoppingCart },
  { label: 'Preview',     href: '/preview',   icon: Eye },
];

export default function ShopDetailLayout({ children }: { children: React.ReactNode }) {
  const params = useParams<{ shopId: string }>();
  const pathname = usePathname();
  const shopId = params.shopId;
  const basePath = `/shops/${shopId}`;

  return (
    <div>
      <div className="mb-5">
        <Link href="/shops" className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-ink transition-colors font-medium">
          <ArrowLeft className="w-3.5 h-3.5" />
          All shops
        </Link>
      </div>

      {/* Underline tab bar */}
      <div className="flex gap-1 border-b border-gray-200 mb-6 -mx-6 px-6 overflow-x-auto">
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
                'flex items-center gap-1.5 px-3 py-2.5 text-[13px] font-medium whitespace-nowrap border-b-2 -mb-px transition-all',
                isActive
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-400 hover:text-gray-700 hover:border-gray-300'
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </Link>
          );
        })}
      </div>

      {children}
    </div>
  );
}
