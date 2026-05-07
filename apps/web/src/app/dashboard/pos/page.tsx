'use client';

import { PosForm } from '@/features/pos/components/PosForm';
import { PageLayout } from '@/shared/components/PageLayout';

export default function PosPage() {
  return (
    <PageLayout title="Nueva venta">
      <PosForm />
    </PageLayout>
  );
}
