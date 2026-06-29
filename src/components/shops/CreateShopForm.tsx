'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle, Loader2, ExternalLink } from 'lucide-react';
import { shopsApi, branchApi, locationApi, getCurrentBranchId } from '@/lib/api';
import { Branch, InventoryLocation } from '@/types/shop';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';

const STOREFRONT_BASE = process.env.NEXT_PUBLIC_STOREFRONT_URL || 'http://localhost:3000';

const schema = z.object({
  name: z.string().min(2, 'Shop name must be at least 2 characters'),
  slug: z.string()
    .min(2, 'Slug must be at least 2 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug may only contain lowercase letters, numbers and hyphens'),
  description: z.string().optional(),
  logoUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  currency: z.string().min(1, 'Currency is required'),
  businessName: z.string().optional(),
  branchId: z.string().min(1, 'Branch is required'),
  locationId: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const CURRENCIES = [
  { value: 'NGN', label: 'NGN - Nigerian Naira' },
  { value: 'USD', label: 'USD - US Dollar' },
  { value: 'GBP', label: 'GBP - British Pound' },
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'GHS', label: 'GHS - Ghanaian Cedi' },
  { value: 'KES', label: 'KES - Kenyan Shilling' },
  { value: 'ZAR', label: 'ZAR - South African Rand' },
];

type SlugState = 'idle' | 'checking' | 'available' | 'taken' | 'error';

export default function CreateShopForm() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [slugState, setSlugState] = useState<SlugState>('idle');
  const [slugTimeout, setSlugTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { currency: 'NGN', branchId: '' },
  });

  const slugValue = watch('slug') ?? '';
  const selectedBranch = useWatch({ control, name: 'branchId' }) ?? '';

  // Pre-select the current active branch
  useEffect(() => {
    const currentBranchId = getCurrentBranchId();
    if (currentBranchId) {
      setValue('branchId', currentBranchId);
    }
  }, [setValue]);

  // Fetch branches
  const { data: branches = [] } = useQuery<Branch[]>({
    queryKey: ['branches'],
    queryFn: branchApi.list,
    staleTime: 300_000,
  });

  // Fetch locations filtered by selected branch
  const { data: locations = [] } = useQuery<InventoryLocation[]>({
    queryKey: ['locations', selectedBranch],
    queryFn: () => locationApi.list(selectedBranch || undefined),
    enabled: true,
    staleTime: 120_000,
  });

  // Debounced slug check
  const checkSlug = useCallback((slug: string) => {
    if (!slug || slug.length < 2) {
      setSlugState('idle');
      return;
    }
    setSlugState('checking');
    shopsApi.checkSlug(slug)
      .then((result) => {
        setSlugState(result.available ? 'available' : 'taken');
      })
      .catch(() => setSlugState('error'));
  }, []);

  useEffect(() => {
    if (slugTimeout) clearTimeout(slugTimeout);
    const t = setTimeout(() => checkSlug(slugValue), 500);
    setSlugTimeout(t);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slugValue, checkSlug]);

  const onSubmit = async (data: FormData) => {
    if (slugState === 'taken') return;
    setSubmitError(null);
    try {
      const shop = await shopsApi.create({
        name: data.name,
        slug: data.slug,
        description: data.description || undefined,
        logoUrl: data.logoUrl || undefined,
        currency: data.currency,
        businessName: data.businessName || undefined,
        branchId: data.branchId,
        locationId: data.locationId || undefined,
      });
      router.push(`/shops/${shop.id}`);
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? err?.message ?? 'Failed to create shop';
      setSubmitError(msg);
    }
  };

  const slugIndicator = () => {
    if (slugState === 'checking') return <Loader2 className="w-4 h-4 animate-spin text-gray-400" />;
    if (slugState === 'available') return <CheckCircle className="w-4 h-4 text-green-500" />;
    if (slugState === 'taken') return <XCircle className="w-4 h-4 text-red-500" />;
    return null;
  };

  const previewUrl = slugValue ? `${STOREFRONT_BASE}/${slugValue}` : '';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
      {/* Step 1 - Basic Info */}
      <div className="bg-white rounded-2xl border border-primary-100 shadow-card p-6">
        <p className="section-label mb-4">Shop Details</p>
        <div className="space-y-4">
          <Input
            label="Shop Name"
            placeholder="My Awesome Shop"
            error={errors.name?.message}
            {...register('name')}
          />
          <Input
            label="Business Name (optional)"
            placeholder="Acme Corp"
            error={errors.businessName?.message}
            {...register('businessName')}
          />
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">
              Slug (URL handle)
            </label>
            <div className="relative">
              <input
                placeholder="my-shop"
                className={`w-full rounded-xl border px-3.5 py-2.5 pr-9 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all ${
                  errors.slug
                    ? 'border-red-300 bg-red-50'
                    : slugState === 'taken'
                    ? 'border-red-300 bg-red-50'
                    : slugState === 'available'
                    ? 'border-green-400 bg-green-50/30'
                    : 'border-primary-200 bg-white hover:border-primary/40'
                }`}
                {...register('slug')}
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2">
                {slugIndicator()}
              </span>
            </div>
            {errors.slug && <p className="text-xs text-red-600 mt-1">{errors.slug.message}</p>}
            {slugState === 'taken' && !errors.slug && (
              <p className="text-xs text-red-600 mt-1">This slug is already taken</p>
            )}
            {slugState === 'available' && (
              <p className="text-xs text-green-600 mt-1">Slug is available</p>
            )}
          </div>

          {/* Storefront URL preview */}
          {previewUrl && (
            <div className="flex items-center gap-2 bg-primary-50 border border-primary-100 rounded-xl px-3.5 py-2.5">
              <ExternalLink className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="text-sm text-primary-dark/80 font-mono truncate">{previewUrl}</span>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Description (optional)</label>
            <textarea
              placeholder="Tell customers about your shop..."
              rows={3}
              className="w-full rounded-xl border border-primary-200 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all hover:border-primary/40 resize-none"
              {...register('description')}
            />
          </div>

          <Input
            label="Logo URL (optional)"
            type="url"
            placeholder="https://example.com/logo.png"
            error={errors.logoUrl?.message}
            {...register('logoUrl')}
          />
        </div>
      </div>

      {/* Step 2 - Branch & Location */}
      <div className="bg-white rounded-2xl border border-primary-100 shadow-card p-6">
        <p className="section-label mb-4">Branch & Inventory</p>
        <div className="space-y-4">
          <Controller
            name="branchId"
            control={control}
            render={({ field }) => (
              <Select
                label="Branch"
                placeholder="Select branch..."
                options={branches.map((b) => ({ value: b.id, label: b.name }))}
                error={errors.branchId?.message}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />

          <Controller
            name="locationId"
            control={control}
            render={({ field }) => (
              <Select
                label="Inventory Location (optional)"
                placeholder="All locations"
                options={locations.map((l) => ({ value: l.id, label: l.name }))}
                error={errors.locationId?.message}
                value={field.value ?? ''}
                onChange={field.onChange}
              />
            )}
          />

          <Controller
            name="currency"
            control={control}
            render={({ field }) => (
              <Select
                label="Currency"
                options={CURRENCIES}
                error={errors.currency?.message}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </div>
      </div>

      {submitError && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
          {submitError}
        </div>
      )}

      <div className="flex gap-3">
        <Button
          type="button"
          variant="secondary"
          size="lg"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={isSubmitting}
          disabled={slugState === 'taken'}
        >
          Create Shop
        </Button>
      </div>
    </form>
  );
}
