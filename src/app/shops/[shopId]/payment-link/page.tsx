'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Link as LinkIcon, Plus, Copy, CheckCircle, Power, Trash2, ExternalLink,
  ToggleLeft, ToggleRight,
} from 'lucide-react';
import { paymentLinksStore } from '@/lib/store';
import { formatCurrency, SHORT_STOREFRONT_URL } from '@/lib/dummy-data';
import type { PaymentLink } from '@/types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Spinner from '@/components/ui/Spinner';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';

function CreateLinkForm({ shopId, onClose }: { shopId: string; onClose: () => void }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    title: '', description: '', amount: '', slug: '',
    allowCustomAmount: false, maxUses: '', expiresAt: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const autoSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const handleSave = async () => {
    if (!form.title.trim()) { setError('Title is required'); return; }
    if (!form.allowCustomAmount && (!form.amount || parseFloat(form.amount) <= 0)) { setError('Amount must be greater than 0'); return; }
    setSaving(true);
    try {
      await paymentLinksStore.create(shopId, {
        title: form.title,
        description: form.description || undefined,
        amount: form.allowCustomAmount ? 0 : parseFloat(form.amount),
        currency: 'NGN',
        slug: form.slug || autoSlug(form.title) + '-' + Date.now().toString(36),
        allowCustomAmount: form.allowCustomAmount,
        maxUses: form.maxUses ? parseInt(form.maxUses) : undefined,
        expiresAt: form.expiresAt || undefined,
      });
      queryClient.invalidateQueries({ queryKey: ['payment-links', shopId] });
      onClose();
    } catch (err: any) {
      setError(err?.message ?? 'Failed to create link');
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <Input label="Link Title *" value={form.title} onChange={(e) => { set('title', e.target.value); if (!form.slug) set('slug', autoSlug(e.target.value)); }} placeholder="Custom Order Deposit" />
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1.5">Description (optional)</label>
        <textarea rows={2} className="w-full rounded-xl border border-primary-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none" placeholder="What is this payment for?" value={form.description} onChange={(e) => set('description', e.target.value)} />
      </div>
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => set('allowCustomAmount', !form.allowCustomAmount)} className={`w-10 h-6 rounded-full transition-colors ${form.allowCustomAmount ? 'bg-primary' : 'bg-gray-200'}`}>
          <div className={`w-4 h-4 rounded-full bg-white mx-0.5 transition-transform ${form.allowCustomAmount ? 'translate-x-4' : 'translate-x-0'}`} />
        </button>
        <label className="text-sm text-gray-700">Allow customer to enter custom amount</label>
      </div>
      {!form.allowCustomAmount && (
        <Input label="Amount (NGN) *" type="number" min="1" value={form.amount} onChange={(e) => set('amount', e.target.value)} placeholder="5000" />
      )}
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1.5">URL Slug</label>
        <div className="flex items-center rounded-xl border border-primary-200 overflow-hidden">
          <span className="px-3 py-2.5 bg-gray-50 text-gray-400 text-xs border-r border-primary-200 whitespace-nowrap">pay.digittally.com/</span>
          <input className="flex-1 px-3 py-2.5 text-sm bg-white outline-none" placeholder="auto-generated" value={form.slug} onChange={(e) => set('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input label="Max Uses (optional)" type="number" min="1" value={form.maxUses} onChange={(e) => set('maxUses', e.target.value)} placeholder="Unlimited" />
        <Input label="Expires At (optional)" type="date" value={form.expiresAt} onChange={(e) => set('expiresAt', e.target.value)} />
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}

      <div className="flex gap-3">
        <Button variant="secondary" size="md" onClick={onClose} className="flex-1">Cancel</Button>
        <Button variant="primary" size="md" onClick={handleSave} loading={saving} className="flex-1">
          <LinkIcon className="w-4 h-4 mr-1.5" />
          Create Link
        </Button>
      </div>
    </div>
  );
}

function PaymentLinkCard({ link, shopId }: { link: PaymentLink; shopId: string }) {
  const queryClient = useQueryClient();
  const [copied, setCopied] = useState(false);

  const linkUrl = `${SHORT_STOREFRONT_URL}/pay/${link.slug}`;

  const copy = () => {
    navigator.clipboard.writeText(linkUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleMutation = useMutation({
    mutationFn: () => paymentLinksStore.toggle(link.id, !link.isActive),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['payment-links', shopId] }),
  });

  const deleteMutation = useMutation({
    mutationFn: () => paymentLinksStore.delete(link.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['payment-links', shopId] }),
  });

  return (
    <div className={`bg-white rounded-2xl border shadow-card p-4 transition-all ${link.isActive ? 'border-primary-100' : 'border-gray-100 opacity-60'}`}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <p className="font-semibold text-gray-900 text-sm">{link.title}</p>
          {link.description && <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{link.description}</p>}
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <Badge color={link.isActive ? 'green' : 'gray'}>{link.isActive ? 'Active' : 'Paused'}</Badge>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <p className="text-lg font-bold text-gray-900">
          {link.allowCustomAmount ? 'Custom amount' : formatCurrency(link.amount, link.currency)}
        </p>
        <p className="text-xs text-gray-400">{link.uses} use{link.uses !== 1 ? 's' : ''}{link.maxUses ? ` / ${link.maxUses}` : ''}</p>
      </div>

      <div className="flex items-center gap-2 bg-primary-50 border border-primary-100 rounded-lg px-2.5 py-1.5 mb-3">
        <span className="text-xs text-gray-500 font-mono truncate flex-1">{linkUrl}</span>
        <button onClick={copy} className="text-primary hover:text-primary-dark transition-colors flex-shrink-0">
          {copied ? <CheckCircle className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
        <a href={linkUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-dark flex-shrink-0">
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={() => toggleMutation.mutate()}
          className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${link.isActive ? 'text-amber-600 hover:text-amber-700' : 'text-green-600 hover:text-green-700'}`}
        >
          {link.isActive
            ? <><ToggleRight className="w-3.5 h-3.5" />Pause</>
            : <><ToggleLeft className="w-3.5 h-3.5" />Activate</>
          }
        </button>
        <button onClick={() => deleteMutation.mutate()} className="text-gray-300 hover:text-red-500 transition-colors p-1 rounded hover:bg-red-50">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export default function PaymentLinkPage() {
  const params = useParams<{ shopId: string }>();
  const shopId = params.shopId;
  const [showCreate, setShowCreate] = useState(false);

  const { data: links, isLoading } = useQuery<PaymentLink[]>({
    queryKey: ['payment-links', shopId],
    queryFn: () => paymentLinksStore.list(shopId),
  });

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Payment Links</h2>
          <p className="text-sm text-gray-500">Create shareable links to collect payments instantly</p>
        </div>
        <Button variant="primary" size="md" onClick={() => setShowCreate(true)}>
          <Plus className="w-4 h-4 mr-1.5" />
          New Link
        </Button>
      </div>

      {/* How it works */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-6">
        <p className="font-semibold text-blue-800 text-sm mb-1 flex items-center gap-2">
          <LinkIcon className="w-4 h-4" />
          How payment links work
        </p>
        <p className="text-xs text-blue-700 leading-relaxed">
          Generate a unique link, share it on WhatsApp, Instagram, or via email. Customers click it, pay the fixed amount (or enter their own), and you see it in your wallet — no shop visit needed.
        </p>
      </div>

      {isLoading && <div className="flex justify-center py-12"><Spinner size="lg" /></div>}

      {!isLoading && (!links || links.length === 0) && (
        <div className="flex flex-col items-center py-16 text-center">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-3">
            <LinkIcon className="w-7 h-7 text-primary" />
          </div>
          <p className="font-semibold text-gray-900 mb-1">No payment links yet</p>
          <p className="text-sm text-gray-400 mb-5">Create your first link to start collecting payments instantly.</p>
          <Button variant="primary" size="md" onClick={() => setShowCreate(true)}>
            <Plus className="w-4 h-4 mr-1.5" />
            Create First Link
          </Button>
        </div>
      )}

      {!isLoading && links && links.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {links.map((link) => (
            <PaymentLinkCard key={link.id} link={link} shopId={shopId} />
          ))}
        </div>
      )}

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create Payment Link">
        <CreateLinkForm shopId={shopId} onClose={() => setShowCreate(false)} />
      </Modal>
    </div>
  );
}
