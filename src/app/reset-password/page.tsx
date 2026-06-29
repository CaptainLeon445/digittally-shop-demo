'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Store, CheckCircle, ArrowRight } from 'lucide-react';
import { authStore } from '@/lib/store';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';

const schema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, { message: 'Passwords do not match', path: ['confirmPassword'] });

type FormData = z.infer<typeof schema>;

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? 'demo-token';
  const [done, setDone] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    await authStore.resetPassword(token, data.password);
    setDone(true);
  };

  if (done) {
    return (
      <div className="bg-white rounded-2xl shadow-card border border-primary-100 p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-7 h-7 text-green-600" />
        </div>
        <h2 className="text-lg font-bold text-gray-900 mb-2">Password updated!</h2>
        <p className="text-sm text-gray-500 mb-6">Your password has been successfully changed.</p>
        <Button variant="primary" size="lg" className="w-full" onClick={() => router.push('/login')}>
          Go to Sign In
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-card border border-primary-100 p-7">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="New Password" type="password" placeholder="Min. 8 characters" error={errors.password?.message} {...register('password')} />
        <Input label="Confirm Password" type="password" placeholder="Repeat new password" error={errors.confirmPassword?.message} {...register('confirmPassword')} />
        <Button type="submit" variant="primary" size="lg" loading={isSubmitting} className="w-full mt-2">
          Update Password
        </Button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-primary-50">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-8 h-8 rounded-lg bg-[#0b7d8e] flex items-center justify-center">
            <Store className="w-4 h-4 text-white" />
          </div>
          <p className="font-bold text-gray-900">Digit-Tally</p>
        </div>

        <div className="mb-7">
          <h1 className="text-2xl font-bold text-gray-900">Set new password</h1>
          <p className="text-sm text-gray-500 mt-1">Choose a strong password for your account.</p>
        </div>

        <Suspense fallback={<div className="flex justify-center py-8"><Spinner size="lg" /></div>}>
          <ResetPasswordForm />
        </Suspense>

        <Link href="/login" className="flex items-center justify-center text-sm text-gray-500 hover:text-gray-700 transition-colors mt-6">
          Back to Sign In
        </Link>
      </div>
    </div>
  );
}
