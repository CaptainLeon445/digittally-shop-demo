'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Spinner from '@/components/ui/Spinner';
import { authApi, getToken } from '@/lib/api';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!getToken()) {
      router.replace('/login');
      return;
    }
    authApi
      .me()
      .then(() => setChecking(false))
      .catch(() => router.replace('/login'));
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spinner size="lg" />
      </div>
    );
  }

  return <>{children}</>;
}
