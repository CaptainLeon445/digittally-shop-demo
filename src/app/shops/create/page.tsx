'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ShoppingBag, Calendar, Clock, Zap,
  ArrowLeft, ArrowRight, CheckCircle, Store,
} from 'lucide-react';
import { shopsStore } from '@/lib/store';
import type { ShopType } from '@/types';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';

// ── Step 1: Shop Type ────────────────────────────────────────────
const SHOP_TYPES = [
  {
    id: 'online_vendor' as ShopType,
    icon: ShoppingBag,
    title: 'Online Store',
    desc: 'Sell physical or digital products. Fashion, electronics, food, gifts & more.',
    color: 'from-purple-500 to-purple-700',
    border: 'border-purple-300',
  },
  {
    id: 'consultation' as ShopType,
    icon: Calendar,
    title: 'Consultation / Booking',
    desc: 'Accept appointments for legal advice, medical, coaching, or professional services.',
    color: 'from-blue-500 to-blue-700',
    border: 'border-blue-300',
  },
  {
    id: 'hospitality' as ShopType,
    icon: Clock,
    title: 'Hospitality',
    desc: 'Manage reservations for shortlets, hotels, event venues, restaurants & spas.',
    color: 'from-teal-500 to-teal-700',
    border: 'border-teal-300',
  },
  {
    id: 'service' as ShopType,
    icon: Zap,
    title: 'Service Business',
    desc: 'Book repairs, cleaning, delivery, freelancers, or any service-based business.',
    color: 'from-orange-500 to-orange-700',
    border: 'border-orange-300',
  },
];

const CURRENCIES = [
  { value: 'NGN', label: 'NGN — Nigerian Naira' },
  { value: 'USD', label: 'USD — US Dollar' },
  { value: 'GBP', label: 'GBP — British Pound' },
  { value: 'EUR', label: 'EUR — Euro' },
  { value: 'GHS', label: 'GHS — Ghanaian Cedi' },
  { value: 'KES', label: 'KES — Kenyan Shilling' },
];

const schema = z.object({
  name: z.string().min(2, 'Shop name required (min 2 chars)'),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers and hyphens only'),
  description: z.string().optional(),
  currency: z.string().min(1, 'Currency required'),
  businessName: z.string().optional(),
  contactEmail: z.string().email().optional().or(z.literal('')),
  contactPhone: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

export default function CreateShopPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedType, setSelectedType] = useState<ShopType | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, control, watch, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { currency: 'NGN' },
  });

  const nameValue = watch('name') ?? '';

  const handleTypeSelect = (type: ShopType) => {
    setSelectedType(type);
    setStep(2);
  };

  const autoSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const onSubmit = async (data: FormData) => {
    if (!selectedType) return;
    setError(null);
    try {
      const shop = await shopsStore.create({
        type: selectedType,
        name: data.name,
        slug: data.slug || autoSlug(data.name),
        description: data.description,
        currency: data.currency,
        businessName: data.businessName,
        contactEmail: data.contactEmail || undefined,
        contactPhone: data.contactPhone,
      });
      router.push(`/shops/${shop.id}`);
    } catch (err: any) {
      setError(err?.message ?? 'Failed to create shop');
    }
  };

  // ── Step 1: Type Selector ──────────────────────────────────────
  if (step === 1) {
    return (
      <div>
        <div className="mb-6">
          <Link_Back href="/shops" />
          <h1 className="text-xl font-bold text-gray-900">Create New Shop</h1>
          <p className="text-sm text-gray-500 mt-0.5">Choose the type of shop you want to launch</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl">
          {SHOP_TYPES.map(({ id, icon: Icon, title, desc, color, border }) => (
            <button
              key={id}
              onClick={() => handleTypeSelect(id)}
              className={`text-left rounded-2xl border-2 bg-white p-5 transition-all hover:shadow-md hover:-translate-y-0.5 ${border} hover:border-current`}
            >
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3.5`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1.5">{title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              <div className="flex items-center gap-1 mt-3 text-xs font-semibold text-primary">
                Select <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ── Step 2: Details form ───────────────────────────────────────
  const typeConfig = SHOP_TYPES.find((t) => t.id === selectedType)!;
  const TypeIcon = typeConfig.icon;

  return (
    <div>
      <div className="mb-6">
        <button onClick={() => setStep(1)} className="inline-flex items-center gap-1.5 text-xs font-medium text-primary/70 hover:text-primary transition-colors mb-3">
          <ArrowLeft className="w-3.5 h-3.5" />
          Change shop type
        </button>

        <div className="flex items-center gap-3 mb-1">
          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${typeConfig.color} flex items-center justify-center`}>
            <TypeIcon className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Set Up {typeConfig.title}</h1>
        </div>
        <p className="text-sm text-gray-500">Fill in your shop details to get started</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-5">
        {/* Basic Details */}
        <div className="bg-white rounded-2xl border border-primary-100 shadow-card p-6 space-y-4">
          <p className="section-label">Shop Details</p>
          <Input label="Shop Name" placeholder="Fashion Hub Store" error={errors.name?.message} {...register('name')} onChange={(e) => { register('name').onChange(e); if (!watch('slug')) setValue('slug', autoSlug(e.target.value)); }} />
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">URL Slug</label>
            <div className="flex items-center rounded-xl border border-primary-200 overflow-hidden focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary">
              <span className="px-3 py-2.5 bg-gray-50 text-gray-400 text-sm border-r border-primary-200 whitespace-nowrap">store.digittally.com/</span>
              <input placeholder="my-shop" className="flex-1 px-3 py-2.5 text-sm bg-white outline-none" {...register('slug')} />
            </div>
            {errors.slug && <p className="text-xs text-red-600 mt-1">{errors.slug.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Description (optional)</label>
            <textarea rows={3} placeholder="Tell customers about your shop..." className="w-full rounded-xl border border-primary-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none" {...register('description')} />
          </div>
          <Input label="Business Name (optional)" placeholder="Fashion Hub Nigeria Ltd" {...register('businessName')} />
          <Controller
            name="currency"
            control={control}
            render={({ field }) => (
              <Select label="Currency" options={CURRENCIES} value={field.value} onChange={field.onChange} error={errors.currency?.message} />
            )}
          />
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-2xl border border-primary-100 shadow-card p-6 space-y-4">
          <p className="section-label">Contact Information</p>
          <Input label="Contact Email (optional)" type="email" placeholder="store@business.com" error={errors.contactEmail?.message} {...register('contactEmail')} />
          <Input label="Contact Phone (optional)" placeholder="+234 801 234 5678" {...register('contactPhone')} />
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        <div className="flex gap-3">
          <Button type="button" variant="secondary" size="lg" onClick={() => setStep(1)}>Cancel</Button>
          <Button type="submit" variant="primary" size="lg" loading={isSubmitting}>
            <Store className="w-4 h-4 mr-2" />
            Create Shop
          </Button>
        </div>
      </form>
    </div>
  );
}

function Link_Back({ href }: { href: string }) {
  const router = useRouter();
  return (
    <button onClick={() => router.push(href)} className="inline-flex items-center gap-1.5 text-xs font-medium text-primary/70 hover:text-primary transition-colors mb-3">
      <ArrowLeft className="w-3.5 h-3.5" />
      All Shops
    </button>
  );
}
