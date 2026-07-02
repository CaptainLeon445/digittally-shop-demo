'use client';

import { useState, useMemo } from 'react';
import { useQuery, useQueries, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Wallet, ArrowDownRight, ArrowUpRight, Clock, TrendingUp, Send, Store, Filter,
} from 'lucide-react';
import { walletStore, shopsStore } from '@/lib/store';
import { formatCurrency } from '@/lib/dummy-data';
import type { WalletTransaction, WalletSummary, Shop } from '@/types';
import Spinner from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';

function WithdrawModal({ shopId, balance, onClose }: { shopId: string; balance: number; onClose: () => void }) {
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState('');
  const [bank, setBank] = useState('');
  const [account, setAccount] = useState('');
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: () => walletStore.withdraw(shopId, parseFloat(amount)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet', shopId] });
      queryClient.invalidateQueries({ queryKey: ['wallet-txns', shopId] });
      onClose();
    },
  });

  const handleWithdraw = () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) { setError('Enter a valid amount'); return; }
    if (amt > balance) { setError('Amount exceeds available balance'); return; }
    if (!bank.trim()) { setError('Bank name is required'); return; }
    if (!account.trim() || account.length < 10) { setError('Enter a valid 10-digit account number'); return; }
    setError('');
    mutation.mutate();
  };

  return (
    <div className="space-y-4">
      <div className="bg-primary-50 border border-primary-100 rounded-xl p-3 text-sm text-gray-700">
        Available: <span className="font-bold text-primary">{formatCurrency(balance, 'NGN')}</span>
      </div>
      <Input label="Amount (NGN)" type="number" min="1" placeholder="e.g. 10000" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <Input label="Bank Name" placeholder="GTBank, Access Bank..." value={bank} onChange={(e) => setBank(e.target.value)} />
      <Input label="Account Number" placeholder="0123456789" maxLength={10} value={account} onChange={(e) => setAccount(e.target.value)} />
      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
      <div className="flex gap-3">
        <Button variant="secondary" size="md" onClick={onClose} className="flex-1">Cancel</Button>
        <Button variant="primary" size="md" onClick={handleWithdraw} loading={mutation.isPending} className="flex-1">
          <Send className="w-4 h-4 mr-1.5" />Withdraw
        </Button>
      </div>
    </div>
  );
}

const TXN_ICONS = {
  credit: ArrowDownRight, debit: ArrowUpRight, withdrawal: Send, fee: TrendingUp,
} as const;

const TXN_COLORS = {
  credit: 'text-green-600 bg-green-50',
  debit: 'text-red-600 bg-red-50',
  withdrawal: 'text-blue-600 bg-blue-50',
  fee: 'text-orange-600 bg-orange-50',
} as const;

type TxnType = WalletTransaction['type'] | 'all';
type TxnStatus = WalletTransaction['status'] | 'all';

const TYPE_LABELS: { value: TxnType; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'credit', label: 'Credit' },
  { value: 'debit', label: 'Debit' },
  { value: 'withdrawal', label: 'Withdrawal' },
  { value: 'fee', label: 'Fee' },
];
const STATUS_LABELS: { value: TxnStatus; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'success', label: 'Success' },
  { value: 'pending', label: 'Pending' },
  { value: 'failed', label: 'Failed' },
];

function FilterPills<T extends string>({
  label, options, value, onChange,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">{label}:</span>
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
            value === o.value
              ? 'bg-primary text-white shadow-sm'
              : 'bg-white border border-gray-200 text-gray-500 hover:border-primary hover:text-primary'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export default function WalletPage() {
  // null = All Shops view
  const [selectedShopId, setSelectedShopId] = useState<string | null>(null);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [filterType, setFilterType] = useState<TxnType>('all');
  const [filterStatus, setFilterStatus] = useState<TxnStatus>('all');

  const { data: shops, isLoading: shopsLoading } = useQuery<Shop[]>({
    queryKey: ['shops'],
    queryFn: shopsStore.list,
  });

  const shopMap = useMemo(
    () => Object.fromEntries((shops ?? []).map((s) => [s.id, s])),
    [shops],
  );

  // Per-shop data (used when a specific shop is selected)
  const { data: shopSummary, isLoading: shopSummaryLoading } = useQuery<WalletSummary>({
    queryKey: ['wallet', selectedShopId],
    queryFn: () => walletStore.getSummary(selectedShopId!),
    enabled: !!selectedShopId,
  });

  const { data: shopTxns, isLoading: shopTxnLoading } = useQuery<WalletTransaction[]>({
    queryKey: ['wallet-txns', selectedShopId],
    queryFn: () => walletStore.getTransactions(selectedShopId!),
    enabled: !!selectedShopId,
  });

  // All-shops data (loaded in parallel when no shop selected)
  const allTxnQueries = useQueries({
    queries: (shops ?? []).map((shop) => ({
      queryKey: ['wallet-txns', shop.id],
      queryFn: () => walletStore.getTransactions(shop.id),
      enabled: selectedShopId === null,
    })),
  });

  const allSummaryQueries = useQueries({
    queries: (shops ?? []).map((shop) => ({
      queryKey: ['wallet', shop.id],
      queryFn: () => walletStore.getSummary(shop.id),
      enabled: selectedShopId === null,
    })),
  });

  // Combined and sorted transactions for all-shops view
  const allTransactions = useMemo(() => {
    if (selectedShopId) return shopTxns ?? [];
    const combined: WalletTransaction[] = [];
    allTxnQueries.forEach((q) => { if (q.data) combined.push(...q.data); });
    return combined.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [selectedShopId, shopTxns, allTxnQueries]);

  // Aggregated summary
  const displaySummary = useMemo((): WalletSummary | null => {
    if (selectedShopId) return shopSummary ?? null;
    const summaries = allSummaryQueries.map((q) => q.data).filter(Boolean) as WalletSummary[];
    if (!summaries.length) return null;
    return {
      balance: summaries.reduce((a, s) => a + s.balance, 0),
      totalEarned: summaries.reduce((a, s) => a + s.totalEarned, 0),
      totalWithdrawn: summaries.reduce((a, s) => a + s.totalWithdrawn, 0),
      pendingAmount: summaries.reduce((a, s) => a + s.pendingAmount, 0),
      currency: 'NGN',
    };
  }, [selectedShopId, shopSummary, allSummaryQueries]);

  // Apply filters
  const filteredTransactions = useMemo(() => {
    return allTransactions.filter((txn) => {
      if (filterType !== 'all' && txn.type !== filterType) return false;
      if (filterStatus !== 'all' && txn.status !== filterStatus) return false;
      return true;
    });
  }, [allTransactions, filterType, filterStatus]);

  const isLoading = selectedShopId
    ? (shopSummaryLoading || shopTxnLoading)
    : (allTxnQueries.some((q) => q.isLoading) || allSummaryQueries.some((q) => q.isLoading));

  const showShopColumn = selectedShopId === null;

  if (shopsLoading) return <div className="flex justify-center py-16"><Spinner size="lg" /></div>;

  const activeBalance = selectedShopId ? (shopSummary?.balance ?? 0) : 0;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Wallet</h1>
          <p className="text-sm text-gray-500 mt-0.5">Earnings and transactions across your shops</p>
        </div>
      </div>

      {/* Shop selector */}
      {shops && shops.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1 mb-6 -mx-1 px-1">
          <button
            onClick={() => setSelectedShopId(null)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap flex-shrink-0 transition-all border ${
              selectedShopId === null
                ? 'bg-primary text-white border-primary'
                : 'bg-white text-gray-500 border-gray-200 hover:border-primary hover:text-primary'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            All Shops
          </button>
          {shops.map((shop) => (
            <button
              key={shop.id}
              onClick={() => setSelectedShopId(shop.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap flex-shrink-0 transition-all border ${
                shop.id === selectedShopId
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-primary hover:text-primary'
              }`}
            >
              {shop.logoUrl ? (
                <img src={shop.logoUrl} alt="" className="w-4 h-4 rounded object-cover" />
              ) : (
                <Store className="w-3.5 h-3.5" />
              )}
              {shop.name}
            </button>
          ))}
        </div>
      )}

      {!shops?.length && (
        <div className="flex flex-col items-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Wallet className="w-8 h-8 text-primary" />
          </div>
          <p className="text-gray-500">Create a shop to start tracking your earnings.</p>
        </div>
      )}

      {!!shops?.length && (
        <>
          {isLoading ? (
            <div className="flex justify-center py-12"><Spinner size="lg" /></div>
          ) : (
            <>
              {/* Balance cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                {[
                  {
                    label: 'Available Balance',
                    value: formatCurrency(displaySummary?.balance ?? 0, 'NGN'),
                    icon: Wallet, color: 'text-primary', bg: 'bg-primary-50 border-primary-100',
                    action: selectedShopId ? (
                      <Button size="sm" variant="primary" onClick={() => setShowWithdraw(true)} className="mt-2 w-full">
                        <Send className="w-3 h-3 mr-1" />Withdraw
                      </Button>
                    ) : (
                      <p className="text-[10px] text-gray-400 mt-2">Select a shop to withdraw</p>
                    ),
                  },
                  {
                    label: 'Total Earned',
                    value: formatCurrency(displaySummary?.totalEarned ?? 0, 'NGN'),
                    icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50 border-green-100',
                  },
                  {
                    label: 'Total Withdrawn',
                    value: formatCurrency(displaySummary?.totalWithdrawn ?? 0, 'NGN'),
                    icon: ArrowUpRight, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100',
                  },
                  {
                    label: 'Pending',
                    value: formatCurrency(displaySummary?.pendingAmount ?? 0, 'NGN'),
                    icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100',
                  },
                ].map(({ label, value, icon: Icon, color, bg, action }) => (
                  <div key={label} className={`rounded-2xl border p-4 ${bg}`}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <Icon className={`w-4 h-4 ${color}`} />
                      <p className="text-xs text-gray-500 font-medium">{label}</p>
                    </div>
                    <p className={`text-lg font-bold ${color}`}>{value}</p>
                    {action ?? null}
                  </div>
                ))}
              </div>

              {/* Transaction history */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="section-label">
                    Transaction History
                    {selectedShopId && shopMap[selectedShopId] && (
                      <span className="normal-case font-normal tracking-normal ml-1 text-gray-400">
                        — {shopMap[selectedShopId].name}
                      </span>
                    )}
                  </p>
                  <span className="text-xs text-gray-400">
                    {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {/* Filter pills */}
                <div className="flex flex-wrap gap-x-5 gap-y-2.5 mb-4 p-3 bg-gray-50 border border-gray-100 rounded-xl">
                  <div className="flex items-center gap-1.5">
                    <Filter className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                  </div>
                  <FilterPills
                    label="Type"
                    options={TYPE_LABELS}
                    value={filterType}
                    onChange={setFilterType}
                  />
                  <FilterPills
                    label="Status"
                    options={STATUS_LABELS}
                    value={filterStatus}
                    onChange={setFilterStatus}
                  />
                  {(filterType !== 'all' || filterStatus !== 'all') && (
                    <button
                      onClick={() => { setFilterType('all'); setFilterStatus('all'); }}
                      className="text-[11px] text-primary font-semibold hover:underline ml-auto"
                    >
                      Clear filters
                    </button>
                  )}
                </div>

                {filteredTransactions.length === 0 ? (
                  <div className="flex flex-col items-center py-12 text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                      <Wallet className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-sm text-gray-500">
                      {allTransactions.length === 0
                        ? 'No transactions yet'
                        : 'No transactions match the current filters'}
                    </p>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-primary-100 shadow-card overflow-hidden overflow-x-auto">
                    <table className="w-full min-w-[600px]">
                      <thead>
                        <tr className="border-b border-primary-50">
                          <th className="text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400 px-4 py-3 w-10" />
                          <th className="text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400 px-4 py-3">Description</th>
                          {showShopColumn && (
                            <th className="text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400 px-4 py-3">Shop</th>
                          )}
                          <th className="text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400 px-4 py-3">Date</th>
                          <th className="text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400 px-4 py-3">Status</th>
                          <th className="text-right text-[11px] font-semibold uppercase tracking-wide text-gray-400 px-4 py-3">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTransactions.map((txn) => {
                          const Icon = TXN_ICONS[txn.type] ?? ArrowDownRight;
                          const colorClass = TXN_COLORS[txn.type] ?? TXN_COLORS.credit;
                          const isCredit = txn.type === 'credit';
                          const shop = shopMap[txn.shopId];
                          return (
                            <tr key={txn.id} className="border-b border-primary-50 last:border-0 hover:bg-primary-50/30 transition-colors">
                              <td className="px-4 py-3">
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center ${colorClass}`}>
                                  <Icon className="w-3.5 h-3.5" />
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <p className="text-xs font-semibold text-gray-900">{txn.description}</p>
                                <p className="text-[10px] text-gray-400 font-mono">{txn.reference}</p>
                              </td>
                              {showShopColumn && (
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-primary-50 border border-primary-100 text-primary text-[11px] font-medium">
                                    {shop?.logoUrl ? (
                                      <img src={shop.logoUrl} alt="" className="w-3 h-3 rounded object-cover" />
                                    ) : (
                                      <Store className="w-2.5 h-2.5" />
                                    )}
                                    {shop?.name ?? txn.shopId}
                                  </span>
                                </td>
                              )}
                              <td className="px-4 py-3 whitespace-nowrap">
                                <p className="text-xs text-gray-600">
                                  {new Date(txn.createdAt).toLocaleDateString('en-GB', {
                                    day: '2-digit', month: 'short', year: 'numeric',
                                  })}
                                </p>
                              </td>
                              <td className="px-4 py-3">
                                <Badge color={txn.status === 'success' ? 'green' : txn.status === 'pending' ? 'gray' : 'red'}>
                                  {txn.status}
                                </Badge>
                              </td>
                              <td className="px-4 py-3 text-right whitespace-nowrap">
                                <p className={`text-sm font-bold ${isCredit ? 'text-green-600' : 'text-gray-800'}`}>
                                  {isCredit ? '+' : '-'}{formatCurrency(txn.amount, txn.currency)}
                                </p>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </>
      )}

      <Modal isOpen={showWithdraw} onClose={() => setShowWithdraw(false)} title="Withdraw Funds">
        {selectedShopId && (
          <WithdrawModal
            shopId={selectedShopId}
            balance={activeBalance}
            onClose={() => setShowWithdraw(false)}
          />
        )}
      </Modal>
    </div>
  );
}
