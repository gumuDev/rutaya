'use client';

import { useEffect, useState } from 'react';
import { Spin, Result, Button, Grid } from 'antd';
import { useParams } from 'next/navigation';
import { DigitalTicket, TicketData } from '@/features/reservations/components/DigitalTicket';
import { colors } from '@/shared/theme/colors';

const { useBreakpoint } = Grid;
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

function Navbar() {
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: '#ffffff',
      borderBottom: `1px solid ${colors.border}`,
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    }}>
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px', maxWidth: 1280, margin: '0 auto', height: 72,
      }}>
        <a href="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontSize: 22, fontWeight: 900, color: colors.primary, letterSpacing: -0.5 }}>RutaYa</span>
        </a>
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            <a href="/" style={{ color: colors.textSecondary, fontSize: 15, textDecoration: 'none' }}>Buscar</a>
            <a href="/login" style={{ color: colors.textSecondary, fontSize: 15, textDecoration: 'none' }}>Para Empresas</a>
            <a href="/recover" style={{ color: colors.textSecondary, fontSize: 15, textDecoration: 'none' }}>Mis Viajes</a>
          </div>
        )}
        <a href="/login" style={{
          background: colors.accent, color: colors.navy,
          fontSize: 14, fontWeight: 700, padding: '10px 20px', borderRadius: 8, textDecoration: 'none',
        }}>
          {isMobile ? 'Ingresar' : 'Iniciar Sesión/Registrarse'}
        </a>
      </nav>
    </header>
  );
}

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
    <div style={{ minHeight: '100vh', background: colors.bg }}>
      <Navbar />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 72px)' }}>
        <Spin size="large" />
      </div>
    </div>
  );

  if (notFound || !data) return (
    <div style={{ minHeight: '100vh', background: colors.bg }}>
      <Navbar />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 72px)' }}>
        <Result
          status="404"
          title="Ticket no encontrado"
          subTitle="Verifica el código o recupera tu reserva."
          extra={
            <Button
              type="primary"
              href="/recover"
              style={{ background: colors.primary, borderColor: colors.primary }}
            >
              Recuperar reserva
            </Button>
          }
        />
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: colors.bg }}>
      <Navbar />

      {/* Subtle hero strip */}
      <div style={{
        background: `linear-gradient(135deg, ${colors.navy} 0%, ${colors.primary} 100%)`,
        padding: '32px 24px',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', fontWeight: 500, marginBottom: 4 }}>
          Tu reserva está confirmada
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>
          {data.schedule.route.origin} → {data.schedule.route.destination}
        </div>
      </div>

      {/* Ticket */}
      <div style={{ marginTop: -24, position: 'relative', zIndex: 1 }}>
        <DigitalTicket data={data} />
      </div>
    </div>
  );
}
