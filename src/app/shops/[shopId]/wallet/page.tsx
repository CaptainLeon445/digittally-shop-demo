'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { shopsApi } from '@/lib/api';
import { WalletTransaction } from '@/types/shop';
import WalletSummaryCard from '@/components/wallet/WalletSummaryCard';
import TransactionsTable from '@/components/wallet/TransactionsTable';
import Spinner from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';

interface WalletData {
  transactions: WalletTransaction[];
  total: number;
  page: number;
  limit: number;
  summary: { currency: string; total: number; count: number }[];
}

export default function WalletPage() {
  const params = useParams<{ shopId: string }>();
  const shopId = params.shopId;
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data, isLoading, error } = useQuery<WalletData>({
    queryKey: ['shop-wallet', shopId, page],
    queryFn: () => shopsApi.getWallet(shopId, { page, limit }),
  });

  const transactions: WalletTransaction[] = data?.transactions ?? [];
  const summary = data?.summary ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / limit);

  // Build summary map from API or compute from transactions
  const summaryMap = (() => {
    const map: Record<string, { currency: string; total: number; count: number }> = {};
    const source = summary.length > 0 ? summary : (() => {
      const byCurrency: Record<string, { currency: string; total: number; count: number }> = {};
      for (const tx of transactions) {
        if (tx.status !== 'success') continue;
        if (!byCurrency[tx.currency])
          byCurrency[tx.currency] = { currency: tx.currency, total: 0, count: 0 };
        byCurrency[tx.currency].total += tx.amount;
        byCurrency[tx.currency].count += 1;
      }
      return Object.values(byCurrency);
    })();
    for (const item of source) map[item.currency] = item;
    return map;
  })();

  // Pinned currencies always shown; extras from actual transactions
  const PINNED = ['NGN', 'USD'];
  const extras = Object.keys(summaryMap).filter((c) => !PINNED.includes(c));
  const displayCurrencies = [...PINNED, ...extras];

  const computedSummary = displayCurrencies.map(
    (c) => summaryMap[c] ?? { currency: c, total: 0, count: 0 }
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-gray-900">Wallet</h2>
        <p className="text-sm text-gray-500">Revenue received through your storefront</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : error ? (
        <div className="rounded-xl bg-red-50 border border-red-200 p-6 text-center">
          <p className="text-red-700">Failed to load wallet data</p>
        </div>
      ) : (
        <>
          {/* Balance cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {computedSummary.map((item) => (
              <WalletSummaryCard
                key={item.currency}
                currency={item.currency}
                totalAmount={item.total}
                transactionCount={item.count}
              />
            ))}
          </div>

          {/* Transactions */}
          <div>
            <p className="section-label mb-3">Transaction History</p>
            <TransactionsTable transactions={transactions} />
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between py-2">
              <p className="text-sm text-gray-500">
                Page {page} of {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setPage((p) => p - 1)}
                  disabled={page <= 1}
                >
                  Previous
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
