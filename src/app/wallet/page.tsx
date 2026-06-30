'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Wallet, ArrowDownRight, ArrowUpRight, Clock, TrendingUp, Send, Store,
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

const TXN_ICONS: Record<string, any> = {
  credit: ArrowDownRight, debit: ArrowUpRight, withdrawal: Send, fee: TrendingUp,
};
const TXN_COLORS: Record<string, string> = {
  credit: 'text-green-600 bg-green-50', debit: 'text-red-600 bg-red-50',
  withdrawal: 'text-blue-600 bg-blue-50', fee: 'text-orange-600 bg-orange-50',
};

export default function WalletPage() {
  const [selectedShopId, setSelectedShopId] = useState<string | null>(null);
  const [showWithdraw, setShowWithdraw] = useState(false);

  const { data: shops, isLoading: shopsLoading } = useQuery<Shop[]>({
    queryKey: ['shops'],
    queryFn: shopsStore.list,
  });

  const shopId = selectedShopId ?? shops?.[0]?.id ?? null;
  const selectedShop = shops?.find((s) => s.id === shopId);

  const { data: summary, isLoading: summaryLoading } = useQuery<WalletSummary>({
    queryKey: ['wallet', shopId],
    queryFn: () => walletStore.getSummary(shopId!),
    enabled: !!shopId,
  });

  const { data: transactions, isLoading: txnLoading } = useQuery<WalletTransaction[]>({
    queryKey: ['wallet-txns', shopId],
    queryFn: () => walletStore.getTransactions(shopId!),
    enabled: !!shopId,
  });

  if (shopsLoading) return <div className="flex justify-center py-16"><Spinner size="lg" /></div>;

  const isLoading = summaryLoading || txnLoading;

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
          {shops.map((shop) => (
            <button
              key={shop.id}
              onClick={() => setSelectedShopId(shop.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap flex-shrink-0 transition-all border ${
                shop.id === shopId
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

      {!shopId && (
        <div className="flex flex-col items-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Wallet className="w-8 h-8 text-primary" />
          </div>
          <p className="text-gray-500">Create a shop to start tracking your earnings.</p>
        </div>
      )}

      {shopId && (
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
                    value: formatCurrency(summary?.balance ?? 0, summary?.currency),
                    icon: Wallet, color: 'text-primary', bg: 'bg-primary-50 border-primary-100',
                    action: (
                      <Button size="sm" variant="primary" onClick={() => setShowWithdraw(true)} className="mt-2 w-full">
                        <Send className="w-3 h-3 mr-1" />Withdraw
                      </Button>
                    ),
                  },
                  { label: 'Total Earned', value: formatCurrency(summary?.totalEarned ?? 0, summary?.currency), icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50 border-green-100' },
                  { label: 'Total Withdrawn', value: formatCurrency(summary?.totalWithdrawn ?? 0, summary?.currency), icon: ArrowUpRight, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100' },
                  { label: 'Pending', value: formatCurrency(summary?.pendingAmount ?? 0, summary?.currency), icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100' },
                ].map(({ label, value, icon: Icon, color, bg, action }) => (
                  <div key={label} className={`rounded-2xl border p-4 ${bg}`}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <Icon className={`w-4 h-4 ${color}`} />
                      <p className="text-xs text-gray-500 font-medium">{label}</p>
                    </div>
                    <p className={`text-lg font-bold ${color}`}>{value}</p>
                    {action}
                  </div>
                ))}
              </div>

              {/* Transaction history */}
              <div>
                <p className="section-label mb-4">
                  Transaction History
                  {selectedShop && <span className="normal-case font-normal tracking-normal ml-1 text-gray-400">— {selectedShop.name}</span>}
                </p>
                {(!transactions || transactions.length === 0) ? (
                  <div className="flex flex-col items-center py-12 text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                      <Wallet className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-sm text-gray-500">No transactions yet for this shop</p>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-primary-100 shadow-card overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-primary-50">
                          {['', 'Description', 'Date', 'Status', 'Amount'].map((h, i) => (
                            <th key={i} className={`text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400 px-4 py-3 ${i === 4 ? 'text-right' : ''} ${i === 0 ? 'w-12' : ''}`}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map((txn) => {
                          const Icon = TXN_ICONS[txn.type] ?? ArrowDownRight;
                          const colorClass = TXN_COLORS[txn.type] ?? TXN_COLORS.credit;
                          const isCredit = txn.type === 'credit';
                          return (
                            <tr key={txn.id} className="border-b border-primary-50 last:border-0">
                              <td className="px-4 py-3">
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center ${colorClass}`}>
                                  <Icon className="w-3.5 h-3.5" />
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <p className="text-xs font-semibold text-gray-900">{txn.description}</p>
                                <p className="text-[10px] text-gray-400 font-mono">{txn.reference}</p>
                              </td>
                              <td className="px-4 py-3">
                                <p className="text-xs text-gray-600">
                                  {new Date(txn.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </p>
                              </td>
                              <td className="px-4 py-3">
                                <Badge color={txn.status === 'success' ? 'green' : txn.status === 'pending' ? 'gray' : 'red'}>
                                  {txn.status}
                                </Badge>
                              </td>
                              <td className="px-4 py-3 text-right">
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
        {shopId && (
          <WithdrawModal shopId={shopId} balance={summary?.balance ?? 0} onClose={() => setShowWithdraw(false)} />
        )}
      </Modal>
    </div>
  );
}
