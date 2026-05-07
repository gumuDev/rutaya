'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getRole } from '@/features/auth/hooks/useAuth';

export function AdminOnly({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (getRole() === 'admin') setAllowed(true);
    else router.replace('/dashboard/reservations');
  }, [router]);

  if (!allowed) return null;
  return <>{children}</>;
}
