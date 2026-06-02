'use client';

import { useRef, useState } from 'react';
import { Button, Typography, message, Grid } from 'antd';
import {
  CopyOutlined, DownloadOutlined, WhatsAppOutlined,
  CheckOutlined, ArrowRightOutlined, CheckCircleFilled,
  ClockCircleFilled, CloseCircleFilled, InfoCircleFilled,
} from '@ant-design/icons';
import { useTranslations } from 'next-intl';
import { toPng } from 'html-to-image';
import { colors } from '@/shared/theme/colors';

const { Text } = Typography;
const { useBreakpoint } = Grid;

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { label: string; icon: React.ReactNode; color: string; bg: string }> = {
  pending_payment: { label: 'Pendiente de pago', icon: <ClockCircleFilled />, color: '#92400E', bg: '#FEF3C7' },
  pending:         { label: 'Pendiente',          icon: <ClockCircleFilled />, color: '#1D4ED8', bg: '#DBEAFE' },
  confirmed:       { label: 'Confirmado',          icon: <CheckCircleFilled />, color: '#15803D', bg: '#DCFCE7' },
  cancelled:       { label: 'Cancelado',           icon: <CloseCircleFilled />, color: '#991B1B', bg: '#FEE2E2' },
  expired:         { label: 'Expirado',            icon: <CloseCircleFilled />, color: '#6B7280', bg: '#F3F4F6' },
  boarded:         { label: 'Abordado',            icon: <CheckCircleFilled />, color: '#1E40AF', bg: '#DBEAFE' },
};

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TicketData {
  id: string;
  code: string;
  status: string;
  quantity: number;
  passengerName: string;
  passengerPhone: string;
  expiresAt: string;
  schedule: {
    departureTime: string;
    price: number | string;
    route: { origin: string; destination: string };
    company: { name: string };
  };
}

// ─── Ticket visual (also used for image export) ───────────────────────────────

function TicketCard({ data }: { data: TicketData }) {
  const total = Number(data.schedule.price) * data.quantity;
  const t = useTranslations('ticket');
  const status = STATUS_CONFIG[data.status] ?? STATUS_CONFIG.pending;

  const detailRows = [
    { label: t('departure'),  value: data.schedule.departureTime },
    { label: t('company'),    value: data.schedule.company.name },
    { label: t('passenger'),  value: data.passengerName },
    { label: t('phone'),      value: data.passengerPhone },
    { label: t('quantity'),   value: `${data.quantity} pasajero${data.quantity > 1 ? 's' : ''}` },
    { label: t('total'),      value: `Bs. ${total.toFixed(2)}`, highlight: true },
  ];

  return (
    <div style={{
      background: '#fff',
      borderRadius: 20,
      overflow: 'hidden',
      boxShadow: '0 8px 40px rgba(0,35,74,0.18)',
      width: '100%',
    }}>
      {/* Header — Andean Blue */}
      <div style={{ background: colors.navy, padding: '24px 28px' }}>
        {/* Top row: logo + status */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <span style={{ fontSize: 18, fontWeight: 900, color: '#fff', letterSpacing: -0.5 }}>RutaYa</span>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            background: status.bg, color: status.color,
            fontSize: 11, fontWeight: 700,
            padding: '4px 12px', borderRadius: 99,
          }}>
            {status.icon} {status.label}
          </span>
        </div>

        {/* Route display */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.08em', fontWeight: 600, marginBottom: 4 }}>ORIGEN</div>
            <div style={{ fontSize: 26, fontWeight: 900, color: '#fff', lineHeight: 1 }}>
              {data.schedule.route.origin}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flex: 1 }}>
            <ArrowRightOutlined style={{ color: colors.accent, fontSize: 20 }} />
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>
              {data.schedule.departureTime}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.08em', fontWeight: 600, marginBottom: 4 }}>DESTINO</div>
            <div style={{ fontSize: 26, fontWeight: 900, color: '#fff', lineHeight: 1 }}>
              {data.schedule.route.destination}
            </div>
          </div>
        </div>
      </div>

      {/* Code band — Solar Yellow */}
      <div style={{ background: colors.accent, padding: '14px 28px', textAlign: 'center' }}>
        <div style={{ fontSize: 10, color: colors.navy, letterSpacing: '0.12em', fontWeight: 700, marginBottom: 2 }}>
          CÓDIGO DE RESERVA
        </div>
        <div style={{ fontSize: 36, fontWeight: 900, color: colors.navy, letterSpacing: 6, fontFamily: 'monospace', lineHeight: 1 }}>
          {data.code}
        </div>
      </div>

      {/* Tear line */}
      <div style={{ display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ width: 24, height: 24, borderRadius: '50%', background: colors.bg, flexShrink: 0, marginLeft: -12, zIndex: 1 }} />
        <div style={{ flex: 1, borderTop: `2px dashed ${colors.border}`, margin: '0 4px' }} />
        <div style={{ width: 24, height: 24, borderRadius: '50%', background: colors.bg, flexShrink: 0, marginRight: -12, zIndex: 1 }} />
      </div>

      {/* Details grid */}
      <div style={{ padding: '20px 28px 28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 20px' }}>
          {detailRows.map(({ label, value, highlight }) => (
            <div key={label}>
              <div style={{ fontSize: 10, color: colors.textSecondary, fontWeight: 600, letterSpacing: '0.06em', marginBottom: 3, textTransform: 'uppercase' }}>
                {label}
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: highlight ? colors.primary : colors.textPrimary }}>
                {value}
              </div>
            </div>
          ))}
        </div>

        {/* Company badge */}
        <div style={{ marginTop: 20, paddingTop: 16, borderTop: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: `rgba(0,56,112,0.07)`, padding: '6px 14px', borderRadius: 8,
          }}>
            <span style={{ fontSize: 14 }}>🚌</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: colors.primary }}>{data.schedule.company.name}</span>
          </div>
          <div style={{ fontSize: 11, color: colors.textSecondary }}>
            Muestra este código al abordar
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function DigitalTicket({ data }: { data: TicketData }) {
  const t = useTranslations('ticket');
  const ticketRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const total = Number(data.schedule.price) * data.quantity;

  async function handleSaveImage() {
    if (!ticketRef.current) return;
    try {
      const png = await toPng(ticketRef.current, { cacheBust: true, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `ticket-${data.code}.png`;
      link.href = png;
      link.click();
    } catch {
      messageApi.error('Error al guardar la imagen');
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(data.code);
    setCopied(true);
    messageApi.success(t('codeCopied'));
    setTimeout(() => setCopied(false), 2000);
  }

  function handleWhatsApp() {
    const text =
      `🎫 *Mi ticket RutaYa*\n\n` +
      `📋 Código: *${data.code}*\n` +
      `🚌 Ruta: ${data.schedule.route.origin} → ${data.schedule.route.destination}\n` +
      `🕐 Salida: ${data.schedule.departureTime}\n` +
      `👤 Pasajero: ${data.passengerName}\n` +
      `👥 Cantidad: ${data.quantity}\n` +
      `💰 Total: Bs. ${total.toFixed(2)}\n` +
      `📊 Estado: ${data.status}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  }

  return (
    <div style={{ maxWidth: 460, margin: '0 auto', padding: isMobile ? '16px 16px 40px' : '32px 16px 60px' }}>
      {contextHolder}

      {/* Ticket (también se exporta como imagen) */}
      <div ref={ticketRef}>
        <TicketCard data={data} />
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 24 }}>
        {/* Copiar código */}
        <Button
          size="large"
          icon={copied ? <CheckOutlined /> : <CopyOutlined />}
          block
          onClick={handleCopy}
          style={{
            background: copied ? colors.success : colors.primary,
            borderColor: copied ? colors.success : colors.primary,
            color: '#fff', fontWeight: 700, height: 48, borderRadius: 10,
            fontSize: 15,
          }}
        >
          {copied ? t('codeCopied') : t('copyCode')}
        </Button>

        {/* Guardar imagen */}
        <Button
          size="large"
          icon={<DownloadOutlined />}
          block
          onClick={handleSaveImage}
          style={{
            borderColor: colors.border, color: colors.textPrimary,
            fontWeight: 600, height: 48, borderRadius: 10,
          }}
        >
          {t('saveImage')}
        </Button>

        {/* WhatsApp */}
        <Button
          size="large"
          icon={<WhatsAppOutlined />}
          block
          onClick={handleWhatsApp}
          style={{
            background: '#25D366', borderColor: '#25D366',
            color: '#fff', fontWeight: 600, height: 48, borderRadius: 10,
          }}
        >
          {t('shareWhatsapp')}
        </Button>

        {/* Links secundarios */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 8 }}>
          <a href="/" style={{ color: colors.textSecondary, fontSize: 13, textDecoration: 'none' }}>
            ← Buscar otro viaje
          </a>
          <a href="/recover" style={{ color: colors.textSecondary, fontSize: 13, textDecoration: 'none' }}>
            Recuperar ticket
          </a>
        </div>
      </div>
    </div>
  );
}
