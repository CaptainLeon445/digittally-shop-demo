'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ExternalLink, Save, Palette, Globe, Phone, Mail,
  Instagram, Twitter, Facebook, Copy, CheckCircle,
} from 'lucide-react';
import { shopsStore } from '@/lib/store';
import { SHORT_STOREFRONT_URL } from '@/lib/dummy-data';
import type { Shop } from '@/types';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Spinner from '@/components/ui/Spinner';

export default function ShopCustomisePage() {
  const params = useParams<{ shopId: string }>();
  const shopId = params.shopId;
  const queryClient = useQueryClient();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'branding' | 'content' | 'contact' | 'social'>('branding');

  const { data: shop, isLoading } = useQuery<Shop>({
    queryKey: ['shop', shopId],
    queryFn: () => shopsStore.get(shopId),
  });

  const [form, setForm] = useState<Partial<Shop>>({});
  const [saved, setSaved] = useState(false);

  const mutation = useMutation({
    mutationFn: (data: Partial<Shop>) => shopsStore.update(shopId, data),
    onSuccess: (updated) => {
      queryClient.setQueryData(['shop', shopId], updated);
      queryClient.invalidateQueries({ queryKey: ['shops'] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    },
  });

  if (isLoading) return <div className="flex justify-center py-16"><Spinner size="lg" /></div>;
  if (!shop) return <p className="text-center py-16 text-gray-400">Shop not found.</p>;

  const merged = { ...shop, ...form };
  const storefrontUrl = `${SHORT_STOREFRONT_URL}/${shop.slug}`;

  const set = (key: string, value: any) => setForm((f) => ({ ...f, [key]: value }));
  const setTheme = (key: string, value: string) => setForm((f) => ({ ...f, theme: { ...merged.theme, [key]: value } }));
  const setSocial = (key: string, value: string) => setForm((f) => ({ ...f, socialLinks: { ...merged.socialLinks, [key]: value } }));

  const handleSave = () => mutation.mutate(form);

  const copyUrl = () => {
    navigator.clipboard.writeText(storefrontUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const TABS = [
    { id: 'branding', label: 'Branding & Theme' },
    { id: 'content', label: 'Hero Content' },
    { id: 'contact', label: 'Contact Info' },
    { id: 'social', label: 'Social Links' },
  ] as const;

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-gray-900">{shop.name}</h1>
            <Badge color={shop.status === 'active' ? 'green' : 'gray'}>{shop.status}</Badge>
          </div>
          <div className="flex items-center gap-2 bg-primary-50 border border-primary-100 rounded-lg px-3 py-1.5 w-fit">
            <span className="text-xs font-mono text-gray-700 truncate max-w-xs">{storefrontUrl}</span>
            <button onClick={copyUrl} className="text-primary hover:text-primary-dark transition-colors flex-shrink-0">
              {copied ? <CheckCircle className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <a href={storefrontUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-dark flex-shrink-0">
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={handleSave}
          loading={mutation.isPending}
          disabled={Object.keys(form).length === 0}
        >
          {saved ? <><CheckCircle className="w-4 h-4 mr-1.5" />Saved!</> : <><Save className="w-4 h-4 mr-1.5" />Save Changes</>}
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Editor */}
        <div className="xl:col-span-2 space-y-4">
          {/* Sub-tabs */}
          <div className="flex gap-1 p-1 bg-white rounded-xl border border-primary-100 w-fit">
            {TABS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${activeTab === id ? 'bg-primary text-white' : 'text-gray-500 hover:text-primary'}`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Branding */}
          {activeTab === 'branding' && (
            <div className="bg-white rounded-2xl border border-primary-100 shadow-card p-6 space-y-5">
              <p className="section-label">Branding & Theme</p>
              <Input
                label="Shop Name"
                value={merged.name ?? ''}
                onChange={(e) => set('name', e.target.value)}
              />
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Logo URL</label>
                <input
                  type="url"
                  className="w-full rounded-xl border border-primary-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  placeholder="https://example.com/logo.png"
                  value={merged.logoUrl ?? ''}
                  onChange={(e) => set('logoUrl', e.target.value)}
                />
                {merged.logoUrl && (
                  <img src={merged.logoUrl} alt="Logo preview" className="mt-2 w-12 h-12 rounded-xl object-cover border border-primary-100" />
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Banner Image URL</label>
                <input
                  type="url"
                  className="w-full rounded-xl border border-primary-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  placeholder="https://example.com/banner.jpg"
                  value={merged.bannerUrl ?? ''}
                  onChange={(e) => set('bannerUrl', e.target.value)}
                />
                {merged.bannerUrl && (
                  <img src={merged.bannerUrl} alt="Banner preview" className="mt-2 w-full h-20 rounded-xl object-cover border border-primary-100" />
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Primary Color</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={merged.theme?.primaryColor ?? '#0b7d8e'} onChange={(e) => setTheme('primaryColor', e.target.value)} className="w-10 h-10 rounded-lg border border-primary-200 cursor-pointer p-0.5" />
                    <span className="text-sm font-mono text-gray-600">{merged.theme?.primaryColor ?? '#0b7d8e'}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Accent Color</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={merged.theme?.accentColor ?? '#f59e0b'} onChange={(e) => setTheme('accentColor', e.target.value)} className="w-10 h-10 rounded-lg border border-primary-200 cursor-pointer p-0.5" />
                    <span className="text-sm font-mono text-gray-600">{merged.theme?.accentColor ?? '#f59e0b'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Content */}
          {activeTab === 'content' && (
            <div className="bg-white rounded-2xl border border-primary-100 shadow-card p-6 space-y-4">
              <p className="section-label">Hero Content</p>
              <Input
                label="Hero Headline"
                placeholder="Wear Your Story"
                value={merged.theme?.heroHeadline ?? ''}
                onChange={(e) => setTheme('heroHeadline', e.target.value)}
              />
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Hero Subtext</label>
                <textarea
                  rows={2}
                  className="w-full rounded-xl border border-primary-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none"
                  placeholder="A short description to connect with visitors"
                  value={merged.theme?.heroSubtext ?? ''}
                  onChange={(e) => setTheme('heroSubtext', e.target.value)}
                />
              </div>
              <Input
                label="CTA Button Text"
                placeholder="Shop Now"
                value={merged.theme?.heroCtaText ?? ''}
                onChange={(e) => setTheme('heroCtaText', e.target.value)}
              />
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Shop Description</label>
                <textarea
                  rows={3}
                  className="w-full rounded-xl border border-primary-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none"
                  placeholder="Tell customers what your shop is about"
                  value={merged.description ?? ''}
                  onChange={(e) => set('description', e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Contact */}
          {activeTab === 'contact' && (
            <div className="bg-white rounded-2xl border border-primary-100 shadow-card p-6 space-y-4">
              <p className="section-label">Contact Information</p>
              <Input
                label="Business Name"
                value={merged.businessName ?? ''}
                onChange={(e) => set('businessName', e.target.value)}
              />
              <Input
                label="Contact Email"
                type="email"
                value={merged.contactEmail ?? ''}
                onChange={(e) => set('contactEmail', e.target.value)}
              />
              <Input
                label="Contact Phone"
                value={merged.contactPhone ?? ''}
                onChange={(e) => set('contactPhone', e.target.value)}
              />
              <Input
                label="Address / Location"
                value={merged.address ?? ''}
                onChange={(e) => set('address', e.target.value)}
              />
            </div>
          )}

          {/* Social */}
          {activeTab === 'social' && (
            <div className="bg-white rounded-2xl border border-primary-100 shadow-card p-6 space-y-4">
              <p className="section-label">Social Links</p>
              {[
                { key: 'instagram', label: 'Instagram Handle', icon: Instagram, placeholder: 'yourhandle' },
                { key: 'twitter', label: 'Twitter Handle', icon: Twitter, placeholder: 'yourhandle' },
                { key: 'facebook', label: 'Facebook Page', icon: Facebook, placeholder: 'yourpage' },
                { key: 'whatsapp', label: 'WhatsApp Number', icon: Phone, placeholder: '+234 801 234 5678' },
              ].map(({ key, label, icon: Icon, placeholder }) => (
                <div key={key}>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5 flex items-center gap-1.5">
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </label>
                  <input
                    className="w-full rounded-xl border border-primary-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    placeholder={placeholder}
                    value={(merged.socialLinks as any)?.[key] ?? ''}
                    onChange={(e) => setSocial(key, e.target.value)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Live Preview */}
        <div className="xl:col-span-1">
          <div className="sticky top-20 bg-white rounded-2xl border border-primary-100 shadow-card overflow-hidden">
            <div className="px-4 py-3 border-b border-primary-50 flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-semibold text-gray-600">Storefront Preview</span>
            </div>
            {/* Mini preview */}
            <div className="text-xs">
              {/* Banner */}
              <div
                className="h-16 relative"
                style={{
                  backgroundImage: merged.bannerUrl ? `url(${merged.bannerUrl})` : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  background: !merged.bannerUrl ? `linear-gradient(135deg, ${merged.theme?.primaryColor ?? '#0b7d8e'}, #052e36)` : undefined,
                }}
              >
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
                  <p className="font-bold text-white text-xs leading-tight">{merged.theme?.heroHeadline || 'Your Headline Here'}</p>
                </div>
              </div>
              {/* Shop info */}
              <div className="p-3">
                <div className="flex items-center gap-2 mb-2 -mt-6">
                  {merged.logoUrl ? (
                    <img src={merged.logoUrl} alt="" className="w-10 h-10 rounded-xl object-cover border-2 border-white shadow" />
                  ) : (
                    <div className="w-10 h-10 rounded-xl border-2 border-white shadow flex items-center justify-center" style={{ background: merged.theme?.primaryColor ?? '#0b7d8e' }}>
                      <Globe className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                <p className="font-bold text-gray-900 text-xs">{merged.name || 'Shop Name'}</p>
                <p className="text-gray-500 text-[10px] mt-0.5 line-clamp-2">{merged.description || 'Shop description appears here'}</p>
                <button
                  className="mt-2 px-3 py-1 rounded-lg text-white text-[10px] font-semibold"
                  style={{ background: merged.theme?.accentColor ?? '#f59e0b' }}
                >
                  {merged.theme?.heroCtaText || 'Shop Now'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
