import Sidebar from '@/components/layout/Sidebar';
import AuthGuard from '@/components/layout/AuthGuard';

export const metadata = { title: 'Wallet | Digit-Tally' };

export default function WalletLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 ml-56 min-h-screen">
          <div className="max-w-6xl mx-auto px-6 py-7">{children}</div>
        </main>
      </div>
    </AuthGuard>
  );
}
