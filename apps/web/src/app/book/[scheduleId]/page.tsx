'use client';

import { useEffect, useState } from 'react';
import { Spin, Result, Button } from 'antd';
import { useParams, useSearchParams } from 'next/navigation';
import { BookingForm } from '@/features/reservations/components/BookingForm';
import { searchSchedules } from '@/features/reservations/services/reservations.service';
import { ScheduleResult } from '@/features/reservations/types/reservation.types';

export default function BookPage() {
  const { scheduleId } = useParams<{ scheduleId: string }>();
  const params = useSearchParams();
  const [schedule, setSchedule] = useState<ScheduleResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const passengers = parseInt(params.get('passengers') ?? '1', 10);
  const travelDate = params.get('date') ?? '';

  useEffect(() => {
    const origin = params.get('origin') ?? '';
    const destination = params.get('destination') ?? '';
    const date = params.get('date') ?? '';
    searchSchedules(origin, destination, date, passengers)
      .then((results) => {
        const found = results.find((r) => r.id === scheduleId);
        if (found) setSchedule(found);
        else setNotFound(true);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [scheduleId, params]);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}><Spin size="large" /></div>;
  if (notFound || !schedule) return (
    <Result status="404" title="Horario no encontrado" extra={<Button href="/">Volver al inicio</Button>} />
  );

  return <BookingForm schedule={schedule} initialPassengers={passengers} travelDate={travelDate} />;
}
