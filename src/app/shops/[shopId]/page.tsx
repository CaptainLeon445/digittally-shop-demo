'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ExternalLink, Edit2, Check, X } from 'lucide-react';
import { shopsApi } from '@/lib/api';
import { Shop } from '@/types/shop';
import ShopQRCode from '@/components/shops/ShopQRCode';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Spinner from '@/components/ui/Spinner';

const STOREFRONT_BASE = process.env.NEXT_PUBLIC_STOREFRONT_URL || 'https://store.digit-tally.io';

export default function ShopOverviewPage() {
  const params = useParams<{ shopId: string }>();
  const shopId = params.shopId;
  const queryClient = useQueryClient();

  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editError, setEditError] = useState<string | null>(null);

  const { data: shop, isLoading } = useQuery<Shop>({
    queryKey: ['shop', shopId],
    queryFn: () => shopsApi.get(shopId),
  });

  const updateMutation = useMutation({
    mutationFn: (data: { name: string; description?: string }) =>
      shopsApi.update(shopId, data),
    onSuccess: (updated) => {
      queryClient.setQueryData(['shop', shopId], updated);
      queryClient.invalidateQueries({ queryKey: ['shops'] });
      setEditing(false);
    },
    onError: (err: any) => {
      setEditError(err?.response?.data?.message ?? 'Update failed');
    },
  });

  const startEdit = () => {
    if (!shop) return;
    setEditName(shop.name);
    setEditDescription(shop.description ?? '');
    setEditError(null);
    setEditing(true);
  };

  const saveEdit = () => {
    updateMutation.mutate({
      name: editName,
      description: editDescription || undefined,
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!shop) {
    return <p className="text-gray-500 text-center py-16">Shop not found.</p>;
  }

  const storefrontUrl = `${STOREFRONT_BASE}/${shop.slug}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left: Shop info */}
      <div className="lg:col-span-2 space-y-4">
        {/* Shop details card */}
        <div className="bg-white rounded-2xl border border-primary-100 shadow-card p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              {editing ? (
                <div className="space-y-4">
                  <Input label="Shop Name" value={editName} onChange={(e) => setEditName(e.target.value)} />
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1.5">Description</label>
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      rows={3}
                      className="w-full rounded-xl border border-primary-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none"
                    />
                  </div>
                  {editError && <p className="text-xs text-red-600">{editError}</p>}
                  <div className="flex gap-2">
                    <Button size="sm" variant="primary" onClick={saveEdit} loading={updateMutation.isPending}>
                      <Check className="w-4 h-4 mr-1" /> Save
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => setEditing(false)}>
                      <X className="w-4 h-4 mr-1" /> Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h2 className="text-lg font-bold text-gray-900">{shop.name}</h2>
                    <Badge color={shop.status === 'active' ? 'green' : 'gray'}>{shop.status}</Badge>
                    <Badge color="primary">{shop.currency}</Badge>
                  </div>
                  {shop.businessName && <p className="text-sm text-gray-500">{shop.businessName}</p>}
                  {shop.description && <p className="text-sm text-gray-600 mt-2 leading-relaxed">{shop.description}</p>}
                </>
              )}
            </div>
            {!editing && (
              <Button variant="ghost" size="sm" onClick={startEdit}>
                <Edit2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Storefront link card */}
        <div className="bg-white rounded-2xl border border-primary-100 shadow-card p-6">
          <p className="section-label">Storefront URL</p>
          <div className="flex items-center gap-3 bg-primary-50 border border-primary-100 rounded-xl px-4 py-3">
            <span className="text-sm font-mono text-gray-700 flex-1 truncate">{storefrontUrl}</span>
            <a href={storefrontUrl} target="_blank" rel="noopener noreferrer"
              className="text-primary hover:text-primary-dark flex-shrink-0 transition-colors" aria-label="Open storefront">
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Shop metadata */}
        <div className="bg-white rounded-2xl border border-primary-100 shadow-card p-6">
          <p className="section-label">Details</p>
          <dl className="space-y-3 text-sm">
            {[
              { label: 'Slug',     value: <span className="font-mono text-gray-700">/{shop.slug}</span> },
              { label: 'Currency', value: <span className="font-medium text-gray-700">{shop.currency}</span> },
              { label: 'Status',   value: <Badge color={shop.status === 'active' ? 'green' : 'gray'}>{shop.status}</Badge> },
              ...(shop.locationId ? [{ label: 'Location ID', value: <span className="font-mono text-xs text-gray-400">{shop.locationId}</span> }] : []),
              { label: 'Created',  value: <span className="text-gray-700">{new Date(shop.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span> },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between py-1.5 border-b border-primary-50 last:border-0">
                <dt className="text-gray-400 text-xs font-medium uppercase tracking-wide">{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Right: QR Code */}
      <div>
        <div className="bg-white rounded-2xl border border-primary-100 shadow-card p-6">
          <p className="section-label text-center">Share Your Shop</p>
          <ShopQRCode url={storefrontUrl} shopName={shop.name} />
        </div>
      </div>
    </div>
  );
}
