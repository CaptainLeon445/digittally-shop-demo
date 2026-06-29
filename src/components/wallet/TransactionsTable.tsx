import { WalletTransaction } from '@/types/shop';
import Badge, { BadgeColor } from '@/components/ui/Badge';

interface TransactionsTableProps {
  transactions: WalletTransaction[];
}

const statusColor: Record<string, BadgeColor> = {
  pending: 'yellow',
  success: 'green',
  failed: 'red',
};

function formatPrice(amount: number, currency: string) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function TransactionsTable({ transactions }: TransactionsTableProps) {
  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-primary-100 shadow-card p-12 text-center">
        <p className="text-gray-500 font-medium">No transactions yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-primary-100 shadow-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-primary-100 bg-primary-50">
              <th className="text-left px-4 py-3 font-medium text-primary-dark/70 uppercase text-xs tracking-wide">Reference</th>
              <th className="text-left px-4 py-3 font-medium text-primary-dark/70 uppercase text-xs tracking-wide">Amount</th>
              <th className="text-left px-4 py-3 font-medium text-primary-dark/70 uppercase text-xs tracking-wide">Currency</th>
              <th className="text-left px-4 py-3 font-medium text-primary-dark/70 uppercase text-xs tracking-wide">Status</th>
              <th className="text-left px-4 py-3 font-medium text-primary-dark/70 uppercase text-xs tracking-wide">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary-50">
            {transactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-primary-50/50 transition-colors">
                <td className="px-4 py-3 font-mono text-xs text-gray-600">
                  {tx.paymentReference}
                </td>
                <td className="px-4 py-3 font-semibold text-gray-900">
                  {formatPrice(tx.amount, tx.currency)}
                </td>
                <td className="px-4 py-3">
                  <Badge color="primary">{tx.currency}</Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge color={statusColor[tx.status] ?? 'gray'}>
                    {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                  {formatDate(tx.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
