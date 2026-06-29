'use client';

import { useParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { ShoppingCart, Wallet, Users, ArrowLeft } from 'lucide-react';
import clsx from 'clsx';

const tabs = [
  { label: 'Overview', href: '', icon: null },
  { label: 'Orders', href: '/orders', icon: ShoppingCart },
  { label: 'Wallet', href: '/wallet', icon: Wallet },
  { label: 'Reps', href: '/reps', icon: Users },
];

export default function ShopDetailLayout({ children }: { children: React.ReactNode }) {
  const params = useParams<{ shopId: string }>();
  const pathname = usePathname();
  const shopId = params.shopId;
  const basePath = `/shops/${shopId}`;

  return (
    <div>
      {/* Back link */}
      <div className="mb-5">
        <Link href="/shops"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-primary/70 hover:text-primary transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          All Shops
        </Link>
      </div>

      {/* Tab navigation */}
      <div className="flex gap-1 mb-6 overflow-x-auto p-1 bg-white rounded-2xl border border-primary-100 shadow-card-sm w-fit">
        {tabs.map(({ label, href, icon: Icon }) => {
          const fullPath = `${basePath}${href}`;
          const isActive = pathname === fullPath || (href === '' && pathname === basePath);
          return (
            <Link
              key={href}
              href={fullPath}
              className={clsx(
                'flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-xl transition-all whitespace-nowrap',
                isActive
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-gray-500 hover:text-primary hover:bg-primary-50'
              )}
            >
              {Icon && <Icon className="w-3.5 h-3.5" />}
              {label}
            </Link>
          );
        })}
      </div>

      {children}
    </div>
  );
}
