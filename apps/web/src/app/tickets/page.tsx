'use client';

import { useEffect, useState, Suspense } from 'react';
import { Spin, Typography, Button } from 'antd';
import { useSearchParams } from 'next/navigation';
import { DigitalTicket, TicketData } from '@/features/reservations/components/DigitalTicket';
import { colors } from '@/shared/theme/colors';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

const { Title, Text } = Typography;

function TicketsContent() {
  const params = useSearchParams();
  const codes = (params.get('codes') ?? '').split(',').filter(Boolean);
  const [tickets, setTickets] = useState<(TicketData | null)[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (codes.length === 0) { setLoading(false); return; }
    Promise.all(
      codes.map((code) =>
        fetch(`${API_URL}/reservations/${code}`)
          .then((r) => r.ok ? r.json() : null)
          .catch(() => null)
      )
    ).then(setTickets).finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  if (loading) return (
    <div style={{ minHeight: '100vh', background: colors.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Spin size="large" />
    </div>
  );

  if (tickets.length === 0) return (
    <div style={{ minHeight: '100vh', background: colors.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Text>No se encontraron tickets.</Text>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: colors.bg, paddingTop: 24, paddingBottom: 40 }}>
      <div style={{ maxWidth: 520, margin: '0 auto', padding: '0 16px' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={3} style={{ color: colors.secondary, margin: 0 }}>
            🎫 {tickets.length} ticket{tickets.length > 1 ? 's' : ''} generado{tickets.length > 1 ? 's' : ''}
          </Title>
          <Text type="secondary">Guarda cada ticket por separado</Text>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {tickets.map((data, idx) =>
            data ? (
              <div key={idx}>
                {tickets.length > 1 && (
                  <div style={{ background: colors.secondary, color: '#fff', borderRadius: '8px 8px 0 0', padding: '6px 16px', fontSize: 13, fontWeight: 600 }}>
                    Pasajero {idx + 1}
                  </div>
                )}
                <DigitalTicket data={data} />
              </div>
            ) : null
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Button href="/" style={{ borderColor: colors.secondary, color: colors.secondary }}>
            Volver al inicio
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function TicketsPage() {
  return (
    <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}><Spin size="large" /></div>}>
      <TicketsContent />
    </Suspense>
  );
}
