'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Store, CheckCircle, ArrowRight } from 'lucide-react';
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

const PERKS = [
  'Free shop forever — no credit card',
  'Set up in under 5 minutes',
  'Accept payments from day one',
  'WhatsApp order alerts for your team',
];

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
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div
        className="hidden lg:flex flex-col justify-between w-[44%] px-14 py-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #052e36 0%, #0b5d6e 50%, #0b7d8e 100%)' }}
      >
        <div className="pointer-events-none absolute -top-20 -left-20 w-80 h-80 rounded-full" style={{ border: '1px solid rgba(255,255,255,0.07)' }} />
        <div className="pointer-events-none absolute bottom-0 right-0 w-64 h-64 rounded-full" style={{ background: 'radial-gradient(circle, rgba(19,160,181,0.15) 0%, transparent 70%)' }} />

        <div className="relative flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.12)' }}>
            <Store className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-bold text-white text-sm">Digit-Tally</p>
            <p className="text-[10px] text-white/40 uppercase tracking-wide">Shop Manager</p>
          </div>
        </div>

        <div className="relative">
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Start selling<br />
            <span style={{ color: '#7de8f4' }}>in minutes.</span>
          </h2>
          <p className="text-white/60 text-sm mb-10 max-w-xs leading-relaxed">
            Join 12,000+ businesses using Digit-Tally to run their online operations.
          </p>
          <ul className="space-y-3.5">
            {PERKS.map((p) => (
              <li key={p} className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-teal-300 flex-shrink-0" />
                <span className="text-sm text-white/75">{p}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-white/25">Digit-Tally Shops v1.0</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-primary-50">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-[#0b7d8e] flex items-center justify-center">
              <Store className="w-4 h-4 text-white" />
            </div>
            <p className="font-bold text-gray-900">Digit-Tally</p>
          </div>

          <div className="mb-7">
            <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
            <p className="text-sm text-gray-500 mt-1">Start selling online for free</p>
          </div>

          <div className="bg-white rounded-2xl shadow-card border border-primary-100 p-7">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input label="Full Name" placeholder="Amaka Okonkwo" error={errors.name?.message} {...register('name')} />
              <Input label="Business Name" placeholder="Fashion Hub Nigeria" error={errors.businessName?.message} {...register('businessName')} />
              <Input label="Email Address" type="email" placeholder="you@business.com" error={errors.email?.message} {...register('email')} />
              <Input label="Password" type="password" placeholder="Min. 8 characters" error={errors.password?.message} {...register('password')} />
              <Input label="Confirm Password" type="password" placeholder="Repeat password" error={errors.confirmPassword?.message} {...register('confirmPassword')} />

              {error && (
                <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>
              )}

              <Button type="submit" variant="primary" size="lg" loading={isSubmitting} className="w-full mt-2">
                Create Account
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>
          </div>

          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-primary hover:text-primary-dark transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
