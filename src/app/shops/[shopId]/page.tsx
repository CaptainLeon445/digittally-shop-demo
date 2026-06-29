'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ExternalLink, Save, Globe, Phone, Instagram, Twitter, Facebook,
  Copy, CheckCircle, Calendar, Link2, Clock, Hotel, Wrench,
  Package, Video, MapPin, Download, QrCode,
} from 'lucide-react';
import { shopsStore } from '@/lib/store';
import { SHORT_STOREFRONT_URL } from '@/lib/dummy-data';
import type { Shop, ShopType } from '@/types';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Spinner from '@/components/ui/Spinner';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const TYPE_EXTRA_TAB: Record<ShopType, { id: string; label: string; icon: React.ElementType }> = {
  online_vendor: { id: 'policies', label: 'Store Policies', icon: Package },
  consultation: { id: 'booking', label: 'Booking & Calendly', icon: Calendar },
  hospitality: { id: 'property', label: 'Property Settings', icon: Hotel },
  service: { id: 'service', label: 'Service Setup', icon: Wrench },
};

const COMMON_TABS = [
  { id: 'branding', label: 'Branding & Theme' },
  { id: 'content', label: 'Hero Content' },
  { id: 'contact', label: 'Contact Info' },
  { id: 'social', label: 'Social Links' },
] as const;

const AMENITY_OPTIONS = [
  'Free WiFi', 'Parking', 'Swimming Pool', 'Gym', 'Generator', '24hr Security',
  'Restaurant', 'Bar', 'Laundry', 'Airport Shuttle', 'Breakfast Included', 'CCTV',
];

export default function ShopCustomisePage() {
  const params = useParams<{ shopId: string }>();
  const shopId = params.shopId;
  const queryClient = useQueryClient();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('branding');

  const { data: shop, isLoading } = useQuery<Shop>({
    queryKey: ['shop', shopId],
    queryFn: () => shopsStore.get(shopId),
  });

  const [form, setForm] = useState<Partial<Shop>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (shop) setForm({});
  }, [shop]);

  const mutation = useMutation({
    mutationFn: (data: Partial<Shop>) => shopsStore.update(shopId, data),
    onSuccess: (updated) => {
      queryClient.setQueryData(['shop', shopId], updated);
      queryClient.invalidateQueries({ queryKey: ['shops'] });
      setForm({});
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    },
  });

  if (isLoading) return <div className="flex justify-center py-16"><Spinner size="lg" /></div>;
  if (!shop) return <p className="text-center py-16 text-gray-400">Shop not found.</p>;

  const merged: Shop = { ...shop, ...form, theme: { ...shop.theme, ...(form.theme ?? {}) }, socialLinks: { ...shop.socialLinks, ...form.socialLinks } };
  const storefrontUrl = `${SHORT_STOREFRONT_URL}/${shop.slug}`;
  const hasChanges = Object.keys(form).length > 0;

  const set = (key: string, value: any) => setForm((f) => ({ ...f, [key]: value }));
  const setTheme = (key: string, value: string) => setForm((f) => ({ ...f, theme: { ...merged.theme, [key]: value } }));
  const setSocial = (key: string, value: string) => setForm((f) => ({ ...f, socialLinks: { ...merged.socialLinks, [key]: value } }));
  const toggleDay = (day: number) => {
    const days = merged.availableDays ?? [1, 2, 3, 4, 5];
    const next = days.includes(day) ? days.filter((d) => d !== day) : [...days, day].sort();
    set('availableDays', next);
  };
  const toggleAmenity = (amenity: string) => {
    const current = merged.featuredAmenities ?? [];
    const next = current.includes(amenity) ? current.filter((a) => a !== amenity) : [...current, amenity];
    set('featuredAmenities', next);
  };

  const handleSave = () => mutation.mutate(form);
  const copyUrl = () => {
    navigator.clipboard.writeText(storefrontUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const extraTab = TYPE_EXTRA_TAB[shop.type];
  const allTabs = [...COMMON_TABS, extraTab] as { id: string; label: string }[];

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
          disabled={!hasChanges}
        >
          {saved ? <><CheckCircle className="w-4 h-4 mr-1.5" />Saved!</> : <><Save className="w-4 h-4 mr-1.5" />Save Changes</>}
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Editor */}
        <div className="xl:col-span-2 space-y-4">
          {/* Sub-tabs */}
          <div className="flex gap-1 p-1 bg-white rounded-xl border border-primary-100 w-fit overflow-x-auto">
            {allTabs.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${activeTab === id ? 'bg-primary text-white' : 'text-gray-500 hover:text-primary'}`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Branding */}
          {activeTab === 'branding' && (
            <div className="bg-white rounded-2xl border border-primary-100 shadow-card p-6 space-y-5">
              <p className="section-label">Branding & Theme</p>
              <Input label="Shop Name" value={merged.name ?? ''} onChange={(e) => set('name', e.target.value)} />
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Logo URL</label>
                <input type="url" className="input-field w-full" placeholder="https://example.com/logo.png"
                  value={merged.logoUrl ?? ''} onChange={(e) => set('logoUrl', e.target.value)} />
                {merged.logoUrl && <img src={merged.logoUrl} alt="Logo" className="mt-2 w-12 h-12 rounded-xl object-cover border border-primary-100" />}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Banner Image URL</label>
                <input type="url" className="input-field w-full" placeholder="https://example.com/banner.jpg"
                  value={merged.bannerUrl ?? ''} onChange={(e) => set('bannerUrl', e.target.value)} />
                {merged.bannerUrl && <img src={merged.bannerUrl} alt="Banner" className="mt-2 w-full h-20 rounded-xl object-cover border border-primary-100" />}
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

          {/* Hero Content */}
          {activeTab === 'content' && (
            <div className="bg-white rounded-2xl border border-primary-100 shadow-card p-6 space-y-4">
              <p className="section-label">Hero Content</p>
              <Input label="Hero Headline" placeholder="Your compelling headline" value={merged.theme?.heroHeadline ?? ''} onChange={(e) => setTheme('heroHeadline', e.target.value)} />
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Hero Subtext</label>
                <textarea rows={2} className="input-field w-full resize-none" placeholder="A short description to connect with visitors"
                  value={merged.theme?.heroSubtext ?? ''} onChange={(e) => setTheme('heroSubtext', e.target.value)} />
              </div>
              <Input label="CTA Button Text" placeholder="Shop Now / Book Now / Get Quote"
                value={merged.theme?.heroCtaText ?? ''} onChange={(e) => setTheme('heroCtaText', e.target.value)} />
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Shop Description</label>
                <textarea rows={3} className="input-field w-full resize-none" placeholder="Tell customers what you offer"
                  value={merged.description ?? ''} onChange={(e) => set('description', e.target.value)} />
              </div>
            </div>
          )}

          {/* Contact */}
          {activeTab === 'contact' && (
            <div className="bg-white rounded-2xl border border-primary-100 shadow-card p-6 space-y-4">
              <p className="section-label">Contact Information</p>
              <Input label="Business Name" value={merged.businessName ?? ''} onChange={(e) => set('businessName', e.target.value)} />
              <Input label="Contact Email" type="email" value={merged.contactEmail ?? ''} onChange={(e) => set('contactEmail', e.target.value)} />
              <Input label="Contact Phone" value={merged.contactPhone ?? ''} onChange={(e) => set('contactPhone', e.target.value)} />
              <Input label="Address / Location" value={merged.address ?? ''} onChange={(e) => set('address', e.target.value)} />
            </div>
          )}

          {/* Social */}
          {activeTab === 'social' && (
            <div className="bg-white rounded-2xl border border-primary-100 shadow-card p-6 space-y-4">
              <p className="section-label">Social Links</p>
              {[
                { key: 'instagram', label: 'Instagram Handle', icon: Instagram, placeholder: 'yourhandle' },
                { key: 'twitter', label: 'Twitter / X Handle', icon: Twitter, placeholder: 'yourhandle' },
                { key: 'facebook', label: 'Facebook Page', icon: Facebook, placeholder: 'yourpage' },
                { key: 'whatsapp', label: 'WhatsApp Number', icon: Phone, placeholder: '+234 801 234 5678' },
              ].map(({ key, label, icon: Icon, placeholder }) => (
                <div key={key}>
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5 mb-1.5">
                    <Icon className="w-3.5 h-3.5" />{label}
                  </label>
                  <input className="input-field w-full" placeholder={placeholder}
                    value={(merged.socialLinks as any)?.[key] ?? ''} onChange={(e) => setSocial(key, e.target.value)} />
                </div>
              ))}
            </div>
          )}

          {/* ── Type-specific tabs ── */}

          {/* Online Vendor: Store Policies */}
          {activeTab === 'policies' && shop.type === 'online_vendor' && (
            <div className="bg-white rounded-2xl border border-primary-100 shadow-card p-6 space-y-4">
              <p className="section-label">Store Policies</p>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Shipping Policy</label>
                <textarea rows={4} className="input-field w-full resize-none"
                  placeholder="Describe your shipping options, delivery timelines, and fees..."
                  value={(merged as any).shippingPolicy ?? ''}
                  onChange={(e) => set('shippingPolicy', e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Return & Refund Policy</label>
                <textarea rows={4} className="input-field w-full resize-none"
                  placeholder="Describe your return conditions, exchange policy, and refund process..."
                  value={(merged as any).returnPolicy ?? ''}
                  onChange={(e) => set('returnPolicy', e.target.value)} />
              </div>
            </div>
          )}

          {/* Consultation: Booking & Calendly */}
          {activeTab === 'booking' && shop.type === 'consultation' && (
            <div className="bg-white rounded-2xl border border-primary-100 shadow-card p-6 space-y-5">
              <p className="section-label">Booking & Calendly Integration</p>

              {/* Calendly */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <p className="text-sm font-semibold text-blue-800">Calendly Integration</p>
                </div>
                <p className="text-xs text-blue-700 mb-3">Connect your Calendly account so clients can book directly on your storefront.</p>
                <Input label="Your Calendly URL"
                  placeholder="https://calendly.com/your-name"
                  value={merged.calendlyUrl ?? ''}
                  onChange={(e) => set('calendlyUrl', e.target.value)} />
              </div>

              {/* Default meeting link */}
              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5 mb-1.5">
                  <Video className="w-3.5 h-3.5" />Default Virtual Meeting Link
                </label>
                <input className="input-field w-full" placeholder="https://meet.google.com/xxx or https://zoom.us/j/xxx"
                  value={merged.meetingLink ?? ''} onChange={(e) => set('meetingLink', e.target.value)} />
                <p className="text-xs text-gray-400 mt-1">Used when a client books a virtual session without a service-specific link.</p>
              </div>

              {/* Booking slot */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5 mb-1.5">
                    <Clock className="w-3.5 h-3.5" />Default Slot Duration (mins)
                  </label>
                  <input type="number" min="15" step="15" className="input-field w-full"
                    value={merged.bookingSlotMinutes ?? 60}
                    onChange={(e) => set('bookingSlotMinutes', parseInt(e.target.value) || 60)} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Max Daily Bookings</label>
                  <input type="number" min="1" className="input-field w-full"
                    value={merged.maxDailyBookings ?? 8}
                    onChange={(e) => set('maxDailyBookings', parseInt(e.target.value) || 8)} />
                </div>
              </div>

              {/* Availability */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Available Days</label>
                <div className="flex gap-2 flex-wrap">
                  {DAYS.map((day, i) => (
                    <button key={day} type="button" onClick={() => toggleDay(i)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${(merged.availableDays ?? [1,2,3,4,5]).includes(i) ? 'bg-primary text-white border-primary' : 'bg-white text-gray-500 border-gray-200 hover:border-primary'}`}>
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Start Time</label>
                  <input type="time" className="input-field w-full"
                    value={merged.availableHours?.start ?? '09:00'}
                    onChange={(e) => set('availableHours', { ...merged.availableHours, start: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">End Time</label>
                  <input type="time" className="input-field w-full"
                    value={merged.availableHours?.end ?? '17:00'}
                    onChange={(e) => set('availableHours', { ...merged.availableHours, end: e.target.value })} />
                </div>
              </div>

              <Input label="Advance Booking (days ahead)" type="number" min="1"
                value={merged.bookingAdvanceDays ?? 14}
                onChange={(e) => set('bookingAdvanceDays', parseInt(e.target.value) || 14)} />
            </div>
          )}

          {/* Hospitality: Property Settings */}
          {activeTab === 'property' && shop.type === 'hospitality' && (
            <div className="bg-white rounded-2xl border border-primary-100 shadow-card p-6 space-y-5">
              <p className="section-label">Property Settings</p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5 mb-1.5">
                    <Clock className="w-3.5 h-3.5" />Check-in Time
                  </label>
                  <input type="time" className="input-field w-full"
                    value={merged.checkInTime ?? '14:00'}
                    onChange={(e) => set('checkInTime', e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5 mb-1.5">
                    <Clock className="w-3.5 h-3.5" />Check-out Time
                  </label>
                  <input type="time" className="input-field w-full"
                    value={merged.checkOutTime ?? '11:00'}
                    onChange={(e) => set('checkOutTime', e.target.value)} />
                </div>
              </div>

              <Input label="Minimum Stay (nights)" type="number" min="1"
                value={merged.minStayNights ?? 1}
                onChange={(e) => set('minStayNights', parseInt(e.target.value) || 1)} />

              <Input label="Booking Advance (days ahead)" type="number" min="1"
                value={merged.bookingAdvanceDays ?? 90}
                onChange={(e) => set('bookingAdvanceDays', parseInt(e.target.value) || 90)} />

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Featured Amenities</label>
                <div className="flex flex-wrap gap-2">
                  {AMENITY_OPTIONS.map((a) => (
                    <button key={a} type="button" onClick={() => toggleAmenity(a)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${(merged.featuredAmenities ?? []).includes(a) ? 'bg-primary text-white border-primary' : 'bg-white text-gray-500 border-gray-200 hover:border-primary'}`}>
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">House Rules</label>
                <textarea rows={3} className="input-field w-full resize-none"
                  placeholder="No smoking, quiet hours 10pm–7am, etc."
                  value={merged.houseRules ?? ''}
                  onChange={(e) => set('houseRules', e.target.value)} />
              </div>
            </div>
          )}

          {/* Service: Service Setup */}
          {activeTab === 'service' && shop.type === 'service' && (
            <div className="bg-white rounded-2xl border border-primary-100 shadow-card p-6 space-y-5">
              <p className="section-label">Service Setup</p>

              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5 mb-1.5">
                  <MapPin className="w-3.5 h-3.5" />Service Areas
                </label>
                <input className="input-field w-full"
                  placeholder="e.g. Lekki, VI, Ikoyi, Surulere"
                  value={(merged as any).serviceArea ?? ''}
                  onChange={(e) => set('serviceArea', e.target.value)} />
                <p className="text-xs text-gray-400 mt-1">Comma-separated list of areas you serve.</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5 mb-1.5">
                    <Clock className="w-3.5 h-3.5" />Start Time
                  </label>
                  <input type="time" className="input-field w-full"
                    value={merged.availableHours?.start ?? '07:00'}
                    onChange={(e) => set('availableHours', { ...merged.availableHours, start: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">End Time</label>
                  <input type="time" className="input-field w-full"
                    value={merged.availableHours?.end ?? '18:00'}
                    onChange={(e) => set('availableHours', { ...merged.availableHours, end: e.target.value })} />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Working Days</label>
                <div className="flex gap-2 flex-wrap">
                  {DAYS.map((day, i) => (
                    <button key={day} type="button" onClick={() => toggleDay(i)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${(merged.availableDays ?? [1,2,3,4,5,6]).includes(i) ? 'bg-primary text-white border-primary' : 'bg-white text-gray-500 border-gray-200 hover:border-primary'}`}>
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input label="Max Daily Bookings" type="number" min="1"
                  value={merged.maxDailyBookings ?? 12}
                  onChange={(e) => set('maxDailyBookings', parseInt(e.target.value) || 12)} />
                <Input label="Lead Time (hours)" type="number" min="1"
                  value={merged.bookingAdvanceDays ?? 1}
                  onChange={(e) => set('bookingAdvanceDays', parseInt(e.target.value) || 1)} />
              </div>
            </div>
          )}
        </div>

        {/* Live Preview */}
        <div className="xl:col-span-1">
          <div className="sticky top-20 bg-white rounded-2xl border border-primary-100 shadow-card overflow-hidden">
            <div className="px-4 py-3 border-b border-primary-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-semibold text-gray-600">Storefront Preview</span>
              </div>
              <a href={`/shops/${shopId}/preview`} className="text-[10px] text-primary hover:underline flex items-center gap-1">
                <ExternalLink className="w-3 h-3" />Full preview
              </a>
            </div>
            {/* Mini preview */}
            <div className="text-xs">
              {/* Banner */}
              <div
                className="h-16 relative"
                style={merged.bannerUrl ? {
                  backgroundImage: `url(${merged.bannerUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                } : {
                  background: `linear-gradient(135deg, ${merged.theme?.primaryColor ?? '#0b7d8e'}, #052e36)`,
                }}
              >
                <div className="absolute inset-0 bg-black/25" />
                <div className="absolute inset-0 flex items-center justify-center px-2">
                  <p className="font-bold text-white text-[10px] text-center leading-tight line-clamp-2">
                    {merged.theme?.heroHeadline || 'Your Headline Here'}
                  </p>
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

                {/* Type-specific preview hints */}
                {shop.type === 'consultation' && merged.calendlyUrl && (
                  <div className="mt-2 flex items-center gap-1 text-[9px] text-blue-600 bg-blue-50 rounded-lg px-2 py-1">
                    <Link2 className="w-2.5 h-2.5" />Calendly connected
                  </div>
                )}
                {shop.type === 'hospitality' && (
                  <div className="mt-2 flex items-center gap-1 text-[9px] text-teal-600 bg-teal-50 rounded-lg px-2 py-1">
                    <Clock className="w-2.5 h-2.5" />Check-in {merged.checkInTime ?? '14:00'} · Check-out {merged.checkOutTime ?? '11:00'}
                  </div>
                )}

                <button
                  className="mt-2 px-3 py-1 rounded-lg text-white text-[10px] font-semibold"
                  style={{ background: merged.theme?.accentColor ?? '#f59e0b' }}
                >
                  {merged.theme?.heroCtaText || 'Get Started'}
                </button>
              </div>
            </div>

            {/* QR Code */}
            {shop && (
              <div className="px-4 pb-4 pt-3 border-t border-primary-50">
                <div className="flex items-center gap-2 mb-2.5">
                  <QrCode className="w-3 h-3 text-gray-400" />
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">QR Code</p>
                </div>
                <div className="flex items-center gap-3">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(`${SHORT_STOREFRONT_URL}/s/${shop.slug}`)}&margin=5&color=${(merged.theme?.primaryColor ?? '#0b7d8e').replace('#', '')}`}
                    alt="QR code"
                    className="w-16 h-16 rounded-xl border border-primary-100 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] text-gray-400 truncate mb-1.5">{SHORT_STOREFRONT_URL}/s/{shop.slug}</p>
                    <button
                      onClick={() => {
                        const url = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(`${SHORT_STOREFRONT_URL}/s/${shop.slug}`)}&margin=15&color=${(merged.theme?.primaryColor ?? '#0b7d8e').replace('#', '')}`;
                        fetch(url).then((r) => r.blob()).then((blob) => {
                          const a = document.createElement('a');
                          a.href = URL.createObjectURL(blob);
                          a.download = `${shop.slug}-qr.png`;
                          a.click();
                        }).catch(() => window.open(url, '_blank'));
                      }}
                      className="flex items-center gap-1 text-[10px] text-primary font-semibold hover:underline"
                    >
                      <Download className="w-2.5 h-2.5" />Download PNG
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
