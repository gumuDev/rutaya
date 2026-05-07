'use client';

import { TeamList } from '@/features/team/components/TeamList';
import { AdminOnly } from '@/shared/components/AdminOnly';

export default function TeamPage() {
  return <AdminOnly><TeamList /></AdminOnly>;
}
