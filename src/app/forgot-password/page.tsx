'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft } from 'lucide-react';
import { authStore } from '@/lib/store';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

const schema = z.object({ email: z.string().email('Enter a valid email address') });
type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [sentEmail, setSentEmail] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    await authStore.forgotPassword(data.email);
    setSentEmail(data.email);
    setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5 bg-[#f9fafb]">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mb-10">
          <div className="w-7 h-7 rounded-md bg-ink flex items-center justify-center">
            <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
              <rect x="3" y="3" width="6" height="6" rx="1" fill="white" />
              <rect x="11" y="3" width="6" height="6" rx="1" fill="white" fillOpacity=".5" />
              <rect x="3" y="11" width="6" height="6" rx="1" fill="white" fillOpacity=".5" />
              <rect x="11" y="11" width="6" height="6" rx="1" fill="white" />
            </svg>
          </div>
          <p className="font-bold text-ink tracking-tight">Digit-Tally</p>
        </Link>

        {sent ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center shadow-subtle">
            <div className="w-12 h-12 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="font-serif text-xl text-ink mb-2">Check your inbox</h2>
            <p className="text-sm text-gray-500 mb-1">We sent a reset link to</p>
            <p className="text-sm font-semibold text-ink mb-6">{sentEmail}</p>
            <p className="text-xs text-gray-400 mb-6">Didn&apos;t get it? Check your spam folder or try a different email.</p>
            <Button variant="ghost" size="sm" onClick={() => setSent(false)} className="w-full">
              Try a different email
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-7">
              <h1 className="font-serif text-2xl text-ink">Reset your password</h1>
              <p className="text-sm text-gray-400 mt-1">Enter your email and we&apos;ll send a reset link.</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-subtle">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  label="Email address"
                  type="email"
                  placeholder="you@business.com"
                  error={errors.email?.message}
                  {...register('email')}
                />
                <Button type="submit" variant="primary" size="lg" loading={isSubmitting} className="w-full">
                  Send reset link
                </Button>
              </form>
            </div>
          </>
        )}

        <Link href="/login" className="flex items-center justify-center gap-1.5 text-sm text-gray-400 hover:text-ink transition-colors mt-6">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
