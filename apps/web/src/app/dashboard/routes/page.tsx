'use client';

import { RouteList } from '@/features/routes/components/RouteList';
import { AdminOnly } from '@/shared/components/AdminOnly';

export default function RoutesPage() {
  return <AdminOnly><RouteList /></AdminOnly>;
}
