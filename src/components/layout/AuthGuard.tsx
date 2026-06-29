'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authStore } from '@/lib/store';
import Spinner from '@/components/ui/Spinner';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const user = authStore.getUser();
    if (!user) {
      router.replace('/login');
    } else {
      setChecking(false);
    }
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-50">
        <Spinner size="lg" />
      </div>
    );
  }

  return <>{children}</>;
}
