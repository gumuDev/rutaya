'use client';

import { PaymentConfig } from '@/features/dashboard/components/PaymentConfig';
import { AdminOnly } from '@/shared/components/AdminOnly';

export default function PaymentConfigPage() {
  return <AdminOnly><PaymentConfig /></AdminOnly>;
}
