'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Store, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
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
    <div className="min-h-screen flex items-center justify-center px-4 bg-primary-50">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-8 h-8 rounded-lg bg-[#0b7d8e] flex items-center justify-center">
            <Store className="w-4 h-4 text-white" />
          </div>
          <p className="font-bold text-gray-900">Digit-Tally</p>
        </div>

        {sent ? (
          <div className="bg-white rounded-2xl shadow-card border border-primary-100 p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-7 h-7 text-green-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Check your email</h2>
            <p className="text-sm text-gray-500 mb-1">We sent a reset link to</p>
            <p className="text-sm font-semibold text-gray-800 mb-6">{sentEmail}</p>
            <p className="text-xs text-gray-400 mb-6">Didn&apos;t get it? Check your spam folder or try again.</p>
            <Button variant="ghost" size="sm" onClick={() => setSent(false)} className="w-full">
              Try a different email
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-7">
              <h1 className="text-2xl font-bold text-gray-900">Forgot your password?</h1>
              <p className="text-sm text-gray-500 mt-1">Enter your email and we&apos;ll send a reset link.</p>
            </div>
            <div className="bg-white rounded-2xl shadow-card border border-primary-100 p-7">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="flex items-center gap-3 p-3 bg-primary-50 rounded-xl border border-primary-100">
                  <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                  <p className="text-xs text-gray-600">We&apos;ll send a secure link to your registered email address.</p>
                </div>
                <Input label="Email Address" type="email" placeholder="you@business.com" error={errors.email?.message} {...register('email')} />
                <Button type="submit" variant="primary" size="lg" loading={isSubmitting} className="w-full">
                  Send Reset Link
                </Button>
              </form>
            </div>
          </>
        )}

        <Link href="/login" className="flex items-center justify-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors mt-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Sign In
        </Link>
      </div>
    </div>
  );
}
