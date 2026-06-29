'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Store, ShoppingBag, TrendingUp, Users } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authApi } from '@/lib/api';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

const loginSchema = z.object({
  email:    z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});
type LoginForm = z.infer<typeof loginSchema>;

const FEATURES = [
  { icon: Store,      text: 'Manage unlimited storefronts'      },
  { icon: ShoppingBag, text: 'Track orders in real time'        },
  { icon: TrendingUp, text: 'Monitor wallet & revenue'          },
  { icon: Users,      text: 'Assign and manage sales reps'      },
];

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginForm) => {
    setError(null);
    try {
      await authApi.login(data.email, data.password);
      router.push('/shops');
    } catch (err: any) {
      setError(err?.response?.data?.message ?? err?.message ?? 'Login failed. Check your credentials.');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Left panel ───────────────────────── */}
      <div
        className="hidden lg:flex flex-col justify-between w-[48%] px-14 py-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #052e36 0%, #0b5d6e 45%, #0b7d8e 100%)' }}
      >
        {/* decorative rings */}
        <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full"
          style={{ border: '1px solid rgba(255,255,255,0.07)' }} />
        <div className="pointer-events-none absolute bottom-0 right-0 w-72 h-72 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(19,160,181,0.15) 0%, transparent 70%)' }} />
        <div className="pointer-events-none absolute top-1/3 -right-16 w-48 h-48 rounded-full"
          style={{ border: '1px solid rgba(255,255,255,0.06)' }} />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)' }}>
            <Store className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-white text-sm">Digit-Tally</p>
            <p className="text-[10px] text-white/40 tracking-wide uppercase">Shop Manager</p>
          </div>
        </div>

        {/* Hero text */}
        <div className="relative">
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Sell smarter.<br />
            <span style={{ color: '#7de8f4' }}>Grow faster.</span>
          </h2>
          <p className="text-white/60 text-sm leading-relaxed mb-10 max-w-xs">
            Your all-in-one storefront management platform. Launch shops, track revenue, and manage your team from one dashboard.
          </p>

          <ul className="space-y-4">
            {FEATURES.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(255,255,255,0.1)' }}>
                  <Icon className="w-4 h-4 text-white/80" />
                </span>
                <span className="text-sm text-white/70">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom version tag */}
        <p className="relative text-xs text-white/25">Digit-Tally Shops v1.0</p>
      </div>

      {/* ── Right panel (form) ────────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-primary-50">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <Store className="w-5 h-5 text-white" />
            </div>
            <p className="font-bold text-gray-900">Digit-Tally Shops</p>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
            <p className="text-sm text-gray-500 mt-1">Sign in to your shop dashboard</p>
          </div>

          <div className="bg-white rounded-2xl shadow-card border border-primary-100 p-7">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <Input
                label="Email Address"
                type="email"
                placeholder="you@company.com"
                autoComplete="email"
                error={errors.email?.message}
                {...register('email')}
              />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                error={errors.password?.message}
                {...register('password')}
              />

              {error && (
                <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <Button type="submit" variant="primary" size="lg" loading={isSubmitting} className="w-full mt-1">
                Sign In
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
