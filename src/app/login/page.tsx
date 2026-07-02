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

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});
type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setError(null);
    try {
      await authStore.login(data.email, data.password);
      router.push('/shops');
    } catch (err: any) {
      setError(err?.message ?? 'Login failed. Check your credentials.');
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* ── Left: brand panel ── */}
      <div className="hidden lg:flex flex-col justify-between w-[46%] bg-[#0f1e21] px-14 py-12 relative overflow-hidden">
        {/* Subtle grid texture */}
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
            Your shop.<br />
            <em className="not-italic text-primary-light">Always open.</em>
          </h2>
          <p className="text-white/45 text-sm leading-relaxed mb-10 max-w-xs">
            Manage products, orders, bookings, and your sales team — all from one place.
          </p>

          {/* Inline mini stats */}
          <div className="flex gap-8">
            {[
              { n: '5 min', label: 'avg. setup time' },
              { n: '₦0', label: 'to get started' },
              { n: '24/7', label: 'your shop is live' },
            ].map(({ n, label }) => (
              <div key={label}>
                <p className="text-white font-bold text-lg">{n}</p>
                <p className="text-white/35 text-[11px] mt-0.5">{label}</p>
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
          <div className="flex items-center gap-2 mb-10 lg:hidden">
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

          <div className="mb-8">
            <h1 className="font-serif text-2xl text-ink">Welcome back</h1>
            <p className="text-sm text-gray-500 mt-1">Sign in to your dashboard</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-subtle">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Email address"
                type="email"
                placeholder="you@company.com"
                autoComplete="email"
                error={errors.email?.message}
                {...register('email')}
              />
              <div>
                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  error={errors.password?.message}
                  {...register('password')}
                />
                <div className="flex justify-end mt-1.5">
                  <Link href="/forgot-password" className="text-xs text-primary hover:text-primary-dark transition-colors font-medium">
                    Forgot password?
                  </Link>
                </div>
              </div>

              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>
              )}

              <Button type="submit" variant="primary" size="lg" loading={isSubmitting} className="w-full rounded-lg">
                Sign in <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </form>
          </div>

          <p className="text-center text-sm text-gray-500 mt-5">
            No account?{' '}
            <Link href="/signup" className="font-semibold text-primary hover:text-primary-dark transition-colors">
              Create one free
            </Link>
          </p>

          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700 text-center">
            Demo mode — enter any email + password to sign in
          </div>
        </div>
      </div>
    </div>
  );
}
