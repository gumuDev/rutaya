import { Suspense } from 'react';
import { Spin } from 'antd';
import { ScheduleResults } from '@/features/reservations/components/ScheduleResults';

export default function SearchPage() {
  return (
    <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}><Spin size="large" /></div>}>
      <ScheduleResults />
    </Suspense>
  );
}
