'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Store, Plus, LogOut, LayoutDashboard, CreditCard, ChevronRight, User,
} from 'lucide-react';
import clsx from 'clsx';
import { authStore } from '@/lib/store';

const NAV = [
  { href: '/shops', label: 'My Shops', icon: LayoutDashboard, exact: true },
  { href: '/shops/create', label: 'Create Shop', icon: Plus, exact: true },
  { href: '/billing', label: 'Billing', icon: CreditCard, exact: true },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = authStore.getUser();

  const handleLogout = () => {
    authStore.logout();
    router.push('/login');
  };

  return (
    <aside
      className="fixed inset-y-0 left-0 w-60 flex flex-col z-30"
      style={{ background: 'linear-gradient(180deg, #052e36 0%, #074555 35%, #0b6070 65%, #0b7d8e 100%)' }}
    >
      <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse 120% 60% at 110% 10%, rgba(19,160,181,0.12) 0%, transparent 60%)' }} />

      {/* Logo */}
      <div className="relative h-16 flex items-center px-5 border-b border-white/10">
        <Link href="/shops" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.15)' }}>
            <Store className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-bold text-white text-sm leading-tight">Digit-Tally</p>
            <p className="text-[10px] text-white/50 tracking-wide">Shop Manager</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="relative flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2 px-1">Navigation</p>
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                isActive ? 'text-white' : 'text-white/60 hover:text-white/90 hover:bg-white/5'
              )}
              style={isActive ? { background: 'rgba(255,255,255,0.13)' } : {}}
            >
              <Icon className={clsx('w-4 h-4 flex-shrink-0', isActive ? 'text-primary-200' : 'text-white/40')} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="relative px-3 py-4 border-t border-white/10 space-y-1">
        {user && (
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.15)' }}>
              <User className="w-3.5 h-3.5 text-white/80" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white/90 truncate">{user.name}</p>
              <p className="text-[10px] text-white/40 truncate">{user.email}</p>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-white/20 flex-shrink-0" />
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:text-white/80 hover:bg-white/5 transition-all w-full"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
