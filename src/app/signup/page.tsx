'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowRight } from 'lucide-react';
import { authStore } from '@/lib/store';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

const schema = z.object({
  name: z.string().min(2, 'Full name is required'),
  businessName: z.string().min(2, 'Business name is required'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type FormData = z.infer<typeof schema>;

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setError(null);
    try {
      await authStore.signup({
        email: data.email,
        name: data.name,
        businessName: data.businessName,
        password: data.password,
      });
      router.push('/shops');
    } catch (err: any) {
      setError(err?.message ?? 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* ── Left: brand panel ── */}
      <div className="hidden lg:flex flex-col justify-between w-[44%] bg-[#0f1e21] px-14 py-12 relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Logo */}
        <div className="relative flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
              <rect x="3" y="3" width="6" height="6" rx="1" fill="white" />
              <rect x="11" y="3" width="6" height="6" rx="1" fill="white" fillOpacity=".5" />
              <rect x="3" y="11" width="6" height="6" rx="1" fill="white" fillOpacity=".5" />
              <rect x="11" y="11" width="6" height="6" rx="1" fill="white" />
            </svg>
          </div>
          <div>
            <p className="font-bold text-white text-sm tracking-tight">Digit-Tally</p>
            <p className="text-[10px] text-white/30 uppercase tracking-widest">Shop Manager</p>
          </div>
        </div>

        {/* Centre copy */}
        <div className="relative">
          <h2 className="font-serif text-[38px] leading-tight text-white mb-4">
            Open for business<br />
            <em className="not-italic text-primary-light">in 5 minutes.</em>
          </h2>
          <p className="text-white/45 text-sm leading-relaxed mb-10 max-w-xs">
            No developers, no hosting, no complicated setup. Just your business name and what you sell.
          </p>

          <div className="space-y-3.5">
            {[
              'Permanently free starter plan',
              'Full storefront with your branding',
              'WhatsApp alerts to your sales team',
              'Wallet & bank withdrawal built in',
            ].map((p) => (
              <div key={p} className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                <span className="text-sm text-white/60">{p}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-[11px] text-white/20">Digit-Tally · Built for African entrepreneurs</p>
      </div>

      {/* ── Right: form panel ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-[#f9fafb]">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-7 h-7 rounded-md bg-ink flex items-center justify-center">
              <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
                <rect x="3" y="3" width="6" height="6" rx="1" fill="white" />
                <rect x="11" y="3" width="6" height="6" rx="1" fill="white" fillOpacity=".5" />
                <rect x="3" y="11" width="6" height="6" rx="1" fill="white" fillOpacity=".5" />
                <rect x="11" y="11" width="6" height="6" rx="1" fill="white" />
              </svg>
            </div>
            <p className="font-bold text-ink tracking-tight">Digit-Tally</p>
          </div>

          <div className="mb-7">
            <h1 className="font-serif text-2xl text-ink">Create your account</h1>
            <p className="text-sm text-gray-500 mt-1">Free to start. No credit card.</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-subtle">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Input label="Full name" placeholder="Amaka Okonkwo" error={errors.name?.message} {...register('name')} />
                <Input label="Business name" placeholder="Fashion Hub" error={errors.businessName?.message} {...register('businessName')} />
              </div>
              <Input label="Email address" type="email" placeholder="you@business.com" error={errors.email?.message} {...register('email')} />
              <Input label="Password" type="password" placeholder="Min. 8 characters" error={errors.password?.message} {...register('password')} />
              <Input label="Confirm password" type="password" placeholder="Repeat password" error={errors.confirmPassword?.message} {...register('confirmPassword')} />

              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>
              )}

              <Button type="submit" variant="primary" size="lg" loading={isSubmitting} className="w-full rounded-lg mt-1">
                Create account
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </form>
          </div>

          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-primary hover:text-primary-dark transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
