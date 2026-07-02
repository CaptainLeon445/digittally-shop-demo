'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Plus, LogOut, LayoutGrid, CreditCard, ChevronRight,
  Wallet, Link as LinkIcon, Users, Store,
} from 'lucide-react';
import clsx from 'clsx';
import { authStore } from '@/lib/store';

const NAV_MAIN = [
  { href: '/shops',        label: 'My Shops',    icon: LayoutGrid, exact: true },
  { href: '/shops/create', label: 'New Shop',     icon: Plus,       exact: true },
  { href: '/reps',         label: 'Reps',         icon: Users,      exact: false },
];

const NAV_FINANCE = [
  { href: '/wallet',        label: 'Wallet',      icon: Wallet,    exact: false },
  { href: '/payment-links', label: 'Pay Links',   icon: LinkIcon,  exact: false },
  { href: '/billing',       label: 'Billing',     icon: CreditCard, exact: true },
];

function NavItem({ href, label, icon: Icon, exact }: { href: string; label: string; icon: any; exact: boolean }) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href);
  return (
    <Link
      href={href}
      className={clsx(
        'flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all',
        isActive
          ? 'bg-white/10 text-white'
          : 'text-white/45 hover:text-white/80 hover:bg-white/5'
      )}
    >
      <Icon className={clsx('w-[15px] h-[15px] flex-shrink-0', isActive ? 'text-primary-light' : 'text-white/30')} />
      {label}
    </Link>
  );
}

export default function Sidebar() {
  const router = useRouter();
  const user = authStore.getUser();

  const handleLogout = () => {
    authStore.logout();
    router.push('/login');
  };

  return (
    <aside className="fixed inset-y-0 left-0 w-56 flex flex-col z-30 bg-[#0f1e21] border-r border-white/5">
      {/* Logo */}
      <div className="h-14 flex items-center px-4 border-b border-white/5">
        <Link href="/shops" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 20 20" fill="none" className="w-3.5 h-3.5">
              <rect x="3" y="3" width="6" height="6" rx="1" fill="white" />
              <rect x="11" y="3" width="6" height="6" rx="1" fill="white" fillOpacity=".5" />
              <rect x="3" y="11" width="6" height="6" rx="1" fill="white" fillOpacity=".5" />
              <rect x="11" y="11" width="6" height="6" rx="1" fill="white" />
            </svg>
          </div>
          <div>
            <p className="font-bold text-white text-[13px] tracking-tight leading-none">Digit-Tally</p>
            <p className="text-[9px] text-white/25 uppercase tracking-widest mt-0.5">Shop Manager</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-5 space-y-5 overflow-y-auto">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-widest text-white/20 mb-1.5 px-3">Shops</p>
          <div className="space-y-0.5">
            {NAV_MAIN.map((item) => <NavItem key={item.href} {...item} />)}
          </div>
        </div>

        <div>
          <p className="text-[9px] font-bold uppercase tracking-widest text-white/20 mb-1.5 px-3">Finance</p>
          <div className="space-y-0.5">
            {NAV_FINANCE.map((item) => <NavItem key={item.href} {...item} />)}
          </div>
        </div>
      </nav>

      {/* User */}
      <div className="px-2 py-3 border-t border-white/5 space-y-0.5">
        {user && (
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg">
            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-white/60">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-semibold text-white/80 truncate leading-none">{user.name}</p>
              <p className="text-[10px] text-white/30 truncate mt-0.5">{user.email}</p>
            </div>
            <ChevronRight className="w-3 h-3 text-white/15 flex-shrink-0" />
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] text-white/30 hover:text-white/60 hover:bg-white/5 transition-all w-full"
        >
          <LogOut className="w-[14px] h-[14px]" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
