'use client';

import { VehicleList } from '@/features/vehicles/components/VehicleList';
import { AdminOnly } from '@/shared/components/AdminOnly';

export default function VehiclesPage() {
  return <AdminOnly><VehicleList /></AdminOnly>;
}
