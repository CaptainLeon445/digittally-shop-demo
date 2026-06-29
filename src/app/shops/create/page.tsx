import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import CreateShopForm from '@/components/shops/CreateShopForm';

export const metadata = {
  title: 'Create Shop | Digit-Tally',
};

export default function CreateShopPage() {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-7">
        <Link
          href="/shops"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-primary/70 hover:text-primary transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          All Shops
        </Link>
      </div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Create New Shop</h1>
        <p className="text-sm text-gray-500 mt-0.5">Set up a new online storefront</p>
      </div>

      <CreateShopForm />
    </div>
  );
}
