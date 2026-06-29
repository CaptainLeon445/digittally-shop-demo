'use client';

import { TrendingUp } from 'lucide-react';

interface WalletSummaryCardProps {
  currency: string;
  totalAmount: number;
  transactionCount: number;
}

const CURRENCY_CONFIG: Record<
  string,
  {
    flag: string;
    symbol: string;
    label: string;
    gradient: string;
    ring: string;
    shimmer: string;
    amountColor: string;
    mutedColor: string;
    badgeBg: string;
    iconBg: string;
  }
> = {
  NGN: {
    flag: '🇳🇬',
    symbol: '₦',
    label: 'Nigerian Naira',
    gradient: 'linear-gradient(135deg, #064e3b 0%, #065f46 40%, #047857 75%, #059669 100%)',
    ring: 'rgba(167,243,208,0.15)',
    shimmer: 'rgba(167,243,208,0.06)',
    amountColor: '#ecfdf5',
    mutedColor: 'rgba(209,250,229,0.7)',
    badgeBg: 'rgba(6,78,59,0.55)',
    iconBg: 'rgba(167,243,208,0.15)',
  },
  USD: {
    flag: '🇺🇸',
    symbol: '$',
    label: 'US Dollar',
    gradient: 'linear-gradient(135deg, #1e3a5f 0%, #1e40af 40%, #1d4ed8 75%, #2563eb 100%)',
    ring: 'rgba(191,219,254,0.15)',
    shimmer: 'rgba(191,219,254,0.06)',
    amountColor: '#eff6ff',
    mutedColor: 'rgba(219,234,254,0.7)',
    badgeBg: 'rgba(30,58,95,0.55)',
    iconBg: 'rgba(191,219,254,0.15)',
  },
  GBP: {
    flag: '🇬🇧',
    symbol: '£',
    label: 'British Pound',
    gradient: 'linear-gradient(135deg, #3b0764 0%, #6b21a8 50%, #7c3aed 100%)',
    ring: 'rgba(233,213,255,0.15)',
    shimmer: 'rgba(233,213,255,0.06)',
    amountColor: '#faf5ff',
    mutedColor: 'rgba(233,213,255,0.7)',
    badgeBg: 'rgba(59,7,100,0.55)',
    iconBg: 'rgba(233,213,255,0.15)',
  },
  EUR: {
    flag: '🇪🇺',
    symbol: '€',
    label: 'Euro',
    gradient: 'linear-gradient(135deg, #1c1917 0%, #292524 40%, #44403c 100%)',
    ring: 'rgba(254,243,199,0.15)',
    shimmer: 'rgba(254,243,199,0.06)',
    amountColor: '#fefce8',
    mutedColor: 'rgba(254,240,138,0.7)',
    badgeBg: 'rgba(28,25,23,0.55)',
    iconBg: 'rgba(254,243,199,0.15)',
  },
};

const FALLBACK_CONFIG = {
  flag: '💱',
  symbol: '',
  label: 'Balance',
  gradient: 'linear-gradient(135deg, #1f2937 0%, #374151 50%, #4b5563 100%)',
  ring: 'rgba(229,231,235,0.15)',
  shimmer: 'rgba(229,231,235,0.06)',
  amountColor: '#f9fafb',
  mutedColor: 'rgba(229,231,235,0.7)',
  badgeBg: 'rgba(31,41,55,0.55)',
  iconBg: 'rgba(229,231,235,0.15)',
};

function formatAmount(amount: number, currency: string) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export default function WalletSummaryCard({
  currency,
  totalAmount,
  transactionCount,
}: WalletSummaryCardProps) {
  const cfg = CURRENCY_CONFIG[currency] ?? { ...FALLBACK_CONFIG, symbol: currency };

  return (
    <div
      className="relative overflow-hidden rounded-2xl p-5 flex flex-col gap-4 min-h-[172px]"
      style={{ background: cfg.gradient }}
    >
      {/* Decorative rings */}
      <span
        className="pointer-events-none absolute -top-10 -right-10 w-48 h-48 rounded-full"
        style={{ border: `1px solid ${cfg.ring}`, opacity: 0.6 }}
      />
      <span
        className="pointer-events-none absolute -bottom-8 -left-8 w-36 h-36 rounded-full"
        style={{ background: cfg.shimmer }}
      />

      {/* Top row: flag + currency */}
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span
            className="w-9 h-9 rounded-xl flex items-center justify-center text-xl leading-none"
            style={{ background: cfg.iconBg, backdropFilter: 'blur(4px)' }}
          >
            {cfg.flag}
          </span>
          <div>
            <p className="text-xs font-semibold tracking-widest" style={{ color: cfg.mutedColor }}>
              {currency}
            </p>
            <p className="text-[10px] leading-tight" style={{ color: cfg.mutedColor, opacity: 0.75 }}>
              {cfg.label}
            </p>
          </div>
        </div>

        {/* Transaction badge */}
        <span
          className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-medium"
          style={{ background: cfg.badgeBg, color: cfg.amountColor, backdropFilter: 'blur(6px)' }}
        >
          <TrendingUp className="w-3 h-3" />
          {transactionCount} {transactionCount === 1 ? 'txn' : 'txns'}
        </span>
      </div>

      {/* Amount */}
      <div className="relative">
        <p className="text-[11px] font-medium mb-1" style={{ color: cfg.mutedColor }}>
          Available Balance
        </p>
        <p
          className="text-3xl font-bold tracking-tight leading-none"
          style={{ color: cfg.amountColor }}
        >
          {formatAmount(totalAmount, currency)}
        </p>
      </div>

      {/* Footer */}
      <div
        className="relative mt-auto rounded-xl px-3 py-2 flex items-center justify-between"
        style={{ background: cfg.badgeBg, backdropFilter: 'blur(6px)' }}
      >
        <span className="text-[11px] font-medium" style={{ color: cfg.mutedColor }}>
          Available for withdrawal
        </span>
        <span className="text-xs font-bold" style={{ color: cfg.amountColor }}>
          {formatAmount(totalAmount, currency)}
        </span>
      </div>
    </div>
  );
}
