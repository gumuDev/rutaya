'use client';

import { useRef, useState } from 'react';
import { Button, Tag, Typography, message, Divider } from 'antd';
import { CopyOutlined, DownloadOutlined, WhatsAppOutlined, CheckOutlined } from '@ant-design/icons';
import { useTranslations } from 'next-intl';
import { toPng } from 'html-to-image';
import { colors } from '@/shared/theme/colors';

const { Text } = Typography;

const statusColors: Record<string, string> = {
  pending_payment: 'red',
  pending: 'orange',
  confirmed: 'green',
  cancelled: 'default',
  expired: 'default',
  boarded: 'blue',
};

// Estructura real que retorna GET /reservations/:code
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

export function DigitalTicket({ data }: { data: TicketData }) {
  const t = useTranslations('ticket');
  const ticketRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

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
    <div style={{ maxWidth: 420, margin: '0 auto', padding: '24px 16px' }}>
      {contextHolder}

      <div ref={ticketRef} style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.12)' }}>

        {/* Header */}
        <div style={{ background: colors.secondary, padding: '20px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ color: '#fff', fontSize: 13, opacity: 0.8 }}>RutaYa</Text>
            <Tag color={statusColors[data.status] ?? 'default'} style={{ margin: 0, fontSize: 12 }}>
              {t(`statuses.${data.status}` as Parameters<typeof t>[0])}
            </Tag>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, display: 'block' }}>ORIGEN</Text>
              <Text style={{ color: '#fff', fontSize: 20, fontWeight: 800 }}>{data.schedule.route.origin}</Text>
            </div>
            <div style={{ fontSize: 24 }}>🚌</div>
            <div style={{ textAlign: 'right' }}>
              <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, display: 'block' }}>DESTINO</Text>
              <Text style={{ color: '#fff', fontSize: 20, fontWeight: 800 }}>{data.schedule.route.destination}</Text>
            </div>
          </div>
        </div>

        {/* Código */}
        <div style={{ background: colors.primary, padding: '12px 24px', textAlign: 'center' }}>
          <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11, letterSpacing: 2 }}>CÓDIGO DE RESERVA</Text>
          <div style={{ fontSize: 32, fontWeight: 900, color: '#fff', letterSpacing: 4, fontFamily: 'monospace' }}>
            {data.code}
          </div>
        </div>

        {/* Línea de corte */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '0 16px' }}>
          <div style={{ width: 20, height: 20, borderRadius: '50%', background: colors.bg, marginLeft: -28 }} />
          <div style={{ flex: 1, borderTop: `2px dashed ${colors.border}`, margin: '0 8px' }} />
          <div style={{ width: 20, height: 20, borderRadius: '50%', background: colors.bg, marginRight: -28 }} />
        </div>

        {/* Detalles */}
        <div style={{ padding: '16px 24px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 16px' }}>
            <div>
              <Text style={{ fontSize: 11, color: colors.textSecondary, display: 'block' }}>{t('departure')}</Text>
              <Text strong style={{ fontSize: 15 }}>{data.schedule.departureTime}</Text>
            </div>
            <div>
              <Text style={{ fontSize: 11, color: colors.textSecondary, display: 'block' }}>{t('company')}</Text>
              <Text strong style={{ fontSize: 15 }}>{data.schedule.company.name}</Text>
            </div>
            <div>
              <Text style={{ fontSize: 11, color: colors.textSecondary, display: 'block' }}>{t('passenger')}</Text>
              <Text strong style={{ fontSize: 15 }}>{data.passengerName}</Text>
            </div>
            <div>
              <Text style={{ fontSize: 11, color: colors.textSecondary, display: 'block' }}>{t('phone')}</Text>
              <Text strong style={{ fontSize: 15 }}>{data.passengerPhone}</Text>
            </div>
            <div>
              <Text style={{ fontSize: 11, color: colors.textSecondary, display: 'block' }}>{t('quantity')}</Text>
              <Text strong style={{ fontSize: 15 }}>{data.quantity} pax</Text>
            </div>
            <div>
              <Text style={{ fontSize: 11, color: colors.textSecondary, display: 'block' }}>{t('total')}</Text>
              <Text strong style={{ fontSize: 15, color: colors.primary }}>Bs. {total.toFixed(2)}</Text>
            </div>
          </div>
        </div>
      </div>

      {/* Acciones */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20 }}>
        <Button type="primary" size="large" icon={copied ? <CheckOutlined /> : <CopyOutlined />} block
          onClick={handleCopy} style={{ background: colors.primary, borderColor: colors.primary, fontWeight: 700 }}>
          {copied ? t('codeCopied') : t('copyCode')}
        </Button>
        <Button size="large" icon={<DownloadOutlined />} block onClick={handleSaveImage}
          style={{ borderColor: colors.secondary, color: colors.secondary, fontWeight: 600 }}>
          {t('saveImage')}
        </Button>
        <Button size="large" icon={<WhatsAppOutlined />} block onClick={handleWhatsApp}
          style={{ background: '#25D366', borderColor: '#25D366', color: '#fff', fontWeight: 600 }}>
          {t('shareWhatsapp')}
        </Button>
        <Divider style={{ margin: '4px 0' }} />
        <Button type="link" href="/" style={{ color: colors.textSecondary }}>← Buscar otro viaje</Button>
        <Button type="link" href="/recover" style={{ color: colors.textSecondary, fontSize: 12 }}>
          ¿Perdiste tu ticket? Recupéralo aquí
        </Button>
      </div>
    </div>
  );
}
