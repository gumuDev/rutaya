'use client';

import { ScheduleList } from '@/features/schedules/components/ScheduleList';
import { AdminOnly } from '@/shared/components/AdminOnly';

export default function SchedulesPage() {
  return <AdminOnly><ScheduleList /></AdminOnly>;
}
