'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Store, PlusSquare, LogOut, GitBranch, ChevronDown } from 'lucide-react';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { authApi, branchApi, clearToken, getCurrentBranchId } from '@/lib/api';

const navLinks = [
  { href: '/shops',        label: 'My Shops',    icon: Store      },
  { href: '/shops/create', label: 'Create Shop', icon: PlusSquare },
];

interface Branch { id: string; name: string; isHeadOffice?: boolean; }

export default function Sidebar() {
  const pathname = usePathname();
  const router   = useRouter();
  const [branches, setBranches]         = useState<Branch[]>([]);
  const [currentBranchId, setCurrent]   = useState<string | null>(null);
  const [switching, setSwitching]       = useState(false);
  const [open, setOpen]                 = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrent(getCurrentBranchId());
    branchApi.list().then((d) => setBranches(d ?? [])).catch(() => {});
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const currentBranch = branches.find((b) => b.id === currentBranchId);

  const handleSwitch = async (branchId: string) => {
    if (branchId === currentBranchId || switching) return;
    setSwitching(true);
    setOpen(false);
    try {
      await authApi.switchBranch(branchId);
      setCurrent(branchId);
      window.location.reload();
    } catch { setSwitching(false); }
  };

  const handleLogout = () => { clearToken(); router.push('/login'); };

  return (
    <aside
      className="fixed inset-y-0 left-0 w-60 flex flex-col z-30"
      style={{
        background: 'linear-gradient(180deg, #052e36 0%, #074555 35%, #0b6070 65%, #0b7d8e 100%)',
      }}
    >
      {/* Subtle inner-right glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 120% 60% at 110% 10%, rgba(19,160,181,0.12) 0%, transparent 60%)',
        }}
      />

      {/* Logo */}
      <div className="relative h-16 flex items-center px-5 border-b border-white/10">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center mr-3 flex-shrink-0"
          style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)' }}>
          <Store className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="font-bold text-white text-sm leading-tight">Digit-Tally</p>
          <p className="text-[10px] text-white/50 tracking-wide">Shop Manager</p>
        </div>
      </div>

      {/* Branch Switcher */}
      {branches.length > 0 && (
        <div className="relative px-3 pt-4 pb-3 border-b border-white/10" ref={dropdownRef}>
          <p className="text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2 px-1">
            Branch
          </p>
          <button
            onClick={() => setOpen((o) => !o)}
            disabled={switching}
            className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all"
            style={{ background: 'rgba(255,255,255,0.08)' }}
          >
            <span className="flex items-center gap-2 truncate text-white/90">
              <GitBranch className="w-3.5 h-3.5 text-primary-200 shrink-0" />
              <span className="truncate text-xs">
                {switching ? 'Switching…' : (currentBranch?.name ?? 'Select branch')}
              </span>
            </span>
            <ChevronDown className={clsx('w-3.5 h-3.5 text-white/40 shrink-0 transition-transform', open && 'rotate-180')} />
          </button>

          {open && (
            <div className="absolute left-3 right-3 top-full mt-1 rounded-xl shadow-xl z-50 py-1 max-h-48 overflow-y-auto"
              style={{ background: '#073f4e', border: '1px solid rgba(255,255,255,0.1)' }}>
              {branches.map((b) => (
                <button
                  key={b.id}
                  onClick={() => handleSwitch(b.id)}
                  className={clsx(
                    'w-full text-left px-3 py-2 text-xs transition-colors',
                    b.id === currentBranchId
                      ? 'text-primary-200 font-semibold'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  )}
                >
                  {b.name}
                  {b.isHeadOffice && <span className="ml-1.5 text-white/30">(HQ)</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Nav */}
      <nav className="relative flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2 px-1">
          Navigation
        </p>
        {navLinks.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                isActive
                  ? 'text-white shadow-sm'
                  : 'text-white/60 hover:text-white/90 hover:bg-white/5'
              )}
              style={isActive ? { background: 'rgba(255,255,255,0.13)' } : {}}
            >
              {isActive && (
                <span className="absolute left-0 w-0.5 h-7 rounded-r-full bg-primary-200"
                  style={{ marginLeft: 0 }} />
              )}
              <Icon className={clsx('w-4 h-4 flex-shrink-0', isActive ? 'text-primary-200' : 'text-white/40')} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="relative px-3 py-4 border-t border-white/10">
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
