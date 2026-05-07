'use client';

import { useEffect, useState } from 'react';
import { Spin, Result, Button } from 'antd';
import { useParams } from 'next/navigation';
import { DigitalTicket, TicketData } from '@/features/reservations/components/DigitalTicket';
import { colors } from '@/shared/theme/colors';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

export default function TicketPage() {
  const { code } = useParams<{ code: string }>();
  const [data, setData] = useState<TicketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/reservations/${code}`)
      .then((r) => {
        if (!r.ok) throw new Error('not_found');
        return r.json();
      })
      .then(setData)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [code]);

  if (loading) return (
    <div style={{ minHeight: '100vh', background: colors.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Spin size="large" />
    </div>
  );

  if (notFound || !data) return (
    <div style={{ minHeight: '100vh', background: colors.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Result status="404" title="Ticket no encontrado"
        subTitle="Verifica el código o recupera tu reserva."
        extra={<Button type="primary" href="/recover" style={{ background: colors.primary, borderColor: colors.primary }}>Recuperar reserva</Button>}
      />
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: colors.bg, paddingTop: 24, paddingBottom: 40 }}>
      <DigitalTicket data={data} />
    </div>
  );
}
